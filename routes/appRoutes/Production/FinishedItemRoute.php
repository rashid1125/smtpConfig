<?php

use App\Http\Controllers\Production\FinishedItemController;
use Illuminate\Support\Facades\Route;

Route::prefix('/finishedItem')->group(function () {
    Route::get('/', [FinishedItemController::class, 'index']);
    Route::get('getFinishedItemById', [FinishedItemController::class, 'getFinishedItemById']);
    Route::get('getFinishedItemDataTable', [FinishedItemController::class, 'getFinishedItemDataTable']);
    Route::post('save', [FinishedItemController::class, 'save']);
    Route::delete('delete', [FinishedItemController::class, 'delete']);
});
