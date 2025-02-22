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
    /** @var array $dontReport */
    protected $dontReport = [];
    /** @var string[] $dontFlash */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Function register
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // ...
        });
    }

    /**
     * Function report
     *
     * @param \Throwable $e
     *
     * @throws \Throwable
     */
    public function report(Throwable $e): void
    {
        if ($this->shouldReport($e) && ! config('app.debug')) {
            if ($e instanceof ParseError) {
                $subject = 'Sk - Syntax Error Occurred';
            } else {
                $subject = 'Sk - Exception Occurred';
            }
            // Send email
            $this->sendEmail($e, $subject);
        }
        parent::report($e);
    }

    /**
     * Function sendEmail
     *
     * @param \Throwable $exception
     * @param            $subject
     */
    public function sendEmail(Throwable $exception, $subject = null): void
    {
        try {
            if (is_null($subject)) {
                $subject = env('APP_NAME') ?? env('APP_NAME') . ' - Exception Occurred';
            }
            $recipients = ['rashidrasheed1125@gmail.com'];
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
     * @param \Throwable $e
     *
     * @throws \Throwable
     *
     * @return \Illuminate\Http\JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function render($request, Throwable $e): \Illuminate\Http\JsonResponse | \Symfony\Component\HttpFoundation\Response
    {
        if ($e instanceof TokenMismatchException) {
            return response()->json(['message' => 'Your session has expired. Please refresh the page and try again.'], 419);
        }

        return parent::render($request, $e);
    }
}
