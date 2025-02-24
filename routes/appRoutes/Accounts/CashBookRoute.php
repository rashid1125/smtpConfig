<?php

use App\Http\Controllers\TransactionAccount\CashBookController;
use Illuminate\Support\Facades\Route;

Route::prefix('/cashBook')->group(function () {
  Route::get('/', [CashBookController::class, 'index'])->name('cashBook.index');
  Route::post('save', [CashBookController::class, 'saveCashBook'])->name('cashBook.save');
  Route::get('fetch', [CashBookController::class, 'fetch'])->name('cashBook.fetch');
  Route::delete('delete', [CashBookController::class, 'delete'])->name('cashBook.delete');
  Route::get('getCashBookDataTable', [CashBookController::class, 'getCashBookDataTable']);
});

