<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhiteListDomain extends BaseModel
{
    public const ID         = 'id';
    public const DOMAIN     = 'domain';
    public const STATUS     = 'status';
    public const CREATED_AT = 'created_at';
    public const UPDATED_AT = 'updated_at';
    public $fillable = [
        self::ID,
        self::DOMAIN,
        self::STATUS,
        self::CREATED_AT,
        self::UPDATED_AT,
    ];
}
