

<?php
// AttendanceRoute.php
use App\Http\Controllers\Payroll\AttendanceController;
use Illuminate\Support\Facades\Route;

/**
 * Route for managing attendance in the payroll module.
 */
Route::prefix('/payroll/attendance')->group(function () {
    /**
     * Display the attendance index page.
     *
     * @param \App\Http\Controllers\Payroll\AttendanceController $controller
     * @return \Illuminate\Contracts\View\View
     */
    Route::get('/', [AttendanceController::class, 'index']);

    /**
     * Get the attendance status.
     *
     * @route GET /getAttendanceStatus
     * @param AttendanceController $controller The AttendanceController instance.
     * @return mixed The result of the getAttendanceStatus method.
     */
    Route::get('getAttendanceStatus', [AttendanceController::class, 'getAttendanceStatus']);

    /**
     * Save the attendance record.
     *
     * @param  \App\Http\Controllers\Payroll\AttendanceController  $controller
     * @param  string  $method
     * @return \Illuminate\Routing\Route
     */
    Route::post('save', [AttendanceController::class, 'save']);

    /**
     * Route to get the attendance data table.
     *
     * @param  \App\Http\Controllers\Payroll\AttendanceController  $controller
     * @param  string  $method
     * @return \Illuminate\Routing\Route
     */
    Route::get('getAttendanceDataTable', [AttendanceController::class, 'getAttendanceDataTable']);

    /**
     * Get the attendance list by departments.
     *
     * @route GET /getStaffListByDepartments
     * @param AttendanceController::class $controller The AttendanceController class.
     * @param 'getStaffListByDepartments' $method The method name.
     * @return void
     */
    Route::get('getStaffListByDepartments', [AttendanceController::class, 'getStaffListByDepartments']);

    /**
     * Route to get attendance by ID.
     *
     * @route GET /getAttendanceById
     * @param AttendanceController::class $controller The AttendanceController class.
     * @param string 'getAttendanceById' The method name in the AttendanceController class.
     */
    Route::get('getAttendanceById', [AttendanceController::class, 'getAttendanceById']);

    /**
     * Delete an attendance record.
     *
     * This route is used to delete an attendance record from the database.
     *
     * @param AttendanceController::class $controller The AttendanceController class.
     * @param  string  $method
     * @return \Illuminate\Http\Response
     */
    Route::delete('delete', [AttendanceController::class, 'delete']);
});
