

<?php
// LoanRoute.php
use App\Http\Controllers\Payroll\LoanController;
use Illuminate\Support\Facades\Route;
/**
 * Routes for the Loan feature in the Payroll module.
 */
Route::prefix('/payroll/loan')->group(function () {
    /**
     * Get the index page for the Loan feature.
     */
    Route::get('/', [LoanController::class, 'index']);

    /**
     * Save a Loan record.
     */
    Route::post('save', [LoanController::class, 'save']);

    /**
     * Get a Loan record by its ID.
     */
    Route::get('getLoanById', [LoanController::class, 'getLoanById']);

    /**
     * Get the data table for Loan records.
     */
    Route::get('getLoanDataTable', [LoanController::class, 'getLoanDataTable']);

    /**
     * Delete a Loan record.
     */
    Route::delete('delete', [LoanController::class, 'delete']);
});
