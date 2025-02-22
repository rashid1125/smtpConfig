<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmailController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('login');
});
Route::middleware(['auth', 'verified', 'setUserSession'])->group(function () {
    Route::get('home', function () {
        return redirect('dashboard');
    });
    Route::get('dashboard', [DashboardController::class, 'index']);
    Route::prefix('smtpUser')->group(function () {
        Route::get('/', [EmailController::class, 'index']);
        Route::get('getEmailById', [EmailController::class, 'getEmailById']);
        Route::get('getEmailDataTable', [EmailController::class, 'getEmailDataTable']);
        Route::post('saveEmail', [EmailController::class, 'saveEmail']);
        Route::get('send-otp-email', [EmailController::class, 'sendOtpEmail']);
    });
});