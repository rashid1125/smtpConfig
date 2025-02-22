// assets/js/app_modules/purchase/add_sale_order.js
import { AMOUNT_ROUNDING, QTY_ROUNDING, WEIGHT_ROUNDING } from "../../../../js/components/GlobalConstants.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, getItemRateTypeById, handlePercentageOrAmountInput, ifNull, isPositive, parseNumber, setFinancialYearDate, updateDatepickerWithFormattedDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek, updateFormattedDate } from "../commonFunctions/CommonFunction.js";
import { baseConfiguration } from "../../../../js/components/ConfigurationManager.js";
import { calculateAmountExclTaxGridItemRow } from "../../../../js/components/calculations/calculateAmountExclTaxGridItemRow.js";
import { calculateAmountInclTaxGridItemRow } from "../../../../js/components/calculations/calculateAmountInclTaxGridItemRow.js";
import { calculateDiscountAmountGridItemRow } from "../../../../js/components/calculations/calculateDiscountAmountGridItemRow.js";
import { calculateDiscountPercentageGridItemRow } from "../../../../js/components/calculations/calculateDiscountPercentageGridItemRow.js";
import { calculateDiscountPerUnitGridItemRow } from "../../../../js/components/calculations/calculateDiscountPerUnitGridItemRow.js";
import { calculateGrossAmountGridItemRow } from "../../../../js/components/calculations/calculateGrossAmountGridItemRow.js";
import { calculateRateGridItemRow } from "../../../../js/components/calculations/calculateRateGridItemRow.js";
import { calculateRatePerKgGridItemRow } from "../../../../js/components/calculations/calculateRatePerKgGridItemRow.js";
import { calculateRatePerUnitGridItemRow } from "../../../../js/components/calculations/calculateRatePerUnitGridItemRow.js";
import { calculateTaxAmountGridItemRow } from "../../../../js/components/calculations/calculateTaxAmountGridItemRow.js";
import { calculateTaxPercentageGridItemRow } from "../../../../js/components/calculations/calculateTaxPercentageGridItemRow.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { propsForTable } from "../commonFunctions/PopulateDataOnVouchers.js";
import { validPercentage } from "../../../../js/components/Helpers.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import GridItemRowCalculator from "../../../../js/components/GridItemRowCalculator.js";
import SaverRequest from "../../../../js/components/SaverRequest.js";
import TableRowAppended from "../../../../js/components/TableRowAppended.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { StockInformation } from "../../../../js/components/StockInformation.js";
// Instantiate BaseClass
var ExportQuotation = function () {

    const voucherType = 'export_quotations';
    const gridItemNameDropdown = $('#gridItemNameDropdown');
    const gridItemShortCodeDropdown = $('#gridItemShortCodeDropdown');
    const gridItemColorCodeDropdown = $('#gridItemColorCodeDropdown');
    const gridItemRateTypeDropdown = $('#gridItemRateTypeDropdown');
    const gridItemCurrencyDropdown = $('#gridItemCurrencyDropdown');
    const gridItemQty = $('#gridItemQty');
    const gridItemWeightPerUnit = $('#gridItemWeightPerUnit');
    const gridItemTarePerUnit = $('#gridItemTarePerUnit');
    const gridItemTotalTare = $('#gridItemTotalTare');
    const gridItemWeight = $('#gridItemWeight');
    const gridItemRate = $('#gridItemRate');
    const gridItemRatePerKG = $('#gridItemRatePerKG');
    const gridItemGAmount = $('#gridItemGAmount');
    const gridRemarks = $('#txtGridRemarks');

    const saverRequest = new SaverRequest(
        base_url,
        general,
        {
            requestedUrl: 'exportQuotation/save',
            requestType: 'POST',
            isConfirmed: true,
            propsPrintVoucher: function (param) {
                Print_Voucher(param.id, 1, 1, '', false);
            },
            propsResetVoucher: function (param) {
                resetVoucher();
            },
        }
    );
    var Print_Voucher = function (vrnoa, paperSize, printSize, wrate = 0, isSendEmail = false) {
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

    var getExportQuotationById = async function (exportQuotationId) {
        const response = await makeAjaxRequest('GET', `${base_url}/exportQuotation/getExportQuotationById`, {
            exportQuotationId: exportQuotationId
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
        $('#exportQuotationIdHidden').val(data.id);
        appendSelect2ValueIfDataExists("accountDropdown", "party", "pid", "name", data);
        appendSelect2ValueIfDataExists("saleOfficerDropdown", "sale_officer", "id", "name", data);
        appendSelect2ValueIfDataExists("gridItemCurrencyDropdown", "currency", "id", "name", data);
        updateDatepickerWithFormattedDate('current_date', data.vrdate);
        updateDatepickerWithFormattedDate('chk_date', data.vrdate);
        updateDatepickerWithFormattedDate('due_date', data.order_valid_till);

        $('#saleCommissionPercentage').val(data.commission_percentage);
        $('#customerName').val(data.customer_name);
        $('#customerMobile').val(data.customer_mobile);
        $('#receivers_list').val(data.prepared_by);

        $('#txtDiscount').val(data.discount_percentage);
        $('#txtDiscAmount').val(data.discount_amount);
        $('#txtExpense').val(data.expense_percentage);
        $('#txtExpAmount').val(data.expense_amount);
        $('#txtTax').val(data.further_tax_percentage);
        $('#txtTaxAmount').val(data.further_tax_amount);
        $('#txtNetAmount').val(data.net_amount);
        $.each(data.export_quotation_detail, function (index, elem) {
            elem.rate_type.division_factor = elem.division_factor;
            elem.detail_remarks = ifNull(elem.detail_remarks, "");
            appendToTable(elem);
        });
        calculateLowerTotal();
    };

    const validateSingleProductAdd = () => {
        let hasError = false;
        let errorMessage = '';

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        const stockKeepingMethodIdValue = parseNumber($('#stockKeepingMethodId').val());

        if (!$('#gridItemCurrencyDropdown').val()) {
            $('#select2-gridItemCurrencyDropdown-container').parent().addClass('inputerror');
            errorMessage += `Currency is required <br />`;
            hasError = true;
        }

        if (!$('#gridItemNameDropdown').val()) {
            $('#select2-gridItemNameDropdown-container').parent().addClass('inputerror');
            errorMessage += `Item id is required <br />`;
            hasError = true;
        }

        if (!$('#gridItemColorCodeDropdown').val()) {
            $('#select2-gridItemColorCodeDropdown-container').parent().addClass('inputerror');
            errorMessage += `Color Code is required <br />`;
            hasError = true;
        }

        const validateNumericInput = (value, fieldId, fieldName) => {
            const parsedValue = parseNumber(value);
            if (isNaN(parsedValue) || parsedValue <= 0) {
                $(fieldId).addClass('inputerror');
                errorMessage += `${fieldName} is required and must be a positive number.<br />`;
                hasError = true;
            }
        };

        if (stockKeepingMethodIdValue === 0) {
            errorMessage += `Stock Keeping Method is required.<br />`;
            hasError = true;
        }

        if (stockKeepingMethodIdValue == 1) {
            validateNumericInput($(gridItemQty).val(), '#gridItemQty', 'Qty');
        } else if (stockKeepingMethodIdValue == 2) {
            validateNumericInput($(gridItemWeight).val(), '#gridItemWeight', 'Weight');
        } else if (stockKeepingMethodIdValue == 3) {
            validateNumericInput($(gridItemQty).val(), '#gridItemQty', 'Qty');
            validateNumericInput($(gridItemWeight).val(), '#gridItemWeight', 'Weight');
        } else {
            validateNumericInput($(gridItemQty).val(), '#gridItemQty', 'Qty');
        }

        validateNumericInput($(gridItemRate).val(), '#gridItemRate', 'Rate');

        if (!$(gridItemRateTypeDropdown).val()) {
            $('#gridItemRateTypeDropdown').addClass('inputerror');
            errorMessage += `Rate Type is required <br />`;
            hasError = true;
        }

        if (stockKeepingMethodIdValue === 2) {
            validateNumericInput($(gridItemRatePerKG).val(), '#gridItemRatePerKG', 'Rate Per KG');
        } else if (stockKeepingMethodIdValue === 3) {
            validateNumericInput($(gridItemRatePerKG).val(), '#gridItemRatePerKG', 'Rate Per KG');
        }

        if (hasError) {
            return errorMessage;
        }

        return null;
    };

    var getSaveObject = function () {
        const exportQuotation = {};
        const exportQuotationDetail = [];

        exportQuotation.id = $('#exportQuotationIdHidden').val();
        exportQuotation.vrdate = $('#current_date').val();
        exportQuotation.order_valid_till = $('#due_date').val();
        exportQuotation.chk_date = $('#chk_date').val();
        exportQuotation.party_id = $('#accountDropdown').val();
        exportQuotation.sale_officer_id = $('#saleOfficerDropdown').val();
        exportQuotation.currency_id = $('#gridItemCurrencyDropdown').val();
        exportQuotation.customer_name = $('#customerName').val();
        exportQuotation.customer_mobile = $('#customerMobile').val();
        exportQuotation.prepared_by = $('#receivers_list').val();
        exportQuotation.commission_percentage = $('#saleCommissionPercentage').val();
        exportQuotation.net_amount = parseNumber($('.gridItemTotalGrossAmount').text()) || 0;

        $('#purchase_table').find('tbody tr').each(function (index, elem) {
            const gridItemDetail = {};
            gridItemDetail.item_id = $.trim($(elem).find('td.itemName').data('item_id'));
            gridItemDetail.stock_keeping_method_id = $.trim($(elem).find('td.itemName').data('stock_keeping_method_id'));
            gridItemDetail.color_code_id = $.trim($(elem).find('td.colorCode').data('color_code_id'));
            gridItemDetail.rate_type_id = $.trim($(elem).find('td.rateTypeName').data('rate_type_id'));
            gridItemDetail.currency_id = $.trim($(elem).find('td.currencyName').data('currency_id'));
            gridItemDetail.calculation_on = $.trim($(elem).find('td.rateTypeName').data('calculation_on'));
            gridItemDetail.division_factor = $.trim($(elem).find('td.rateTypeName').data('division_factor'));
            gridItemDetail.qty = $.trim($(elem).find('td.qty').text());
            gridItemDetail.weight_per_unit = $.trim($(elem).find('td.weightPerUnit').text());
            gridItemDetail.tare_per_unit = $.trim($(elem).find('td.tarePerUnit').text());
            gridItemDetail.tare = $.trim($(elem).find('td.totalTare').text());
            gridItemDetail.weight = $.trim($(elem).find('td.weight').text());
            gridItemDetail.rate = getNumVal($(elem).find('td input.rate'));
            gridItemDetail.rate_per_kg = getNumVal($(elem).find('td input.ratePerKG'));
            gridItemDetail.gross_amount = $.trim($(elem).find('td.gAmount').text());
            gridItemDetail.detail_remarks = $.trim($(elem).find('td.itemName textarea').val());
            exportQuotationDetail.push(gridItemDetail);
        });
        const data = {};
        data.exportQuotation = exportQuotation;
        data.exportQuotationDetail = exportQuotationDetail;
        data.id = $('#exportQuotationIdHidden').val();
        return data;
    };

    // checks for the empty fields
    var validateSave = function () {

        var errorFlag = false;

        var accountDropdown = $('#accountDropdown');
        var currentDate = $('#current_date');
        // remove the error class first
        $('.inputerror').removeClass('inputerror');


        if (!currentDate.val()) {
            currentDate.addClass('inputerror');
            errorFlag = true;
        }

        if (!accountDropdown.val()) {
            $('#select2-accountDropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    };

    var deleteVoucher = async function (vrnoa) {
        general.disableSave();
        const response = await makeAjaxRequest('delete', `${base_url}/exportQuotation/delete`,
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


    var calculateLowerTotal = function () {

        let gridItemTotalQty = 0;
        let gridItemTotalWeightPerUnit = 0;
        let gridItemTotalTare = 0;
        let gridItemTotalWeight = 0;
        let gridItemTotalGrossAmount = 0;

        $("#purchase_table").find("tbody tr").each(function (index, elem) {
            gridItemTotalQty += getNumText($(this).closest('tr').find('td.qty'));
            gridItemTotalWeightPerUnit += getNumText($(this).closest('tr').find('td.weightPerUnit'));
            gridItemTotalTare += getNumText($(this).closest('tr').find('td.totalTare'));
            gridItemTotalWeight += getNumText($(this).closest('tr').find('td.weight'));
            gridItemTotalGrossAmount += getNumText($(this).closest('tr').find('td.gAmount'));
        });

        $('.gridItemTotalQty').text(parseNumber(gridItemTotalQty).toFixed(QTY_ROUNDING));
        $('.gridItemTotalWeightPerUnit').text(parseNumber(gridItemTotalWeightPerUnit).toFixed(WEIGHT_ROUNDING));
        $('.gridItemTotalTare').text(parseNumber(gridItemTotalTare).toFixed(WEIGHT_ROUNDING));
        $('.gridItemTotalWeight').text(parseNumber(gridItemTotalWeight).toFixed(WEIGHT_ROUNDING));
        $('.gridItemTotalGrossAmount').text(parseNumber(gridItemTotalGrossAmount).toFixed(AMOUNT_ROUNDING));
    };

    var resetVoucher = function () {
        resetFields();
        getExportQuotationDataTable();
        $('#voucher_type_hidden').val('new');
    };

    var validate = function () {
        var errorFlag = false;
        var cur = getSqlFormattedDate($('#current_date').val());
        var due = getSqlFormattedDate($('#due_date').val());
        if (due < cur) {
            errorFlag = true;
        }
        return errorFlag;
    };
    var resetFields = function () {
        const resetArray = [
            { selector: 'exportQuotationIdHidden', options: { disabled: true } },
            'accountDropdown',
            'current_date',
            'due_date',
            'chk_date',
            'saleOfficerDropdown',
            'gridItemShortCodeDropdown',
            'gridItemNameDropdown',
            'gridItemColorCodeDropdown',
            'gridItemCurrencyDropdown',
            'gridItemRateTypeDropdown',
            'gridItemQty',
            'gridItemWeightPerUnit',
            'gridItemTarePerUnit',
            'gridItemRate',
            'rateTypeDivisionFactor',
            'gridItemRatePerKG',
            'gridItemGAmount',
            'txtGridRemarks',
            'txtNetAmount',
            'customerName',
            'customerMobile',
            'receivers_list',
            'saleCommissionPercentage',
            'rateTypeIsMultiplier'
        ];
        clearValueAndText(resetArray);

        const resetClassArray = [
            'gridItemTotalQty',
            'gridItemTotalWeightPerUnit',
            'gridItemTotalTarePerUnit',
            'gridItemTotalTare',
            'gridItemTotalWeight',
            'gridItemTotalGrossAmount'
        ];
        clearValueAndText(resetClassArray, '.');
        gridItemWeight.val('');
        gridItemTotalTare.val('');
        $('#purchase_table tbody tr').remove();
        $('#purchase_tableReport tbody tr').remove();
        $('#laststockLocation_table tbody tr').remove();

        $('#party_p').html('');
        $('#otherItemInformation').html('');

        $('button.getAccountLookUpRecord').prop('disabled', false);
    };

    const getItemDetailRecord = (item_id, itemPriceId, accountId) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: `${base_url}/item/getItemDetailRecord`,
                data: { item_id: item_id, itemPriceId: itemPriceId, accountId: accountId },
                datatype: 'JSON',
                success: function (response) {
                    resolve(response);
                },
                error: function (xhr, status, error) {
                    reject(console.log(xhr.responseText));
                }
            });
        });
    };

    const getItemDetailById = async (item_id, itemPriceId) => {
        if (parseNumber(item_id) > 0) {
            const accountId = $('#accountDropdown').val();
            const response = await getItemDetailRecord(item_id, itemPriceId, accountId);
            if (response.status === false && response.error !== "") {
                _getAlertMessage('Error!', response.message, 'danger');
            } else if (response.status === false && response.message !== "") {
                _getAlertMessage('Information!', response.message, 'info');
            } else {
                const saleModuleSetting = response.data.sale_module_settings;
                const stockKeepingMethodIdValue = response.data.stock_keeping_method_id;
                const division_by = response.data.item_calculation_method.division_by;
                const isMultiplier = response.data.item_calculation_method.is_multiplier;

                if (saleModuleSetting && saleModuleSetting.show_stock_information && parseNumber(response.data.inventory_validated) == 1) {
                    const stockInfo = new StockInformation(response.data.stock_keeping_method_id, { isSale: true });
                    stockInfo.getStockInformation(parseNumber(response.data.item_id), $('#current_date').val(), 0);
                }

                $('#stockKeepingMethodId').val(response.data.stock_keeping_method_id);
                $('#calculationOn').val(response.data.item_calculation_method.calculation_on);
                $('#inventoryValidated').val(response.data.inventory_validated);
                $('#rateTypeDivisionFactor').val(division_by);
                $('#rateTypeIsMultiplier').val(isMultiplier);

                $(`#gridItemTarePerUnit`).val(parseNumber(response.data.tare_per_unit).toFixed(WEIGHT_ROUNDING));
                $(`#gridItemRate`).val(parseNumber(response.data.saleRate).toFixed(RATE_ROUNDING));
                $(`#gridItemDiscountPercentage`).val(parseNumber(response.data.saleDiscount).toFixed(2));
                $(`#gridItemTaxPercentage`).val(parseNumber(response.data.taxrate).toFixed(2));

                triggerAndRenderOptions($('#gridItemShortCodeDropdown'), response.data.short_code, response.data.item_id, false, false, true);
                triggerAndRenderOptions($('#gridItemNameDropdown'), response.data.item_des, response.data.item_id, false, false, true);
                appendSelect2ValueIfDataExists("gridItemWarehouseDropdown", "item_department", "did", "name", response.data);
                appendSelect2ValueIfDataExists("gridItemRateTypeDropdown", "item_calculation_method", "id", "name", response.data);
                populateOtherItemInformation(response.data);

                let focusId = gridItemQty;
                if (stockKeepingMethodIdValue == 1) {
                    $('#gridItemRatePerKG').prop('disabled', true);
                } else if (stockKeepingMethodIdValue == 2) {
                    focusId = gridItemWeight;
                    $('#gridItemRatePerKG').prop('disabled', false);
                } else if (stockKeepingMethodIdValue == 3) {
                    $('#gridItemRatePerKG').prop('disabled', false);
                }

                const colorCodeValue = parseNumber($('#gridItemColorCodeDropdown').val()) || 0;
                const warehouseValue = parseNumber($('#gridItemWarehouseDropdown').val()) || null;

                if (colorCodeValue == 0) {
                    setTimeout(() => {
                        // Only focus if the value is still 0
                        if (parseNumber($('#gridItemColorCodeDropdown').val()) == 0) {
                            $('#gridItemColorCodeDropdown').focus();
                        }
                    }, 200);
                } else if (warehouseValue == 0) {
                    setTimeout(() => {
                        // Only focus if the value is still 0
                        if (parseNumber($('#gridItemWarehouseDropdown').val()) == 0) {
                            $('#gridItemWarehouseDropdown').focus();
                        }
                    }, 200);
                } else {
                    setTimeout(() => {
                        // Only focus if the value is still 0
                        $(focusId).focus();
                    }, 200);
                }

                $('#gridItemRate').trigger('input');
                $('#txtDiscp').trigger('input');
                $('#txtGWeight').trigger('input');
            }
        }
    };

    const populateOtherItemInformation = (data) => {
        if (data) {
            var categoryName = '';
            var subCategoryName = '';
            var stockKeepingMethodName = '';
            var calculationType = '';

            categoryName = (data.item_category) ? data.item_category.name : "-";
            subCategoryName = (data.item_sub_category) ? data.item_sub_category.name : "-";
            stockKeepingMethodName = (data.stock_keeping_method) ? data.stock_keeping_method.description : "-";
            calculationType = `${(data.item_calculation_method) ? data.item_calculation_method.name : "-"}`;

            $('#otherItemInformation').html(`<b>Category</b> : ${categoryName} <br /><b>Sub Category</b> : ${subCategoryName} <br /><b>Stock Keeping</b> : ${stockKeepingMethodName} <br /><b>Calcualtion By</b> : ${calculationType} <br />`);
        }
    };

    const gridCalculateUpperFields = (event) => {
        const qty = parseFloat(gridItemQty.val()) || 0;
        const totalWeight = parseFloat(gridItemWeightPerUnit.val()) || 0;
        const tarePerUnit = parseFloat(gridItemTarePerUnit.val()) || 0;
        const totalTare = parseNumber(tarePerUnit) * parseNumber(qty);
        gridItemTotalTare.val(parseNumber(totalTare).toFixed(WEIGHT_ROUNDING))
        gridItemWeight.val(parseNumber(parseNumber(totalWeight) - parseNumber(totalTare)).toFixed(WEIGHT_ROUNDING));

        let rate = parseFloat(gridItemRate.val()) || 0;
        const weight = parseFloat(gridItemWeight.val()) || 0;
        const stockKeepingMethodId = $('#calculationOn').val();
        const $divisionFactor = parseNumber($('#rateTypeDivisionFactor').val());
        const $rateTypeIsMultiplier = parseNumber($('#rateTypeIsMultiplier').val());

        const divisionFactor = {
            factor: parseNumber($divisionFactor) ? parseNumber($divisionFactor) : 1,
            is_multiplier: $rateTypeIsMultiplier
        }

        const eventInputId = event.target.getAttribute('id');

        if (eventInputId === "gridItemRate") {
            const ratePerKg = calculateRatePerKgGridItemRow(rate, divisionFactor, stockKeepingMethodId);
            gridItemRatePerKG.val(parseNumber(ratePerKg).toFixed(RATE_ROUNDING));
        } else if (eventInputId === "gridItemRatePerKG") {
            const calculatedRate = calculateRateGridItemRow(gridItemRatePerKG.val(), divisionFactor, stockKeepingMethodId);
            gridItemRate.val(parseNumber(calculatedRate).toFixed(RATE_ROUNDING));
            rate = calculatedRate;
        } else {
            const ratePerKg = calculateRatePerKgGridItemRow(rate, divisionFactor, stockKeepingMethodId);
            gridItemRatePerKG.val(parseNumber(ratePerKg).toFixed(RATE_ROUNDING));
        }
        // Gross Amount calculation
        const grossAmount = calculateGrossAmountGridItemRow(rate, qty, weight, divisionFactor, stockKeepingMethodId);
        gridItemGAmount.val(parseNumber(grossAmount).toFixed(AMOUNT_ROUNDING));
    };

    let exportQuotationViewList = undefined;
    const getExportQuotationDataTable = (exportQuotationId = 0, fromDate = "", toDate = "") => {
        if (typeof exportQuotationViewList !== 'undefined') {
            exportQuotationViewList.destroy();
            $('#exportQuotationViewListTbody').empty();
        }
        exportQuotationViewList = $("#exportQuotationViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/exportQuotation/getExportQuotationDataTable`,
                type: 'GET',
                data: { 'exportQuotationId': exportQuotationId, fromDate: fromDate, toDate: toDate },
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
                        return meta.row + meta.settings._iDisplayStart + 1; // This will give you the serial number
                    }
                },
                {
                    data: "vrnoa",
                    name: "vrnoa",
                    className: "text-left exportQuotationVoucher"
                },
                {
                    data: "vrdate",
                    name: "vrdate",
                    className: "text-left voucherDate",
                    render: function (data, type, row) {
                        return updateFormattedDate(data);
                    }
                },
                { data: "party.name", orderby: 'party.name', name: 'party.name', className: "customerName" },
                {
                    data: "net_amount", name: 'net_amount', className: "text-right net_amount", render: function (data, type, row) {
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
								<a class="dropdown-item btnEditPrevVoucher" data-sale_order_id="${row.id}" href="#"><i class='fa fa-edit'></i> Edit Voucher</a>
                                <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                    <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                    <span class="sr-only">Toggle Dropdown</span>
                                </button>
                                <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                    <li class="dropdown-item"><a href="#" class="btnPrint" data-sale_order_id   ="${row.id}">Print Voucher</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-sale_order_id   ="${row.id}"> Print a4 with header</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-sale_order_id   ="${row.id}"> Print a4 without header </a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-sale_order_id   ="${row.id}"> Print b5 with header</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-sale_order_id   ="${row.id}"> Print b5 without header </a></li>
                                </ul>
								<a class="dropdown-item btnDelete" data-sale_order_id="${row.id}" href="#"><i class='fa fa-trash'></i> Delete Voucher</a>
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
        exportQuotationViewList.on('draw', function () {
            $('[data-toggle="tooltip"]').tooltip(); // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
    };
    var getSaleCommissionPercentage = async function (accountId, saleOfficerId) {
        const response = await makeAjaxRequest('GET', `${base_url}/saleOfficerCommissionAllotment/getSaleCommissionPercentage`, {
            accountId: accountId,
            saleOfficerId: saleOfficerId
        });

        $('#saleCommissionPercentage').val(0);
        if (response.status == true && response.data) {
            $('#saleCommissionPercentage').val(response.data.sale_commission_percentage);
        }
    };

    const appendToTable = (rowData) => {
        let stockKeepingMethodClass = "";
        let attributes = "";
        const isStockKeepingMethod = (parseFloat(rowData.stock_keeping_method_id) === 1);
        if (isStockKeepingMethod) {
            attributes = 'disabled';
            stockKeepingMethodClass = 'disabled cursor-not-allowed';
        }
        const row = `
        <tr data-row-id="${propsForTable.userCacheId}" class="odd:bg-white even:bg-slate-50">
        <td class='py-1 px-1 text-md align-middle text-left' data-title='Sr#'></td>
        <td class='py-1 px-1 text-md align-middle text-left itemName'
        data-item_id='${rowData.item_details.item_id}'
        data-short_code='${rowData.item_details.short_code}'
        data-stock_keeping_method_id="${rowData.stock_keeping_method_id}">${rowData.item_details.item_des}
            <span>
                <textarea class="form-control form-input-class  no-resize custom-textarea" placeholder="Enter details related to the row above...">${rowData.detail_remarks}</textarea>
            </span>
        </td>
        <td class='py-1 px-1 text-md align-middle text-left currencyName d-none' data-currency_id="${rowData.currency.id}">${rowData.currency.name}</td>
        <td class='py-1 px-1 text-md align-middle text-left colorCode' data-color_code_id="${rowData.color_code.id}">${rowData.color_code.name}</td>
        <td class='py-1 px-1 text-md align-middle rateTypeName' data-rate_type_id="${rowData.rate_type.id}" data-is_multiplier="${rowData.rate_type.is_multiplier && rowData.rate_type.is_multiplier ? rowData.rate_type.is_multiplier : 0}" data-division_factor="${rowData.rate_type.division_factor}" data-calculation_on="${rowData.rate_type.calculation_on}"> ${rowData.rate_type.name}</td>
        <td class='py-1 px-1 text-md align-middle text-right qty'> ${parseNumber(rowData.qty).toFixed(QTY_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right weightPerUnit'> ${parseNumber(rowData.weight_per_unit).toFixed(WEIGHT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right tarePerUnit'> ${parseNumber(rowData.tare_per_unit).toFixed(WEIGHT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right totalTare'> ${parseNumber(rowData.tare).toFixed(WEIGHT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right weight'> ${parseNumber(rowData.weight).toFixed(WEIGHT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right rate'>
            <input type='text' class='form-control form-input-class  is_numeric text-right w-20 h-8 float-right rate' value='${parseNumber(rowData.rate).toFixed(RATE_ROUNDING)}'>
        </td>
        <td class='py-1 px-1 text-md align-middle text-right ratePerKG'>
            <input type='text' class='form-control form-input-class ${stockKeepingMethodClass}  is_numeric text-right w-20 h-8 float-right ratePerKG' value='${parseNumber(rowData.rate_per_kg).toFixed(4)}' ${attributes}>
        </td>
        <td class='py-1 px-1 text-md align-middle text-right gAmount'> ${parseNumber(rowData.gross_amount).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right'>
        <div class="btn-group">
      <button type="button" class="btn btn-sm btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-ellipsis-v"></i>
      </button>
      <div class="dropdown-menu">
          <!-- Default edit button -->
          <button type="button" class="dropdown-item btnRowEdit">
              <i class="fa fa-edit"></i> Edit
          </button>
          <!-- Remove button -->
          <button type="button" class="dropdown-item btnRowRemove">
              <i class="fa fa-trash-alt"></i> Remove
          </button>
      </div>
  </div>
        </td>
    </tr>`

        $(row).appendTo('#purchase_table');
    };

    return {

        init: function () {
            this.bindUI();
            $('.select2').select2();
            getExportQuotationDataTable();
        },

        bindUI: function () {

            $('[data-toggle="tooltip"]').tooltip();
            var self = this;
            $(gridItemQty).on('input', function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemWeightPerUnit).on('input', function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemTarePerUnit).on('input', function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemWeight).on('input', function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemRate).on('input', function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemRatePerKG).on('input', function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemRateTypeDropdown).on('change', async function (e) {
                e.preventDefault();
                await getItemRateTypeById($(this).val(), 'rateTypeDivisionFactor');
                gridCalculateUpperFields(e);
                calculateLowerTotal();
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

            /**
             * * This event working Grid Input Change Rate|Discount Percentage|Discount|Tax
             * */
            // Attach input event listeners for each row
            $('#purchase_table').on('input', 'tr input.rate,tr input.ratePerKG, tr input.discountPercentage,tr input.discountPerUnit,tr input.taxPercentage', function (event) {
                const currentRow = $(this).closest('tr');
                const gridItemRowCalculator = new GridItemRowCalculator(currentRow);
                gridItemRowCalculator.calculate(event, currentRow);
            });
            $('#gridItemShortCodeDropdown').on('change', async function (e) {
                e.preventDefault();
                $('.inputerror').removeClass('inputerror');
                $('.inputerror').removeClass('inputerror');

                const currencyId = $('#gridItemCurrencyDropdown').val();
                const customerId = $('#accountDropdown').val();
                if (parseNumber(customerId) == 0) {
                    $('#select2-accountDropdown-container').parent().addClass('inputerror');
                    $('#gridItemShortCodeDropdown').val(0);
                    return AlertComponent.getAlertMessage({ title: "Error", message: "Please select customer", type: "danger" });
                }
                if (parseNumber(currencyId) == 0) {
                    $('#gridItemShortCodeDropdown').val(0);
                    $('#select2-gridItemCurrencyDropdown-container').parent().addClass('inputerror');
                    return AlertComponent.getAlertMessage({ title: "Error", message: "Please select currency", type: "danger" });
                }
                await getItemDetailById($(this).val(), currencyId);

            });
            $('#gridItemNameDropdown').on('change', async function (e) {
                e.preventDefault();
                $('.inputerror').removeClass('inputerror');
                $('.inputerror').removeClass('inputerror');

                const currencyId = $('#gridItemCurrencyDropdown').val();
                const customerId = $('#accountDropdown').val();
                if (parseNumber(customerId) == 0) {
                    $('#select2-accountDropdown-container').parent().addClass('inputerror');
                    $('#gridItemNameDropdown').val(0);
                    return AlertComponent.getAlertMessage({ title: "Error", message: "Please select customer", type: "danger" });
                }
                if (parseNumber(currencyId) == 0) {
                    $('#gridItemNameDropdown').val(0);
                    $('#select2-gridItemCurrencyDropdown-container').parent().addClass('inputerror');
                    return AlertComponent.getAlertMessage({ title: "Error", message: "Please select currency", type: "danger" });
                }
                await getItemDetailById($(this).val(), currencyId);
            });
            $('#gridItemQty,#gridItemWeightPerUnit,#gridItemTarePerUnit,#gridItemTotalTare,#gridItemWeight,#gridItemRate,#gridItemRatePerKG,#txtGridRemarks').on('keypress', function (event) {
                if (event.which === 13) {
                    event.preventDefault();
                    $('#btnAdd').trigger('click');
                }
            });
            $('#btnAdd').on('click', function (event) {
                event.preventDefault();

                const alertMessage = validateSingleProductAdd();
                if (alertMessage) {
                    return AlertComponent.getAlertMessage({ "title": "Error!", "message": alertMessage, "type": "danger" });
                }

                const itemId = parseNumber((gridItemNameDropdown.val()));
                const shortCode = $(gridItemShortCodeDropdown).find('option:selected').text().trim();
                const itemName = $(gridItemNameDropdown).find('option:selected').text().trim();
                const stockKeepingMethodId = parseNumber($('#stockKeepingMethodId').val());
                const colorCodeId = $(gridItemColorCodeDropdown).val();
                const colorCodeName = $(gridItemColorCodeDropdown).find('option:selected').text().trim();
                const rateTypeId = $(gridItemRateTypeDropdown).val();
                const rateTypeName = $.trim($(gridItemRateTypeDropdown).find('option:selected').text());
                const rateTypeDivisionFactor = parseNumber($('#rateTypeDivisionFactor').val());
                const rateTypeIsMultiplier = parseNumber($('#rateTypeIsMultiplier').val());
                const calculationOn = parseNumber($('#calculationOn').val());
                const currencyId = $(gridItemCurrencyDropdown).val();
                const currencyName = $(gridItemCurrencyDropdown).find('option:selected').text().trim();
                const qty = $(gridItemQty).val();
                const weightPerUnit = $(gridItemWeightPerUnit).val();
                const tarePerUnit = $(gridItemTarePerUnit).val();
                const totalTare = $(gridItemTotalTare).val();
                const weight = $(gridItemWeight).val();
                const rate = $(gridItemRate).val();
                const ratePerKG = $(gridItemRatePerKG).val();
                const gAmount = $(gridItemGAmount).val();
                const remarks = ifNull($(gridRemarks).val(), "");

                const rowData = {
                    item_details: {
                        item_id: itemId,
                        item_des: itemName,
                        short_code: shortCode
                    },
                    stock_keeping_method_id: stockKeepingMethodId,
                    color_code: {
                        id: colorCodeId,
                        name: colorCodeName,
                    },
                    rate_type: {
                        id: rateTypeId,
                        name: rateTypeName,
                        division_factor: rateTypeDivisionFactor,
                        calculation_on: calculationOn,
                        is_multiplier: rateTypeIsMultiplier
                    },
                    currency: {
                        id: currencyId,
                        name: currencyName,
                    },
                    qty: qty,
                    weight_per_unit: weightPerUnit,
                    tare_per_unit: tarePerUnit,
                    tare: totalTare,
                    weight: weight,
                    rate: rate,
                    rate_per_kg: ratePerKG,
                    gross_amount: gAmount,
                    detail_remarks: remarks
                };

                // reset the values of the annoying fields
                $(gridItemShortCodeDropdown).val('').trigger('change.select2');
                $(gridItemNameDropdown).val('').trigger('change.select2');
                $(gridItemColorCodeDropdown).val('').trigger('change.select2');
                $(gridItemRateTypeDropdown).val('').trigger('change.select2');
                $(gridItemQty).val('');
                $(gridItemWeightPerUnit).val('');
                $(gridItemTarePerUnit).val('');
                $(gridItemTotalTare).val('');
                $(gridItemWeight).val('');
                $(gridItemRate).val('');
                $(gridItemRatePerKG).val('');
                $(gridItemGAmount).val('');
                $(gridRemarks).val('');
                $('#stockKeepingMethodId').val('');
                $('#calculationOn').val('');
                $('#rateTypeDivisionFactor').val('');
                $('#rateTypeIsMultiplier').val('');

                appendToTable(rowData);
                calculateLowerTotal();
                $(gridItemShortCodeDropdown).get()[0].click();
            });

            $('#purchase_table').on('click', '.btnRowEdit', function (event) {
                event.preventDefault();

                const row = $(this).closest('tr');
                const gridItemRowCalculator = new GridItemRowCalculator(row);

                const editItemId = row.find('td.itemName').data('item_id');
                const editItemName = row.find('td.itemName').clone().children('span').remove().end().text();
                const editShortCode = row.find('td.itemName').data('short_code');
                const editStockKeepingMethodId = row.find('td.itemName').data('stock_keeping_method_id');
                const editColorCodeId = row.find('td.colorCode').data('color_code_id');
                const editColorCodeName = row.find('td.colorCode').text();
                const editRateTypeId = row.find('td.rateTypeName').data('rate_type_id');
                const editRateTypeDivisionFactor = row.find('td.rateTypeName').data('division_factor');
                const editRateTypeCalculation = row.find('td.rateTypeName').data('calculation_on');
                const editRateTypeIsMultiplier = row.find('td.rateTypeName').data('is_multiplier');
                const editRateTypeName = row.find('td.rateTypeName').text();
                const editItemQty = parseNumber(row.find('td.qty').text());
                const editItemWeightPerUnit = parseNumber(row.find('td.weightPerUnit').text());
                const editItemTarePerUnit = parseNumber(row.find('td.tarePerUnit').text());
                const editItemTotalTare = parseNumber(row.find('td.totalTare').text());
                const editItemWeight = parseNumber(row.find('td.weight').text());
                const editItemRate = parseNumber(row.find('td.rate input').val());
                const editRatePerKG = parseNumber(row.find('td.ratePerKG input').val());
                const editGAmount = parseNumber(row.find('td.gAmount').text());
                const remarks = row.find('td.itemName textarea').val();

                triggerAndRenderOptions($('#gridItemShortCodeDropdown'), editShortCode, editItemId, false);
                triggerAndRenderOptions($('#gridItemNameDropdown'), editItemName, editItemId, false);
                triggerAndRenderOptions($('#gridItemColorCodeDropdown'), editColorCodeName, editColorCodeId, false);
                triggerAndRenderOptions($('#gridItemRateTypeDropdown'), editRateTypeName, editRateTypeId, false);

                $('#stockKeepingMethodId').val(editStockKeepingMethodId);
                $('#rateTypeDivisionFactor').val(editRateTypeDivisionFactor);
                $('#calculationOn').val(editRateTypeCalculation);
                $('#rateTypeIsMultiplier').val(editRateTypeIsMultiplier);

                $(gridItemQty).val(editItemQty);
                $(gridItemWeightPerUnit).val(editItemWeightPerUnit);
                $(gridItemTarePerUnit).val(editItemTarePerUnit);
                $(gridItemTotalTare).val(editItemTotalTare);
                $(gridItemWeight).val(editItemWeight);
                $(gridItemRate).val(editItemRate);
                $(gridItemRatePerKG).val(editRatePerKG);
                $(gridItemGAmount).val(editGAmount);
                $(gridRemarks).val(remarks);

                if (editStockKeepingMethodId == 1) {
                    $(gridItemRatePerKG).prop('disabled', true);
                } else if (editStockKeepingMethodId == 2) {
                    $(gridItemRatePerKG).prop('disabled', false);
                } else if (editStockKeepingMethodId == 3) {
                    $(gridItemRatePerKG).prop('disabled', false);
                }
                $(this).closest('tr').remove();
                gridItemRowCalculator.calculate(event, row);
            });
            // when btnRowRemove is clicked
            $('#purchase_table').on('click', '.btnRowRemove', function (e) {
                e.preventDefault();
                const row = $(this).closest('tr');
                const gridItemRowCalculator = new GridItemRowCalculator(row);
                row.remove();
                gridItemRowCalculator.calculate(e, row);
            });

            $('#exportQuotationSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getExportQuotationDataTable();
            });
            $('#exportQuotationFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getExportQuotationDataTable("", fromDate, toDate);
            });
            $(document.body).on('click', '.getItemLookUpRecord', function (e) {
                e.preventDefault();
                getItemLookUpRecord(voucherType, '');
            });
            $('body').on('click', '#item-lookup .populateItem', function (e) {
                const ItemId = $(this).data('itemid');
                const ItemShortCode = $.trim($(this).closest('tr').find('td.item_des').text());
                triggerAndRenderOptions($('#gridItemNameDropdown'), ItemShortCode, ItemId);
                $('#item-lookup').modal('hide');
            });
            $('body').on('click', '#AccountLookUpModal .populateAccountLookUp', function (e) {
                e.preventDefault();
                const accountText = $.trim($(this).closest('tr').find('td.name').text());
                const accountId = $.trim($(this).closest('tr').find('td.name').data('account_id'));
                triggerAndRenderOptions($('#accountDropdown'), accountText, accountId);
                $('#AccountLookUpModal').modal('hide');
            });
            $('#accountDropdown').on('change', function () {
                $('#saleCommissionPercentage').val(0);
                const accountId = $(this).val();
                const voucherDate = $('#current_date').val();
                getAccountBalanced(accountId, voucherDate);
            });

            $('.getAccountLookUpRecord').on('click', function (e) {
                e.preventDefault();
                getAccountLookUpRecord(voucherType);
            });

            $('#saleOfficerDropdown').on('change', async function () {
                const accountId = $('#accountDropdown').val();
                await getSaleCommissionPercentage(accountId, $(this).val());
            });
            $('body').on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                var exportQuotationId = parseNumber($(this).data('sale_order_id'));
                getExportQuotationById(exportQuotationId);
                $('a[href="#Main"]').trigger('click');
            });
            $('.btnSave').on('click', function (e) {
                e.preventDefault();
                self.initSave();
            });
            $('body').on('click', '.btnPrint', function (e) {
                const exportQuotationId = $(this).data('sale_order_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(base_url + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(exportQuotationId, settingPrintDefault, 'lg', '');
                }
            });

            $('body').on('click', '.btnPrintA4WithHeader', function (e) {
                const exportQuotationId = $(this).data('sale_order_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(exportQuotationId, 1, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintA4WithOutHeader', function (e) {
                const exportQuotationId = $(this).data('sale_order_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(exportQuotationId, 2, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintB5WithHeader', function (e) {
                const exportQuotationId = $(this).data('sale_order_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(exportQuotationId, 3, 'lg', "");
                }
            });
            $('body').on('click', '.btnPrintB5WithOutHeader', function (e) {
                const exportQuotationId = $(this).data('sale_order_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher(exportQuotationId, 4, 'lg', "");
                }
            });

            $('body').on('click', '.btnPrintASEmail', function (e) {
                const exportQuotationId = $(this).data('sale_order_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                getSendMail(exportQuotationId, settingPrintDefault, 'lg', '', true);
            });

            $('.btnReset').on('click', function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $('body').on('click', '.btnDelete', function (e) {
                const exportQuotationId = $(this).data('sale_order_id');
                e.preventDefault();
                if (exportQuotationId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', function (result) {
                        if (result) {
                            deleteVoucher(exportQuotationId);
                        }
                    });
                }
            });

            shortcut.add("F10", function () {
                $('.btnSave').get()[0].click();
            });
            shortcut.add("F1", function () {
                $('a[href="#party-lookup"]').get()[0].click();
            });
            shortcut.add("F2", function () {
                $('.getItemLookUpRecord').get()[0].click();
            });
            shortcut.add("F5", function () {
                $('#resetButton').first().trigger('click');
            });

            exportQuotation.fetchRequestedVr();
        },

        // prepares the data to save it into the database
        initSave: function () {
            const validateSaveFlag = validateSave();
            const validateDueDate = validate();
            if (!validateSaveFlag) {
                if (!validateDueDate) {
                    var rowsCount = $('#purchase_table').find('tbody tr').length;
                    if (rowsCount > 0) {
                        const saveObj = getSaveObject();
                        const data = { 'exportQuotation': JSON.stringify(saveObj.exportQuotation), 'exportQuotationDetail': JSON.stringify(saveObj.exportQuotationDetail), 'id': saveObj.id, 'chk_date': $('#chk_date').val(), 'vrdate': $('#cur_date').val() };
                        saverRequest.sendRequest(data);
                    } else {
                        AlertComponent.getAlertMessage({ title: "Error!", message: "No data found to save", type: "danger" });
                    }
                } else {
                    AlertComponent.getAlertMessage({ title: "Error!", message: "Validity Date Must be Greater Than Voucher Date", type: "danger" });
                }
            } else {
                AlertComponent.getAlertMessage({ title: "Error!", message: "Correct the errors...", type: "danger" });
            }
        },
        fetchRequestedVr: function () {

            var vrnoa = general.getQueryStringVal('vrnoa');
            vrnoa = parseInt(vrnoa);
            $('#txtVrnoa').val(vrnoa);
            $('#txtVrnoaHidden').val(vrnoa);
            if (!isNaN(vrnoa)) {
                getExportQuotationById(vrnoa);
            }
        }
    };

};

const exportQuotation = new ExportQuotation();
exportQuotation.init();

// Corrected function to match the HTML ID
$(function () {


    new DynamicOption('#accountDropdown', {
        requestedUrl: dropdownOptions.getAllCustomerLevelAccount,
        placeholderText: 'Choose Customer'
    });

    new DynamicOption('#saleOfficerDropdown', {
        requestedUrl: dropdownOptions.getAllOfficerByDesignation,
        placeholderText: 'Choose Sale Officer',
        allowClear: true,
        designation: 'Sales Officer'
    });

    new DynamicOption("#gridItemCurrencyDropdown", {
        requestedUrl: dropdownOptions.getAllCurrency,
        placeholderText: "Choose Currency",
        allowClear: true,
    });

    new DynamicOption('#gridItemShortCodeDropdown', {
        requestedUrl: dropdownOptions.saleInventoryCategoriesShortCode,
        placeholderText: 'Choose Short Code'
    });

    new DynamicOption('#gridItemNameDropdown', {
        requestedUrl: dropdownOptions.saleInventoryCategories,
        placeholderText: 'Choose Item Name'
    });

    new DynamicOption('#gridItemColorCodeDropdown', {
        requestedUrl: `${base_url}/color/getAllColorCodes`,
        placeholderText: 'Choose Color Code',
        allowClear: true,
    });

    new DynamicOption('#gridItemRateTypeDropdown', {
        requestedUrl: `${base_url}/item/calculationMethod/getAllRateType`,
        placeholderText: 'Choose Rate Type',
        allowClear: true,
        includeDataAttributes: true
    });
});
