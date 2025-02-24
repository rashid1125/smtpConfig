

<?php

use App\Http\Controllers\Payroll\OverTimeController;

use Illuminate\Support\Facades\Route;

Route::prefix('/payroll/overtime')->group(function () {

    Route::get('/', [OverTimeController::class, 'index']);

    Route::post('save', [OverTimeController::class, 'save']);

    Route::get('getOverTimeById', [OverTimeController::class, 'getOverTimeById']);

    Route::get('getOverTimeDataTable', [OverTimeController::class, 'getOverTimeDataTable']);

    Route::delete('delete', [OverTimeController::class, 'delete']);
});
