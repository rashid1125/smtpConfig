<?php

use App\Http\Controllers\Sales\SaleOfficerCommissionAllotmentController;
use Illuminate\Support\Facades\Route;

Route::prefix('/saleOfficerCommissionAllotment')->group(function () {
    Route::get('/', [SaleOfficerCommissionAllotmentController::class, 'index']);
    Route::post('save', [SaleOfficerCommissionAllotmentController::class, 'save']);
    Route::get('getCustomerDetailBySaleOfficerId', [SaleOfficerCommissionAllotmentController::class, 'getCustomerDetailBySaleOfficerId']);
    Route::get('getSaleCommissionPercentage', [SaleOfficerCommissionAllotmentController::class, 'getSaleCommissionPercentage']);
});
