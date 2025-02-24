<?php



use App\Http\Controllers\Payroll\ShiftController;
use Illuminate\Support\Facades\Route;

Route::prefix('/shift')->group(function () {
  Route::get('/', [ShiftController::class, 'index']);
  Route::post('save', [ShiftController::class, 'saveShift'])->name('shift.save');
  Route::get('fetch', [ShiftController::class, 'fetch'])->name('shift.fetch');
  Route::get('getShiftDataTable', [ShiftController::class, 'getShiftDataTable']);
  Route::get('getAllShift', [ShiftController::class, 'getAllShift']);
});
