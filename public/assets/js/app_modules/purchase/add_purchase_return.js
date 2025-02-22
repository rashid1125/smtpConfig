"use strict";
import AlertComponent from "../../../../js/components/AlertComponent.js";
// assets/js/app_modules/purchaseReturn/add_purchase_order.js
import { AMOUNT_ROUNDING, QTY_ROUNDING } from "../../../../js/components/GlobalConstants.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import GridItemRowCalculator from "../../../../js/components/GridItemRowCalculator.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import SaverRequest from "../../../../js/components/SaverRequest.js";
import TableRowAppended from "../../../../js/components/TableRowAppended.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, isPreviousBalance, getValueIfDataExists, handlePercentageOrAmountInput, ifNull, isPositive, parseNumber, setFinancialYearDate, updateDatepickerWithFormattedDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek, updateFormattedDate } from "../commonFunctions/CommonFunction.js";
const propsForTable = {
    userCacheId: uuidv4(),
    isDepartmentDisplay: true,
    actionButton: 'd-none',
};

const PageBaseURL = `${base_url}`;
var PurchaseReturn = function () {
    const totalAmountGetter = () => getNumText($('.gridItemTotalAmountInclTax'));
    const purchaseModuleSettings = _purchaseModuleSettings;

    const saverRequest = new SaverRequest(
        PageBaseURL,
        general,
        {
            requestedUrl: 'purchaseReturn/save',
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

    var getPurchaseReturnById = async function (purchaseReturnId) {
        resetFields();
        const response = await makeAjaxRequest('GET', `${PageBaseURL}/purchaseReturn/getPurchaseReturnById`, { 'purchaseReturnId': purchaseReturnId });
        if (response && response.status == false && response.error !== "") {
            _getAlertMessage('Error!', response.message, 'danger');
        } else if (response && response.status == false && response.message !== "") {
            _getAlertMessage('Information!', response.message, 'info');
            resetVoucher();
        } else {
            populateData(response.data);
        }
    };

    var populateData = function (data) {
        $('#purchaseReturnHiddenId').val(data.id);

        appendSelect2ValueIfDataExists("accountDropdown", "party", "pid", "name", data, { disabled: true, triggerChange: true });
        appendSelect2ValueIfDataExists("purchaseOfficerDropdown", "purchase_officer", "id", "name", data, { disabled: true });

        $('#returnOutwardVrnoa').val(getValueIfDataExists(data, "return_outward.vrnoa", null));
        $('#returnOutwardIdHidden').val(getValueIfDataExists(data, "return_outward.id", null));

        updateDatepickerWithFormattedDate('current_date', data.vrdate);
        updateDatepickerWithFormattedDate('chk_date', data.vrdate);
        updateDatepickerWithFormattedDate('biltyDate', data.bilty_date);

        $('#supplierName').val(data.supplier_name);
        $('#supplierMobile').val(data.supplier_mobile);
        $('#receivers_list').val(data.prepared_by);
        $('#biltyNumber').val(data.bilty_number);

        appendSelect2ValueIfDataExists("transporterDropdown", "transporter", "transporter_id", "name", data);

        $('#txtDiscount').val(data.discount_percentage);
        $('#txtDiscAmount').val(data.discount_amount);
        $('#txtExpense').val(data.expense_percentage);
        $('#txtExpAmount').val(data.expense_amount);
        $('#txtTax').val(data.further_tax_percentage);
        $('#txtTaxAmount').val(data.further_tax_amount);
        $('#freightAmount').val(parseNumber(data.freight_amount).toFixed(AMOUNT_ROUNDING));
        $('#txtNetAmount').val(data.net_amount);
        $('#freightTypeDropdown').val(data.freight_type_id).trigger('change.select2');
        const tableAppended = new TableRowAppended('#purchase_table', propsForTable);
        $.each(data.purchase_return_detail, function (index, elem) {
            elem.detail_remarks = ifNull(elem.detail_remarks, "");
            elem.department_details = elem.department_detail;
            tableAppended.appendRow(elem);
        });
        calculateLowerTotal();
    };

    var getSaveObject = function () {
        const purchaseReturn = {};
        const purchaseReturnDetail = [];

        purchaseReturn.id = $('#purchaseReturnHiddenId').val();
        purchaseReturn.vrdate = $('#current_date').val();
        purchaseReturn.chk_date = $('#chk_date').val();
        purchaseReturn.party_id = $('#accountDropdown').val();
        purchaseReturn.purchase_officer_id = $('#purchaseOfficerDropdown').val();
        purchaseReturn.return_outward_id = $('#returnOutwardIdHidden').val();
        purchaseReturn.supplier_name = $('#supplierName').val();
        purchaseReturn.supplier_mobile = $('#supplierMobile').val();
        purchaseReturn.prepared_by = $('#receivers_list').val();
        purchaseReturn.bilty_number = $('#biltyNumber').val();
        purchaseReturn.bilty_date = $('#biltyDate').val();
        purchaseReturn.transporter_id = $('#transporterDropdown').val();
        purchaseReturn.freight_amount = $('#freightAmount').val();
        purchaseReturn.freight_type_id = $('#freightTypeDropdown').val();
        purchaseReturn.discount_percentage = $('#txtDiscount').val();
        purchaseReturn.discount_amount = $('#txtDiscAmount').val();
        purchaseReturn.expense_percentage = $('#txtExpense').val();
        purchaseReturn.expense_amount = $('#txtExpAmount').val();
        purchaseReturn.further_tax_percentage = $('#txtTax').val();
        purchaseReturn.further_tax_amount = $('#txtTaxAmount').val();
        purchaseReturn.net_amount = $('#txtNetAmount').val();

        $('#purchase_table').find('tbody tr').each(function (index, elem) {
            const gridItemDetail = {};
            gridItemDetail.item_id = $.trim($(elem).find('td.itemName').data('item_id'));
            gridItemDetail.detail_remarks = $.trim($(elem).find('td.itemName textarea').val());
            gridItemDetail.stock_keeping_method_id = $.trim($(elem).find('td.itemName').data('stock_keeping_method_id'));
            gridItemDetail.rate_type_id = $.trim($(elem).find('td.rateTypeName').data('rate_type_id'));
            gridItemDetail.warehouse_id = $.trim($(elem).find('td.department_id').data('department_id'));
            gridItemDetail.division_factor = $.trim($(elem).find('td.rateTypeName').data('division_factor'));
            gridItemDetail.qty = $.trim($(elem).find('td.qty').text());
            gridItemDetail.weight = $.trim($(elem).find('td.weight').text());
            gridItemDetail.rate = getNumVal($(elem).find('td input.rate'));
            gridItemDetail.rate_per_kg = getNumVal($(elem).find('td input.ratePerKG'));
            gridItemDetail.gross_amount = $.trim($(elem).find('td.gAmount').text());
            gridItemDetail.discount_percentage = getNumVal($(elem).find('td input.discountPercentage'));
            gridItemDetail.discount_per_unit = getNumVal($(elem).find('td input.discountPerUnit'));
            gridItemDetail.discount_amount = getNumText($(elem).find('td.discountAmount'));
            gridItemDetail.rate_per_unit = getNumText($(elem).find('td.ratePerUnit'));
            gridItemDetail.amount_excl_tax = getNumText($(elem).find('td.amountExclTax'));
            gridItemDetail.tax_percentage = getNumVal($(elem).find('td input.taxPercentage'));
            gridItemDetail.tax_amount = $.trim($(elem).find('td.taxAmount').text());
            gridItemDetail.amount_incl_tax = $.trim($(elem).find('td.amountInclTax').text());
            purchaseReturnDetail.push(gridItemDetail);
        });
        var data = {};

        data.purchaseReturn = JSON.stringify(purchaseReturn);
        data.purchaseReturnDetail = JSON.stringify(purchaseReturnDetail);
        data.id = $('#purchaseReturnHiddenId').val();
        data.chk_date = $('#chk_date').val();
        return data;
    };


    var printVoucher = function (vrnoa, paperSize, printSize, wrate = 0, isSendEmail = false) {
        try {
            const __etype = 'purchase_returns';
            const __vrnoa = vrnoa;
            const previousBalance = isPreviousBalance();
            const __lang = ($('#print_lang').val()) ? $('#print_lang').val() : 1;
            const __url = PageBaseURL + '/doc/getPrintVoucherPDF/?etype=' + __etype + '&vrnoa=' + __vrnoa + '&pre_bal_print=' + previousBalance + '&paperSize=' + paperSize + '&printSize=' + printSize + '&wrate=' + (wrate ? wrate : 0) + '&language_id=' + __lang;
            const _encodeURI = encodeURI(__url);
            openPrintOnSettingConfiguration(_encodeURI);
        } catch (error) {
            console.error(error);
        }
    };

    const getSendMail = (vrnoa, paperSize, printSize, wrate = 0, email = "") => {
        const __etype = 'purchase_returns';
        const __vrnoa = vrnoa;
        const previousBalance = isPreviousBalance();
        const __lang = $('#print_lang').val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, previousBalance, paperSize, printSize, wrate, __lang, email);
    };



    // checks for the empty fields
    var validateSave = function () {
        var errorFlag = false;
        const currentDate = $('#current_date');
        const accountDropdown = $('#accountDropdown');
        const freightAmount = $('#freightAmount');
        const transporterDropdown = $('#transporterDropdown');
        const freightTypeDropdown = $('#freightTypeDropdown');

        $('#select2-accountDropdown-container').parent().addClass('inputerror');

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!currentDate.val()) {
            currentDate.addClass('inputerror');
            errorFlag = true;
        }

        if (getNumVal($('#txtNetAmount')) < 0) {
            $('#txtNetAmount').addClass('inputerror');
            errorFlag = true;
        }

        if (!accountDropdown.val()) {
            $('#select2-accountDropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }
        const checkFreightTypeDropdown = [0, 1, 2, 3];
        if (getNumVal(freightAmount) > 0) {
            if (!getNumVal(transporterDropdown)) {
                $('#select2-transporterDropdown-container').parent().addClass('inputerror');
                errorFlag = true;
            }

            // Check if the selected freight type is within the allowed range
            const selectedFreightType = getNumVal(freightTypeDropdown);
            if (!checkFreightTypeDropdown.includes(selectedFreightType)) {
                $('#select2-freightTypeDropdown-container').parent().addClass('inputerror');
                errorFlag = true;
            }
        }

        if (getNumVal(transporterDropdown) > 0) {
            if (getNumVal(freightAmount) <= 0) {
                freightAmount.addClass('inputerror');
                errorFlag = true;
            }
        }
        return errorFlag;
    };

    var deleteVoucher = async function (vrnoa) {
        general.disableSave();
        try {
            const response = await makeAjaxRequest('delete', `${PageBaseURL}/purchaseReturn/delete`, { 'chk_date': $('#chk_date').val(), 'vrdate': $('#cur_date').val(), 'vrnoa': vrnoa });
            if (response && response.status == false && response.error !== "") {
                _getAlertMessage('Error!', response.message, 'danger');
            } else if (response && response.status == false && response.message !== "") {
                _getAlertMessage('Information!', response.message, 'info');
                resetVoucher();
            } else {
                _getAlertMessage('Successfully!', response.message, 'success');
                resetVoucher();
            }
        } finally {
            general.enableSave();
        }
    };


    var calculateLowerTotal = function () {
        let gridItemTotalQty = 0;
        let gridItemTotalWeight = 0;
        let gridItemTotalGrossAmount = 0;
        let gridItemTotalDiscountAmount = 0;
        let gridItemTotalAmountExclTax = 0;
        let gridItemTotalTaxAmount = 0;
        let gridItemTotalAmountInclTax = 0;

        $("#purchase_table").find("tbody tr").each(function (index, elem) {
            gridItemTotalQty += getNumText($(this).closest('tr').find('td.qty'));
            gridItemTotalWeight += getNumText($(this).closest('tr').find('td.weight'));
            gridItemTotalGrossAmount += getNumText($(this).closest('tr').find('td.gAmount'));
            gridItemTotalDiscountAmount += getNumText($(this).closest('tr').find('td.discountAmount'));
            gridItemTotalAmountExclTax += getNumText($(this).closest('tr').find('td.amountExclTax'));
            gridItemTotalTaxAmount += getNumText($(this).closest('tr').find('td.taxAmount'));
            gridItemTotalAmountInclTax += getNumText($(this).closest('tr').find('td.amountInclTax'));
        });

        $('.gridItemTotalQty').text(parseNumber(gridItemTotalQty).toFixed(QTY_ROUNDING));
        $('.gridItemTotalWeight').text(parseNumber(gridItemTotalWeight).toFixed(WEIGHT_ROUNDING));
        $('.gridItemTotalGrossAmount').text(parseNumber(gridItemTotalGrossAmount).toFixed(AMOUNT_ROUNDING));
        $('.gridItemTotalAmountExclTax').text(parseNumber(gridItemTotalAmountExclTax).toFixed(AMOUNT_ROUNDING));
        $('.gridItemTotalTaxAmount').text(parseNumber(gridItemTotalTaxAmount).toFixed(AMOUNT_ROUNDING));
        $('.gridItemTotalAmountInclTax').text(parseNumber(gridItemTotalAmountInclTax).toFixed(AMOUNT_ROUNDING));

        var _DiscAmount = getNumVal($('#txtDiscAmount'));
        var _ExpenseAmount = getNumVal($('#txtExpAmount'));
        var _TaxAmount = getNumVal($('#txtTaxAmount'));
        var _FreightAmount = getNumVal($('#freightAmount'));
        let NetAmount = 0;
        NetAmount = parseFloat(gridItemTotalAmountInclTax) - parseFloat(_DiscAmount) + parseFloat(_ExpenseAmount) + parseFloat(_TaxAmount);
        const freightType = parseNumber($('#freightTypeDropdown').val());
        if (freightType === 1) {
            NetAmount = parseFloat(NetAmount) - parseFloat(_FreightAmount);
        }
        $('#txtNetAmount').val(getSettingDecimal(NetAmount));
    };

    var resetVoucher = function () {
        resetFields();
        getPurchaseReturnDataTable();
        loadSettingConfiguration();
    };

    var resetFields = function () {
        const resetArray = [
            'purchaseReturnHiddenId',
            'current_date',
            'chk_date',
            'txtGridRemarks',
            'txtDiscount',
            'txtDiscAmount',
            'txtExpense',
            'txtExpAmount',
            'txtTax',
            'txtTaxAmount',
            'txtNetAmount',
            'supplierName',
            'supplierMobile',
            'receivers_list',
            'biltyNumber',
            'biltyDate',
            'transporterDropdown',
            'freightAmount',
            'freightTypeDropdown',
        ];
        clearValueAndText(resetArray, '#');

        const resetDisabledArray = [
            { selector: 'returnOutwardVrnoa', options: { disabled: true } },
            { selector: 'returnOutwardIdHidden', options: { disabled: true } },
            { selector: 'accountDropdown', options: { disabled: true } },
            { selector: 'purchaseOfficerDropdown', options: { disabled: true } },
        ];
        clearValueAndText(resetDisabledArray);



        const resetClassArray = [
            'gridItemTotalQty',
            'gridItemTotalWeight',
            'gridItemTotalGrossAmount',
            'gridItemTotalAmountExclTax',
            'gridItemTotalTaxAmount',
            'gridItemTotalAmountInclTax',
        ];
        clearValueAndText(resetClassArray, '.');
        $('#freightTypeDropdown').val("0").trigger('change.select2');
        $('#purchase_table tbody tr').remove();
        $('#purchase_tableReport tbody tr').remove();
        $('#laststockLocation_table tbody tr').remove();

        $('#party_p').html('');
        $('#otherItemInformation').html('');
    };

    const loadSettingConfiguration = () => {
        $('#txtTax').val(parseNumber(setting_configure[0].ftax).toFixed(2));
    };

    let pendingReturnOutwardDataTable = undefined;
    const getPendingReturnOutwardDataTable = (vrnoa = 0) => {

        if (typeof pendingReturnOutwardDataTable !== 'undefined') {
            pendingReturnOutwardDataTable.destroy();
            $('#pendingReturnOutwardDataTableTbody').empty();
        }
        pendingReturnOutwardDataTable = $("#pendingReturnOutwardDataTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: PageBaseURL + '/returnOutward/getPendingReturnOutwardDataTable',
                type: 'GET',
                data: { 'vrnoa': vrnoa },
                dataSrc: function (json) {
                    if (json.status === false) {
                        AlertComponent._getAlertMessage('Error', json.message, "danger");
                        return [];
                    } else {
                        return json.data;
                    }
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
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    data: "vrnoa",
                    name: "vrnoa",
                    className: "returnOutwardVrnoa"
                },
                {
                    data: "vrdate",
                    name: "vrdate",
                    className: "returnOutwardVrdate",
                    render: function (data) {
                        return updateFormattedDate(data);
                    }
                },
                {
                    data: "party.name",
                    name: "party.name",
                    className: "supplierName"
                },
                {
                    data: null,
                    className: "select text-right",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        return `<button type="button" data-dismiss="modal" class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white mr-2 mb-2 flex-1 populatePendingReturnOutward" data-vrnoa="${data.id}"><i class='fa fa-edit'></i></button>`;
                    }
                }
            ],
            createdRow: function (row, data, dataIndex) {
                $(row).addClass('group hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50');
                $('td', row).addClass('py-1 px-1 text-md align-middle');
            }
        });
        $('#pendingReturnOutwardDataTableModal').modal('show');
    };
    var getPendingReturnOutwardById = async function (returnOutwardId) {
        resetFields();

        const response = await makeAjaxRequest('GET', `${PageBaseURL}/returnOutward/fetch`, { 'returnOutwardId': returnOutwardId });
        if (response && response.status == false && response.error !== "") {
            _getAlertMessage('Error!', response.message, 'danger');
        } else if (response && response.status == false && response.message !== "") {
            _getAlertMessage('Information!', response.message, 'info');
            resetVoucher();
        } else {
            populatePendingReturnOutward(response.data);
        }
    };

    var populatePendingReturnOutward = function (data) {

        $('#returnOutwardIdHidden').val(data.id);
        $('#returnOutwardVrnoa').val(data.vrnoa);

        appendSelect2ValueIfDataExists("accountDropdown", "party", "pid", "name", data, { disabled: true });
        appendSelect2ValueIfDataExists("purchaseOfficerDropdown", "purchase_officer", "id", "name", data, { disabled: true });

        $('#supplierName').val(data.supplier_name);
        $('#supplierMobile').val(data.supplier_mobile);
        $('#receivers_list').val(data.prepared_by);
        $('#biltyNumber').val(data.bilty_number);

        populateDateValue('biltyDate', data.bilty_date);
        appendSelect2ValueIfDataExists("transporterDropdown", "transporter", "transporter_id", "name", data);

        $('#txtDiscount').val(parseNumber(data.discount_percentage).toFixed(2));
        $('#txtDiscAmount').val(parseNumber(data.discount_amount).toFixed(AMOUNT_ROUNDING));
        $('#txtExpense').val(parseNumber(data.expense_percentage).toFixed(2));
        $('#txtExpAmount').val(parseNumber(data.expense_amount).toFixed(AMOUNT_ROUNDING));
        $('#txtTax').val(parseNumber(data.further_tax_percentage).toFixed(2));
        $('#txtTaxAmount').val(parseNumber(data.further_tax_amount).toFixed(AMOUNT_ROUNDING));
        $('#freightAmount').val(parseNumber(data.freight_amount).toFixed(AMOUNT_ROUNDING));
        $('#txtNetAmount').val(parseNumber(data.net_amount).toFixed(AMOUNT_ROUNDING));
        $('#freightTypeDropdown').val(data.freight_type_id).trigger('change');
        const tableAppended = new TableRowAppended('#purchase_table', propsForTable);
        $.each(data.return_outward_detail, function (index, elem) {
            elem.detail_remarks = ifNull(elem.detail_remarks, "");
            tableAppended.appendRow(elem);
        });
        $('input.rate').trigger('input');
    };

    let purchaseReturnDataTable = undefined;
    const getPurchaseReturnDataTable = (purchaseReturnId = null, fromDate = null, toDate = null) => {
        if (typeof purchaseReturnDataTable !== 'undefined') {
            purchaseReturnDataTable.destroy();
            $('#purchaseReturnDataTableTbody').empty();
        }
        purchaseReturnDataTable = $("#purchaseReturnDataTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: PageBaseURL + '/purchaseReturn/getPurchaseReturnDataTable',
                type: 'GET',
                data: { 'purchaseReturnId': purchaseReturnId, fromDate: fromDate, toDate: toDate },
                dataSrc: function (json) {
                    if (json.status === false) {
                        AlertComponent._getAlertMessage('Error', json.message, "danger");
                        return [];
                    } else {
                        return json.data;
                    }
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
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    data: "vrnoa",
                    name: "vrnoa",
                    className: "returnOutwardVrnoa"
                },
                {
                    data: "vrdate",
                    name: "vrdate",
                    className: "returnOutwardVrdate",
                    render: function (data) {
                        return updateFormattedDate(data);
                    }
                },
                {
                    data: "return_outward.vrnoa",
                    name: "returnOutward.vrnoa",
                    className: "returnOutwardVrnoa"
                },
                {
                    data: "return_outward.vrdate",
                    name: "returnOutward.vrdate",
                    className: "returnOutwardVrdate",
                    render: function (data) {
                        return updateFormattedDate(data);
                    }
                },
                {
                    data: "party.name",
                    name: "party.name",
                    className: "supplierName"
                },
                {
                    data: "net_amount",
                    name: "net_amount",
                    className: "net_amount text-right",
                    render: function (data) {
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
						<div class="btn-group dropleft">
							<button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								More
							</button>
							<div class="dropdown-menu">
								<a class="dropdown-item btnEditPrevVoucher" data-purchase_return_id="${row.id}" href="#"><i class='fa fa-edit'></i> Edit Voucher</a>

                            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                            <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                            <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                            <li class="dropdown-item"><a href="#" class="btnPrint" data-purchase_return_id="${row.id}">Print Voucher</a></li>
                            <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-purchase_return_id="${row.id}"> Print a4 with header</a></li>
                            <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-purchase_return_id="${row.id}"> Print a4 without header </a></li>
                            <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-purchase_return_id="${row.id}"> Print b5 with header</a></li>
                            <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-purchase_return_id="${row.id}"> Print b5 without header </a></li>
                        </ul>

								<a class="dropdown-item btnDelete" data-purchase_return_id="${row.id}" href="#"><i class='fa fa-trash'></i> Delete Voucher</a>
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" href="#">Send Email</a>
							</div>
						</div>`;
                    }
                }
            ],
            createdRow: function (row, data, dataIndex) {
                $('td', row).addClass('py-1 px-1 text-md align-middle');
            }
        });
    };

    return {

        init: function () {
            this.bindUI();
            $('.select2').select2();
            if (! propsForTable.moduleSettings) {
                propsForTable.moduleSettings = {};
            }
            propsForTable.moduleSettings.stockKeepingMethodId = parseNumber(moduleSettings.stock_keeping_method_id);
            getPurchaseReturnDataTable();
            loadSettingConfiguration();
        },

        bindUI: function () {

            $('[data-toggle="tooltip"]').tooltip();
            const self = this;

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

            /**
             * * This event working Grid Input Change Rate|Discount Percentage|Discount|Tax
             * */
            // Attach input event listeners for each row
            $('#purchase_table').on('input', 'tr input.rate,tr input.ratePerKG, tr input.discountPercentage,tr input.discountPerUnit,tr input.taxPercentage', function (event) {
                const currentRow = $(this).closest('tr');
                const gridItemRowCalculator = new GridItemRowCalculator(currentRow, purchaseModuleSettings);
                gridItemRowCalculator.calculate(event, currentRow);
            });

            $('#txtDiscount, #txtDiscAmount, #txtExpense, #txtExpAmount, #txtTax, #txtTaxAmount').on('input', function () {
                const totalAmount = totalAmountGetter();
                const isCalculatingPercentage = $(this).attr('id').includes('Amount');

                if ($(this).is('#txtTax, #txtTaxAmount')) {
                    handlePercentageOrAmountInput('txtTax', 'txtTaxAmount', totalAmount, isCalculatingPercentage);
                } else if ($(this).is('#txtDiscount, #txtDiscAmount')) {
                    handlePercentageOrAmountInput('txtDiscount', 'txtDiscAmount', totalAmount, isCalculatingPercentage);
                } else if ($(this).is('#txtExpense, #txtExpAmount')) {
                    handlePercentageOrAmountInput('txtExpense', 'txtExpAmount', totalAmount, isCalculatingPercentage);
                }
                calculateLowerTotal();
            });

            $('#freightTypeDropdown').on('change', function (e) {
                e.preventDefault();
                calculateLowerTotal();
            });

            $('#freightAmount').on('input', function (e) {
                e.preventDefault();
                calculateLowerTotal();
            });

            $('#purchaseReturnSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getPurchaseReturnDataTable();
            });

            $('#purchaseReturnFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getPurchaseReturnDataTable("", fromDate, toDate);
            });

            $('#accountDropdown').on('change', function () {
                if (parseNumber(purchaseModuleSettings.show_account_information) == 1) {
                    const accountId = $(this).val();
                    const voucherDate = $('#current_date').val();
                    getAccountBalanced(accountId, voucherDate);
                }
            });

            $('#searchReturnOutwardVrnoa').on('click', function (e) {
                e.preventDefault();
                getPendingReturnOutwardDataTable();
            });

            $('body').on('click', '.modal-lookup .populatePendingReturnOutward', function (e) {
                e.preventDefault();
                const inwardGatePassId = parseNumber($(this).data('vrnoa'));
                resetVoucher();
                getPendingReturnOutwardById(inwardGatePassId);
            });

            $('body').on('click', '.btnEditPrevVoucher', async function (e) {
                e.preventDefault();
                const purchaseReturnId = parseNumber($(this).data('purchase_return_id'));
                await getPurchaseReturnById(purchaseReturnId);
                $('a[href="#Main"]').trigger('click');
            });

            $('body').on('click', '.btnPrint', function (e) {
                const purchaseReturnId = $(this).data('purchase_return_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(PageBaseURL + 'application/views/reportPrints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(purchaseReturnId, settingPrintDefault, 'lg', '');
                }
            });

            $('body').on('click', '.btnPrintA4WithHeader', function (e) {
                const purchaseReturnId = $(this).data('purchase_return_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportPrints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(purchaseReturnId, 1, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintA4WithOutHeader', function (e) {
                const purchaseReturnId = $(this).data('purchase_return_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportPrints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(purchaseReturnId, 2, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintB5WithHeader', function (e) {
                const purchaseReturnId = $(this).data('purchase_return_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportPrints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(purchaseReturnId, 3, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintB5WithOutHeader', function (e) {
                const purchaseReturnId = $(this).data('purchase_return_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportPrints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(purchaseReturnId, 4, 'lg', "");
                }
            });

            $('body').on('click', '.btnPrintASEmail', function (e) {
                const purchaseReturnId = $(this).data('purchase_return_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                getSendMail(purchaseReturnId, settingPrintDefault, 'lg', '', true);
            });

            $('.btnSave').on('click', function (e) {
                e.preventDefault();
                self.initSave();
            });

            $('.btnReset').on('click', function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $('body').on('click', '.btnDelete', async function (e) {
                const purchaseReturnId = $(this).data('purchase_return_id');
                e.preventDefault();
                if (purchaseReturnId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', async function (result) {
                        if (result) {
                            await deleteVoucher(purchaseReturnId);
                        }
                    });
                }
            });

            shortcut.add("F10", function () {
                $('.btnSave').get()[0].click();
            });
            shortcut.add("F9", function () {
                $('.btnPrint').get()[0].click();
            });
            shortcut.add("F5", function () {
                $('.btnReset').get()[0].click();
            });
            shortcut.add("F12", function () {
                $('.btnDelete').get()[0].click();
            });
        },

        // prepares the data to save it into the database
        initSave: function () {
            const validateSaveError = validateSave();
            if (!validateSaveError) {
                const rowsCount = $('#purchase_table').find('tbody tr').length;
                if (rowsCount > 0) {
                    const saveObj = getSaveObject();
                    saverRequest.sendRequest(saveObj);
                } else {
                    _getAlertMessage('Error!', "No data found to save", 'danger');
                }
            } else {
                _getAlertMessage('Error!', "Correct the errors...", 'danger');
            }
        },
        // instead of resting values reload the page because its cruel to write to much code to simply do that
        resetVoucher: function () {
            resetVoucher();
        }
    };
};

var purchaseReturn = new PurchaseReturn();
purchaseReturn.init();
// Corrected function to match the HTML ID
document.addEventListener("DOMContentLoaded", function () {
    new DynamicOption('#accountDropdown', {
        requestedUrl: dropdownOptions.purchaseAccountLevel3,
        placeholderText: 'Choose Supplier'
    });

    new DynamicOption('#purchaseOfficerDropdown', {
        requestedUrl: dropdownOptions.getAllOfficer,
        placeholderText: 'Choose Purchase Officer',
        allowClear: true,
    });

    new DynamicOption('#transporterDropdown', {
        requestedUrl: dropdownOptions.getTransporterAll,
        placeholderText: 'Choose Transporter',
        allowClear: true
    });
});
