<?php
/**
 * File ${FILE_NAME}
 *
 * @package   App\Models
 *
 * @author    Rashid Rasheed <rashidrasheed1125@gmail.com>
 *
 * @copyright Digitalsofts (DS)
 * @version   1.0
 */
namespace App\Models;

class Company extends BaseModel
{
    public const COMPANY_ID          = 'id';
    public const COMPANY_NAME        = 'name';
    public const CONTACT_PERSON      = 'contact_person';
    public const COMPANY_STATUS      = 'status';
    public const COMPANY_EXPIRY_DATE = 'expiry_date';
    protected $fillable = [
        self::COMPANY_ID,
        self::COMPANY_NAME,
        self::CONTACT_PERSON,
        self::COMPANY_STATUS,
        self::COMPANY_EXPIRY_DATE
    ];
}