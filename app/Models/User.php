<?php
namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @method static where(string $string, mixed $email)
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public const USER_ID                = 'id';
    public const USER_NAME              = 'name';
    public const USER_USERNAME          = 'username';
    public const USER_EMAIL             = 'email';
    public const USER_PASSWORD          = 'password';
    public const USER_FAILED_ATTEMPTS   = 'failed_attempts';
    public const USER_COMPANY_ID        = 'company_id';
    public const USER_REMEMBER_TOKEN    = 'remember_token';
    public const USER_EMAIL_VERIFIED_AT = 'email_verified_at';
    public const USER_CREATED_AT        = 'created_at';
    protected $fillable = [
        self::USER_NAME,
        self::USER_USERNAME,
        self::USER_EMAIL,
        self::USER_PASSWORD,
        self::USER_FAILED_ATTEMPTS,
        self::USER_COMPANY_ID,
        self::USER_REMEMBER_TOKEN
    ];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function getUserSelectedColumns(User $user): array
    {
        return $user->only(['username', 'email', 'token']);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }
}
