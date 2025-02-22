<?php
namespace App\Exceptions;

use Exception;

/**
 * Custom exception class for user alerts.
 *
 * This class extends the base Exception class to provide additional
 * functionality for handling user alerts with different levels and error data.
 */
class UserAlertException extends Exception
{
    protected string $level;
    protected mixed  $error;

    /**
     * Constructor for the UserAlertException class.
     *
     * @param string         $message  The exception message.
     * @param int            $code     The exception code.
     * @param mixed          $error    Additional error data (optional).
     * @param string         $level    The severity level of the alert (default: "danger").
     * @param Exception|null $previous The previous exception for exception chaining (optional).
     */
    public function __construct(
        string    $message = "",
        int       $code = 0,
                  $error = null,
        string    $level = "danger",
        Exception $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        $this->level = $level;
        $this->error = $error;
    }

    /**
     * Get the severity level of the alert.
     *
     * @return string The severity level.
     */
    public function getLevel(): string
    {
        return $this->level;
    }

    /**
     * Get the additional error data.
     *
     * @return mixed The error data.
     */
    public function getData()
    {
        return $this->error;
    }

    /**
     * Alias for getData() to maintain backward compatibility.
     *
     * @return mixed The error data.
     */
    public function errors()
    {
        return $this->error;
    }
}
