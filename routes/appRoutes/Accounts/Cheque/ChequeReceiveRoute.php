<?php

use App\Http\Controllers\TransactionAccount\ChequeReceiveController;
use Illuminate\Support\Facades\Route;

Route::prefix('/chequeReceive')->group(function () {
  Route::get('/', [ChequeReceiveController::class, 'index'])->name('chequeReceive.index');
  Route::post('save', [ChequeReceiveController::class, 'saveChequeReceive'])->name('chequeReceive.save');
  Route::get('fetch', [ChequeReceiveController::class, 'fetch'])->name('chequeReceive.fetch');
  Route::delete('delete', [ChequeReceiveController::class, 'delete'])->name('chequeReceive.delete');
  Route::get('/getPendingChequeInHand', [ChequeReceiveController::class, 'getPendingChequeInHand']);
  Route::get('getPendingChequeInHandByChequeList', [ChequeReceiveController::class, 'getPendingChequeInHandByChequeList']);
  Route::get('getChequeReceiveViewList', [ChequeReceiveController::class, 'getChequeReceiveViewList'])->name('chequeReceive.getJournalViewList');
  Route::get('getValidateChequeReceiveByChequeListNumber', [ChequeReceiveController::class, 'getValidateChequeReceiveByChequeListNumber']);
});
