<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IpWhitelist
{
    public function handle(Request $request, Closure $next)
    {
        $whitelistedIps = ['51.195.139.2', '127.0.0.1'];
        if (! in_array($request->ip(), $whitelistedIps)) {
            Log::info('Ip Blocked', ['ip' => $request->ip()]);

            return response()->json(['status' => false, 'statusCode' => 500, 'message' => 'Ip Block'], 500);
        }

        return $next($request);
    }
}
