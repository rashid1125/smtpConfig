

<?php
// AdvanceReturnRoute.php
use App\Http\Controllers\Payroll\AdvanceReturnController;
use Illuminate\Support\Facades\Route;

/**
 * Routes for the Advance Return feature in the Payroll module.
 */
Route::prefix('/payroll/advanceReturn')->group(function () {
    /**
     * Get the index page for the Advance Return feature.
     */
    Route::get('/', [AdvanceReturnController::class, 'index']);

    /**
     * Save an Advance Return record.
     */
    Route::post('save', [AdvanceReturnController::class, 'save']);

    /**
     * Get an Advance Return record by its ID.
     */
    Route::get('getAdvanceReturnById', [AdvanceReturnController::class, 'getAdvanceReturnById']);

    /**
     * Get the data table for Advance Return records.
     */
    Route::get('getAdvanceReturnDataTable', [AdvanceReturnController::class, 'getAdvanceReturnDataTable']);

    /**
     * Delete an Advance Return record.
     */
    Route::delete('delete', [AdvanceReturnController::class, 'delete']);
});
