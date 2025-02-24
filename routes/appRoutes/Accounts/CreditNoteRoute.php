<?php


use App\Http\Controllers\TransactionAccount\CreditNoteController;
use Illuminate\Support\Facades\Route;

Route::prefix('/creditNote')->group(function () {
  Route::get('/', [CreditNoteController::class, 'index'])->name('creditNote.index');
  Route::post('save', [CreditNoteController::class, 'saveCreditNote'])->name('creditNote.save');
  Route::get('fetch', [CreditNoteController::class, 'fetch'])->name('creditNote.fetch');
  Route::delete('delete', [CreditNoteController::class, 'delete'])->name('creditNote.delete');
  Route::get('getCreditNoteDataTable', [CreditNoteController::class, 'getCreditNoteDataTable']);
});
