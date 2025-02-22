<?php
/**
 * File CanGetTableNameStatically
 *
 * @package   App\Traits
 *
 * @author    Rashid Rasheed <rashidrasheed1125@gmail.com>
 *
 * @copyright Shahid & Rashid (SR)
 * @version   1.0
 */
namespace App\Traits;

trait CanGetTableNameStatically
{
    /**
     * Function tableName
     *
     * @return mixed
     */
    public static function tableName(): mixed
    {
        return with(new static)->getTable();
    }

    /**
     * Function tableKey
     *
     * @return mixed
     */
    public static function tableKey(): mixed
    {
        return with(new static)->getKeyName();
    }

    /**
     * Function hasColumn
     *
     * @return mixed
     */
    public static function hasColumn(): mixed
    {
        return with(new static)->getFillable();
    }
}
