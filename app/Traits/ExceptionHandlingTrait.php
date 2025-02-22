<?php
/**
 * File ExceptionHandlingTrait
 *
 * @package   App\Traits
 *
 * @author    Rashid Rasheed <rashidrasheed1125@gmail.com>
 *
 * @copyright Shahid & Rashid (SR)
 * @version   1.0
 */
declare(strict_types = 1);
namespace App\Traits;

use App\Exceptions\UserAlertException;
use Closure;
use Exception;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Contracts\View\View;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

trait ExceptionHandlingTrait
{
    protected function runException(Closure $closure)
    {
        try {
            return $closure();
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Function handleException
     *
     * @param \Exception $e
     *
     * @return array
     */
    protected function handleException(Exception $e): array
    {
        if (! config('app.debug')) {
            Log::error($e->getMessage(), $e->getTrace());
        }
        $statusCode = HttpResponse::HTTP_INTERNAL_SERVER_ERROR;
        if ($e instanceof ValidationException) {
            $statusCode = HttpResponse::HTTP_BAD_REQUEST;

            return $this->getResponse(false, $statusCode, $e->getMessage(), null, 'danger');
        }
        if ($e instanceof QueryException) {
            Log::error('QueryException: ' . $e->getMessage(), $e->getTrace());

            return $this->getResponse(false, HttpResponse::HTTP_INTERNAL_SERVER_ERROR, $e->getMessage(), null, 'danger');
        }
        if ($e instanceof UserAlertException) {
            return $this->getResponse(false, $e->getCode(), $e->getMessage(), null, $e->getLevel());
        }

        return $this->getResponse(false, $statusCode, $e->getMessage(), null, 'danger');
    }

    protected function runExceptionPrint(Closure $closure)
    {
        try {
            return $closure();
        } catch (Exception $exception) {
            return $this->handelPrintException($exception);
        }
    }

    private function handelPrintException(Exception $exception): View
    {
        if (config('app.debug')) {
            return view('error', ['exception' => $exception, 'errorMessage' => $exception]);
        }
        Log::error($exception);
        $handler = app(ExceptionHandler::class);
        app()->call([$handler, 'report'], ['exception' => $exception]);
        abort(500, 'An error occurred. Please try again later.');
    }

    protected function makeExceptionResponse(Exception $e): array
    {
        return ['exception' => $e];
    }
}
