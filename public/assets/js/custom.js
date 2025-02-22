$("#active").bootstrapSwitch('offText', 'No');
$("#active").bootstrapSwitch('onText', 'Yes');

$('.ts_datepicker').datepicker({
    format: $('#default_date_format').val(),
});

$('.month_year_picker').datepicker({
    format: "mm-yyyy",
    viewMode: "months", 
    minViewMode: "months"
});
$('.month_year_picker').datepicker('update', new Date());

$('.ts_datepicker').datepicker('update', new Date());
// $('.ar-datatable').dataTable({
// 	'iDisplayLength': 100,
// });