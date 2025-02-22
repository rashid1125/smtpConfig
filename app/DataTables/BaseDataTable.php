<?php
/**
 * Class BaseDataTable
 *
 * @package   App\DataTables
 *
 * @author    Rashid Rasheed <rashidrasheed1125@gmail.com>
 *
 * @copyright Shahid && Rashid (SR)
 * @version   1.0
 */
namespace App\DataTables;

use App\Enums\ActiveEnums;
use App\Traits\ExceptionHandlingTrait;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Yajra\DataTables\Services\DataTable;

/**
 * Abstract class BaseDataTable.
 * Provides common functionality for DataTables.
 */
abstract class BaseDataTable extends DataTable
{
    use ExceptionHandlingTrait;

    protected Model         $model;
    protected int           $companyId;
    protected string | null $fromDate;
    protected string | null $toDate;
    protected mixed         $searchValue;

    /**
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param int                                 $companyId
     * @param                                     ...$arrays
     */
    public function __construct(Model $model, int $companyId, ...$arrays)
    {
        parent::__construct();
        $this->model     = $model;
        $this->companyId = $companyId;
        [$searchValue] = $arrays;
        $this->searchValue = $searchValue;
    }

    /**
     * Function dataTable
     *
     * @param $query
     *
     * @return mixed
     */
    abstract public function dataTable($query): mixed;

    /**
     * Function query
     *
     * @param ...$params
     *
     * @return mixed
     */
    abstract public function query(...$params): mixed;

    /**
     * Function transformActiveColumn
     *
     * @param $query
     * @param $columnName
     *
     * @throws \Yajra\DataTables\Exceptions\Exception
     *
     * @return \Yajra\DataTables\EloquentDataTable
     */
    public function transformActiveColumn($query, $columnName = 'active'): \Yajra\DataTables\EloquentDataTable
    {
        return datatables()->eloquent($query)->editColumn($columnName, function ($item) use ($columnName) {
            return $item->$columnName == 1 ? ActiveEnums::YES : ActiveEnums::NO;
        });
    }

    /**
     * Function parseDate
     *
     * @param string|null $date
     *
     * @return string|null
     */
    protected function parseDate(?string $date): ?string
    {
        return $date ? Carbon::parse($date)->format('Y-m-d') : null;
    }
}
