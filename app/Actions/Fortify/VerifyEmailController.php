<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class VerifyEmailController extends Controller
{
    public function verify(Request $request, $id, $hash)
    {
        // Find the user by ID or fail with a 404 error
        $user = User::findOrFail($id);

        // Compute the expected hash using the user's email
        $expectedHash = sha1($user->getEmailForVerification());

        // Verify the hash matches the expected value
        if (!hash_equals($hash, $expectedHash)) {
            return abort(404, 'Invalid verification link');
        }

        // Check if the verification link has expired
        // the 'expires' parameter is a timestamp from the request
        $expiresAt = Carbon::createFromTimestamp($request->query('expires'));

        // If the current time is after the expiration time, abort with a 404 error
        if (Carbon::now()->isAfter($expiresAt)) {
            return abort(404, 'Verification link has expired');
        }

        // If the email is already verified, you might want to notify the user or just redirect
        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')->with('status', 'Your email is already verified. Please login.');
        }

        // Mark the user's email as verified
        $user->markEmailAsVerified();

        // Redirect to the login page with a success message
        return redirect()->route('login')->with('status', 'Your email has been verified. Please login.');
    }
}
