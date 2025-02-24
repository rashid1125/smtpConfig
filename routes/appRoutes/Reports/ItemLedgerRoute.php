<?php

use App\Http\Controllers\DocController;
use App\Http\Controllers\Items\ItemLedgerController;
use Illuminate\Support\Facades\Route;

Route::prefix('/itemLedger')->group(function () {
    Route::get('/', [ItemLedgerController::class, 'index']);
    Route::get('getItemOpeningStock', [ItemLedgerController::class, 'getItemOpeningStock']);
    Route::get('getItemLedger', [ItemLedgerController::class, 'getItemLedger']);
});
Route::get('doc/getItemLedgerPDF', [DocController::class, 'getItemLedgerPDF']);

