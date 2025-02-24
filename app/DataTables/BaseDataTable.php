<?php

namespace App\DataTables;

use App\Traits\ExceptionHandlingTrait;
use Yajra\DataTables\Services\DataTable;
use Carbon\Carbon;
use App\Enums\ActiveEnums;

/**
 * Abstract class BaseDataTable.
 * Provides common functionality for DataTables.
 */
abstract class BaseDataTable extends DataTable
{
    use ExceptionHandlingTrait;

    protected $model;
    protected $companyId;
    protected $financialYearId;
    protected $fromDate;
    protected $toDate;
    protected $searchValue;

    /**
     * BaseDataTable constructor.
     * Initializes common properties for DataTables.
     *
     * @param mixed $model The Eloquent model associated with this DataTable.
     * @param int $companyId Company ID for filtering results.
     * @param int $financialYearId Financial Year ID for filtering results.
     * @param string|null $fromDate Starting date filter.
     * @param string|null $toDate Ending date filter.
     * @param string|null $searchValue Search query for filtering results.
     */
    public function __construct($model, $companyId, $financialYearId, $fromDate = null, $toDate = null, $searchValue = null)
    {
        $this->model           = $model;
        $this->companyId       = $companyId;
        $this->financialYearId = $financialYearId;
        $this->fromDate        = $this->parseDate($fromDate);
        $this->toDate          = $this->parseDate($toDate);
        $this->searchValue     = $searchValue;
    }

    /**
     * Parses a date string to a standard format.
     *
     * @param string|null $date Date string to be parsed.
     * @return string|null Formatted date string or null if input is null.
     */
    protected function parseDate(?string $date): ?string
    {
        return $date ? Carbon::parse($date)->format('Y-m-d') : null;
    }

    /**
     * Abstract method to build the DataTable.
     * Must be implemented by child classes.
     *
     * @param mixed $query Query or model instance for DataTable source.
     * @return \Yajra\DataTables\DataTableAbstract DataTable instance.
     */
    abstract public function dataTable($query);

    /**
     * Abstract method to define the query source of the DataTable.
     * Must be implemented by child classes.
     *
     * @param mixed ...$params Additional parameters for query customization.
     */
    abstract public function query(...$params);

    /**
     * Applies a transformation to the specified column.
     * Transforms values to 'Yes' or 'No'.
     *
     * @param mixed $query Query or model instance for DataTable source.
     * @param string $columnName Name of the column to transform.
     * @return \Yajra\DataTables\DataTableAbstract DataTable instance with modified column.
     */
    public function transformActiveColumn($query, $columnName = 'active')
    {
        return datatables()->eloquent($query)
            ->editColumn($columnName, function ($item) use ($columnName) {
                return $item->$columnName == 1 ? ActiveEnums::YES : ActiveEnums::NO;
            });
    }
}
