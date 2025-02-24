<?php

use App\Http\Controllers\DesignationController;
use Illuminate\Support\Facades\Route;

Route::prefix('designation')->group(function () {
    Route::get('/', [DesignationController::class, 'index']);
    Route::get('getDesignationById', [DesignationController::class, 'getDesignationById']);
    Route::post('saveDesignation', [DesignationController::class, 'saveDesignation']);
    Route::get('getAllDesignation', [DesignationController::class, 'getAllDesignation']);
    Route::get('getDesignationDataTable', [DesignationController::class, 'getDesignationDataTable']);
    Route::put('updateDesignationListStatus', [DesignationController::class, 'updateDesignationListStatus']);
});
