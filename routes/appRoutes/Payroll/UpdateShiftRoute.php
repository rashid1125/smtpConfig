

<?php
// UpdateShiftRoute.php
use App\Http\Controllers\Payroll\UpdateShiftController;
use Illuminate\Support\Facades\Route;

/**
 * Route for managing update shift in the payroll module.
 */
Route::prefix('/payroll/updateShift')->group(function () {
    /**
     * Display the update shift index page.
     *
     * @param \App\Http\Controllers\Payroll\UpdateShiftController $controller
     * @return \Illuminate\Contracts\View\View
     */
    Route::get('/', [UpdateShiftController::class, 'index']);

    /**
     * Get the update shift status.
     *
     * @route GET /getUpdateShiftData
     * @param UpdateShiftController $controller The UpdateShiftController instance.
     * @return mixed The result of the getUpdateShiftData method.
     */
    Route::get('getUpdateShiftData', [UpdateShiftController::class, 'getUpdateShiftData']);

    /**
     * Save the update shift record.
     *
     * @param  \App\Http\Controllers\Payroll\UpdateShiftController  $controller
     * @param  string  $method
     * @return \Illuminate\Routing\Route
     */
    Route::post('save', [UpdateShiftController::class, 'save']);
    /**
     * Get the update shift list by departments.
     *
     * @route GET /getStaffListByDepartments
     * @param UpdateShiftController::class $controller The UpdateShiftController class.
     * @param 'getStaffListByDepartments' $method The method name.
     * @return void
     */
    Route::get('getStaffListByDepartments', [UpdateShiftController::class, 'getStaffListByDepartments']);

    /**
     * Route to get update shift by ID.
     *
     * @route GET /getUpdateShiftById
     * @param UpdateShiftController::class $controller The UpdateShiftController class.
     * @param string 'getUpdateShiftById' The method name in the UpdateShiftController class.
     */
    Route::get('getUpdateShiftById', [UpdateShiftController::class, 'getUpdateShiftById']);

    /**
     * Delete an update shift record.
     *
     * This route is used to delete an update shift record from the database.
     *
     * @param UpdateShiftController::class $controller The UpdateShiftController class.
     * @param  string  $method
     * @return \Illuminate\Http\Response
     */
    Route::delete('delete', [UpdateShiftController::class, 'delete']);

    /**
     * Update the shift for an update shift record.
     *
     * This route is used to update the shift for an update shift record in the database.
     *
     * @param UpdateShiftController::class $controller The UpdateShiftController class.
     * @param  string  $method
     * @return \Illuminate\Http\Response
     */
    Route::put('updateShift', [UpdateShiftController::class, 'updateShift']);
});
