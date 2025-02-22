<?php

use App\Models\SettingConfiguration;
use Illuminate\Support\Facades\Session;

$setting_configure = SettingConfiguration::all();

$Date_Close = Session::get('date_close');
Session::put('date_close', '');
?>

<script>
    const appDebug = {!! json_encode(env('APP_DEBUG', false)) !!};
</script>
<input type="hidden" id="base_url" value="<?php echo URL(''); ?>">

<!-- Navbar -->
<nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
            <a href="<?php

            echo URL('dashboard'); ?>" class="nav-link">Dashboard</a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
            <a href="<?php echo URL('wallmain'); ?>" class="nav-link">Transaction Wall</a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
            <a href="<?php echo URL('wallmain'); ?>" class="nav-link"><?= Session::get('fn_name') ?></a>
        </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
        <!-- Navbar Search -->
        <li class="nav-item">
            <a class="nav-link" data-widget="navbar-search" href="#" role="button">
                <i class="fas fa-search"></i>
            </a>
            <div class="navbar-search-block">
                <form class="form-inline">
                    <div class="input-group input-group-sm">
                        <input class="form-control form-control-navbar" type="search" placeholder="Search"
                               aria-label="Search" id="text-search-in-header">
                        <div class="input-group-append">
                            <button class="btn btn-navbar" type="submit">
                                <i class="fas fa-search"></i>
                            </button>
                            <button class="btn btn-navbar" type="button" data-widget="navbar-search">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </li>
        <li class="nav-item">
            <a class="nav-link"
               onclick="event.preventDefault();
            document.getElementById('logout-form').submit();"
               href="{{ route('logout') }}" role="button" data-toggle="tooltip" title="Sign-out!">
                <i class="fas fa-sign-out-alt"></i>
            </a>

            <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                @csrf
            </form>
        </li>
    </ul>
</nav>

