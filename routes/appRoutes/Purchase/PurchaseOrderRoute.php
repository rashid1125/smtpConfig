<?php

use App\Http\Controllers\PurchaseOrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('/purchaseorder')->group(function () {
  Route::get('/', [PurchaseOrderController::class, 'index']);
  Route::post('savePurchaseOrder', [PurchaseOrderController::class, 'savePurchaseOrder'])->name('purchaseorder.savePurchaseOrder');
  Route::get('fetch', [PurchaseOrderController::class, 'fetch'])->name('purchaseorder.fetch');
  Route::post('delete', [PurchaseOrderController::class, 'delete'])->name('purchaseorder.delete');
  Route::get('getPODataTable', [PurchaseOrderController::class, 'getPODataTable']);
  Route::get('getPendingPOComparePurchaseDT', [PurchaseOrderController::class, 'getPendingPOComparePurchaseDT']);
  Route::get('getPendingPOComparePurchaseById', [PurchaseOrderController::class, 'getPendingPOComparePurchaseById']);
  Route::get('getPendingPOCompareInward', [PurchaseOrderController::class, 'getPendingPOCompareInward']);
  Route::get('getPendingPOCompareInwardById', [PurchaseOrderController::class, 'getPendingPOCompareInwardById']);
});
