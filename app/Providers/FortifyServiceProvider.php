<?php
namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Models\Company;
use App\Models\SettingConfiguration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Function register
     */
    public function register(): void
    {
        //
    }

    /**
     * Function boot
     */
    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::loginView(function () {
            return view('auth.login');
        });
        Fortify::authenticateUsing(function (Request $request) {
            $user = User::where('email', $request->email)->orWhere('username', $request->email)->first();
            if ($user == null) {
                throw ValidationException::withMessages([
                                                            'login_error' => ['No record in our match. Please contact administrator.'],
                                                        ]);
            }
            $this->ensureUserIsAllowedCompany($user);
            if (! Hash::check($request->password, $user->password)) {
                $user->increment('failed_attempts');
            }
            $maxFailedAttempts = SettingConfiguration::value(SettingConfiguration::FAILED_ATTEMPTS);
            $remainingAttempts = ($maxFailedAttempts - $user->failed_attempts);
            if (($user->failed_attempts >= $maxFailedAttempts)) {
                $this->sendMailToBlockUser($user);
                throw ValidationException::withMessages([
                                                            'login_error' => ['User Has Been Blocked. Please Contact Administrator'],
                                                        ]);
            }
            session(['selected_financial_year' => $request->financialyear_id]);
            if (Hash::check($request->password, $user->password)) {
                $user->update(['failed_attempts' => 0]);

                return $user;
            }
            if ($remainingAttempts < 3) {
                throw ValidationException::withMessages([
                                                            'login_error' => ["Remaining Attempts:  <span class='badge badge-warning'>{$remainingAttempts}</span>. Your account will be blocked after wrong remaining attempts."]
                                                        ]);
            }
        });
        Fortify::registerView(function () {
            return view('auth.register');
        });
        Fortify::requestPasswordResetLinkView(function () {
            return view('auth.forgot-password');
        });
        Fortify::resetPasswordView(function (Request $request) {
            return view('auth.reset-password', [
                'request' => $request
            ]);
        });
        Fortify::verifyEmailView(function () {
            return view('auth.verify-email');
        });
        Fortify::twoFactorChallengeView(function () {
            return view('auth.two-factor-challenge');
        });
    }

    /**
     * Function ensureUserIsAllowedCompany
     *
     * @param \App\Models\User $user
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    private function ensureUserIsAllowedCompany(User $user): void
    {
        $companyRecord = Company::where([Company::COMPANY_ID => $user->company_id])->first();
        if (! $companyRecord) {
            throw ValidationException::withMessages([
                                                        'login_error' => ['No record in our match. Please contact administrator.'],
                                                    ]);
        }
        if ($companyRecord->{Company::COMPANY_STATUS} == 0) {
            throw ValidationException::withMessages([
                                                        'login_error' => ['Your business account has been disabled.<br>Please Contact SR support team.'],
                                                    ]);
        } else {
            if (strtotime($companyRecord->{Company::COMPANY_EXPIRY_DATE}) < strtotime(date('Y-m-d'))) {
                throw ValidationException::withMessages([
                                                            'login_error' => ['Your subscription has been expired.<br>Please Contact SR support team to renew your subscription.'],
                                                        ]);
            }
        }
    }

    /**
     * Function sendMailToBlockUser
     *
     * @param \App\Models\User $user
     */
    private function sendMailToBlockUser(User $user): void
    {
        $reportToUserId = User::find($user->user_report_to_id);
        $companyRecord  = Company::find($user->company_id);
        $sendingEmail   = ($reportToUserId->email) ? $reportToUserId->email : $companyRecord->email;
        $data           = [
            'msg'      => 'User has been blocked. Please Contact Administrator',
            'subject'  => 'User Block',
            'username' => $user->name
        ];
        $data['from']   = env("MAIL_FROM_ADDRESS");
        $data['to']     = $sendingEmail;
        Mail::send('email.user_block', $data, function ($message) use ($data) {
            $message->to([$data['to']])->from($data['from'])->subject($data['subject']);
        });
        // Check for failed ones
        $failedEmails = Mail::failures();
        if (! empty($failedEmails)) {
            return;
        }
    }
}