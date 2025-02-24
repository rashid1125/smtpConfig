<?php

use App\Http\Controllers\Production\ConsumptionController;
use Illuminate\Support\Facades\Route;

Route::prefix('/consumption')->group(function () {
    Route::get('/', [ConsumptionController::class, 'index']);
    Route::get('getConsumptionById', [ConsumptionController::class, 'getConsumptionById']);
    Route::get('getConsumptionDataTable', [ConsumptionController::class, 'getConsumptionDataTable']);
    Route::post('save', [ConsumptionController::class, 'save']);
    Route::delete('delete', [ConsumptionController::class, 'delete']);
});
