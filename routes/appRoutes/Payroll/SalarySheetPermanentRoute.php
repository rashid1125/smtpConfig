<?php

// File: routes/appRoutes/Payroll/SalarySheetPermanentRoute.php

use App\Http\Controllers\Payroll\SalarySheetPermanentController;
use Illuminate\Support\Facades\Route;

/**
 * Routes for the Salary Sheet Permanent feature in the Payroll module.
 */
Route::prefix('/payroll/salarySheetPermanent')->group(function () {
    /**
     * Display the index page for the Salary Sheet Permanent feature.
     *
     * @param \App\Http\Controllers\Payroll\SalarySheetPermanentController::class $controller
     * @param string                                                              $method
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    Route::get('/', [ SalarySheetPermanentController::class, 'index' ]);

    /**
     * Get the salary sheet permanent.
     *
     * @route GET /getSalarySheetPermanent
     *
     * @param \App\Http\Controllers\Payroll\SalarySheetPermanentController::class $controller
     * @param string                                                              $method The method to be called in the controller.
     */
    Route::get('getSalarySheetPermanent', [ SalarySheetPermanentController::class, 'getSalarySheetPermanent' ]);

    /**
     * Create a new salary sheet permanent.
     *
     * @route POST /salarySheetPermanent
     *
     * @param \App\Http\Controllers\Payroll\SalarySheetPermanentController::class $controller
     * @param string                                                              $method The method to be called in the controller.
     */
    Route::post('saveSalarySheetPermanent', [ SalarySheetPermanentController::class, 'saveSalarySheetPermanent' ]);


    Route::get('getSalarySheetPermanentDataTable', [ SalarySheetPermanentController::class, 'getSalarySheetPermanentDataTable' ]);

    Route::get('getSalarySheetPermanentById', [ SalarySheetPermanentController::class, 'getSalarySheetPermanentById' ]);

    Route::delete('delete', [ SalarySheetPermanentController::class, 'delete' ]);
});
