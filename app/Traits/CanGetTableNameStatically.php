<?php

namespace App\Traits;

trait CanGetTableNameStatically
{
  public static function tableName()
  {
    return with(new static)->getTable();
  }

  public static function tableKey()
  {
    return with(new static)->getKeyName();
  }
}
