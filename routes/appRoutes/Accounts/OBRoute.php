<?php

use App\Http\Controllers\TransactionAccount\OpeningBalanceController;
use Illuminate\Support\Facades\Route;

Route::prefix('/openingBalance')->group(function () {
  Route::get('/', [OpeningBalanceController::class, 'index'])->name('openingBalance.index');
  Route::post('save', [OpeningBalanceController::class, 'saveOpeningBalance'])->name('openingBalance.save');
  Route::get('fetch', [OpeningBalanceController::class, 'fetch'])->name('openingBalance.fetch');
  Route::delete('delete', [OpeningBalanceController::class, 'delete'])->name('openingBalance.delete');
  Route::get('getOpeningBalanceViewList', [OpeningBalanceController::class, 'getOpeningBalanceViewList'])->name('openingBalance.getOpeningBalanceViewList');
});
