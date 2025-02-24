<?php


use App\Http\Controllers\ExportModules\CurrencyController;
use Illuminate\Support\Facades\Route;

Route::prefix('/currency')->group(function () {
  Route::get('/', [CurrencyController::class, 'index']);
  Route::post('save', [CurrencyController::class, 'saveCurrency'])->name('currency.save');
  Route::get('fetch', [CurrencyController::class, 'fetch'])->name('currency.fetch');
  Route::get('getCurrencyDataTable', [CurrencyController::class, 'getCurrencyDataTable']);
  Route::put('updateCurrencyListStatus', [CurrencyController::class, 'updateCurrencyListStatus']);
  Route::get('getAllCurrency', [CurrencyController::class, 'getAllCurrency']);
});