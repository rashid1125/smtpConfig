<?php


use App\Http\Controllers\ExportModules\PackingListController;
use Illuminate\Support\Facades\Route;

Route::prefix('/packingList')->group(function () {
    Route::get('/', [PackingListController::class, 'index']);
    Route::post('save', [PackingListController::class, 'save']);
    Route::get('getPackingListById', [PackingListController::class, 'getPackingListById']);
    Route::get('getPackingListDataTable', [PackingListController::class, 'getPackingListDataTable']);
    Route::delete('delete', [PackingListController::class, 'delete']);
    Route::get('getPendingPackingListDataTable', [PackingListController::class, 'getPendingPackingListDataTable']);
});
