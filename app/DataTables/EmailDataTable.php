<?php
/**
 * File EmailDataTable.php
 *
 * @package   App\DataTables
 *
 * @author    Rashid Rasheed <rashidrasheed1125@gmail.com>
 *
 * @copyright Shahid && Rashid (SR)
 * @version   1.0
 */
declare(strict_types = 1);
namespace App\DataTables;

use App\Models\Email;

class EmailDataTable extends BaseDataTable
{
    protected int                                 $companyId;
    protected mixed                               $searchValue;
    protected \Illuminate\Database\Eloquent\Model $model;

    public function __construct($companyId, $searchValue = null)
    {
        parent::__construct(new Email(), $companyId, $searchValue);
    }

    /**
     * Function dataTable
     *
     * @param $query
     *
     * @throws \Yajra\DataTables\Exceptions\Exception
     *
     * @return \Yajra\DataTables\EloquentDataTable|\Yajra\DataTables\DataTableAbstract
     */
    public function dataTable($query): \Yajra\DataTables\EloquentDataTable | \Yajra\DataTables\DataTableAbstract
    {
        return datatables()->eloquent($query);
    }

    /**
     * Function query
     *
     * @param ...$params
     *
     * @return mixed
     */
    public function query(...$params): mixed
    {
        return $this->model->newQuery();
    }
}
