"use strict";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { getTableRowIsAlreadyExist, ifNull, parseNumber, setFinancialYearDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek } from "../commonFunctions/CommonFunction.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { getPendingChequeInHand } from "../commonFunctions/TableListViwes.js";

var BankReceive = function () {

    var settings = {
        switchPreBal: $('#switchPreBal')
    };

    const btnReset = $('.btnReset');
    const btnSave = $('.btnSave');
    const btnAdd = $('#btnAdd');
    const current_date = $('#current_date');
    const chk_date = $('#bank_receive_chk_date');
    const gridAccountChequeListNumberInput = $('#gridAccountChequeListNumberInput');
    const gridAccountPartydropdown = $('#gridAccountPartydropdown');
    const gridBankAccountDropdown = $('#gridBankAccountDropdown');
    const gridAccountParticularInput = $('#gridAccountParticularInput');
    const gridAccountBankNameInput = $('#gridAccountBankNameInput');
    const gridAccountChequeDateInput = $('#gridAccountChequeDateInput');
    const gridAccountChequeNumberInput = $('#gridAccountChequeNumberInput');
    const gridAccountAmountInput = $('#gridAccountAmountInput');
    const gridAccountTotalAmount = $('.gridAccountTotalAmount');
    const purchase_table = $('#purchase_table');

    var save = function (purchaseData) {
        const main = purchaseData.main;
        const details = purchaseData.details;
        general.disableSave();
        $.ajax({
            url: `${base_url}/bankReceive/save`,
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
            url: base_url + '/bankReceive/delete',
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

    var fetch = function (bankReceieveId) {
        $.ajax({
            url: `${base_url}/bankReceive/fetch`,
            type: 'GET',
            data: { 'bankReceiveId': bankReceieveId },
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
        $('#bankReceiveIdHidden').val(data.id);

        populateDateValue('current_date', data.vrdate);
        populateDateValue('chk_date', data.vrdate);

        $.each(data.bank_receive_details, function (index, elem) {
            appendToTable(ifNull(elem.cheque_list_number, ""), elem.party_id, elem.party['name'], elem.cheque_bank_id, elem.bank_party['name'], ifNull(elem.cheque_particular, ""), elem.cheque_bank_name, getFormattedDate(elem.cheque_vrdate), elem.cheque_no, parseFloat(elem.cheque_amount).toFixed(AMOUNT_ROUNDING));
        });
        calculateLowerTotal();
    }

    var getSaveObject = function () {
        const main = {};
        const details = [];

        main.id = $('#bankReceiveIdHidden').val();
        main.vrdate = $('#current_date').val();
        main.chk_date = $(chk_date).val();

        $('#purchase_table').find('tbody tr').each(function (index, elem) {
            const gridAccountDetail = {};

            gridAccountDetail.cheque_list_number = $.trim($(elem).find('td.chequeListNumber').text());
            gridAccountDetail.party_id = $.trim($(elem).find('td.accountName').data('account_id'));
            gridAccountDetail.cheque_bank_id = $.trim($(elem).find('td.bankAccountName').data('bank_account_id'));
            gridAccountDetail.cheque_in_hand_id = $.trim($(elem).find('td.bankAccountName').data('bank_account_id'));
            gridAccountDetail.cheque_particular = $.trim($(elem).find('td.particular').text());
            gridAccountDetail.cheque_bank_name = $.trim($(elem).find('td.bankName').text());
            gridAccountDetail.cheque_vrdate = $.trim($(elem).find('td.chequeDate').text());
            gridAccountDetail.cheque_no = $.trim($(elem).find('td.chequeNumber').text());
            gridAccountDetail.cheque_amount = $.trim($(elem).find('td.amount').text());
            gridAccountDetail.received_amount = $.trim($(elem).find('td.amount').text());

            details.push(gridAccountDetail);
        });
        var data = {};
        data.main = main;
        data.details = details;
        data.id = $('#bankReceiveIdHidden').val();
        return data;
    };

    var appendToTable = function (chequeListNumber, accountId, accountName, bankAccountId, bankAccountName, particular, bankName, chequeDate, chequeNumber, amount) {

        const srno = $('#purchase_table tbody tr').length + 1;

        const row = `
						<tr     class = "odd:bg-white even:bg-slate-50">
						<td     class = 'py-1 px-1 text-md align-middle text-left srno' data-title='Sr#'> ${srno}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left chequeListNumber'>${chequeListNumber}</td>
                        <td class = 'py-1 px-1 text-md align-middle text-left accountName' data-account_id = '${accountId}'">${accountName}</td>
                        <td class = 'py-1 px-1 text-md align-middle text-left bankAccountName' data-bank_account_id = '${bankAccountId}'">${bankAccountName}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left particular'>${particular}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left bankName'>${bankName}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right chequeDate'>${chequeDate}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right chequeNumber'>${chequeNumber}</td>
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

        $(row).appendTo(purchase_table);
        getTableSerialNumber(purchase_table);
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

    const validateSingleProductAdd = () => {
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

        if (!$(gridAccountBankNameInput).val()) {
            $(gridAccountBankNameInput).addClass('inputerror');
            errorMessage += `Bank Name is required <br />`;
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
        getBankReceiveViewList();
    };

    var resetFields = function () {
        $('#bankReceiveIdHidden').val('');
        $(current_date).datepicker('update', new Date());
        $(gridAccountChequeDateInput).prop('disabled', false).datepicker('update', new Date());
        $(gridBankAccountDropdown).val('').trigger('change.select2');
        $(gridAccountPartydropdown).prop('disabled', false).val('').trigger('change.select2');
        $(gridAccountParticularInput).val('');
        $(gridAccountBankNameInput).prop('disabled', false).val('');
        $(gridAccountChequeNumberInput).prop('disabled', false).val('');
        $(gridAccountAmountInput).prop('disabled', false).val('');
        $(gridAccountChequeListNumberInput).val('');
        $(gridAccountTotalAmount).text('');
        $('#purchase_table tbody tr').remove();
        $('#purchase_tableReport tbody tr').remove();
        $('#laststockLocation_table tbody tr').remove();
        $('.inputerror').removeClass('inputerror');
    }

    var calculateLowerTotal = function () {
        let gridAccounttotalAmount = 0;

        $(purchase_table).find("tbody tr").each(function (index, elem) {
            gridAccounttotalAmount += getNumText($(this).closest('tr').find('td.amount'));
        });

        $(gridAccountTotalAmount).text(parseNumber(gridAccounttotalAmount).toFixed(AMOUNT_ROUNDING));
    };

    let purchaseOrderViewList = undefined;
    const getBankReceiveViewList = (bankReceiveId = 0, fromDate = "", toDate = "") => {
        if (typeof purchaseOrderViewList !== 'undefined') {
            purchaseOrderViewList.destroy();
            $('#purchaseOrderViewListTbody').empty();
        }
        purchaseOrderViewList = $("#purchaseOrderViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/bankReceive/getBankReceiveViewList`,
                type: 'GET',
                data: { 'bankReceiveId': bankReceiveId, fromDate: fromDate, toDate: toDate },
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
                    data: "bankReceiveVoucher",
                    name: "bank_receives.vrnoa",
                    className: "text-left bankReceiveVoucher"
                },
                {
                    data: "voucherDate",
                    name: "bank_receives.vrdate",
                    className: "text-left voucherDate",
                    render: function (data, type, row) {
                        return getFormattedDate(data);
                    }
                },
                { data: "accountName", name: 'parties.name', className: "accountName" },
                { data: "bankAccountName", name: 'parties.name', className: "bankAccountName" },
                {
                    data: "chequeVrdate",
                    name: "bank_receive_details.cheque_vrdate",
                    className: "text-left chequeVrdate",
                    render: function (data, type, row) {
                        return getFormattedDate(data);
                    }
                },
                { data: "chequeListNumber", name: 'bank_receive_details.cheque_list_number', className: "chequeListNumber" },
                { data: "chequeNumber", name: 'bank_receive_details.cheque_no', className: "chequeNumber" },
                {
                    data: "chequeAmount", name: 'bank_receive_details.cheque_amount', className: "chequeAmount", render: function (data, type, row) {
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
							<a   class = "dropdown-item btnEditPrevVoucher" data-bank_receive_id = "${row.bankReceiveId}" href = "#"><i class = 'fa fa-edit'></i> Edit Voucher</a>

                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                <li class="dropdown-item"><a href="#" class="btnPrint" data-bank_receive_id   ="${row.bankReceiveId}">Print Voucher</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-bank_receive_id   ="${row.bankReceiveId}"> Print a4 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-bank_receive_id   ="${row.bankReceiveId}"> Print a4 without header </a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-bank_receive_id   ="${row.bankReceiveId}"> Print b5 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-bank_receive_id   ="${row.bankReceiveId}"> Print b5 without header </a></li>
                            </ul>

							<a   class = "dropdown-item btnDelete" data-bank_receive_id          = "${row.bankReceiveId}" href = "#"><i class = 'fa fa-trash'></i> Delete Voucher</a>
							<div class = "dropdown-divider"></div>
							<a   class = "dropdown-item btnPrintASEmail" data-bank_receive_id    = "${row.bankReceiveId}" href = "#">Send Email</a>
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
        purchaseOrderViewList.on('draw', function () {
            $('[data-toggle="tooltip"]').tooltip();  // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
    };

    var Print_Voucher = function (vrnoa, paperSize, printSize, wrate = 0, isSendEmail = false) {
        try {
            const __etype = 'bank_receives';
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
        const __etype = 'bank_receives';
        const __vrnoa = vrnoa;
        const __pre_bal_print = ($(settings.switchPreBal).bootstrapSwitch('state') === true) ? '2' : '1';
        const __lang = $('#print_lang').val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, __pre_bal_print, paperSize, printSize, wrate, __lang, email);
    };

    const validatePendingChequeInHandAmount = async (chequeListNumber, amount) => {

        const response = await makeAjaxRequest('GET', `bankReceive/validatePendingChequeInHandAmount`, {
            chequeListNumber: chequeListNumber,
            amount: amount
        });
        $('#gridAccountAmountInput').removeClass('inputerror');
        if (response.status == false && response.error !== "") {
            $('#gridAccountAmountInput').addClass('inputerror');
            AlertComponent.getAlertMessage({ title: "Error", message: response.message, type: "danger" });
        } else if (response.status == false && response.message !== "") {
            $('#gridAccountAmountInput').addClass('inputerror');
            AlertComponent.getAlertMessage({ title: "Warning", message: response.message, type: "warning" });
        } else {
            return true;
        }
        return false;
    };

    const getPendingChequeInHandByChequeList = async function (chequeListNumber = null, pid = null, chequeType = null) {
        const response = await makeAjaxRequest('GET', `${base_url}/chequeReceive/getPendingChequeInHandByChequeList`, { 'cheque_list_number': chequeListNumber, 'party_id': pid });
        if (response && response.status == false && response.error !== "") {
            _getAlertMessage('Error!', response.message, 'danger');
        } else if (response && response.status == false && response.message !== "") {
            _getAlertMessage('Information!', response.message, 'info');
            resetVoucher();
        } else {
            populatePendingChequeInHand(response.data, chequeType);
        }
    };

    var populatePendingChequeInHand = function (data, chequeType = null) {
        triggerAndRenderOptions($('#gridAccountPartydropdown'), data[0]['chequeInHandName'], data[0]['cheque_in_hand_id'], false);
        $('#gridAccountPartydropdown').prop('disabled', true);
        $('#gridAccountBankNameInput').val(data[0]['cheque_bank_name']).prop('disabled', true);
        populateDateValue('gridAccountChequeDateInput', data[0]['cheque_vrdate']);
        $('#gridAccountChequeDateInput').prop('disabled', true);
        $('#gridAccountChequeNumberInput').val(data[0]['cheque_no']).prop('disabled', true);
        $('#gridAccountAmountInput').val(data[0]['totalPendingAmount']).prop('disabled', false);
    };


    return {

        init: function () {
            this.bindUI();
            $('.select2').select2({
                width: 'element',
            });
            getBankReceiveViewList();
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

            $(gridAccountChequeListNumberInput, gridAccountParticularInput, gridAccountBankNameInput, gridAccountChequeDateInput, gridAccountChequeNumberInput, gridAccountAmountInput).on('keypress', function (e) {
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

                const alertMessage = validateSingleProductAdd();
                if (alertMessage) {
                    return _getAlertMessage('Error!', alertMessage, 'danger');;
                }

                const chequeListNumber = $(gridAccountChequeListNumberInput).val();
                const accountId = parseNumber($(gridAccountPartydropdown).val());
                const accountName = $.trim($(gridAccountPartydropdown).find('option:selected').text());
                const bankAccountId = parseNumber($(gridBankAccountDropdown).val());
                const bankAccountName = $.trim($(gridBankAccountDropdown).find('option:selected').text());
                const particular = $(gridAccountParticularInput).val();
                const bankName = $(gridAccountBankNameInput).val();
                const chequeDate = $(gridAccountChequeDateInput).val();
                const chequeNumber = $(gridAccountChequeNumberInput).val();
                const amount = $(gridAccountAmountInput).val();
                var IsAlreadyExist = getTableRowIsAlreadyExist('#purchase_table', accountId);

                if (parseNumber(chequeListNumber) > 0) {
                    const flg = await validatePendingChequeInHandAmount(chequeListNumber, amount);
                    if (!flg) {
                        return;
                    }
                }

                if ($(gridBankAccountDropdown).val() === $(gridAccountPartydropdown).val()) {
                    return _getAlertMessage('Error!', "Account and Bank Account are Same..", 'danger');
                }

                if ($(gridBankAccountDropdown).val() === $(gridAccountPartydropdown).val()) {
                    return _getAlertMessage('Error!', "Account and Bank Account are Same..", 'danger');
                }

                if (IsAlreadyExist)
                    return alert('Already Exist in the Following Table!!');


                $(gridAccountPartydropdown).prop('disabled', false).val('').trigger('change.select2');
                $(gridBankAccountDropdown).val('').trigger('change.select2');
                $(gridAccountChequeListNumberInput).val('');
                $(gridAccountParticularInput).val('');
                $(gridAccountBankNameInput).prop('disabled', false).val('');
                $(gridAccountChequeDateInput).prop('disabled', false).datepicker('update', new Date());
                $(gridAccountChequeNumberInput).prop('disabled', false).val('');
                $(gridAccountAmountInput).prop('disabled', false).val('');

                appendToTable(chequeListNumber, accountId, accountName, bankAccountId, bankAccountName, particular, bankName, chequeDate, chequeNumber, amount);

                $(gridAccountPartydropdown).focus();
                calculateLowerTotal();
            });

            $(purchase_table).on('click', '.btnRowEdit', function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');

                const editChequeListNumber = row.find('td.chequeListNumber').text();
                const editAccountId = row.find('td.accountName').data('account_id');
                const editAccountName = row.find('td.accountName').clone().children('span').remove().end().text();
                const editBankAccountId = row.find('td.bankAccountName').data('bank_account_id');
                const editBankAccountName = row.find('td.bankAccountName').clone().children('span').remove().end().text();
                const editParticular = row.find('td.particular').text();
                const editBankName = row.find('td.bankName').text();
                const editChequeDate = row.find('td.chequeDate').text();
                const editChequeNumber = row.find('td.chequeNumber').text();
                const editAmount = parseNumber(row.find('td.amount').text());

                $(gridAccountChequeListNumberInput).val(editChequeListNumber).prop('disabled', true);
                triggerAndRenderOptions(gridAccountPartydropdown, editAccountName, editAccountId, false, true);
                triggerAndRenderOptions(gridBankAccountDropdown, editBankAccountName, editBankAccountId, false);
                $(gridAccountParticularInput).val(editParticular);


                let disabled = false;
                if (parseNumber(editChequeListNumber) > 0) {
                    disabled = true;
                }
                $(gridAccountBankNameInput).val(editBankName).prop('disabled', disabled);
                $(gridAccountChequeDateInput).val(editChequeDate).prop('disabled', disabled);
                $(gridAccountChequeNumberInput).val(editChequeNumber).prop('disabled', disabled);
                $(gridAccountAmountInput).val(editAmount).prop('disabled', disabled);

                row.remove();
                calculateLowerTotal();
            });

            $(purchase_table).on('click', '.btnRowRemove', function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');
                row.remove();
                calculateLowerTotal();
            });

            $('#getChequeInHandLookUp').on('click', function (e) {
                e.preventDefault();
                getPendingChequeInHand(null, null);
            });

            $('body').on('click', '.modal-lookup .populatePendingChequeInHand', function (e) {
                e.preventDefault();
                const chequeListNumber = $(this).closest('tr').find('td.chequeListNumber').text();
                var errorFlag = false;
                $('#purchase_table').find('tbody tr').each(function (index, elem) {
                    const gridChequeListNumber = $.trim($(elem).find('td.chequeListNumber').text());
                    if (chequeListNumber == gridChequeListNumber) {
                        errorFlag = true;
                    }
                });
                if (chequeListNumber !== 0 && errorFlag == false) {
                    $(gridAccountChequeListNumberInput).val(chequeListNumber);
                    getPendingChequeInHandByChequeList(chequeListNumber, null);
                } else {
                    $(gridAccountChequeListNumberInput).val('');
                    _getAlertMessage('Error!', "This Cheque Is Already Added In Grid...", 'danger')
                }
            });


            $('#purchaseOrderSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getBankReceiveViewList();
            });
            $('#purchaseOrderFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getBankReceiveViewList("", fromDate, toDate);
            });

            $('body').on('click', '.btnPrint', function (e) {
                const bankReceiveId = $(this).data('bank_receive_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(base_url + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(bankReceiveId, settingPrintDefault, 'lg', '');
                }
            });

            $('body').on('click', '.btnPrintA4WithHeader', function (e) {
                const bankReceiveId = $(this).data('bank_receive_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(bankReceiveId, 1, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintA4WithOutHeader', function (e) {
                const bankReceiveId = $(this).data('bank_receive_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(bankReceiveId, 2, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintB5WithHeader', function (e) {
                const bankReceiveId = $(this).data('bank_receive_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(bankReceiveId, 3, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintB5WithOutHeader', function (e) {
                const bankReceiveId = $(this).data('bank_receive_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(bankReceiveId, 4, 'lg', "");
                }
            });

            $('body').on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                const bankReceiveId = parseNumber($(this).data('bank_receive_id'));
                fetch(bankReceiveId);
                $('a[href="#Main"]').trigger('click');
            });

            $('body').on('click', '.btnPrintASEmail', function (e) {
                const bankReceiveId = $(this).data('bank_receive_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                getSendMail(bankReceiveId, settingPrintDefault, 'lg', '', true);
            });

            $('body').on('click', '.btnDelete', function (e) {
                const bankReceiveId = $(this).data('bank_receive_id');
                e.preventDefault();
                if (bankReceiveId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', function (result) {
                        if (result) {
                            deleteVoucher(bankReceiveId);
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
            resetVoucher();
        }
    }

}

var bankReceive = new BankReceive();
bankReceive.init();


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
