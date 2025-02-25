<?php
namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\File;
use Illuminate\Mail\Markdown;

class TokenExpiredMail extends Mailable
{
    public string $emailSubject;
    public string $message;
    public string $username;

    public function __construct($subject, $message,$username)
    {
        $this->emailSubject = $subject;
        $this->message      = $message;
        $this->username     = $username;
    }

    public function build(): TokenExpiredMail
    {
        return $this->markdown('emails.tokenExpiredMail')->subject($this->emailSubject)->with(
            [
                'message' => $this->message,
                'username' => $this->username
            ]
        );
    }
}