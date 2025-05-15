<?php
namespace App\Http\Middleware;

use App\Models\WhiteListIp;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IpWhitelist
{
    public function handle(Request $request, Closure $next)
    {
        $ipAddress = $request->ip();
        
        if (!WhiteListIp::isWhitelisted($ipAddress)) {
            Log::info('IP Blocked', ['ip' => $ipAddress]);

            return response()->json(['status' => false, 'statusCode' => 500, 'message' => 'IP Blocked'], 500);
        }

        return $next($request);
    }
}
