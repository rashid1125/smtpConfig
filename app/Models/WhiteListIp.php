<?php
namespace App\Models;

class WhiteListIp extends BaseModel
{
    public const ID         = 'id';
    public const IP_ADDRESS = 'ip_address';
    public const STATUS     = 'status';
    public const CREATED_AT = 'created_at';
    public const UPDATED_AT = 'updated_at';
    
    public $fillable = [
        self::ID,
        self::IP_ADDRESS,
        self::STATUS,
        self::CREATED_AT,
        self::UPDATED_AT,
    ];
    
    /**
     * Check if an IP address is whitelisted
     *
     * @param string $ipAddress
     * @return bool
     */
    public static function isWhitelisted(string $ipAddress): bool
    {
        return self::where([
            self::IP_ADDRESS => $ipAddress,
            self::STATUS => 1
        ])->exists();
    }
    
    /**
     * Get all whitelisted IPs
     *
     * @return array
     */
    public static function getAllWhitelistedIps(): array
    {
        return self::where(self::STATUS, 1)
            ->pluck(self::IP_ADDRESS)
            ->toArray();
    }
}
