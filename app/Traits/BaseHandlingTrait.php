<?php
namespace App\Traits;

use App\Exceptions\UserAlertException;
use App\Models\SettingConfiguration;
use Carbon\Carbon;
use Carbon\Exceptions\BadMethodCallException;
use Closure;
use ErrorException;
use Exception;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Database\QueryException;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use RuntimeException;
use Swift_TransportException;
use Symfony\Component\HttpFoundation\Response as HttpResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Trait BaseHandlingTrait
 *
 * Provides a collection of methods to handle transactions, exceptions, and data manipulations.
 */
trait BaseHandlingTrait
{
    use CanGetTableNameStatically, LedgerDetailsTrait, DataValidationTrait, DynamicOptionTrait, ExceptionHandlingTrait, GetterSetterTrait, SupervisionTrait;

    /**
     * Function runTransaction
     *
     * @param \Closure $closure
     *
     * @return array|mixed
     */
    protected function runTransaction(Closure $closure)
    {
        DB::beginTransaction();
        try {
            $return = $closure();
            if (! validateValue($return)) {
                DB::rollBack();
                throw new UserAlertException('Failed to save data.', 500);
            }
            DB::commit();

            return $return;
        } catch (Exception $e) {
            DB::rollBack();

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
    private function handleException(Exception $e): array
    {
        if (! config('app.debug')) {
            Log::error($e);
        }
        $statusCode = HttpResponse::HTTP_INTERNAL_SERVER_ERROR;
        if ($e instanceof RequestException) {
            $statusCode = $e->getCode() ? : $statusCode;

            return $this->getResponse(false, $statusCode, $e->getMessage(), null, 'danger', $e->getMessage(), $e->getTrace());
        }
        if ($e instanceof RuntimeException) {
            return $this->getResponse(false, $statusCode, $e->getMessage(), null, 'danger', $e->getMessage(), $e->getTrace());
        }
        if ($e instanceof ValidationException) {
            $statusCode = HttpResponse::HTTP_UNPROCESSABLE_ENTITY;

            return $this->getResponse(false, $statusCode, $e->getMessage(), null, 'danger', $e->errors(), $e->getTrace());
        }
        if ($e instanceof QueryException) {
            Log::error("QueryException: " . $e->getMessage());

            return $this->getResponse(false, HttpResponse::HTTP_INTERNAL_SERVER_ERROR, $e->errorInfo[2], null, 'danger', $e->errorInfo, $e->getTrace());
        }
        if ($e instanceof HttpException || $e instanceof TokenMismatchException) {
            $message    = $e instanceof TokenMismatchException ? "CSRF token mismatch. Please refresh the page and try again." : $e->getMessage();
            $statusCode = $e instanceof HttpException ? $e->getStatusCode() : 500;

            return $this->getResponse(false, $statusCode, $message, null, 'danger', $e->getMessage(), $e->getTrace());
        }
        if ($e instanceof Swift_TransportException) {
            return $this->getResponse(false, $statusCode, $e->getMessage(), null, 'danger', $e->getMessage(), $e->getTrace());
        }
        if ($e instanceof UserAlertException) {
            $statusCode = $e->getCode() ?? 422;

            return $this->getResponse(false, $statusCode, $e->getMessage(), null, $e->getLevel(), $e->errors(), $e->getTrace());
        }
        if ($e instanceof ErrorException) {
            return $this->getResponse(false, $statusCode, $e->getMessage(), null, 'danger', $e->getFile(), $e->getTrace());
        }
        if ($e instanceof BadMethodCallException) {
            return $this->getResponse(false, HttpResponse::HTTP_NOT_IMPLEMENTED, 'Method Not Implemented', null, 'danger', $e->getMessage(), $e->getTrace());
        }
        $handler = app(ExceptionHandler::class);
        app()->call([$handler, 'report'], ['exception' => $e]);

        return $this->getResponse(false, $statusCode, $e->getMessage(), null, 'danger', $e->getLine(), $e->getTrace());
    }

    /**
     * Function getResponse
     *
     * @param bool       $status
     * @param int        $statusCode
     * @param string     $message
     * @param mixed      $data
     * @param string     $level
     * @param mixed      $error
     * @param array|null $trace
     *
     * @return array
     */
    protected function getResponse(bool $status, int $statusCode, string $message, $data = null, string $level = 'error', $error = null, ?array $trace = []): array
    {
        $response = [
            'status'     => $status,
            'statusCode' => $statusCode,
            'message'    => $message,
        ];
        if ($data !== null) {
            $response['data'] = $data;
        }
        if (! $status) {
            $response['level'] = $level;
        }
        if ($error !== null) {
            $response['error'] = $error;
        }
        $response['trace'] = [];
        if (config('app.debug_trace')) {
            $response['trace'] = $trace;
        }

        return $response;
    }

    /**
     * Function generateResponse
     *
     * @param           $result
     * @param           $message
     * @param           $messageFailed
     * @param bool|null $isDataTable
     * @param array     $props
     *
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    protected function generateResponse($result, $message = null, $messageFailed = null, ?bool $isDataTable = false, array $props = [])
    {
        if (is_array($result) && isset($result['statusCode'])) {
            $response = $result;
        } else {
            if (is_bool($messageFailed)) {
                $isDataTable   = $messageFailed;
                $messageFailed = null;
            }
            if ($isDataTable) {
                return $result;
            }
            if (is_object($result)) {
                if (method_exists($result, 'toArray')) {
                    $result = $result->toArray();
                } else {
                    $result = (array)$result;
                }
            }
            if (! empty($props)) {
                $result = array_merge($result, $props);
            }
            $response = $this->getResponse(true, 200, $message ?? 'Operation completed successfully', $result);
        }

        return response()->json($response, $response['statusCode'] ?? HttpResponse::HTTP_FAILED_DEPENDENCY);
    }

    /**
     * Parses a date string to a standard format.
     *
     * @param string|null $date The date string to be parsed.
     *
     * @return string|null Formatted date or null if input is null.
     */
    protected function parseDate(?string $date): ?string
    {
        return $date ? Carbon::parse($date)->format('Y-m-d') : null;
    }

    /**
     * Formats a date according to the configured or default format.
     *
     * @param string|null $date The date string to be formatted.
     *
     * @throws UserAlertException If the date input is null or not a string.
     * @return string Formatted date string.
     */
    protected function getFormatedDate(?string $date): ?string
    {
        if (is_null($date)) {
            throw new UserAlertException('Date cannot be null.');
        }
        if (! is_string($date)) {
            throw new UserAlertException('Date must be a string.');
        }
        try {
            $format = SettingConfiguration::query()->first('date_format_php')->date_format_php ?? 'Y-m-d';

            return Carbon::parse($date)->format($format);
        } catch (InvalidArgumentException $e) {
            throw new UserAlertException('Invalid date format: ' . $e->getMessage());
        } catch (Exception $e) { // Catch-all for any other exceptions
            throw new UserAlertException('Failed to parse date: ' . $e->getMessage());
        }
    }

    /**
     * Function numVal
     *
     * @param     $val
     * @param int $rounding
     *
     * @return float
     */
    protected function numVal($val, int $rounding = 0): float
    {
        return round(floatval($val), $rounding);
    }

    /**
     * Generate a response array for error handling.
     *
     * @param bool              $success Indicator of the operation's success status.
     * @param string            $message Descriptive message about the operation.
     * @param mixed             $data    Additional data to return in the response.
     * @param string|array|null $error   Error information or messages.
     * @param array             $trace   Optional stack trace information, primarily for debugging.
     *
     * @deprecated version 1.0.0
     * @return array Structured response array.
     */
    protected function getReturnResponse(bool $success, string $message, $data = null, $error = null, array $trace = [], array $options = []): array
    {
        $response          = [
            'status'  => $success,
            'message' => $message,
            'data'    => $data,
            'error'   => $error
        ];
        $response['trace'] = [];
        if (config('app.debug_trace')) {
            $response['trace'] = $trace;
        }
        // Any additional keys provided in options array can be included as well
        foreach ($options as $key => $value) {
            // Ensure we don't overwrite already set keys
            if (! in_array($key, ['error', 'trace'])) {
                $response[$key] = $value;
            }
        }

        return $response;
    }
}
