<?php

use App\Http\Controllers\BankPaymentController;
use Illuminate\Support\Facades\Route;

Route::prefix('/bankPayment')->group(function () {
    Route::get('/', [BankPaymentController::class, 'index']);
    Route::post('save', [BankPaymentController::class, 'saveBankPayment'])->name('bankPayment.save');
    Route::get('fetch', [BankPaymentController::class, 'fetch'])->name('bankPayment.fetch');
    Route::delete('delete', [BankPaymentController::class, 'delete'])->name('bankPayment.delete');
    Route::get('getBankPaymentViewList', [BankPaymentController::class, 'getBankPaymentDetailDataTable'])->name('bankPayment.getBankPaymentViewList');
});
