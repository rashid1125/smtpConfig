<?php

use App\Models\AsideBar;
use App\Models\MainnavModule;
use App\Models\SubmainnavModule;
use Illuminate\Support\Facades\Session;

?>
        <!-- Main Sidebar Container -->
<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="<?= URL('dashboard') ?>" class="brand-link">
        <img src="{{ asset('assets/img/dm.png') }}" alt="SR" class="brand-image img-circle elevation-3" style="opacity: .8">
        <span class="brand-text font-weight-light">SR</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
        <!-- Sidebar user panel (optional) -->
        <div class="user-panel d-flex mb-3 mt-3 pb-3">
            <div class="image">
                <img src="{{ asset('assets/dist/img/user2-160x160.jpg') }}" class="img-circle elevation-2" alt="User Image">
            </div>
            <div class="info">
                <a href="#" class="d-block"><?= Session::get('uname') ?></a>
            </div>
        </div>

        <!-- SidebarSearch Form -->
        <div class="form-inline">
            <div class="input-group" data-widget="sidebar-search">
                <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" id="text-search-in-sidebar">
                <div class="input-group-append">
                    <button class="btn btn-sidebar">
                        <i class="fas fa-search fa-fw"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column nav-child-indent nav-legacy" data-widget="treeview" role="menu" data-accordion="false">
                <li class="nav-item">
                    <a href="{{ URL('smtpUser') }}" class="nav-link">
                        <i class="nav-icon fas fa-user"></i>
                        <p>
                            SMTP User
                        </p>
                    </a>
                </li>
            </ul>
        </nav>
        <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
</aside>
