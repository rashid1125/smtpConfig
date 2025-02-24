<?php

use App\Http\Controllers\Sales\SaleReturnInvoiceController;
use Illuminate\Support\Facades\Route;

Route::prefix('/saleReturnInvoice')->group(function () {
    Route::get('/', [SaleReturnInvoiceController::class, 'index']);
    Route::post('save', [SaleReturnInvoiceController::class, 'save']);
    Route::delete('delete', [SaleReturnInvoiceController::class, 'delete']);

    Route::get('getSaleReturnInvoiceById', [SaleReturnInvoiceController::class, 'getSaleReturnInvoiceById']);
    Route::get('getSaleReturnInvoiceDataTable', [SaleReturnInvoiceController::class, 'getSaleReturnInvoiceDataTable']);
    Route::get('getPendingSOCompareOutward', [SaleReturnInvoiceController::class, 'getPendingSOCompareOutward']);
    Route::get('getPendingSaleOrderById', [SaleReturnInvoiceController::class, 'getPendingSaleOrderById']);
});
