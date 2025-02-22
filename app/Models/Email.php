<?php
namespace App\Models;

use Illuminate\Support\Facades\Crypt;
use JetBrains\PhpStorm\ArrayShape;

class Email extends BaseModel
{
    public const EMAIL_ID         = 'id';
    public const EMAIL_PROTOCOL   = 'protocol';
    public const EMAIL_HOST       = 'host';
    public const EMAIL_PORT       = 'port';
    public const EMAIL_USERNAME   = 'username';
    public const EMAIL_PASSWORD   = 'password';
    public const EMAIL_ENCRYPTION = 'encryption';
    public const EMAIL_FROM_EMAIL = 'from_email';
    public const EMAIL_DOMAIN_IDS = 'domain_ids';
    protected $fillable = [
        self::EMAIL_ID,
        self::EMAIL_PROTOCOL,
        self::EMAIL_HOST,
        self::EMAIL_PORT,
        self::EMAIL_USERNAME,
        self::EMAIL_PASSWORD,
        self::EMAIL_ENCRYPTION,
        self::EMAIL_FROM_EMAIL,
        self::EMAIL_DOMAIN_IDS
    ];
    protected $hidden   = [
        self::EMAIL_PASSWORD
    ];

    /**
     * Function Rules
     *
     * @return string[]
     */
    #[ArrayShape(["\App\Models\Email::EMAIL_PROTOCOL" => "string", "\App\Models\Email::EMAIL_HOST" => "string", "\App\Models\Email::EMAIL_PORT" => "string", "\App\Models\Email::EMAIL_USERNAME" => "string", "\App\Models\Email::EMAIL_PASSWORD" => "string", "\App\Models\Email::EMAIL_FROM_EMAIL" => "string"])]
    public static function Rules($data): array
    {
        return [
            self::EMAIL_PROTOCOL   => 'required',
            self::EMAIL_HOST       => 'required',
            self::EMAIL_PORT       => 'required',
            self::EMAIL_USERNAME   => 'required|email|max:255|regex:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/|unique:emails,username,' . $data['id'] . ',id',
            self::EMAIL_PASSWORD   => 'required|min:8|max:255',
            self::EMAIL_FROM_EMAIL => 'required'
        ];
    }

    /**
     * Function RulesMessage
     *
     * @return string[]
     */
    #[ArrayShape(["\App\Models\Email::EMAIL_PROTOCOL.required" => "string", "\App\Models\Email::EMAIL_HOST.required" => "string", "\App\Models\Email::EMAIL_PORT.required" => "string", "\App\Models\Email::EMAIL_USERNAME.required" => "string", "\App\Models\Email::EMAIL_USERNAME.unique" => "string", "\App\Models\Email::EMAIL_USERNAME.email" => "string", "\App\Models\Email::EMAIL_USERNAME.max" => "string", "\App\Models\Email::EMAIL_USERNAME.regex" => "string", "\App\Models\Email::EMAIL_PASSWORD.required" => "string", "\App\Models\Email::EMAIL_PASSWORD.min" => "string", "\App\Models\Email::EMAIL_PASSWORD.max" => "string", "\App\Models\Email::EMAIL_PASSWORD.regex" => "string", "\App\Models\Email::EMAIL_FROM_EMAIL.required" => "string"])]
    public static function RulesMessage(): array
    {
        return [
            self::EMAIL_PROTOCOL . '.required'   => 'The protocol field is required.',
            self::EMAIL_HOST . '.required'       => 'The host field is required.',
            self::EMAIL_PORT . '.required'       => 'The port field is required.',
            self::EMAIL_USERNAME . '.required'   => 'The username field is required.',
            self::EMAIL_USERNAME . '.unique'     => 'The username has already been taken.',
            self::EMAIL_USERNAME . '.email'      => 'The username must be a valid email address.',
            self::EMAIL_USERNAME . '.max'        => 'The username may not be greater than 255 characters.',
            self::EMAIL_USERNAME . '.regex'      => 'The username format is invalid.',
            self::EMAIL_PASSWORD . '.required'   => 'The password field is required.',
            self::EMAIL_PASSWORD . '.min'        => 'The password must be at least 8 characters.',
            self::EMAIL_PASSWORD . '.max'        => 'The password may not be greater than 255 characters.',
            self::EMAIL_FROM_EMAIL . '.required' => 'The from email field is required.'
        ];
    }

    /**
     * Function setEmailPasswordAttribute
     *
     * @param $value
     */
    public function setEmailPasswordAttribute($value): void
    {
        $this->attributes[self::EMAIL_PASSWORD] = Crypt::encryptString($value);
    }

    /**
     * Function getEmailPasswordAttribute
     *
     * @param $value
     *
     * @return string
     */
    public function getEmailPasswordAttribute($value): string
    {
        return Crypt::decrypt($value);
    }
}
