<?php

namespace App\Http\Livewire;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Actions\ConfirmTwoFactorAuthentication;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use Laravel\Fortify\Actions\EnableTwoFactorAuthentication;
use Laravel\Fortify\Actions\GenerateNewRecoveryCodes;
use Illuminate\Support\Facades\Validator;
use Livewire\Component;

class TwoFactorForm extends Component
{
    public $showQrCode            = false;
    public $showVerifyCodeScreen  = false;
    public $showSecretKey         = false;
    public $showRecoveryCodes     = false;
    public $disableAuthentication = false;
    public $code;
    public function showRecoveryCodes()
    {
        $this->showRecoveryCodes = true;
    }
    public function getUserProperty()
    {
        return Auth::user();
    }
    public function enableTwoFactorAuth(EnableTwoFactorAuthentication $enable)
    {
        $enable(Auth::user());
        $this->showQrCode           = true;
        $this->showSecretKey        = true;
        $this->showVerifyCodeScreen = true;
    }
    public function confirmTwoFactorAuth(ConfirmTwoFactorAuthentication $confirmAction)
    {
        // Validate the $code parameter
        $validator = Validator::make(
            ['code' => $this->code],
            ['code' => 'required']
        );

        // Check if validation fails
        if ($validator->fails()) {
            $this->addError('code', 'The code field is required.');
            return;
        }

        // If validation passes, invoke the ConfirmTwoFactorAuthentication action
        $confirmAction(Auth::user(), $this->code);
        $this->showVerifyCodeScreen  = false;
        $this->showQrCode            = false;
        $this->showSecretKey         = false;
        $this->disableAuthentication = true;
    }

    public function disableTwoFactorAuth(DisableTwoFactorAuthentication $disable)
    {
        $disable(Auth::user());
    }
    public function regenerateRecoveryCodes(GenerateNewRecoveryCodes $generate)
    {
        $generate(Auth::user());

        $this->showRecoveryCodes = true;
    }
    public function render()
    {
        $user = Auth::user();
        $this->disableAuthentication = ($user->two_factor_confirmed_at !=="" && $user->two_factor_confirmed_at!==null);
        return view('livewire.two-factor-form');
    }
}
