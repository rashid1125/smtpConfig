<?php
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
    protected function runException(\Closure $closure)
    {
        try {
            return $closure();
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    protected function handleException(Exception $e)
    {
        if (! config('app.debug')) {
            // Log the error to ensure it's captured in the logs.
            Log::error($e);
        }
        $statusCode = HttpResponse::HTTP_INTERNAL_SERVER_ERROR; // Default status code for server errors
        // Handle validation exceptions specifically
        if ($e instanceof ValidationException) {
            $statusCode = HttpResponse::HTTP_UNPROCESSABLE_ENTITY; // 422

            return $this->getResponse(false, $statusCode, $e->getMessage(), null, 'danger');
        }
        // Handle query exceptions which include SQL specific errors
        if ($e instanceof QueryException) {
            // Log additional details about the query exception
            Log::error('QueryException: ' . $e->getMessage());

            return $this->getResponse(false, HttpResponse::HTTP_INTERNAL_SERVER_ERROR, $e->getMessage(), null, 'danger');
        }
        // User-defined exceptions for specific user alerts
        if ($e instanceof UserAlertException) {
            return $this->getResponse(false, $e->getCode(), $e->getMessage(), null, $e->getLevel());
        }

        // Generic exception handling
        return $this->getResponse(false, $statusCode, $e->getMessage(), null, 'danger');
    }

    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\Response|mixed
     */
    protected function runExceptionPrint(Closure $closure)
    {
        try {
            return $closure();
        } catch (Exception $exception) {
            return $this->handelPrintException($exception);
        }
    }

    /**
     * Function handelPrintException
     *
     * @param \Exception $exception
     *
     * @return \Illuminate\Contracts\View\View
     */
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
