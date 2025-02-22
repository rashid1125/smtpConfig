import { getPendingChequeInHand } from "../commonFunctions/TableListViwes.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { ifNull, setFinancialYearDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek } from "../commonFunctions/CommonFunction.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";

var ChequeIssue = function () {

    var settings = {
        switchPreBal: $('#switchPreBal')
    };

    const btnReset = $('.btnReset');
    const btnSave = $('.btnSave');
    const accountDropdown = $('#accountDropdown');
    const current_date = $('#current_date');
    const chk_date = $('#cheque_issue_chk_date');
    const accountRemarks = $('#accountRemarks');
    const purchase_table = $('#purchase_table');
    const gridAccountTotalAmount = $('.gridAccountTotalAmount');
    const accountModuleSettings = _accountModuleSettings;

    var save = function (purchaseData) {
        const main = purchaseData.main;
        const details = purchaseData.details;
        general.disableSave();
        $.ajax({
            url: `${base_url}/chequeIssue/save`,
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
            url: `${base_url}/chequeIssue/delete`,
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

    var fetch = function (chequeIssueId) {
        $.ajax({
            url: `${base_url}/chequeIssue/fetch`,
            type: 'GET',
            data: { 'chequeIssueId': chequeIssueId },
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
        $('#chequeIssueIdHidden').val(data.id);
        $('input[name="cheque_vrtype"]').filter('[value="' + data.cheque_vrtype + '"]').prop('checked', true);
        $('input[name="cheque_vrtype"]').prop('disabled', true);
        $(accountRemarks).val(data.remarks);

        const party = handleObjectName(data, 'party');
        if (party) {
            triggerAndRenderOptions($(accountDropdown), party.name, party.pid, false);
            if (data.cheque_vrtype === "chequeReturn") {
                $('#accountDropdown').prop('disabled', true);
            };
        }

        populateDateValue('current_date', data.vrdate);
        populateDateValue('chk_date', data.vrdate);


        $.each(data.cheque_issue_details, function (index, elem) {
            appendToTable(elem.cheque_list_number, elem.cheque_in_hand_id, elem.cheque_in_hand_party['name'], getFormattedDate(elem.cheque_vrdate), elem.cheque_no, elem.cheque_bank_name, parseFloat(elem.cheque_amount).toFixed(AMOUNT_ROUNDING));
        });
        calculateLowerTotal();
    }
    const getValidateAccountName = () => {
        var errorFlag = false;

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!accountDropdown.val()) {
            $('#select2-accountDropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    }

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

        return errorFlag;
    };

    var appendToTable = function (chequeListNumber, chequeInHandId, chequeInHandName, chequeDate, chequeNumber, bankName, amount) {
        const table = $('#purchase_table tbody');
        const srno = table.find('tr').length + 1;
        const amountFormatted = parseFloat(amount).toFixed(2);
        const row = `
            <tr class="table-row">
                <td class="py-1 px-1 text-md align-middle srno">${srno}</td>
                <td class="py-1 px-1 text-md align-middle chequeListNumber">${chequeListNumber}</td>
                <td class="py-1 px-1 text-md align-middle chequeInHandName" data-cheque_in_hand_id="${chequeInHandId}">${chequeInHandName}</td>
                <td class="py-1 px-1 text-md align-middle chequeDate">${chequeDate}</td>
                <td class="py-1 px-1 text-md align-middle chequeNumber">${chequeNumber}</td>
                <td class="py-1 px-1 text-md align-middle bankName">${bankName}</td>
                <td class="py-1 px-1 text-md align-middle text-right amount">${amountFormatted}</td>
                <td class="py-1 px-1 text-md align-middle text-right">
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-primary dropdown-toggle" data-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div class="dropdown-menu">
                            <button type="button" class="dropdown-item btnRowRemove">
                                <i class="fa fa-trash-alt"></i> Remove
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        `;

        $(row).appendTo(table);
        getTableSerialNumber('#purchase_table'); // Assuming this function recalculates or updates serial numbers
    };


    var getSaveObject = function () {
        const main = {};
        const details = [];

        main.id = $('#chequeIssueIdHidden').val();
        main.vrdate = $('#current_date').val();
        main.chk_date = $('#cheque_issue_chk_date').val();
        main.party_id = $('#accountDropdown').val();
        main.remarks = $('#accountRemarks').val();
        main.cheque_vrtype = $('input[name="cheque_vrtype"]:checked').val();


        $('#purchase_table').find('tbody tr').each(function (index, elem) {
            const gridAccountDetail = {};
            gridAccountDetail.party_id = $('#accountDropdown').val();
            gridAccountDetail.cheque_list_number = $.trim($(elem).find('td.chequeListNumber').text());
            gridAccountDetail.cheque_in_hand_id = $.trim($(elem).find('td.chequeInHandName').data('cheque_in_hand_id'));
            gridAccountDetail.cheque_vrdate = $.trim($(elem).find('td.chequeDate').text());
            gridAccountDetail.cheque_no = $.trim($(elem).find('td.chequeNumber').text());
            gridAccountDetail.cheque_bank_name = $.trim($(elem).find('td.bankName').text());
            gridAccountDetail.cheque_amount = $.trim($(elem).find('td.amount').text());
            gridAccountDetail.received_amount = $.trim($(elem).find('td.amount').text());

            details.push(gridAccountDetail);
        });
        var data = {};
        data.main = main;
        data.details = details;
        data.id = $('#chequeIssueIdHidden').val();
        return data;
    };

    var getNumText = function (el) {
        return isNaN(parseFloat(el.text())) ? 0 : parseFloat(el.text());
    };

    var getNumVal = function (el) {
        return isNaN(parseFloat(el.val())) ? 0 : parseFloat(el.val());
    };

    var calculateLowerTotal = function () {
        let gridAccounttotalAmount = 0;

        $(purchase_table).find("tbody tr").each(function (index, elem) {
            gridAccounttotalAmount += getNumText($(this).closest('tr').find('td.amount'));
        });

        $(gridAccountTotalAmount).text(parseNumber(gridAccounttotalAmount).toFixed(AMOUNT_ROUNDING));
    };

    var resetVoucher = function (falg = true) {
        resetFields(falg);
        $('#voucher_type_hidden').val('new');
        getChequeIssueViewList();
    };

    var resetFields = function (falg = true) {
        $('#chequeIssueIdHidden').val('');
        $(current_date).datepicker('update', new Date());
        $(accountDropdown).prop('disabled', false).val('').trigger('change.select2');
        $(accountRemarks).val('');
        $(gridAccountTotalAmount).text('');
        $('#purchase_table tbody tr').remove();
        $('#purchase_tableReport tbody tr').remove();
        $('#laststockLocation_table tbody tr').remove();
        $('input[name="cheque_vrtype"]').prop('disabled', false);
        $('.inputerror').removeClass('inputerror');
        if (falg) {
            $('input[name="cheque_vrtype"]:visible:first').attr('checked', 'checked').trigger('click');
            $('#purchase_table tbody tr').remove();
        }

        $('#party_p').html('');
        $('#otherItemInformation').html('');
    }

    let purchaseOrderViewList = undefined;
    const getChequeIssueViewList = (chequeIssueId = 0, fromDate = "", toDate = "") => {
        if (typeof purchaseOrderViewList !== 'undefined') {
            purchaseOrderViewList.destroy();
            $('#purchaseOrderViewListTbody').empty();
        }
        purchaseOrderViewList = $("#purchaseOrderViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/chequeIssue/getChequeIssueViewList`,
                type: 'GET',
                data: { 'chequeIssueId': chequeIssueId, fromDate: fromDate, toDate: toDate },
                dataSrc: function (json) {
                    if (json.data) {
                        return json.data;
                    }

                    return [];
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
                    data: "chequeIssueVoucher",
                    name: "cheque_issues.vrnoa",
                    className: "text-left chequeIssueVoucher"
                },
                {
                    data: "voucherDate",
                    name: "cheque_issues.vrdate",
                    className: "text-left voucherDate",
                    render: function (data, type, row) {
                        return getFormattedDate(data);
                    }
                },
                { data: "accountName", name: 'parties.name', className: "accountName" },
                { data: "chequeInHandAccount", name: 'chequeinhandparties.name', className: "chequeInHandAccount" },
                { data: "remarks", name: 'cheque_issues.remarks', className: "remarks" },
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
							<a   class = "dropdown-item btnEditPrevVoucher" data-cheque_issue_id = "${row.chequeIssueId}" href = "#"><i class = 'fa fa-edit'></i> Edit Voucher</a>

                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                <li class="dropdown-item"><a href="#" class="btnPrint" data-cheque_issue_id   ="${row.chequeIssueId}">Print Voucher</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-cheque_issue_id   ="${row.chequeIssueId}"> Print a4 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-cheque_issue_id   ="${row.chequeIssueId}"> Print a4 without header </a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-cheque_issue_id   ="${row.chequeIssueId}"> Print b5 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-cheque_issue_id   ="${row.chequeIssueId}"> Print b5 without header </a></li>
                            </ul>

							<a   class = "dropdown-item btnDelete" data-cheque_issue_id          = "${row.chequeIssueId}" href = "#"><i class = 'fa fa-trash'></i> Delete Voucher</a>
							<div class = "dropdown-divider"></div>
							<a   class = "dropdown-item btnPrintASEmail" data-cheque_issue_id    = "${row.chequeIssueId}" href = "#">Send Email</a>
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
            const __etype = 'cheque_issues';
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
        const __etype = 'cheque_issues';
        const __vrnoa = vrnoa;
        const __pre_bal_print = ($(settings.switchPreBal).bootstrapSwitch('state') === true) ? '2' : '1';
        const __lang = $('#print_lang').val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, __pre_bal_print, paperSize, printSize, wrate, __lang, email);
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
        if (chequeType.toLocaleLowerCase() === 'issue') {
            $('input[name="cheque_vrtype"]').prop('disabled', true);
            if ($('input[name="cheque_vrtype"]:checked').val() == "chequeReturn") {
                $('#accountDropdown').prop('disabled', true);
            }
            $.each(data, function (index, elem) {
                appendToTable(elem.cheque_list_number, elem.cheque_in_hand_id, elem.chequeInHandName, getFormattedDate(elem.cheque_vrdate), elem.cheque_no, elem.cheque_bank_name, elem.totalChequeAmount)
            });
            calculateLowerTotal();
        } else {
            triggerAndRenderOptions($('#gridAccountPartydropdown'), data[0]['chequeInHandName'], data[0]['cheque_in_hand_id'], false);
            $('#gridAccountPartydropdown').prop('disabled', true);
            $('#gridAccountBankNameInput').val(data[0]['cheque_bank_name']).prop('disabled', true);
            populateDateValue('gridAccountChequeDateInput', data[0]['cheque_vrdate']);
            $('#gridAccountChequeDateInput').prop('disabled', true);
            $('#gridAccountChequeNumberInput').val(data[0]['cheque_no']).prop('disabled', true);
            $('#gridAccountAmountInput').val(data[0]['cheque_amount']).prop('disabled', false);
        }
    };

    return {

        init: function () {
            this.bindUI();
            $('.select2').select2({
                width: 'element',
            });
            getChequeIssueViewList();
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

            $(purchase_table).on('click', '.btnRowRemove', function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');
                row.remove();
                calculateLowerTotal();
            });

            $('.getAccountLookUpRecord').on('click', function (e) {
                e.preventDefault();
                const chequeType = $.trim($('input[name="cheque_vrtype"]:checked').val());
                if (chequeType.toLocaleLowerCase() === 'chequereturn') {
                    const getValidateAccount = getValidateAccountName();
                    if (!getValidateAccount) {
                        getPendingChequeInHand($.trim($(accountDropdown).val()));
                    } else {
                        _getAlertMessage('Error!', "Please Select the Account First!!.", 'danger')
                    }
                } else {
                    getPendingChequeInHand();
                }
            });

            $('body').on('click', '.modal-lookup .populatePendingChequeInHand', async function (e) {
                e.preventDefault();
                const chequeListNumber = $(this).closest('tr').find('td.chequeListNumber').text();
                var errorFlag = false;
                $('#purchase_table').find('tbody tr').each(function (index, elem) {
                    const chequeListNo = $.trim($(elem).find('td.chequeListNumber').text());
                    if (chequeListNumber == chequeListNo) {
                        errorFlag = true;
                    }
                });
                if (chequeListNumber !== 0 && errorFlag == false) {
                    await getPendingChequeInHandByChequeList(chequeListNumber, null, 'issue');
                } else {
                    _getAlertMessage('Error!', "This Cheque Is Already Added In Grid...", 'danger')
                }
            });

            $('#purchaseOrderSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getChequeIssueViewList();
            });
            $('#purchaseOrderFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getChequeIssueViewList("", fromDate, toDate);
            });

            $('#accountDropdown').on('change', function () {
                if (parseNumber(accountModuleSettings.show_account_information) == 1) {
                    const accountId = $(this).val();
                    const voucherDate = $('#current_date').val();
                    getAccountBalanced(accountId, voucherDate);
                }
            });

            $('body').on('click', '.btnPrint', function (e) {
                const chequeIssueId = $(this).data('cheque_issue_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(base_url + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(chequeIssueId, settingPrintDefault, 'lg', '');
                }
            });

            $('body').on('click', '.btnPrintA4WithHeader', function (e) {
                const chequeIssueId = $(this).data('cheque_issue_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(chequeIssueId, 1, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintA4WithOutHeader', function (e) {
                const chequeIssueId = $(this).data('cheque_issue_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(chequeIssueId, 2, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintB5WithHeader', function (e) {
                const chequeIssueId = $(this).data('cheque_issue_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(chequeIssueId, 3, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintB5WithOutHeader', function (e) {
                const chequeIssueId = $(this).data('cheque_issue_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(chequeIssueId, 4, 'lg', "");
                }
            });


            $('body').on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                const chequeIssueId = parseNumber($(this).data('cheque_issue_id'));
                fetch(chequeIssueId);
                $('a[href="#Main"]').trigger('click');
            });

            $('body').on('click', '.btnPrintASEmail', function (e) {
                const chequeIssueId = $(this).data('cheque_issue_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                getSendMail(chequeIssueId, settingPrintDefault, 'lg', '', true);
            });

            $('body').on('click', '.btnDelete', function (e) {
                const chequeIssueId = $(this).data('cheque_issue_id');
                e.preventDefault();
                if (chequeIssueId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', function (result) {
                        if (result) {
                            deleteVoucher(chequeIssueId);
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

var chequeIssue = new ChequeIssue();
chequeIssue.init();

$(function () {
    new DynamicOption("#accountDropdown", {
        requestedUrl: dropdownOptions.getAccountDetailAll,
        placeholderText: "Choose Account",
        allowClear: true,
    });
});
