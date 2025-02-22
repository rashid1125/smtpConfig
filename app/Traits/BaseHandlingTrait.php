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
use App\Models\SettingConfiguration;
use BadMethodCallException;
use Carbon\Carbon;
use Closure;
use ErrorException;
use Exception;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use JetBrains\PhpStorm\ArrayShape;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

trait BaseHandlingTrait
{
    use CanGetTableNameStatically, DetailTableDataHandlerTrait, LedgerDetailsTrait, DataValidationTrait, DynamicOptionTrait, ExceptionHandlingTrait, GetterSetterTrait, SupervisionTrait;

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
        $statusCode = HttpResponse::HTTP_BAD_REQUEST;
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
        if ($e instanceof TokenMismatchException) {
            $message = $e->getMessage() ?? "CSRF token mismatch. Please refresh the page and try again.";

            return $this->getResponse(false, $statusCode, $message, null, 'danger', $e->getMessage(), $e->getTrace());
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
     * @param bool                   $status
     * @param int                    $statusCode
     * @param mixed                  $message
     * @param array|object|bool|null $data
     * @param string                 $level
     * @param                        $error
     * @param array|null             $trace
     *
     * @return array
     */
    #[ArrayShape(['status' => "bool", 'statusCode' => "int", 'message' => "mixed", 'trace' => "array|null", 'error' => "mixed", 'level' => "string", 'data' => "array|bool|object"])]
    protected function getResponse(
        bool                         $status,
        int                          $statusCode,
        mixed                        $message,
        array | object | bool | null $data = null,
        string                       $level = 'error',
                                     $error = null,
        ?array                       $trace = []
    ): array {
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
     * @param bool|array|object $result
     * @param string|null       $message
     * @param null              $messageFailed
     * @param bool|null         $isDataTable
     * @param array             $props
     *
     * @return \Illuminate\Http\JsonResponse|bool|array
     */
    protected function generateResponse(bool | array | object $result, string $message = null, $messageFailed = null, ?bool $isDataTable = false, array $props = []): JsonResponse | bool | array
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
            $response = $this->getResponse(true, 200, $message ?? $messageFailed ?? 'Operation completed successfully', $result);
        }

        return response()->json($response, $response['statusCode']);
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
     * Function getFormatedDate
     *
     * @param string|null $date
     *
     * @throws \App\Exceptions\UserAlertException
     *
     * @return string|null
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
    protected function getReturnResponse(bool $success, string $message, mixed $data = null, mixed $error = null, array $trace = [], array $options = []): array
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
