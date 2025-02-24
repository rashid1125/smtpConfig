<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::prefix('smtpUser')->group(function () {
    Route::get('/', [EmailController::class, 'index']);
    Route::get('getEmailById', [EmailController::class, 'getEmailById']);
    Route::get('getEmailDataTable', [EmailController::class, 'getEmailDataTable']);
    Route::post('saveEmail', [EmailController::class, 'saveEmail']);
    Route::post('send-otp-email', [EmailController::class, 'sendOtpEmail']);
})->middleware(['auth:sanctum']);
