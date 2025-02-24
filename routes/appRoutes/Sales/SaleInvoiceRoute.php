<?php

use App\Http\Controllers\Sales\SaleInvoiceController;
use Illuminate\Support\Facades\Route;

Route::prefix('/saleInvoice')->group(function () {
    Route::get('/', [SaleInvoiceController::class, 'index']);
    Route::post('save', [SaleInvoiceController::class, 'save']);
    Route::delete('delete', [SaleInvoiceController::class, 'delete']);

    Route::get('getSaleInvoiceById', [SaleInvoiceController::class, 'getSaleInvoiceById']);
    Route::get('getSaleInvoiceDataTable', [SaleInvoiceController::class, 'getSaleInvoiceDataTable']);
    Route::get('getPendingSOCompareOutward', [SaleInvoiceController::class, 'getPendingSOCompareOutward']);
    Route::get('getPendingSaleOrderById', [SaleInvoiceController::class, 'getPendingSaleOrderById']);
});
