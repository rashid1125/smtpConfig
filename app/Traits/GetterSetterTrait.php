<?php

namespace App\Traits;

trait GetterSetterTrait
{
    private static $eType;
    private static $financialYearId;
    private static $companyId;
    private static $userId;

    public static function setEType(?string $eType): void
    {
        self::$eType = $eType;
    }

    public static function getEType(): ?string
    {
        return self::$eType;
    }

    public static function setFinancialYearId(?int $financialYearId): void
    {
        self::$financialYearId = $financialYearId;
    }

    public static function getFinancialYearId(): ?int
    {
        return self::$financialYearId;
    }

    public static function setCompanyId(?int $companyId): void
    {
        self::$companyId = $companyId;
    }

    public static function getCompanyId(): ?int
    {
        return self::$companyId;
    }

    public static function setUserId(?int $userId): void
    {
        self::$userId = $userId;
    }

    public static function getUserId(): ?int
    {
        return self::$userId;
    }
}
