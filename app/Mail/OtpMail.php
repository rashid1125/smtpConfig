<?php
namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\File;
use Illuminate\Mail\Markdown;

class OtpMail extends Mailable
{
    public string $otpUsername;
    public string $otpCompany;
    public int    $otpTime;
    public int    $otpCode;

    /**
     * @param string $otpUsername
     * @param string $otpCompany
     * @param int    $otpTime
     * @param int    $otpCode
     */
    public function __construct(string $otpUsername, string $otpCompany, int $otpTime, int $otpCode)
    {
        $this->otpUsername = $otpUsername;
        $this->otpCompany  = $otpCompany;
        $this->otpTime     = $otpTime;
        $this->otpCode     = $otpCode;
    }

    /**
     * Function build
     *
     * @return \App\Mail\OtpMail
     */
    public function build(): OtpMail
    {
        return $this->markdown('emails.otpcode')->subject('OTP Code' . $this->otpCode)->with(
            [
                'otpUsername' => $this->otpUsername,
                'otpCompany'  => $this->otpCompany,
                'otpTime'     => $this->otpTime,
                'otpCode'     => $this->otpCode,
            ]
        );
    }
}
