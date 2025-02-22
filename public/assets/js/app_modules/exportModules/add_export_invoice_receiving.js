// assets/js/app_modules/purchase/add_sale_order.js
import { AMOUNT_ROUNDING, RATE_ROUNDING } from "../../../../js/components/GlobalConstants.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, ifNull, parseNumber, reinitializeSelect2WithoutAjax, setFinancialYearDate, updateDatepickerWithFormattedDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek, updateFormattedDate } from "../commonFunctions/CommonFunction.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { validPercentage } from "../../../../js/components/Helpers.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import SaverRequest from "../../../../js/components/SaverRequest.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";
import { handleAjaxError, makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";

// Instantiate BaseClass
var InvoiceReceiving = function () {
    const voucherType = 'export_invoice_receivings'
    const saverRequest = new SaverRequest(
        base_url,
        general,
        {
            requestedUrl: 'exportInvoiceReceiving/save',
            requestType: 'POST',
            isConfirmed: true,
            propsPrintVoucher: function (param) {
                printVoucher(param.id, 1, 1, '', false);
            },
            propsResetVoucher: function (param) {
                resetVoucher();
            },
        }
    );
    var getInvoiceReceivingById = async function (invoiceReceivingId) {
        const response = await makeAjaxRequest('GET', `${base_url}/exportInvoiceReceiving/getInvoiceReceivingById`, {
            invoiceReceivingId: invoiceReceivingId
        });
        resetFields();
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: "Error!", "message": response.message, "type": "danger" });
            resetVoucher();
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: "Warning!", "message": response.message, "type": "warning" });
            resetVoucher();
        } else {
            populateData(response.data);
        }
    };

    var populateData = function (data) {
        $('#invoiceReceivingHiddenId').val(data.id);
        appendSelect2ValueIfDataExists("accountDropdown", "party", "pid", "name", data, { disabled: true });
        appendSelect2ValueIfDataExists("gridItemCurrencyDropdown", "currency", "id", "name", data, { disabled: true });
        updateDatepickerWithFormattedDate('current_date', data.vrdate);
        updateDatepickerWithFormattedDate('chk_date', data.vrdate);


        $('#customerName').val(data.customer_name);
        $('#customerMobile').val(data.customer_mobile);
        $('#receivers_list').val(data.prepared_by);
        $('#currencyRate').val(data.currency_exchange_rate);

        $('#totalConvertedAmount').val(data.total_converted_amount);
        $('#totalReferenceAmount').val(data.total_reference_amount);
        $('#totalChequeAmount').val(data.total_cheque_amount);
        $('#totalReceivedAmount').val(data.total_received_amount);
        $('#totalDifferenceAmount').val(data.total_difference_amount);
        $('#txtNetAmount').val(data.net_amount);
        $.each(data.invoice_receiving_detail, function (index, elem) {
            appendToTable(
                elem.commercial_invoice_id,
                elem.commercial_invoice.vrnoa,
                elem.commercial_invoice_date,
                elem.currency.id,
                elem.currency.name,
                elem.invoice_amount_fcy,
                elem.received_amount_fcy,
                elem.balance_fcy,
                elem.exchange_rate,
                elem.balance_lcy,
                elem.received_amount_lcy,
                elem.converted_amount_lcy
            );
            calculateLowerTotal();
        });
        $.each(data.invoice_receiving_bank_detail, function (index, elem) {
            appendReferenceToTable(
                elem.mop,
                elem.mop,
                elem.account_id,
                elem.account.name,
                ifNull(elem.bank_name, ""),
                ifNull(elem.detail_remarks, ""),
                ifNull(elem.instrument_number, ""),
                elem.amount_lcy
            );
            calculateReferenceLowerTotal();
        });
        $.each(data.cheque_history, function (index, elem) {
            appendChequeToTable(
                elem.cheque_list_number,
                ifNull(elem.cheque_particular, ""),
                ifNull(elem.cheque_bank_name, ""),
                elem.cheque_in_hand_id,
                elem.cheque_in_hand_party.name,
                ifNull(elem.cheque_invoice, ""),
                elem.cheque_vrdate,
                ifNull(elem.cheque_no, ""),
                elem.cheque_amount
            );
            calculateChequeLowerTotal();
        });
        calculateLowerSummaryTotal();
    };
    var deleteVoucher = async function (vrnoa) {
        general.disableSave();
        const response = await makeAjaxRequest('delete', `${base_url}/exportInvoiceReceiving/delete`,
            { 'chk_date': $('#chk_date').val(), 'vrdate': $('#cur_date').val(), 'vrnoa': vrnoa }
        );
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: "Error!", "message": response.message, "type": "danger" });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: "Warning!", "message": response.message, "type": "warning" });
        } else {
            AlertComponent.getAlertMessage({ title: "Successfully!", "message": response.message, "type": "success" });
            resetVoucher();
        }
        general.enableSave();
    };
    var printVoucher = function (vrnoa, paperSize, printSize, wrate = 0, isSendEmail = false) {
        try {
            const __etype = voucherType;
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
        const __etype = voucherType;
        const __vrnoa = vrnoa;
        const __pre_bal_print = 0;
        const __lang = $('#print_lang').val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, __pre_bal_print, paperSize, printSize, wrate, __lang, email);
    };



    var getSaveObject = function () {
        const invoiceReceiving = {};
        const invoiceReceivingDetail = [];
        const invoiceReceivingBankDetail = [];
        const invoiceReceivingChequeDetail = [];

        invoiceReceiving.id = $('#invoiceReceivingHiddenId').val();
        invoiceReceiving.vrdate = $('#current_date').val();
        invoiceReceiving.chk_date = $('#chk_date').val();
        invoiceReceiving.party_id = $('#accountDropdown').val();
        invoiceReceiving.currency_id = $('#gridItemCurrencyDropdown').val();
        invoiceReceiving.currency_exchange_rate = $('#currencyRate').val();
        invoiceReceiving.customer_name = $('#customerName').val();
        invoiceReceiving.customer_mobile = $('#customerMobile').val();
        invoiceReceiving.prepared_by = $('#receivers_list').val();
        invoiceReceiving.net_amount = parseNumber($('#totalConvertedAmount').val()) || 0;
        invoiceReceiving.total_converted_amount = parseNumber($('#totalConvertedAmount').val()) || 0;
        invoiceReceiving.total_reference_amount = parseNumber($('#totalReferenceAmount').val()) || 0;
        invoiceReceiving.total_cheque_amount = parseNumber($('#totalChequeAmount').val()) || 0;
        invoiceReceiving.total_received_amount = parseNumber($('#totalReceivedAmount').val()) || 0;
        invoiceReceiving.total_difference_amount = parseNumber($('#totalDifferenceAmount').val()) || 0;

        $('#invoiceReceivingTable').find('tbody tr').each(function (index, elem) {
            const gridItemDetail = {};
            gridItemDetail.commercial_invoice_id = $.trim($(elem).find('td.invoiceNumber').data('invoice_id'));
            gridItemDetail.commercial_invoice_date = $.trim($(elem).find('td.invoiceDate').text());
            gridItemDetail.currency_id = $.trim($(elem).find('td.currencyName').data('currency_id'));
            gridItemDetail.invoice_amount_fcy = $.trim($(elem).find('td.amountFcy').text());
            gridItemDetail.received_amount_fcy = $.trim($(elem).find('td.receivedAmountFcy input').val());
            gridItemDetail.balance_fcy = $.trim($(elem).find('td.balanceFcy').text());
            gridItemDetail.exchange_rate = $.trim($(elem).find('td.currencyExchangeRate').text());
            gridItemDetail.balance_lcy = $.trim($(elem).find('td.balanceLcy').text());
            gridItemDetail.received_amount_lcy = $.trim($(elem).find('td.receivedAmountLcy').text());
            gridItemDetail.converted_amount_lcy = getNumText($(elem).find('td.convertedAmount'));
            invoiceReceivingDetail.push(gridItemDetail);
        });

        $('#invoiceReceivingReferenceTable').find('tbody tr').each(function (index, elem) {
            const gridItemDetail = {};
            gridItemDetail.mop = $.trim($(elem).find('td.referenceMop').data('reference-mop'));
            gridItemDetail.account_id = $.trim($(elem).find('td.referenceAccountName').data('account_id'));
            gridItemDetail.bank_name = $.trim($(elem).find('td.referenceBankName').text());
            gridItemDetail.detail_remarks = $.trim($(elem).find('td.referenceParticular').text());
            gridItemDetail.instrument_number = $.trim($(elem).find('td.referenceInstrument').text());
            gridItemDetail.amount_lcy = $.trim($(elem).find('td.referenceAmount').text());
            invoiceReceivingBankDetail.push(gridItemDetail);
        });

        $('#invoiceReceivingChequeTable').find('tbody tr').each(function (index, elem) {
            const gridDetail = {};
            gridDetail.party_id = $('#accountDropdown').val();
            gridDetail.cheque_list_number = $.trim($(elem).find('td.chequeListNumber').text());
            gridDetail.cheque_particular = $.trim($(elem).find('td.particular').text());
            gridDetail.cheque_bank_name = $.trim($(elem).find('td.bankName').text());
            gridDetail.cheque_in_hand_id = $.trim($(elem).find('td.chequeInHandName').data('cheque_in_hand_id'));
            gridDetail.cheque_invoice = $.trim($(elem).find('td.invoiceNo').text());
            gridDetail.cheque_vrdate = $.trim($(elem).find('td.chequeDate').text());
            gridDetail.cheque_no = $.trim($(elem).find('td.chequeNumber').text());
            gridDetail.cheque_amount = $.trim($(elem).find('td.amount').text());
            gridDetail.is_received = 1;
            invoiceReceivingChequeDetail.push(gridDetail);
        });

        const data = {};
        data.invoiceReceiving = invoiceReceiving;
        data.invoiceReceivingDetail = invoiceReceivingDetail;
        data.invoiceReceivingBankDetail = invoiceReceivingBankDetail;
        data.invoiceReceivingChequeDetail = invoiceReceivingChequeDetail;
        data.id = $('#invoiceReceivingHiddenId').val();
        return data;
    };

    // Function to check for empty fields and validate the form
    var validateSave = function () {
        let hasError = false;
        let errorMessage = '';

        const totalDifferenceAmount = $('#totalDifferenceAmount');
        const accountDropdown = $('#accountDropdown');
        const currentDate = $('#current_date');
        // Remove any previous error indications
        $('.inputerror').removeClass('inputerror');

        if (!accountDropdown.val()) {
            $('#select2-accountDropdown-container').parent().addClass('inputerror');
            errorMessage += "Customer field is required. <br />";
            hasError = true;
        }

        if (!currentDate.val()) {
            currentDate.addClass('inputerror');
            errorMessage += "Voucher date is required. <br />";
            hasError = true;
        }

        if (parseNumber(totalDifferenceAmount.val()) !== 0) {
            totalDifferenceAmount.addClass('inputerror');
            errorMessage += "The total difference amount should be zero. Please adjust your entries to remove any discrepancies. <br />";
            hasError = true;
        }

        if (hasError) {
            return errorMessage;
        }

        return null;
    };

    var resetVoucher = function () {
        resetFields();
        getInvoiceReceivingDataTable();
    };
    var resetFields = function () {
        const resetArray = [
            { selector: 'invoiceReceivingHiddenId', options: { disabled: true } },
            'accountDropdown',
            'current_date',
            'chk_date',
            'txtNetAmount',
            'customerName',
            'customerMobile',
            'receivers_list',
            // reference
            'referenceMopDropdown',
            'referenceAccountDropdown',
            'referenceBankName',
            'referenceParticular',
            'referenceInstrument',
            'referenceAmount',
            // cheque
            'gridAccountChequeListNumberInput',
            'gridAccountParticularInput',
            'gridAccountBankNameInput',
            'chequeInHandDropdown',
            'gridAccountInvoiceNoInput',
            'gridAccountChequeDateInput',
            'gridAccountChequeNumberInput',
            'gridAccountAmountInput',
            'currencyRate',
            { selector: 'gridItemCurrencyDropdown', options: { disabled: true } },
            { selector: 'totalConvertedAmount', options: { disabled: true } },
            { selector: 'totalReferenceAmount', options: { disabled: true } },
            { selector: 'totalChequeAmount', options: { disabled: true } },
            { selector: 'totalReceivedAmount', options: { disabled: true } },
            { selector: 'totalDifferenceAmount', options: { disabled: true } },
        ];
        clearValueAndText(resetArray);

        const resetClassArray = [
            'gridTotalReceivedAmountFCY',
            'gridTotalReceivedAmountLCY',
            'gridTotalConvertedAmount',
            'gridTotalReferenceAmount',
            'gridTotalChequeAmount'
        ];
        clearValueAndText(resetClassArray, '.');
        $('#invoiceReceivingTable tbody tr').remove();
        $('#invoiceReceivingReferenceTable tbody tr').remove();
        $('#invoiceReceivingChequeTable tbody tr').remove();
        $('#purchase_tableReport tbody tr').remove();
        $('a[href="#invoice"]').click();

        $('#party_p').html('');
        $('#otherItemInformation').html('');

        $('button.getAccountLookUpRecord').prop('disabled', false);
    };

    let pendingCommercialInvoiceDataTable = undefined;
    const getPendingCommercialInvoiceDataTable = (accountId, voucherDate) => {
        if (typeof pendingCommercialInvoiceDataTable !== 'undefined') {
            pendingCommercialInvoiceDataTable.destroy();
            $('#pendingCommercialInvoiceDataTableTbody').empty();
        }
        pendingCommercialInvoiceDataTable = $("#pendingCommercialInvoiceDataTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/commercialInvoice/getPendingCommercialInvoiceDataTable`,
                type: 'GET',
                data: { accountId, voucherDate },
                dataSrc: function (json) {
                    return json.data;
                },
                error: function (xhr, error, thrown) {
                    console.error("Error occurred:", xhr, error, thrown);
                    alert('Failed to fetch data.'); // Or display a modal/notification
                }
            },
            autoWidth: false,
            buttons: true,
            searching: true,
            columns: [

                {
                    data: null,
                    className: "select-checkbox",
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1
                    }
                },
                {
                    data: "invoiceNumber",
                    name: "commercial_invoices.vrnoa",
                    className: "text-left invoiceNumber",
                    createdCell: function (td, cellData, rowData, rowIndex, colIndex) {
                        $(td).attr('data-invoice_number', rowData.id);
                    }
                },
                {
                    data: "invoiceDate",
                    name: "commercial_invoices.vrdate",
                    className: "text-left invoiceDate text-nowrap",
                    render: function (data, type, row) {
                        return getFormattedDate(data);
                    }
                },
                {
                    data: "currencyName",
                    name: "currencies.name",
                    className: "text-left currencyName",
                    render: function (data, type, row) {
                        return ifNull(data);
                    }
                },
                {
                    data: "amount_fcy",
                    name: "amount_fcy",
                    className: "text-right currencyName",
                    render: function (data, type, row) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: "received_amount_fcy",
                    name: "received_amount_fcy",
                    className: "text-right received_amount_fcy",
                    render: function (data, type, row) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: "balance_fcy",
                    name: "balance_fcy",
                    className: "text-right balance_fcy",
                    render: function (data, type, row) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: "currency_exchange_rate",
                    name: "currency_exchange_rate",
                    className: "text-right currency_exchange_rate",
                    render: function (data, type, row) {
                        return parseNumber(data).toFixed(RATE_ROUNDING);
                    }
                },
                {
                    data: "amount_lcy",
                    name: "amount_lcy",
                    className: "text-right amount_lcy",
                    render: function (data, type, row) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: "received_amount_lcy",
                    name: "received_amount_lcy",
                    className: "text-right received_amount_lcy",
                    render: function (data, type, row) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: "balance_lcy",
                    name: "balance_lcy",
                    className: "text-right balance_lcy",
                    render: function (data, type, row) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                }

            ],
            columnDefs: [{  // Note: 'columnDefs' should be at the same level as 'columns'
                targets: 11, // Assuming checkboxes are in the first column
                data: null,
                className: "select text-right",
                searchable: false,
                orderable: false,
                render: function (data, type, row) {
                    return '<input type="checkbox" class="dt-checkbox w-8 h-8 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" value="' + row.id + '">';
                }
            }],
            createdRow: function (row, data, dataIndex) {
                $(row).addClass('group odd:bg-white even:bg-slate-50');
                $('td', row).addClass('py-1 px-1 text-md align-middle');
            }
        });
        // Reinitialize tooltips on table redraw
        pendingCommercialInvoiceDataTable.on('draw', function () {
            $('[data-toggle="tooltip"]').tooltip(); // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
        $('#pendingCommercialInvoiceLookUp').modal('show');
        // Handle click on "Check All" control
        $('#checkAll').on('click', function () {
            // Check/uncheck all visible checkboxes
            var rows = pendingCommercialInvoiceDataTable.rows({ 'search': 'applied' }).nodes();
            $('input[type="checkbox"]', rows).prop('checked', this.checked);
        });

        $('#pendingCommercialInvoiceDataTable tbody').on('change', 'input[type="checkbox"]', function () {
            // If checkbox is not checked, then uncheck the "Check All" checkbox
            if (!this.checked) {
                var el = $('#checkAll').get(0);
                if (el && el.checked && ('indeterminate' in el)) {
                    el.indeterminate = true;
                }
            }
        });
    };
    const getPendingCommercialInvoice = async function (accountId, invoiceNumber) {
        resetFields();
        const response = await makeAjaxRequest('GET', `${base_url}/commercialInvoice/getPendingCommercialInvoice`, {
            accountId: accountId,
            invoiceNumber: invoiceNumber
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: "Error!", "message": response.message, "type": "danger" });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: "Warning!", "message": response.message, "type": "warning" });
        } else {

            triggerAndRenderOptions($('#accountDropdown'), response.data[0].customerName, response.data[0].customerId);
            $('#accountDropdown').prop('disabled', true).trigger('change.select2');
            triggerAndRenderOptions($('#gridItemCurrencyDropdown'), response.data[0].currencyName, response.data[0].currency_id);
            $('#gridItemCurrencyDropdown').prop('disabled', true).trigger('change.select2');
            $('#currencyRate').val(response.data[0].exchangeRate);
            $('#invoiceReceivingTable').find('tbody tr').remove();
            $.each(response.data, function (index, elem) {
                appendToTable(elem.id, elem.invoiceNumber, elem.invoiceDate, elem.currency_id, elem.currencyName, elem.amount_fcy, "", elem.balance_fcy, elem.currency_exchange_rate, elem.balance_lcy, elem.received_amount_lcy, elem.convertedAmount);
            });
            $('input.receivedAmountFcy').trigger('input');
        }
    };
    const appendToTable = (invoiceId, invoiceNumber, invoiceDate, currencyId, currencyName, amountFcy, receivedAmountFcy, balanceFcy, currencyExchangeRate, balanceLcy, receivedAmountLcy, convertedAmount) => {
        const row = `
        <tr class="odd:bg-white even:bg-slate-50">
        <td class='py-1 px-1 text-md align-middle text-left srno' data-title='Sr#'></td>
        <td class='py-1 px-1 text-md align-middle text-left invoiceNumber' data-invoice_id='${invoiceId}'>${invoiceNumber}</td>
        <td class='py-1 px-1 text-md align-middle text-left invoiceDate'>${invoiceDate}</td>
        <td class='py-1 px-1 text-md align-middle text-left currencyName' data-currency_id='${currencyId}'>${currencyName}</td>
        <td class='py-1 px-1 text-md align-middle text-right amountFcy'> ${parseNumber(amountFcy).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right balanceFcy'> ${parseNumber(balanceFcy).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right receivedAmountFcy'>
            <input type='text' class='form-control form-input-class  is_numeric text-right w-20 h-8 float-right receivedAmountFcy' value='${parseNumber(receivedAmountFcy).toFixed(AMOUNT_ROUNDING)}'>
        </td>
        <td class='py-1 px-1 text-md align-middle text-right currencyExchangeRate'> ${parseNumber(currencyExchangeRate).toFixed(RATE_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right balanceLcy'> ${parseNumber(balanceLcy).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right receivedAmountLcy'> ${parseNumber(receivedAmountLcy).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right convertedAmount'> ${parseNumber(convertedAmount).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right'><button class="btn btn-sm btn-outline-danger group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white align-right mr-1 mb-1 flex-1 removeInvoiceRow" data-toggle="tooltip" data-title="remove Button"><i class='fa fa-trash'></i></button></td>
        </tr>`

        $(row).appendTo('#invoiceReceivingTable');
        getTableSerialNumber('#invoiceReceivingTable');
    };


    const getValueFromElement = (rowElement, selector, dataAttr = null, isDataAttr = false) => {
        const element = rowElement.find(selector);
        if (element.is('input, select, textarea')) {
            return element.val();
        } else if (isDataAttr && dataAttr) {
            return element.data(dataAttr);
        } else {
            return element.text();
        }
    };

    const validateReferenceGrid = () => {
        let hasError = false;
        let errorMessage = '';

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!$('#referenceMopDropdown').val()) {
            $('#select2-referenceMopDropdown-container').parent().addClass('inputerror');
            errorMessage += `Mode of payment is required <br />`;
            hasError = true;
        }

        if (!$('#referenceAccountDropdown').val()) {
            $('#select2-referenceAccountDropdown-container').parent().addClass('inputerror');
            errorMessage += `Account name is required <br />`;
            hasError = true;
        }

        if (parseNumber($('#referenceAmount').val()) <= 0) {
            $('#referenceAmount').addClass('inputerror');
            errorMessage += `Amount (LCY) is required <br />`;
            hasError = true;
        }

        if (hasError) {
            return errorMessage;
        }

        return null;
    };


    const appendReferenceToTable = (referenceMopDropdown, referenceMopDropdownName, referenceAccountId, referenceAccountName, referenceBankName, referenceParticular, referenceInstrument, referenceAmount) => {
        const row = `
        <tr class="odd:bg-white even:bg-slate-50">
        <td class='py-1 px-1 text-md align-middle text-left srno' data-title='Sr#'></td>
        <td class='py-1 px-1 text-md align-middle text-left referenceMop' data-reference-mop="${referenceMopDropdown}">${referenceMopDropdownName}</td>
        <td class='py-1 px-1 text-md align-middle text-left referenceAccountName' data-account_id="${referenceAccountId}">${referenceAccountName}</td>
        <td class='py-1 px-1 text-md align-middle text-left referenceBankName'>${referenceBankName}</td>
        <td class='py-1 px-1 text-md align-middle text-left referenceParticular'>${referenceParticular}</td>
        <td class='py-1 px-1 text-md align-middle text-left referenceInstrument'>${referenceInstrument}</td>
        <td class='py-1 px-1 text-md align-middle text-right referenceAmount'>${parseNumber(referenceAmount).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right'>
            <div class="btn-group">
                <button type="button" class="btn btn-sm btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <div class="dropdown-menu">
                    <button type="button" class="dropdown-item referenceRowEdit"><i class="fa fa-edit"></i> Edit </button>
                    <button type="button" class="dropdown-item referenceRowRemove"><i class="fa fa-trash-alt"></i> Remove </button>
                </div>
            </div>
        </td>
        </tr>`
        $(row).appendTo('#invoiceReceivingReferenceTable');
        getTableSerialNumber('#invoiceReceivingReferenceTable');
    };
    const calculateReferenceLowerTotal = () => {
        let gridTotalReferenceAmount = 0;
        $('#invoiceReceivingReferenceTable').find("tbody tr").each(function (index, elem) {
            gridTotalReferenceAmount += getNumText($(this).closest('tr').find('td.referenceAmount'));
        });
        $('.gridTotalReferenceAmount').text(parseNumber(gridTotalReferenceAmount).toFixed(AMOUNT_ROUNDING));
    };

    const validateChequeGrid = () => {
        let hasError = false;
        let errorMessage = '';

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!$('#gridAccountBankNameInput').val()) {
            $('#gridAccountBankNameInput').addClass('inputerror');
            errorMessage += `Bank Name is required <br />`;
            hasError = true;
        }

        if (!$('#chequeInHandDropdown').val()) {
            $('#select2-chequeInHandDropdown-container').parent().addClass('inputerror');
            errorMessage += `Cheque in hand is required <br />`;
            hasError = true;
        }

        if (!$('#gridAccountChequeDateInput').val()) {
            $('#gridAccountChequeDateInput').addClass('inputerror');
            errorMessage += `Cheque Date is required <br />`;
            hasError = true;
        }

        if (!$('#gridAccountChequeNumberInput').val()) {
            $('#gridAccountChequeNumberInput').addClass('inputerror');
            errorMessage += `Cheque # is required <br />`;
            hasError = true;
        }

        if (parseNumber($('#gridAccountAmountInput').val()) <= 0) {
            $('#gridAccountAmountInput').addClass('inputerror');
            errorMessage += `Cheque Amount is required <br />`;
            hasError = true;
        }

        if (hasError) {
            return errorMessage;
        }

        return null;
    };


    const appendChequeToTable = (chequeListNumber, particular, bankName, chequeInHandId, chequeInHandName, invoiceNo, chequeDate, chequeNumber, amount) => {
        const row = `
        <tr class="odd:bg-white even:bg-slate-50">
        <td class='py-1 px-1 text-md align-middle text-left srno' data-title='Sr#'></td>
        <td class='py-1 px-1 text-md align-middle text-left chequeListNumber'>${chequeListNumber}</td>
        <td class='py-1 px-1 text-md align-middle text-left particular'>${particular}</td>
        <td class='py-1 px-1 text-md align-middle text-left bankName'>${bankName}</td>
        <td class='py-1 px-1 text-md align-middle text-left chequeInHandName' data-cheque_in_hand_id="${chequeInHandId}">${chequeInHandName}</td>
        <td class='py-1 px-1 text-md align-middle text-left invoiceNo'>${invoiceNo}</td>
        <td class='py-1 px-1 text-md align-middle text-left chequeDate'>${chequeDate}</td>
        <td class='py-1 px-1 text-md align-middle text-left chequeNumber'>${chequeNumber}</td>
        <td class='py-1 px-1 text-md align-middle text-right amount'>${parseNumber(amount).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right'>
            <div class="btn-group">
                <button type="button" class="btn btn-sm btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <div class="dropdown-menu">
                    <button type="button" class="dropdown-item chequeRowEdit"><i class="fa fa-edit"></i> Edit </button>
                    <button type="button" class="dropdown-item chequeRowRemove"><i class="fa fa-trash-alt"></i> Remove </button>
                </div>
            </div>
        </td>
        </tr>`
        $(row).appendTo('#invoiceReceivingChequeTable');
        getTableSerialNumber('#invoiceReceivingChequeTable');
    };
    const calculateChequeLowerTotal = () => {
        let gridTotalChequeAmount = 0;
        $('#invoiceReceivingChequeTable').find("tbody tr").each(function (index, elem) {
            gridTotalChequeAmount += getNumText($(this).closest('tr').find('td.amount'));
        });
        $('.gridTotalChequeAmount').text(parseNumber(gridTotalChequeAmount).toFixed(AMOUNT_ROUNDING));
    };

    var calculateLowerTotal = function () {

        let gridTotalReceivedAmountFCY = 0;
        let gridTotalReceivedAmountLCY = 0;
        let gridTotalConvertedAmount = 0;

        $("#invoiceReceivingTable").find("tbody tr").each(function (index, elem) {
            gridTotalReceivedAmountFCY += getNumVal($(this).closest('tr').find('td.receivedAmountFcy input'));
            gridTotalReceivedAmountLCY += getNumText($(this).closest('tr').find('td.receivedAmountLcy'));
            gridTotalConvertedAmount += getNumText($(this).closest('tr').find('td.convertedAmount'));
        });

        $('.gridTotalReceivedAmountFCY').text(parseNumber(gridTotalReceivedAmountFCY).toFixed(AMOUNT_ROUNDING));
        $('.gridTotalReceivedAmountLCY').text(parseNumber(gridTotalReceivedAmountLCY).toFixed(AMOUNT_ROUNDING));
        $('.gridTotalConvertedAmount').text(parseNumber(gridTotalConvertedAmount).toFixed(AMOUNT_ROUNDING));
    };

    var calculateLowerSummaryTotal = function () {

        const totalConvertedAmount = parseNumber($('.gridTotalConvertedAmount').text());
        const totalCashBankAmount = parseNumber($('.gridTotalReferenceAmount').text());
        const totalChequesAmount = parseNumber($('.gridTotalChequeAmount').text());



        $('#totalConvertedAmount').val(parseNumber(totalConvertedAmount).toFixed(AMOUNT_ROUNDING));
        $('#totalReferenceAmount').val(parseNumber(totalCashBankAmount).toFixed(AMOUNT_ROUNDING));
        $('#totalChequeAmount').val(parseNumber(totalChequesAmount).toFixed(AMOUNT_ROUNDING));

        const totalReceivedAmount = parseNumber(totalCashBankAmount) + parseNumber(totalChequesAmount);
        const totalDifference = parseNumber(totalConvertedAmount) - parseNumber(totalReceivedAmount);
        $('#totalReceivedAmount').val(parseNumber(totalReceivedAmount).toFixed(AMOUNT_ROUNDING));
        $('#totalDifferenceAmount').val(parseNumber(totalDifference).toFixed(AMOUNT_ROUNDING));
    };

    let invoiceReceivingDataTable = undefined;
    const getInvoiceReceivingDataTable = (invoiceReceivingId = 0, fromDate = "", toDate = "") => {
        if (typeof invoiceReceivingDataTable !== 'undefined') {
            invoiceReceivingDataTable.destroy();
            $('#invoiceReceivingDataTableTbody').empty();
        }
        invoiceReceivingDataTable = $("#invoiceReceivingDataTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/exportInvoiceReceiving/getInvoiceReceivingDataTable`,
                type: 'GET',
                data: { 'invoiceReceivingId': invoiceReceivingId, fromDate: fromDate, toDate: toDate },
                dataSrc: function (json) {
                    return json.data;
                },
                error: function (xhr, error, thrown) {
                    return handleAjaxError(xhr.responseJSON);
                }
            },
            autoWidth: false,
            buttons: true,
            searching: true,
            columns: [

                {
                    data: null,
                    className: "select-checkbox",
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1
                    }
                },
                {
                    data: "vrnoa",
                    name: "vrnoa",
                    className: "text-left vrnoa"
                },
                {
                    data: "vrdate",
                    name: "vrdate",
                    className: "text-left vrdate",
                    render: function (data, type, row) {
                        return getFormattedDate(data);
                    }
                },
                {
                    data: "party.name",
                    name: "party.name",
                    className: "text-left partyName",
                    render: function (data, type, row) {
                        return ifNull(data);
                    }
                },
                {
                    data: "currency.name",
                    name: "currency.name",
                    className: "text-left currencyName"
                },
                {
                    data: "total_reference_amount",
                    name: "total_reference_amount",
                    className: "text-right total_reference_amount",
                    render: function (data, type, row) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: "total_cheque_amount",
                    name: "total_cheque_amount",
                    className: "text-right total_cheque_amount",
                    render: function (data, type, row) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: "total_converted_amount",
                    name: "total_converted_amount",
                    className: "text-right total_converted_amount",
                    render: function (data, type, row) {
                        return parseNumber(data).toFixed(RATE_ROUNDING);
                    }
                },
                {
                    data: null,
                    className: "select text-right",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        return `<div class="btn-group dropleft">
                            <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">More</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item btnEditPrevVoucher" data-invoice_receiving_id="${row.id}" href="#"><i class='fa fa-edit'></i> Edit Voucher</a>
                                <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                    <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                    <span class="sr-only">Toggle Dropdown</span>
                                </button>
                                <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                    <li class="dropdown-item"><a href="#" class="btnPrint" data-invoice_receiving_id="${row.id}">Print Voucher</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-invoice_receiving_id="${row.id}"> Print a4 with header</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-invoice_receiving_id="${row.id}"> Print a4 without header </a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-invoice_receiving_id="${row.id}"> Print b5 with header</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-invoice_receiving_id="${row.id}"> Print b5 without header </a></li>
                                </ul>
                                <a class="dropdown-item btnDelete" data-invoice_receiving_id="${row.id}" href="#"><i class='fa fa-trash'></i> Delete Voucher</a>
                                <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="#">Send Email</a>
                                </div>
                            </div>`;
                    }
                }

            ],
            createdRow: function (row, data, dataIndex) {
                $(row).addClass('group odd:bg-white even:bg-slate-50');
                $('td', row).addClass('py-1 px-1 text-md align-middle');
            }
        });
        // Reinitialize tooltips on table redraw
        invoiceReceivingDataTable.on('draw', function () {
            $('[data-toggle="tooltip"]').tooltip(); // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
    };
    return {

        init: function () {
            this.bindUI();
            $('.select2').select2();
            getInvoiceReceivingDataTable();
        },

        bindUI: function () {
            $('[data-toggle="tooltip"]').tooltip();
            const self = this;
            $('#currencyRate').on('input', function (e) {
                e.preventDefault();
                $('input.receivedAmountFcy').trigger('input');
            });
            $('#saleCommissionPercentage').on('input', function (e) {
                e.preventDefault();
                validPercentage($(this).val(), e.target);
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

            $('body').on('click', '#pendingCommercialInvoiceLookUp .selectModal', function () {
                const modal = $('#pendingCommercialInvoiceLookUp');
                const dataTable = $('#pendingCommercialInvoiceDataTable').DataTable();

                let hasError = false;
                const selectedInvoices = [];
                let selectedInvoiceNumbers = '';
                dataTable.rows().every(function () {
                    const row = $(this.node());
                    if (row.find('input[type="checkbox"]').is(':checked')) {
                        const invoiceNumber = $.trim(row.find('td.invoiceNumber').data('invoice_number'));
                        selectedInvoiceNumbers += "'" + invoiceNumber + "',";
                        $('#invoiceReceivingTable tbody tr').each(function () {
                            const existingInvoiceNumber = $.trim($(this).find('td.invoiceNumber').data('invoice_number'));
                            if (invoiceNumber === existingInvoiceNumber && !selectedInvoices.includes(invoiceNumber)) {
                                selectedInvoices.push(invoiceNumber);
                                hasError = true;
                            }
                        });
                    }
                });
                selectedInvoiceNumbers = selectedInvoiceNumbers.slice(0, -1);
                if (selectedInvoiceNumbers) {
                    if (!hasError) {
                        modal.modal('hide');
                        getPendingCommercialInvoice($('#accountDropdown').val(), selectedInvoiceNumbers);
                    } else {
                        alert("Invoice no # " + selectedInvoices.join(", ") + " is already added.");
                    }
                } else {
                    AlertComponent.getAlertMessage({
                        title: "Error!",
                        message: "Please select at least one invoice.",
                        type: "danger"
                    });
                }
                calculateLowerSummaryTotal();
            });

            $('#invoiceReceivingTable').on('input', 'tr input.receivedAmountFcy', function (event) {
                const currentRow = $(this).closest('tr');
                const currencyRate = parseNumber($('#currencyRate').val());
                const balanceFcy = parseNumber(getValueFromElement(currentRow, 'td.balanceFcy'));

                const receivedAmountFcy = parseNumber($(this).val());
                if (receivedAmountFcy > balanceFcy) {
                    AlertComponent.getAlertMessage({
                        title: "Input Exceeded",
                        message: `The entered amount (${receivedAmountFcy}) exceeds the pending balance amount (${balanceFcy}). Please enter a valid amount.`,
                        type: "danger"
                    });
                    currentRow.find('td.receivedAmountFcy input').val("");
                    currentRow.find('td.receivedAmountLcy').text("");
                    currentRow.find('td.convertedAmount').text("");
                    calculateLowerTotal();
                    calculateLowerSummaryTotal();
                    return; // Stop further processing if the input is invalid
                }

                const currencyExchangeRate = parseNumber(getValueFromElement(currentRow, 'td.currencyExchangeRate'));
                const receivedAmountLcy = receivedAmountFcy * currencyExchangeRate;
                const convertedAmount = receivedAmountFcy * currencyRate;

                currentRow.find('td.receivedAmountLcy').text(parseNumber(receivedAmountLcy).toFixed(AMOUNT_ROUNDING));
                currentRow.find('td.convertedAmount').text(parseNumber(convertedAmount).toFixed(AMOUNT_ROUNDING));

                calculateLowerTotal();
                calculateLowerSummaryTotal();
            });

            $('#invoiceReceivingTable').on('click', '.removeInvoiceRow', function (event) {
                const currentRow = $(this).closest('tr');
                currentRow.remove();
                calculateLowerTotal();
                calculateReferenceLowerTotal();
                calculateChequeLowerTotal();
                calculateLowerSummaryTotal();
            });

            // cheque
            $('#referenceBankName', '#referenceParticular', '#referenceInstrument', '#referenceAmount').on('keypress', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    $('#referenceButtonAdd').trigger('click');
                }
            });

            $('#referenceButtonAdd').on('click', function (e) {
                e.preventDefault();

                const alertMessage = validateReferenceGrid();
                if (alertMessage) {
                    return _getAlertMessage('Error!', alertMessage, 'danger');;
                }

                const referenceMopDropdown = $('#referenceMopDropdown').val();
                const referenceMopDropdownName = $('#referenceMopDropdown').find('option:selected').text().trim();
                const referenceAccountId = $('#referenceAccountDropdown').val();
                const referenceAccountName = $('#referenceAccountDropdown').find('option:selected').text().trim();
                const referenceBankName = $('#referenceBankName').val();
                const referenceParticular = $('#referenceParticular').val();
                const referenceInstrument = $('#referenceInstrument').val();
                const referenceAmount = $('#referenceAmount').val();

                $('#referenceMopDropdown').val('').trigger('change.select2');
                $('#referenceAccountDropdown').val('').trigger('change.select2');
                $('#referenceBankName').val('');
                $('#referenceParticular').val('');
                $('#referenceInstrument').val('');
                $('#referenceAmount').val('');

                appendReferenceToTable(referenceMopDropdown, referenceMopDropdownName, referenceAccountId, referenceAccountName, referenceBankName, referenceParticular, referenceInstrument, referenceAmount);
                $('#referenceMopDropdown').focus();
                calculateReferenceLowerTotal();
                calculateLowerSummaryTotal();
            });
            $('#invoiceReceivingReferenceTable').on('click', '.referenceRowEdit', async function (e) {
                e.preventDefault();
                const row = $(this).closest('tr');
                const editReferenceMop = row.find('td.referenceMop').data('reference-mop');
                const editReferenceMopName = row.find('td.referenceMop').text();
                const referenceAccountId = row.find('td.referenceAccountName').data('account_id');
                const referenceAccountName = row.find('td.referenceAccountName').text();
                const referenceBankName = row.find('td.referenceBankName').text();
                const referenceParticular = row.find('td.referenceParticular').text();
                const referenceInstrument = row.find('td.referenceInstrument').text();
                const referenceAmount = parseNumber(row.find('td.referenceAmount').text());

                $('#referenceMopDropdown').val(editReferenceMop).trigger('change.select2');
                triggerAndRenderOptions($('#referenceAccountDropdown'), referenceAccountName, referenceAccountId, false);
                $('#referenceBankName').val(referenceBankName);
                $('#referenceParticular').val(referenceParticular);
                $('#referenceInstrument').val(referenceInstrument);
                $('#referenceAmount').val(referenceAmount);
                row.remove();
                calculateReferenceLowerTotal();
                calculateLowerSummaryTotal();
            });
            $('#invoiceReceivingReferenceTable').on('click', '.referenceRowRemove', async function (e) {
                e.preventDefault();
                const row = $(this).closest('tr');
                row.remove();
                calculateReferenceLowerTotal();
                calculateLowerSummaryTotal();
            });
            // cheque button
            $('#gridAccountChequeListNumberInput', '#gridAccountParticularInput', '#gridAccountBankNameInput', '#gridAccountInvoiceNoInput', '#gridAccountChequeDateInput', '#gridAccountChequeNumberInput', '#gridAccountAmountInput').on('keypress', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    $('#chequeButtonAdd').trigger('click');
                }
            });

            $('#chequeButtonAdd').on('click', function (e) {
                e.preventDefault();

                const alertMessage = validateChequeGrid();
                if (alertMessage) {
                    return _getAlertMessage('Error!', alertMessage, 'danger');;
                }

                const chequeListNumber = $('#gridAccountChequeListNumberInput').val();
                const particular = $('#gridAccountParticularInput').val();
                const bankName = $('#gridAccountBankNameInput').val();
                const chequeInHandId = $('#chequeInHandDropdown').val();
                const chequeInHandName = $('#chequeInHandDropdown').find('option:selected').text().trim();
                const invoiceNo = $('#gridAccountInvoiceNoInput').val();
                const chequeDate = $('#gridAccountChequeDateInput').val();
                const chequeNumber = $('#gridAccountChequeNumberInput').val();
                const amount = $('#gridAccountAmountInput').val();

                $('#gridAccountChequeListNumberInput').val('');
                $('#gridAccountParticularInput').val('');
                $('#gridAccountBankNameInput').val('');
                $('#gridAccountInvoiceNoInput').val('');
                $('#gridAccountChequeDateInput').datepicker('update', new Date());
                $('#gridAccountChequeNumberInput').val('');
                $('#gridAccountAmountInput').val('');

                appendChequeToTable(chequeListNumber, particular, bankName, chequeInHandId, chequeInHandName, invoiceNo, chequeDate, chequeNumber, amount);
                $('#gridAccountParticularInput').focus();
                calculateChequeLowerTotal();
                calculateLowerSummaryTotal();
            });
            $('#invoiceReceivingChequeTable').on('click', '.chequeRowEdit', async function (e) {
                e.preventDefault();
                const row = $(this).closest('tr');
                const editChequeListNumber = row.find('td.chequeListNumber').text();
                const editParticular = row.find('td.particular').text();
                const editBankName = row.find('td.bankName').text();
                const editChequeInHandId = row.find('td.chequeInHandName').data('cheque_in_hand_id');
                const editChequeInHandName = row.find('td.chequeInHandName').text();
                const editInvoiceNo = row.find('td.invoiceNo').text();
                const editChequeDate = row.find('td.chequeDate').text();
                const editChequeNumber = row.find('td.chequeNumber').text();
                const editAmount = parseNumber(row.find('td.amount').text());

                $('#gridAccountChequeListNumberInput').val(editChequeListNumber);
                $('#gridAccountParticularInput').val(editParticular);
                $('#gridAccountBankNameInput').val(editBankName);
                triggerAndRenderOptions($('#chequeInHandDropdown'), editChequeInHandName, editChequeInHandId, false);
                $('#gridAccountInvoiceNoInput').val(editInvoiceNo);
                $('#gridAccountChequeDateInput').val(editChequeDate);
                $('#gridAccountChequeNumberInput').val(editChequeNumber);
                $('#gridAccountAmountInput').val(editAmount);
                row.remove();
                calculateChequeLowerTotal();
                calculateLowerSummaryTotal();
            });

            $('#invoiceReceivingChequeTable').on('click', '.chequeRowRemove', async function (e) {
                e.preventDefault();
                const row = $(this).closest('tr');
                const editChequeListNumber = row.find('td.chequeListNumber').text();
                // if (parseNumber(editChequeListNumber) > 0) {
                //     const flg = await validateChequeReceiveVoucher(editChequeListNumber);
                //     if (flg) {
                //         return;
                //     }
                // }
                row.remove();
                calculateChequeLowerTotal();
                calculateLowerSummaryTotal();
            });

            $('#invoiceReceivingFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getInvoiceReceivingDataTable("", fromDate, toDate);
            });
            $('#invoiceReceivingSyncAlt').on('click', function (e) {
                e.preventDefault();
                getInvoiceReceivingDataTable();
            });
            $('#accountDropdown').on('change', async function () {
                $('#saleCommissionPercentage').val(0);
                const accountId = $(this).val();
                const voucherDate = $('#current_date').val();
                await getAccountBalanced(accountId, voucherDate);
                $('#gridItemCurrencyDropdown').prop('disabled', true).trigger('change.select2');
            });
            $('.getPendingInvoiceReceiving').on('click', function (e) {
                e.preventDefault();
                const accountId = $('#accountDropdown').val();
                if (parseNumber(accountId) > 0) {
                    $('#checkAll').prop('checked', false).trigger('change');
                    const voucherDate = $('#current_date').val();
                    getPendingCommercialInvoiceDataTable(accountId, voucherDate);
                } else {
                    AlertComponent.getAlertMessage({ title: "Error!", message: "please select a customer", type: "danger" });
                }
            });
            $('.btnSave').on('click', function (e) {
                e.preventDefault();
                self.initSave();
            });
            $('body').on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                var invoiceReceivingId = parseNumber($(this).data('invoice_receiving_id'));
                getInvoiceReceivingById(invoiceReceivingId);
                $('a[href="#Main"]').trigger('click');
            });
            $('body').on('click', '.btnPrint', function (e) {
                const invoiceReceivingId = $(this).data('invoice_receiving_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(base_url + 'application/views/reportprints/thermal_pdf.php', "Proforma Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(invoiceReceivingId, settingPrintDefault, 'lg', '');
                }
            });
            $('body').on('click', '.btnPrintA4WithHeader', function (e) {
                const invoiceReceivingId = $(this).data('invoice_receiving_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Proforma Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(invoiceReceivingId, 1, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintA4WithOutHeader', function (e) {
                const invoiceReceivingId = $(this).data('invoice_receiving_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Proforma Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(invoiceReceivingId, 2, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintB5WithHeader', function (e) {
                const invoiceReceivingId = $(this).data('invoice_receiving_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Proforma Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(invoiceReceivingId, 3, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintB5WithOutHeader', function (e) {
                const invoiceReceivingId = $(this).data('invoice_receiving_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Proforma Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(invoiceReceivingId, 4, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintASEmail', function (e) {
                const invoiceReceivingId = $(this).data('invoice_receiving_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                getSendMail(invoiceReceivingId, settingPrintDefault, 'lg', '', true);
            });
            $('body').on('click', '.btnDelete', function (e) {
                const invoiceReceivingId = $(this).data('invoice_receiving_id');
                e.preventDefault();
                if (invoiceReceivingId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', function (result) {
                        if (result) {
                            deleteVoucher(invoiceReceivingId);
                        }
                    });
                }
            });

            $('.btnReset').on('click', function (e) {
                e.preventDefault();
                resetVoucher();
            });
            shortcut.add("F10", function () {
                $('.btnSave').get()[0].click();
            });
            shortcut.add("F1", function () {
                $('a[href="#party-lookup"]').get()[0].click();
            });
            shortcut.add("F5", function () {
                $('#resetButton').first().trigger('click');
            });

            invoiceReceiving.fetchRequestedVr();
        },

        // prepares the data to save it into the database
        initSave: function () {
            const alertMessage = validateSave();
            if (alertMessage) {
                return _getAlertMessage('Error!', alertMessage, 'danger');;
            }

            const rowsCount = $('#invoiceReceivingTable').find('tbody tr').length;
            if (rowsCount > 0) {
                const saveObj = getSaveObject();
                const data = {
                    'id': saveObj.id,
                    'chk_date': $('#chk_date').val(),
                    'vrdate': $('#cur_date').val(),
                    'invoiceReceiving': JSON.stringify(saveObj.invoiceReceiving),
                    'invoiceReceivingDetail': JSON.stringify(saveObj.invoiceReceivingDetail),
                    'invoiceReceivingBankDetail': JSON.stringify(saveObj.invoiceReceivingBankDetail),
                    'invoiceReceivingChequeDetail': JSON.stringify(saveObj.invoiceReceivingChequeDetail)
                };
                saverRequest.sendRequest(data);
            } else {
                AlertComponent.getAlertMessage({ title: "Error!", message: "No data found to save", type: "danger" });
            }
        },
        fetchRequestedVr: function () {

            var vrnoa = general.getQueryStringVal('vrnoa');
            vrnoa = parseInt(vrnoa);
            $('#txtVrnoa').val(vrnoa);
            $('#txtVrnoaHidden').val(vrnoa);
            if (!isNaN(vrnoa)) {
                getInvoiceReceivingById(vrnoa);
            }
        }
    };

};

const invoiceReceiving = new InvoiceReceiving();
invoiceReceiving.init();

// Corrected function to match the HTML ID
$(function () {
    function getAccountDetailByMop(mop) {
        switch (mop) {
            case 'Cash':
                return dropdownOptions.getCashAccountDetailAll;
            case 'Bank Payment':
                return dropdownOptions.getBankAccountDetailAll;
            case 'Reference':
                return dropdownOptions.getAccountDetailAll;
            default:
                return dropdownOptions.getAllCustomerLevelAccount;
        }
    }
    new DynamicOption('#accountDropdown', {
        requestedUrl: dropdownOptions.getAllCustomerLevelAccount,
        placeholderText: 'Choose Customer'
    });
    var referenceAccountDropdown = new DynamicOption('#referenceAccountDropdown', {
        requestedUrl: getAccountDetailByMop($('#referenceMopDropdown').val()),
        placeholderText: 'Choose Account',
        mop: $('#referenceMopDropdown').val()
    });
    // Update the referenceAccountDropdown when MOP changes
    $('#referenceMopDropdown').on('change', async function () {
        const mop = $(this).val();
        const optionsAccountUrl = getAccountDetailByMop(mop);

        const selector = $('#referenceAccountDropdown');
        selector.empty().trigger('change.select2');

        if (mop && mop.length > 0) {
            const placeholder = "Choose Account";
            reinitializeSelect2WithoutAjax(selector, placeholder);

            referenceAccountDropdown.updateOptions({
                requestedUrl: optionsAccountUrl,
                placeholderText: placeholder,
                mop: mop
            });
        }
    });
    new DynamicOption("#chequeInHandDropdown", {
        requestedUrl: dropdownOptions.getBankAccountDetailAll,
        placeholderText: "Cheque In Hand",
        allowClear: true,
    });
});
