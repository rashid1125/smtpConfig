<?php

use App\Http\Controllers\Sales\CashSaleInvoiceController;
use Illuminate\Support\Facades\Route;

Route::prefix('/cashSaleInvoice')->group(function () {
    Route::get('/', [CashSaleInvoiceController::class, 'index']);
    Route::post('save', [CashSaleInvoiceController::class, 'save']);
    Route::delete('delete', [CashSaleInvoiceController::class, 'delete']);
    Route::get('getCashSaleInvoiceById', [CashSaleInvoiceController::class, 'getCashSaleInvoiceById']);
    Route::get('getCashSaleInvoiceDataTable', [CashSaleInvoiceController::class, 'getCashSaleInvoiceDataTable']);
});
