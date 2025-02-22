import BaseClass from "../../../../js/components/BaseClass.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { disableSearchButton, enableSearchButton, ifNull, parseNumber, setFinancialYearDate, updateDatepickerWithFormattedDate, updateFormattedDate } from "../commonFunctions/CommonFunction.js";
const baseInstance = new BaseClass();
var AccountLedger = function () {
    const getAccountOpeningBalance = async (startDate, accountId) => {
        baseInstance.runException(async () => {
            const response = await makeAjaxRequest('GET', `${base_url}/accountLedger/getAccountOpeningBalance`, { startDate, accountId });
            if (response.status == false && response.error !== "") {
                AlertComponent._getAlertMessage('Error!', response.message, 'danger');
            } else if (response.status == false && response.message !== "") {
                AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
            } else {
                $('.opening-bal').html(parseNumber(response.data).toFixed(AMOUNT_ROUNDING)).digits();
            }
        });
    };
    const _getNumberOfString = (n) => {
        const _N = $.trim(n).toString().replace(/,/g, '');
        return isNaN(parseFloat(_N)) ? 0 : parseFloat(_N);
    };
    const getValidateSearch = () => {
        var errorFlag = false;
        const from_date = getSqlFormattedDate($('#from_date').val());
        const to_date = getSqlFormattedDate($('#to_date').val());
        const pid = $('#accountDropdown').val();
        $('#from_date').removeClass('inputerror');
        $('#to_date').removeClass('inputerror');
        $('#accountDropdown').removeClass('inputerror');
        if (from_date === '' || from_date === null) {
            $('#from_date').addClass('inputerror');
            errorFlag = true;
        }
        if (to_date === '' || to_date === null) {
            $('#to_date').addClass('inputerror');
            errorFlag = true;
        }
        if (pid === '' || pid === null) {
            $('#select2-accountDropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }
        if (from_date > to_date) {
            $('#from_date').addClass('inputerror');
            alert('Starting date must Be less than ending date.........');
            errorFlag = true;
        }
        return errorFlag;
    };

    const getAccountLedgerReportData = async (startDate, endDate, accountId) => {

        $('.grand-total').html(0);
        $('.net-debit').html(0);
        $('.net-credit').html(0);
        $('.running-total').html(0);
        $('.pdc-total').html(0);

        if (typeof accountLedger.accountLedgerDataTable != 'undefined') {
            accountLedger.accountLedgerDataTable.fnDestroy();
            $('#saleRows_accountledger').empty();
            $('#accountLedgerTfoot').empty();
        }
        $(".loader").show();

        try {
            const response = await makeAjaxRequest('GET', `${base_url}/accountLedger/getAccountLedger`, { startDate, endDate, accountId });
            if (response && response.status == false && response.error !== "") {
                const openingBalance = $('.opening-bal').text();
                $('.running-total').text(openingBalance);
                AlertComponent._getAlertMessage('Error!', response.message, 'danger');
            } else if (response && response.status == false && response.message !== "") {
                AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
            } else {
                populateAccountLedgerData(response.data);
            }
        } catch (error) {
            console.log('Error:', error);
        } finally {
            $(".loader").hide();
        }
    };

    const populateAccountLedgerData = (result) => {
        if (result == false) {
            $('.running-total').html(getNumText($('.opening-bal')));
        }

        if (result.length !== 0 || result !== false) {
            $('#chart_tabs').addClass('disp');
            $('.tableDate').removeClass('disp');

            var th;
            var td1;


            th = $('#general-head-template').html();
            td1 = $("#voucher-item-template").html();

            var template = Handlebars.compile(th);
            var html = template({});

            $('.dthead_accountledger').html(html);



            $("#datatable_example_accountledger_wrapper").fadeIn();


            var TOTALDEBIT = 0;
            var TOTALCREDIT = 0;
            var TOTALBALANCE = 0;

            var SERIAL = 1;
            var saleRows = $("#saleRows_accountledger");
            const accountLedgertfoot = $("#accountLedgerTfoot");

            $.each(result, function (index, elem) {
                const obj = {};
                obj.SERIAL = SERIAL++;

                const voucherNumber = elem.vrnoa;
                const voucherDate = elem.vrdate;
                const voucherDescription = elem.description;
                const voucherDebit = elem.debit;
                const voucherCredit = elem.credit;
                const openingBalance = _getNumberOfString($('.opening-bal').text());
                const voucherLedgerBalance = Number.parseFloat(elem.ledgerBalance) + Number.parseFloat(openingBalance);
                const isTallied = (elem.is_tallied > 0) ? 'highlightedTalliedRow' : '';
                const etype = elem.etype;
                const etypeAbbreviates = ifNull(elem.etype_abbreviates, "");

                obj.pledid = ifNull(elem.id);
                obj.VRNOA = ifNull(voucherNumber, "-");
                obj.VRDATE = updateFormattedDate(voucherDate);
                obj.ISTALLIED = isTallied;
                obj.ISDEBIT_CREDIT = ((Number.parseFloat(voucherLedgerBalance) > 0) ? 'Dr' : "Cr");
                obj.IS_PIN = '<span><i class="fa fa-thumb-tack"></i><span>';

                if ((etype || '').toLowerCase() !== '') {
                    obj.VRNOA = `<a data-etype="${etype}" data-vrnoa="${voucherNumber}" data-toggle="modal" id="purchaseView" data-target="#purchaseVoucher" href="#" data-requestname="getPurchaseVoucherData">${voucherNumber}  - ${etypeAbbreviates}</a>`;
                } else {
                    obj.VRNOA = voucherNumber + '-' + etypeAbbreviates;
                }

                obj.DESCRIPTION = (voucherDescription || '').replace(/,\s*$/, "");
                obj.DEBIT = Number.parseFloat(voucherDebit).toFixed(AMOUNT_ROUNDING);
                obj.CREDIT = Number.parseFloat(voucherCredit).toFixed(AMOUNT_ROUNDING);
                obj.BALANCE = Number.parseFloat(voucherLedgerBalance).toFixed(AMOUNT_ROUNDING);

                // Add the item of the new voucher
                var source = td1;
                var template = Handlebars.compile(source);
                var html = template(obj);
                saleRows.append(html);

                TOTALDEBIT += Number.parseFloat(voucherDebit);
                TOTALCREDIT += Number.parseFloat(voucherCredit);
                TOTALBALANCE = Number.parseFloat(TOTALDEBIT) - Number.parseFloat(TOTALCREDIT);

                const OpeningBalance = _getNumberOfString($('.opening-bal').text());

                var NETDEBIT = 0;
                var NETCREDIT = 0;
                var NETBALANCE = 0;

                NETDEBIT = Number.parseFloat(TOTALDEBIT) + Number.parseFloat((OpeningBalance > 0) ? OpeningBalance : 0);
                NETCREDIT = Number.parseFloat(TOTALCREDIT) + Number.parseFloat((OpeningBalance < 0) ? Math.abs(OpeningBalance) : 0);
                NETBALANCE = Number.parseFloat(NETDEBIT) - Number.parseFloat(NETCREDIT);

                if (index === (result.length - 1)) {
                    let source = $("#voucher-sum-template").html();
                    let template = Handlebars.compile(source);
                    let html = template({ 'TOTAL_HEAD': 'Period Total', VOUCHER_TOTALDEBIT: TOTALDEBIT.toFixed(AMOUNT_ROUNDING), VOUCHER_TOTALCREDIT: TOTALCREDIT.toFixed(AMOUNT_ROUNDING), VOUCHER_TOTALBALANCE: TOTALBALANCE.toFixed(AMOUNT_ROUNDING) });
                    accountLedgertfoot.append(html);

                    let source1 = $("#voucher-sum-template").html();
                    let template1 = Handlebars.compile(source1);
                    let html1 = template1({ 'TOTAL_HEAD': 'GRAND TOTAL', VOUCHER_TOTALDEBIT: NETDEBIT.toFixed(AMOUNT_ROUNDING), VOUCHER_TOTALCREDIT: NETCREDIT.toFixed(AMOUNT_ROUNDING), VOUCHER_TOTALBALANCE: NETBALANCE.toFixed(AMOUNT_ROUNDING) });
                    accountLedgertfoot.append(html1);
                }
                $('.net-debit').html(Number.parseFloat(TOTALDEBIT).toFixed(AMOUNT_ROUNDING)).digits();
                $('.net-credit').html(Number.parseFloat(TOTALCREDIT).toFixed(AMOUNT_ROUNDING)).digits();
            });

            const _Opening = _getNumberOfString($('.opening-bal').text());
            const _Debit = _getNumberOfString($('.net-debit').text());
            const _Credit = _getNumberOfString($('.net-credit').text());
            const _PDCAmount = _getNumberOfString($('.pdc-total').text());
            const _Netbalance = Number.parseFloat(_Opening) + Number.parseFloat(_Debit) - Number.parseFloat(_Credit) + Number.parseFloat(_PDCAmount);
            $('.running-total').html(Number.parseFloat(_Netbalance).toFixed(AMOUNT_ROUNDING)).digits();
        }
        $("td.text-right").digits();
        bindGrid();
    };

    var getTabLength = function () {
        return $('#datatable_example_accountledger thead tr th').length;
    };
    var bindGrid = function () {
        var oldTabLength = getTabLength();
        var etype = $('.page_title').text();
        var msg = "<b>From </b>" + $('#from_date').val() + " :- <b>To</b> To:- " + $('#to_date').val();
        var dontSort = [];
        $('#datatable_example_accountledger thead th').each(function () {
            if ($(this).hasClass('no_sort')) {
                dontSort.push({ "bSortable": false });
            } else {
                dontSort.push(null);
            }
        });
        accountLedger.accountLedgerDataTable = $('#datatable_example_accountledger').dataTable({
            processing: true,
            "sDom": '<if<t>lp>',
            "bPaginate": false,
            'bFilter': true,
            'autoWidth': false,
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
            accountLedger.accountLedgerDataTable.DataTable().button(action).trigger('click');
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


            let totalChequeAmount = 0;
            let totalReceivedAmount = 0;
            let totalPendingAmount = 0;

            var SERIAL = 1;
            var saleRows = $("#saleRows_cheque_list_number");

            $.each(data, function (index, elem) {
                const obj = {};
                obj.SERIAL = SERIAL++;
                obj.chequeListNumber = (elem.cheque_list_number) ? elem.cheque_list_number : "-";
                obj.chequeNumber = (elem.cheque_no) ? elem.cheque_no : "-";
                obj.chequeDate = (elem.cheque_vrdate) ? getFormattedDate(elem.cheque_vrdate.substr(0, 10)) : "-";
                obj.receivedAccount = (elem.accountName) ? elem.accountName : "-";
                obj.totalChequeAmount = (elem.totalChequeAmount) ? Number.parseFloat(elem.totalChequeAmount).toFixed(AMOUNT_ROUNDING) : 0;
                obj.totalReceivedAmount = (elem.totalReceivedAmount) ? Number.parseFloat(elem.totalReceivedAmount).toFixed(AMOUNT_ROUNDING) : 0;
                obj.totalPendingAmount = (elem.totalPendingAmount) ? Number.parseFloat(elem.totalPendingAmount).toFixed(AMOUNT_ROUNDING) : 0;

                // Add the item of the new voucher
                var source = td1;
                var template = Handlebars.compile(source);
                var html = template(obj);
                saleRows.append(html);

                totalChequeAmount += Number.parseFloat(elem.totalChequeAmount);
                totalReceivedAmount += Number.parseFloat(elem.totalReceivedAmount);
                totalPendingAmount += Number.parseFloat(elem.totalPendingAmount);

                const _Opening = _getNumberOfString($('.opening-bal').text());
                const _Debit = _getNumberOfString($('.net-debit').text());
                const _Credit = _getNumberOfString($('.net-credit').text());
                const _AccountBalance = Number.parseFloat(_Opening) + Number.parseFloat(_Debit) - Number.parseFloat(_Credit);
                const NetBalance = Number.parseFloat(totalPendingAmount) + Number.parseFloat(_AccountBalance);

                if (index === (data.length - 1)) {
                    let source = $("#voucher-cheque_list_number-sum-template").html();
                    let template = Handlebars.compile(source);
                    let html = template({ 'TOTAL_HEAD': 'TOTAL', viewTotalChequeAmount: totalChequeAmount.toFixed(AMOUNT_ROUNDING), viewTotalReceivedAmount: totalReceivedAmount.toFixed(AMOUNT_ROUNDING), viewTotalPendingAmount: totalPendingAmount.toFixed(AMOUNT_ROUNDING) });
                    saleRows.append(html);

                    let source1 = $("#voucher-cheque_list_number-sum-template2").html();
                    let template1 = Handlebars.compile(source1);
                    let html1 = template1({ 'TOTAL_HEAD': 'BALANCE INCLUDING PDC', viewTotalChequeAmount: NetBalance.toFixed(AMOUNT_ROUNDING)});
                    saleRows.append(html1);
                }
                $('.pdc-total').text(Number.parseFloat(totalPendingAmount).toFixed(AMOUNT_ROUNDING)).digits();
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
            var self = this;
            $('#from_date').datepicker('update', $('#sdate').val());
            $('#to_date').datepicker('update', $('#edate').val());
            $('.modal-lookup .populateAccount').on('click', function () {
                var party_id = $(this).closest('tr').find('input[name=hfModalPartyId]').val();
                $("#accountDropdown").select2("val", party_id);
            });
            $('.btnSearch').on('click', async function (e) {
                e.preventDefault();
                var error1 = general.validateFinancialDate($('#from_date').val(), $('#to_date').val());
                if (!error1) {
                    await self.initSearch();
                }
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
            $('.btnPrintUrdu').on('click', function (e) {
                e.preventDefault();
                var error1 = general.validateFinancialDate($('#from_date').val(), $('#to_date').val());
                if (!error1) {
                    const party_id = $.trim($('#accountDropdown').val());
                    printReport(2);
                    fetchEmail(party_id);
                }
            });
            $('.btnPrint2').on('click', function (e) {
                e.preventDefault();
                Account_Flow();
            });
            $('.btnPrint3').on('click', function (e) {
                e.preventDefault();
                window.open(base_url + 'application/views/reportprints/vouchers_reports.php', "Purchase Report", 'width=1000, height=842');
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
            var error = getValidateSearch();
            if (!error) {
                const _from = getSqlFormattedDate($('#from_date').val());
                const _to = getSqlFormattedDate($('#to_date').val());
                const _pid = $('#accountDropdown').val();
                const languageId = $('input[name="languagename"]:checked').val();
                await getAccountOpeningBalance(_from, _pid);
                await getAccountLedgerReportData(_from, _to, _pid, languageId);
                await getChequeInHandLookUp(_pid);
            } else {
                AlertComponent.getAlertMessage({ 'title': "Error!", 'message': "Correct the error!", 'type': 'danger' });
            }
            await enableSearchButton('#searchButton');
        },
    };
};
var accountLedger = new AccountLedger();
accountLedger.init();

// Usage
$(function () {
    new DynamicOption('#accountDropdown', {
        requestedUrl: dropdownOptions.getAccountDetailAll,
        placeholderText: 'Choose Account',
        isAccountLedger: 1,
    });
});
