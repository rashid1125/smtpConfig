<?php

use App\Http\Controllers\Sales\CashSaleReturnController;
use Illuminate\Support\Facades\Route;

Route::prefix('/cashSaleReturn')->group(function () {
    Route::get('/', [CashSaleReturnController::class, 'index']);
    Route::post('save', [CashSaleReturnController::class, 'save']);
    Route::delete('delete', [CashSaleReturnController::class, 'delete']);
    Route::get('getCashSaleReturnById', [CashSaleReturnController::class, 'getCashSaleReturnById']);
    Route::get('getCashSaleReturnDataTable', [CashSaleReturnController::class, 'getCashSaleReturnDataTable']);
});
