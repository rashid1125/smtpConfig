<?php
namespace App\Http\Controllers;

use App\Exceptions\UserAlertException;
use App\Traits\BaseHandlingTrait;
use App\Utilities\LoadDataBaseTableDefaultSchema;
use Carbon\Carbon;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, BaseHandlingTrait;

    /**
     * Function initializeUserSessionContext
     *
     * @return void
     */
    protected function initializeUserSessionContext(): void
    {
        $this->setUserId(Session::get('uid'));
        $this->setFinancialYearId(Session::get('fn_id'));
        $this->setCompanyId(Session::get('company_id'));
    }

    /**
     * Function isJson
     *
     * @param $string
     *
     * @return bool
     */
    protected function isJson($string): bool
    {
        json_decode($string);

        return (json_last_error() == JSON_ERROR_NONE);
    }

    /**
     * Function numVal
     *
     * @param     $val
     * @param int $rounding
     *
     * @return float
     */
    protected function numVal($val, int $rounding = 0): float
    {
        return round(floatval($val), $rounding);
    }

    /**
     * Function hasVoucherRights
     *
     * @param $rightsType
     * @param $rightsName
     *
     * @return mixed
     */
    protected function hasVoucherRights($rightsType, $rightsName): mixed
    {
        return getValidRoleGroupUserPermissions($rightsType, $rightsName);
    }

    /**
     * Function loadErrorPage
     *
     * @param array $instance
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    protected function loadErrorPage(array $instance = []): Factory | View | Application
    {
        return view('layouts.page_404', ['instance' => $instance]);
    }

    /**
     * Function ValidatorByObject
     *
     * @param $objectData
     * @param $instance
     * @param $obj
     *
     * @throws \App\Exceptions\UserAlertException
     */
    protected function ValidatorByObject($objectData, $instance, $obj): void
    {
        $validator = Validator::make($objectData, $instance::Rules($obj), $instance::RulesMessage());
        if ($validator->fails()) {
            $errors       = $validator->errors()->all();
            $errorMessage = implode("<br>", $errors);
            throw new UserAlertException($errorMessage, 500);
        }
    }

    protected function getPrimaryKeyValueIfPresent(array | object $data, string $keyName): mixed
    {
        return $data[$keyName] ?? null;
    }

    /**
     * Function setDataBaseTableDefaultValues
     *
     * @param array         $data
     * @param string|object $instance
     */
    protected function setDataBaseTableDefaultValues(array &$data, string | object $instance): void
    {
        LoadDataBaseTableDefaultSchema::setDataBaseTableDefaultValues($data, $instance::tableName());
    }
}
