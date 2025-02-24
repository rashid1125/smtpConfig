

<?php

use App\Http\Controllers\Payroll\StaffAdvanceController;
use Illuminate\Support\Facades\Route;

Route::prefix('/payroll/staff-advance')->group(function () {
    Route::get('/', [StaffAdvanceController::class, 'index']);
    Route::post('save', [StaffAdvanceController::class, 'save']);
    Route::get('getStaffAdvanceById', [StaffAdvanceController::class, 'getStaffAdvanceById']);
    Route::get('getStaffAdvanceDataTable', [StaffAdvanceController::class, 'getStaffAdvanceDataTable']);
    Route::delete('delete', [StaffAdvanceController::class, 'delete']);
});
