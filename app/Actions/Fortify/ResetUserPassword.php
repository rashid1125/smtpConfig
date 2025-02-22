<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\ResetsUserPasswords;

/**
 * Class ResetUserPassword
 *
 * This class handles the resetting of user passwords.
 */
class ResetUserPassword implements ResetsUserPasswords
{
    use PasswordValidationRules;

    /**
     * Reset the given user's password.
     *
     * This method validates the input password according to the defined rules,
     * and then updates the user's password in the database.
     *
     * @param User  $user  The user whose password is being reset.
     * @param array $input The input data containing the new password.
     *
     * @return void
     * @throws \Illuminate\Validation\ValidationException
     */
    public function reset( User $user, array $input ): void
    {
        Validator::make($input, [
            'password' => $this->passwordRules(),
        ])->validate();

        $user->forceFill([
            'password' => $input['password'],
        ])->save();
    }
}