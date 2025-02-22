<?php
namespace App\Traits;

use Illuminate\Support\Facades\Redis;
use InvalidArgumentException;

trait RedisTrait
{
    protected bool $cacheHit = false;

    /**
     * Function getCachedData
     *
     * @param $key
     *
     * @return null
     */
    private function getCachedData($key)
    {
        $cachedData = Redis::get($key);

        return $cachedData ? : null;
    }

    /**
     * Function cacheView
     *
     * @param mixed  $keySource
     * @param string $viewName
     * @param array  $data
     * @param int    $expiration
     *
     * @return string|null
     */
    public function cacheView($keySource, string $viewName, array $data = [], int $expiration = REDIS_CACHE_EXPIRATION_ONE_HOUR): ?string
    {
        $cacheKey        = $this->generateCacheKey($keySource);
        $dataHashKey     = $cacheKey . ':data_hash';
        $currentDataHash = $this->generateDataHash($data);
        $cachedView      = $this->getCachedData($cacheKey);
        $storedDataHash  = $this->getCachedData($dataHashKey);
        if ($cachedView && $storedDataHash === $currentDataHash) {
            $this->cacheHit = true;
        } else {
            $viewContent = view($viewName, $data)->render();
            Redis::setex($cacheKey, $expiration * 60, $viewContent);
            Redis::setex($dataHashKey, $expiration * 60, $currentDataHash);
            $cachedView = $viewContent;
        }

        return $cachedView;
    }

    /**
     * Function cacheData
     *
     * @param     $cacheKey
     * @param     $data
     * @param int $expiration
     *
     * @return mixed
     */
    public function cacheData($cacheKey, $data, int $expiration = REDIS_CACHE_EXPIRATION_ONE_HOUR)
    {
        $dataHashKey     = $cacheKey . ':data_hash';
        $serializedData  = serialize($data); // Serialize the data before caching
        $currentDataHash = $this->generateDataHash($serializedData);
        $cachedData      = $this->getCachedData($cacheKey);
        $storedDataHash  = $this->getCachedData($dataHashKey);
        if ($cachedData && $storedDataHash === $currentDataHash) {
            $this->cacheHit = true;

            return unserialize($cachedData);
        } else {
            Redis::setex($cacheKey, $expiration * 60, $serializedData);
            Redis::setex($dataHashKey, $expiration * 60, $currentDataHash);

            return $data;
        }
    }

    /**
     * Function generateCacheKey
     *
     * @param $keySource
     *
     * @return string
     */
    protected function generateCacheKey($keySource): string
    {
        if (is_string($keySource)) {
            return 'cache:' . $keySource;
        } elseif (is_object($keySource) && method_exists($keySource, 'getTable')) {
            return 'cache:' . $keySource->getTable();
        }
        throw new InvalidArgumentException('Invalid key source for cache key generation.');
    }

    /**
     * Function generateDataHash
     *
     * @param $data
     *
     * @return string
     */
    protected function generateDataHash($data): string
    {
        return hash('sha256', json_encode($data));
    }

    /**
     * Function clearCache
     *
     * @param $cacheKey
     *
     * @return void
     */
    public function clearCache($cacheKey)
    {
        Redis::del($cacheKey);
        Redis::del($cacheKey . ':data_hash');
    }

    /**
     * Function refreshCache
     *
     * @param       $keySource
     * @param       $viewName
     * @param array $data
     * @param int   $expiration
     *
     * @return string|null
     */
    public function refreshCache($keySource, $viewName, array $data = [], int $expiration = REDIS_CACHE_EXPIRATION_ONE_HOUR): ?string
    {
        $this->clearCache($keySource);

        return $this->cacheView($keySource, $viewName, $data, $expiration);
    }

    /**
     * Function isCacheHit
     *
     * @return bool
     */
    public function isCacheHit(): bool
    {
        return $this->cacheHit;
    }
}
