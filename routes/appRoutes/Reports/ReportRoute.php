<?php

use App\Http\Controllers\AgingSheetController;
use App\Http\Controllers\DocController;
use App\Http\Controllers\ReportDynamically\ReportCombinationController;
use App\Http\Controllers\ReportDynamically\ReportComponentController;
use App\Http\Controllers\ReportDynamically\ReportController;
use App\Http\Controllers\ReportDynamically\ReportDynamicallyController;
use App\Http\Controllers\ReportDynamically\ReportFilterController;
use App\Http\Controllers\ReportDynamically\ReportGroupController;
use Illuminate\Support\Facades\Route;

Route::prefix('/report_new')->group(function () {
    Route::get('getReportId', [ReportController::class, 'index']);
    Route::get('getRequestNameReportId', [ReportController::class, 'getRequestNameReportId']);
});
Route::prefix('/reportComponent')->group(function () {
    Route::get('getAllReportComponent', [ReportComponentController::class, 'getAllReportComponent']);
});
Route::prefix('/reportGroup')->group(function () {
    Route::get('getAllReportGroup', [ReportGroupController::class, 'getAllReportGroup']);
});
Route::prefix('/reportFilter')->group(function () {
    Route::get('getAllReportFilter', [ReportFilterController::class, 'getAllReportFilter']);
});
Route::prefix('/reportCombination')->group(function () {
    Route::get('getThisReportCombinationAsDefault', [ReportCombinationController::class, 'getThisReportCombinationAsDefault']);
    Route::post('saveThisReportCombinationAsDefault', [ReportCombinationController::class, 'saveThisReportCombinationAsDefault']);
});
Route::get('doc/getReportId', [DocController::class, 'getReportId']);
Route::prefix('report_dynamically')->group(function () {
    Route::get('/', [ReportDynamicallyController::class, 'index']);
    Route::post('save', [ReportDynamicallyController::class, 'save']);
    Route::get('getReportDynamicallyById', [ReportDynamicallyController::class, 'getReportDynamicallyById']);
    Route::get('fetchAllRecord', [ReportDynamicallyController::class, 'fetchAllRecord']);
});
Route::prefix('agingSheet')->group(function () {
    Route::get('/', [AgingSheetController::class, 'index']);
    Route::get('getAgingSheet', [AgingSheetController::class, 'getAgingSheet']);
});
Route::get('cashFlow', [ReportController::class, 'cashFlow']);
