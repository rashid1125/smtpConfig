<?php

use App\Http\Controllers\TransactionAccount\ChequeIssueController;
use Illuminate\Support\Facades\Route;

Route::prefix('/chequeIssue')->group(function () {
  Route::get('/', [ChequeIssueController::class, 'index'])->name('chequeIssue.index');
  Route::post('/save', [ChequeIssueController::class, 'saveChequeIssue'])->name('chequeIssue.saveChequeIssue');
  Route::get('/fetch', [ChequeIssueController::class, 'fetch'])->name('chequeIssue.fetch');
  Route::delete('/delete', [ChequeIssueController::class, 'delete'])->name('chequeIssue.delete');
  Route::get('/getChequeIssueViewList', [ChequeIssueController::class, 'getChequeIssueViewList'])->name('chequeIssue.getChequeIssueViewList');
});
