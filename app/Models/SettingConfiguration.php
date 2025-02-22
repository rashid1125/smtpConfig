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

/**
 * @method static value(string $FAILED_ATTEMPTS)
 */
class SettingConfiguration extends BaseModel
{
    public const SETTING_ID        = 'id';
    public const FAILED_ATTEMPTS   = 'failed_attempts';
    public const TOKEN_EXPIRY_DAYS = 'token_expiry_days';
    protected $fillable = [
        self::SETTING_ID,
        self::FAILED_ATTEMPTS,
        self::TOKEN_EXPIRY_DAYS
    ];
}