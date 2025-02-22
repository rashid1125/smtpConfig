import AlertComponent from "../../../../js/components/AlertComponent.js";
import { AMOUNT_ROUNDING } from "../../../../js/components/GlobalConstants.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { reportComponent } from "../../../ReportDynamically/report_component.js";
import { parseNumber } from "../commonFunctions/CommonFunction.js";
var TrialBalance = function () {
    var getTrialBalanceReport = async function (startDate, endDate, levelId, level2Id, level3Id) {

        if (typeof trialBalance.trialBalanceDataTable != 'undefined') {
            trialBalance.trialBalanceDataTable.fnDestroy();
            $('.dthead').empty();
            $('.saleRows').empty();
        }

        const response = await makeAjaxRequest('GET', `${base_url}/trialBalance/getTrialBalanceReport`, {
            startDate,
            endDate,
            levelId,
            level2Id,
            level3Id,
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ 'title': 'Error!', 'message': response.message, 'type': 'danger' });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ 'title': 'Warning!', 'message': response.message, 'type': 'warning' });
        } else {
            populateTrialBalanceReport(response.data);
        }
    };
    const populateTrialBalanceReport = (data) => {
        const th = $('#general-head-template').html();
        const tdDetail = $("#voucher-item-template").html();
        var template = Handlebars.compile(th);
        var html = template({});
        $('.dthead').html(html);

        const saleRows = $("#saleRows");
        let $serial = 1;

        let $serialLevel1 = 0;
        let $serialLevel2 = 0;
        let $serialLevel3 = 0;

        let $totalDebit = 0.00;
        let $totalCredit = 0.00;
        let $totalDebitLevel1 = 0.00;
        let $totalCreditLevel1 = 0.00;
        let $totalDebitLevel2 = 0.00;
        let $totalCreditLevel2 = 0.00;
        let $totalDebitLevel3 = 0.00;
        let $totalCreditLevel3 = 0.00;


        let $level1Name = '';
        let $level2Name = '';
        let $level3Name = '';

        var $level1Id = '';
        var $level2Id = '';
        var $level3Id = '';
        $.each(data, function (index, $row) {
            if ($level1Id != $row.l1) {
                if ($level3Id != $row.l3) {
                    if ($serialLevel3 !== 0) {
                        const sourceLevel3 = $("#voucher-level3-sum-template").html();
                        const template = Handlebars.compile(sourceLevel3);
                        const htmlLevel3 = template({
                            totalDebitLevel3: parseFloat($totalDebitLevel3).toFixed(2),
                            totalCreditLevel3: parseFloat($totalCreditLevel3).toFixed(2),
                            level3Name: $level3Name,
                            'TOTAL_HEAD': `${$level3Name} TOTAL`
                        });
                        saleRows.append(htmlLevel3);

                        $totalDebitLevel3 = 0;
                        $totalCreditLevel3 = 0;
                        $serialLevel3 = 0;
                    }
                }

                if ($level2Id != $row.l2) {
                    if ($serialLevel2 !== 0) {
                        const sourceLevel2 = $("#voucher-level2-sum-template").html();
                        const templateLevel2 = Handlebars.compile(sourceLevel2);
                        const htmlLevel2 = templateLevel2({
                            totalDebitLevel2: parseFloat($totalDebitLevel2).toFixed(2),
                            totalCreditLevel2: parseFloat($totalCreditLevel2).toFixed(2),
                            level2Name: $level2Name,
                            'TOTAL_HEAD': `${$level2Name} TOTAL`
                        });
                        saleRows.append(htmlLevel2);

                        $totalDebitLevel2 = 0;
                        $totalCreditLevel2 = 0;
                        $serialLevel2 = 0;
                    }
                }
                if ($serialLevel1 !== 0) {
                    const sourceLevel1 = $("#voucher-level1-sum-template").html();
                    const templateLevel1 = Handlebars.compile(sourceLevel1);
                    const htmlLevel1 = templateLevel1({
                        totalDebitLevel1: parseFloat($totalDebitLevel1).toFixed(2),
                        totalCreditLevel1: parseFloat($totalCreditLevel1).toFixed(2),
                        level1Name: $level1Name,
                        'TOTAL_HEAD': `${$level1Name} TOTAL`
                    });
                    saleRows.append(htmlLevel1);

                    $totalDebitLevel1 = 0;
                    $totalCreditLevel1 = 0;
                    $serialLevel1 = 0;
                }


                const sourceLevel1Group = $("#voucher-level1-name-template").html();
                const template = Handlebars.compile(sourceLevel1Group);
                const htmlLevel1Group = template({
                    LEVEL1ID: $row.account_id.substr(0, 2),
                    LEVEL1NAME: $row.l1_name,
                });
                saleRows.append(htmlLevel1Group);
                $level1Id = $row.l1;
                $level1Name = $row.l1_name;

            }


            if ($level2Id != $row.l2) {

                if ($level3Id != $row.l3) {
                    if ($serialLevel3 !== 0) {
                        const sourceLevel3 = $("#voucher-level3-sum-template").html();
                        const templateLevel3 = Handlebars.compile(sourceLevel3);
                        const htmlLevel3 = templateLevel3({
                            totalDebitLevel3: parseFloat($totalDebitLevel3).toFixed(2),
                            totalCreditLevel3: parseFloat($totalCreditLevel3).toFixed(2),
                            level3Name: $level3Name,
                            'TOTAL_HEAD': `${$level3Name} TOTAL`
                        });
                        saleRows.append(htmlLevel3);
                        $totalDebitLevel3 = 0;
                        $totalCreditLevel3 = 0;
                        $serialLevel3 = 0;
                    }
                }

                if ($serialLevel2 !== 0) {

                    const sourceLevel2 = $("#voucher-level2-sum-template").html();
                    const templateLevel2 = Handlebars.compile(sourceLevel2);
                    const htmlLevel2 = templateLevel2({
                        totalDebitLevel2: parseFloat($totalDebitLevel2).toFixed(2),
                        totalCreditLevel2: parseFloat($totalCreditLevel2).toFixed(2),
                        level2Name: $level2Name,
                        'TOTAL_HEAD': `${$level2Name} TOTAL`
                    });
                    saleRows.append(htmlLevel2);

                    $totalDebitLevel2 = 0;
                    $totalCreditLevel2 = 0;
                    $serialLevel2 = 0;
                }

                const sourceLevel2Group = $("#voucher-level2-name-template").html();
                const templateLevel2Group = Handlebars.compile(sourceLevel2Group);
                const htmlLevel2Group = templateLevel2Group({
                    LEVEL2ID: $row.account_id.substr(0, 5),
                    LEVEL2NAME: $row.l2_name
                });
                saleRows.append(htmlLevel2Group);
                $level2Id = $row.l2;
                $level2Name = $row.l2_name;
            }

            if ($level3Id != $row.l3) {
                if ($serialLevel3 !== 0) {

                    const sourceLevel3 = $("#voucher-level3-sum-template").html();
                    const templateLevel3 = Handlebars.compile(sourceLevel3);
                    const htmlLevel3 = templateLevel3({
                        totalDebitLevel3: parseFloat($totalDebitLevel3).toFixed(2),
                        totalCreditLevel3: parseFloat($totalCreditLevel3).toFixed(2),
                        level3Name: $level3Name,
                        'TOTAL_HEAD': `${$level3Name} TOTAL`
                    });
                    saleRows.append(htmlLevel3);

                    $totalDebitLevel3 = 0;
                    $totalCreditLevel3 = 0;
                    $serialLevel3 = 0;
                }
                const sourceLevel3Group = $("#voucher-level3-name-template").html();
                const templateLevel3Group = Handlebars.compile(sourceLevel3Group);
                const htmlLevel3Group = templateLevel3Group({
                    LEVEL3ID: $row.account_id.substr(0, 8),
                    LEVEL3NAME: $row.l3_name
                });
                saleRows.append(htmlLevel3Group);

                $level3Id = $row.l3;
                $level3Name = $row.l3_name;
            }

            var obj = {};

            obj.accountId = ($row.account_id) ? $row.account_id : "Not Available";
            obj.accountName = ($row.party_name) ? $row.party_name : "Not Available";
            obj.accountPId = ($row.pid) ? $row.pid : "Not Available";
            obj.duringDebit = ($row.debit - $row.credit > 0) ? (parseFloat($row.debit - $row.credit).toFixed(AMOUNT_ROUNDING)) : "-";
            obj.duringCredit = ($row.debit - $row.credit < 0) ? (Math.abs(parseFloat($row.debit - $row.credit).toFixed(AMOUNT_ROUNDING))) : "-";

            var source = tdDetail;
            var template = Handlebars.compile(source);
            var html = template(obj);
            saleRows.append(html);


            $totalDebit += parseFloat(($row.debit - $row.credit > 0) ? parseFloat($row.debit - $row.credit) : 0);
            $totalCredit += parseFloat(($row.debit - $row.credit < 0) ? parseFloat(Math.abs($row.debit - $row.credit)) : 0);

            $totalDebitLevel1 += parseFloat(($row.debit - $row.credit > 0) ? parseFloat($row.debit - $row.credit) : 0);
            $totalCreditLevel1 += parseFloat(($row.debit - $row.credit < 0) ? parseFloat(Math.abs($row.debit - $row.credit)) : 0);

            $totalDebitLevel2 += parseFloat(($row.debit - $row.credit > 0) ? parseFloat($row.debit - $row.credit) : 0);
            $totalCreditLevel2 += parseFloat(($row.debit - $row.credit < 0) ? parseFloat(Math.abs($row.debit - $row.credit)) : 0);

            $totalDebitLevel3 += parseFloat(($row.debit - $row.credit > 0) ? parseFloat($row.debit - $row.credit) : 0);
            $totalCreditLevel3 += parseFloat(($row.debit - $row.credit < 0) ? parseFloat(Math.abs($row.debit - $row.credit)) : 0);

            $serialLevel1 += 1;
            $serialLevel2 += 1;
            $serialLevel3 += 1;


            // each loop
        });

        if ($serialLevel3 !== 0) {

            var sourcel3 = $("#voucher-level3-sum-template").html();
            var template = Handlebars.compile(sourcel3);
            var htmll3 = template({
                totalDebitLevel3: parseFloat($totalDebitLevel3).toFixed(2),
                totalCreditLevel3: parseFloat($totalCreditLevel3).toFixed(2),
                level3Name: $level3Name,
                'TOTAL_HEAD': `${$level3Name} TOTAL`
            });
            saleRows.append(htmll3);

            $totalDebitLevel3 = 0;
            $totalCreditLevel3 = 0;
            $serialLevel3 = 0;
        }

        if ($serialLevel2 !== 0) {

            var sourcel2 = $("#voucher-level2-sum-template").html();
            var template = Handlebars.compile(sourcel2);
            var htmll2 = template({
                totalDebitLevel2: parseFloat($totalDebitLevel2).toFixed(2),
                totalCreditLevel2: parseFloat($totalCreditLevel2).toFixed(2),
                level2Name: $level2Name,
                'TOTAL_HEAD': `${$level2Name} TOTAL`
            });
            saleRows.append(htmll2);

            $totalDebitLevel2 = 0;
            $totalCreditLevel2 = 0;
            $serialLevel2 = 0;
        }
        if ($serialLevel1 !== 0) {

            var sourcel1 = $("#voucher-level1-sum-template").html();
            var template = Handlebars.compile(sourcel1);
            var htmll1 = template({
                totalDebitLevel1: parseFloat($totalDebitLevel1).toFixed(2),
                totalCreditLevel1: parseFloat($totalCreditLevel1).toFixed(2),
                level1Name: $level1Name,
                'TOTAL_HEAD': `${$level1Name} TOTAL`
            });
            saleRows.append(htmll1);

            $totalDebitLevel1 = 0;
            $totalCreditLevel1 = 0;
            $serialLevel1 = 0;
        }


        var sourcel1 = $("#voucher-grand-sum-template").html();
        var template = Handlebars.compile(sourcel1);
        var htmll1 = template({
            totalDebit: parseFloat($totalDebit).toFixed(2),
            totalCredit: parseFloat($totalCredit).toFixed(2),
            'TOTAL_HEAD': 'GRAND TOTAL'
        });
        saleRows.append(htmll1);
        bindGrid();
        $("td.text-right").digits();

    };
    $.fn.digits = function () {
        return this.each(function () {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        });
    };
    var bindGrid = function (type = "D") {
        const isSummaryReport = type.toLocaleLowerCase() === 'summary report';
        const bPaginate = !isSummaryReport; // Disable pagination for 'Summary Report'

        trialBalance.trialBalanceDataTable = $('#trialBalanceDataTable').dataTable({
            processing: true,
            "sDom": '<if<t>lp>',
            "bPaginate": bPaginate,
            'bFilter': bPaginate,
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
                    exportOptions: { rows: ':visible' }
                },
                {
                    extend: 'excelHtml5',
                    className: 'btn btn-outline-info btn-export-excel',
                    text: 'F8 Excel',
                    titleAttr: 'Export to Excel',
                    exportOptions: { rows: ':visible' }
                }
            ],
            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });
        $('.nav-light > a.tool-action').off('click').on('click', function (e, index) {
            var action = $(this).attr('data-action');
            trialBalance.dTable.DataTable().button(action).trigger('click');
        });
    };
    const printTrialBalance = () => {
        const hasMultipleTableRows = $('#trialBalanceDataTable tbody tr').length > 0;
        if (!hasMultipleTableRows) {
            AlertComponent.getAlertMessage({
                title: "Error",
                message: "Please search for data before issuing a print command.",
                type: "danger"
            });
            return;
        }

        const startDate = null;
        const endDate = $('#to_date').val();
        const levelId = $('#drpLevel1').val() || 0;
        const level2Id = $('#drpLevel2').val() || 0;
        const level3Id = $('#drpLevel3').val() || 0;
        const criteriaText = reportComponent.getCriteriaText() || -1;
        const windowOpenURL = `${base_url}/doc/getTrialBalance/?startDate=${startDate}&endDate=${endDate}&levelId=${levelId}&level2Id=${level2Id}&level3Id=${level3Id}&criteriaText=${criteriaText.Include}`;
        openPrintOnSettingConfiguration(windowOpenURL);
    };
    return {

        init: function () {
            this.bindUI();
            $('.select2').select2();
        },

        bindUI: function () {

            var self = this;
            var from = '2000-05-23';
            $('#from_date').val(from);
            $('.btnSearch').on('click', function (e) {
                e.preventDefault();
                self.initSearch();
            });
            $('.btnPrint').on('click', function (e) {
                e.preventDefault();
                printTrialBalance();
            });
            $('#drpLevel3').on('change', function () {
                $('#drpLevel1').val($('#drpLevel3 option:selected').data('l1')).trigger('change.select2');
                $('#drpLevel2').val($('#drpLevel3 option:selected').data('l2')).trigger('change.select2');
            });
            $('#drpLevel2').on('change', function () {
                $('#drpLevel1').val($('#drpLevel2 option:selected').data('l1')).trigger('change.select2');
                $('#drpLevel3').val('').trigger('change.select2');
            });
            $('#drpLevel1').on('change', function () {
                $('#drpLevel2').val('').trigger('change.select2');
                $('#drpLevel3').val('').trigger('change.select2');
            });

            $('#btnResetfilters').on('click', function (e) {
                e.preventDefault();
                $('#drpLevel1').val('').trigger('change.select2');
                $('#drpLevel2').val('').trigger('change.select2');
                $('#drpLevel3').val('').trigger('change.select2');
            });
            $('.btnReset').on('click', function (e) {

                self.resetVoucher();
            });
            $('body').on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                const accountId = $(this).closest('tr').find('td.PARTY_ID').data('account_id');
                const url = `${base_url}/accountLedger?account_id=${accountId}`
                window.open(url, '_blank').focus();
            });

            shortcut.add("F3", function () {
                $('.copy5').get()[0].click();
            });

            shortcut.add("F8", function () {
                $('.excel8').get()[0].click();
            });

            shortcut.add("F10", function () {
                $('.csv10').get()[0].click();
            });

            shortcut.add("F9", function () {
                $('.btnPrint').get()[0].click();
            });
            shortcut.add("F6", function () {
                self.initSearch();
            });
            shortcut.add("F5", function () {
                self.resetVoucher();
            });

        },

        initSearch: function () {

            const startDate = null;
            const endDate = $('#to_date').val();
            const levelId = $('#drpLevel1').val() || null;
            const level2Id = $('#drpLevel2').val() || null;
            const level3Id = $('#drpLevel3').val() || null;
            getTrialBalanceReport(startDate, endDate, levelId, level2Id, level3Id);
        },

        // resets the voucher to its default state
        resetVoucher: function () {
            general.reloadWindow();
        }
    };

};

const trialBalance = new TrialBalance();
trialBalance.init();
