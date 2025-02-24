import AlertComponent from "../../../../js/components/AlertComponent.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { getTableRowIsAlreadyExist, ifNull, setFinancialYearDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek } from "../commonFunctions/CommonFunction.js";

var BankPayment = function () {

    var settings = {
        switchPreBal: $('#switchPreBal')
    };

    const btnReset = $('.btnReset');
    const btnSave = $('.btnSave');
    const btnAdd = $('#btnAdd');
    const current_date = $('#current_date');
    const chk_date = $('#bank_payment_chk_date');
    const gridAccountPartydropdown = $('#gridAccountPartydropdown');
    const gridBankAccountDropdown = $('#gridBankAccountDropdown');
    const gridAccountParticularInput = $('#gridAccountParticularInput');
    const gridAccountInvoiceNoInput = $('#gridAccountInvoiceNoInput');
    const gridAccountChequeDateInput = $('#gridAccountChequeDateInput');
    const gridAccountChequeNumberInput = $('#gridAccountChequeNumberInput');
    const gridAccountAmountInput = $('#gridAccountAmountInput');
    const gridAccountTotalAmount = $('.gridAccountTotalAmount');
    const bankPaymentTable = $('#bank_payment_table');

    var save = function (bankPaymentData) {
        const main = bankPaymentData.main;
        const details = bankPaymentData.details;
        general.disableSave();
        $.ajax({
            url: `${base_url}/bankPayment/save`,
            type: 'POST',
            data: { 'main': JSON.stringify(main), 'details': JSON.stringify(details), 'id': bankPaymentData.id, 'chk_date': $(chk_date).val() },
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

    var getSaveObject = function () {
        const main = {};
        const details = [];

        main.id = $('#bankPaymentIdHidden').val();
        main.vrdate = $('#current_date').val();
        main.chk_date = $(chk_date).val();

        $('#bank_payment_table').find('tbody tr').each(function (index, elem) {
            const gridAccountDetail = {};

            gridAccountDetail.party_id = $.trim($(elem).find('td.accountName').data('account_id'));
            gridAccountDetail.cheque_bank_id = $.trim($(elem).find('td.bankAccountName').data('bank_account_id'));
            gridAccountDetail.cheque_particular = $.trim($(elem).find('td.particular').text());
            gridAccountDetail.cheque_invoice_no = $.trim($(elem).find('td.invoiceNo').text());
            gridAccountDetail.cheque_vrdate = $.trim($(elem).find('td.chequeDate').text());
            gridAccountDetail.cheque_no = $.trim($(elem).find('td.chequeNumber').text());
            gridAccountDetail.cheque_amount = $.trim($(elem).find('td.amount').text());

            details.push(gridAccountDetail);
        });
        var data = {};
        data.main = main;
        data.details = details;
        data.id = $('#bankPaymentIdHidden').val();
        return data;
    };

    var fetch = function (bankPaymentId) {
        $.ajax({
            url: `${base_url}/bankPayment/fetch`,
            type: 'GET',
            data: { 'bankPaymentId': bankPaymentId },
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
        $('#bankPaymentIdHidden').val(data.id);

        populateDateValue('current_date', data.vrdate);
        populateDateValue('chk_date', data.vrdate);

        $.each(data.bank_payment_details, function (index, elem) {
            appendToTable(elem.party_id, elem.party['name'], elem.cheque_bank_id, elem.bank_party['name'], ifNull(elem.cheque_particular, ""), ifNull(elem.cheque_invoice_no, ""), getFormattedDate(elem.cheque_vrdate), elem.cheque_no, parseFloat(elem.cheque_amount).toFixed(AMOUNT_ROUNDING));
        });
        calculateLowerTotal();
    };

    var deleteVoucher = function (vrnoa) {
        general.disableSave();
        $.ajax({
            url: base_url + '/bankPayment/delete',
            type: 'delete',
            data: { 'chk_date': $(chk_date).val(), 'vrdate': $(current_date).val(), 'vrnoa': vrnoa },
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

    var appendToTable = function (accountId, accountName, bankAccountId, bankAccountName, particular, invoiceNo, chequeDate, chequeNumber, amount) {

        const srno = $('#bank_payment_table tbody tr').length + 1;

        const row = `
						<tr     class = "odd:bg-white even:bg-slate-50">
						<td     class = 'py-1 px-1 text-md align-middle text-left srno' data-title='Sr#'> ${srno}</td>
                        <td class = 'py-1 px-1 text-md align-middle text-left accountName' data-account_id = '${accountId}'">${accountName}</td>
                        <td class = 'py-1 px-1 text-md align-middle text-left bankAccountName' data-bank_account_id = '${bankAccountId}'">${bankAccountName}</td>
                        <td     class = 'py-1 px-1 text-md align-middle text-left particular'>${particular}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left invoiceNo'>${invoiceNo}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left chequeDate'>${chequeDate}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left chequeNumber'>${chequeNumber}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right amount'>${parseFloat(amount).toFixed(AMOUNT_ROUNDING)}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right'>
						<div    class = "btn-group">
						<button type  = "button" class                                        = "btn btn-sm btn-outline-primary dropdown-toggle" data-toggle = "dropdown" aria-haspopup = "true" aria-expanded = "false">
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

        $(row).appendTo(bankPaymentTable);
        getTableSerialNumber(bankPaymentTable);

    };

    var validateSave = function () {
        var errorFlag = false;

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!current_date.val()) {
            current_date.addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    };

    const validateGridProductAdd = () => {
        let hasError = false;
        let errorMessage = '';

        // remove the error class first
        $('.inputerror').removeClass('inputerror');


        if (!$(gridAccountPartydropdown).val()) {
            $('#select2-gridAccountPartydropdown-container').parent().addClass('inputerror');
            errorMessage += `Account Name is required <br />`;
            hasError = true;
        }

        if (!$(gridBankAccountDropdown).val()) {
            $('#select2-gridBankAccountDropdown-container').parent().addClass('inputerror');
            errorMessage += `Bank account Name is required <br />`;
            hasError = true;
        }

        if (!$(gridAccountChequeDateInput).val()) {
            $(gridAccountChequeDateInput).addClass('inputerror');
            errorMessage += `Cheque Date is required <br />`;
            hasError = true;
        }

        if (!$(gridAccountChequeNumberInput).val()) {
            $(gridAccountChequeNumberInput).addClass('inputerror');
            errorMessage += `Cheque Number is required <br />`;
            hasError = true;
        }

        if (!$(gridAccountAmountInput).val()) {
            $(gridAccountAmountInput).addClass('inputerror');
            errorMessage += `Cheque Amount is required <br />`;
            hasError = true;
        } else if ($(gridAccountAmountInput).val() <= 0) {
            $(gridAccountAmountInput).addClass('inputerror');
            errorMessage += `Cheque Amount must be greater than 0 <br />`;
            hasError = true;
        }

        if (hasError) {
            return errorMessage;
        }
        return null;
    };

    var resetVoucher = function () {
        resetFields();
        $('#voucher_type_hidden').val('new');
        getBankPaymentViewList();
    };

    var resetFields = function () {
        $('#bankPaymentIdHidden').val('');
        $(current_date).datepicker('update', new Date());
        $(gridAccountChequeDateInput).datepicker('update', new Date());
        $(gridBankAccountDropdown).val('').trigger('change.select2');
        $(gridAccountPartydropdown).val('').trigger('change.select2');
        $(gridAccountParticularInput).val('');
        $(gridAccountChequeNumberInput).val('');
        $(gridAccountAmountInput).val('');
        $(gridAccountInvoiceNoInput).val('');
        $(gridAccountTotalAmount).text('');
        $('#bank_payment_table tbody tr').remove();
        $('#purchase_tableReport tbody tr').remove();
        $('#laststockLocation_table tbody tr').remove();
        $('.inputerror').removeClass('inputerror');
    }

    var calculateLowerTotal = function () {
        let gridAccounttotalAmount = 0;

        $(bankPaymentTable).find("tbody tr").each(function (index, elem) {
            gridAccounttotalAmount += getNumText($(this).closest('tr').find('td.amount'));
        });

        $(gridAccountTotalAmount).text(parseNumber(gridAccounttotalAmount).toFixed(AMOUNT_ROUNDING));
    };

    let bankPaymentViewList = undefined;
    const getBankPaymentViewList = (bankPaymentId = 0, fromDate = "", toDate = "") => {
        if (typeof bankPaymentViewList !== 'undefined') {
            bankPaymentViewList.destroy();
            $('#bankPaymentViewListTbody').empty();
        }
        bankPaymentViewList = $("#bankPaymentViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/bankPayment/getBankPaymentViewList`,
                type: 'GET',
                data: { 'bankPaymentId': bankPaymentId, fromDate: fromDate, toDate: toDate },
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
                    data: "bank_payment_main.vrnoa",
                    name: "bankPaymentMain.vrnoa",
                    className: "text-left bankPaymentVoucher"
                },
                {
                    data: "bank_payment_main.vrdate",
                    name: "bankPaymentMain.vrdate",
                    className: "text-left voucherDate",
                    render: function (data, type, row) {
                        return getFormattedDate(data);
                    }
                },
                { data: "party.name", name: 'party.name', className: "accountName" },
                { data: "bank_party.name", name: 'bankParty.name', className: "bankAccountName" },
                {
                    data: "cheque_vrdate",
                    name: "cheque_vrdate",
                    className: "text-left chequeVrdate",
                    render: function (data, type, row) {
                        return getFormattedDate(data);
                    }
                },
                { data: "cheque_no", name: 'bank_payment_details.cheque_no', className: "chequeNumber" },
                {
                    data: "cheque_amount", name: 'bank_payment_details.cheque_amount', className: "chequeAmount", render: function (data, type, row) {
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
							<a   class = "dropdown-item btnEditPrevVoucher" data-bank_payment_id = "${row.bank_payment_id}" href = "#"><i class = 'fa fa-edit'></i> Edit Voucher</a>

                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                <li class="dropdown-item"><a href="#" class="btnPrint" data-bank_payment_id   ="${row.bank_payment_id}">Print Voucher</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-bank_payment_id   ="${row.bank_payment_id}"> Print a4 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-bank_payment_id   ="${row.bank_payment_id}"> Print a4 without header </a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-bank_payment_id   ="${row.bank_payment_id}"> Print b5 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-bank_payment_id   ="${row.bank_payment_id}"> Print b5 without header </a></li>
                            </ul>

							<a   class = "dropdown-item btnDelete" data-bank_payment_id          = "${row.bank_payment_id}" href = "#"><i class = 'fa fa-trash'></i> Delete Voucher</a>
							<div class = "dropdown-divider"></div>
							<a   class = "dropdown-item btnPrintASEmail" data-bank_payment_id    = "${row.bank_payment_id}" href = "#">Send Email</a>
							</div
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
        bankPaymentViewList.on('draw', function () {
            $('[data-toggle="tooltip"]').tooltip();  // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
    };
    var Print_Voucher = function (vrnoa, paperSize, printSize, wrate = 0, isSendEmail = false) {
        try {
            const __etype = 'bank_payments';
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

    return {

        init: function () {
            this.bindUI();
            $('.select2').select2({
                width: 'element',
            });
            getBankPaymentViewList();
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

            $(gridAccountParticularInput, gridAccountInvoiceNoInput, gridAccountChequeDateInput, gridAccountChequeNumberInput, gridAccountAmountInput).on('keypress', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    $(btnAdd).trigger('click');
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

            $(btnAdd).on('click', async function (e) {
                e.preventDefault();

                const alertMessage = validateGridProductAdd();
                if (alertMessage) {
                    return AlertComponent.getAlertMessage({ title: "Error!", message: alertMessage, type: "danger" });
                }

                const accountId = parseNumber($(gridAccountPartydropdown).val());
                const accountName = $.trim($(gridAccountPartydropdown).find('option:selected').text());
                const bankAccountId = parseNumber($(gridBankAccountDropdown).val());
                const bankAccountName = $.trim($(gridBankAccountDropdown).find('option:selected').text());
                const particular = $(gridAccountParticularInput).val();
                const invoiceNo = $(gridAccountInvoiceNoInput).val();
                const chequeDate = $(gridAccountChequeDateInput).val();
                const chequeNumber = $(gridAccountChequeNumberInput).val();
                const amount = $(gridAccountAmountInput).val();

                const isAlreadyExist = getTableRowIsAlreadyExist('#bank_payment_table', chequeNumber, 'chequeNumber', null, 'text');


                if ($(gridBankAccountDropdown).val() === $(gridAccountPartydropdown).val()) {
                    return AlertComponent.getAlertMessage({ title: "Warning!", message: "Account and bank account are Same.", type: "warning" });
                }

                if (isAlreadyExist) {
                    return AlertComponent.getAlertMessage({ title: "Warning!", message: "Cheque number already used. Please choose another.", type: "warning" });
                }


                $(gridAccountPartydropdown).val('').trigger('change.select2');
                $(gridBankAccountDropdown).val('').trigger('change.select2');
                $(gridAccountParticularInput).val('');
                $(gridAccountInvoiceNoInput).val('');
                $(gridAccountChequeDateInput).datepicker('update', new Date());
                $(gridAccountChequeNumberInput).val('');
                $(gridAccountAmountInput).val('');

                appendToTable(accountId, accountName, bankAccountId, bankAccountName, particular, invoiceNo, chequeDate, chequeNumber, amount);

                $(gridAccountPartydropdown).focus();
                calculateLowerTotal();
            });

            $(bankPaymentTable).on('click', '.btnRowEdit', function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');

                const editAccountId = row.find('td.accountName').data('account_id');
                const editAccountName = row.find('td.accountName').clone().children('span').remove().end().text();
                const editBankAccountId = row.find('td.bankAccountName').data('bank_account_id');
                const editBankAccountName = row.find('td.bankAccountName').clone().children('span').remove().end().text();
                const editParticular = row.find('td.particular').text();
                const editInvoiceNo = row.find('td.invoiceNo').text();
                const editBankName = row.find('td.bankName').text();
                const editChequeDate = row.find('td.chequeDate').text();
                const editChequeNumber = row.find('td.chequeNumber').text();
                const editAmount = parseNumber(row.find('td.amount').text());

                triggerAndRenderOptions(gridAccountPartydropdown, editAccountName, editAccountId);
                triggerAndRenderOptions(gridBankAccountDropdown, editBankAccountName, editBankAccountId);
                $(gridAccountParticularInput).val(editParticular);
                $(gridAccountInvoiceNoInput).val(editInvoiceNo);
                $(gridAccountChequeDateInput).val(editChequeDate);
                $(gridAccountChequeNumberInput).val(editChequeNumber);
                $(gridAccountAmountInput).val(editAmount);

                row.remove();
                calculateLowerTotal();
            });

            $(bankPaymentTable).on('click', '.btnRowRemove', function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');
                row.remove();
                calculateLowerTotal();
            });

            $('#bankPaymentSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getBankPaymentViewList();
            });
            $('#bankPaymentFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getBankPaymentViewList("", fromDate, toDate);
            });

            $('body').on('click', '.btnPrint', function (e) {
                const bankPaymentId = $(this).data('bank_payment_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(base_url + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(bankPaymentId, settingPrintDefault, 'lg', '');
                }
            });

            $('body').on('click', '.btnPrintA4WithHeader', function (e) {
                const bankPaymentId = $(this).data('bank_payment_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(bankPaymentId, 1, 'lg',"");
                }
            });
            $('body').on('click', '.btnPrintA4WithOutHeader', function (e) {
                const bankPaymentId = $(this).data('bank_payment_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(bankPaymentId, 2, 'lg',"");
                }
            });
            $('body').on('click', '.btnPrintB5WithHeader', function (e) {
                const bankPaymentId = $(this).data('bank_payment_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(bankPaymentId, 3, 'lg',"");
                }
            });
            $('body').on('click', '.btnPrintB5WithOutHeader', function (e) {
                const bankPaymentId = $(this).data('bank_payment_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(bankPaymentId, 4, 'lg',"");
                }
            });
            

            $('body').on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                const bankPaymentId = parseNumber($(this).data('bank_payment_id'));
                fetch(bankPaymentId);
                $('a[href="#Main"]').trigger('click');
            });

            $('body').on('click', '.btnPrintASEmail', function (e) {
                const bankPaymentId = $(this).data('bank_payment_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                getSendMail(bankPaymentId, settingPrintDefault, 'lg', '', true);
            });

            $('body').on('click', '.btnDelete', function (e) {
                const bankPaymentId = $(this).data('bank_payment_id');
                e.preventDefault();
                if (bankPaymentId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', function (result) {
                        if (result) {
                            deleteVoucher(bankPaymentId);
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
                var rowsCount = $('#bank_payment_table').find('tbody tr').length;
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
            resetVoucher();
        }
    }

}

var bankPayment = new BankPayment();
bankPayment.init();

// Corrected function to match the HTML ID
$(function () {
    new DynamicOption("#gridAccountPartydropdown", {
        requestedUrl: dropdownOptions.getAccountDetailAll,
        placeholderText: "Choose Account",
        allowClear: true,
    });
    new DynamicOption("#gridBankAccountDropdown", {
        requestedUrl: dropdownOptions.getBankAccountDetailAll,
        placeholderText: "Choose Bank Account",
        allowClear: true,
    });
});
