import BaseClass from "../../../../js/components/BaseClass.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { disableSearchButton, enableSearchButton, ifNull, parseNumber, setFinancialYearDate, updateFormattedDate } from "../commonFunctions/CommonFunction.js";
const baseInstance = new BaseClass();
var AgingSheet = function () {
    const _getNumberOfString = (n) => {
        const _N = $.trim(n).toString().replace(/,/g, '');
        return isNaN(parseFloat(_N)) ? 0 : parseFloat(_N);
    };
    const getAgingSheetReportData = async (tillDate, agingSheetType, accountIds, debtorsIds, creditorsIds) => {

        if (typeof agingSheet.agingSheetDataTable != 'undefined') {
            agingSheet.agingSheetDataTable.fnDestroy();
            $('#agingSheetBody').empty();
            $('#agingSheetFooter').empty();
        }
        $(".loader").show();

        try {
            const response = await makeAjaxRequest('GET', `${base_url}/agingSheet/getAgingSheet`, { tillDate, agingSheetType, accountIds, debtorsIds, creditorsIds });
            if (response && response.status == false && response.error !== "") {
                const openingBalance = $('.opening-bal').text();
                $('.running-total').text(openingBalance);
                AlertComponent._getAlertMessage('Error!', response.message, 'danger');
            } else if (response && response.status == false && response.message !== "") {
                AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
            } else {
                populateAgingSheetData(response.data);
            }
        } catch (error) {
            console.log('Error:', error);
        } finally {
            $(".loader").hide();
        }
    };

    const populateAgingSheetData = (result) => {
        if (result == false) {
            $('.running-total').html(getNumText($('.opening-bal')));
        }

        if (result.length !== 0 || result !== false) {
            var th;
            var td1;


            th = $('#general-head-template').html();
            td1 = $("#voucher-item-template").html();

            var template = Handlebars.compile(th);
            var html = template({});
            $('#agingSheetHead').html(html);


            let totalCurrentBalance = 0;
            let total15Days = 0;
            let total30Days = 0;
            let total45Days = 0;
            let total60Days = 0;
            let total75Days = 0;
            let total90Days = 0;
            let total105Days = 0;
            let total120Days = 0;

            var SERIAL = 1;
            const agingSheetBody = $("#agingSheetBody");
            const agingSheetFooter = $("#agingSheetFooter");

            $.each(result, function (index, elem) {
                const obj = {};
                obj.SERIAL = SERIAL++;

                const partyName = elem.partyName;
                const currentBalance = elem.currentBalance;
                const balance15Days = elem['15Days'];
                const balance30Days = elem['30Days'];
                const balance45Days = elem['45Days'];
                const balance60Days = elem['60Days'];
                const balance75Days = elem['75Days'];
                const balance90Days = elem['90Days'];
                const balance105Days = elem['105Days'];
                const balance120Days = elem['120Days'];
                const over120Days = elem['Over120Days'];



                obj.partyName = ifNull(partyName, "-");
                obj.currentBalance = parseNumber(currentBalance).toFixed(AMOUNT_ROUNDING);
                obj.balance15Days = parseNumber(balance15Days).toFixed(AMOUNT_ROUNDING);
                obj.balance30Days = parseNumber(balance30Days).toFixed(AMOUNT_ROUNDING);
                obj.balance45Days = parseNumber(balance45Days).toFixed(AMOUNT_ROUNDING);
                obj.balance60Days = parseNumber(balance60Days).toFixed(AMOUNT_ROUNDING);
                obj.balance75Days = parseNumber(balance75Days).toFixed(AMOUNT_ROUNDING);
                obj.balance90Days = parseNumber(balance90Days).toFixed(AMOUNT_ROUNDING);
                obj.balance105Days = parseNumber(balance105Days).toFixed(AMOUNT_ROUNDING);
                obj.balance120Days = parseNumber(balance120Days).toFixed(AMOUNT_ROUNDING);
                obj.over120Days = parseNumber(over120Days).toFixed(AMOUNT_ROUNDING);

                // Add the item of the new voucher
                var source = td1;
                var template = Handlebars.compile(source);
                var html = template(obj);
                agingSheetBody.append(html);


                totalCurrentBalance += parseNumber(currentBalance);
                total15Days += parseNumber(balance15Days);
                total30Days += parseNumber(balance30Days);
                total45Days += parseNumber(balance45Days);
                total60Days += parseNumber(balance60Days);
                total75Days += parseNumber(balance75Days);
                total90Days += parseNumber(balance90Days);
                total105Days += parseNumber(balance105Days);
                total120Days += parseNumber(balance120Days);

                if (index === (result.length - 1)) {
                    let source1 = $("#voucher-sum-template").html();
                    let template1 = Handlebars.compile(source1);
                    let html1 = template1({
                        'TOTAL_HEAD': 'GRAND TOTAL',
                        totalCurrentBalance: parseNumber(totalCurrentBalance).toFixed(AMOUNT_ROUNDING),
                        total15Days: parseNumber(total15Days).toFixed(AMOUNT_ROUNDING),
                        total30Days: parseNumber(total30Days).toFixed(AMOUNT_ROUNDING),
                        total45Days: parseNumber(total45Days).toFixed(AMOUNT_ROUNDING),
                        total60Days: parseNumber(total60Days).toFixed(AMOUNT_ROUNDING),
                        total75Days: parseNumber(total75Days).toFixed(AMOUNT_ROUNDING),
                        total90Days: parseNumber(total90Days).toFixed(AMOUNT_ROUNDING),
                        total105Days: parseNumber(total105Days).toFixed(AMOUNT_ROUNDING),
                        total120Days: parseNumber(total120Days).toFixed(AMOUNT_ROUNDING)
                    });
                    agingSheetFooter.append(html1);
                }
            });
        }
        $("td.text-right").digits();
        bindGrid();
    };
    var bindGrid = function () {
        agingSheet.agingSheetDataTable = $('#agingSheetDataTable').dataTable({
            processing: true,
            "sDom": '<if<t>lp>',
            "bPaginate": false,
            'bFilter': true,
            'autoWidth': false,
            "fixedHeader": true,
            "sPaginationType": "full_numbers",
            "bJQueryUI": false,
            "bSort": true,
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
                    exportOptions: {
                        rows: ':visible',
                        format: {
                            body: function (data, row, column, node) {
                                // Strip $ from salary column to make it numeric
                                if (column === 2)
                                    return data.replace(/[$,]/g, '');
                                else if ($(node).hasClass('text-account-ledger-total') === true)
                                    return data.replace(/[$,]/g, '');
                                else return $.trim($(node).text());
                            }
                        }
                    }
                }
            ],
            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });
        $('.nav-light > a.tool-action').off('click').on('click', function (e, index) {
            var action = $(this).attr('data-action');
            agingSheet.accountLedgerDataTable.DataTable().button(action).trigger('click');
        });
        $('.buttons-colvis').on('click', function (e) {
            $('.dt-button-collection').css({ 'display': 'block', 'top': '499px', 'left': '609.203px' });
            $('.div.dt-button-collection').css('width', '161px');
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            "s`": "dataTables_wrapper form-inline form-input-class",
        });
    };
    $.fn.digits = function () {
        return this.each(function () {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        });
    };

    var fetchPartyBalance = async function (pid, Cash = "") {
        $(".loader").show();
        try {
            const response = await makeAjaxRequest('GET', `${base_url}/account/getAccountById`, { pid });
            if (response && response.status == false && response.error !== "") {
                AlertComponent._getAlertMessage('Error!', response.message, 'danger');
            } else if (response && response.status == false && response.message !== "") {
                AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
            } else {
                triggerAndRenderOptions($('#accountDropdown'), response.name, response.pid);
            }
        } catch (error) {
            $(".loader").hide();
            console.log('Error:', error);
        } finally {
            $(".loader").hide();
        }
    };
    const fetchRequestedVr = async () => {
        var accountId = general.getQueryStringVal('account_id');
        setFinancialYearDate();
        if ((accountId) > 0) {
            await fetchPartyBalance(accountId);
            $('.btnSearch').trigger('click');
        }
    };

    const printReport = (language_id = 1) => {
        var error = getValidateSearch();
        if (!error) {
            const startDate = $('#from_date').val();
            const endDate = $('#to_date').val();
            const accountId = $('#accountDropdown').val();
            const languageId = 1;
            const printHeader = $('input[name="printheader"]:checked').val();
            const printURL = `${base_url}/doc/getAccountLedgerPDF?startDate=${startDate}&endDate=${endDate}&accountId=${accountId}&language_id=${languageId}&paperSize=${printHeader}`;
            openPrintOnSettingConfiguration(printURL);
        } else {
            alert('Correct the errors...');
        }
    };

    const SendEmailPDfWithGivenEmail = function (_from, _to, _pid, companyid, printheader, language_id) {
        $.ajax({
            url: base_url + '/doc/pdf_ledger',
            type: 'POST',
            data: { 'from': _from, 'to': _to, 'pid': _pid, 'language_id': language_id, 'printheader': printheader, 'emailflag': "1", 'emailAddress': $.trim($('#txtEmailPdf').val()) },
            dataType: 'JSON',
            async: false,
            success: function (response) {
                if (response.status && response.message !== "") $.notify({ message: response.message }, { type: 'success' });
                $('#txtEmailPdf').val('');
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    const validateEmailS = function (sEmail) {
        $('#txtEmailPdf').removeClass('inputerror');
        var emails = sEmail.split(',');
        var valid = true;
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        for (var i = 0; i < emails.length; i++) {
            if (emails[i] === "" || !regex.test(emails[i].replace(/\s/g, ""))) {
                valid = false;
            }
        }
        if ($('#txtEmailPdf').val().length < 1)
            $('#txtEmailPdf').addClass('inputerror');
        return valid;
    };

    /**
    * Toggles the tally status of a ledger row and updates its appearance based on the result.
    * @param {jQuery} trow - jQuery object representing the table row.
    * @param {number} flag - Indicator of whether the row is currently tallied (1 or 0).
    * */
    const getTallyLedgerRow = async (trow, flag = 0) => {
        const isFlagClass = (parseNumber(flag) == 0) ? '' : 'highlightedTalliedRow';
        trow.removeClass('highlightedTalliedRow');
        try {
            const accountLedgerId = trow.find('td.pvrnoa').data('pledid');  // Extract ledger ID from data attribute.
            const response = await makeAjaxRequest('put', `${base_url}/accountLedger/getTallyLedgerRow`, {
                accountLedgerId: accountLedgerId,
                isAlreadyTally: flag
            });

            if (response && response.status === true) {
                // Successful operation
                AlertComponent.getAlertMessage({ title: 'Successfully!', message: response.message, type: 'success' });
                trow.addClass(isFlagClass);  // Re-apply class if operation was successful.
            } else if (response && response.error) {
                // Specific error handling
                AlertComponent.getAlertMessage({ title: 'Error!', message: response.error, type: 'danger' });
            } else {
                // General information message for other cases
                AlertComponent.getAlertMessage({ title: 'Information!', message: response.message, type: 'info' });
            }
        } catch (error) {
            console.error('Failed to update tally status:', error);
            AlertComponent.getAlertMessage({ title: 'Error!', message: 'Failed to process your request.', type: 'danger' });
        }
    };


    const getChequeInHandLookUp = async (accountId = 0, chequeListNumber = 0) => {

        $('#saleRows_cheque_list_number').empty();
        $('.pdc-total').html(0);

        const response = await makeAjaxRequest('GET', `${base_url}/accountLedger/getChequeInHand`, { accountId, chequeListNumber });
        if (response.status == false && response.error !== null) {
            $('.pdc-hide').addClass('d-none');
            $('#datatable_example_cheque_list_number').addClass('d-none');
            AlertComponent._getAlertMessage('Error!', response.message, 'danger');
        } else if (response.status == false && response.message !== null) {
            $('.pdc-hide').addClass('d-none');
            $('#datatable_example_cheque_list_number').addClass('d-none');
            // AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
        } else {
            $('.pdc-hide').removeClass('d-none');
            $('#datatable_example_cheque_list_number').removeClass('d-none');
            populatePendingChequeInHand(response.data);
        }
    };

    var populatePendingChequeInHand = function (data) {
        if (data.length !== 0 || data !== false) {
            $('#chart_tabs').addClass('disp');
            $('.tableDate').removeClass('disp');

            var th;
            var td1;


            th = $('#general-cheque_list_number-head-template').html();
            td1 = $("#voucher-cheque_list_number-item-template").html();

            var template = Handlebars.compile(th);
            var html = template({});
            $('.dthead_cheque_list_number').html(html);
            $("#datatable_example_cheque_list_number_wrapper").fadeIn();


            var TOTALRECEIVED = 0;
            var TOTALAMOUNT = 0;
            var TOTALCHEQUEAMOUNT = 0;

            var SERIAL = 1;
            var saleRows = $("#saleRows_cheque_list_number");

            $.each(data, function (index, elem) {
                var obj = {};
                obj.SERIAL = SERIAL++;
                obj.CHEQUELIST = (elem.cheque_list_number) ? elem.cheque_list_number : "-";
                obj.CHEQUENO = (elem.cheque_no) ? elem.cheque_no : "-";
                obj.CHEQUEDATE = (elem.cheque_vrdate) ? getFormattedDate(elem.cheque_vrdate.substr(0, 10)) : "-";
                obj.ACCOUNTNAME = (elem.received_from) ? elem.received_from : "-";
                obj.RECEIVED = (elem.received_amount) ? Number.parseFloat(elem.received_amount).toFixed(AMOUNT_ROUNDING) : 0;
                obj.AMOUNT = (elem.amount) ? Number.parseFloat(elem.amount).toFixed(AMOUNT_ROUNDING) : 0;
                obj.CHEQUEAMOUNT = (elem.cheque_amount) ? Number.parseFloat(elem.cheque_amount).toFixed(AMOUNT_ROUNDING) : 0;

                // Add the item of the new voucher
                var source = td1;
                var template = Handlebars.compile(source);
                var html = template(obj);
                saleRows.append(html);

                TOTALRECEIVED += Number.parseFloat(elem.received_amount);
                TOTALAMOUNT += Number.parseFloat(elem.amount);
                TOTALCHEQUEAMOUNT += Number.parseFloat(elem.cheque_amount);

                const _Opening = _getNumberOfString($('.opening-bal').text());
                const _Debit = _getNumberOfString($('.net-debit').text());
                const _Credit = _getNumberOfString($('.net-credit').text());
                const _AccountBalance = Number.parseFloat(_Opening) + Number.parseFloat(_Debit) - Number.parseFloat(_Credit);
                const NetBalance = Number.parseFloat(TOTALCHEQUEAMOUNT) + Number.parseFloat(_AccountBalance);

                if (index === (data.length - 1)) {
                    let source = $("#voucher-cheque_list_number-sum-template").html();
                    let template = Handlebars.compile(source);
                    let html = template({ 'TOTAL_HEAD': 'TOTAL', VOUCHER_TOTALRECEIVED: TOTALRECEIVED.toFixed(AMOUNT_ROUNDING), VOUCHER_TOTALAMOUNT: TOTALAMOUNT.toFixed(AMOUNT_ROUNDING), VOUCHER_TOTALCHEQUEAMOUNT: TOTALCHEQUEAMOUNT.toFixed(AMOUNT_ROUNDING) });
                    saleRows.append(html);

                    let source1 = $("#voucher-cheque_list_number-sum-template2").html();
                    let template1 = Handlebars.compile(source1);
                    let html1 = template1({ 'TOTAL_HEAD': 'BALANCE INCLUDING PDC', VOUCHER_TOTALRECEIVED: TOTALRECEIVED.toFixed(AMOUNT_ROUNDING), VOUCHER_TOTALAMOUNT: TOTALAMOUNT.toFixed(AMOUNT_ROUNDING), VOUCHER_TOTALCHEQUEAMOUNT: NetBalance.toFixed(AMOUNT_ROUNDING) });
                    saleRows.append(html1);
                }
                $('.pdc-total').text(Number.parseFloat(TOTALCHEQUEAMOUNT).toFixed(AMOUNT_ROUNDING)).digits();
            });
            const _Opening = _getNumberOfString($('.opening-bal').text());
            const _Debit = _getNumberOfString($('.net-debit').text());
            const _Credit = _getNumberOfString($('.net-credit').text());
            const _PDCAmount = _getNumberOfString($('.pdc-total').text());
            const _Netbalance = Number.parseFloat(_Opening) + Number.parseFloat(_Debit) - Number.parseFloat(_Credit) + Number.parseFloat(_PDCAmount);
            $('.running-total').html(Number.parseFloat(_Netbalance).toFixed(AMOUNT_ROUNDING)).digits();
        }
        $("td.text-right").digits();
    };
    var fetchEmail = function (pid) {
        $.ajax({
            url: base_url + '/customer/fetchEmail',
            type: 'POST',
            data: { 'pid': pid },
            dataType: 'JSON',
            async: false,
            success: function (data) {
                if (data !== false) {
                    $('#txtEmailPdf').val(data[0].email);
                }
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    function debounce(func, wait) {
        let timeout;

        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    return {
        init: function () {
            this.bindUI();
        },
        bindUI: function () {
            const self = this;
            $('#from_date').datepicker('update', $('#sdate').val());
            $('#to_date').datepicker('update', $('#edate').val());
            $('.modal-lookup .populateAccount').on('click', function () {
                var party_id = $(this).closest('tr').find('input[name=hfModalPartyId]').val();
                $("#accountDropdown").select2("val", party_id);
            });
            $('.btnSearch').on('click', async function (e) {
                e.preventDefault();
                await self.initSearch();
            });
            shortcut.add("F3", function () {
                $('.copy5 ').get()[0].click();
            });
            shortcut.add("F8", function () {
                $('.excel8 ').get()[0].click();
            });
            shortcut.add("F10", function () {
                $('.csv10 ').get()[0].click();
            });
            $('.btnReset').on('click', function (e) {
                e.preventDefault();
                general.reloadWindow();
            });
            $('#txtBtnSendEmailPDF').on('click', function (e) {
                e.preventDefault();
                var emailAddress = $.trim($('#txtEmailPdf').val());
                var validateEmail = validateEmailS(emailAddress);
                var _from = getSqlFormattedDate($('#from_date').val());
                var _to = getSqlFormattedDate($('#to_date').val());
                var _pid = $('#accountDropdown').val();
                _from = _from.replace('/', '-');
                _from = _from.replace('/', '-');
                _to = _to.replace('/', '-');
                _to = _to.replace('/', '-');
                var companyid = $('#cid').val();
                var printheader = $('input[name="printheader"]:checked').val();
                if (validateEmail)
                    SendEmailPDfWithGivenEmail(_from, _to, _pid, companyid, printheader, 1);
                else $.notify({ message: 'Please enter an email !!!' }, { type: 'danger' });
            });
            $('.btnPrint').on('click', function (e) {
                e.preventDefault();
                var error1 = general.validateFinancialDate($('#from_date').val(), $('#to_date').val());
                if (!error1) {
                    const party_id = $.trim($('#accountDropdown').val());
                    printReport(1);
                    fetchEmail(party_id);
                }
            });
            $('body').on('dblclick', '#datatable_example_accountledger tbody tr.istally_row', function (e) {
                var highlightedTalliedRow = $(this).hasClass('highlightedTalliedRow');
                if (highlightedTalliedRow) {
                    getTallyLedgerRow($(this), 0);
                } else {
                    if (confirm("Are you sure to mark this row?")) {
                        getTallyLedgerRow($(this), 1);
                    }
                }
            });
            $('body').on('click', '#datatable_example_accountledger tbody tr td button.text-istally-row', function (e) {
                e.preventDefault();
                var highlightedTalliedRow = $(this).closest('tr').hasClass('highlightedTalliedRow');
                if (highlightedTalliedRow) {
                    getTallyLedgerRow($(this).closest('tr'), 0);
                } else {
                    if (confirm("Are you sure to mark this row?")) {
                        getTallyLedgerRow($(this).closest('tr'), 1);
                    }
                }
            });
            shortcut.add("F9", function () {
                $('.btnPrint').get()[0].click();
            });
            shortcut.add("F6", function () {
                $('.btnSearch').get()[0].click();
            });
            shortcut.add("F5", function () {
                general.reloadWindow();
            });
            fetchRequestedVr();
        },
        initSearch: async function () {
            await disableSearchButton('#searchButton');
            const tillDate = getSqlFormattedDate($('#tillDate').val());
            const accountDropdown = $('#accountDropdown').val();
            const debtorsDropdown = $('#debtorsDropdown').val();
            const creditorsDropdown = $('#creditorsDropdown').val();
            await getAgingSheetReportData(tillDate, "credit", accountDropdown, debtorsDropdown, creditorsDropdown);
            await enableSearchButton('#searchButton');
        },
    };
};
var agingSheet = new AgingSheet();
agingSheet.init();

// Usage
$(function () {
    new DynamicOption('#accountDropdown', {
        requestedUrl: dropdownOptions.getAccountDetailAll,
        placeholderText: 'Choose Account',
        allowClear: true,
    });
    new DynamicOption('#debtorsDropdown', {
        requestedUrl: dropdownOptions.getAllLevel3AccountByReceivableLevel,
        placeholderText: 'Choose Debtors Level',
        allowClear: true,
    });
    new DynamicOption('#creditorsDropdown', {
        requestedUrl: dropdownOptions.getAllLevel3AccountByPayableLevel,
        placeholderText: 'Choose creditors Level',
        allowClear: true
    });
});
