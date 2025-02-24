<?php

use App\Http\Controllers\Payroll\StaffController;
use Illuminate\Support\Facades\Route;

Route::prefix('/payroll/staff')->group(function () {
    Route::get('/', [StaffController::class, 'index']);
    Route::get('getStaffById', [StaffController::class, 'getStaffById']);
    Route::post('save', [StaffController::class, 'saveStaff']);
    Route::get('getAllStaff', [StaffController::class, 'getAllStaff']);
    Route::get('getAllAgreement', [StaffController::class, 'getAllAgreement']);
    Route::get('getAllDesignation', [StaffController::class, 'getAllDesignation']);
    Route::get('getStaffDataTable', [StaffController::class, 'getStaffDataTable']);
    Route::put('updateStaffListStatus', [StaffController::class, 'updateStaffListStatus']);
});
