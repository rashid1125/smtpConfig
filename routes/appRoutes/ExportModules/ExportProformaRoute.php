<?php


use App\Http\Controllers\ExportModules\ExportProformaController;
use Illuminate\Support\Facades\Route;

Route::prefix('/exportProforma')->group(function () {
    Route::get('/', [ExportProformaController::class, 'index']);
    Route::post('save', [ExportProformaController::class, 'save']);
    Route::get('getExportProformaById', [ExportProformaController::class, 'getExportProformaById']);
    Route::get('getExportProformaDataTable', [ExportProformaController::class, 'getExportProformaDataTable']);
    Route::get('getPendingProformaDataTable', [ExportProformaController::class, 'getPendingProformaDataTable']);
    Route::delete('delete', [ExportProformaController::class, 'delete']);
});
