<?php
namespace App\Exceptions;

use App\Mail\ErrorNotificationMail;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use ParseError;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [];
    protected $dontFlash  = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register()
    {
        $this->reportable(function (Throwable $e) {
            // ...
        });
    }

    /**
     * Function report
     *
     * @param \Throwable $exception
     *
     * @throws \Throwable
     * @return void
     */
    public function report(Throwable $exception)
    {
        if ($this->shouldReport($exception) && ! config('app.debug')) {
            // Check if it's a syntax error
            if ($exception instanceof ParseError) {
                $subject = 'Sk - Syntax Error Occurred';
            } else {
                $subject = 'Sk - Exception Occurred';
            }
            // Send email
            $this->sendEmail($exception, $subject);
        }
        parent::report($exception);
    }

    /**
     * Function sendEmail
     *
     * @param \Throwable $exception
     * @param            $subject
     *
     * @return void
     */
    public function sendEmail(Throwable $exception, $subject = null)
    {
        try {
            if (is_null($subject)) {
                $subject = env('APP_NAME') ?? env('APP_NAME') . ' - Exception Occurred';
            }
            $recipients = ['digitalm.otp@gmail.com'];
            foreach ($recipients as $recipient) {
                $errorMail = new ErrorNotificationMail($exception, $subject, 'error');
                Mail::to($recipient)->send($errorMail);
            }
            if ($exception instanceof ParseError) {
                Log::error('ParseError: ' . $exception->getMessage());
            }
        } catch (Throwable $exception) {
            Log::error($exception);
        }
    }

    /**
     * Function render
     *
     * @param            $request
     * @param \Throwable $exception
     *
     * @throws \Throwable
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response|\Symfony\Component\HttpFoundation\Response
     */
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof TokenMismatchException) {
            return response()->json(['message' => 'Your session has expired. Please refresh the page and try again.'], 419);
        }

        return parent::render($request, $exception);
    }
}
