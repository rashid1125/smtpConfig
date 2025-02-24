<?php


use App\Http\Controllers\ExportModules\ApprovalProformaController;
use Illuminate\Support\Facades\Route;

Route::prefix('/approvalProforma')->group(function () {
  Route::get('/', [ApprovalProformaController::class, 'index']);
  Route::get('getApprovalProformaDataTable', [ApprovalProformaController::class, 'getApprovalProformaDataTable']);
  Route::post('updateStatusExportProformaById', [ApprovalProformaController::class, 'updateStatusExportProformaById']);
});
