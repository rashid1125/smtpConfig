<?php
namespace App\Models;

class OtpDomain extends BaseModel
{
    public const OTP_DOMAIN_ID   = 'id';
    public const OTP_DOMAIN_NAME = 'name';
    public const OTP_DOMAIN_URL  = 'url';
    public const OTP_DOMAIN_ICON = 'icon';
    public const OTP_DOMAIN_TYPE = 'type';
    public const OTP_DOMAIN_DESC = 'description';
    public const OTP_DOMAIN_LOGO = 'logo';
    public const OTP_DOMAIN_CODE = 'code';
    protected $fillable = [
        self::OTP_DOMAIN_ID,
        self::OTP_DOMAIN_NAME,
        self::OTP_DOMAIN_URL,
        self::OTP_DOMAIN_ICON,
        self::OTP_DOMAIN_TYPE,
        self::OTP_DOMAIN_DESC,
        self::OTP_DOMAIN_LOGO,
        self::OTP_DOMAIN_CODE
    ];
    protected $hidden   = [
        self::OTP_DOMAIN_NAME,
        self::OTP_DOMAIN_CODE
    ];
}
