<?php

use App\Http\Controllers\AccountController;
use Illuminate\Support\Facades\Route;

Route::prefix('/accountLedger')->group(function () {
    Route::get('/', [AccountController::class, 'index']);
    Route::get('getAccountOpeningBalance', [AccountController::class, 'getAccountOpeningBalance']);
    Route::get('getAccountLedger', [AccountController::class, 'getAccountLedger']);
    Route::get('getChequeInHand', [AccountController::class, 'getChequeInHand']);
    Route::put('getTallyLedgerRow', [AccountController::class, 'getTallyLedgerRow']);
    Route::get('getCashFlowOpeningBalance', [AccountController::class, 'getCashFlowOpeningBalance']);
    Route::get('getCashFlowClosingBalance', [AccountController::class, 'getCashFlowClosingBalance']);
    Route::get('getCashFlowReportData', [AccountController::class, 'getCashFlowReportData']);
});
// Foreign Account Ledger Route
Route::prefix("/foreignAccountLedger")->group(function () {
    Route::get('/', [AccountController::class, 'foreignAccountLedger']);
    Route::get('getForeignAccountOpeningBalance', [AccountController::class, 'getForeignAccountOpeningBalance']);
    Route::get('getForeignAccountLedger', [AccountController::class, 'getForeignAccountLedger']);
    Route::put('getForeignTallyLedgerRow', [AccountController::class, 'getForeignTallyLedgerRow']);
    Route::get('getForeignCashFlowOpeningBalance', [AccountController::class, 'getForeignCashFlowOpeningBalance']);
    Route::get('getForeignCashFlowClosingBalance', [AccountController::class, 'getForeignCashFlowClosingBalance']);
    Route::get('getForeignCashFlowReportData', [AccountController::class, 'getForeignCashFlowReportData']);
});
