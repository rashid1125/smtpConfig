

<?php

// File: routes/appRoutes/Payroll/IncentiveRoute.php

use App\Http\Controllers\Payroll\IncentiveController;
use Illuminate\Support\Facades\Route;

/**
 * Routes for the Incentive feature in the Payroll module.
 */
Route::prefix('/payroll/incentive')->group(function () {
    /**
     * Get the index page for the Incentive feature.
     */
    Route::get('/', [IncentiveController::class, 'index']);

    /**
     * Save an Incentive record.
     */
    Route::post('save', [IncentiveController::class, 'save']);

    /**
     * Get an Incentive record by its ID.
     */
    Route::get('getIncentiveById', [IncentiveController::class, 'getIncentiveById']);

    /**
     * Get the data table for Incentive records.
     */
    Route::get('getIncentiveDataTable', [IncentiveController::class, 'getIncentiveDataTable']);

    /**
     * Delete an Incentive record.
     */
    Route::delete('delete', [IncentiveController::class, 'delete']);
});
