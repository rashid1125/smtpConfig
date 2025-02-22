<!DOCTYPE html>
<html style="height: auto; min-height: 100%;">
@php
    $currentTime = \Carbon\Carbon::now()->timestamp;
@endphp
<head>
    <meta charset="UTF-8">
    <title><?php echo isset($title) ? $title : 'Digital Manager ERP'; ?> </title>
    <meta name="viewport" content="initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <meta name="csrf-token" content="{{ csrf_token() }}"/>
    <link rel="shortcut icon" href="{{ asset('assets/img/favicon.png') }}">

    <meta name="robots" content="noindex,nofollow">
    <!-- Theme style -->
    <link rel="stylesheet" href="{{ asset('assets/dist/css/adminlte.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/app.css?v=' . $currentTime) }}">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/fontawesome-free/css/all.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css') }}">
    <!-- iCheck -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/icheck-bootstrap/icheck-bootstrap.min.css') }}">
    <!-- JQVMap -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/jqvmap/jqvmap.min.css') }}">
    <!-- overlayScrollbars -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/overlayScrollbars/css/OverlayScrollbars.min.css') }}">
    <!-- Daterange picker -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/bootstrap-datepicker/css/bootstrap-datepicker.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/daterangepicker/daterangepicker.css') }}">
    <!-- summernote -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/summernote/summernote-bs4.min.css') }}">
    <!-- DataTables -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables-responsive/css/responsive.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables-buttons/css/buttons.bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables/extensions/TableTools/css/dataTables.tableTools.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css') }}">
    {{-- Bootstrap Stepper --}}
    <link rel="stylesheet" href="{{ asset('assets/plugins/bs-stepper/css/bs-stepper.min.css') }}">
    <!-- Bootstrap toggle -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/bootstrap-switch/css/bootstrap4/bootstrap4-toggle.css') }}">
    <!-- Bootstrap Images preview  -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/image-preview/bootstrap-imageupload.css') }}">
    {{-- Sweet Alert 2 --}}
    <link rel="stylesheet" href="{{ asset('assets/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css') }}">
    <!-- Select2 -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/chosen/chosen.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/select2/css/select2.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css') }}">

    <link rel="stylesheet" href="{{ asset('assets/dist/css/animate.min.css') }}">

    <link rel="stylesheet" href="{{ asset('assets/dist/css/custom.css?v=' . $currentTime) }}">
    @vitereactrefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    <script>
        var base_url = '{{ url('/') }}';
    </script>
</head>

<body class="sidebar-mini layout-navbar-fixed layout-fixed sidebar-mini-md">
<div class="wrapper">
    <div class="loader" id="txtshowloader">
        <div class="loader_overlay"></div>
        <img class="loader_img" src="<?php echo url('assets/img/ajaxloader.png'); ?>" alt="">
    </div>
    @if(isset($header) && !empty($header))
        @php
            echo $header;
        @endphp
    @endif
    @if(isset($modalContent) && !empty($modalContent))
        @php
            echo $modalContent;
        @endphp
    @endif
    @if(isset($mainnav) && !empty($mainnav))
        @php
            echo $mainnav;
        @endphp
    @endif

    @yield('content')

    @if(isset($content) && !empty($content))
        <div class="content-wrapper">
            <section class="content" id="mainContent">
                @php
                    echo $content;
                @endphp
            </section>
        </div>
    @endif

    @if(isset($footer) && !empty($footer))
        @php
            echo $footer;
        @endphp
    @endif
</div>
<?php $APP_VERSION = 3.1; ?>
<script src="{{ asset('assets/plugins/jquery/jquery.min.js') }}"></script>
<script src="{{ asset('assets/plugins/jquery-ui/jquery-ui.min.js') }}"></script>
<script src="{{ asset('assets/plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>

<!-- Resolve jQuery UI and Bootstrap Tooltip Conflict -->
<script>
    $.widget.bridge("uibutton", $.ui.button);
</script>

<!-- Plugins -->
<!-- Charting & Visualization -->
<script src="{{ asset('assets/plugins/chart.js/Chart.min.js') }}"></script>
<script src="{{ asset('assets/plugins/sparklines/sparkline.js') }}"></script> {{-- Uncomment if needed --}}
<script src="{{ asset('assets/plugins/jqvmap/jquery.vmap.min.js') }}"></script> {{-- Uncomment if needed --}}
<script src="{{ asset('assets/plugins/jqvmap/maps/jquery.vmap.usa.js') }}"></script> {{-- Uncomment if needed --}}
<!-- Date & Time -->
<script src="{{ asset('assets/plugins/moment/moment.min.js') }}"></script>
<script src="{{ asset('assets/plugins/daterangepicker/daterangepicker.js') }}"></script>
<script src="{{ asset('assets/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js') }}"></script>
<script src="{{ asset('assets/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js') }}"></script>
<!-- Text Editors -->
<script src="{{ asset('assets/plugins/summernote/summernote-bs4.min.js') }}"></script>
<!-- Scrollbars -->
<script src="{{ asset('assets/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js') }}"></script>
<!-- Data Tables -->
<script src="{{ asset('assets/plugins/datatables/jquery.dataTables.min.js') }}"></script>
<script src="{{ asset('assets/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js') }}"></script>
<script src="{{ asset('assets/plugins/datatables-responsive/js/dataTables.responsive.min.js') }}"></script>
<script src="{{ asset('assets/plugins/datatables-responsive/js/responsive.bootstrap4.min.js') }}"></script>
<script src="{{ asset('assets/plugins/datatables-buttons/js/dataTables.buttons.min.js') }}"></script>
<script src="{{ asset('assets/plugins/datatables-buttons/js/buttons.bootstrap4.min.js') }}"></script>
<script src="{{ asset('assets/plugins/datatables-buttons/js/buttons.html5.min.js') }}"></script>
<script src="{{ asset('assets/plugins/datatables-buttons/js/buttons.print.min.js') }}"></script>
<script src="{{ asset('assets/plugins/datatables-buttons/js/buttons.colVis.min.js') }}"></script>
<script src="{{ asset('assets/plugins/jszip/jszip.min.js') }}"></script>
<script src="{{ asset('assets/plugins/pdfmake/pdfmake.min.js') }}"></script>
<script src="{{ asset('assets/plugins/pdfmake/vfs_fonts.js') }}"></script>
<!-- Form Plugins -->
<script src="{{ asset('assets/plugins/jquery-knob/jquery.knob.min.js') }}"></script>
<script src="{{ asset('assets/plugins/bootstrap-switch/js/bootstrap-switch.min.js') }}"></script>
<script src="{{ asset('assets/plugins/bootstrap-switch/js/bootstrap4-toggle.min.js') }}"></script>
<script src="{{ asset('assets/plugins/select2/js/select2.js') }}"></script>
<script src="{{ asset('assets/plugins/sweetalert2/sweetalert2.min.js') }}"></script>
<script src="{{ asset('assets/plugins/chosen/chosen.jquery.min.js') }}"></script>
<script src="{{ asset('assets/plugins/bs-stepper/js/bs-stepper.min.js') }}"></script>
<script src="{{ asset('assets/plugins/inputmask/jquery.inputmask.min.js') }}"></script>
<script src="{{ asset('assets/plugins/bootstrap-notify/bootstrap-notify.min.js') }}"></script>
<script src="{{ asset('assets/plugins/image-preview/bootstrap-imageupload.js') }}"></script>
<script src="{{ asset('assets/plugins/jquery-validation/jquery.validate.min.js') }}"></script>
<script src="{{ asset('assets/plugins/jquery-validation/additional-methods.min.js') }}"></script>
<script src="{{ asset('assets/plugins/libphonenumber/libphonenumber-max.js') }}"></script>
<script src="{{ asset('assets/plugins/handlebars/handlebars.js') }}"></script>
<script src="{{ asset('assets/plugins/bootbox/bootbox.min.js') }}"></script>
<script src="{{ asset('assets/plugins/pdfobject/pdfobject.min.js') }}"></script>
<script src="{{ asset('assets/plugins/autocomplete/jquery.auto-complete.js') }}"></script>
<!-- AdminLTE Scripts -->
<script src="{{ asset('assets/dist/js/adminlte.js') }}"></script>
<script src="{{ asset('assets/dist/js/demo.js') }}"></script>
<!-- External Libraries -->
<script src="{{ asset('assets/plugins/userIdGenerator/uuidv4.min.js') }}"></script>
<script src="{{ asset('assets/plugins/urdueditor/jquery/jquery.UrduEditor.js') }}"></script>

<!-- Custom Scripts -->
<script src="{{ asset('assets/js/shortcut.js') }}"></script>
<script src="{{ asset('assets/js/app_modules/custom.js') }}"></script>
<script src="{{ asset('assets/js/app_modules/general.js?v=' . $currentTime) }}"></script>
<!-- Conditional Scripts -->
@if (isset($view_modals) && $view_modals === 'true')
    <script src="{{ asset('assets/js/app_modules/setup/voucher_viewsmodal.js') }}"></script>
@endif
@if (isset($view_all_js) && (bool) $view_all_js == true)
    <script src="{{ asset('assets/js/app_modules/viewallrecorddata.js') }}"></script>
@endif
@if (isset($ModalDynamicsForm) && $ModalDynamicsForm === 'true')
    <script src="{{ asset('assets/dynamics/addmodaldynamicsform.js') }}"></script>
@endif

@if (isset($isReportURL) && (bool) $isReportURL == true)
    <script src="{{ asset('assets/ReportDynamically/thenby/thenBy.min.js') }}"></script>
    <script src="{{ asset('assets/ReportDynareport_dynamicalliesmically/report_component.js') }}" type="module" defer></script>
    <script src="{{ asset('assets/ReportDynamically/report_dynamically.js') }}" type="module" defer></script>
@endif
{{-- # This is ues for just  $modules --}}
@if (isset($modules))
    @foreach ($modules as $module)
        <script src="{{ asset('assets/js/app_modules/' . $module . '.js?v=' . $currentTime) }}" type="module"></script>
    @endforeach
@endif
{{-- # This is ues for just full Path in assets --}}
@if (isset($scriptModules))
    @foreach ($scriptModules as $reportModule)
        <script src="{{ asset('assets/' . $reportModule . '.js') }}" type="module"></script>
    @endforeach
@endif
@stack('scripts')
</body>

</html>
