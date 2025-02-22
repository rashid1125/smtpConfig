<?php
/**
 * File LoadDataBaseTableDefaultSchema
 *
 * @package   App\Utilities\LoadDataBaseTableDefaultSchema
 *
 * @author    Rashid Rasheed <rashidrasheed1125@gmail.com>
 *
 * @copyright Shahid & Rashid (SR)
 * @version   1.0
 */
declare(strict_types = 1);
namespace App\Utilities;

use Illuminate\Support\Facades\DB;

final class LoadDataBaseTableDefaultSchema
{
    /**
     * Function setDataBaseTableDefaultValues
     *
     * @param array  $data
     * @param string $tableName
     */
    public static function setDataBaseTableDefaultValues(array &$data, string $tableName): void
    {
        $defaultValues = self::getDataBaseTableDefaultValues($tableName);
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
     * Function getDataBaseTableDefaultValues
     *
     * @param string $tableName
     *
     * @return array
     */
    public static function getDataBaseTableDefaultValues(string $tableName): array
    {
        $defaultValues = [];
        $query         = "select COLUMN_NAME, COLUMN_DEFAULT, DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA = database() and TABLE_NAME = ?";
        $columns       = DB::select($query, [$tableName]);
        foreach ($columns as $column) {
            $defaultValues[$column->COLUMN_NAME] = [
                'default' => $column->COLUMN_DEFAULT,
                'type'    => $column->DATA_TYPE,
            ];
        }

        return $defaultValues;
    }

    /**
     * Function isMultiDimensionalArray
     *
     * @param array $array
     *
     * @return bool
     */
    private static function isMultiDimensionalArray(array $array): bool
    {
        foreach ($array as $element) {
            if (is_array($element)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Function applyDefaultValuesToSingleLevelArray
     *
     * @param array $array
     * @param array $defaultValues
     */
    private static function applyDefaultValuesToSingleLevelArray(array &$array, array $defaultValues): void
    {
        foreach ($defaultValues as $column => $meta) {
            $defaultValue    = $meta['default'];
            $dataType        = $meta['type'];
            $normalizedValue = self::normalizeDefaultValue($defaultValue, $dataType);
            if (self::shouldSetValue($array, $column, $normalizedValue)) {
                $array[$column] = $normalizedValue;
            }
        }
    }

    /**
     * Normalize the default value based on the column's data type.
     *
     * @param mixed  $defaultValue
     * @param string $dataType
     *
     * @return mixed
     */
    private static function normalizeDefaultValue(mixed $defaultValue, string $dataType): mixed
    {
        if ($defaultValue === 'NULL' || $defaultValue === null) {
            return null;
        }

        return match ($dataType) {
            'int', 'bigint', 'smallint', 'tinyint'                     => (int)$defaultValue,
            'decimal', 'float', 'double'                               => (float)$defaultValue,
            'varchar', 'char', 'text', 'date', 'datetime', 'timestamp' => (string)$defaultValue,
            default                                                    => $defaultValue,
        };
    }

    /**
     * Function shouldSetValue
     *
     * @param array|object $data
     * @param string       $column
     * @param mixed        $defaultValue
     *
     * @return bool
     */
    private static function shouldSetValue(array | object $data, string $column, mixed $defaultValue): bool
    {
        if (! empty($data[$column])) {
            if (! validateValue($data[$column])) {
                return true;
            }

            return false;
        }

        return true;
    }
}
