



<?php
// LoanReturnRoute.php
use App\Http\Controllers\Payroll\LoanReturnController;
use Illuminate\Support\Facades\Route;

/**
 * Routes for the Loan Return feature in the Payroll module.
 */
Route::prefix('/payroll/loanReturn')->group(function () {
    /**
     * Get the index page for the Loan Return feature.
     */
    Route::get('/', [LoanReturnController::class, 'index']);

    /**
     * Save a Loan Return record.
     */
    Route::post('save', [LoanReturnController::class, 'save']);

    /**
     * Get a Loan Return record by its ID.
     */
    Route::get('getLoanReturnById', [LoanReturnController::class, 'getLoanReturnById']);

    /**
     * Get the data table for Loan Return records.
     */
    Route::get('getLoanReturnDataTable', [LoanReturnController::class, 'getLoanReturnDataTable']);

    /**
     * Delete a Loan Return record.
     */
    Route::delete('delete', [LoanReturnController::class, 'delete']);
});
