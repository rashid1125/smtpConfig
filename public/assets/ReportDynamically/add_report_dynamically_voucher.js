var ReportDynamicallyForm = function () {
    var save = function (obj) {
        general.disableSave();
        $.ajax({
            url: base_url + '/report_dynamically/save',
            type: 'POST',
            data: { 'reportDynamically': JSON.stringify(obj) },
            dataType: 'JSON',
            success: function (response) {
                if ((response.status == false) && (response.message !== ""))
                    _getAlertMessage('Error!', response.message, 'danger');
                else if (response.status === false)
                    _getAlertMessage('Error!', 'An internal error occurred while saving voucher. Please try again !!!', 'danger');
                else {
                    _getAlertMessage('Success', 'Report  saved successfully !!!', 'success');
                    resetFields();
                    fetchAllRecord();
                }
                general.enableSave();
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };
    var fetch = function (report_id) {
        $.ajax({
            url: base_url + '/report_dynamically/getReportDynamicallyById',
            type: 'GET',
            data: { 'id': report_id },
            dataType: 'JSON',
            success: function (response) {
                resetFields();
                if ((response.status === true) && (response.message !== "")) {
                    populateData(response.data);
                }else{
                    _getAlertMessage('Error!', response.message, 'danger');
                }
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };
    var resetFields = function () {
        $('.save-elem').each(function (ind, elem) {
            if ($(this).prop('type') === 'radio' || $(this).prop('type') === 'checkbox')
                return true;
            else if ($(this).hasClass('not-reset'))
                return true;
            else
                $(this).val('').trigger('liszt:updated');
        });
        $('.inputerror').removeClass('inputerror');
    };
    var populateData = function (data) {
        $('.save-elem').each(function (ind, elem) {
            var col = $(this).attr('name');
            var name = $(this).prop('name');
            if ($(this).hasClass('bs_switch')) {
                $(this).bootstrapSwitch('state', (data[col] === "true") ? true : false);
            } else if ($(this).prop('type') === 'radio') {
                $("input[name='" + name + "'][value=" + data[col] + "]").prop("checked", true);
            } else if ($(this).prop('type') === 'checkbox') {
                $("input[name='" + name + "'][value=" + data[col] + "]").prop("checked", true);
            } else {
                $(this).val(data[col]).trigger('liszt:updated');
            }
        });
        $('#txtID').val(data.id);
    };
    var validateSave = function () {
        var errorFlag = 0;
        $('.inputerror').removeClass('inputerror');
        $('.validate-save').each(function (ind, elem) {
            if ($.trim($(this).val()) === '') {
                if ($(this).hasClass('chosen')) {
                    $("#" + $(this).prop('id') + "_chzn").addClass('inputerror');
                } else {
                    $(this).addClass('inputerror');
                }
                errorFlag += 1;
            }
        });
        return errorFlag;
    };
    var getSaveObject = function () {
        var obj = {};
        $('.save-elem').each(function (ind, elem) {
            if ($(this).is('input') || $(this).is('select') || $(this).is('textarea')) {
                if ($(this).hasClass('bs_switch')) {
                    obj[$(this).attr('name')] = $(this).bootstrapSwitch("state");
                } else if ($(this).prop('type') === 'radio') {
                    obj[$(this).attr('name')] = $("input[name='" + $(this).prop('name') + "']:checked").val();
                } else if ($(this).prop('type') === 'checkbox') {
                    var arr = [];
                    $.each($("input[name='" + $(this).prop('name') + "']:checked"), function () {
                        arr.push($(this).val());
                    });
                    obj[$(this).attr('name')] = arr.join(',');
                } else {
                    obj[$(this).attr('name')] = $.trim($(this).val());
                }
            }
        });
        return obj;
    };
    var fetchAllRecord = function () {
        if (typeof reportDynamicallyForm.dTable != 'undefined') {
            reportDynamicallyForm.dTable.fnDestroy();
            $('#table_body').empty();
        }
        $.ajax({
            url: base_url + '/report_dynamically/fetchAllRecord',
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data === false) {
                    _getAlertMessage('Error!', 'No data found !!!', 'danger');
                } else {
                    resetFields();
                    tabledata(data);
                }
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };
    var tabledata = function (data) {
        $.each(data, function (index, elem) {
            appendToTable(elem.name, elem.etype, elem.report_rights, elem.id);
        });
        bindGrid();
    };
    var appendToTable = function (name, etype, report_rights, id) {
        var srno = $('#table_data tbody tr').length + 1;
        var row = "<tr>" +
            "<td class='srno text-left' data-title='Sr#' > " + srno + "</td>" +
            "<td class='name' data-title='Programtype Name' data-name='" + name + "'> " + name + "</td>" +
            "<td class='etype' data-title='Programtype etype' data-etype='" + etype + "'> " + etype + "</td>" +
            "<td class='report_rights' data-title='Programtype report_rights' data-report_rights='" + report_rights + "'> " + report_rights + "</td>" +
            "<td class='text-right'><a href='' class='btn btn-sm btn-primary btn-edit-programtype' data-report_id='" + id + "' style='width:40px !important'><span class='fa fa-edit'></span></a></td>" +
            "</tr>";
        $(row).appendTo('#table_data');
    };
    var bindGrid = function () {
        var dontSort = [];
        $('#table_data thead th').each(function () {
            if ($(this).hasClass('no_sort')) {
                dontSort.push({ "bSortable": false });
            } else {
                dontSort.push(null);
            }
        });
        reportDynamicallyForm.dTable = $('#table_data').dataTable({
            "sDom": "<'row-fluid table_top_bar'<'span12'<'to_hide_phone'<'row-fluid'<'span8' f>>>'<'pag_top' p> T>>t<'row-fluid control-group full top' <'span4 to_hide_tablet'l><'span8 pagination'p>>",
            "aaSorting": [[0, "asc"]],
            "bPaginate": true,
            "sPaginationType": "full_numbers",
            "bJQueryUI": false,
            "aoColumns": dontSort,
            "bSort": true,
            "iDisplayLength": 50,
            "oTableTools": {
                "sSwfPath": "js/copy_cvs_xls_pdf.swf",
                "aButtons": [{ "sExtends": "print", "sButtonText": "Print Report", "sMessage": "Inventory Report" }]
            }
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            "s`": "dataTables_wrapper form-inline"
        });
    };
    /**
     * getAccountDetail
     * return the data of all Account with active
     * @param int active
     * @param string setting_level3
     * @param IDoption is the dropdown Id Or Class
     * @return array
     * 
     * */
    const getAccountDetail = (active, setting_level3, IDoption = "") => {
        $.ajax({
            url: base_url + '/account/getAccountDetail',
            type: 'POST',
            data: { 'active': active, 'setting_level3': setting_level3 },
            dataType: 'JSON',
            success: function (response) {
                if (response.status && response.data !== null)
                    getpopulateAccountDetail(response.data, IDoption);
                else $.notify({ message: response.message }, { type: 'danger' });
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };
    /**
     * getpopulateAccountDetail
     * populate accounts in select2 dropdown and appending own id
     * @param  array data 
     * @param  IDoption is the dropdown Id Or Class
     * @param  option is the default value
     * @return [Nothing]
     *
     * */
    const getpopulateAccountDetail = (data, IDoption = "", option = "") => {
        $(IDoption).empty();
        $.each(data, function (index, elem) {
            option += '<option value="' + elem.pid + '">' + elem.name + '</option>';
        });
        $(option).appendTo(IDoption);
    };
    /**
     * getLevel3WithSettingLevel3
     * 
     * */
    const getLevel3WithSettingLevel3 = (setting_level3, IDoption) => {
        $.ajax({
            url: base_url + '/level/getLevel3WithSettingLevel3',
            type: 'POST',
            data: { 'setting_level3': setting_level3 },
            dataType: 'JSON',
            success: function (response) {
                if (response.status && response.data !== null)
                    populateLevel3Account(response.data, '#account_modal_txtLevel3');
                else $.notify({ message: response.message }, { type: 'danger' });
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };
    /**
     * populateLevel3Account
     * populate Item in select2 dropdown and appending own id
     * @param  array data 
     * @param  IDoption is the dropdown Id Or Class
     * @param  option is the default value
     * @return [Nothing]
     *
     * */
    const populateLevel3Account = (data, IDoption = "", option = "") => {
        $('#account_modal_etype').val('');
        $(IDoption).empty();
        $.each(data, function (index, elem) {
            option += '<option value="' + elem.l3 + '" >' + elem.name + '</option>';
        });
        $(option).appendTo(IDoption);
        $(IDoption).removeAttr('disabled', false).trigger('liszt:updated');
        $('#account_modal_etype').val('generalaccounts');
        $('#AccountAddModel').modal('show');
    };
    return {
        init: function () {
            $('#vouchertypehidden').val('new');
            this.bindUI();
            fetchAllRecord();
            $('.chosen').chosen({
                width: '100%'
            });
        },
        bindUI: function () {
            var self = this;
            $('#txtControlAccount_refresh').click(function (e) {
                e.preventDefault();
                getAccountDetail(1, 'foh_level3', '#account_dropdwon');
            });
            $('#txtControlAccount').click(function (e) {
                e.preventDefault();
                getLevel3WithSettingLevel3('foh_level3');
                $('#txthiddenAccountId').val('#account_dropdwon');
            });
            shortcut.add("F10", function () {
                $('.btnSave').first().trigger('click');
            });
            shortcut.add("F6", function () {
                $('#txtId').focus();
            });
            shortcut.add("F3", function () {
                $('#vehicleLookupBtn').trigger('click');
            });
            shortcut.add("alt+1", function () {
                $('a[href="#addfohexpense"]').trigger('click');
            });
            shortcut.add("alt+2", function () {
                $('a[href="#view_all"]').trigger('click');
            });
            shortcut.add("F5", function () {
                resetFields();
            });
            $('#txtId').on('change', function () {
                fetch($(this).val());
            });
            $('.btnSave').on('click', function (e) {
                e.preventDefault();
                self.initSave();
            });
            $('.btnReset').on('click', function (e) {
                e.preventDefault();
                resetFields();
            });
            $('#txtId').on('keypress', function (e) {
                if (e.keyCode === 13) {
                    if ($('#txtId').val().trim() !== "") {
                        var report_id = $.trim($('#txtId').val());
                        fetch(report_id);
                    }
                }
            });
            $("body").on('click', '.btn-edit-programtype', function (e) {
                e.preventDefault();
                fetch($(this).data('report_id'));
                $('a[href="#addfohexpense"]').trigger('click');
            });
        },
        initSave: function () {
            var saveObj = getSaveObject();
            var errors = validateSave();
            if (errors == 0) {
                save(saveObj);
            } else {
                _getAlertMessage('Error!', 'Correct the errors !!!', 'danger');
            }
        },
        resetVoucher: function () {
            general.reloadWindow();
        }
    };
};
const reportDynamicallyForm = new ReportDynamicallyForm();
reportDynamicallyForm.init();