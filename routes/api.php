<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::middleware(['auth:sanctum'])->prefix('smtpUser')->group(function () { // Middleware applied *before* the group
    Route::get('/', [EmailController::class, 'index']);
    Route::get('getEmailById', [EmailController::class, 'getEmailById']);
    Route::get('getEmailDataTable', [EmailController::class, 'getEmailDataTable']);
    Route::post('saveEmail', [EmailController::class, 'saveEmail']);
    Route::post('send-otp-email', [EmailController::class, 'sendOtpEmail']);
});