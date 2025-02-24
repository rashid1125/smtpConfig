import { baseConfiguration } from "../../../../js/components/ConfigurationManager.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { ifNull, setFinancialYearDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek } from "../commonFunctions/CommonFunction.js";
var Jv = function () {

    var settings = {
        switchPreBal: $('#switchPreBal')
    };

    const currentDate = $('#current_date');
    const chk_date = $('#chk_date_journal');
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
    const accountNetDifference = $('#accountNetDifference');

    var save = function (purchaseData) {
        const main = purchaseData.main;
        const details = purchaseData.details;
        general.disableSave();
        $.ajax({
            url: `${base_url}/jv/save`,
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
            url: base_url + '/jv/delete',
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

    var fetch = function (journalId) {
        $.ajax({
            url: `${base_url}/jv/fetch`,
            type: 'GET',
            data: { 'journalId': journalId },
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
        $('#journalIdHidden').val(data.id);

        populateDateValue('current_date', data.vrdate);
        populateDateValue('chk_date', data.vrdate);
        $(accountNetDebit).val(data.net_debit);
        $(accountNetCredit).val(data.net_credit);

        $.each(data.journal_details, function (index, elem) {
            appendToTable(elem.party_id, elem.party.name, ifNull(elem.remarks, ""), ifNull(elem.invoice_no, ""), parseNumber(elem.debit).toFixed(AMOUNT_ROUNDING), parseNumber(elem.credit).toFixed(AMOUNT_ROUNDING));
        });
        calculateLowerTotal();
    }

    var getSaveObject = function () {
        const main = {};
        const details = [];

        main.id = $('#journalIdHidden').val();
        main.vrdate = $('#current_date').val();
        main.chk_date = $(chk_date).val();

        $('#purchase_table').find('tbody tr').each(function (index, elem) {
            const gridAccountDetail = {};

            gridAccountDetail.party_id = $.trim($(elem).find('td.accountName').data('account_id'));
            gridAccountDetail.remarks = $.trim($(elem).find('td.remarks').text());
            gridAccountDetail.invoice_no = $.trim($(elem).find('td.invoiceNo').text());
            gridAccountDetail.debit = $.trim($(elem).find('td.debit').text());
            gridAccountDetail.credit = $.trim($(elem).find('td.credit').text());

            details.push(gridAccountDetail);
        });
        var data = {};
        data.main = main;
        data.details = details;
        data.id = $('#journalIdHidden').val();
        return data;
    };

    var appendToTable = function (accountId, accountName, remarks, invoiceNo, debit, credit) {

        const srno = $('#purchase_table tbody tr').length + 1;

        const row = `
        <tr class = "odd:bg-white even:bg-slate-50">
        <td class = 'py-1 px-1 text-md align-middle text-left srno' data-title= 'Sr#'> ${srno}</td>
        <td class = 'py-1 px-1 text-md align-middle text-left accountName' data-account_id = '${accountId}'">${accountName}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-left remarks'>${remarks}</td>
						<td     class = 'py-1 px-1 text-md align-middle text-right invoiceNo'>${invoiceNo}</td>
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
        getJournalViewList();
        $('#voucher_type_hidden').val('new');
    };

    var resetFields = function () {
        $('#journalIdHidden').val('');
        $(currentDate).datepicker('update', new Date());
        $(gridAccountNameDropdown).val('').trigger('change.select2');
        $(gridAccountRemarks).val('');
        $(gridAccountInvoiceNo).val('');
        $(gridAccountDebit).val('');
        $(gridAccountCredit).val('');
        $(accountNetDebit).val('');
        $(accountNetCredit).val('');
        $(accountNetDifference).val('');
        $(gridAccountTotalDebit).text('');
        $(gridAccountTotalCredit).text('');
        $('#purchase_table tbody tr').remove();
        $('#purchase_tableReport tbody tr').remove();
        $('#laststockLocation_table tbody tr').remove();
        $('.inputerror').removeClass('inputerror');
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

        const totalDifference = gridAccounttotalDebit - gridAccounttotalCredit;
        $(accountNetDifference).val(parseNumber(totalDifference).toFixed(AMOUNT_ROUNDING))
    };

    let purchaseOrderViewList = undefined;
    const getJournalViewList = (journalId = 0, fromDate = "", toDate = "") => {
        if (typeof purchaseOrderViewList !== 'undefined') {
            purchaseOrderViewList.destroy();
            $('#purchaseOrderViewListTbody').empty();
        }
        purchaseOrderViewList = $("#purchaseOrderViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/jv/getJournalViewList`,
                type: 'GET',
                data: { 'journalId': journalId, fromDate: fromDate, toDate: toDate },
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
                    data: "journalVoucher",
                    name: "sm.vrnoa",
                    className: "text-left journalVoucher"
                },
                {
                    data: "voucherDate",
                    name: "sm.vrdate",
                    className: "text-left voucherDate",
                    render: function (data, type, row) {
                        return getFormattedDate(data);
                    }
                },
                { data: "accountName", name: 'parties.name', className: "accountNamey" },
                {
                    data: "net_debit", name: 'journal_details.debit', className: "text-right net_debit", render: function (data, type, row) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: "net_credit", name: 'journal_details.debit', className: "text-right net_credit", render: function (data, type, row) {
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
							<a   class = "dropdown-item btnEditPrevVoucher" data-journal_id = "${row.journalId}" href = "#"><i class = 'fa fa-edit'></i> Edit Voucher</a>

                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                <li class="dropdown-item"><a href="#" class="btnPrint" data-journal_id  ="${row.journalId}">Print Voucher</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-journal_id  ="${row.journalId}"> Print a4 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-journal_id  ="${row.journalId}"> Print a4 without header </a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-journal_id  ="${row.journalId}"> Print b5 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-journal_id  ="${row.journalId}"> Print b5 without header </a></li>
                            </ul>

							<a   class = "dropdown-item btnDelete" data-journal_id          = "${row.journalId}" href = "#"><i class = 'fa fa-trash'></i> Delete Voucher</a>
							<div class = "dropdown-divider"></div>
							<a   class = "dropdown-item btnPrintASEmail" data-journal_id    = "${row.journalId}" href = "#">Send Email</a>
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
            const __etype = 'journals';
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
        const __etype = 'journals';
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
            getJournalViewList();
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

            $(gridAccountRemarks, gridAccountInvoiceNo, gridAccountDebit, gridAccountCredit).on('keypress', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    $(btnAdd).trigger('click');
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
                const invoiceNo = $(gridAccountInvoiceNo).val();
                const debit = $(gridAccountDebit).val();
                const credit = $(gridAccountCredit).val();

                var IsAlreadyExsit = getTableRowIsAlreadyExsit('#purchase_table', accountId);
                if (IsAlreadyExsit)
                    return alert('Already Exist in the Following Table!!');

                $(gridAccountNameDropdown).val('').trigger('change.select2');
                $(gridAccountRemarks).val('');
                $(gridAccountInvoiceNo).val('');
                $(gridAccountDebit).val('');
                $(gridAccountCredit).val('');

                appendToTable(accountId, accountName, remarks, invoiceNo, debit, credit);

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
                const editDebit = parseNumber(row.find('td.debit').text());
                const editCredit = parseNumber(row.find('td.credit').text());

                triggerAndRenderOptions(gridAccountNameDropdown, editAccountName, editAccountId, false);
                $(gridAccountRemarks).val(editRemarks);
                $(gridAccountInvoiceNo).val(editInvoiceNo);
                $(gridAccountDebit).val(editDebit);
                $(gridAccountCredit).val(editCredit);

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
                getJournalViewList();
            });
            $('#purchaseOrderFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getJournalViewList("", fromDate, toDate);
            });

            $('body').on('click', '.btnPrint', function (e) {
                const journalId = $(this).data('journal_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(base_url + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(journalId, settingPrintDefault, 'lg', '');
                }
            });

            $('body').on('click', '.btnPrintA4WithHeader', function (e) {
                const journalId = $(this).data('journal_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(journalId, 1, 'lg',"");
                }
            });
            $('body').on('click', '.btnPrintA4WithOutHeader', function (e) {
                const journalId = $(this).data('journal_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(journalId, 2, 'lg',"");
                }
            });
            $('body').on('click', '.btnPrintB5WithHeader', function (e) {
                const journalId = $(this).data('journal_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(journalId, 3, 'lg',"");
                }
            });
            $('body').on('click', '.btnPrintB5WithOutHeader', function (e) {
                const journalId = $(this).data('journal_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(journalId, 4, 'lg',"");
                }
            });


            $('body').on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                const journalId = parseNumber($(this).data('journal_id'));
                fetch(journalId);
                $('a[href="#Main"]').trigger('click');
            });

            $('body').on('click', '.btnPrintASEmail', function (e) {
                const journalId = $(this).data('journal_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                getSendMail(journalId, settingPrintDefault, 'lg', '', true);
            });

            $('body').on('click', '.btnDelete', function (e) {
                const journalId = $(this).data('journal_id');
                e.preventDefault();
                if (journalId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', function (result) {
                        if (result) {
                            deleteVoucher(journalId);
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
                    if ($(accountNetDifference).val() == 0) {
                        var saveObj = getSaveObject();
                        save(saveObj);
                    } else {
                        _getAlertMessage('Error!', "The Total of Debit and Credit Must be equal...", 'danger');
                    }
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

var jv = new Jv();
jv.init();

// Corrected function to match the HTML ID
$(function () {
    new DynamicOption("#gridAccountNameDropdown", {
        requestedUrl: dropdownOptions.getAccountDetailAll,
        placeholderText: "Choose Account",
        allowClear: true,
    });
});
