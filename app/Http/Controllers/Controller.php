<?php
namespace App\Http\Controllers;

use App\Exceptions\UserAlertException;
use App\Traits\BaseHandlingTrait;
use App\Utilities\LoadDataBaseTableDefaultSchema;
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

    /**
     * Function getPrimaryKeyValueIfPresent
     *
     * @param array|object $data
     * @param string       $keyName
     *
     * @return mixed
     */
    protected function getPrimaryKeyValueIfPresent($data, string $keyName)
    {
        return $data[$keyName] ?? null;
    }

    /**
     * Function setDataBaseTableDefaultValues
     *
     * @param array         $data
     * @param string|object $instance
     */
    protected function setDataBaseTableDefaultValues(array &$data, $instance): void
    {
        LoadDataBaseTableDefaultSchema::setDataBaseTableDefaultValues($data, $instance::tableName());
    }
}