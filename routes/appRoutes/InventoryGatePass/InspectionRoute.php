<?php

use App\Http\Controllers\InventoryGatePass\InspectionController;
use Illuminate\Support\Facades\Route;

Route::prefix('/inspection')->group(function () {
  Route::get('/', [InspectionController::class, 'index']);
  Route::post('saveInspection', [InspectionController::class, 'saveInspection']);
  Route::get('fetch', [InspectionController::class, 'fetch']);
  Route::get('getInspectionViewList', [InspectionController::class, 'getInspectionViewList']);
  Route::get('getPendingInspection', [InspectionController::class, 'getPendingInspection']);
  Route::delete('delete', [InspectionController::class, 'delete']);
});