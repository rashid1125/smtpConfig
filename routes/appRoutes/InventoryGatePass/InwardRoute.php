<?php

use App\Http\Controllers\InventoryGatePass\InwardGatePassController;
use Illuminate\Support\Facades\Route;

Route::prefix('/inward')->group(function () {
  Route::get('/', [InwardGatePassController::class, 'index']);
  Route::post('saveInward', [InwardGatePassController::class, 'saveInward'])->name('inward.saveInward');
  Route::get('fetch', [InwardGatePassController::class, 'fetch'])->name('inward.fetch');
  Route::get('getInwardOrderViewList', [InwardGatePassController::class, 'getInwardOrderViewList'])->name('inward.getInwardOrderViewList');
  Route::delete('delete', [InwardGatePassController::class, 'delete'])->name('inward.delete');
  Route::get('getInwardDataTable', [InwardGatePassController::class, 'getInwardDataTable']);
  Route::get('getPendingInwardCompareInspection', [InwardGatePassController::class, 'getPendingInwardCompareInspection']);
  Route::get('getPendingInwardComparePurchase', [InwardGatePassController::class, 'getPendingInwardComparePurchase']);
});
