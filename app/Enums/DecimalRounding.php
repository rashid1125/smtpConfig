<?php
// app/Enums/DecimalRounding.php

namespace App\Enums;

use App\Models\SettingConfiguration;

class DecimalRounding
{
  private static $isInitialized = false;
  private static $QTY_ROUNDING;
  private static $WEIGHT_ROUNDING;
  private static $RATE_ROUNDING;
  private static $AMOUNT_ROUNDING;

  public static function init()
  {
    if (!self::$isInitialized) {
      $settingConfigur = SettingConfiguration::first();
      self::$QTY_ROUNDING = $settingConfigur->qty_rounding;
      self::$WEIGHT_ROUNDING = $settingConfigur->weight_rounding;
      self::$RATE_ROUNDING = $settingConfigur->rate_rounding;
      self::$AMOUNT_ROUNDING = $settingConfigur->setting_decimal;

      self::$isInitialized = true;
    }
  }

  public static function getQtyRounding()
  {
    self::init();
    return self::$QTY_ROUNDING;
  }

  public static function getWeightRounding()
  {
    self::init();
    return self::$WEIGHT_ROUNDING;
  }
  public static function getRateRounding()
  {
    self::init();
    return self::$RATE_ROUNDING;
  }
  public static function getAmountRounding()
  {
    self::init();
    return self::$AMOUNT_ROUNDING;
  }
}
