<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

trait SupervisionTrait
{
  protected static function hasSupervision($etype)
  {
    $supervisionsTable = 'supervisions';
    if (Schema::hasTable($supervisionsTable) && Schema::hasColumn($supervisionsTable, 'supervision')) {
      $isPostValue = DB::table($supervisionsTable)
        ->where('etype', $etype)
        ->value(DB::raw("CASE WHEN IFNULL(supervision, 'yes') = 'yes' THEN 0 ELSE 1 END"));

      return $isPostValue ?? 1;
    }
    return false;
  }
}
