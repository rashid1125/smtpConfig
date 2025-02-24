<?php
namespace App\Traits;

use App\Exceptions\UserAlertException;
use Illuminate\Support\Facades\Validator;

trait DataValidationTrait
{
    /**
     * Validates the given data against the specified rules.
     * Throws an exception if validation fails.
     *
     * @param array $data     The data to be validated.
     * @param array $rules    The validation rules.
     * @param array $messages Custom error messages for validation rules.
     *
     * @throws UserAlertException If validation fails.
     */
    public function validateData(array $data, array $rules, array $messages = []): void
    {
        $validator = Validator::make($data, $rules, $messages);
        if ($validator->fails()) {
            $errors       = $validator->errors()->all();
            $errorMessage = implode("<br />", $errors);
            throw new UserAlertException($errorMessage, 422);
        }
    }
}
