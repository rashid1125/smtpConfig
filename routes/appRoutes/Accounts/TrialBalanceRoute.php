<?php

use App\Http\Controllers\TransactionAccount\TrialBalanceController;
use Illuminate\Support\Facades\Route;

Route::prefix('/trialBalance')->group(function () {
    Route::get('/', [TrialBalanceController::class, 'index']);
    Route::get('getTrialBalanceReport', [TrialBalanceController::class, 'getTrialBalanceReport']);
    Route::get('sixColumn', [TrialBalanceController::class, 'sixColumn']);
    Route::get('getTrialBalanceSixColumnReport', [TrialBalanceController::class, 'getTrialBalanceSixColumnReport']);
});
