<?php

use App\Http\Controllers\InventoryGatePass\ReturnOutwardController;
use Illuminate\Support\Facades\Route;

Route::prefix('/returnOutward')->group(function () {
    Route::get('/', [ReturnOutwardController::class, 'index']);
    Route::post('saveReturnOutward', [ReturnOutwardController::class, 'saveReturnOutward']);
    Route::get('fetch', [ReturnOutwardController::class, 'fetch']);
    Route::delete('delete', [ReturnOutwardController::class, 'delete']);
    Route::get('getReturnOutwardViewList', [ReturnOutwardController::class, 'getReturnOutwardViewList']);
    Route::get('getPendingReturnOutwardDataTable', [ReturnOutwardController::class, 'getPendingReturnOutwardDataTable']);
});
