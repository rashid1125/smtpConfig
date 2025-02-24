<?php

use App\Http\Controllers\Sales\SaleOrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('/saleOrder')->group(function () {
    Route::get('/', [SaleOrderController::class, 'index']);
    Route::post('save', [SaleOrderController::class, 'save']);
    Route::delete('delete', [SaleOrderController::class, 'delete']);
    Route::get('getSaleOrderById', [SaleOrderController::class, 'getSaleOrderById']);
    Route::get('getSaleOrderDataTable', [SaleOrderController::class, 'getSaleOrderDataTable']);
    Route::get('getPendingSOCompareOutward', [SaleOrderController::class, 'getPendingSOCompareOutward']);
    Route::get('getPendingSaleOrderById', [SaleOrderController::class, 'getPendingSaleOrderById']);
    Route::post('completeSaleOrder', [SaleOrderController::class, 'completeSaleOrder']);
});
