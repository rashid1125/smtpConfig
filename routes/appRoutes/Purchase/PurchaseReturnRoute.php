<?php

use App\Http\Controllers\PurchaseReturnController;
use Illuminate\Support\Facades\Route;

Route::prefix('/purchaseReturn')->group(function () {
    Route::get('/', [PurchaseReturnController::class, 'index']);
    Route::post('save', [PurchaseReturnController::class, 'save']);
    Route::get('getPurchaseReturnById', [PurchaseReturnController::class, 'getPurchaseReturnById']);
    Route::delete('delete', [PurchaseReturnController::class, 'delete']);
    Route::get('getPurchaseReturnDataTable', [PurchaseReturnController::class, 'getPurchaseReturnDataTable']);
    Route::get('getPendingPurchaseCompareReturnOutward', [PurchaseReturnController::class, 'getPendingPurchaseCompareReturnOutward']);
    Route::get('getPendingPurchaseCompareReturnOutwardById', [PurchaseReturnController::class, 'getPendingPurchaseCompareReturnOutwardById']);
});
