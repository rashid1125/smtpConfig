<?php
/**
 * File FunctionsTrait
 *
 * @package   App\Traits
 *
 * @author    Rashid Rasheed <rashidrasheed1125@gmail.com>
 *
 * @copyright Shahid & Rashid (SR)
 * @version   1.0
 */
declare(strict_types = 1);
namespace App\Traits;

use App\Events\ModelCreated;
use App\Events\ModelUpdated;
use App\Exceptions\UserAlertException;
use App\Models\WhiteListDomain;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;

trait FunctionsTrait
{
    /**
     * Function getDaysInMonth
     *
     * @param $month
     * @param $year
     *
     * @return int
     */
    public static function getDaysInMonth($month, $year): int
    {
        return Carbon::createFromDate($year, $month)->daysInMonth;
    }

    /**
     * Function handleBootedCreating
     *
     * @param $instance
     */
    protected static function handleBootedCreating($instance): void
    {
        self::handleCommonBootedLogic($instance);
        $instance->created_by = self::getUserId();
        $instance->created_at = Carbon::now();
        event(new ModelCreated($instance, $instance->toArray()));
    }

    /**
     * Function handleCommonBootedLogic
     *
     * @param $instance
     */
    private static function handleCommonBootedLogic($instance): void
    {
        self::parseAndSetDate($instance, 'vrdate');
        self::parseAndSetDate($instance, 'from_date');
        self::parseAndSetDate($instance, 'to_date');
        self::parseAndSetDate($instance, 'due_date');
        self::parseAndSetDate($instance, 'bilty_date');
        $instance->uid        = self::getUserId();
        $instance->company_id = self::getCompanyId();
        if (Schema::hasColumn(static::tableName(), 'fn_id')) {
            $instance->fn_id = self::getFinancialYearId();
        }
        if (Schema::hasColumn(static::tableName(), 'financial_year_id')) {
            $instance->financial_year_id = self::getFinancialYearId();
        }
        if (Schema::hasColumn(static::tableName(), 'is_post')) {
            $instance->is_post = static::hasSupervision(static::tableName());
        }
    }

    /**
     * Function parseAndSetDate
     *
     * @param $instance
     * @param $property
     */
    private static function parseAndSetDate($instance, $property): void
    {
        if (isset($instance->$property) && $instance->$property) {
            $instance->$property = self::parseDate($instance->$property) ?? Carbon::now();
        } elseif (isset($instance->$property)) {
            $instance->$property = Carbon::now();
        }
    }

    /**
     * Function handleBootedUpdating
     *
     * @param $instance
     */
    protected static function handleBootedUpdating($instance): void
    {
        self::handleCommonBootedLogic($instance);
        $instance->updated_by = self::getUserId();
        $instance->updated_at = Carbon::now();
        event(new ModelUpdated($instance, $instance->toArray()));
    }

    /**
     * Function doesEtypeMatchTableName
     *
     * @param string $etype
     * @param        $instance
     *
     * @throws \App\Exceptions\UserAlertException
     * @return bool
     */
    protected static function doesEtypeMatchTableName(string $etype, $instance): bool
    {
        if (! method_exists($instance, 'tableName')) {
            throw new UserAlertException("The method 'tableName' is not defined or the given model does not extend from BaseModel.", 400);
        }
        $etype   = strtolower($etype);
        $tblName = strtolower($instance::tableName());
        if ($tblName === $etype) {
            return true;
        }

        return false;
    }

    /**
     * Function verifyEmail
     *
     * @param array $emails
     *
     * @throws \App\Exceptions\UserAlertException
     *
     * @return bool
     */
    public function verifyEmail(array $emails): bool
    {
        if (empty($emails)) {
            throw new UserAlertException("Email list cannot be empty", 400);
        }
        $whitelistedDomains = WhiteListDomain::pluck('domain')->toArray();
        foreach ($emails as $email) {
            if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new UserAlertException("Invalid email format: {$email}", 400);
            }
            $domain = substr(strrchr($email, "@"), 1);
            if (! in_array($domain, $whitelistedDomains)) {
                throw new UserAlertException("Invalid email host : {$email}", 400);
            }
            $domain = substr(strrchr($email, "@"), 1);
            if (! $this->domainHasMXRecord($domain)) {
                throw new UserAlertException("Invalid email domain: {$email}", 400);
            }
        }

        return true;
    }

    /**
     * Function domainHasMXRecord
     *
     * @param string $domain
     *
     * @return bool
     */
    private function domainHasMXRecord(string $domain): bool
    {
        $records = dns_get_record($domain, DNS_MX);

        return ! empty($records);
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
     * Function convertToCamelCase
     *
     * @param string $key
     *
     * @return string
     */
    protected function convertToCamelCase(string $key): string
    {
        $key = str_replace(' ', '', ucwords(str_replace('_', ' ', $key)));

        return lcfirst($key);
    }

    /**
     * Function convertCamelCaseToReadable
     *
     * @param string $key
     *
     * @return string
     */
    protected function convertCamelCaseToReadable(string $key): string
    {
        return ucfirst(preg_replace('/([a-z])([A-Z])/', '$1 $2', $key));
    }

    /**
     * Function convertUnderscoreToReadable
     *
     * @param string $key
     *
     * @return string
     */
    protected function convertUnderscoreToReadable(string $key): string
    {
        return ucwords(str_replace('_', ' ', $key));
    }

    /**
     * Function getDuration
     *
     * @param $fromDate
     * @param $toDate
     *
     * @return float
     */
    protected function getDuration($fromDate, $toDate): float
    {
        $startDate = Carbon::parse($fromDate);
        $endDate   = Carbon::parse($toDate);

        return $startDate->diffInDays($endDate);
    }
}