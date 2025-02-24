<?php
namespace App\Models;

use App\Traits\CanGetTableNameStatically;
use App\Traits\GetterSetterTrait;
use App\Traits\SupervisionTrait;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Session;

/**
 * @method static updateOrCreate(array $array, mixed $subCategoryObject)
 * @method static where(array $array)
 */
class BaseModel extends Model
{
    use HasFactory, GetterSetterTrait, CanGetTableNameStatically, SupervisionTrait;

    /**
     * @param array $attributes
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->bootBaseModel();
    }

    protected function bootBaseModel(): void
    {
        $this->setUserId(Session::get('uid'));
        $this->setFinancialYearId(Session::get('fn_id'));
        $this->setCompanyId(Session::get('company_id'));
    }

    /**
     * Function parseDate
     *
     * @param string|null $date
     *
     * @return string|null
     */
    protected static function parseDate(?string $date): ?string
    {
        return $date ? Carbon::parse($date)->format('Y-m-d') : null;
    }
}