<?php
/**
 * class EmailController
 *
 * @package   App\Http\Controllers
 *
 * @author    Rashid Rasheed <rashidrasheed1125@gmail.com>
 *
 * @copyright Digitalsofts (DS)
 * @version   1.0
 */
namespace App\Http\Controllers;

use App\DataTables\EmailDataTable;
use App\Exceptions\UserAlertException;
use App\Mail\OtpMail;
use App\Mail\TokenExpiredMail;
use App\Models\Email;
use App\Models\OtpDomain;
use App\Traits\FunctionsTrait;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\Response;

class EmailController extends Controller
{
    use FunctionsTrait;

    public function __construct()
    {
        $this->initializeUserSessionContext();
    }

    /**
     * Function index
     *
     * @return \Illuminate\Contracts\View\View|\Illuminate\Foundation\Application|\Illuminate\Contracts\View\Factory
     */
    public function index()
    {
        $data['modules'] = ['user/add_smtp'];
        $data['title']   = 'Add Email SMTP';
        $data['domains'] = OtpDomain::all();
        $data['header']  = view('layouts.header', $data);
        $data['content'] = view('user.add_smtp', $data);
        $data['mainnav'] = view('layouts.mainnav', $data);
        $data['footer']  = view('layouts.footer', $data);

        return view('layouts.default', $data);
    }

    /**
     * Function saveEmail
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse|bool|array
     */
    public function saveEmail(Request $request): JsonResponse
    {
        $result = $this->runTransaction(function () use ($request) {
            $emailObject = json_decode($request->input('emailObject'), true);
            $emailId     = $this->getPrimaryKeyValueIfPresent($emailObject, Email::tableKey());
            if (isset($emailObject[Email::EMAIL_PASSWORD]) && ! empty($emailObject[Email::EMAIL_PASSWORD])) {
                $emailObject[Email::EMAIL_PASSWORD] = Crypt::encryptString($emailObject[Email::EMAIL_PASSWORD]);
            }
            $this->setDataBaseTableDefaultValues($emailObject, Email::class);
            $this->ValidatorByObject($emailObject, new Email(), $emailObject);
            $existingItem = Email::where([Email::EMAIL_USERNAME => $emailObject[Email::EMAIL_USERNAME]])->where(Email::EMAIL_ID, '<>', $emailId)->first();
            if ($existingItem && $existingItem->id !== $emailId) {
                throw new UserAlertException('The name has already been taken.', Response::HTTP_FAILED_DEPENDENCY);
            }

            return Email::updateOrCreate(
                ['id' => $emailId],
                $emailObject
            );
        });

        return $this->generateResponse($result, "Email successfully", "Email failed");
    }

    /**
     * Function getEmailById
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse|bool|array
     */
    public function getEmailById(Request $request): JsonResponse
    {
        $result = $this->runException(function () use ($request) {
            $emailId = $request->input('emailId');
            $result  = Email::where([Email::EMAIL_ID => $emailId])->first();
            if (empty($result)) {
                throw new UserAlertException('Email not found', 404);
            }

            return $result;
        });

        return $this->generateResponse($result, "Email successfully", "Email no record");
    }

    /**
     * Function getEmailDataTable
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse|bool|array
     */
    public function getEmailDataTable(Request $request): JsonResponse
    {
        $result = $this->runException(function () use ($request) {
            $companyId      = $this->getCompanyId();
            $searchValue    = $request->input('search.value');
            $brandDataTable = new EmailDataTable($companyId, $searchValue);
            $query          = $brandDataTable->query(new Email());

            return $brandDataTable->dataTable($query)->toJson();
        });

        return $this->generateResponse($result, "Email data table successfully", "Email no record", true);
    }

    /**
     * Function sendOtpEmail
     *
     * @param \Illuminate\Http\Request $request
     *
     * @throws \App\Exceptions\UserAlertException
     *
     * @return \Illuminate\Http\JsonResponse|bool|array
     */
    public function sendOtpEmail(Request $request): JsonResponse
    {
        $result = $this->runException(function () use ($request) {
            $validated = $request->validate(
                [
                    'domainUrl'   => 'required|url',
                    'otpUsername' => 'required|string|max:255',
                    'otpCompany'  => 'required|string|max:255',
                    'otpTime'     => 'required|integer|min:1',
                    'otpCode'     => 'required|string|max:4',
                    'otpEmail'    => 'required|string|email'
                ]
            );
            $otpEmail  = filter_var($validated['otpEmail'], FILTER_SANITIZE_EMAIL);
            self::verifyEmail(self::checkEmailArrayOrstring($otpEmail));
            $domainUrl = $validated['domainUrl'];
            $domain    = OtpDomain::where([OtpDomain::OTP_DOMAIN_URL => $domainUrl])->first();
            if (! $domain) {
                throw new UserAlertException('Domain not found', 404);
            }
            $emails = DB::table('emails')->whereRaw('find_in_set(?, trim(domain_ids))', [trim($domain->id)])->get();
            if ($emails->isEmpty()) {
                throw new UserAlertException('Email not found', 404);
            }
            $emailSent = false;
            foreach ($emails as $email) {
                $host                = $email->host;
                $port                = $email->port;
                $from_email          = $email->from_email;
                $username            = $email->username;
                $passwordLastUpdated = $email->updated_at ?? $email->created_at;
                if (now()->diffInDays($passwordLastUpdated) >= 14) {
                    $message = "Email password for $username is about to expire";
                    $this->sendEmail('Email Password Expiry', $message, $username);
                    continue;
                }
                $password = Crypt::decryptString($email->password);
                if (empty($password)) {
                    Log::error('Email password not found for ' . $username);
                    throw new UserAlertException('Email password not found', 404);
                }
                $encryption = $email->encryption;
                $mailerName = 'custom_' . $email->id;
                Config::set('mail.mailers.' . $mailerName, [
                    'transport'  => 'smtp',
                    'host'       => $host,
                    'port'       => $port,
                    'username'   => $username,
                    'password'   => $password,
                    'encryption' => $encryption,
                    'from'       => ['address' => $from_email, 'name' => $from_email],
                ]);
                try {
                    $mailable = new OtpMail($validated['otpUsername'], $validated['otpCompany'], $validated['otpTime'], $validated['otpCode']);
                    Mail::mailer($mailerName)->to($otpEmail)->send($mailable);
                    $emailSent = true;
                    break;
                } catch (Exception $e) {
                    Log::error('Email sending failed for ' . $username . ' with error: ' . $e->getMessage());
                }
            }
            if (! $emailSent) {
                Log::error('Email not sent with any configuration');
                throw new UserAlertException('Email not sent with any configuration', 400);
            }
            $user = $request->user();
            $user->tokens()->delete();

            return true;
        });

        return $this->generateResponse($result, "OTP sent successfully", "OTP failed");
    }

    /**
     * Function checkEmailArrayOrString
     *
     * @param string|array $otpEmail
     *
     * @throws \App\Exceptions\UserAlertException
     *
     * @return array
     */
    private static function checkEmailArrayOrString($otpEmail): array
    {
        if (empty($otpEmail)) {
            throw new UserAlertException('Email list cannot be empty', 400);
        }
        if (is_array($otpEmail)) {
            return $otpEmail;
        }

        return explode(',', $otpEmail);
    }

    private function sendEmail(string $subject, string $message, $username)
    {
        $mailable = new TokenExpiredMail($subject, $message, $username);
        Mail::to(['developer@digitalsofts.com', 'asimdigitals@outlook.com'])->send($mailable);
    }
}