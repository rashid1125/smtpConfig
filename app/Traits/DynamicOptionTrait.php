<?php
namespace App\Traits;

use App\Models\SettingConfiguration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

trait DynamicOptionTrait
{
    use RedisTrait;

    /**
     * Function getDynamicOptions
     *
     * @param \Illuminate\Http\Request $request
     * @param                          $modelOrTable
     * @param string                   $queryOptionColumnName
     * @param string                   $queryOptionColumnId
     * @param array|null               $props
     *
     * @return array|mixed
     */
    protected function getDynamicOptions(Request $request, $modelOrTable, string $queryOptionColumnName, string $queryOptionColumnId, ?array $props = [])
    {
        $queryValue = $request->input("term", "");
        $page       = (int)$request->input("page", 1);
        $pageSize   = (int)$request->input("pageSize", 10);
        $offset     = (($page - 1) * $pageSize);
        $cacheKey   = $this->generateCacheKey($modelOrTable, $queryOptionColumnName, $queryOptionColumnId, $queryValue, $page, $pageSize, $props);
        if (config('app.redis_cache') && env('REDIS_CACHE_ENABLED')) {
            $response = $this->getCachedData($cacheKey);
            if ($response) {
                return unserialize($response);
            }
        }
        $searchConfig = SettingConfiguration::first();
        $searchTerm   = '%' . $queryValue . '%';
        if ($searchConfig && $searchConfig->searchTerm == 'left-to-right') {
            $searchTerm = $queryValue . '%';
        } elseif ($searchConfig && $searchConfig->searchTerm == 'right-to-left') {
            $searchTerm = '%' . $queryValue;
        }
        $query = is_string($modelOrTable) ? DB::table($modelOrTable) : (new $modelOrTable)->newQuery();
        if ($queryValue) {
            $query->where($queryOptionColumnName, 'like', $searchTerm);
        }
        if (isset($props['activeStateColumn']) && isset($props['activeStateValue'])) {
            if (is_array($props['activeStateValue'])) {
                $query->whereIn($props['activeStateColumn'], $props['activeStateValue']);
            } else {
                $query->where($props['activeStateColumn'], '=', $props['activeStateValue']);
            }
        }
        if (isset($props['additionalConditions']) && is_array($props['additionalConditions'])) {
            foreach ($props['additionalConditions'] as $condition) {
                if ($condition['method'] == 'whereRaw') {
                    $query->whereRaw($condition['sql'], $condition['bindings']);
                } elseif (in_array($condition['method'], ['whereIn', 'whereNotIn', 'whereBetween', 'whereNotBetween']) && is_array($condition['value'])) {
                    $query->{$condition['method']}($condition['column'], $condition['value']);
                } else {
                    $value = is_array($condition['value']) ? implode(',', $condition['value']) : $condition['value'];
                    $query->{$condition['method']}($condition['column'], $condition['operator'] ?? '=', $value);
                }
            }
        }
        if (isset($props['orderBy']) && is_array($props['orderBy'])) {
            foreach ($props['orderBy'] as $orderBy) {
                $query->orderBy($orderBy['column'], $orderBy['direction'] ?? 'asc');
            }
        } else {
            $query->orderBy($queryOptionColumnName);
        }
        if (isset($props['limit'])) {
            $pageSize = (int)$props['limit'];
            $offset   = (($page - 1) * $pageSize);
        }
        $query->skip($offset)->take($pageSize);
        $options    = $query->get();
        $totalQuery = (clone $query)->offset(0)->limit(PHP_INT_MAX);
        $total      = $totalQuery->count();
        $results    = $options->map(function ($option) use ($queryOptionColumnName, $queryOptionColumnId, $props) {
            $result = ['id' => $option->$queryOptionColumnId, 'text' => $option->$queryOptionColumnName];
            if (isset($props['dataAttributes']) && is_array($props['dataAttributes'])) {
                foreach ($props['dataAttributes'] as $alias => $attribute) {
                    $result[$alias] = $option->$attribute;
                }
            }

            return $result;
        });
        $response   = [
            'results'    => $results,
            'pagination' => [
                'more' => $offset + $pageSize < $total,
            ],
        ];
        if (config('app.redis_cache') && env('REDIS_CACHE_ENABLED')) {
            $this->cacheData($cacheKey, $response);
        }

        return $response;
    }

    /**
     * Function generateCacheKey
     *
     * @param $modelOrTable
     * @param $queryOptionColumnName
     * @param $queryOptionColumnId
     * @param $queryValue
     * @param $page
     * @param $pageSize
     * @param $props
     *
     * @return string
     */
    private function generateCacheKey($modelOrTable, $queryOptionColumnName, $queryOptionColumnId, $queryValue, $page, $pageSize, $props): string
    {
        $modelOrTableName = is_string($modelOrTable) ? $modelOrTable : (new $modelOrTable)->getTable();
        $propsString      = json_encode($props);

        return "dynamic_options_{$modelOrTableName}_{$queryOptionColumnName}_{$queryOptionColumnId}_{$queryValue}_{$page}_{$pageSize}_$propsString";
    }
}
