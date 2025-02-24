<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailSendAsAttachment extends Mailable
{
    use Queueable, SerializesModels;
    public $attachmentPath;
    public $subject;
    public $title;
    public $sender;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($attachmentPath, $subject, $title, $sender)
    {
        $this->attachmentPath = $attachmentPath;
        $this->subject        = $subject;
        $this->title          = $title;
        $this->sender         = $sender;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->subject)
            ->view('email.attachmentPDF')
            ->attach($this->attachmentPath, [
                'as'   => $this->title . '.pdf',
                'mime' => 'application/pdf',
            ]);
    }
}
