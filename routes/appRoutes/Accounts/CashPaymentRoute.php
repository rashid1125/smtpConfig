<?php

use App\Http\Controllers\TransactionAccount\CashPaymentController;
use Illuminate\Support\Facades\Route;

Route::prefix('/cashpayment')->group(function () {
    Route::get('/', [CashPaymentController::class, 'index']);
    Route::post('saveCashPayment', [CashPaymentController::class, 'saveCashPayment']);
    Route::get('fetch', [CashPaymentController::class, 'fetch']);
    Route::get('getCashPaymentViewList', [CashPaymentController::class, 'getCashPaymentDetailDataTable']);
    Route::delete('delete', [CashPaymentController::class, 'delete']);
});
