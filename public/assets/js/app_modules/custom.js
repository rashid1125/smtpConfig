$("#gender").bootstrapSwitch('offText', 'No');
$("#gender").bootstrapSwitch('onText', 'Yes');

$('.ts_datepicker').datepicker({ format: $('#default_date_format').val(), });

$('.post_datepicker').datepicker({ format: 'yyyy/mm/dd', });

$('.month_year_picker').datepicker({
    format: "mm-yyyy",
    viewMode: "months",
    minViewMode: "months"
});
$('.month_year_picker').datepicker('update', new Date());
$('.ts_datepicker').datepicker('update', new Date());

$('.datetimepicker').datetimepicker({
    format: 'Y/m/d h:i:s A',
    step: 15,
    closeOnDateSelect: true,
    validateOnBlur: false,
    "value": new Date(),
});

$('.tpicker').datetimepicker({
    format: 'h:i A',
    step: 10,
    width: 100,
    datepicker: false,
    closeOnDateSelect: true,
    validateOnBlur: false
});

$('.readonly').attr('disabled', 'disabled');

$('.ar-datatable').dataTable({
    "pagingType": "full_numbers", // This enables pagination with first and last page options
    "lengthMenu": [10, 25, 50, 100], // Customize the page length menu as needed
});


 // search in combobox
 // $('select').select2();