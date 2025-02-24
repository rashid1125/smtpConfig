<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class SetUserSessionDataMiddleware
{
    /**
     * Function handle
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        if (Session::get('query_executed', false)) {
            return $next($request);
        }
        $sessionData = $this->fetchUserSessionData($user);
        $this->updateSessionData($sessionData);
        Session::put('user_agent_data', $request->input('user_agent'));
        Session::put('query_executed', true);

        return $next($request);
    }

    /**
     * Function fetchUserSessionData
     *
     * @param $user
     *
     * @return array
     */
    private function fetchUserSessionData($user): array
    {
        $query = <<<SQL
            SELECT
        `company`.`id` AS `company_id`,
        `company`.`name` AS `company_name`,
        `user`.`id` AS `uid`,
        `user`.username AS `uname`,
        `user`.`password`,
        `user`.`email`,
        `user`.`company_id`,
        IFNULL(`user`.`failed_attempts`, 0) AS `failed_attempts`,
        `user`.`name`
    FROM
        `users` AS `user`
        INNER JOIN `companies` AS `company` ON `user`.company_id = company.id
    WHERE
        BINARY `user`.username = '{$user->username}'
        AND BINARY `user`.`id` = '{$user->id}'
SQL;

        return DB::select($query);
    }

    /**
     * Function updateSessionData
     *
     * @param $sessionData
     */
    private function updateSessionData($sessionData): void
    {
        Session::put([$sessionData[0]]);
        Session::put('company_id', $sessionData[0]->company_id);
        Session::put('company_name', $sessionData[0]->company_name);
        Session::put('uid', $sessionData[0]->uid);
        Session::put('uname', $sessionData[0]->uname);
        Session::put('user_time', microtime(true));
        Session::put('token', csrf_token());
    }
}
