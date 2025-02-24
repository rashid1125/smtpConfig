<?php

use App\Http\Controllers\Sales\CustomerDiscountIssuanceController;
use Illuminate\Support\Facades\Route;

Route::prefix('/customerDiscountIssuance')->group(function () {
    Route::get('/', [CustomerDiscountIssuanceController::class, 'index']);
    Route::get('getItemFinishCategoryDetail', [CustomerDiscountIssuanceController::class, 'getItemFinishCategoryDetail']);
    Route::post('save', [CustomerDiscountIssuanceController::class, 'save']);
});