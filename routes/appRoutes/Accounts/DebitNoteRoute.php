<?php

use App\Http\Controllers\TransactionAccount\DebitNoteController;
use Illuminate\Support\Facades\Route;

Route::prefix('/debitNote')->group(function () {
  Route::get('/', [DebitNoteController::class, 'index'])->name('debitNote.index');
  Route::post('save', [DebitNoteController::class, 'saveDebitNote'])->name('debitNote.save');
  Route::get('fetch', [DebitNoteController::class, 'fetch'])->name('debitNote.fetch');
  Route::delete('delete', [DebitNoteController::class, 'delete'])->name('debitNote.delete');
  Route::get('getDebitNoteDataTable', [DebitNoteController::class, 'getDebitNoteDataTable']);
});
