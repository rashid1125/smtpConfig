<?php

use App\Http\Controllers\InventoryGatePass\DeliveryChallanController;
use Illuminate\Support\Facades\Route;

Route::prefix('/deliveryChallan')->group(function () {
    Route::get('/', [DeliveryChallanController::class, 'index']);
    Route::post('save', [DeliveryChallanController::class, 'save']);
    Route::delete('delete', [DeliveryChallanController::class, 'delete']);
    Route::get('getDeliveryChallanById', [DeliveryChallanController::class, 'getDeliveryChallanById']);
    Route::get('getDeliveryChallanDataTable', [DeliveryChallanController::class, 'getDeliveryChallanDataTable']);
    Route::get('getPendingDeliveryChallanDataTable', [DeliveryChallanController::class, 'getPendingDeliveryChallanDataTable']);
    Route::get('getPendingDeliveryChallanById', [DeliveryChallanController::class, 'getPendingDeliveryChallanById']);
});
