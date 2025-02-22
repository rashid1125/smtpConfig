import AlertComponent from "../../../../../js/components/AlertComponent.js";
import { makeAjaxRequest } from "../../../../../js/components/MakeAjaxRequest.js";

const chartOfAccount = {
    init: function () {
        chartOfAccount.bindUI();
    },
    showAllRows: function () {
        var oSettings = chartOfAccount.dTable.fnSettings();
        oSettings._iDisplayLength = 50000;
        chartOfAccount.dTable.fnDraw();
    },
    bindUI: function () {
        $(document).ready(function () {
            chartOfAccount.populateCOAGrid();
        });

        $('#btnPrint').on('click', function (ev) {
            chartOfAccount.showAllRows();
            ev.preventDefault();
            var url = base_url + '/doc/getChartOfAccounts/';
            var lastChar = url.substr(url.length - 1);
            if (lastChar == "/") {
                url = url.slice(0, -1);
            }
            window.open(url);
        });
        shortcut.add("F9", function () {
            $('#btnPrint').trigger('click');
        });
    },
    populateCOAGrid: async function () {
        if (typeof chartOfAccount.dTable != 'undefined') {
            chartOfAccount.dTable.fnDestroy();
            $('#chartOfAccountRows').empty();
        }
        const response = await makeAjaxRequest('GET', `${base_url}/account/chartOfAccount/getChartOfAccount`);
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ 'title': 'Error!', 'message': response.message, 'type': 'danger' });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ 'title': 'Warning!', 'message': response.message, 'type': 'warning' });
        } else {
            const data = response.data;
            if (data.length !== 0) {

                var prevL1 = '';
                var prevL2 = '';
                var prevL3 = '';

                $(data).each(function (index, elem) {

                    // debugger

                    var origAcctId = elem.ACCOUNT_ID;

                    if (elem.L1NAME != prevL1) {

                        prevL1 = elem.L1NAME;

                        elem.L1 = origAcctId.substr(0, 2);

                        var source = $("#ledger-level1-template").html();
                        var template = Handlebars.compile(source);
                        var l1row = template(elem);

                        $('#chartOfAccountRows').append(l1row);
                    }

                    if (elem.L2NAME != prevL2) {

                        prevL2 = elem.L2NAME;

                        elem.L2 = origAcctId.substr(0, 5);

                        var source = $("#ledger-level2-template").html();
                        var template = Handlebars.compile(source);
                        var l2Row = template(elem);

                        $('#chartOfAccountRows').append(l2Row);
                    }

                    if (elem.L3NAME != prevL3) {

                        prevL3 = elem.L3NAME;

                        elem.L3 = origAcctId.substr(0, 8);

                        var source = $("#ledger-level3-template").html();
                        var template = Handlebars.compile(source);
                        var l3Row = template(elem);

                        $('#chartOfAccountRows').append(l3Row);
                    }

                    //elem.ACCOUNT_ID = origAcctId;

                    var source = $("#chartOfAccountRow-template").html();
                    var template = Handlebars.compile(source);
                    var html = template(elem);

                    $('#chartOfAccountRows').append(html);
                });
                chartOfAccount.bindGrid();
                $("input[type='search']").focus();
            }
        }
    },

    bindGrid: function () {
        var doNotSort = [];
        $('#datatable_example thead th').each(function () {
            if ($(this).hasClass('no_sort')) {
                doNotSort.push({ "bSortable": false });
            } else {
                doNotSort.push(null);
            }
        });
        chartOfAccount.dTable = $('#datatable_example').dataTable({
            "iDisplayLength": 300,
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            "s`": "dataTables_wrapper form-inline"
        });
    }
};

$(document).ready(function () {
    chartOfAccount.init();
});
