<?php

use App\Http\Controllers\Inventory\StockTransferController;
use Illuminate\Support\Facades\Route;

Route::prefix('/stockTransfer')->group(function () {
    Route::get('/', [StockTransferController::class, 'index']);
    Route::post('save', [StockTransferController::class, 'save']);
    Route::delete('delete', [StockTransferController::class, 'delete']);
    Route::get('getStockTransferById', [StockTransferController::class, 'getStockTransferById']);
    Route::get('getStockTransferDataTable', [StockTransferController::class, 'getStockTransferDataTable']);
});
