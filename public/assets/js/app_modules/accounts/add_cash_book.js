import { baseConfiguration } from "../../../../js/components/ConfigurationManager.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { ifNull, setFinancialYearDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek } from "../commonFunctions/CommonFunction.js";
var CashBook = function () {

    var settings = {
        switchPreBal: $('#switchPreBal')
    };

    const currentDate = $('#current_date');
    const chk_date = $('#cash_book_chk_date');
    const accountCashDropdown = $('#accountCashDropdown');
    const gridAccountNameDropdown = $('#gridAccountNameDropdown');
    const gridAccountRemarks = $('#gridAccountRemarks');
    const gridAccountInvoiceNo = $('#gridAccountInvoiceNo');
    const gridAccountDebit = $('#gridAccountDebit');
    const gridAccountCredit = $('#gridAccountCredit');
    const btnReset = $('.btnReset');
    const btnSave = $('.btnSave');
    const btnAdd = $('#btnAdd');
    const purchaseTable = $('#purchase_table');
    const gridAccountTotalDebit = $('.gridAccountTotalDebit');
    const gridAccountTotalCredit = $('.gridAccountTotalCredit');
    const accountNetDebit = $('#accountNetDebit');
    const accountNetCredit = $('#accountNetCredit');
    const accountModuleSettings = _accountModuleSettings;

    var save = function (purchaseData) {
        const main = purchaseData.main;
        const details = purchaseData.details;
        general.disableSave();
        $.ajax({
            url: `${base_url}/cashBook/save`,
            type: 'POST',
            data: { 'main': JSON.stringify(main), 'details': JSON.stringify(details), 'id': purchaseData.id, 'chk_date': $(chk_date).val() },
            dataType: 'JSON',
            success: function (response) {
                if (response.status == false && response.error !== "") {
                    _getAlertMessage('Error!', response.message, 'danger');
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage('Warning!', response.message, 'warning');
                } else {
                    _getConfirmMessage('Successfully!', 'Voucher saved!\nWould you like to print the invoice as well?', 'success', function (result) {
                        if (result) {
                            $('#txtVrnoaHidden').val(response.data);
                            $('#txtVrnoa').val(response.data);
                            Print_Voucher(response.data.id, 1, 'lg', '');
                            resetVoucher();
                        }
                    });
                    resetVoucher();
                }
                general.enableSave();
            }, error: function (xhr, status, error) {
                general.enableSave();
                console.log(xhr.responseText);
            }
        });
    };

    var deleteVoucher = function (vrnoa) {
        general.disableSave();
        $.ajax({
            url: base_url + '/cashBook/delete',
            type: 'delete',
            data: { 'chk_date': $(chk_date).val(), 'vrdate': $(currentDate).val(), 'vrnoa': vrnoa },
            dataType: 'JSON',
            success: function (response) {
                if (response.status == false && response.error !== "") {
                    _getAlertMessage('Error!', response.message, 'danger');
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage('Information!', response.message, 'info');
                    resetVoucher();
                } else {
                    _getAlertMessage('Successfully!', response.message, 'success');
                    resetVoucher();
                }
                general.enableSave();
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    var fetch = function (cashBookId) {
        $.ajax({
            url: `${base_url}/cashBook/fetch`,
            type: 'GET',
            data: { 'cashBookId': cashBookId },
            dataType: 'JSON',
            success: function (response) {
                resetFields();
                if (response.status == false && response.error !== "") {
                    _getAlertMessage('Error!', response.message, 'danger');
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage('Information!', response.message, 'info');
                    resetVoucher();
                } else {
                    populateData(response.data);
                }
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    var populateData = function (data) {
        $('#cashBookIdHidden').val(data.id);

        populateDateValue('current_date', data.vrdate);
        populateDateValue('chk_date', data.vrdate);

        triggerAndRenderOptions(
            $("#accountCashDropdown"),
            baseConfiguration.cash_account.name,
            baseConfiguration.cash_account.pid
        );

        $(accountNetDebit).val(data.net_debit);
        $(accountNetCredit).val(data.net_credit);

        $.each(data.cash_book_details, function (index, elem) {
            appendToTable(elem.party_id, elem.party.name, ifNull(elem.remarks, ""), elem.cash_account.pid, elem.cash_account.name,  ifNull(elem.invoice_no, ""), parseNumber(elem.debit).toFixed(AMOUNT_ROUNDING), parseNumber(elem.credit).toFixed(AMOUNT_ROUNDING));
        });
        calculateLowerTotal();
    }

    var getSaveObject = function () {
        const main = {};
        const details = [];

        main.id = $('#cashBookIdHidden').val();
        main.vrdate = $('#current_date').val();
        main.chk_date = $(chk_date).val();

        $('#purchase_table').find('tbody tr').each(function (index, elem) {
            const gridAccountDetail = {};
            gridAccountDetail.party_id = $.trim($(elem).find('td.accountName').data('account_id'));
            gridAccountDetail.remarks = $.trim($(elem).find('td.remarks').text());
            gridAccountDetail.cash_account_id = $.trim($(elem).find('td.cashAccountName').data('cash_account_id'));
            gridAccountDetail.invoice_no = $.trim($(elem).find('td.invoiceNo').text());
            gridAccountDetail.debit = $.trim($(elem).find('td.debit').text());
            gridAccountDetail.credit = $.trim($(elem).find('td.credit').text());
            details.push(gridAccountDetail);
        });
        var data = {};
        data.main = main;
        data.details = details;
        data.id = $('#cashBookIdHidden').val();
        return data;
    };

    var appendToTable = function (accountId, accountName, remarks, cashAccountId, cashAccountName, invoiceNo, debit, credit) {

        const srno = $('#purchase_table tbody tr').length + 1;

        const row = `
        <tr class = "odd:bg-white even:bg-slate-50">
        <td class = 'py-1 px-1 text-md align-middle text-left srno' data-title= 'Sr#'> ${srno}</td>
        <td class = 'py-1 px-1 text-md align-middle text-left accountName' data-account_id = '${accountId}'">${accountName}</td>
		<td class = 'py-1 px-1 text-md align-middle text-left remarks'>${remarks}</td>
        <td class = 'py-1 px-1 text-md align-middle text-left cashAccountName' data-cash_account_id = '${cashAccountId}'">${cashAccountName}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left invoiceNo'>${invoiceNo}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right debit'>${parseNumber(debit).toFixed(AMOUNT_ROUNDING)}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right credit'>${parseNumber(credit).toFixed(AMOUNT_ROUNDING)}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right'>
						<div    class = "btn-group">
						<button type  = "button" class = "btn btn-sm btn-outline-primary dropdown-toggle" data-toggle = "dropdown" aria-haspopup = "true" aria-expanded = "false">
						<i      class = "fas fa-ellipsis-v"></i>
						</button>
						<div    class = "dropdown-menu">
						<button type  = "button" class = "dropdown-item btnRowEdit">
						<i      class = "fa fa-edit"></i> Edit
							</button>
							<button type  = "button" class = "dropdown-item btnRowRemove">
							<i      class = "fa fa-trash-alt"></i> Remove
							</button>
						</div>
					</div>
            </td>
        </tr>
        `

        $(row).appendTo(purchaseTable);
        getTableSerialNumber(purchaseTable);
    };

    const validateGrid = () => {
        let hasError = false;
        let errorMessage = '';

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!$(gridAccountNameDropdown).val()) {
            $('#select2-gridAccountNameDropdown-container').parent().addClass('inputerror');
            errorMessage += `Account Name is required <br />`;
            hasError = true;
        }

        if (!accountCashDropdown.val()) {
            $("#select2-accountCashDropdown-container").parent().addClass("inputerror");
            errorFlag = true;
        }

        if ((!$(gridAccountDebit).val() || $(gridAccountDebit).val() <= 0) &&
            (!$(gridAccountCredit).val() || $(gridAccountCredit).val() <= 0)) {
            $(gridAccountDebit).addClass('inputerror');
            $(gridAccountCredit).addClass('inputerror');
            errorMessage += `Debit or Credit Amount is required and should be greater than zero <br />`;
            hasError = true;
        }

        if (hasError) {
            return errorMessage;
        }
        return null;
    };

    var validateSave = function () {
        var errorFlag = false;

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!currentDate.val()) {
            currentDate.addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    };

    var getNumText = function (el) {
        return isNaN(parseFloat(el.text())) ? 0 : parseFloat(el.text());
    };

    var getNumVal = function (el) {
        return isNaN(parseFloat(el.val())) ? 0 : parseFloat(el.val());
    };

    var resetVoucher = function () {
        resetFields();
        getCashBookDataTable();
        triggerAndRenderOptions(
            $("#accountCashDropdown"),
            baseConfiguration.cash_account.name,
            baseConfiguration.cash_account.pid
        );
        $('#voucher_type_hidden').val('new');
    };

    var resetFields = function () {
        $('#cashBookIdHidden').val('');
        $(currentDate).datepicker('update', new Date());
        $(accountCashDropdown).val('').trigger('change.select2');
        $(gridAccountNameDropdown).val('').trigger('change.select2');
        $(gridAccountRemarks).val('');
        $(gridAccountInvoiceNo).val('');
        $(gridAccountDebit).val('');
        $(gridAccountCredit).val('');
        $(accountNetDebit).val('');
        $(accountNetCredit).val('');
        $(gridAccountTotalDebit).text('');
        $(gridAccountTotalCredit).text('');
        $('#purchase_table tbody tr').remove();
        $('#purchase_tableReport tbody tr').remove();
        $('#laststockLocation_table tbody tr').remove();
        $('.inputerror').removeClass('inputerror');

        $('#party_p').html('');
        $('#party_c').html('');
        $('#otherItemInformation').html('');
    }

    var calculateLowerTotal = function () {
        let gridAccounttotalDebit = 0;
        let gridAccounttotalCredit = 0;

        $(purchaseTable).find("tbody tr").each(function (index, elem) {
            gridAccounttotalDebit += getNumText($(this).closest('tr').find('td.debit'));
            gridAccounttotalCredit += getNumText($(this).closest('tr').find('td.credit'));
        });

        $(gridAccountTotalDebit).text(parseNumber(gridAccounttotalDebit).toFixed(AMOUNT_ROUNDING));
        $(gridAccountTotalCredit).text(parseNumber(gridAccounttotalCredit).toFixed(AMOUNT_ROUNDING));

        $(accountNetDebit).val(parseNumber(gridAccounttotalDebit).toFixed(AMOUNT_ROUNDING));
        $(accountNetCredit).val(parseNumber(gridAccounttotalCredit).toFixed(AMOUNT_ROUNDING));
    };

    let purchaseOrderViewList = undefined;
    const getCashBookDataTable = (cashBookId = 0, fromDate = "", toDate = "") => {
        if (typeof purchaseOrderViewList !== 'undefined') {
            purchaseOrderViewList.destroy();
            $('#purchaseOrderViewListTbody').empty();
        }
        purchaseOrderViewList = $("#purchaseOrderViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/cashBook/getCashBookDataTable`,
                type: 'GET',
                data: { 'cashBookId': cashBookId, fromDate: fromDate, toDate: toDate },
                dataSrc: function (json) {
                    return json.data;
                }
            },
            autoWidth: false,
            buttons: true,
            searching: true,
            columns: [
                {
                    data: null,
                    className: "text-center",
                    searchable: false,
                    orderable: false,
                    defaultContent: "",
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;  // This will give you the serial number
                    }
                },
                {
                    data: "cash_book_main.vrnoa",
                    name: "cashBookMain.vrnoa",
                    className: "text-left cashBookVoucher",
                },
                {
                    data: "cash_book_main.vrdate",
                    name: "cashBookMain.vrdate",
                    className: "text-left voucherDate",
                    render: function (data, type, row) {
                        return getFormattedDate(data);
                    }
                },
                { data: "party.name", name: 'party.name', className: "AccountName" },
                {
                    data: "debit", name: 'debit', className: "text-right debit",
                    render: function (data, type, row) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: "credit", name: 'credit', className: "text-right credit",
                    render: function (data, type, row) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: null,
                    className: "select text-right",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        return `
						<!-- Default dropleft button -->
						<div    class = "btn-group dropleft">
						<button type  = "button" class = "btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle = "dropdown" aria-haspopup = "true" aria-expanded = "false">
								More
							</button>
							<div class = "dropdown-menu">
							<a   class = "dropdown-item btnEditPrevVoucher" data-cash_book_id = "${row.cash_book_main.id}" href = "#"><i class = 'fa fa-edit'></i> Edit Voucher</a>

                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                <li class="dropdown-item"><a href="#" class="btnPrint" data-cash_book_id  ="${row.cash_book_main.id}">Print Voucher</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-cash_book_id  ="${row.cash_book_main.id}"> Print a4 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-cash_book_id  ="${row.cash_book_main.id}"> Print a4 without header </a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-cash_book_id  ="${row.cash_book_main.id}"> Print b5 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-cash_book_id  ="${row.cash_book_main.id}"> Print b5 without header </a></li>
                            </ul>

							<a   class = "dropdown-item btnDelete" data-cash_book_id          = "${row.cash_book_main.id}" href = "#"><i class = 'fa fa-trash'></i> Delete Voucher</a>
							<div class = "dropdown-divider"></div>
							<a   class = "dropdown-item btnPrintASEmail" data-cash_book_id    = "${row.cash_book_main.id}" href = "#">Send Email</a>
							</div>
						</div>

`;

                    }
                }

            ],
            createdRow: function (row, data, dataIndex) {
                $(row).addClass('group odd:bg-white even:bg-slate-50');
                $('td', row).addClass('py-1 px-1 text-md align-middle');
            }
        });
        // Reinitialize tooltips on table redraw
        purchaseOrderViewList.on('draw', function () {
            $('[data-toggle="tooltip"]').tooltip();  // For Bootstrap 4
        });
    };

    var Print_Voucher = function (vrnoa, paperSize, printSize, wrate = 0, isSendEmail = false) {
        try {
            const __etype = 'cash_books';
            const __vrnoa = vrnoa;
            const __pre_bal_print = 0;
            const __lang = ($('#print_lang').val()) ? $('#print_lang').val() : 1;
            const __url = base_url + '/doc/getPrintVoucherPDF/?etype=' + __etype + '&vrnoa=' + __vrnoa + '&pre_bal_print=' + __pre_bal_print + '&paperSize=' + paperSize + '&printSize=' + printSize + '&wrate=' + (wrate ? wrate : 0) + '&language_id=' + __lang;
            const _encodeURI = encodeURI(__url);
            openPrintOnSettingConfiguration(_encodeURI);
        } catch (error) {
            console.error(error);
        }
    };

    const getSendMail = (vrnoa, paperSize, printSize, wrate = 0, email = "") => {
        const __etype = 'cash_books';
        const __vrnoa = vrnoa;
        const __pre_bal_print = ($(settings.switchPreBal).bootstrapSwitch('state') === true) ? '2' : '1';
        const __lang = $('#print_lang').val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, __pre_bal_print, paperSize, printSize, wrate, __lang, email);
    };


    return {

        init: function () {
            this.bindUI();
            $('.select2').select2({
                width: 'element',
            });
            getCashBookDataTable();
            triggerAndRenderOptions(
                $("#accountCashDropdown"),
                baseConfiguration.cash_account.name,
                baseConfiguration.cash_account.pid
            );
        },
        bindUI: function () {

            $('[data-toggle="tooltip"]').tooltip();
            var self = this;
            shortcut.add("F10", function () {
                $(btnSave).get()[0].click();
            });

            shortcut.add("F5", function () {
                $(btnReset).get()[0].click();
            });

            $('#gridAccountDebit').on('change', function () {
                if ($(gridAccountDebit).val() !== "")
                {
                    $('#gridAccountCredit').prop('disabled', true);
                    $('#gridAccountCredit').val('');
                } else {
                    $('#gridAccountCredit').prop('disabled', false);
                }
            });

            $('#gridAccountCredit').on('change', function () {
                if ($(gridAccountCredit).val() !== "")
                {
                    $('#gridAccountDebit').prop('disabled', true);
                    $('#gridAccountDebit').val('');
                } else {
                    $('#gridAccountDebit').prop('disabled', false);
                }
            });

            $(gridAccountRemarks, gridAccountInvoiceNo, gridAccountDebit, gridAccountCredit).on('keypress', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    $(btnAdd).trigger('click');
                }
            });

            $('#accountCashDropdown').on('change', function () {
                if (parseNumber(accountModuleSettings.show_account_information) == 1) {
                    const accountId = $(this).val();
                    const voucherDate = $('#current_date').val();
                    getAccountBalanced(accountId, voucherDate,"Cash");
                }
            });
            $('#gridAccountNameDropdown').on('change', function () {
                if (parseNumber(accountModuleSettings.show_account_information) == 1) {
                    const accountId = $(this).val();
                    const voucherDate = $('#current_date').val();
                    getAccountBalanced(accountId, voucherDate);
                }
            });

            $(document.body).on('change', 'input[name="durType"]', function (e) {
                const dateType = $('input[type="radio"][name="durType"]:checked').val();
                if (dateType === 'today') {
                    updateDateRangeCurrentDay('fromDate', 'toDate');
                } else if (dateType === 'year') {
                    setFinancialYearDate('fromDate', 'toDate');
                } else if (dateType === 'week') {
                    updateDateRangeToCurrentWeek('fromDate', 'toDate');
                } else if (dateType === 'month') {
                    updateDateRangeToCurrentMonth('fromDate', 'toDate');
                }
            });

            $(btnAdd).on('click', function (e) {
                e.preventDefault();

                const alertMessage = validateGrid();
                if (alertMessage) {
                    return _getAlertMessage('Error!', alertMessage, 'danger');;
                }

                const accountId = parseNumber($(gridAccountNameDropdown).val());
                const accountName = $.trim($(gridAccountNameDropdown).find('option:selected').text());
                const remarks = $(gridAccountRemarks).val();
                const cashAccountId = parseNumber($(accountCashDropdown).val());
                const cashAccountName = $.trim($(accountCashDropdown).find('option:selected').text());
                const invoiceNo = $(gridAccountInvoiceNo).val();
                const debit = $(gridAccountDebit).val();
                const credit = $(gridAccountCredit).val();

                $(gridAccountNameDropdown).val('').trigger('change.select2');
                $(gridAccountRemarks).val('');
                $(accountCashDropdown).val('').trigger('change.select2');
                $(gridAccountInvoiceNo).val('');
                $(gridAccountDebit).val('');
                $(gridAccountCredit).val('');

                appendToTable(accountId, accountName, remarks, cashAccountId, cashAccountName, invoiceNo, debit, credit);

                $(gridAccountNameDropdown).focus();

                $('#gridAccountDebit').prop('disabled', false);
                $('#gridAccountCredit').prop('disabled', false);
                triggerAndRenderOptions(
                    $("#accountCashDropdown"),
                    baseConfiguration.cash_account.name,
                    baseConfiguration.cash_account.pid
                );
                calculateLowerTotal();
            });

            $(purchaseTable).on('click', '.btnRowEdit', function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');

                const editAccountId = row.find('td.accountName').data('account_id');
                const editAccountName = row.find('td.accountName').clone().children('span').remove().end().text();
                const editRemarks = row.find('td.remarks').text();
                const editCashAccountId = row.find('td.cashAccountName').data('cash_account_id');
                const editCashAccountName = row.find('td.cashAccountName').clone().children('span').remove().end().text();
                const editInvoiceNo = row.find('td.invoiceNo').text();
                const editDebit = parseNumber(row.find('td.debit').text());
                const editCredit = parseNumber(row.find('td.credit').text());

                triggerAndRenderOptions(gridAccountNameDropdown, editAccountName, editAccountId, false);
                $(gridAccountRemarks).val(editRemarks);
                triggerAndRenderOptions(accountCashDropdown, editCashAccountName, editCashAccountId, false);
                $(gridAccountInvoiceNo).val(editInvoiceNo);
                $(gridAccountDebit).val(editDebit === 0 ? "" : editDebit);
                $(gridAccountCredit).val(editCredit === 0 ? "" : editCredit);

                $('#gridAccountDebit').prop('disabled', editCredit !== 0);
                $('#gridAccountCredit').prop('disabled', editDebit !== 0);

                row.remove();
                calculateLowerTotal();
            });

            $(purchaseTable).on('click', '.btnRowRemove', function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');
                row.remove();
                calculateLowerTotal();
            });

            $('#purchaseOrderSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getCashBookDataTable();
            });
            $('#purchaseOrderFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getCashBookDataTable("", fromDate, toDate);
            });

            $('body').on('click', '.btnPrint', function (e) {
                const cashBookId = $(this).data('cash_book_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(base_url + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(cashBookId, settingPrintDefault, 'lg', '');
                }
            });

            $('body').on('click', '.btnPrintA4WithHeader', function (e) {
                const cashBookId = $(this).data('cash_book_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(cashBookId, 1, 'lg',"");
                }
            });
            $('body').on('click', '.btnPrintA4WithOutHeader', function (e) {
                const cashBookId = $(this).data('cash_book_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(cashBookId, 2, 'lg',"");
                }
            });
            $('body').on('click', '.btnPrintB5WithHeader', function (e) {
                const cashBookId = $(this).data('cash_book_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(cashBookId, 3, 'lg',"");
                }
            });
            $('body').on('click', '.btnPrintB5WithOutHeader', function (e) {
                const cashBookId = $(this).data('cash_book_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(cashBookId, 4, 'lg',"");
                }
            });


            $('body').on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                const cashBookId = parseNumber($(this).data('cash_book_id'));
                fetch(cashBookId);
                $('a[href="#Main"]').trigger('click');
            });

            $('body').on('click', '.btnPrintASEmail', function (e) {
                const cashBookId = $(this).data('cash_book_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                getSendMail(cashBookId, settingPrintDefault, 'lg', '', true);
            });

            $('body').on('click', '.btnDelete', function (e) {
                const cashBookId = $(this).data('cash_book_id');
                e.preventDefault();
                if (cashBookId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', function (result) {
                        if (result) {
                            deleteVoucher(cashBookId);
                        }
                    });
                }
            });

            $(btnReset).on('click', function (e) {
                e.preventDefault();
                self.resetVoucher();
            });

            $(btnSave).on('click', function (e) {
                e.preventDefault();
                self.initSave();
            });
        },

        initSave: function () {
            var error = validateSave();
            if (!error) {
                var rowsCount = $('#purchase_table').find('tbody tr').length;
                if (rowsCount > 0) {
                    var saveObj = getSaveObject();
                    save(saveObj);
                } else {
                    _getAlertMessage('Error!', "Please add at least one row in the grid to save.", 'danger');
                }
            } else {
                _getAlertMessage('Error!', "Correct the errors", 'danger');
            }
        },

        resetVoucher: function () {
            $('#gridAccountDebit').prop('disabled', false);
            $('#gridAccountCredit').prop('disabled', false);
            resetVoucher();
        }

    }
}

var cashBook = new CashBook();
cashBook.init();

// Corrected function to match the HTML ID
$(function () {
    new DynamicOption("#gridAccountNameDropdown", {
        requestedUrl: dropdownOptions.getAccountDetailAll,
        placeholderText: "Choose Account",
        allowClear: true,
    });

    new DynamicOption("#accountCashDropdown", {
        requestedUrl: dropdownOptions.getCashAccountDetailAll,
        placeholderText: "Choose Cash Account",
        allowClear: true,
    });
});
