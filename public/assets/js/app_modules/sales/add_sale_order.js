// assets/js/app_modules/purchase/add_sale_order.js
import { AMOUNT_ROUNDING, QTY_ROUNDING }                                                                                                                                                                                                                                                                                                                               from "../../../../js/components/GlobalConstants.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, disableButton, doLoading, enableDisableButton, getItemRateTypeById, handlePercentageOrAmountInput, ifNull, isPositive, parseNumber, setFinancialYearDate, updateDatepickerWithFormattedDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek, updateFormattedDate } from "../commonFunctions/CommonFunction.js";
import { baseConfiguration }                                                                                                                                                                                                                                                                                                                                           from "../../../../js/components/ConfigurationManager.js";
import { calculateAmountExclTaxGridItemRow }                                                                                                                                                                                                                                                                                                                           from "../../../../js/components/calculations/calculateAmountExclTaxGridItemRow.js";
import { calculateAmountInclTaxGridItemRow }                                                                                                                                                                                                                                                                                                                           from "../../../../js/components/calculations/calculateAmountInclTaxGridItemRow.js";
import { calculateDiscountAmountGridItemRow }                                                                                                                                                                                                                                                                                                                          from "../../../../js/components/calculations/calculateDiscountAmountGridItemRow.js";
import { calculateDiscountPercentageGridItemRow }                                                                                                                                                                                                                                                                                                                      from "../../../../js/components/calculations/calculateDiscountPercentageGridItemRow.js";
import { calculateDiscountPerUnitGridItemRow }                                                                                                                                                                                                                                                                                                                         from "../../../../js/components/calculations/calculateDiscountPerUnitGridItemRow.js";
import { calculateGrossAmountGridItemRow }                                                                                                                                                                                                                                                                                                                             from "../../../../js/components/calculations/calculateGrossAmountGridItemRow.js";
import { calculateRateGridItemRow }                                                                                                                                                                                                                                                                                                                                    from "../../../../js/components/calculations/calculateRateGridItemRow.js";
import { calculateRatePerKgGridItemRow }                                                                                                                                                                                                                                                                                                                               from "../../../../js/components/calculations/calculateRatePerKgGridItemRow.js";
import { calculateRatePerUnitGridItemRow }                                                                                                                                                                                                                                                                                                                             from "../../../../js/components/calculations/calculateRatePerUnitGridItemRow.js";
import { calculateTaxAmountGridItemRow }                                                                                                                                                                                                                                                                                                                               from "../../../../js/components/calculations/calculateTaxAmountGridItemRow.js";
import { calculateTaxPercentageGridItemRow }                                                                                                                                                                                                                                                                                                                           from "../../../../js/components/calculations/calculateTaxPercentageGridItemRow.js";
import { dropdownOptions }                                                                                                                                                                                                                                                                                                                                             from "../../../../js/components/GlobalUrl.js";
import { propsForTable }                                                                                                                                                                                                                                                                                                                                               from "../commonFunctions/PopulateDataOnVouchers.js";
import { validPercentage }                                                                                                                                                                                                                                                                                                                                             from "../../../../js/components/Helpers.js";
import DynamicOption                                                                                                                                                                                                                                                                                                                                                   from "../../../../js/components/DynamicOption.js";
import GridItemRowCalculator                                                                                                                                                                                                                                                                                                                                           from "../../../../js/components/GridItemRowCalculator.js";
import SaverRequest                                                                                                                                                                                                                                                                                                                                                    from "../../../../js/components/SaverRequest.js";
import TableRowAppended                                                                                                                                                                                                                                                                                                                                                from "../../../../js/components/TableRowAppended.js";
import AlertComponent                                                                                                                                                                                                                                                                                                                                                  from "../../../../js/components/AlertComponent.js";
import { makeAjaxRequest }                                                                                                                                                                                                                                                                                                                                             from "../../../../js/components/MakeAjaxRequest.js";
import { StockInformation }                                                                                                                                                                                                                                                                                                                                            from "../../../../js/components/StockInformation.js";
// Instantiate BaseClass
var SaleOrder = function () {
    const totalAmountGetter = () => getNumText($(".gridItemTotalAmountInclTax"));

    var settings                          = {
        switchPreBal : $("#switchPreBal")
    };
    const buttonPendingRequisitionsLookup = $(".getPendingRequisitionsLookup");
    const gridItemPriceListDropdown       = $("#gridItemPriceListDropdown");
    const gridItemNameDropdown            = $("#gridItemNameDropdown");
    const gridItemColorCodeDropdown       = $("#gridItemColorCodeDropdown");
    const gridItemQty                     = $("#gridItemQty");
    const gridItemWeight                  = $("#gridItemWeight");
    const gridItemRate                    = $("#gridItemRate");
    const gridItemRateTypeDropdown        = $("#gridItemRateTypeDropdown");
    const gridItemRatePerKG               = $("#gridItemRatePerKG");
    const gridItemGAmount                 = $("#gridItemGAmount");
    const gridItemDiscountPercentage      = $("#gridItemDiscountPercentage");
    const gridItemDiscountPerUnit         = $("#gridItemDiscountPerUnit");
    const gridItemRatePerUnit             = $("#gridItemRatePerUnit");
    const gridItemAmountExclTax           = $("#gridItemAmountExclTax");
    const gridItemTaxPercentage           = $("#gridItemTaxPercentage");
    const gridItemTaxAmount               = $("#gridItemTaxAmount");
    const gridItemAmountInclTax           = $("#gridItemAmountInclTax");
    const gridRemarks                     = $("#txtGridRemarks");

    const saverRequest = new SaverRequest(base_url, general, {
        requestedUrl      : "saleOrder/save",
        requestType       : "POST",
        isConfirmed       : true,
        propsPrintVoucher : function (param) {
            Print_Voucher(param.id, 1, 1, "", false);
        },
        propsResetVoucher : function (param) {
            resetVoucher();
        }
    });
    var Print_Voucher  = function (vrnoa, paperSize, printSize, wrate = 0, isSendEmail = false) {
        try {
            const __etype         = "sale_orders";
            const __vrnoa         = vrnoa;
            const __pre_bal_print = 0;
            const __lang          = ($("#print_lang").val()) ? $("#print_lang").val() : 1;
            const __url           = base_url + "/doc/getPrintVoucherPDF/?etype=" + __etype + "&vrnoa=" + __vrnoa + "&pre_bal_print=" + __pre_bal_print + "&paperSize=" + paperSize + "&printSize=" + printSize + "&wrate=" + (wrate ? wrate : 0) + "&language_id=" + __lang;
            const _encodeURI      = encodeURI(__url);
            openPrintOnSettingConfiguration(_encodeURI);
        } catch (error) {
            console.error(error);
        }
    };

    const getSendMail = (vrnoa, paperSize, printSize, wrate = 0, email = "") => {
        const __etype         = "sale_orders";
        const __vrnoa         = vrnoa;
        const __pre_bal_print = 0;
        const __lang          = $("#print_lang").val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, __pre_bal_print, paperSize, printSize, wrate, __lang, email);
    };

    var getSaleOrderById = async function (saleOrderId) {
        const response = await makeAjaxRequest("GET", `${base_url}/saleOrder/getSaleOrderById`, {
            saleOrderId : saleOrderId
        });
        resetFields();
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({
                title     : "Error!",
                "message" : response.message,
                "type"    : "danger"
            });
            resetVoucher();
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({
                title     : "Warning!",
                "message" : response.message,
                "type"    : "warning"
            });
            resetVoucher();
        } else {
            populateData(response.data);
        }
    };

    var populateData = function (data) {
        $("#saleOrderIdHidden").val(data.id);

        appendSelect2ValueIfDataExists("accountDropdown", "party", "pid", "name", data, { disabled : true });
        $("button.getAccountLookUpRecord").prop("disabled", true);
        appendSelect2ValueIfDataExists("saleOfficerDropdown", "sale_officer", "id", "name", data);
        updateDatepickerWithFormattedDate("current_date", data.vrdate);
        updateDatepickerWithFormattedDate("chk_date", data.vrdate);
        updateDatepickerWithFormattedDate("due_date", data.due_date);

        $("#saleCommissionPercentage").val(data.commission_percentage);
        $("#customerName").val(data.customer_name);
        $("#customerMobile").val(data.customer_mobile);
        $("#receivers_list").val(data.prepared_by);

        $("#txtDiscount").val(data.discount_percentage);
        $("#txtDiscAmount").val(data.discount_amount);
        $("#txtExpense").val(data.expense_percentage);
        $("#txtExpAmount").val(data.expense_amount);
        $("#txtTax").val(data.further_tax_percentage);
        $("#txtTaxAmount").val(data.further_tax_amount);
        $("#txtNetAmount").val(data.net_amount);
        const tableAppended = new TableRowAppended("#purchase_table", {
            ...propsForTable,
            isUnitRate : false
        });
        $.each(data.sale_order_detail, function (index, elem) {
            elem.rate_type.division_factor = elem.rate_type.division_by;
            elem.rate_type.calculate_on    = elem.calculate_on;
            elem.item_price_list.hide      = "d-none";
            elem.detail_remarks            = ifNull(elem.detail_remarks, "");
            tableAppended.appendRow(elem);
        });
        calculateLowerTotal();
    };

    const validateSingleProductAdd = () => {
        let hasError     = false;
        let errorMessage = "";

        // remove the error class first
        $(".inputerror").removeClass("inputerror");

        const stockKeepingMethodIdValue = parseNumber($("#stockKeepingMethodId").val());

        if (! $("#gridItemPriceListDropdown").val()) {
            $("#select2-gridItemPriceListDropdown-container").parent().addClass("inputerror");
            errorMessage += `Item price list is required <br />`;
            hasError = true;
        }

        if (! $("#gridItemNameDropdown").val()) {
            $("#select2-gridItemNameDropdown-container").parent().addClass("inputerror");
            errorMessage += `Item id is required <br />`;
            hasError = true;
        }

        if (! $("#gridItemColorCodeDropdown").val()) {
            $("#select2-gridItemColorCodeDropdown-container").parent().addClass("inputerror");
            errorMessage += `Color Code is required <br />`;
            hasError = true;
        }

        const validateNumericInput = (value, fieldId, fieldName) => {
            const parsedValue = parseNumber(value);
            if (isNaN(parsedValue) || parsedValue <= 0) {
                $(fieldId).addClass("inputerror");
                errorMessage += `${fieldName} is required and must be a positive number.<br />`;
                hasError = true;
            }
        };

        if (stockKeepingMethodIdValue === 0) {
            errorMessage += `Stock Keeping Method is required.<br />`;
            hasError = true;
        }

        if (stockKeepingMethodIdValue == 1) {
            validateNumericInput($(gridItemQty).val(), "#gridItemQty", "Qty");
        } else if (stockKeepingMethodIdValue == 2) {
            validateNumericInput($(gridItemWeight).val(), "#gridItemWeight", "Weight");
        } else if (stockKeepingMethodIdValue == 3) {
            validateNumericInput($(gridItemQty).val(), "#gridItemQty", "Qty");
            validateNumericInput($(gridItemWeight).val(), "#gridItemWeight", "Weight");
        } else {
            validateNumericInput($(gridItemQty).val(), "#gridItemQty", "Qty");
        }

        validateNumericInput($(gridItemRate).val(), "#gridItemRate", "Rate");

        if (! $(gridItemRateTypeDropdown).val()) {
            $("#gridItemRateTypeDropdown").addClass("inputerror");
            errorMessage += `Rate Type is required <br />`;
            hasError = true;
        }

        if (stockKeepingMethodIdValue === 2) {
            validateNumericInput($(gridItemRatePerKG).val(), "#gridItemRatePerKG", "Rate Per KG");
        } else if (stockKeepingMethodIdValue === 3) {
            validateNumericInput($(gridItemRatePerKG).val(), "#gridItemRatePerKG", "Rate Per KG");
        }

        if (hasError) {
            return errorMessage;
        }

        return null;
    };

    var getSaveObject = function () {
        const saleOrder       = {};
        const saleOrderDetail = [];

        saleOrder.id                     = $("#saleOrderIdHidden").val();
        saleOrder.vrdate                 = $("#current_date").val();
        saleOrder.due_date               = $("#due_date").val();
        saleOrder.chk_date               = $("#chk_date").val();
        saleOrder.party_id               = $("#accountDropdown").val();
        saleOrder.sale_officer_id        = $("#saleOfficerDropdown").val();
        saleOrder.customer_name          = $("#customerName").val();
        saleOrder.customer_mobile        = $("#customerMobile").val();
        saleOrder.prepared_by            = $("#receivers_list").val();
        saleOrder.discount_percentage    = $("#txtDiscount").val();
        saleOrder.discount_amount        = $("#txtDiscAmount").val();
        saleOrder.expense_percentage     = $("#txtExpense").val();
        saleOrder.expense_amount         = $("#txtExpAmount").val();
        saleOrder.further_tax_percentage = $("#txtTax").val();
        saleOrder.further_tax_amount     = $("#txtTaxAmount").val();
        saleOrder.commission_percentage  = $("#saleCommissionPercentage").val();
        saleOrder.net_amount             = parseNumber($("#txtNetAmount").val()) || 0;

        $("#purchase_table").find("tbody tr").each(function (index, elem) {
            const gridItemDetail                   = {};
            gridItemDetail.item_id                 = $.trim($(elem).find("td.itemName").data("item_id"));
            gridItemDetail.color_code_id           = $.trim($(elem).find("td.colorCode").data("color_code_id"));
            gridItemDetail.detail_remarks          = $.trim($(elem).find("td.itemName textarea").val());
            gridItemDetail.stock_keeping_method_id = $.trim($(elem).find("td.itemName").data("stock_keeping_method_id"));
            gridItemDetail.rate_type_id            = $.trim($(elem).find("td.rateTypeName").data("rate_type_id"));
            gridItemDetail.item_price_list_id      = $.trim($(elem).find("td.item_price_list_id").data("item_price_list_id"));
            gridItemDetail.calculation_on          = $.trim($(elem).find("td.rateTypeName").data("calculation_on"));
            gridItemDetail.division_factor         = $.trim($(elem).find("td.rateTypeName").data("division_factor"));
            gridItemDetail.qty                     = $.trim($(elem).find("td.qty").text());
            gridItemDetail.weight                  = $.trim($(elem).find("td.weight").text());
            gridItemDetail.rate                    = getNumVal($(elem).find("td input.rate"));
            gridItemDetail.rate_per_kg             = getNumVal($(elem).find("td input.ratePerKG"));
            gridItemDetail.gross_amount            = $.trim($(elem).find("td.gAmount").text());
            gridItemDetail.discount_percentage     = getNumVal($(elem).find("td input.discountPercentage"));
            gridItemDetail.discount_per_unit       = getNumVal($(elem).find("td input.discountPerUnit"));
            gridItemDetail.discount_amount         = getNumText($(elem).find("td.discountAmount"));
            gridItemDetail.rate_per_unit           = getNumText($(elem).find("td.ratePerUnit"));
            gridItemDetail.amount_excl_tax         = getNumText($(elem).find("td.amountExclTax"));
            gridItemDetail.tax_percentage          = getNumVal($(elem).find("td input.taxPercentage"));
            gridItemDetail.tax_amount              = $.trim($(elem).find("td.taxAmount").text());
            gridItemDetail.amount_incl_tax         = $.trim($(elem).find("td.amountInclTax").text());
            saleOrderDetail.push(gridItemDetail);
        });
        const data           = {};
        data.saleOrder       = saleOrder;
        data.saleOrderDetail = saleOrderDetail;
        data.id              = $("#saleOrderIdHidden").val();
        return data;
    };

    // checks for the empty fields
    var validateSave = function () {

        var errorFlag = false;

        var accountDropdown = $("#accountDropdown");
        var currentDate     = $("#current_date");
        var netAmount       = $("#txtNetAmount");

        // remove the error class first
        $(".inputerror").removeClass("inputerror");

        if (! currentDate.val()) {
            currentDate.addClass("inputerror");
            errorFlag = true;
        }

        if (! accountDropdown.val()) {
            $("#select2-accountDropdown-container").parent().addClass("inputerror");
            errorFlag = true;
        }

        if (! netAmount.val()) {
            netAmount.addClass("inputerror");
            errorFlag = true;
        }

        return errorFlag;
    };

    var deleteVoucher = async function (vrnoa) {
        general.disableSave();
        const response = await makeAjaxRequest("delete", `${base_url}/saleOrder/delete`, {
            "chk_date" : $("#chk_date").val(),
            "vrdate"   : $("#cur_date").val(),
            "vrnoa"    : vrnoa
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({
                title     : "Error!",
                "message" : response.message,
                "type"    : "danger"
            });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({
                title     : "Warning!",
                "message" : response.message,
                "type"    : "warning"
            });
        } else {
            AlertComponent.getAlertMessage({
                title     : "Successfully!",
                "message" : response.message,
                "type"    : "success"
            });
            resetVoucher();
        }
        general.enableSave();
    };

    var calculateLowerTotal = function () {
        let gridItemTotalQty            = 0;
        let gridItemTotalWeight         = 0;
        let gridItemTotalGrossAmount    = 0;
        let gridItemTotalDiscountAmount = 0;
        let gridItemTotalAmountExclTax  = 0;
        let gridItemTotalTaxAmount      = 0;
        let gridItemTotalAmountInclTax  = 0;

        $("#purchase_table").find("tbody tr").each(function (index, elem) {
            gridItemTotalQty += getNumText($(this).closest("tr").find("td.qty"));
            gridItemTotalWeight += getNumText($(this).closest("tr").find("td.weight"));
            gridItemTotalGrossAmount += getNumText($(this).closest("tr").find("td.gAmount"));
            gridItemTotalDiscountAmount += getNumText($(this).closest("tr").find("td.discountAmount"));
            gridItemTotalAmountExclTax += getNumText($(this).closest("tr").find("td.amountExclTax"));
            gridItemTotalTaxAmount += getNumText($(this).closest("tr").find("td.taxAmount"));
            gridItemTotalAmountInclTax += getNumText($(this).closest("tr").find("td.amountInclTax"));
        });

        $(".gridItemTotalQty").text(parseNumber(gridItemTotalQty).toFixed(QTY_ROUNDING));
        $(".gridItemTotalWeight").text(parseNumber(gridItemTotalWeight).toFixed(WEIGHT_ROUNDING));
        $(".gridItemTotalGrossAmount").text(parseNumber(gridItemTotalGrossAmount).toFixed(AMOUNT_ROUNDING));
        $(".gridItemTotalAmountExclTax").text(parseNumber(gridItemTotalAmountExclTax).toFixed(AMOUNT_ROUNDING));
        $(".gridItemTotalTaxAmount").text(parseNumber(gridItemTotalTaxAmount).toFixed(AMOUNT_ROUNDING));
        $(".gridItemTotalAmountInclTax").text(parseNumber(gridItemTotalAmountInclTax).toFixed(AMOUNT_ROUNDING));

        var _DiscAmount    = getNumVal($("#txtDiscAmount"));
        var _ExpenseAmount = getNumVal($("#txtExpAmount"));
        var _TaxAmount     = getNumVal($("#txtTaxAmount"));
        const netAmount    = parseFloat(gridItemTotalAmountInclTax) - parseFloat(_DiscAmount) + parseFloat(_ExpenseAmount) + parseFloat(_TaxAmount);

        $("#txtNetAmount").val(isPositive(getSettingDecimal(netAmount), "txtNetAmount"));
    };

    var resetVoucher = function () {
        resetFields();
        getSaleOrderDataTable();
        loadSettingConfiguration();
        $("#voucher_type_hidden").val("new");
    };

    var validate    = function () {
        var errorFlag = false;
        var cur       = getSqlFormattedDate($("#current_date").val());
        var due       = getSqlFormattedDate($("#due_date").val());
        if (due < cur) {
            errorFlag = true;
        }
        return errorFlag;
    };
    var resetFields = function () {
        const resetArray = [{
            selector : "saleOrderIdHidden",
            options  : { disabled : true }
        }, "accountDropdown", "current_date", "due_date", "chk_date", "saleOfficerDropdown", "gridItemShortCodeDropdown", "gridItemNameDropdown", "gridItemColorCodeDropdown", "gridItemPriceListDropdown", "gridItemQty", "gridItemWeight", "gridItemRate", "gridItemRateTypeDropdown", "rateTypeDivisionFactor", "gridItemRatePerKG", "gridItemGAmount", "gridItemDiscountPercentage", "gridItemDiscountPerUnit", "gridItemRatePerUnit", "gridItemAmountExclTax", "gridItemTaxPercentage", "gridItemTaxAmount", "gridItemAmountInclTax", "txtGridRemarks", "txtDiscount", "txtDiscAmount", "txtExpense", "txtExpAmount", "txtTax", "txtTaxAmount", "txtNetAmount", "customerName", "customerMobile", "receivers_list", "saleCommissionPercentage", "rateTypeIsMultiplier"];
        clearValueAndText(resetArray);

        const resetClassArray = ["gridItemTotalQty", "gridItemTotalWeight", "gridItemTotalGrossAmount", "gridItemTotalAmountExclTax", "gridItemTotalTaxAmount", "gridItemTotalAmountInclTax"];
        clearValueAndText(resetClassArray, ".");

        $("#purchase_table tbody tr").remove();
        $("#purchase_tableReport tbody tr").remove();
        $("#laststockLocation_table tbody tr").remove();

        $("#party_p").html("");
        $("#otherItemInformation").html("");

        $("button.getAccountLookUpRecord").prop("disabled", false);
    };

    const getItemDetailRecord = (item_id, itemPriceId, accountId) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type     : "GET",
                url      : `${base_url}/item/getItemDetailRecord`,
                data     : {
                    item_id     : item_id,
                    itemPriceId : itemPriceId,
                    accountId   : accountId
                },
                datatype : "JSON",
                success  : function (response) {
                    resolve(response);
                },
                error    : function (xhr, status, error) {
                    reject(console.log(xhr.responseText));
                }
            });
        });
    };

    const getItemDetailById = async (item_id, itemPriceId) => {
        if (parseNumber(item_id) > 0) {
            const accountId = $("#accountDropdown").val();
            const response  = await getItemDetailRecord(item_id, itemPriceId, accountId);
            if (response.status === false && response.error !== "") {
                _getAlertMessage("Error!", response.message, "danger");
            } else if (response.status === false && response.message !== "") {
                _getAlertMessage("Information!", response.message, "info");
            } else {
                const saleModuleSetting         = response.data.sale_module_settings;
                const stockKeepingMethodIdValue = response.data.stock_keeping_method_id;
                const division_by               = response.data.item_calculation_method.division_by;
                const isMultiplier              = response.data.item_calculation_method.is_multiplier;

                if (saleModuleSetting && saleModuleSetting.show_stock_information && parseNumber(response.data.inventory_validated) == 1) {
                    const stockInfo = new StockInformation(response.data.stock_keeping_method_id, { isSale : true });
                    stockInfo.getStockInformation(parseNumber(response.data.item_id), $("#current_date").val(), 0);
                }

                $("#stockKeepingMethodId").val(response.data.stock_keeping_method_id);
                $("#calculationOn").val(response.data.item_calculation_method.calculation_on);
                $("#inventoryValidated").val(response.data.inventory_validated);
                $("#rateTypeDivisionFactor").val(division_by);
                $("#rateTypeIsMultiplier").val(isMultiplier);

                $(`#gridItemRate`).val(parseNumber(response.data.saleRate).toFixed(RATE_ROUNDING));
                $(`#gridItemDiscountPercentage`).val(parseNumber(response.data.saleDiscount).toFixed(2));
                $(`#gridItemTaxPercentage`).val(parseNumber(response.data.taxrate).toFixed(2));

                triggerAndRenderOptions($("#gridItemShortCodeDropdown"), response.data.short_code, response.data.item_id, false, false, true);
                triggerAndRenderOptions($("#gridItemNameDropdown"), response.data.item_des, response.data.item_id, false, false, true);
                appendSelect2ValueIfDataExists("gridItemWarehouseDropdown", "item_department", "did", "name", response.data);
                appendSelect2ValueIfDataExists("gridItemRateTypeDropdown", "item_calculation_method", "id", "name", response.data);
                populateOtherItemInformation(response.data);

                let focusId = gridItemQty;
                if (stockKeepingMethodIdValue == 1) {
                    $("#gridItemRatePerKG").prop("disabled", true);
                } else if (stockKeepingMethodIdValue == 2) {
                    focusId = gridItemWeight;
                    $("#gridItemRatePerKG").prop("disabled", false);
                } else if (stockKeepingMethodIdValue == 3) {
                    $("#gridItemRatePerKG").prop("disabled", false);
                }

                const colorCodeValue = parseNumber($("#gridItemColorCodeDropdown").val()) || 0;
                const warehouseValue = parseNumber($("#gridItemWarehouseDropdown").val()) || null;

                if (colorCodeValue == 0) {
                    setTimeout(() => {
                        // Only focus if the value is still 0
                        if (parseNumber($("#gridItemColorCodeDropdown").val()) == 0) {
                            $("#gridItemColorCodeDropdown").focus();
                        }
                    }, 200);
                } else if (warehouseValue == 0) {
                    setTimeout(() => {
                        // Only focus if the value is still 0
                        if (parseNumber($("#gridItemWarehouseDropdown").val()) == 0) {
                            $("#gridItemWarehouseDropdown").focus();
                        }
                    }, 200);
                } else {
                    setTimeout(() => {
                        // Only focus if the value is still 0
                        $(focusId).focus();
                    }, 200);
                }

                $("#gridItemRate").trigger("input");
                $("#txtDiscp").trigger("input");
                $("#txtGWeight").trigger("input");
            }
        }
    };

    const populateOtherItemInformation = (data) => {
        if (data) {
            var categoryName           = "";
            var subCategoryName        = "";
            var stockKeepingMethodName = "";
            var calculationType        = "";

            categoryName           = (data.item_category) ? data.item_category.name : "-";
            subCategoryName        = (data.item_sub_category) ? data.item_sub_category.name : "-";
            stockKeepingMethodName = (data.stock_keeping_method) ? data.stock_keeping_method.description : "-";
            calculationType        = `${(data.item_calculation_method) ? data.item_calculation_method.name : "-"}`;

            $("#otherItemInformation").html(`<b>Category</b> : ${categoryName} <br /><b>Sub Category</b> : ${subCategoryName} <br /><b>Stock Keeping</b> : ${stockKeepingMethodName} <br /><b>Calcualtion By</b> : ${calculationType} <br />`);
        }
    };

    const gridCalculateUpperFields = (event) => {

        let rate = parseFloat(gridItemRate.val()) || 0;

        const stockKeepingMethodId  = $("#calculationOn").val();
        const $divisionFactor       = parseNumber($("#rateTypeDivisionFactor").val());
        const $rateTypeIsMultiplier = parseNumber($("#rateTypeIsMultiplier").val());
        const qty                   = parseFloat(gridItemQty.val()) || 0;
        const weight                = parseFloat(gridItemWeight.val()) || 0;
        const divisionFactor        = {
            factor        : parseNumber($divisionFactor) ? parseNumber($divisionFactor) : 1,
            is_multiplier : $rateTypeIsMultiplier
        };

        const eventInputId = event.target.getAttribute("id");

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
        // Discount calculations

        var discountPercentage = parseFloat(gridItemDiscountPercentage.val()) || 0;
        var discountPerUnit    = parseFloat(gridItemDiscountPerUnit.val()) || 0;
        if (eventInputId === "gridItemDiscountPercentage") {
            discountPercentage = validPercentage(discountPercentage, event.target);
            // User is updating discount percentage
            discountPerUnit    = calculateDiscountPerUnitGridItemRow(discountPercentage, rate);
            gridItemDiscountPerUnit.val(discountPerUnit.toFixed(4));
        } else if (eventInputId === "gridItemDiscountPerUnit") {
            // User is updating discount per unit
            discountPercentage = calculateDiscountPercentageGridItemRow(discountPerUnit, rate);

            discountPercentage = validPercentage(discountPercentage, event.target);
            if (parseNumber(discountPercentage) == 0) {
                discountPerUnit = 0;
            }
            gridItemDiscountPercentage.val(discountPercentage.toFixed(2));
        } else {
            discountPercentage = validPercentage(discountPercentage, event.target);
            // User is updating discount percentage
            discountPerUnit    = calculateDiscountPerUnitGridItemRow(discountPercentage, rate);
            gridItemDiscountPerUnit.val(discountPerUnit.toFixed(4));
        }
        const discountAmount = calculateDiscountAmountGridItemRow(grossAmount, discountPercentage);

        // Unit Rate calculation
        const ratePerUnit = calculateRatePerUnitGridItemRow(rate, discountPerUnit, divisionFactor, stockKeepingMethodId);
        gridItemRatePerUnit.val(ratePerUnit.toFixed(RATE_ROUNDING));

        // Amount Excl. Tax calculation
        const amountExclTax = calculateAmountExclTaxGridItemRow(rate, qty, weight, divisionFactor, stockKeepingMethodId, discountPerUnit);
        gridItemAmountExclTax.val(amountExclTax.toFixed(AMOUNT_ROUNDING));

        // Tax Amount calculation
        var taxPercentage = parseFloat(gridItemTaxPercentage.val()) || 0;
        taxPercentage     = validPercentage(taxPercentage, event.target);
        var taxAmount     = parseFloat(gridItemTaxAmount.val()) || 0;
        if (eventInputId === "gridItemTaxPercentage") {
            taxAmount = calculateTaxAmountGridItemRow(amountExclTax, taxPercentage);
            gridItemTaxAmount.val(taxAmount.toFixed(AMOUNT_ROUNDING));
        } else if (eventInputId === "gridItemTaxAmount") {
            taxPercentage = calculateTaxPercentageGridItemRow(amountExclTax, taxAmount);
            gridItemTaxPercentage.val(taxPercentage.toFixed(2));
        } else {
            taxAmount = calculateTaxAmountGridItemRow(amountExclTax, taxPercentage);
            gridItemTaxAmount.val(taxAmount.toFixed(AMOUNT_ROUNDING));
        }

        gridItemTaxAmount.val(taxAmount.toFixed(AMOUNT_ROUNDING));

        const amountInclTax = calculateAmountInclTaxGridItemRow(amountExclTax, taxAmount);
        gridItemAmountInclTax.val(amountInclTax.toFixed(AMOUNT_ROUNDING));
    };

    let saleOrderViewList          = undefined;
    const getSaleOrderDataTable    = (saleOrderId = 0, fromDate = "", toDate = "") => {
        if (typeof saleOrderViewList !== "undefined") {
            saleOrderViewList.destroy();
            $("#saleOrderViewListTbody").empty();
        }
        saleOrderViewList = $("#saleOrderViewList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url     : `${base_url}/saleOrder/getSaleOrderDataTable`,
                type    : "GET",
                data    : {
                    "saleOrderId" : saleOrderId,
                    fromDate      : fromDate,
                    toDate        : toDate
                },
                dataSrc : function (json) {
                    return json.data;
                }
            },
            autoWidth  : false,
            buttons    : true,
            searching  : true,
            order      : [[0, "desc"]],
            columns    : [{
                data           : null,
                className      : "text-center",
                searchable     : false,
                orderable      : false,
                defaultContent : "",
                render         : function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1; // This will give you the serial number
                }
            }, {
                data      : "vrnoa",
                name      : "vrnoa",
                className : "text-left saleOrderVoucher"
            }, {
                data      : "vrdate",
                name      : "vrdate",
                className : "text-left voucherDate",
                render    : function (data, type, row) {
                    return updateFormattedDate(data);
                }
            }, {
                data      : "party.name",
                orderby   : "party.name",
                name      : "party.name",
                className : "customerName"
            }, {
                data      : "discount_percentage",
                name      : "discount_percentage",
                className : "text-right discount_percentage",
                render    : function (data, type, row) {
                    return parseNumber(data).toFixed(2);
                }
            }, {
                data      : "expense_percentage",
                name      : "expense_percentage",
                className : "text-right expense_percentage",
                render    : function (data, type, row) {
                    return parseNumber(data).toFixed(2);
                }
            }, {
                data      : "further_tax_percentage",
                name      : "further_tax_percentage",
                className : "text-right further_tax_percentage",
                render    : function (data, type, row) {
                    return parseNumber(data).toFixed(2);
                }
            }, {
                data      : "net_amount",
                name      : "net_amount",
                className : "text-right net_amount",
                render    : function (data, type, row) {
                    return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                }
            }, {
                data       : null,
                className  : "select text-right",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row) {
                    return `
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
                ${parseNumber(row.is_sale_order_completed) === 0 ? `<a class="dropdown-item btnComplete" data-sale_order_id="${row.id}" href="#"><i class='fa fa-check'></i> Mark Complete</a>` : `<a class="dropdown-item btnUnComplete" data-sale_order_id="${row.id}" href="#"><i class='fa fa-times'></i> UnComplete</a>`}
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Send Email</a>
            </div>
        </div>
        `;
                }
            }

            ],
            createdRow : function (row, data, dataIndex) {
                $(row).addClass("group odd:bg-white even:bg-slate-50");
                $("td", row).addClass("py-1 px-1 text-md align-middle");
            }
        });
        // Reinitialize tooltips on table redraw
        saleOrderViewList.on("draw", function () {
            $("[data-toggle=\"tooltip\"]").tooltip(); // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
    };
    const loadSettingConfiguration = () => {
        $("#txtTax").val(parseNumber(baseConfiguration.ftax).toFixed(2));
    };

    var getSaleCommissionPercentage = async function (accountId, saleOfficerId) {
        const response = await makeAjaxRequest("GET", `${base_url}/saleOfficerCommissionAllotment/getSaleCommissionPercentage`, {
            accountId     : accountId,
            saleOfficerId : saleOfficerId
        });

        $("#saleCommissionPercentage").val(0);
        if (response.status == true && response.data) {
            $("#saleCommissionPercentage").val(response.data.sale_commission_percentage);
        }
    };

    const completeVoucher = async (saleOrderId, isSaleOrderComplete = 1) => {
        doLoading(true);
        await disableButton(".btnComplete");
        try {
            const response = await makeAjaxRequest("POST", `${base_url}/saleOrder/completeSaleOrder`, {
                saleOrderId         : saleOrderId,
                isSaleOrderComplete : isSaleOrderComplete
            });

            if (response.status === false) {
                AlertComponent.getAlertMessage({
                    title   : "Error",
                    message : response.message,
                    type    : "danger"
                });
            } else if (response.status === true) {
                AlertComponent.getAlertMessage({
                    title   : "Success",
                    message : response.message,
                    type    : "success"
                });
                saleOrderViewList.ajax.reload();
            }
        } catch (e) {
            console.log(e);
        } finally {
            await enableDisableButton(".btnComplete");
            doLoading(false);
        }
    };

    return {

        init : function () {
            this.bindUI();
            $(".select2").select2();
            propsForTable.showDiscountSale = parseNumber(userRightArray.reports.show_discount_sale_order) === 1;
            if (! propsForTable.moduleSettings) {
                propsForTable.moduleSettings = {};
            }
            propsForTable.moduleSettings.stockKeepingMethodId = parseNumber(moduleSettings.stock_keeping_method_id);
            getSaleOrderDataTable();
            loadSettingConfiguration();
        },

        bindUI : function () {

            $("[data-toggle=\"tooltip\"]").tooltip();
            var self = this;
            $(gridItemQty).on("input", function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemWeight).on("input", function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemRate).on("input", function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemRatePerKG).on("input", function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemDiscountPercentage).on("input", function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemDiscountPerUnit).on("input", function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemRateTypeDropdown).on("change", async function (e) {
                e.preventDefault();
                await getItemRateTypeById($(this).val(), "rateTypeDivisionFactor");
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemTaxPercentage).on("input", function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $(gridItemTaxAmount).on("input", function (e) {
                e.preventDefault();
                gridCalculateUpperFields(e);
                calculateLowerTotal();
            });
            $("#saleCommissionPercentage").on("input", function (e) {
                e.preventDefault();
                validPercentage($(this).val(), e.target);
            });

            $(document.body).on("change", "input[name=\"durType\"]", function (e) {
                const dateType = $("input[type=\"radio\"][name=\"durType\"]:checked").val();
                if (dateType === "today") {
                    updateDateRangeCurrentDay("fromDate", "toDate");
                } else if (dateType === "year") {
                    setFinancialYearDate("fromDate", "toDate");
                } else if (dateType === "week") {
                    updateDateRangeToCurrentWeek("fromDate", "toDate");
                } else if (dateType === "month") {
                    updateDateRangeToCurrentMonth("fromDate", "toDate");
                }
            });

            /**
             * * This event working Grid Input Change Rate|Discount Percentage|Discount|Tax
             * */
            // Attach input event listeners for each row
            $("#purchase_table").on("input", "tr input.rate,tr input.ratePerKG, tr input.discountPercentage,tr input.discountPerUnit,tr input.taxPercentage", function (event) {
                const currentRow            = $(this).closest("tr");
                const gridItemRowCalculator = new GridItemRowCalculator(currentRow);
                gridItemRowCalculator.calculate(event, currentRow);
            });
            $("#gridItemShortCodeDropdown").on("change", async function (e) {
                e.preventDefault();
                $(".inputerror").removeClass("inputerror");
                $(".inputerror").removeClass("inputerror");

                const itemPriceListId = $("#gridItemPriceListDropdown").val();
                const customerId      = $("#accountDropdown").val();
                if (parseNumber(customerId) == 0) {
                    $("#select2-accountDropdown-container").parent().addClass("inputerror");
                    $("#gridItemShortCodeDropdown").val(0);
                    return AlertComponent.getAlertMessage({
                        title   : "Error",
                        message : "Please select customer",
                        type    : "danger"
                    });
                }
                if (parseNumber(itemPriceListId) == 0) {
                    $("#gridItemShortCodeDropdown").val(0);
                    $("#select2-gridItemPriceListDropdown-container").parent().addClass("inputerror");
                    return AlertComponent.getAlertMessage({
                        title   : "Error",
                        message : "Please select item price list",
                        type    : "danger"
                    });
                }
                await getItemDetailById($(this).val(), itemPriceListId);

            });
            $("#gridItemNameDropdown").on("change", async function (e) {
                e.preventDefault();
                $("#gridItemPriceListDropdown").removeClass("inputerror");
                const itemPriceListId = $("#gridItemPriceListDropdown").val();
                if (parseNumber(itemPriceListId) == 0) {
                    $("#gridItemNameDropdown").val(0);
                    $("#gridItemPriceListDropdown").addClass("inputerror");
                    return AlertComponent.getAlertMessage({
                        title   : "Error",
                        message : "Please select item price list",
                        type    : "danger"
                    });
                }
                await getItemDetailById($(this).val(), itemPriceListId);
            });
            $("#gridItemQty,#gridItemWeight,#gridItemRate,#gridItemRatePerKG,#gridItemDiscountPercentage,#gridItemDiscountPerUnit,#gridItemTaxPercentage,#gridItemTaxAmount,#txtGridRemarks").on("keypress", function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    $("#btnAdd").trigger("click");
                }
            });
            $("#btnAdd").on("click", function (e) {
                e.preventDefault();
                const alertMessage = validateSingleProductAdd();
                if (alertMessage) {
                    return AlertComponent.getAlertMessage({
                        "title"   : "Error!",
                        "message" : alertMessage,
                        "type"    : "danger"
                    });
                }

                const itemId               = parseNumber((gridItemNameDropdown.val()));
                const itemName             = $.trim($(gridItemNameDropdown).find("option:selected").text());
                const shortCode            = $.trim($("#gridItemShortCodeDropdown").find("option:selected").text());
                const stockKeepingMethodId = $("#stockKeepingMethodId").val();
                const calculationOn        = $("#calculationOn").val();
                const qty                  = $(gridItemQty).val();
                const weight               = $(gridItemWeight).val();
                const rate                 = $(gridItemRate).val();
                const rateTypeId           = $(gridItemRateTypeDropdown).val();
                const rateTypeName         = $.trim($(gridItemRateTypeDropdown).find("option:selected").text());
                const divisionFactor       = parseNumber($("#rateTypeDivisionFactor").val());
                const rateTypeIsMultiplier = parseNumber($("#rateTypeIsMultiplier").val());
                const ratePerKG            = $(gridItemRatePerKG).val();
                const gAmount              = $(gridItemGAmount).val();
                const discountPercentage   = $(gridItemDiscountPercentage).val();
                const discountPerUnit      = $(gridItemDiscountPerUnit).val();
                const discountAmount       = calculateDiscountAmountGridItemRow(gAmount, discountPercentage);
                const ratePerUnit          = $(gridItemRatePerUnit).val();
                const amountExclTax        = $(gridItemAmountExclTax).val();
                const taxPercentage        = $(gridItemTaxPercentage).val();
                const taxAmount            = $(gridItemTaxAmount).val();
                const amountInclTax        = $(gridItemAmountInclTax).val();
                const remarks              = ifNull($(gridRemarks).val(), "");
                const itemPriceListId      = $("#gridItemPriceListDropdown").val();
                const itemPriceListName    = $.trim($("#gridItemPriceListDropdown").find("option:selected").text());
                const colorCodeId          = $(gridItemColorCodeDropdown).val();
                const colorCodeName        = $(gridItemColorCodeDropdown).find("option:selected").text().trim();

                const rowData = {
                    item_details            : {
                        item_id    : itemId,
                        item_des   : itemName,
                        short_code : shortCode
                    },
                    stock_keeping_method_id : stockKeepingMethodId,
                    qty                     : qty,
                    weight                  : weight,
                    rate                    : rate,
                    rate_type               : {
                        id              : rateTypeId,
                        name            : rateTypeName,
                        division_factor : divisionFactor,
                        calculation_on  : calculationOn,
                        is_multiplier   : rateTypeIsMultiplier
                    },
                    rate_per_kg             : ratePerKG,
                    gross_amount            : gAmount,
                    discount_percentage     : discountPercentage,
                    discount_per_unit       : discountPerUnit,
                    discount_amount         : discountAmount,
                    rate_per_unit           : ratePerUnit,
                    amount_excl_tax         : amountExclTax,
                    tax_percentage          : taxPercentage,
                    tax_amount              : taxAmount,
                    amount_incl_tax         : amountInclTax,
                    detail_remarks          : remarks,
                    item_price_list         : {
                        id              : itemPriceListId,
                        price_list_name : itemPriceListName,
                        hide            : "d-none"
                    },
                    color_code              : {
                        id   : colorCodeId,
                        name : colorCodeName
                    }
                };

                // reset the values of the annoying fields
                $("#gridItemShortCodeDropdown").val("").trigger("change.select2");
                $(gridItemNameDropdown).val("").trigger("change.select2");
                $(gridItemQty).val("");
                $(gridItemWeight).val("");
                $(gridItemRate).val("");
                $(gridItemRateTypeDropdown).val("").trigger("change.select2");
                $(gridItemRatePerKG).val("");
                $(gridItemGAmount).val("");
                $(gridItemDiscountPercentage).val("");
                $(gridItemDiscountPerUnit).val("");
                $(gridItemRatePerUnit).val("");
                $(gridItemAmountExclTax).val("");
                $(gridItemTaxPercentage).val("");
                $(gridItemTaxAmount).val("");
                $(gridItemAmountInclTax).val("");
                $(gridRemarks).val("");
                $("#stockKeepingMethodId").val("");
                $("#calculationOn").val("");
                $("#rateTypeDivisionFactor").val("");
                $("#rateTypeIsMultiplier").val("");

                const tableAppended = new TableRowAppended("#purchase_table", {
                    "stockKeepingMethod" : stockKeepingMethodId,
                    "isUnitRate"         : false, ...propsForTable
                });
                tableAppended.appendRow(rowData);
                const gridItemRowCalculator = new GridItemRowCalculator();
                gridItemRowCalculator.calculateVoucherLowerTotal();
                $("#gridItemShortCodeDropdown").focus();
                $("#accountDropdown").prop("disabled", true);
                $(".getAccountLookUpRecord").prop("disabled", true);

            });

            $("#purchase_table").on("click", ".btnRowEdit", function (event) {
                event.preventDefault();

                const row                   = $(this).closest("tr");
                const gridItemRowCalculator = new GridItemRowCalculator(row);

                const editItemId                 = row.find("td.itemName").data("item_id");
                const editItemName               = row.find("td.itemName").clone().children("span").remove().end().text();
                const editShortCode              = row.find("td.itemName").data("short_code");
                const editStockKeepingMethodId   = row.find("td.itemName").data("stock_keeping_method_id");
                const editItemPriceListId        = row.find("td.item_price_list_id").data("item_price_list_id");
                const editItemPriceListName      = row.find("td.item_price_list_id").text().trim();
                const editItemQty                = parseNumber(row.find("td.qty").text());
                const editItemWeight             = parseNumber(row.find("td.weight").text());
                const editItemRate               = parseNumber(row.find("td.rate input").val());
                const editRateTypeId             = row.find("td.rateTypeName").data("rate_type_id");
                const editRateTypeDivisionFactor = row.find("td.rateTypeName").data("division_factor");
                const editRateTypeCalculation    = row.find("td.rateTypeName").data("calculation_on");
                const editRateTypeIsMultiplier   = row.find("td.rateTypeName").data("is_multiplier");
                const editRateTypeName           = row.find("td.rateTypeName").text();
                const editRatePerKG              = parseNumber(row.find("td.ratePerKG input").val());
                const editGAmount                = parseNumber(row.find("td.gAmount").text());
                const editDiscountPercentage     = parseNumber(row.find("td.discountPercentage input").val());
                const editDiscountPerUnit        = parseNumber(row.find("td.discountPerUnit input").val());
                const editDiscountAmount         = parseNumber(row.find("td.discountAmount").text());
                const editRatePerUnit            = parseNumber(row.find("td.ratePerUnit").text());
                const editAmountExclTax          = parseNumber(row.find("td.amountExclTax").text());
                const editTaxPercentage          = parseNumber(row.find("td.taxPercentage input").val());
                const editTaxAmount              = parseNumber(row.find("td.taxAmount").text());
                const editAmountInclTax          = parseNumber(row.find("td.amountInclTax").text());
                const editColorCodeId            = row.find("td.colorCode").data("color_code_id");
                const editColorCodeName          = row.find("td.colorCode").text();
                const remarks                    = row.find("td.itemName textarea").val();

                triggerAndRenderOptions($("#gridItemShortCodeDropdown"), editShortCode, editItemId, false);
                triggerAndRenderOptions($("#gridItemNameDropdown"), editItemName, editItemId, false);
                triggerAndRenderOptions($("#gridItemColorCodeDropdown"), editColorCodeName, editColorCodeId, false);
                triggerAndRenderOptions($("#gridItemRateTypeDropdown"), editRateTypeName, editRateTypeId, false);

                $("#stockKeepingMethodId").val(editStockKeepingMethodId);
                $("#rateTypeDivisionFactor").val(editRateTypeDivisionFactor);
                $("#calculationOn").val(editRateTypeCalculation);
                $("#rateTypeIsMultiplier").val(editRateTypeIsMultiplier);

                triggerAndRenderOptions($("#gridItemPriceListDropdown"), editItemPriceListName, editItemPriceListId, false);

                $(gridItemQty).val(editItemQty);
                $(gridItemWeight).val(editItemWeight);
                $(gridItemRate).val(editItemRate);

                $(gridItemRatePerKG).val(editRatePerKG);
                $(gridItemGAmount).val(editGAmount);
                $(gridItemDiscountPercentage).val(editDiscountPercentage);
                $(gridItemDiscountPerUnit).val(editDiscountPerUnit);
                $(gridItemRatePerUnit).val(editRatePerUnit);
                $(gridItemAmountExclTax).val(editAmountExclTax);
                $(gridItemTaxPercentage).val(editTaxPercentage);
                $(gridItemTaxAmount).val(editTaxAmount);
                $(gridItemAmountInclTax).val(editAmountInclTax);
                $(gridRemarks).val(remarks);

                if (editStockKeepingMethodId == 1) {
                    $(gridItemRatePerKG).prop("disabled", true);
                } else if (editStockKeepingMethodId == 2) {
                    $(gridItemRatePerKG).prop("disabled", false);
                } else if (editStockKeepingMethodId == 3) {
                    $(gridItemRatePerKG).prop("disabled", false);
                }
                $(this).closest("tr").remove();
                gridItemRowCalculator.calculate(event, row);
            });
            // when btnRowRemove is clicked
            $("#purchase_table").on("click", ".btnRowRemove", function (e) {
                e.preventDefault();
                const row                   = $(this).closest("tr");
                const gridItemRowCalculator = new GridItemRowCalculator(row);
                row.remove();
                gridItemRowCalculator.calculate(e, row);
            });

            $("#txtDiscount, #txtDiscAmount, #txtExpense, #txtExpAmount, #txtTax, #txtTaxAmount").on("input", function () {
                const totalAmount             = totalAmountGetter();
                const isCalculatingPercentage = $(this).attr("id").includes("Amount");

                if ($(this).is("#txtTax, #txtTaxAmount")) {
                    handlePercentageOrAmountInput("txtTax", "txtTaxAmount", totalAmount, isCalculatingPercentage);
                } else if ($(this).is("#txtDiscount, #txtDiscAmount")) {
                    handlePercentageOrAmountInput("txtDiscount", "txtDiscAmount", totalAmount, isCalculatingPercentage);
                } else if ($(this).is("#txtExpense, #txtExpAmount")) {
                    handlePercentageOrAmountInput("txtExpense", "txtExpAmount", totalAmount, isCalculatingPercentage);
                }
                calculateLowerTotal();
            });

            $("#saleOrderSyncAlt").on("click", function (e) {
                e.preventDefault();
                $("#fromDate").datepicker("update", new Date());
                $("#toDate").datepicker("update", new Date());
                getSaleOrderDataTable();
            });
            $("#saleOrderFilter").on("click", function (e) {
                e.preventDefault();
                const fromDate = $("#fromDate").val();
                const toDate   = $("#toDate").val();
                getSaleOrderDataTable("", fromDate, toDate);
            });
            $(document.body).on("click", ".getItemLookUpRecord", function (e) {
                e.preventDefault();
                getItemLookUpRecord("sale_orders", "");
            });
            $("body").on("click", "#item-lookup .populateItem", function (e) {
                const ItemId        = $(this).data("itemid");
                const ItemShortCode = $.trim($(this).closest("tr").find("td.item_des").text());
                triggerAndRenderOptions($("#gridItemNameDropdown"), ItemShortCode, ItemId);
                $("#item-lookup").modal("hide");
            });
            $("body").on("click", "#AccountLookUpModal .populateAccountLookUp", function (e) {
                e.preventDefault();
                const accountText = $.trim($(this).closest("tr").find("td.name").text());
                const accountId   = $.trim($(this).closest("tr").find("td.name").data("account_id"));
                triggerAndRenderOptions($("#accountDropdown"), accountText, accountId);
                $("#AccountLookUpModal").modal("hide");
            });
            $("#accountDropdown").on("change", function () {
                $("#saleCommissionPercentage").val(0);
                const accountId   = $(this).val();
                const voucherDate = $("#current_date").val();
                getAccountBalanced(accountId, voucherDate);
            });

            $(".getAccountLookUpRecord").on("click", function (e) {
                e.preventDefault();
                getAccountLookUpRecord("sale_orders");
            });

            $("#saleOfficerDropdown").on("change", async function () {
                const accountId = $("#accountDropdown").val();
                await getSaleCommissionPercentage(accountId, $(this).val());
            });
            $("body").on("click", ".btnEditPrevVoucher", function (e) {
                e.preventDefault();
                var saleOrderId = parseNumber($(this).data("sale_order_id"));
                getSaleOrderById(saleOrderId);
                $("a[href=\"#Main\"]").trigger("click");
            });
            $(".btnSave").on("click", function (e) {
                e.preventDefault();
                self.initSave();
            });
            $("body").on("click", ".btnPrint", function (e) {
                const saleOrderId         = $(this).data("sale_order_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(base_url + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(saleOrderId, settingPrintDefault, "lg", "");
                }
            });

            $("body").on("click", ".btnPrintA4WithHeader", function (e) {
                const saleOrderId = $(this).data("sale_order_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(saleOrderId, 1, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintA4WithOutHeader", function (e) {
                const saleOrderId = $(this).data("sale_order_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(saleOrderId, 2, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintB5WithHeader", function (e) {
                const saleOrderId = $(this).data("sale_order_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(saleOrderId, 3, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintB5WithOutHeader", function (e) {
                const saleOrderId = $(this).data("sale_order_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(saleOrderId, 4, "lg", "");
                }
            });

            $("body").on("click", ".btnPrintASEmail", function (e) {
                const saleOrderId         = $(this).data("sale_order_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                getSendMail(saleOrderId, settingPrintDefault, "lg", "", true);
            });

            $(".btnReset").on("click", function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $("body").on("click", ".btnDelete", function (e) {
                const saleOrderId = $(this).data("sale_order_id");
                e.preventDefault();
                if (saleOrderId !== "") {
                    _getConfirmMessage("Warning!", "Are you sure to delete this voucher", "warning", function (result) {
                        if (result) {
                            deleteVoucher(saleOrderId);
                        }
                    });
                }
            });

            $(document.body).on("click", ".btnComplete", function (e) {
                e.preventDefault();
                const saleOrderId = $(this).data("sale_order_id");
                if (saleOrderId !== "") {
                    _getConfirmMessage("Warning!", "Are you sure to complete this voucher", "warning", async function (result) {
                        if (result) {
                            await completeVoucher(saleOrderId, 1);
                        }
                    });
                }
            });
            // btnUnComplete
            $(document.body).on("click", ".btnUnComplete", function (e) {
                e.preventDefault();
                const saleOrderId = $(this).data("sale_order_id");
                if (saleOrderId !== "") {
                    _getConfirmMessage("Warning!", "Are you sure to uncomplete this voucher", "warning", async function (result) {
                        if (result) {
                            await completeVoucher(saleOrderId, 0);
                        }
                    });
                }
            });

            shortcut.add("F10", function () {
                $(".btnSave").get()[0].click();
            });
            shortcut.add("F1", function () {
                $("a[href=\"#party-lookup\"]").get()[0].click();
            });
            shortcut.add("F2", function () {
                $(".getItemLookUpRecord").get()[0].click();
            });
            shortcut.add("F5", function () {
                $("#resetButton").first().trigger("click");
            });

            saleOrder.fetchRequestedVr();
        },

        // prepares the data to save it into the database
        initSave         : function () {
            const validateSaveFlag = validateSave();
            const validateDueDate  = validate();
            if (! validateSaveFlag) {
                if (! validateDueDate) {
                    var rowsCount = $("#purchase_table").find("tbody tr").length;
                    if (rowsCount > 0) {
                        const saveObj = getSaveObject();
                        const data    = {
                            "saleOrder"       : JSON.stringify(saveObj.saleOrder),
                            "saleOrderDetail" : JSON.stringify(saveObj.saleOrderDetail),
                            "id"              : saveObj.id,
                            "chk_date"        : $("#chk_date").val(),
                            "vrdate"          : $("#cur_date").val()
                        };
                        saverRequest.sendRequest(data);
                    } else {
                        AlertComponent.getAlertMessage({
                            title   : "Error!",
                            message : "No data found to save",
                            type    : "danger"
                        });
                    }
                } else {
                    AlertComponent.getAlertMessage({
                        title   : "Error!",
                        message : "Validity Date Must be Greater Than Voucher Date",
                        type    : "danger"
                    });
                }
            } else {
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : "Correct the errors...",
                    type    : "danger"
                });
            }
        },
        fetchRequestedVr : function () {

            var vrnoa = general.getQueryStringVal("vrnoa");
            vrnoa     = parseInt(vrnoa);
            $("#txtVrnoa").val(vrnoa);
            $("#txtVrnoaHidden").val(vrnoa);
            if (! isNaN(vrnoa)) {
                getSaleOrderById(vrnoa);
            }
        }
    };

};

const saleOrder = new SaleOrder();
saleOrder.init();

// Corrected function to match the HTML ID
$(function () {

    new DynamicOption("#accountDropdown", {
        requestedUrl    : dropdownOptions.getAllCustomerLevelAccount,
        placeholderText : "Choose Customer"
    });

    new DynamicOption("#saleOfficerDropdown", {
        requestedUrl    : dropdownOptions.getAllOfficerByDesignation,
        placeholderText : "Choose Sale Officer",
        allowClear      : true,
        designation     : "Sales Officer"
    });

    new DynamicOption("#gridItemRateTypeDropdown", {
        requestedUrl          : `${base_url}/item/calculationMethod/getAllRateType`,
        placeholderText       : "Choose Rate Type",
        allowClear            : true,
        includeDataAttributes : true
    });

    new DynamicOption("#gridItemPriceListDropdown", {
        requestedUrl    : `${base_url}/item/itemPrice/getAllPriceList`,
        placeholderText : "Choose Item Price"
    });

    new DynamicOption("#gridItemNameDropdown", {
        requestedUrl    : dropdownOptions.saleInventoryCategories,
        placeholderText : "Choose Item Name"
    });

    new DynamicOption("#gridItemShortCodeDropdown", {
        requestedUrl    : dropdownOptions.saleInventoryCategoriesShortCode,
        placeholderText : "Choose Short Code"
    });

    new DynamicOption("#gridItemColorCodeDropdown", {
        requestedUrl    : `${base_url}/color/getAllColorCodes`,
        placeholderText : "Choose Color Code",
        allowClear      : true
    });
});
