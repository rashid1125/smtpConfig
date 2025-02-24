<?php


use App\Http\Controllers\ExportModules\PortOfDischargeController;
use Illuminate\Support\Facades\Route;

Route::prefix('/portOfDischarge')->group(function () {
  Route::get('/', [PortOfDischargeController::class, 'index']);
  Route::post('save', [PortOfDischargeController::class, 'savePortOfDischarge'])->name('currency.save');
  Route::get('fetch', [PortOfDischargeController::class, 'fetch'])->name('currency.fetch');
  Route::get('getPortOfDischargeDataTable', [PortOfDischargeController::class, 'getPortOfDischargeDataTable']);
  Route::put('updatePortOfDischargeListStatus', [PortOfDischargeController::class, 'updatePortOfDischargeListStatus']);
  Route::get('getAllPortOfDischarge', [PortOfDischargeController::class, 'getAllPortOfDischarge']);
});
