<?php

use App\Http\Controllers\Payroll\StaffDepartmentController;
use Illuminate\Support\Facades\Route;

Route::prefix('/payroll/department')->group(function () {
    /**
     * Route to retrieve the index page of the staff department.
     */
    Route::get('/', [StaffDepartmentController::class, 'index']);

    /**
     * Route to retrieve a specific staff department by its ID.
     */
    Route::get('getStaffDepartmentById', [StaffDepartmentController::class, 'getStaffDepartmentById']);

    /**
     * Route to save a new staff department.
     */
    Route::post('saveStaffDepartment', [StaffDepartmentController::class, 'saveStaffDepartment']);

    /**
     * Route to retrieve all staff departments.
     */
    Route::get('getAllStaffDepartment', [StaffDepartmentController::class, 'getAllStaffDepartment']);

    /**
     * Route to retrieve staff departments for data table.
     */
    Route::get('getStaffDepartmentDataTable', [StaffDepartmentController::class, 'getStaffDepartmentDataTable']);

    /**
     * Route to update the status of a staff department list.
     */
    Route::put('updateStaffDepartmentListStatus', [StaffDepartmentController::class, 'updateStaffDepartmentListStatus']);
});
