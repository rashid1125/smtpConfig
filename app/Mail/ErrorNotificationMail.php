<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Throwable;

class ErrorNotificationMail extends Mailable
{
    use SerializesModels;

    public Throwable $exception;
    public           $subject;

    public function __construct(Throwable $exception, $subject)
    {
        $this->exception = $exception;
        $this->subject   = $subject;
    }

    public function build()
    {
        return $this->subject($this->subject)->markdown('email.error-notification', ['exception' => $this->exception]);
    }
}
