import { baseConfiguration } from "../../../../js/components/ConfigurationManager.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { ifNull, setFinancialYearDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek } from "../commonFunctions/CommonFunction.js";
var CashReceive = function () {

    var settings = {
        switchPreBal: $('#switchPreBal')
    };

    const currentDate = $('#current_date');
    const chk_date = $('#chk_date_cash_receive');
    const gridAccountNameDropdown = $('#gridAccountNameDropdown');
    const gridAccountRemarks = $('#gridAccountRemarks');
    const gridAccountInvoiceNo = $('#gridAccountInvoiceNo');
    const gridAccountAmount = $('#gridAccountAmount');
    const btnReset = $('.btnReset');
    const btnSave = $('.btnSave');
    const btnAdd = $('#btnAdd');
    const purchaseTable = $('#purchase_table');
    const gridAccountTotalAmount = $('.gridAccountTotalAmount');
    const accountCashdropdown = $('#accountCashdropdown');
    const accountNetAmount = $('#accountNetAmount');


    var save = function (purchaseData) {
        const main = purchaseData.main;
        const details = purchaseData.details;
        general.disableSave();
        $.ajax({
            url: `${base_url}/cashreceive/save`,
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
            url: base_url + '/cashreceive/delete',
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

    var fetch = function (cashReceiveId) {
        $.ajax({
            url: `${base_url}/cashreceive/fetch`,
            type: 'GET',
            data: { 'cashReceiveId': cashReceiveId },
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
        $('#cashReceiveIdHidden').val(data.id);

        populateDateValue('current_date', data.vrdate);
        populateDateValue('chk_date', data.vrdate);
        const party = handleObjectName(data, 'party');
        if (party) {
            triggerAndRenderOptions($('#accountCashdropdown'), party.name, party.pid, false);
        }
        $(accountNetAmount).val(data.net_amount);

        $.each(data.cash_receive_details, function (index, elem) {
            appendToTable(elem.party_id, elem.party.name, ifNull(elem.remarks, ""), ifNull(elem.invoice_no, ""), parseFloat(elem.amount).toFixed(AMOUNT_ROUNDING));
        });
        calculateLowerTotal();
    }

    var getSaveObject = function () {
        const main = {};
        const details = [];

        main.id = $('#cashReceiveIdHidden').val();
        main.vrdate = $('#current_date').val();
        main.party_id = $('#accountCashdropdown').val();
        main.net_amount = $('#accountNetAmount').val();
        main.chk_date = $(chk_date).val();

        $('#purchase_table').find('tbody tr').each(function (index, elem) {
            const gridAccountDetail = {};

            gridAccountDetail.party_id = $.trim($(elem).find('td.accountName').data('account_id'));
            gridAccountDetail.remarks = $.trim($(elem).find('td.remarks').text());
            gridAccountDetail.invoice_no = $.trim($(elem).find('td.invoiceNo').text());
            gridAccountDetail.amount = $.trim($(elem).find('td.amount').text());

            details.push(gridAccountDetail);
        });
        var data = {};
        data.main = main;
        data.details = details;
        data.id = $('#cashReceiveIdHidden').val();
        return data;
    };


    var appendToTable = function (accountId, accountName, remarks, invoiceNo, amount) {

        const srno = $('#purchase_table tbody tr').length + 1;

        const row = `
        <tr class = "odd:bg-white even:bg-slate-50">
        <td class = 'py-1 px-1 text-md align-middle text-left srno' data-title= 'Sr#'> ${srno}</td>
        <td class = 'py-1 px-1 text-md align-middle text-left accountName' data-account_id = '${accountId}'">${accountName}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left remarks'>${remarks}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right invoiceNo'>${invoiceNo}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right amount'>${parseNumber(amount).toFixed(AMOUNT_ROUNDING)}</td>
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

    const validateSingleProductAdd = () => {
        let hasError = false;
        let errorMessage = '';

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!$(gridAccountNameDropdown).val()) {
            $('#select2-gridAccountNameDropdown-container').parent().addClass('inputerror');
            errorMessage += `Account Name is required <br />`;
            hasError = true;
        }

        if (!$(gridAccountAmount).val()) {
            $(gridAccountAmount).addClass('inputerror');
            errorMessage += `Amount is required <br />`;
            hasError = true;
        } else if ($(gridAccountAmount).val() <= 0) {
            $(gridAccountAmount).addClass('inputerror');
            errorMessage += `Amount must be Greater than 0 <br />`;
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

        if (!accountCashdropdown.val()) {
            $('#select2-accountCashdropdown-container').parent().addClass('inputerror');
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
        getCashReceiveViewList();
        $('#voucher_type_hidden').val('new');
    };

    var resetFields = function () {
        $('#cashReceiveIdHidden').val('');
        $(currentDate).datepicker('update', new Date());
        $(gridAccountNameDropdown).val('').trigger('change.select2');
        $(gridAccountRemarks).val('');
        $(gridAccountInvoiceNo).val('');
        $(gridAccountAmount).val('');
        $(accountNetAmount).val('');
        $(gridAccountTotalAmount).text('');
        triggerAndRenderOptions($('#accountCashdropdown'), baseConfiguration.cash_account.name, baseConfiguration.cash_account.pid);
        $('#purchase_table tbody tr').remove();
        $('#purchase_tableReport tbody tr').remove();
        $('#laststockLocation_table tbody tr').remove();
        $('.inputerror').removeClass('inputerror');
    }

    var calculateLowerTotal = function () {
        let gridAccounttotalAmount = 0;

        $(purchaseTable).find("tbody tr").each(function (index, elem) {
            gridAccounttotalAmount += getNumText($(this).closest('tr').find('td.amount'));
        });

        $(gridAccountTotalAmount).text(parseNumber(gridAccounttotalAmount).toFixed(AMOUNT_ROUNDING));

        $(accountNetAmount).val(gridAccounttotalAmount);
    }

    let purchaseOrderViewList = undefined;
    const getCashReceiveViewList = (cashReceiveId = 0, fromDate = "", toDate = "") => {
        if (typeof purchaseOrderViewList !== 'undefined') {
            purchaseOrderViewList.destroy();
            $('#purchaseOrderViewListTbody').empty();
        }
        purchaseOrderViewList = $("#purchaseOrderViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/cashreceive/getCashReceiveViewList`,
                type: 'GET',
                data: { 'cashReceiveId': cashReceiveId, fromDate: fromDate, toDate: toDate },
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
                    data: "cash_receive_main.vrnoa",
                    name: "cashReceiveMain.vrnoa",
                    className: "text-left cashReceiveVoucher"
                },
                {
                    data: "cash_receive_main.vrdate",
                    name: "cashReceiveMain.vrdate",
                    className: "text-left voucherDate",
                    render: function (data, type, row) {
                        return getFormattedDate(data);
                    }
                },
                { data: "party.name", name: 'party.name', className: "supplierName" },
                {
                    data: "amount", name: 'amount', className: "text-right amount", render: function (data, type, row) {
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
							<a   class = "dropdown-item btnEditPrevVoucher" data-cash_receive_id = "${row.cash_receive_main.id}" href = "#"><i class = 'fa fa-edit'></i> Edit Voucher</a>
                            
                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                <li class="dropdown-item"><a href="#" class="btnPrint" data-cash_receive_id   ="${row.cash_receive_main.id}">Print Voucher</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-cash_receive_id   ="${row.cash_receive_main.id}"> Print a4 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-cash_receive_id   ="${row.cash_receive_main.id}"> Print a4 without header </a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-cash_receive_id   ="${row.cash_receive_main.id}"> Print b5 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-cash_receive_id   ="${row.cash_receive_main.id}"> Print b5 without header </a></li>
                            </ul>

							<a   class = "dropdown-item btnDelete" data-cash_receive_id          = "${row.cash_receive_main.id}" href = "#"><i class = 'fa fa-trash'></i> Delete Voucher</a>
							<div class = "dropdown-divider"></div>
							<a   class = "dropdown-item btnPrintASEmail" data-cash_receive_id    = "${row.cash_receive_main.id}" href = "#">Send Email</a>
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
            const __etype = 'cash_receives';
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
        const __etype = 'cash_receives';
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
            getCashReceiveViewList();
            triggerAndRenderOptions($('#accountCashdropdown'), baseConfiguration.cash_account.name, baseConfiguration.cash_account.pid);
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

            $(gridAccountRemarks, gridAccountInvoiceNo, gridAccountAmount).on('keypress', function (e) {
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

            $(btnAdd).on('click', function (e) {
                e.preventDefault();

                const alertMessage = validateSingleProductAdd();
                if (alertMessage) {
                    return _getAlertMessage('Error!', alertMessage, 'danger');;
                }

                const accountId = parseNumber($(gridAccountNameDropdown).val());
                const accountName = $.trim($(gridAccountNameDropdown).find('option:selected').text());
                const remarks = $(gridAccountRemarks).val();
                const invoiceNo = $(gridAccountInvoiceNo).val();
                const amount = $(gridAccountAmount).val();

                var IsAlreadyExsit = getTableRowIsAlreadyExsit('#purchase_table', accountId);
                if (IsAlreadyExsit)
                    return alert('Already Exist in the Following Table!!');

                $(gridAccountNameDropdown).val('').trigger('change.select2');
                $(gridAccountRemarks).val('');
                $(gridAccountInvoiceNo).val('');
                $(gridAccountAmount).val('');

                appendToTable(accountId, accountName, remarks, invoiceNo, amount);

                $(gridAccountNameDropdown).focus();
                calculateLowerTotal();
            });

            $(purchaseTable).on('click', '.btnRowEdit', function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');

                const editAccountId = row.find('td.accountName').data('account_id');
                const editAccountName = row.find('td.accountName').clone().children('span').remove().end().text();
                const editRemarks = row.find('td.remarks').text();
                const editInvoiceNo = row.find('td.invoiceNo').text();
                const editAmount = parseNumber(row.find('td.amount').text());

                triggerAndRenderOptions(gridAccountNameDropdown, editAccountName, editAccountId, false);
                $(gridAccountRemarks).val(editRemarks);
                $(gridAccountInvoiceNo).val(editInvoiceNo);
                $(gridAccountAmount).val(editAmount);

                row.remove();
                calculateLowerTotal();
            });

            $('#purchaseOrderSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getCashReceiveViewList();
            });
            $('#purchaseOrderFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getCashReceiveViewList("", fromDate, toDate);
            });

            $('body').on('click', '.btnPrint', function (e) {
                const cashReceiveId = $(this).data('cash_receive_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(base_url + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(cashReceiveId, settingPrintDefault, 'lg', '');
                }
            });

            $('body').on('click', '.btnPrintA4WithHeader', function (e) {
                const cashReceiveId = $(this).data('cash_receive_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(cashReceiveId, 1, 'lg',"");
                }
            });
            $('body').on('click', '.btnPrintA4WithOutHeader', function (e) {
                const cashReceiveId = $(this).data('cash_receive_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(cashReceiveId, 2, 'lg',"");
                }
            });
            $('body').on('click', '.btnPrintB5WithHeader', function (e) {
                const cashReceiveId = $(this).data('cash_receive_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(cashReceiveId, 3, 'lg',"");
                }
            });
            $('body').on('click', '.btnPrintB5WithOutHeader', function (e) {
                const cashReceiveId = $(this).data('cash_receive_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(cashReceiveId, 4, 'lg',"");
                }
            });

            $('body').on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                const cashReceiveId = parseNumber($(this).data('cash_receive_id'));
                fetch(cashReceiveId);
                $('a[href="#Main"]').trigger('click');
            });

            $('body').on('click', '.btnPrintASEmail', function (e) {
                const cashReceiveId = $(this).data('cash_receive_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                getSendMail(cashReceiveId, settingPrintDefault, 'lg', '', true);
            });

            $('body').on('click', '.btnDelete', function (e) {
                const cashReceiveId = $(this).data('cash_receive_id');
                e.preventDefault();
                if (cashReceiveId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', function (result) {
                        if (result) {
                            deleteVoucher(cashReceiveId);
                        }
                    });
                }
            });

            $(purchaseTable).on('click', '.btnRowRemove', function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');
                row.remove();
                calculateLowerTotal();
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

var cashReceive = new CashReceive();
cashReceive.init();


// Corrected function to match the HTML ID
$(function () {
    new DynamicOption("#gridAccountNameDropdown", {
        requestedUrl: dropdownOptions.getAccountDetailAll,
        placeholderText: "Choose Account",
        allowClear: true,
    });

    new DynamicOption("#accountCashdropdown", {
        requestedUrl: dropdownOptions.getCashAccountDetailAll,
        placeholderText: "Choose Cash Account",
        allowClear: true,
    });
});
