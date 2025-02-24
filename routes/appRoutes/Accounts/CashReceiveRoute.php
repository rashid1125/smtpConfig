<?php


use App\Http\Controllers\TransactionAccount\CashReceiveController;
use Illuminate\Support\Facades\Route;

Route::prefix('/cashreceive')->group(function () {
  Route::get('/', [CashReceiveController::class, 'index']);
  Route::post('save', [CashReceiveController::class, 'saveCashReceive']);
  Route::get('fetch', [CashReceiveController::class, 'fetch'])->name('cashreceive.fetch');
  Route::get('getCashReceiveViewList', [CashReceiveController::class, 'getCashReceiveDetailDataTable']);
  Route::delete('delete', [CashReceiveController::class, 'delete'])->name('cashreceive.delete');
});