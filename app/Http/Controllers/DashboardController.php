<?php
/**
 * File ${FILE_NAME}
 *
 * @package   App\Http\Controllers
 *
 * @author    Rashid Rasheed <rashidrasheed1125@gmail.com>
 *
 * @copyright Digitalsofts (DS)
 * @version   1.0
 */
namespace App\Http\Controllers;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->initializeUserSessionContext();

            return $next($request);
        });
    }

    /**
     * Function index
     *
     * @return \Illuminate\Contracts\View\View|\Illuminate\Foundation\Application|\Illuminate\Contracts\View\Factory
     */
    public function index()
    {
        $data['title']   = 'Dashboard';
        $data['header']  = view('layouts.header', $data);
        $data['content'] = view('user.dashboard', $data);
        $data['mainnav'] = view('layouts.mainnav', $data);
        $data['footer']  = view('layouts.footer', $data);

        return view('layouts.default', $data);
    }
}