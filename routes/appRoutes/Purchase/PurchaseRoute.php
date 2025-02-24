<?php

use App\Http\Controllers\PurchaseController;
use Illuminate\Support\Facades\Route;

Route::prefix('/purchase')->group(function () {
  Route::get('/', [PurchaseController::class, 'index']);
  Route::post('save', [PurchaseController::class, 'save']);
  Route::get('fetch', [PurchaseController::class, 'fetch']);
  Route::delete('delete', [PurchaseController::class, 'delete']);
  Route::get('getPurchaseDataTable', [PurchaseController::class, 'getPurchaseDataTable']);
  Route::get('getPendingPurchaseCompareReturnOutward', [PurchaseController::class, 'getPendingPurchaseCompareReturnOutward']);
  Route::get('getPendingPurchaseCompareReturnOutwardById', [PurchaseController::class, 'getPendingPurchaseCompareReturnOutwardById']);
});
