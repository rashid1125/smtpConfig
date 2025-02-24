<?php


use App\Http\Controllers\ExportModules\ExportInvoiceReceivingController;
use Illuminate\Support\Facades\Route;

Route::prefix('/exportInvoiceReceiving')->group(function () {
    Route::get('/', [ExportInvoiceReceivingController::class, 'index']);
    Route::post('save', [ExportInvoiceReceivingController::class, 'save']);
    Route::get('getInvoiceReceivingById', [ExportInvoiceReceivingController::class, 'getInvoiceReceivingById']);
    Route::get('getInvoiceReceivingDataTable', [ExportInvoiceReceivingController::class, 'getInvoiceReceivingDataTable']);
    Route::get('getPendingProformaDataTable', [ExportInvoiceReceivingController::class, 'getPendingProformaDataTable']);
    Route::delete('delete', [ExportInvoiceReceivingController::class, 'delete']);
});
