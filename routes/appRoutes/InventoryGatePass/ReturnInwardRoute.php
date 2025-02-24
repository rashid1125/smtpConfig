<?php

use App\Http\Controllers\InventoryGatePass\ReturnInwardController;
use Illuminate\Support\Facades\Route;

Route::prefix('/returnInward')->group(function () {
    Route::get('/', [ReturnInwardController::class, 'index']);
    Route::post('save', [ReturnInwardController::class, 'save']);
    Route::delete('delete', [ReturnInwardController::class, 'delete']);
    Route::get('getReturnInwardById', [ReturnInwardController::class, 'getReturnInwardById']);
    Route::get('getReturnInwardDataTable', [ReturnInwardController::class, 'getReturnInwardDataTable']);
    Route::get('getPendingReturnInwardDataTable', [ReturnInwardController::class, 'getPendingReturnInwardDataTable']);
    Route::get('getPendingReturnInwardById', [ReturnInwardController::class, 'getPendingReturnInwardById']);
});
