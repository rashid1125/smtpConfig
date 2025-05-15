<?php

namespace App\Console\Commands;

use App\Mail\TokenExpiredMail;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class CheckEmailPasswordExpiry extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'emails:check-password-expiry';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for email passwords that will expire tomorrow and send notifications';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Checking for email passwords that will expire tomorrow...');
        
        // Set expiry parameters
        $expiryDays = 14; // Same as in sendOtpEmail
        $notifyBeforeDays = 1; // Notify 1 day before expiry
        
        // Get all emails
        $emails = DB::table('emails')->get();
        
        $notificationsSent = 0;
        
        foreach ($emails as $email) {
            try {
                $username = $email->username;
                $passwordLastUpdated = $email->updated_at ?? $email->created_at;
                $daysSinceUpdate = now()->diffInDays($passwordLastUpdated);
                
                // Check if password expires tomorrow
                if ($daysSinceUpdate == ($expiryDays - $notifyBeforeDays)) {
                    $this->info("Email password for $username will expire tomorrow. Sending notification...");
                    
                    // Setup mailer configuration
                    $host = $email->host;
                    $port = $email->port;
                    $from_email = $email->from_email;
                    $password = Crypt::decryptString($email->password);
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
                    
                    // Send notification email
                    $message = "Email password for $username is about to expire tomorrow";
                    $mailable = new TokenExpiredMail('Email Password Expiry', $message, $username);
                    
                    // Send to the email owner/administrator
                    Mail::mailer($mailerName)->to($from_email)->send($mailable);
                    
                    $this->info("Notification sent to $from_email for $username");
                    $notificationsSent++;
                }
            } catch (Exception $e) {
                $this->error("Error processing email $username: " . $e->getMessage());
                Log::error("Failed to process email password expiry for $username: " . $e->getMessage());
            }
        }
        
        $this->info("Completed. Sent $notificationsSent password expiry notifications.");
        return 0;
    }
}
