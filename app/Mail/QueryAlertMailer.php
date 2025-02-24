<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
class QueryAlertMailer extends Mailable
{
    use Queueable, SerializesModels;

    public $logMessage;
    public $subject;
    public $query;
    public $requestUrl;

    public function __construct($logMessage, $subject, $query, $requestUrl)
    {
        $this->logMessage = $logMessage;
        $this->subject    = $subject;
        $this->query      = $query;
        $this->requestUrl = $requestUrl;
    }

    public function build()
    {
        return $this->subject($this->subject)
            ->markdown('email.slow-query-alert', [
                'logMessage' => $this->logMessage,
                'query'      => $this->query,
                'requestUrl' => $this->requestUrl
            ]);
    }
}
