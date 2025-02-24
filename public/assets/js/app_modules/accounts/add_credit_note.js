import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { appendSelect2ValueIfDataExists, ifNull, setFinancialYearDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek } from "../commonFunctions/CommonFunction.js";


const CreditNoteVoucher = function () {

    var settings = {
        switchPreBal: $('#switchPreBal')
    };

    const debitAccountDropdown = $('#debitAccountDropdown');
    const current_date = $('#current_date');
    const chk_date = $('#credit_note_chk_date');
    const creditAccountDropdown = $('#creditAccountDropdown');
    const accountRemarks = $('#accountRemarks');

    const gridAccountParticularInput = $('#gridAccountParticularInput');
    const gridAccountInvoiceNoInput = $('#gridAccountInvoiceNoInput');
    const gridAccountAmountInput = $('#gridAccountAmountInput');

    const btnAdd = $('#btnAdd');
    const purchase_table = $('#purchase_table');
    const btnReset = $('.btnReset');
    const btnSave = $('.btnSave');
    const gridAccountTotalAmount = $('.gridAccountTotalAmount');
    const accountModuleSettings = _accountModuleSettings;

    var save = function (purchaseData) {
        const main = purchaseData.main;
        const details = purchaseData.details;
        general.disableSave();
        $.ajax({
            url: `${base_url}/creditNote/save`,
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
            url: base_url + '/creditNote/delete',
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

    var fetch = function (creditNoteId) {
        $.ajax({
            url: `${base_url}/creditNote/fetch`,
            type: 'GET',
            data: { 'creditNoteId': creditNoteId },
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

    var populateData = async function (data) {
        $('#creditNoteIdHidden').val(data.id);
        $(accountRemarks).val(data.remarks);

        populateDateValue('current_date', data.vrdate);
        populateDateValue('chk_date', data.vrdate);

        appendSelect2ValueIfDataExists("debitAccountDropdown", "debit_party", "pid", "name", data,);
        appendSelect2ValueIfDataExists("creditAccountDropdown", "credit_party", "pid", "name", data,);

        $.each(data.credit_note_details, function (index, elem) {
            appendToTable(ifNull(elem.particular, ""), ifNull(elem.invoice, ""), parseNumber(elem.amount).toFixed(AMOUNT_ROUNDING));
        });
        calculateLowerTotal();
    };


    var getSaveObject = function () {
        const main = {};
        const details = [];

        main.id = $('#creditNoteIdHidden').val();
        main.vrdate = $('#current_date').val();
        main.debit_account_id = $('#debitAccountDropdown').val();
        main.credit_account_id = $('#creditAccountDropdown').val();
        main.remarks = $('#accountRemarks').val();
        main.chk_date = $(chk_date).val();

        $('#purchase_table').find('tbody tr').each(function (index, elem) {
            const gridAccountDetail = {};

            gridAccountDetail.particular = $.trim($(elem).find('td.particular').text());
            gridAccountDetail.invoice = $.trim($(elem).find('td.invoiceNo').text());
            gridAccountDetail.amount = $.trim($(elem).find('td.amount').text());

            details.push(gridAccountDetail);
        });
        var data = {};
        data.main = main;
        data.details = details;
        data.id = $('#creditNoteIdHidden').val();
        return data;
    };

    var appendToTable = function (particular, invoiceNo, amount) {

        const srno = $('#purchase_table tbody tr').length + 1;

        const row = `
						<tr     class = "odd:bg-white even:bg-slate-50">
						<td     class = 'py-1 px-1 text-md align-middle text-left srno' data-title='Sr#'> ${srno}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left particular'>${particular}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left invoiceNo'>${invoiceNo}</td>
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

        if (!$(gridAccountParticularInput).val()) {
            $(gridAccountParticularInput).addClass('inputerror');
            errorMessage += `Particular is required <br />`;
            hasError = true;
        }

        if (!$(gridAccountAmountInput).val()) {
            $(gridAccountAmountInput).addClass('inputerror');
            errorMessage += `Amount is required <br />`;
            hasError = true;
        } else if ($(gridAccountAmountInput).val() <= 0) {
            $(gridAccountAmountInput).addClass('inputerror');
            errorMessage += `Amount must be greater than 0 <br />`;
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

        if (!debitAccountDropdown.val()) {
            $('#select2-debitAccountDropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }

        if (!creditAccountDropdown.val()) {
            $('#select2-creditAccountDropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    };

    var getNumText = function (el) {
        return isNaN(parseFloat(el.text())) ? 0 : parseFloat(el.text());
    };

    var resetVoucher = function () {
        resetFields();
        getCreditNoteDataTable();
        $('#voucher_type_hidden').val('new');
    };

    var resetFields = function () {
        $('#creditNoteIdHidden').val('');
        $(current_date).datepicker('update', new Date());
        $(debitAccountDropdown).val('').trigger('change.select2');
        $(creditAccountDropdown).val('').trigger('change.select2');
        $(gridAccountParticularInput).val('');
        $(gridAccountInvoiceNoInput).val('');
        $(gridAccountAmountInput).val('');
        $(accountRemarks).val('');
        $(gridAccountTotalAmount).text('');
        $('#purchase_table tbody tr').remove();
        $('#purchase_tableReport tbody tr').remove();
        $('#laststockLocation_table tbody tr').remove();
        $('.inputerror').removeClass('inputerror');
    };

    let purchaseOrderViewList = undefined;
    const getCreditNoteDataTable = (creditNoteId = 0, fromDate = "", toDate = "") => {
        if (typeof purchaseOrderViewList !== 'undefined') {
            purchaseOrderViewList.destroy();
            $('#crediNoteViewListTbody').empty();
        }
        purchaseOrderViewList = $("#crediNoteViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/creditNote/getCreditNoteDataTable`,
                type: 'GET',
                data: { 'creditNoteId': creditNoteId, fromDate: fromDate, toDate: toDate },
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
                    data: "vrnoa",
                    name: "credit_notes.vrnoa",
                    className: "text-left creditNoteVoucher"
                },
                {
                    data: "vrdate",
                    name: "credit_notes.vrdate",
                    className: "text-left voucherDate",
                    render: function (data, type, row) {
                        return getFormattedDate(data);
                    }
                },
                { data: "debit_party.name", name: 'debitParty.name', className: "debitAccountName" },
                { data: "credit_party.name", name: 'creditParty.name', className: "creditAccountName" },
                { data: "remarks", name: 'credit_notes.remarks', className: "remarks" },
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
							<a   class = "dropdown-item btnEditPrevVoucher" data-credit_note_id = "${row.id}" href = "#"><i class = 'fa fa-edit'></i> Edit Voucher</a>
							<a   class = "dropdown-item btnPrint"  data-credit_note_id          = "${row.id}" href = "#"><i class = 'fa fa-print'></i> Print Voucher</a>
							<a   class = "dropdown-item btnDelete" data-credit_note_id          = "${row.id}" href = "#"><i class = 'fa fa-trash'></i> Delete Voucher</a>
							<div class = "dropdown-divider"></div>
							<a   class = "dropdown-item btnPrintASEmail" data-credit_note_id    = "${row.id}" href = "#">Send Email</a>
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
            const __etype = 'credit_notes';
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
        const __etype = 'credit_notes';
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
            getCreditNoteDataTable();
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

            $(gridAccountParticularInput, gridAccountInvoiceNoInput, gridAccountAmountInput).on('keypress', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    $(btnAdd).trigger('click');
                }
            });

            $('#debitAccountDropdown').on('change', function () {
                if (parseNumber(accountModuleSettings.show_account_information) == 1) {
                    const accountId = $(this).val();
                    const voucherDate = $('#current_date').val();
                    getAccountBalanced(accountId, voucherDate, "debit");
                }
            });
            $('#creditAccountDropdown').on('change', function () {
                if (parseNumber(accountModuleSettings.show_account_information) == 1) {
                    const accountId = $(this).val();
                    const voucherDate = $('#current_date').val();
                    getAccountBalanced(accountId, voucherDate, "credit");
                }
            });

            $(btnAdd).on('click', function (e) {
                e.preventDefault();

                const alertMessage = validateSingleProductAdd();
                if (alertMessage) {
                    return _getAlertMessage('Error!', alertMessage, 'danger');;
                }

                const particular = $(gridAccountParticularInput).val();
                const invoiceNo = $(gridAccountInvoiceNoInput).val();
                const amount = $(gridAccountAmountInput).val();

                $(gridAccountParticularInput).val('');
                $(gridAccountInvoiceNoInput).val('');
                $(gridAccountAmountInput).val('');

                appendToTable(particular, invoiceNo, amount);

                $(gridAccountParticularInput).focus();
                calculateLowerTotal();
            });

            $(purchase_table).on('click', '.btnRowEdit', function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');

                const editParticular = row.find('td.particular').text();
                const editInvoiceNo = row.find('td.invoiceNo').text();
                const editamount = parseNumber(row.find('td.amount').text());

                $(gridAccountParticularInput).val(editParticular);
                $(gridAccountInvoiceNoInput).val(editInvoiceNo);
                $(gridAccountAmountInput).val(editamount);

                row.remove();
                calculateLowerTotal();
            });

            $(purchase_table).on('click', '.btnRowRemove', function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');
                row.remove();
                calculateLowerTotal();
            });

            $('#purchaseOrderSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getCreditNoteDataTable();
            });
            $('#purchaseOrderFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getCreditNoteDataTable("", fromDate, toDate);
            });

            $('body').on('click', '.btnPrint', function (e) {
                const creditNoteId = $(this).data('credit_note_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(base_url + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(creditNoteId, settingPrintDefault, 'lg', '');
                }
            });

            $('body').on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                const creditNoteId = parseNumber($(this).data('credit_note_id'));
                fetch(creditNoteId);
                $('a[href="#Main"]').trigger('click');
            });

            $('body').on('click', '.btnPrintASEmail', function (e) {
                const creditNoteId = $(this).data('credit_note_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                getSendMail(creditNoteId, settingPrintDefault, 'lg', '', true);
            });

            $('body').on('click', '.btnDelete', function (e) {
                const creditNoteId = $(this).data('credit_note_id');
                e.preventDefault();
                if (creditNoteId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', function (result) {
                        if (result) {
                            deleteVoucher(creditNoteId);
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

var creditNoteVoucher = new CreditNoteVoucher();
creditNoteVoucher.init();

$(function () {

    new DynamicOption("#debitAccountDropdown", {
        requestedUrl: dropdownOptions.getAccountDetailAll,
        placeholderText: "Choose Debit Account",
        allowClear: true,
    });

    new DynamicOption("#creditAccountDropdown", {
        requestedUrl: dropdownOptions.getAccountDetailAll,
        placeholderText: "Choose Credit Account",
        allowClear: true,
    });
});
