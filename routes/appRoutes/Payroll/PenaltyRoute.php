

<?php

// File: routes/appRoutes/Payroll/PenaltyRoute.php

use App\Http\Controllers\Payroll\PenaltyController;
use Illuminate\Support\Facades\Route;

/**
 * Routes for the Penalty feature in the Payroll module.
 */
Route::prefix('/payroll/penalty')->group(function () {
    /**
     * Get the index page for the Penalty feature.
     */
    Route::get('/', [PenaltyController::class, 'index']);

    /**
     * Save a Penalty record.
     */
    Route::post('save', [PenaltyController::class, 'save']);

    /**
     * Get a Penalty record by its ID.
     */
    Route::get('getPenaltyById', [PenaltyController::class, 'getPenaltyById']);

    /**
     * Get the data table for Penalty records.
     */
    Route::get('getPenaltyDataTable', [PenaltyController::class, 'getPenaltyDataTable']);

    /**
     * Delete a Penalty record.
     */
    Route::delete('delete', [PenaltyController::class, 'delete']);
});
