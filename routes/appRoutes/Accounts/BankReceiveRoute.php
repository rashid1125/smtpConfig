<?php

use App\Http\Controllers\TransactionAccount\BankReceiveController;
use Illuminate\Support\Facades\Route;

Route::prefix('/bankReceive')->group(function () {
  Route::get('/', [BankReceiveController::class, 'index'])->name('bankReceive.index');
  Route::post('save', [BankReceiveController::class, 'saveBankReceive'])->name('bankReceive.save');
  Route::get('fetch', [BankReceiveController::class, 'fetch'])->name('bankReceive.fetch');
  Route::delete('delete', [BankReceiveController::class, 'delete'])->name('bankReceive.delete');
  Route::get('getBankReceiveViewList', [BankReceiveController::class, 'getBankReceiveViewList'])->name('bankReceive.getBankReceiveViewList');
  Route::get('validatePendingChequeInHandAmount', [BankReceiveController::class, 'validatePendingChequeInHandAmount']);
});
