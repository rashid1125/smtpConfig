<?php


use App\Http\Controllers\ExportModules\ExportQuotationController;
use Illuminate\Support\Facades\Route;

Route::prefix('/exportQuotation')->group(function () {
  Route::get('/', [ExportQuotationController::class, 'index']);
  Route::post('save', [ExportQuotationController::class, 'save']);
  Route::get('getExportQuotationById', [ExportQuotationController::class, 'getExportQuotationById']);
  Route::get('getExportQuotationDataTable', [ExportQuotationController::class, 'getExportQuotationDataTable']);
  Route::delete('delete', [ExportQuotationController::class, 'delete']);
  Route::get('getPendingQuotationDataTable', [ExportQuotationController::class, 'getPendingQuotationDataTable']);
});
