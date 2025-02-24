<?php


use App\Http\Controllers\ExportModules\CommercialInvoiceController;
use Illuminate\Support\Facades\Route;

Route::prefix('/commercialInvoice')->group(function () {
    Route::get('/', [CommercialInvoiceController::class, 'index']);
    Route::post('save', [CommercialInvoiceController::class, 'save']);
    Route::get('getCommercialInvoiceById', [CommercialInvoiceController::class, 'getCommercialInvoiceById']);
    Route::get('getCommercialInvoiceDataTable', [CommercialInvoiceController::class, 'getCommercialInvoiceDataTable']);
    Route::delete('delete', [CommercialInvoiceController::class, 'delete']);
    Route::get('getPendingCommercialInvoiceDataTable', [CommercialInvoiceController::class, 'getPendingCommercialInvoiceDataTable']);
    Route::get('getPendingCommercialInvoice', [CommercialInvoiceController::class, 'getPendingCommercialInvoice']);
});
