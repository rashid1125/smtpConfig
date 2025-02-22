<?php
/**
 * File GetterSetterTrait
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

trait GetterSetterTrait
{
    private static ?string $eType;
    private static ?int    $financialYearId;
    private static ?int    $companyId;
    private static ?int    $userId;

    /**
     * Function getEType
     *
     * @return string|null
     */
    public static function getEType(): ?string
    {
        return self::$eType;
    }

    /**
     * Function setEType
     *
     * @param string|null $eType
     */
    public static function setEType(?string $eType): void
    {
        self::$eType = $eType;
    }

    /**
     * Function getFinancialYearId
     *
     * @return int|null
     */
    public static function getFinancialYearId(): ?int
    {
        return self::$financialYearId;
    }

    /**
     * Function setFinancialYearId
     *
     * @param int|null $financialYearId
     */
    public static function setFinancialYearId(?int $financialYearId): void
    {
        self::$financialYearId = $financialYearId;
    }

    /**
     * Function getCompanyId
     *
     * @return int|null
     */
    public static function getCompanyId(): ?int
    {
        return self::$companyId;
    }

    /**
     * Function setCompanyId
     *
     * @param int|null $companyId
     */
    public static function setCompanyId(?int $companyId): void
    {
        self::$companyId = $companyId;
    }

    /**
     * Function getUserId
     *
     * @return int|null
     */
    public static function getUserId(): ?int
    {
        return self::$userId;
    }

    /**
     * Function setUserId
     *
     * @param int|null $userId
     */
    public static function setUserId(?int $userId): void
    {
        self::$userId = $userId;
    }
}
