<?php

use App\Http\Controllers\Inventory\OpeningStockController;
use Illuminate\Support\Facades\Route;

Route::prefix('/openingStock')->group(function () {
    Route::get('/', [OpeningStockController::class, 'index']);
    Route::post('save', [OpeningStockController::class, 'save']);
    Route::delete('delete', [OpeningStockController::class, 'delete']);
    Route::get('getOpeningStockById', [OpeningStockController::class, 'getOpeningStockById']);
    Route::get('getOpeningStockDataTable', [OpeningStockController::class, 'getOpeningStockDataTable']);
});
