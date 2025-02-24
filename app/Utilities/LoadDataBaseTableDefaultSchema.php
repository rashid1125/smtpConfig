<?php
// app/Utilities/LoadDataBaseTableDefaultSchema.php
namespace App\Utilities;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

final class LoadDataBaseTableDefaultSchema
{
  /**
   * Registers a Doctrine type mapping.
   */
  public static function registerDoctrineTypeMapping()
  {
    DB::connection()
      ->getDoctrineSchemaManager()
      ->getDatabasePlatform()
      ->registerDoctrineTypeMapping('enum', 'string');
  }
  public static function getDataBaseTableDefaultValues($tableName)
  {
    $defaultValues = [];
    $columns = Schema::getColumnListing($tableName);

    foreach ($columns as $column) {
      $columnType = DB::connection()->getDoctrineColumn($tableName, $column);
      $defaultValues[$column] = $columnType->getDefault();
    }

    return $defaultValues;
  }

  public static function setDataBaseTableDefaultValues(array &$data, $tableName)
  {
    self::registerDoctrineTypeMapping();
    $defaultValues = self::getDataBaseTableDefaultValues($tableName);
    // Check if data is a multi-dimensional array
    if (self::isMultiDimensionalArray($data)) {
      foreach ($data as &$subArray) {
        if (is_array($subArray)) {
          self::applyDefaultValuesToSingleLevelArray($subArray, $defaultValues);
        }
      }
    } else {

      self::applyDefaultValuesToSingleLevelArray($data, $defaultValues);
    }
  }
  /**
   * Applies default values to a single-level array.
   *
   * @param array &$array The single-level array.
   * @param array $defaultValues The default values.
   */
  private static function applyDefaultValuesToSingleLevelArray(array &$array, array $defaultValues)
  {
    foreach ($defaultValues as $column => $defaultValue) {
      if (self::shouldSetValue($array, $column, $defaultValue)) {
        $array[$column] = $defaultValue;
      }
    }
  }
  /**
   * Checks if an array is multi-dimensional.
   *
   * @param array $array The array to check.
   * @return bool True if array is multi-dimensional, false otherwise.
   */
  private static function isMultiDimensionalArray(array $array)
  {
    foreach ($array as $element) {
      if (is_array($element)) {
        return true;
      }
    }
    return false;
  }

  private static function shouldSetValue($data, $column, $defaultValue)
  {
    // Check if the value is set and not null. If set, no need to apply default.
    if (isset($data[$column]) && $data[$column] !== null) {
      // Special case for 'null' string.
      if (is_string($data[$column]) && strtolower($data[$column]) === "null") {
        return true; // Apply default value when explicitly 'null'.
      }
      // Special handling for empty strings, considering when NOT to apply default.
      if (is_string($data[$column]) && trim($data[$column]) === '') {
        // Apply default if default value is not empty, otherwise consider it set.
        return $defaultValue !== '';
      }
      // For numeric default values, check if the current value is not numeric and default is numeric.
      if (is_numeric($defaultValue) && !is_numeric($data[$column])) {
        return true; // Apply default value if current value is not numeric but should be.
      }

      // If none of the special conditions are met, the value is considered set appropriately.
      return false;
    }

    // The column is not set or is null, so the default value should be applied.
    return true;
  }
}
