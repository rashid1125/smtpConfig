<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IpWhitelist
{
    public function handle(Request $request, Closure $next)
    {
        $whitelistedIps = ['51.195.139.2'];
        if (! in_array($request->ip(), $whitelistedIps)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
