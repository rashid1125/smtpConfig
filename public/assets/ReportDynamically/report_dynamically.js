import AlertComponent from "../../js/components/AlertComponent.js";
import { reportDynamically } from "../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../js/components/MakeAjaxRequest.js";
import { setFinancialYearDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek } from "../js/app_modules/commonFunctions/CommonFunction.js";
import { reportComponent } from "./report_component.js";

var Reports = function () {
    "use stric";
    let requestName;
    const getRandomChartColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const randomNum = () => Math.floor(Math.random() * (150 - 52 + 1) + 52);
    const randomRGB = () => `rgba(255, 99, 132, 0.2)`;
    // saves the data into the database
    const _getChartTypesFromChart_ = (Report_Id) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: base_url + 'index.php/filter/getChartTypesFromChart',
                data: { 'Report_Id': Report_Id },
                datatype: 'JSON',
                success: function (response) {
                    resolve(response);
                },
                error: function (xhr, status, error) {
                    reject($.notify({ message: xhr.responseText }, { type: 'danger' }));
                }
            });
        });
    };

    async function getChartTypesFromChart(Data, Report_Id) {
        $(".loader").show();
        const response = await _getChartTypesFromChart_(Report_Id);
        if (response.content.status == false && response.content.message !== "") {
            $.notify({ message: xhr.responseText }, { type: 'danger' });
        } else if (response.content.status === true) {
            const Is_Chart_MultiType = response.content.data[0].Is_Chart_MultiType;
            const Chart_Type = response.content.data[0].Chart_Type.split(",");
            if (Is_Chart_MultiType == 1)
                $.each(Chart_Type, function (indexInArray, valueOfElement) {
                    if (valueOfElement.toLowerCase() === 'line')
                        getLineChartImage(Data, "txt" + valueOfElement + "Chart", valueOfElement.toLowerCase());
                    if (valueOfElement.toLowerCase() === 'bar')
                        getBarChartImage(Data, "txt" + valueOfElement + "Chart", valueOfElement.toLowerCase());
                    if (valueOfElement.toLowerCase() === 'area')
                        getAreaChartImage(Data, "txt" + valueOfElement + "Chart", valueOfElement.toLowerCase());
                    if (valueOfElement.toLowerCase() === 'doughnut')
                        getDonutChartImage(Data, "txt" + valueOfElement + "Chart", valueOfElement.toLowerCase());
                });
        }
        $(".loader").hide();
    }
    const getLineChartImage = (data, Element_ID = "txtLineChart") => {
        Morris.Line({
            element: Element_ID,
            data: data.chart_report_data.reportData,
            xkey: 'Chart_Label_Name',
            ykeys: ['Chart_Value_Name'],
            labels: ['Chart Report'],
            parseTime: false,
            resize: true
        });
    };
    const getBarChartImage = (data, Element_ID = "txtLineChart") => {
        Morris.Bar({
            element: Element_ID,
            data: data.chart_report_data.reportData,
            xkey: 'Chart_Label_Name',
            ykeys: ['Chart_Value_Name'],
            labels: ['Chart Report'],
            parseTime: false,
            resize: true
        });
    };
    const getAreaChartImage = (data, Element_ID = "txtLineChart") => {
        Morris.Area({
            element: Element_ID,
            data: data.chart_report_data.reportData,
            xkey: 'Chart_Label_Name',
            ykeys: ['Chart_Value_Name'],
            labels: ['Chart Report'],
            parseTime: false,
            resize: true
        });
    };
    const getDonutChartImage = (data, Element_ID = "txtLineChart") => {
        const donut_data = [];
        $.each(data.chart_report_data.reportData, function (index, item) {

            const data1 = {
                label: item.Chart_Label_Name,
                value: item.Chart_Value_Name
            };
            donut_data.push(data1);
        });
        Morris.Donut({
            element: Element_ID,
            data: donut_data,
        });
    };

    const resetd = function () {
        $('#txtLineChart').html('');
        $('#txtBarChart').html('');
        $('#txtAreaChart').html('');
        $('#txtDoughnutChart').html('');
    };

    const getReportById = async function (
        startDate,
        endDate,
        what,
        what2,
        type,
        rtype,
        stockTypes,
        etype,
        crit,
        languageId,
        reportId,
        criteriaText
    ) {

        if (typeof Reports.dTable != 'undefined') {
            Reports.dTable.fnDestroy();

            $('#dataTable_example thead').remove();
            $('#tbl_body').empty();
        }
        $('#reportDynamicallyTable').html('');
        const response = await makeAjaxRequest('GET', reportDynamically.getReportById, {
            startDate: startDate,
            endDate: endDate,
            what: what,
            what2: what2,
            type: type,
            rtype: rtype,
            stockTypes: stockTypes,
            etype: etype,
            crit: crit,
            languageId: languageId,
            reportId: reportId,
            criteriaText: criteriaText,
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ 'title': "Error", 'message': response.message, 'type': 'danger' });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ 'title': "Warning", 'message': response.message, 'type': 'warning' });
        } else {
            $('#reportDynamicallyTable').html(response.data);
            setTimeout(() => {
                bindGrid(type);
            }, 200);

        }
    };


    var bindGrid = function (type) {
        const isSummaryReport = (type && type.toLocaleLowerCase() === 'summary report');
        const bPaginate = isSummaryReport; // Disable pagination for 'Summary Report'
        console.log(bPaginate)
        Reports.dTable = $('#dataTable_example').dataTable({
            processing: true,
            "sDom": '<if<t>lp>',
            "bPaginate": !bPaginate,
            'bFilter': !bPaginate,
            "fixedHeader": true,
            "sPaginationType": "full_numbers",
            "bJQueryUI": false,
            "bSort": false,
            "iDisplayLength": 100,
            "oTableTools": {
                "sSwfPath": "js/copy_cvs_xls_pdf.swf",
                "aButtons": [{
                    "sExtends": "print",
                    "sButtonText": "Print Report",
                    "sMessage": "Inventory Report"
                }]
            },
            buttons: [
                {
                    extend: 'copyHtml5',
                    className: 'btn btn-outline-secondary btn-copy-excel',
                    text: 'F3 Copy to clipboard',
                    titleAttr: 'Copy to clipboard',
                    exportOptions: {
                        rows: bPaginate ? ':visible' : undefined
                    }
                },
                {
                    extend: 'excelHtml5',
                    className: 'btn btn-outline-info btn-export-excel',
                    text: 'F8 Excel',
                    titleAttr: 'Export to Excel',
                    exportOptions: {
                        rows: bPaginate ? ':visible' : undefined
                    }
                }
            ],
            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });
        $('.nav-light > a.tool-action').off('click').on('click', function (e, index) {
            var action = $(this).attr('data-action');
            Reports.dTable.DataTable().button(action).trigger('click');
        });
    };

    var printReport = function (reportId, defaultFile = "-1") {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        const what = reportComponent.getCurrentView();
        const what2 = reportComponent.getCurrentView2();
        const type = $('input[name="types"]:checked').val() || 0;
        const rptype = $('input[name="rptype"]:checked').val() || 0;
        const stockTypes = $('input[name="stock_types"]:checked').val() || 0;
        const etype = $('#etype').val().trim().toLowerCase().replace(' ', '');
        const languageId = $('input[name="languageName"]:checked').val() || 0;
        const crit = encodeURIComponent(JSON.stringify(reportComponent.getCriteria(etype)));
        const criteriaText = encodeURIComponent(JSON.stringify(reportComponent.getCriteriaText(etype)));
        const reportOrientation = $('input[name="report_orientation"]:checked').val() || 0;

        let includeGroup = $('#includeGroup').bootstrapSwitch('state') ? '1' : '0';
        let includeGroup1 = $('#includeGroup1').bootstrapSwitch('state') ? '1' : '0';

        let group = includeGroup === '1' ? what : "";
        let subgroup = includeGroup1 === '1' ? what2 : "";

        // Constructing the query string
        let queryParams = {
            reportId,
            startDate,
            endDate,
            what: group, // Using the conditional value of group
            what2: subgroup, // Using the conditional value of subgroup
            type,
            rtype: rptype,
            stockTypes,
            etype,
            crit,
            languageId,
            reportOrientation,
            criteriaText
        };
        // Filter out empty parameters to avoid sending them in the query string
        Object.keys(queryParams).forEach(key => queryParams[key] === '' && delete queryParams[key]);
        // Build query string from queryParams object
        const queryString = Object.keys(queryParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`).join('&');
        const printURL = `${base_url}/doc/getReportId?${queryString}`;
        openPrintOnSettingConfiguration(printURL);
    };
    const ResetSelect2ChartFilters = () => {
        $('#txtChart_Label_Name').val('');
        $('#txtChart_Value_Name').val('');
    };

    return {

        init: function () {
            this.bindUI();
            var etype = ($('#etype').val().trim()).toLowerCase();
            requestName = $('#requestName').val();
        },
        bindUI: function () {
            var self = this;
            $('#txtAutoChangeSearch').bootstrapSwitch();
            $("#txtAutoChangeSearch").bootstrapSwitch('offText', 'No');
            $("#txtAutoChangeSearch").bootstrapSwitch('onText', 'Yes');
            $('.btnPrint').click(function (e) {
                e.preventDefault();
                const reportId = $(this).data('report_id');
                printReport(reportId);
            });
            $('#btnSearch').on('click', function (e) {
                e.preventDefault();
                const reportId = $(this).data('report_id');
                const startDate = $('#startDate').val();
                const endDate = $('#endDate').val();
                const what = reportComponent.getCurrentView();
                const what2 = reportComponent.getCurrentView2();
                const type = $('input[name="types"]:checked').val();
                const rptype = $('input[name="rptype"]:checked').val();
                const stockTypes = $('input[name="stock_types"]:checked').val();
                const etype = (($('#etype').val().trim()).toLowerCase()).replace(' ', '');
                const languageId = $('input[name="languageName"]:checked').val();
                const crit = reportComponent.getCriteria(etype);
                const criteriaText = reportComponent.getCriteriaText(etype);

                var error = false;
                var subgroup = "";
                var group = "";

                var includeGroup = ($('#includeGroup').bootstrapSwitch('state') === true) ? '1' : '0';
                var includeGroup1 = ($('#includeGroup1').bootstrapSwitch('state') === true) ? '1' : '0';

                if (includeGroup === '1') {
                    group = what;
                } else {
                    group = "";
                }

                if (includeGroup1 === '1') {
                    subgroup = what2;
                } else {
                    subgroup = "";
                }

                getReportById(startDate, endDate, group, subgroup, type, rptype, stockTypes, etype, crit, languageId, reportId, criteriaText);
            });

            $('#btnReset').on('click', function (e) {
                e.preventDefault();
                self.resetVoucher();
            });
            shortcut.add("F6", function () {
                $('.btnSearch').trigger('click');
            });
            shortcut.add("F9", function () {
                $('.btnPrint').get()[0].click();
            });

            shortcut.add("F3", function () {
                $('.btn-copy-excel').get()[0].click();
            });

            shortcut.add("F8", function () {
                $('.btn-export-excel').get()[0].click();
            });

            shortcut.add("F10", function () {
                $('.csv10').get()[0].click();
            });

            shortcut.add("F5", function () {
                self.resetVoucher();
            });

            $('#txtCloseAndSearchFilters').on('click', function (ev) {
                ev.preventDefault();
                $('.btnSearch').get()[0].click();
            });
            $('#txtCloseAndSearchChartFilters').on('click', function (ev) {
                ev.preventDefault();
                $('.btnSearch').get()[0].click();
            });
            $('#txtResetChartFiltersModal').click(function (e) {
                e.preventDefault();
                ResetSelect2ChartFilters();
            });

            $(document).ajaxStart(function () {
                $(".loader").show();
            });

            $(document).ajaxComplete(function (event, xhr, settings) {
                $(".loader").hide();
            });

            $(document.body).on('change', 'input[name="durType"]', function (e) {
                const dateType = $('input[type="radio"][name="durType"]:checked').val();
                if (dateType === 'today') {
                    updateDateRangeCurrentDay('startDate', 'endDate');
                } else if (dateType === 'year') {
                    setFinancialYearDate('startDate', 'endDate');
                } else if (dateType === 'week') {
                    updateDateRangeToCurrentWeek('startDate', 'endDate');
                } else if (dateType === 'month') {
                    updateDateRangeToCurrentMonth('startDate', 'endDate');
                }
            });
        },
        showAllRows: function () {
            var oSettings = Reports.dTable.fnSettings();
            oSettings._iDisplayLength = 50000;
            Reports.dTable.fnDraw();
        },
        resetVoucher: function () {
            general.reloadWindow();
        }
    };
};
var Reports = new Reports();
Reports.init();
