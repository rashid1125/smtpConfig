<?php

use App\Http\Controllers\TransactionAccount\JournalController;
use Illuminate\Support\Facades\Route;

Route::prefix('/jv')->group(function () {
  Route::get('/', [JournalController::class, 'index'])->name('jv.index');
  Route::post('save', [JournalController::class, 'saveJournal'])->name('jv.save');
  Route::get('fetch', [JournalController::class, 'fetch'])->name('jv.fetch');
  Route::delete('delete', [JournalController::class, 'delete'])->name('jv.delete');
  Route::get('getJournalViewList', [JournalController::class, 'getJournalViewList'])->name('jv.getJournalViewList');
});

