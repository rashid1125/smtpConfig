import { baseConfiguration } from "../../../../js/components/ConfigurationManager.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { getTableRowIsAlreadyExist, ifNull, parseNumber, setFinancialYearDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek } from "../commonFunctions/CommonFunction.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";

var ChequeReceive = function () {

    var settings = {
        switchPreBal: $('#switchPreBal')
    };

    const accountDropdown = $('#accountDropdown');
    const current_date = $('#current_date');
    const chk_date = $('#cheque_receive_chk_date');
    const chequeInHandDropdown = $('#chequeInHandDropdown');
    const accountRemarks = $('#accountRemarks');
    const gridAccountChequeListNumberInput = $('#gridAccountChequeListNumberInput');
    const gridAccountParticularInput = $('#gridAccountParticularInput');
    const gridAccountBankNameInput = $('#gridAccountBankNameInput');
    const gridAccountInvoiceNoInput = $('#gridAccountInvoiceNoInput');
    const gridAccountChequeDateInput = $('#gridAccountChequeDateInput');
    const gridAccountChequeNumberInput = $('#gridAccountChequeNumberInput');
    const gridAccountAmountInput = $('#gridAccountAmountInput');
    const btnAdd = $('#btnAdd');
    const purchase_table = $('#purchase_table');
    const btnReset = $('.btnReset');
    const btnSave = $('.btnSave');
    const gridAccountTotalAmount = $('.gridAccountTotalAmount');

    var save = function (purchaseData) {
        const main = purchaseData.main;
        const details = purchaseData.details;
        general.disableSave();
        $.ajax({
            url: `${base_url}/chequeReceive/save`,
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
            url: base_url + '/chequeReceive/delete',
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

    var fetch = function (chequeReceieveId) {
        $.ajax({
            url: `${base_url}/chequeReceive/fetch`,
            type: 'GET',
            data: { 'chequeReceiveId': chequeReceieveId },
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
        $('#chequeReceiveIdHidden').val(data.id);
        $(accountRemarks).val(data.remarks);

        populateDateValue('current_date', data.vrdate);
        populateDateValue('chk_date', data.vrdate);

        const party = handleObjectName(data, 'party');
        if (party) {
            triggerAndRenderOptions($('#accountDropdown'), party.name, party.pid, false);
        }
        const chequeInHand = handleObjectName(data, 'cheque_in_hand_party');
        if (chequeInHand) {
            triggerAndRenderOptions($('#chequeInHandDropdown'), chequeInHand.name, chequeInHand.pid, false);
        }

        $.each(data.cheque_receive_details, function (index, elem) {
            appendToTable(elem.cheque_list_number, ifNull(elem.cheque_particular, ""), elem.cheque_bank_name, ifNull(elem.cheque_invoice, ""), getFormattedDate(elem.cheque_vrdate), elem.cheque_no, parseNumber(elem.cheque_amount).toFixed(AMOUNT_ROUNDING));
        });
        calculateLowerTotal();
    };


    var getSaveObject = function () {
        const main = {};
        const details = [];

        main.id = $('#chequeReceiveIdHidden').val();
        main.vrdate = $('#current_date').val();
        main.party_id = $('#accountDropdown').val();
        main.cheque_in_hand_id = $('#chequeInHandDropdown').val();
        main.remarks = $('#accountRemarks').val();
        main.chk_date = $(chk_date).val();

        $('#purchase_table').find('tbody tr').each(function (index, elem) {
            const gridAccountDetail = {};
            gridAccountDetail.party_id = $('#accountDropdown').val();
            gridAccountDetail.cheque_in_hand_id = $('#chequeInHandDropdown').val();
            gridAccountDetail.cheque_list_number = $.trim($(elem).find('td.chequeListNumber').text());
            gridAccountDetail.cheque_particular = $.trim($(elem).find('td.particular').text());
            gridAccountDetail.cheque_bank_name = $.trim($(elem).find('td.bankName').text());
            gridAccountDetail.cheque_invoice = $.trim($(elem).find('td.invoiceNo').text());
            gridAccountDetail.cheque_vrdate = $.trim($(elem).find('td.chequeDate').text());
            gridAccountDetail.cheque_no = $.trim($(elem).find('td.chequeNumber').text());
            gridAccountDetail.cheque_amount = $.trim($(elem).find('td.amount').text());
            gridAccountDetail.is_received = 1;
            details.push(gridAccountDetail);
        });
        var data = {};
        data.main = main;
        data.details = details;
        data.id = $('#chequeReceiveIdHidden').val();
        return data;
    };

    var appendToTable = function (chequeListNumber, particular, bankName, invoiceNo, chequeDate, chequeNumber, amount) {

        const srno = $('#purchase_table tbody tr').length + 1;

        const row = `
						<tr     class = "odd:bg-white even:bg-slate-50">
						<td     class = 'py-1 px-1 text-md align-middle text-left srno' data-title='Sr#'> ${srno}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left chequeListNumber'>${chequeListNumber}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left particular'>${particular}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left bankName'>${bankName}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right invoiceNo'>${invoiceNo}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right chequeDate'>${chequeDate}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right chequeNumber'>${chequeNumber}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right amount'>${parseNumber(amount).toFixed(AMOUNT_ROUNDING)}</td>
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
        `;

        $(row).appendTo(purchase_table);
        getTableSerialNumber(purchase_table);
    };

    var calculateLowerTotal = function () {
        let gridAccounttotalAmount = 0;

        $(purchase_table).find("tbody tr").each(function (index, elem) {
            gridAccounttotalAmount += getNumText($(this).closest('tr').find('td.amount'));
        });

        $(gridAccountTotalAmount).text(parseNumber(gridAccounttotalAmount).toFixed(AMOUNT_ROUNDING));
    };

    const validateSingleProductAdd = () => {
        let hasError = false;
        let errorMessage = '';

        // remove the error class first
        $('.inputerror').removeClass('inputerror');


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

    var validateSave = function () {
        var errorFlag = false;

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!current_date.val()) {
            current_date.addClass('inputerror');
            errorFlag = true;
        }

        if (!accountDropdown.val()) {
            $('#select2-accountDropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }

        if (!chequeInHandDropdown.val()) {
            $('#select2-chequeInHandDropdown-container').parent().addClass('inputerror');
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
        getChequeReceiveViewList();
        $('#voucher_type_hidden').val('new');
    };

    var resetFields = function () {
        $('#chequeReceiveIdHidden').val('');
        $(current_date).datepicker('update', new Date());
        $(gridAccountChequeDateInput).datepicker('update', new Date());
        $(accountDropdown).val('').trigger('change.select2');
        $(chequeInHandDropdown).val('').trigger('change.select2');
        $(gridAccountParticularInput).val('');
        $(gridAccountInvoiceNoInput).val('');
        $(gridAccountBankNameInput).val('');
        $(gridAccountChequeNumberInput).val('');
        $(gridAccountAmountInput).val('');
        $(accountRemarks).val('');
        $(gridAccountChequeListNumberInput).val('');
        $(gridAccountTotalAmount).text('');
        $('#purchase_table tbody tr').remove();
        $('#purchase_tableReport tbody tr').remove();
        $('#laststockLocation_table tbody tr').remove();
        $('.inputerror').removeClass('inputerror');
    };

    let purchaseOrderViewList = undefined;
    const getChequeReceiveViewList = (chequeReceiveId = 0, fromDate = "", toDate = "") => {
        if (typeof purchaseOrderViewList !== 'undefined') {
            purchaseOrderViewList.destroy();
            $('#purchaseOrderViewListTbody').empty();
        }
        purchaseOrderViewList = $("#purchaseOrderViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/chequeReceive/getChequeReceiveViewList`,
                type: 'GET',
                data: { 'chequeReceiveId': chequeReceiveId, fromDate: fromDate, toDate: toDate },
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
                    data: "chequeReceiveVoucher",
                    name: "cheque_receives.vrnoa",
                    className: "text-left chequeReceiveVoucher"
                },
                {
                    data: "voucherDate",
                    name: "cheque_receives.vrdate",
                    className: "text-left voucherDate",
                    render: function (data, type, row) {
                        return getFormattedDate(data);
                    }
                },
                { data: "accountName", name: 'parties.name', className: "accountName" },
                { data: "remarks", name: 'cheque_receives.remarks', className: "remarks" },
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
							<a   class = "dropdown-item btnEditPrevVoucher" data-cheque_receive_id = "${row.chequeReceiveId}" href = "#"><i class = 'fa fa-edit'></i> Edit Voucher</a>

                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                <li class="dropdown-item"><a href="#" class="btnPrint" data-cheque_receive_id  ="${row.chequeReceiveId}">Print Voucher</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-cheque_receive_id  ="${row.chequeReceiveId}"> Print a4 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-cheque_receive_id  ="${row.chequeReceiveId}"> Print a4 without header </a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-cheque_receive_id  ="${row.chequeReceiveId}"> Print b5 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-cheque_receive_id  ="${row.chequeReceiveId}"> Print b5 without header </a></li>
                            </ul>

							<a   class = "dropdown-item btnDelete" data-cheque_receive_id          = "${row.chequeReceiveId}" href = "#"><i class = 'fa fa-trash'></i> Delete Voucher</a>
							<div class = "dropdown-divider"></div>
							<a   class = "dropdown-item btnPrintASEmail" data-cheque_receive_id    = "${row.chequeReceiveId}" href = "#">Send Email</a>
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
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
    };

    var Print_Voucher = function (vrnoa, paperSize, printSize, wrate = 0, isSendEmail = false) {
        try {
            const __etype = 'cheque_receives';
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
        const __etype = 'cheque_receives';
        const __vrnoa = vrnoa;
        const __pre_bal_print = ($(settings.switchPreBal).bootstrapSwitch('state') === true) ? '2' : '1';
        const __lang = $('#print_lang').val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, __pre_bal_print, paperSize, printSize, wrate, __lang, email);
    };

    const validateChequeReceiveVoucher = async (chequeListNumber) => {

        const response = await makeAjaxRequest('GET', `chequeReceive/getValidateChequeReceiveByChequeListNumber`, {
            chequeListNumber: chequeListNumber
        });
        if (response && response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: "Error", message: response.message, type: "danger" });
            return true;
        } else if (response && response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: "Warning", message: response.message, type: "warning" });
            return true;
        } else {
            return false;
        }
    }

    return {

        init: function () {
            this.bindUI();
            $('.select2').select2({
                width: 'element',
            });
            getChequeReceiveViewList();
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

            $(gridAccountChequeListNumberInput, gridAccountParticularInput, gridAccountBankNameInput, gridAccountInvoiceNoInput, gridAccountChequeDateInput, gridAccountChequeNumberInput, gridAccountAmountInput).on('keypress', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    $(btnAdd).trigger('click');
                }
            });

            $(btnAdd).on('click', function (e) {
                e.preventDefault();

                const alertMessage = validateSingleProductAdd();
                if (alertMessage) {
                    return _getAlertMessage('Error!', alertMessage, 'danger');;
                }


                const chequeListNumber = $(gridAccountChequeListNumberInput).val();
                const particular = $(gridAccountParticularInput).val();
                const bankName = $(gridAccountBankNameInput).val();
                const invoiceNo = $(gridAccountInvoiceNoInput).val();
                const chequeDate = $(gridAccountChequeDateInput).val();
                const chequeNumber = $(gridAccountChequeNumberInput).val();
                const amount = $(gridAccountAmountInput).val();

                $(gridAccountChequeListNumberInput).val('');
                $(gridAccountParticularInput).val('');
                $(gridAccountBankNameInput).val('');
                $(gridAccountInvoiceNoInput).val('');
                $(gridAccountChequeDateInput).datepicker('update', new Date());
                $(gridAccountChequeNumberInput).val('');
                $(gridAccountAmountInput).val('');

                appendToTable(chequeListNumber, particular, bankName, invoiceNo, chequeDate, chequeNumber, amount);

                $(gridAccountParticularInput).focus();
                calculateLowerTotal();
            });

            $(purchase_table).on('click', '.btnRowEdit', async function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');

                const editChequeListNumber = row.find('td.chequeListNumber').text();
                if (parseNumber(editChequeListNumber) > 0) {
                    const flg = await validateChequeReceiveVoucher(editChequeListNumber);
                    if (flg) {
                        return;
                    }
                }

                const editParticular = row.find('td.particular').text();
                const editBankName = row.find('td.bankName').text();
                const editInvoiceNo = row.find('td.invoiceNo').text();
                const editChequeDate = row.find('td.chequeDate').text();
                const editChequeNumber = row.find('td.chequeNumber').text();
                const editamount = parseNumber(row.find('td.amount').text());

                $(gridAccountChequeListNumberInput).val(editChequeListNumber);
                $(gridAccountParticularInput).val(editParticular);
                $(gridAccountBankNameInput).val(editBankName);
                $(gridAccountInvoiceNoInput).val(editInvoiceNo);
                $(gridAccountChequeDateInput).val(editChequeDate);
                $(gridAccountChequeNumberInput).val(editChequeNumber);
                $(gridAccountAmountInput).val(editamount);



                row.remove();
                calculateLowerTotal();
            });

            $(purchase_table).on('click', '.btnRowRemove', async function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');
                const editChequeListNumber = row.find('td.chequeListNumber').text();
                if (parseNumber(editChequeListNumber) > 0) {
                    const flg = await validateChequeReceiveVoucher(editChequeListNumber);
                    if (flg) {
                        return;
                    }
                }
                row.remove();
                calculateLowerTotal();
            });

            $('#purchaseOrderSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getChequeReceiveViewList();
            });
            $('#purchaseOrderFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getChequeReceiveViewList("", fromDate, toDate);
            });

            $('body').on('click', '.btnPrint', function (e) {
                const chequeReceiveId = $(this).data('cheque_receive_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(base_url + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(chequeReceiveId, settingPrintDefault, 'lg', '');
                }
            });

            $('body').on('click', '.btnPrintA4WithHeader', function (e) {
                const chequeReceiveId = $(this).data('cheque_receive_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(chequeReceiveId, 1, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintA4WithOutHeader', function (e) {
                const chequeReceiveId = $(this).data('cheque_receive_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(chequeReceiveId, 2, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintB5WithHeader', function (e) {
                const chequeReceiveId = $(this).data('cheque_receive_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(chequeReceiveId, 3, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintB5WithOutHeader', function (e) {
                const chequeReceiveId = $(this).data('cheque_receive_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(chequeReceiveId, 4, 'lg', "");
                }
            });

            $('body').on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                const chequeReceiveId = parseNumber($(this).data('cheque_receive_id'));
                fetch(chequeReceiveId);
                $('a[href="#Main"]').trigger('click');
            });

            $('body').on('click', '.btnPrintASEmail', function (e) {
                const chequeReceiveId = $(this).data('cheque_receive_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                getSendMail(chequeReceiveId, settingPrintDefault, 'lg', '', true);
            });

            $('body').on('click', '.btnDelete', function (e) {
                const chequeReceiveId = $(this).data('cheque_receive_id');
                e.preventDefault();
                if (chequeReceiveId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', function (result) {
                        if (result) {
                            deleteVoucher(chequeReceiveId);
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
    };

};

var chequeReceive = new ChequeReceive();
chequeReceive.init();

$(function () {

    new DynamicOption("#accountDropdown", {
        requestedUrl: dropdownOptions.getAccountDetailAll,
        placeholderText: "Choose Account",
        allowClear: true,
    });

    new DynamicOption("#chequeInHandDropdown", {
        requestedUrl: dropdownOptions.getBankAccountDetailAll,
        placeholderText: "Cheque In Hand",
        allowClear: true,
    });
});
