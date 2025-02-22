<?php
/**
 * File SupervisionTrait
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

use App\Exceptions\UserAlertException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

trait SupervisionTrait
{
    /**
     * Function hasSupervision
     *
     * @param string $etype
     *
     * @throws \App\Exceptions\UserAlertException
     *
     * @return bool|int
     */
    protected static function hasSupervision(string $etype): bool | int
    {
        if (empty($etype)) {
            throw new UserAlertException("No etype provided to check supervision.", 400);
        }
        $supervisionsTable = 'supervisions';
        if (Schema::hasTable($supervisionsTable) && Schema::hasColumn($supervisionsTable, 'supervision')) {
            $sql         = "CASE WHEN IFNULL(supervision, 'yes') = 'yes' THEN 0 ELSE 1 END";
            $isPostValue = DB::table($supervisionsTable)->where('etype', $etype)->value(DB::raw($sql));

            return $isPostValue ?? 1;
        }

        return false;
    }
}
