import { makeAjaxRequest } from "../../../../../js/components/MakeAjaxRequest.js";
import { reportDynamically } from "../../js/components/GlobalUrl.js";
import AlertComponent from "../../js/components/AlertComponent.js";
import { reportCombination } from "./report_combination.js";
import { ifNull } from "../js/app_modules/commonFunctions/CommonFunction.js";
const ReportComponent = function () {
    const getAllReportComponent = async function (reportId) {
        const response = await makeAjaxRequest('GET', reportDynamically.getAllReportComponent, {
            reportId: reportId
        });
        if (response.status == false && response.error !== "") {
            AlertComponent._getAlertMessage('Error!', response.message, 'danger');
        } else if (response.status == false && response.message !== "") {
            AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
        } else {
            populateReportComponent(response.data);
            return true;
        }
    };
    const populateReportComponent = (data) => {
        $('#txtPaneladvancedgenenral').hide();
        $('#txtPaneladvanceditem').hide();
        $('#txtPaneladvancedaccount').hide();
        if (data.start_date_component && data.end_date_component) {
            $(data.start_date_component).appendTo('.from');
            $(data.end_date_component).appendTo('.to');
            $(data.radio_button_component).appendTo('.Today');

            $(".ts_datepicker").datepicker({
                format: $('#default_date_format').val()
            });
            $('#startDate').datepicker('update', getFormattedDate(data.financialYearStartDate));
            $('#endDate').datepicker('update', getFormattedDate(data.financialYearEndDate));
        }

        if (data.till_date_component) {
            $(data.till_date_component).appendTo('.from');
            $(".ts_datepicker").datepicker({
                format: $('#default_date_format').val()
            });
            $('#startDate').datepicker('update', getFormattedDate(sdate));
        }

        if (data.show_advanced_general) {
            $('#txtPaneladvancedgenenral').show();
            $(data.advanced_general_component).appendTo('.advancedgenenral');
        }

        if (data.show_advanced_item) {
            $('#txtPaneladvanceditem').show();
            $(data.advanced_item_component).appendTo('.advanceditem');
        }

        if (data.show_advanced_account) {
            $('#txtPaneladvancedaccount').show();
            $(data.advanced_account_component).appendTo('.advancedaccount');
        }
    };

    var getAllReportGroup = async function (reportId) {
        const response = await makeAjaxRequest('GET', reportDynamically.getAllReportGroup, {
            reportId: reportId
        });
        if (response.status == false && response.error !== "") {
            AlertComponent._getAlertMessage('Error!', response.message, 'danger');
        } else if (response.status == false && response.message !== "") {
            AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
        } else {
            populateReportGroup(response.data);
            return true;
        }
    };

    const populateReportGroup = (data) => {
        let GROUP_HIDE1 = "";
        let GROUP_HIDE2 = "";
        let GROUP_ROWHIDE2 = "";

        var a = "";
        var div = '';
        var div2 = '';
        var str = data.reports_group;
        var str_array = str.split(',' || '');

        $('.container-wrap').removeClass('d-none');
        $('.report_groups_d-none').removeClass('d-none');
        if (data.is_group !== null || data.is_group !== "") {
            if (data.is_group == "0") {
                $('.report_groups_d-none').addClass('d-none');
                GROUP_HIDE1 = "d-none";
                GROUP_HIDE2 = "d-none";
                $('.container-wrap').addClass('d-none');
            } else if (data.is_group == "1") {
                GROUP_HIDE2 = "d-none";
                if ((str_array.length - 1) == 0) {
                    GROUP_HIDE1 = "d-none";
                }
            } else if (data.is_group == "2") {

                GROUP_HIDE1 = "";
                GROUP_HIDE2 = "";
                if ((str_array.length - 1) == 0) {
                    GROUP_HIDE1 = "d-none";
                    GROUP_HIDE2 = "d-none";
                }
            }
        }
        if ((str_array.length - 1) !== 0) {
            var element = document.getElementById("txtAutoChangeSearchDiv");
            element.classList.add('d-none');
        }

        div += '<div class="row ' + GROUP_ROWHIDE2 + '">';
        div += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-1 mt-2 ' + GROUP_HIDE1 + '"><div class="form-group"><p class="h5">Report Types</p></div></div>';
        div += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-10">';
        div2 += '<div class="row">';
        div2 += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-1 mt-2 ' + GROUP_HIDE2 + '"><div class="form-group"><p class="h6">Sub Report Types</p></div></div>';
        div2 += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-10">';

        for (var i = 0; i < str_array.length; i++) {
            if (i === 0) {
                a = 'btn-primary';
            } else {
                a = '';
            }
            if (data.is_group !== null || data.is_group !== "") {
                if (data.is_group == "0") {

                } else if (data.is_group == "1") {
                    if ((str_array.length - 1) == 0)
                        div += '<a   class="btn ' + a + '  btnSelCre d-none" style="margin: 5px !important;"> ' + str_array[i] + '</a>';
                    else div += '<a   class="btn ' + a + '  btnSelCre" style="margin: 5px !important;"> ' + str_array[i] + '</a>';
                } else if (data.is_group == "2") {
                    if ((str_array.length - 1) == 0) {
                        div += '<a   class="btn ' + a + '  btnSelCre d-none" style="margin: 5px !important;"> ' + str_array[i] + '</a>';
                        div2 += '<a   class="btn ' + a + '  btnSelCre2 d-none" style="margin: 5px !important;"> ' + str_array[i] + '</a>';
                    } else {
                        div += '<a   class="btn ' + a + '  btnSelCre" style="margin: 5px !important;"> ' + str_array[i] + '</a>';
                        div2 += '<a   class="btn ' + a + '  btnSelCre2" style="margin: 5px !important;"> ' + str_array[i] + '</a>';
                    }

                }
            }
        }
        div += '</div>';
        div += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-1 ' + GROUP_HIDE1 + '" style="margin-top:5px !important;"><div class="form-group"><div class="input-group"><span class=""></span><input type="checkbox" checked="" class="bs_switch" id="includeGroup"></div></div></div>';
        div2 += '</div>';
        div2 += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-1 ' + GROUP_HIDE2 + '" style="margin-top:5px !important;"><div class="form-group"><div class="input-group"><span class=""></span><input type="checkbox" checked="" class="bs_switch" id="includeGroup1"></div></div></div>';
        div2 += '</div>';

        $(div).appendTo('.AllGroups');
        $(div2).appendTo('.AllGroups2');

        if (data.report_types !== '' || data.report_types !== null) {

            var types = data.report_types;
            if (types !== null) {
                $('.reporttypes-display').removeClass('disp');
                var types_array = types.split(',' || '');
                var divtype = '';
                var checked = '';
                for (var j = 0; j < types_array.length; j++) {
                    if (j == 0) {
                        checked = 'checked';
                    } else {
                        checked = '';
                    }
                    divtype += '<div class="form-check form-check-inline">';
                    divtype += '<input class="form-check-input" type="radio" name="types" id="type' + j + '" value="' + types_array[j] + '" ' + checked + '>';
                    divtype += '<label class="form-check-label" for="type' + j + '">' + types_array[j] + '</label>';
                    divtype += '</div>';
                }

                $('.reporttypes').append(divtype);
            }
        }
        if (data.report_ty !== '' || data.report_ty !== null) {

            var rtype = data.report_ty;
            if (rtype !== null) {
                $('.report-types-display').removeClass('disp');
                var reportTypeArray = rtype.split(',' || '');
                var divRtype = '';
                var checkedRtype = '';
                for (var reportTypeIndex = 0; reportTypeIndex < reportTypeArray.length; reportTypeIndex++) {
                    if (reportTypeIndex == 0) {
                        checkedRtype = 'checked';
                    } else {
                        checkedRtype = '';
                    }
                    divRtype += '<div class="form-check form-check-inline">';
                    divRtype += '<input class="form-check-input" type="radio" name="rptype" id="rptype' + reportTypeIndex + '" value="' + reportTypeArray[reportTypeIndex] + '" ' + checkedRtype + '>';
                    divRtype += '<label class="form-check-label" for="rptype' + reportTypeIndex + '">' + reportTypeArray[reportTypeIndex] + '</label>';
                    divRtype += '</div>';
                }
                $('.rptype').append(divRtype);
            }
        }


        if (data.stock_types !== '' || data.stock_types !== null) {

            var stockType = data.stock_types;
            if (stockType !== null) {
                $('.stock-types-display').removeClass('disp');
                var stockTypeArray = stockType.split(',' || '');
                var divStockType = '';
                var checkedStockType = '';
                for (var stockTypeIndex = 0; stockTypeIndex < stockTypeArray.length; stockTypeIndex++) {
                    if (stockTypeIndex == 0) {
                        checkedStockType = 'checked';
                    } else {
                        checkedStockType = '';
                    }
                    divStockType += '<div class="form-check form-check-inline">';
                    divStockType += '<input class="form-check-input" type="radio" name="stock_types" id="stock_types' + stockTypeIndex + '" value="' + stockTypeArray[stockTypeIndex] + '" ' + checkedStockType + '>';
                    divStockType += '<label class="form-check-label" for="stock_types' + stockTypeIndex + '">' + stockTypeArray[stockTypeIndex] + '</label>';
                    divStockType += '</div>';
                }
                $('.stock_types').append(divStockType);
            }
        }


        if (data.report_orientation !== '' || data.report_orientation !== null) {

            var report_orientation = data.report_orientation;
            if (report_orientation !== null) {
                $('.reporttypes-orientation').removeClass('disp');
                var report_orientationArray = report_orientation.split(',' || '');
                var divreport_orientation = '';
                var checkedreport_orientation = '';
                for (var report_orientationIndex = 0; report_orientationIndex < report_orientationArray.length; report_orientationIndex++) {
                    if (report_orientationIndex == 0) {
                        checkedreport_orientation = 'checked';
                    } else {
                        checkedreport_orientation = '';
                    }
                    divreport_orientation += '<div class="form-check form-check-inline">';
                    divreport_orientation += '<input class="form-check-input" type="radio" name="report_orientation" id="report_orientation' + report_orientationIndex + '" value="' + report_orientationArray[report_orientationIndex] + '" ' + checkedreport_orientation + '>';
                    divreport_orientation += '<label class="form-check-label" for="report_orientation' + report_orientationIndex + '">' + report_orientationArray[report_orientationIndex] + '</label>';
                    divreport_orientation += '</div>';
                }
                $('.report_orientation').append(divreport_orientation);
            }
        }
        reportComponent.bindUI();
    };

    var getAllReportFilter = async function (reportId) {
        const response = await makeAjaxRequest('GET', reportDynamically.getAllReportFilter, {
            reportId: reportId
        });
        if (response.status == false && response.error !== "") {
            AlertComponent._getAlertMessage('Error!', response.message, 'danger');
        } else if (response.status == false && response.message !== "") {
            AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
        } else {
            populateReportFilter(response.data);
        }
    };

    const populateReportFilter = (response) => {
        response.forEach(elem => {
            const hideClass = elem.class_type.toString().includes("hide") ? "hide" : "";
            const filterType = elem.component_type;
            const classType = elem.class_type;

            let options = '';
            if (Array.isArray(elem.filterdata)) {
                options = elem.filterdata.map(fd =>
                    `<option data-displayvalue="${reportComponent.titleCase(fd.dropdown_name)}" data-crit_id="${fd.dropdown_value}" value="${fd.dropdown_value}">${reportComponent.titleCase(fd.dropdown_name)}</option>`
                ).join('');
            }

            const select2 = `
							<div class="row mt-5 ${hideClass}">
									<div class="col-12 d-flex align-items-center">
											<label class="mr-auto" for="filter-${elem.class_id}">${elem.dropdown_label_name}</label>
											<div class="form-inline">
													<div class="custom-control custom-switch ml-2">
															<input type="checkbox" class="custom-control-input" id="txtNotIn${elem.class_id}" data-id="txtNotIn${elem.class_id}">
															<label class="custom-control-label" for="txtNotIn${elem.class_id}">Hide Selected</label>
													</div>
											</div>
									</div>
									<div class="col-12">
											<select class="form-control select2 ${classType}" id="filter-${elem.class_id}" data-id="${elem.class_id}" data-placeholder="${elem.dropdown_placeholder}" data-width="100%" multiple>
													${options}
											</select>
									</div>
							</div>
					`;
            const container = filterType === 'general' ? '.general' : filterType === 'item' ? '.itemss' : '.accountss';
            $(container).append(select2);
        });
        $('select.select2').select2();
    };

    const ResetSelect2Filters = () => {
        $('.filter').each(function (ind, elem) {
            const crit = {};
            let checkExisting = null;
            if ($(this).is('select')) {
                checkExisting = $(this).data("id");
                if (crit.hasOwnProperty(checkExisting) === false) {
                    $('#txtNotIn' + checkExisting).prop('checked', false);
                    $(this).val("").trigger('change.select2');
                }
            } else if ($(this).is('input')) {
                checkExisting = $(this).data("id");
                if (crit.hasOwnProperty(checkExisting) === false) {
                    $.trim($(this).val(""));
                }
            }
        });
    };
    return {
        hideLoader: false,

        init: async function () {
            reportComponent.bindUI();
            const reportId = $('.report_title').data('report_id');
            if ((reportId !== '') && (reportId !== undefined) && (reportId !== null)) {
                const reportComponent = await getAllReportComponent(reportId);
                const reportGroup = await getAllReportGroup(reportId);
                const reportFilter = await getAllReportFilter(reportId);
                if (reportComponent && reportGroup) {
                    reportCombination.init();
                }
                var UrduLanguage = getNumVal($('#txturdu_language'));
                if (UrduLanguage == 1) {
                    // getlanguagedata(reportId);
                }
            }
            $('#txtAutoChangeSearch').bootstrapSwitch('state', false);

        },

        bindUI: function () {

            $('#includeGroup').bootstrapSwitch();
            $("#includeGroup").bootstrapSwitch('offText', 'Show');
            $("#includeGroup").bootstrapSwitch('onText', 'Hide');

            $('#includeGroup1').bootstrapSwitch();
            $("#includeGroup1").bootstrapSwitch('offText', 'Show');
            $("#includeGroup1").bootstrapSwitch('onText', 'Hide');

            $('.btnSelCre').on('click', function (e) {
                e.preventDefault();
                $('#text-report-groups1').text('');
                $(this).siblings('.btnSelCre').removeClass('btn-primary');
                $(this).addClass('btn-primary');
                if ($(this).is(":visible")) {
                    const text = $(this).text();
                    $('#text-report-groups1').text('( ' + text + ',');
                }
            });
            $('.btnSelCre').on('click', function (e) {
                e.preventDefault();
                var state = $('#txtAutoChangeSearch').bootstrapSwitch('state');
                if (state == true)
                    setTimeout(function () {
                        $('#btnSearch').trigger('click');
                    }, 300);
            });
            $(document).ajaxStart(function () {
                $(".loader").show();
            });

            $(document).ajaxComplete(function (event, xhr, settings) {
                $(".loader").hide();
            });
            $('.btnSelCre2').on('click', function (e) {
                e.preventDefault();
                $('#text-report-groups2').text('');
                $(this).siblings('.btnSelCre2').removeClass('btn-primary');
                $(this).addClass('btn-primary');
                if ($(this).is(":visible")) {
                    const text = $(this).text();
                    $('#text-report-groups2').text(text + ') Wise');
                }
            });
            $('#txtResetFiltersModal').on('click', function (e) {
                e.preventDefault();
                ResetSelect2Filters();
            });
            $('.btnSelCre2').on('click', function (e) {
                e.preventDefault();
                var state = $('#txtAutoChangeSearch').bootstrapSwitch('state');
                if (state == true)
                    setTimeout(function () {
                        $('#btnSearch').trigger('click');
                    }, 300);
            });
        },
        Components: function (etype) {
            if (etype !== 'inhouse') {
                console.log(etype);
            }
            return etype;
        },
        isNumber: function (n) {
            return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
        },
        getCurrentView: function () {
            var what = $('.btnSelCre.btn-primary').text().split('Wise')[0].trim().toLowerCase();
            return what;
        },
        getCurrentView2: function () {
            var what = $('.btnSelCre2.btn-primary').text().split('Wise')[0].trim().toLowerCase();
            return what;
        },
        // get Crit Fro Report
        getCriteria: function (etype) {
            var crit = {};
            var filters = [];
            $('.filter').each(function (ind, elem) {
                if ($(this).is('select')) {
                    var checkexisting = $(this).data("id");
                    if (crit.hasOwnProperty(checkexisting) === false) {
                        if ($('#txtNotIn' + checkexisting + ':checked').val()) {
                            crit[$(this).data("id")] = { txtNotIn: 1, filterValue: $.trim($(this).select2("val")) };
                        } else {
                            crit[$(this).data("id")] = { txtNotIn: 0, filterValue: $.trim($(this).select2("val")) };
                        }
                    }
                } else if ($(this).is('input')) {
                    let checkexisting = $(this).data("id");
                    if (crit.hasOwnProperty(checkexisting) === false) {
                        crit[$(this).data("id")] = $.trim($(this).val());
                    }
                }
            });
            return crit;
        },
        getCriteriaText: function (etype) {
            var crit = {};
            crit.Include = "";
            crit.Exclude = "";
            $('.filter').each(function (ind, elem) {
                if ($(this).is('select')) {
                    var checkexisting = $(this).data("id");
                    var states = $('#txtNotIn' + checkexisting + ':checked').val();
                    if (crit.hasOwnProperty(checkexisting) === false) {
                        var selected = $(this).find('option:selected', this);
                        selected.each(function () {
                            var res = $(this).data('displayvalue').toString();
                            res = res.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
                            if (states === 'on') {
                                crit.Exclude += ifNull(res, '') + ',';
                            } else {
                                crit.Include += ifNull(res, '') + ',';
                            }
                        });
                    }
                }
            });
            return crit;

        },
        titleCase: function (str) {
            var splitStr = str.toLowerCase();
            splitStr = splitStr.split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            // Directly return the joined string
            return splitStr.join(' ');
        },
        // Checking for Values
        checkvaluetype: function (str) {
            var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
            if (numberRegex.test(str)) {
                return 'text-right';
            } else {
                return 'text-left';
            }
        },
        sortByKeyAsc: function (array, key) {
            return array.sort(function (a, b) {
                var x = a[key];
                var y = b[key];

                var check = reportComponent.isNumber(a[key]);
                if (check === true) {
                    return ((parseInt(x) < parseInt(y)) ? -1 : ((parseInt(x) > parseInt(y)) ? 1 : 0));
                } else {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }

            });
        },
    };
};
const reportComponent = new ReportComponent();
reportComponent.init();
export {
    reportComponent
}
