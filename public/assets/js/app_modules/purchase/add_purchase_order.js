// assets/js/app_modules/purchase/add_purchase_order.js
import BaseClass                                                                                                                                                                                                                                                                                                          from "../../../../js/components/BaseClass.js";
import DynamicOption                                                                                                                                                                                                                                                                                                      from "../../../../js/components/DynamicOption.js";
import { AMOUNT_ROUNDING, QTY_ROUNDING }                                                                                                                                                                                                                                                                                  from "../../../../js/components/GlobalConstants.js";
import { dropdownOptions }                                                                                                                                                                                                                                                                                                from "../../../../js/components/GlobalUrl.js";
import GridItemRowCalculator                                                                                                                                                                                                                                                                                              from "../../../../js/components/GridItemRowCalculator.js";
import { validPercentage }                                                                                                                                                                                                                                                                                                from "../../../../js/components/Helpers.js";
import SaverRequest                                                                                                                                                                                                                                                                                                       from "../../../../js/components/SaverRequest.js";
import { StockInformation }                                                                                                                                                                                                                                                                                               from "../../../../js/components/StockInformation.js";
import TableRowAppended                                                                                                                                                                                                                                                                                                   from "../../../../js/components/TableRowAppended.js";
import { calculateAmountExclTaxGridItemRow }                                                                                                                                                                                                                                                                              from "../../../../js/components/calculations/calculateAmountExclTaxGridItemRow.js";
import { calculateAmountInclTaxGridItemRow }                                                                                                                                                                                                                                                                              from "../../../../js/components/calculations/calculateAmountInclTaxGridItemRow.js";
import { calculateDiscountAmountGridItemRow }                                                                                                                                                                                                                                                                             from "../../../../js/components/calculations/calculateDiscountAmountGridItemRow.js";
import { calculateDiscountPerUnitGridItemRow }                                                                                                                                                                                                                                                                            from "../../../../js/components/calculations/calculateDiscountPerUnitGridItemRow.js";
import { calculateDiscountPercentageGridItemRow }                                                                                                                                                                                                                                                                         from "../../../../js/components/calculations/calculateDiscountPercentageGridItemRow.js";
import { calculateGrossAmountGridItemRow }                                                                                                                                                                                                                                                                                from "../../../../js/components/calculations/calculateGrossAmountGridItemRow.js";
import { calculateRateGridItemRow }                                                                                                                                                                                                                                                                                       from "../../../../js/components/calculations/calculateRateGridItemRow.js";
import { calculateRatePerKgGridItemRow }                                                                                                                                                                                                                                                                                  from "../../../../js/components/calculations/calculateRatePerKgGridItemRow.js";
import { calculateRatePerUnitGridItemRow }                                                                                                                                                                                                                                                                                from "../../../../js/components/calculations/calculateRatePerUnitGridItemRow.js";
import { calculateTaxAmountGridItemRow }                                                                                                                                                                                                                                                                                  from "../../../../js/components/calculations/calculateTaxAmountGridItemRow.js";
import { calculateTaxPercentageGridItemRow }                                                                                                                                                                                                                                                                              from "../../../../js/components/calculations/calculateTaxPercentageGridItemRow.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, getItemRateTypeById, handleObjectName, handlePercentageOrAmountInput, ifNull, isPositive, isPreviousBalance, parseNumber, setFinancialYearDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek, updateFormattedDate } from "../commonFunctions/CommonFunction.js";
import { propsForTable }                                                                                                                                                                                                                                                                                                  from "../commonFunctions/PopulateDataOnVouchers.js";
import AlertComponent                                                                                                                                                                                                                                                                                                     from "../../../../js/components/AlertComponent.js";

const baseInstance = new BaseClass();
const baseURL      = base_url;
// Instantiate BaseClass
var Purchase       = function () {
    const totalAmountGetter               = () => getNumText($(".gridItemTotalAmountInclTax"));
    var settings                          = {
        switchPreBal : $("#switchPreBal")
    };
    const buttonPendingRequisitionsLookup = $(".getPendingRequisitionsLookup");
    const gridItemWarehouseDropdown       = $("#gridItemWarehouseDropdown");
    const gridItemNameDropdown            = $("#gridItemNameDropdown");
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
    const purchaseModuleSettings          = _purchaseModuleSettings;
    const saverRequest                    = new SaverRequest(baseURL, general, {
        requestedUrl      : "purchaseorder/savePurchaseOrder",
        requestType       : "POST",
        isConfirmed       : true,
        propsPrintVoucher : function (param) {
            printVoucher(param.id, 1, 1, "", false);
        },
        propsResetVoucher : function (param) {
            resetVoucher();
        }
    });
    var printVoucher                      = function (vrnoa, paperSize, printSize, wrate = "", isSendEmail = false) {
        try {
            const __vrnoa         = vrnoa;
            const previousBalance = isPreviousBalance();
            const __lang          = ($("#print_lang").val()) ? $("#print_lang").val() : 1;
            const __url           = baseURL + "/doc/getPrintVoucherPDF/?etype=purchase_orders" + "&vrnoa=" + __vrnoa + "&pre_bal_print=" + previousBalance + "&paperSize=" + paperSize + "&printSize=" + printSize + "&wrate=" + (wrate ? wrate : 0) + "&language_id=" + __lang;
            const _encodeURI      = encodeURI(__url);
            openPrintOnSettingConfiguration(_encodeURI);
        } catch (error) {
            console.error(error);
        }
    };

    const getSendMail = (hd, prnt, wrate = 0, email = "") => {
        const __etype         = "pur_order";
        const __vrnoa         = $("#txtVrnoa").val();
        const previousBalance = isPreviousBalance();
        const __lang          = $("#print_lang").val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, previousBalance, hd, prnt, wrate, __lang, email);
    };

    var fetch = function (purchaseOrderId) {

        $.ajax({
            url      : `${baseURL}/purchaseorder/fetch`,
            type     : "GET",
            data     : { "purchaseOrderId" : purchaseOrderId },
            dataType : "JSON",
            success  : function (response) {
                resetFields();
                if (response.status == false && response.error !== "") {
                    _getAlertMessage("Error!", response.message, "danger");
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage("Information!", response.message, "info");
                    resetVoucher();
                } else {
                    populateData(response.data);
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    var populateData = function (data) {
        baseInstance.runException(() => {
            $("#purchaseOrderIdHidden").val(data.id);
            const party = handleObjectName(data, "party");
            if (party) {
                triggerAndRenderOptions($("#accountDropdown"), party.name, party.pid, false);
            }
            const purchaseOfficer = handleObjectName(data, "purchase_officer");
            if (purchaseOfficer) {
                triggerAndRenderOptions($("#purchaseOfficerDropdown"), purchaseOfficer.name, purchaseOfficer.id, false);
            }
            populateDateValue("current_date", data.vrdate);
            populateDateValue("chk_date", data.vrdate);
            populateDateValue("due_date", data.due_date);

            $("#supplierName").val(data.supplier_name);
            $("#supplierMobile").val(data.supplier_mobile);
            $("#receivers_list").val(data.prepared_by);

            $("#txtDiscount").val(data.discount_percentage);
            $("#txtDiscAmount").val(data.discount_amount);
            $("#txtExpense").val(data.expense_percentage);
            $("#txtExpAmount").val(data.expense_amount);
            $("#txtTax").val(data.further_tax_percentage);
            $("#txtTaxAmount").val(data.further_tax_amount);
            $("#txtNetAmount").val(data.net_amount);

            const tableAppender = new TableRowAppended("#purchase_table", propsForTable);
            let warehouseId,
                warehouseName   = "";
            $.each(data.purchase_order_details, function (index, elem) {
                elem.rate_type.division_factor = elem.rate_type.division_by;
                warehouseId                    = elem.department_detail.did;
                warehouseName                  = elem.department_detail.name;

                elem.department_details = elem.department_detail;
                elem.detail_remarks     = ifNull(elem.detail_remarks, "");
                tableAppender.appendRow(elem);
            });
            triggerAndRenderOptions($("#gridItemWarehouseDropdown"), warehouseName, warehouseId, false);
            calculateLowerTotal();
        });

    };

    const validateSingleProductAdd = () => {
        let hasError     = false;
        let errorMessage = "";

        // remove the error class first
        $(".inputerror").removeClass("inputerror");

        const stockKeepingMethodIdValue = parseNumber($("#stockKeepingMethodId").val());

        if (! $("#gridItemNameDropdown").val()) {
            $("#select2-gridItemNameDropdown-container").parent().addClass("inputerror");
            errorMessage += `Item is required <br />`;
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

        if (parseNumber(purchaseModuleSettings.grid_rate_type) == 1) {
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
        }

        if (! $("#gridItemWarehouseDropdown").val()) {
            $("#select2-gridItemWarehouseDropdown-container").parent().addClass("inputerror");
            errorMessage += `Warehouse is required <br />`;
            hasError = true;
        }

        if (hasError) {
            return errorMessage;
        }
        return null;
    };

    var getSaveObject = function () {
        const purchaseOrder       = {};
        const purchaseOrderDetail = [];

        purchaseOrder.id                     = $("#purchaseOrderIdHidden").val();
        purchaseOrder.vrdate                 = $("#current_date").val();
        purchaseOrder.due_date               = $("#due_date").val();
        purchaseOrder.chk_date               = $("#chk_date").val();
        purchaseOrder.party_id               = $("#accountDropdown").val();
        purchaseOrder.purchase_officer_id    = $("#purchaseOfficerDropdown").val();
        purchaseOrder.supplier_name          = $("#supplierName").val();
        purchaseOrder.supplier_mobile        = $("#supplierMobile").val();
        purchaseOrder.prepared_by            = $("#receivers_list").val();
        purchaseOrder.discount_percentage    = $("#txtDiscount").val();
        purchaseOrder.discount_amount        = $("#txtDiscAmount").val();
        purchaseOrder.expense_percentage     = $("#txtExpense").val();
        purchaseOrder.expense_amount         = $("#txtExpAmount").val();
        purchaseOrder.further_tax_percentage = $("#txtTax").val();
        purchaseOrder.further_tax_amount     = $("#txtTaxAmount").val();
        purchaseOrder.net_amount             = parseNumber($("#txtNetAmount").val()) || 0;

        $("#purchase_table").find("tbody tr").each(function (index, elem) {
            const gridItemDetail                   = {};
            gridItemDetail.item_id                 = $.trim($(elem).find("td.itemName").data("item_id"));
            gridItemDetail.detail_remarks          = $.trim($(elem).find("td.itemName textarea").val());
            gridItemDetail.stock_keeping_method_id = $.trim($(elem).find("td.itemName").data("stock_keeping_method_id"));
            gridItemDetail.rate_type_id            = $.trim($(elem).find("td.rateTypeName").data("rate_type_id"));
            gridItemDetail.warehouse_id            = $.trim($(elem).find("td.department_id").data("department_id"));
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
            purchaseOrderDetail.push(gridItemDetail);
        });
        const data               = {};
        data.purchaseOrder       = purchaseOrder;
        data.purchaseOrderDetail = purchaseOrderDetail;
        data.id                  = $("#purchaseOrderIdHidden").val();
        return data;
    };

    // checks for the empty fields
    var validateSave   = function () {
        let errorFlag         = false;
        const accountDropdown = $("#accountDropdown");
        const currentDate     = $("#current_date");
        const netAmount       = $("#txtNetAmount");
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
    // checks for the empty fields
    var validateSearch = function () {

        var errorFlag = false;
        var fromEl    = $("#from_date");
        var toEl      = $("#to_date");

        // remove the error class first
        $(".inputerror").removeClass("inputerror");

        if (! toEl.val()) {
            toEl.addClass("inputerror");
            errorFlag = true;
        }
        if (! fromEl.val()) {
            $("#from_date").addClass("inputerror");
            errorFlag = true;
        }

        return errorFlag;
    };

    var deleteVoucher = function (vrnoa) {
        general.disableSave();
        $.ajax({
            url      : baseURL + "/purchaseorder/delete",
            type     : "POST",
            data     : {
                "chk_date" : $("#chk_date").val(),
                "vrdate"   : $("#cur_date").val(),
                "vrnoa"    : vrnoa
            },
            dataType : "JSON",
            success  : function (response) {
                if (response.status == false && response.error !== "") {
                    _getAlertMessage("Error!", response.message, "danger");
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage("Information!", response.message, "info");
                    resetVoucher();
                } else {
                    _getAlertMessage("Successfully!", response.message, "success");
                    resetVoucher();
                }
                general.enableSave();
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
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
        getPODataTable();
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
            selector : "purchaseOrderIdHidden",
            options  : { disabled : true }
        }, "accountDropdown", "current_date", "due_date", "chk_date", "purchaseOfficerDropdown", "gridItemShortCodeDropdown", "gridItemNameDropdown", "gridItemWarehouseDropdown", "gridItemQty", "gridItemWeight", "gridItemRate", "gridItemRateTypeDropdown", "rateTypeDivisionFactor", "gridItemRatePerKG", "gridItemGAmount", "gridItemDiscountPercentage", "gridItemDiscountPerUnit", "gridItemRatePerUnit", "gridItemAmountExclTax", "gridItemTaxPercentage", "gridItemTaxAmount", "gridItemAmountInclTax", "txtGridRemarks", "txtDiscount", "txtDiscAmount", "txtExpense", "txtExpAmount", "txtTax", "txtTaxAmount", "txtNetAmount", "supplierName", "supplierMobile", "receivers_list"];
        clearValueAndText(resetArray);

        const resetClassArray = ["gridItemTotalQty", "gridItemTotalWeight", "gridItemTotalGrossAmount", "gridItemTotalAmountExclTax", "gridItemTotalTaxAmount", "gridItemTotalAmountInclTax"];
        clearValueAndText(resetClassArray, ".");

        $("#purchase_table tbody tr").remove();
        $("#purchase_tableReport tbody tr").remove();
        $("#laststockLocation_table tbody tr").remove();

        $("#party_p").html("");
        $("#otherItemInformation").html("");
    };

    const getItemDetailRecord = (item_id) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type     : "GET",
                url      : `${baseURL}/item/getItemDetailRecord`,
                data     : { item_id : item_id },
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

    const getItemDetailById = async (item_id) => {
        if (parseNumber(item_id) > 0) {
            const response = await getItemDetailRecord(item_id);
            if (response.status === false && response.error !== "") {
                _getAlertMessage("Error!", response.message, "danger");
            } else if (response.status === false && response.message !== "") {
                _getAlertMessage("Information!", response.message, "info");
            } else {
                const purchaseModuleSettings = response.data.purchase_module_settings;
                $("#stockKeepingMethodId").val(response.data.stock_keeping_method_id);
                populateOtherItemInformation(response.data);

                if (purchaseModuleSettings && purchaseModuleSettings.show_stock_information) {
                    const stockInfo = new StockInformation(response.data.stock_keeping_method_id, { isSale : true });
                    stockInfo.getStockInformation(parseNumber(response.data.item_id), $("#current_date").val(), 0);
                }

                triggerAndRenderOptions($("#gridItemShortCodeDropdown"), response.data.short_code, response.data.item_id, false, false, true);
                triggerAndRenderOptions($("#gridItemNameDropdown"), response.data.item_des, response.data.item_id, false, false, true);

                const stockKeepingMethodIdValue = response.data.stock_keeping_method_id;
                const division_by               = response.data.item_calculation_method.division_by;
                appendSelect2ValueIfDataExists("gridItemRateTypeDropdown", "item_calculation_method", "id", "name", response.data);
                $("#rateTypeDivisionFactor").val(division_by);

                if (stockKeepingMethodIdValue == 1) {
                    $("#gridItemRatePerKG").prop("disabled", true);
                } else if (stockKeepingMethodIdValue == 2) {
                    $("#gridItemRatePerKG").prop("disabled", false);
                } else if (stockKeepingMethodIdValue == 3) {
                    $("#gridItemRatePerKG").prop("disabled", false);
                }

                $(`#gridItemRate`).val(parseNumber(response.data.cost_price).toFixed(RATE_ROUNDING));
                $(`#gridItemDiscountPercentage`).val(parseNumber(response.data.item_pur_discount).toFixed(2));
                $(`#gridItemTaxPercentage`).val(parseNumber(response.data.taxrate).toFixed(2));

                if (parseNumber(gridItemNameDropdown.val()) > 0) {
                    setTimeout(() => {
                        $("#gridItemQty").focus();
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

        const stockKeepingMethodId = $("#stockKeepingMethodId").val();
        const qty                  = parseFloat(gridItemQty.val()) || 0;
        const weight               = parseFloat(gridItemWeight.val()) || 0;
        const $divisionFactor      = parseNumber($("#rateTypeDivisionFactor").val());
        const divisionFactor       = parseNumber($divisionFactor) ? parseNumber($divisionFactor) : 1;
        const eventInputId         = event.target.getAttribute("id");

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

    let purchaseOrderViewList      = undefined;
    const getPODataTable           = (purchaseOrderId = 0, fromDate = "", toDate = "") => {
        if (typeof purchaseOrderViewList !== "undefined") {
            purchaseOrderViewList.destroy();
            $("#purchaseOrderViewListTbody").empty();
        }
        purchaseOrderViewList = $("#purchaseOrderViewList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url     : `${baseURL}/purchaseorder/getPODataTable`,
                type    : "GET",
                data    : {
                    "purchaseOrderId" : purchaseOrderId,
                    fromDate          : fromDate,
                    toDate            : toDate
                },
                dataSrc : function (json) {
                    return json.data;
                }
            },
            autoWidth  : false,
            buttons    : true,
            searching  : true,
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
                className : "text-left purchaseOrderVoucher"
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
                className : "supplierName"
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
    <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">More</button>
    <div class="dropdown-menu main-dropdown-menu">
        <a class="dropdown-item btnEditPrevVoucher" data-purchase_order_id="${row.id}"><i
                class="fa fa-edit"></i>Edit</a>

            <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
            <span class="caret"><i class="fa fa-print"></i> Print Options</span>
            <span class="sr-only">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu dropdown-submenu-left" role="menu">
            <li class="dropdown-item"><a href="#" class="btnPrint" data-purchase_order_id="${row.id}">Print Voucher</a></li>
            <li class="dropdown-item"><a href="#" class="btnPrintOffice" data-purchase_order_id="${row.id}">Print Office Copy</a></li>
            <li class="dropdown-item"><a href="#" class="btnPrintSupplier" data-purchase_order_id="${row.id}">Print Supplier Copy </a></li>
            <li class="dropdown-item"><a href="#" class="btnPrintBoth" data-purchase_order_id="${row.id}">Print Both  </a></li>
            <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-purchase_order_id="${row.id}"> Print a4 with header</a></li>
            <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-purchase_order_id="${row.id}">Print a4 with out header </a></li>
            <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-purchase_order_id="${row.id}"> Print b5 with header</a></li>
            <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-purchase_order_id="${row.id}">Print b5 with out header </a></li>
        </ul>

        <a class="dropdown-item btnDelete" data-purchase_order_id="${row.id}" href="#"><i class='fa fa-trash'></i>
            Delete Voucher</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item btnPrintASEmail" data-inward_gate_pass_id="${row.id}" href="#">Send Email</a>
    </div>
</div>`;

                }
            }

            ],
            createdRow : function (row, data, dataIndex) {
                $(row).addClass("group odd:bg-white even:bg-slate-50");
                $("td", row).addClass("py-1 px-1 text-md align-middle");
            }
        });
        // Reinitialize tooltips on table redraw
        purchaseOrderViewList.on("draw", function () {
            $("[data-toggle=\"tooltip\"]").tooltip(); // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
        $(".table-responsive").on("show.bs.dropdown", function () {
            $(".table-responsive").css("overflow", "inherit");
        });

        $(".table-responsive").on("hide.bs.dropdown", function () {
            $(".table-responsive").css("overflow", "auto");
        });
    };
    const loadSettingConfiguration = () => {
        $("#txtTax").val(parseNumber(setting_configure[0].ftax).toFixed(2));
    };

    return {

        init : function () {
            this.bindUI();
            $(".select2").select2();
            if (! propsForTable.moduleSettings) {
                propsForTable.moduleSettings = {};
            }
            propsForTable.moduleSettings.stockKeepingMethodId = parseNumber(moduleSettings.stock_keeping_method_id);
            getPODataTable();
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
                const gridItemRowCalculator = new GridItemRowCalculator(currentRow, purchaseModuleSettings);
                gridItemRowCalculator.calculate(event, currentRow);
            });
            $("#gridItemShortCodeDropdown").on("change", async function (e) {
                e.preventDefault();
                await getItemDetailById($(this).val());
            });
            $("#gridItemNameDropdown").on("change", async function (e) {
                e.preventDefault();
                await getItemDetailById($(this).val());
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
                    return _getAlertMessage("Error!", alertMessage, "danger");

                }

                const itemId               = parseNumber((gridItemNameDropdown.val()));
                const itemName             = $.trim($(gridItemNameDropdown).find("option:selected").text());
                const shortCode            = $.trim($("#gridItemShortCodeDropdown").find("option:selected").text());
                const stockKeepingMethodId = $("#stockKeepingMethodId").val();
                const qty                  = $(gridItemQty).val();
                const weight               = $(gridItemWeight).val();
                const rate                 = $(gridItemRate).val();
                const rateTypeId           = $(gridItemRateTypeDropdown).val();
                const rateTypeName         = $.trim($(gridItemRateTypeDropdown).find("option:selected").text());
                const divisionFactor       = parseNumber($("#rateTypeDivisionFactor").val());
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
                const departmentId         = $("#gridItemWarehouseDropdown").val();
                const departmentName       = $.trim($("#gridItemWarehouseDropdown").find("option:selected").text());

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
                        division_factor : divisionFactor
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
                    department_details      : {
                        did  : departmentId,
                        name : departmentName
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
                $("#rateTypeDivisionFactor").val("");

                const tableAppender = new TableRowAppended("#purchase_table", { "stockKeepingMethod" : stockKeepingMethodId, ...propsForTable });
                tableAppender.appendRow(rowData);
                const gridItemRowCalculator = new GridItemRowCalculator(purchaseModuleSettings);
                gridItemRowCalculator.calculateVoucherLowerTotal();
                $(gridItemNameDropdown).focus();
            });

            $("#purchase_table").on("click", ".btnRowEdit", function (event) {
                event.preventDefault();
                baseInstance.runException(() => {
                    const row                   = $(this).closest("tr");
                    const gridItemRowCalculator = new GridItemRowCalculator(row, purchaseModuleSettings);

                    const editItemId                 = row.find("td.itemName").data("item_id");
                    const editItemName               = row.find("td.itemName").clone().children("span").remove().end().text();
                    const editShortCode              = row.find("td.itemName").data("short_code");
                    const editStockKeepingMethodId   = row.find("td.itemName").data("stock_keeping_method_id");
                    const editDepartmentId           = row.find("td.department_id").data("department_id");
                    const editDepartmentName         = row.find("td.department_id").text();
                    const editItemQty                = parseNumber(row.find("td.qty").text());
                    const editItemWeight             = parseNumber(row.find("td.weight").text());
                    const editItemRate               = parseNumber(row.find("td.rate input").val());
                    const editRateTypeId             = row.find("td.rateTypeName").data("rate_type_id");
                    const editRateTypeDivisionFactor = row.find("td.rateTypeName").data("division_factor");
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
                    const remarks                    = row.find("td.itemName textarea").val();

                    triggerAndRenderOptions($("#gridItemShortCodeDropdown"), editShortCode, editItemId, false);
                    triggerAndRenderOptions($("#gridItemNameDropdown"), editItemName, editItemId, false);
                    triggerAndRenderOptions($("#gridItemRateTypeDropdown"), editRateTypeName, editRateTypeId, false);

                    $("#stockKeepingMethodId").val(editStockKeepingMethodId);
                    $("#rateTypeDivisionFactor").val(editRateTypeDivisionFactor);

                    triggerAndRenderOptions($("#gridItemWarehouseDropdown"), editDepartmentName, editDepartmentId, false);

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
            });
            // when btnRowRemove is clicked
            $("#purchase_table").on("click", ".btnRowRemove", function (e) {
                e.preventDefault();
                const row                   = $(this).closest("tr");
                const gridItemRowCalculator = new GridItemRowCalculator(row, purchaseModuleSettings);
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

            $("#purchaseOrderSyncAlt").on("click", function (e) {
                e.preventDefault();
                $("#fromDate").datepicker("update", new Date());
                $("#toDate").datepicker("update", new Date());
                getPODataTable();
            });
            $("#purchaseOrderFilter").on("click", function (e) {
                e.preventDefault();
                const fromDate = $("#fromDate").val();
                const toDate   = $("#toDate").val();
                getPODataTable("", fromDate, toDate);
            });
            $(document.body).on("click", ".getItemLookUpRecord", function (e) {
                e.preventDefault();
                getItemLookUpRecord("purchase_orders", "");
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
                if (parseNumber(purchaseModuleSettings.show_account_information) == 1) {
                    const accountId   = $(this).val();
                    const voucherDate = $("#current_date").val();
                    getAccountBalanced(accountId, voucherDate);
                }
            });

            $(".getAccountLookUpRecord").on("click", function (e) {
                e.preventDefault();
                getAccountLookUpRecord("purchase_orders");
            });

            $(document).on("click", ".getPendingRequisitionsLookup", function (e) {
                e.preventDefault();
                getPendingRequisitionsLookup();
            });

            $(document).on("click", "#appendSelectedPendingRequisitions", async function (e) {
                e.preventDefault();
                resetVoucher();

                // Gather selected requisition numbers
                let selectedRequisitionNumbers = [];
                $("#pendingRequisitionsLookup tbody tr").each(function () {
                    if ($(this).find(".selectionCheckbox").prop("checked")) {
                        const requisitionNumber = $(this).find(".requisitionNumber").text().trim();
                        const itemId            = $(this).find(".itemName").attr("data_item_id").trim();
                        const itemName          = $(this).find(".itemName").text().trim();
                        const itemRate          = parseNumber($(this).find(".itemName").data("cost_price"));
                        const taxpPercentage    = parseNumber($(this).find(".itemName").data("tax_percentage"));
                        const qty               = parseNumber($(this).find(".Qty").text().trim());

                        selectedRequisitionNumbers.push({
                            requisitionNumber : requisitionNumber,
                            itemId            : itemId,
                            itemName          : itemName,
                            qty               : qty,
                            itemRate          : itemRate,
                            taxpPercentage    : taxpPercentage
                        });
                    }
                });

                if (selectedRequisitionNumbers.length === 0) {
                    alert("Please select at least one requisition number.");
                    return;
                }

                selectedRequisitionNumbers.forEach(function (item, index) {
                    appendToTable("", item.itemName, item.itemId, item.qty, 0, 0, item.itemRate, 0, 0, item.taxpPercentage, 0, 0, "", "", item.requisitionNumber);

                    calculateLowerTotal();
                });
                $("#pendingRequisitionsLookupModal").modal("hide");
            });

            $("body").on("click", ".btnEditPrevVoucher", function (e) {
                e.preventDefault();
                var purchaseOrderId = parseNumber($(this).data("purchase_order_id"));
                fetch(purchaseOrderId);
                $("a[href=\"#Main\"]").trigger("click");
            });
            $(".btnResetMGodown").on("click", function () {

                $("#txtNameGodownAdd").val("");

            });

            $("#txtLevel3").on("change", function () {

                var level3 = $("#txtLevel3").val();
                $("#txtselectedLevel1").text("");
                $("#txtselectedLevel2").text("");
                if (level3 !== "" && level3 !== null) {
                    // alert('enter' + $(this).find('option:selected').data('level2') );
                    $("#txtselectedLevel2").text(" " + $(this).find("option:selected").data("level2"));
                    $("#txtselectedLevel1").text(" " + $(this).find("option:selected").data("level1"));
                }
            });
            // $('#txtLevel3').select2();
            $(".btnSaveM").on("click", function (e) {
                if ($(".btnSave").data("saveaccountbtn") == 0) {
                    alert("Sorry! you have not save accounts rights..........");
                } else {
                    e.preventDefault();
                    self.initSaveAccount();
                }
            });
            $(".btnResetM").on("click", function () {

                $("#txtAccountName").val("");
                $("#txtselectedLevel2").text("");
                $("#txtselectedLevel1").text("");
                $("#txtLevel3").val("").trigger("liszt:updated");
            });
            $("#AccountAddModel").on("shown.bs.modal", function (e) {
                $("#txtAccountName").focus();
            });
            shortcut.add("F3", function () {
                $("#AccountAddModel").modal("show");
            });

            $(".btnSaveMItem").on("click", function (e) {
                if ($(".btnSave").data("saveitembtn") == 0) {
                    alert("Sorry! you have not save item rights..........");
                } else {
                    e.preventDefault();
                    self.initSaveItem();
                }
            });
            $(".btnResetMItem").on("click", function () {

                $("#txtItemName").val("");
                $("#category_dropdown").val("").trigger("liszt:updated");
                $("#subcategory_dropdown").val("").trigger("liszt:updated");
                $("#brand_dropdown").val("").trigger("liszt:updated");
                $("#txtBarcode").val("");
            });

            $("#ItemAddModel").on("shown.bs.modal", function (e) {
                $("#txtItemName").focus();
            });
            shortcut.add("F7", function () {
                $("#ItemAddModel").modal("show");
            });
            $("#switchPreBal").bootstrapSwitch("offText", "Yes");
            $("#switchPreBal").bootstrapSwitch("onText", "No");
            $("#voucher_type_hidden").val("new");
            $("body").on("click", ".modal-lookup .populateAccount", function (e) {
                e.preventDefault();
                var party_id = $(this).closest("tr").find("input[name=hfModalPartyId]").val();
                $("#party_dropdown11").val(party_id).trigger("liszt:updated");
                $("#party_dropdown11").val(party_id).trigger("change");
                $("#party-lookup").modal("hide");
            });
            $("body").on("click", ".modal-lookup .populateItem", function (e) {
                e.preventDefault();
                var item_id = $(this).closest("tr").find("input[name=hfModalitemId]").val();
                $("#item_dropdown").val(item_id).trigger("liszt:updated"); //set the value
                $("#item_dropdown").trigger("change"); //set the value
                $("#itemid_dropdown").val(item_id).trigger("liszt:updated");
                $("#txtQty").focus();
                $("#item-lookup").modal("hide");

            });

            $("#voucher_type_hidden").val("new");

            $("#txtVrnoa").on("change", function () {
                fetch($(this).val());
            });

            $(".btnSave").on("click", function (e) {
                e.preventDefault();
                self.initSave();
            });

            $("#btnSearch").on("click", function (e) {
                e.preventDefault();
                var error     = validateSearch();
                var from      = $("#from_date").val();
                var to        = $("#to_date").val();
                var companyid = $("#cid").val();
                var etype     = "pur_order";
                var uid       = $("#uid").val();

                if (! error) {
                    fetchReports(from, to, companyid, etype, uid);
                } else {
                    alert("Correct the errors...");
                }
            });
            $("body").on("click", ".btnPrint", function (e) {
                const purchaseOrderId     = $(this).data("purchase_order_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    printVoucher(purchaseOrderId, settingPrintDefault, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintOffice", function (e) {
                const purchaseOrderId     = $(this).data("purchase_order_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    printVoucher(purchaseOrderId, settingPrintDefault, "lg", "purchaseOrderOfficeCopy");
                }
            });
            $("body").on("click", ".btnPrintSupplier", function (e) {
                const purchaseOrderId     = $(this).data("purchase_order_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    printVoucher(purchaseOrderId, settingPrintDefault, "lg", "purchaseOrderSupplierCopy");
                }
            });
            $("body").on("click", ".btnPrintBoth", function (e) {
                const purchaseOrderId     = $(this).data("purchase_order_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    printVoucher(purchaseOrderId, settingPrintDefault, "lg", "purchaseOrderBothCopy");
                }
            });
            $("body").on("click", ".btnPrintA4WithHeader", function (e) {
                const purchaseOrderId = $(this).data("purchase_order_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    printVoucher(purchaseOrderId, 1, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintA4WithOutHeader", function (e) {
                const purchaseOrderId = $(this).data("purchase_order_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    printVoucher(purchaseOrderId, 2, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintB5WithHeader", function (e) {
                const purchaseOrderId = $(this).data("purchase_order_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    printVoucher(purchaseOrderId, 3, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintB5WithOutHeader", function (e) {
                const purchaseOrderId = $(this).data("purchase_order_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    printVoucher(purchaseOrderId, 4, "lg", "");
                }
            });

            $(".btnReset").on("click", function (e) {
                e.preventDefault();
                self.resetVoucher();
            });

            $("body").on("click", ".btnDelete", function (e) {
                const purchaseOrderId = $(this).data("purchase_order_id");
                e.preventDefault();
                if (purchaseOrderId !== "") {
                    _getConfirmMessage("Warning!", "Are you sure to delete this voucher", "warning", function (result) {
                        if (result) {
                            deleteVoucher(purchaseOrderId);
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
            shortcut.add("F9", function () {
                $(".btnPrint").first().trigger("click");
            });
            shortcut.add("F6", function () {
                $("#txtVrnoa").focus();
            });
            shortcut.add("F5", function () {
                self.resetVoucher();
            });
            shortcut.add("F12", function () {
                $(".btnDelete").get()[0].click();
            });

            purchase.fetchRequestedVr();
        },

        // prepares the data to save it into the database
        initSave         : function () {

            if (validateSave()) {
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : "Correct the errors...",
                    type    : "danger"
                });
                return;
            }
            if (validate()) {
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : "Validity Date Must be Greater Than Voucher Date",
                    type    : "danger"
                });
                return;
            }
            const rowsCount = $("#purchase_table").find("tbody tr").length;
            if (rowsCount > 0) {
                const saveObj = getSaveObject();
                const data    = {
                    "purchaseOrder"       : JSON.stringify(saveObj.purchaseOrder),
                    "purchaseOrderDetail" : JSON.stringify(saveObj.purchaseOrderDetail),
                    "id"                  : saveObj.id,
                    "chk_date"            : $("#chk_date").val(),
                    "vrdate"              : $("#cur_date").val()
                };
                saverRequest.sendRequest(data);
            } else {
                _getAlertMessage("Error!", "No data found to save", "danger");
            }

        },
        initSaveAccount  : function () {

            var saveObjAccount = getSaveObjectAccount();
            var error          = validateSaveAccount();

            if (! error) {
                saveAccount(saveObjAccount);
            } else {
                alert("Correct the errors...");
            }
        },
        initSaveItem     : function () {

            var saveObjItem = getSaveObjectItem();
            var error       = validateSaveItem();

            if (! error) {
                saveItem(saveObjItem);
            } else {
                alert("Correct the errors...");
            }
        },
        initSaveGodown   : function () {

            var saveObjGodown = getSaveObjectGodown();
            var error         = validateSaveGodown();

            if (! error) {
                saveGodown(saveObjGodown);
            } else {
                alert("Correct the errors...");
            }
        },
        fetchRequestedVr : function () {

            var vrnoa = general.getQueryStringVal("vrnoa");
            vrnoa     = parseInt(vrnoa);
            $("#txtVrnoa").val(vrnoa);
            $("#txtVrnoaHidden").val(vrnoa);
            if (! isNaN(vrnoa)) {
                fetch(vrnoa);
            }
        },

        bindModalPartyGrid : function () {

            var dontSort = [];
            $("#party-lookup table thead th").each(function () {
                if ($(this).hasClass("no_sort")) {
                    dontSort.push({ "bSortable" : false });
                } else {
                    dontSort.push(null);
                }
            });
            purchase.pdTable = $("#party-lookup table").dataTable({
                // "sDom": "<'row-fluid table_top_bar'<'span12'>'<'to_hide_phone'>'f'<'>r>t<'row-fluid'>",
                "sDom"            : "<'row-fluid table_top_bar'<'span12'<'to_hide_phone' f>>>t<'row-fluid control-group full top' <'span4 to_hide_tablet'l><'span8 pagination'p>>",
                "aaSorting"       : [[0, "asc"]],
                "bPaginate"       : true,
                "sPaginationType" : "full_numbers",
                "bJQueryUI"       : false,
                "aoColumns"       : dontSort

            });
            $.extend($.fn.dataTableExt.oStdClasses, {
                "s`" : "dataTables_wrapper form-inline"
            });
        },

        bindModalItemGrid : function () {

            var dontSort = [];
            $("#item-lookup table thead th").each(function () {
                if ($(this).hasClass("no_sort")) {
                    dontSort.push({ "bSortable" : false });
                } else {
                    dontSort.push(null);
                }
            });
            purchase.pdTable = $("#item-lookup table").dataTable({
                // "sDom": "<'row-fluid table_top_bar'<'span12'>'<'to_hide_phone'>'f'<'>r>t<'row-fluid'>",
                "sDom"            : "<'row-fluid table_top_bar'<'span12'<'to_hide_phone' f>>>t<'row-fluid control-group full top' <'span4 to_hide_tablet'l><'span8 pagination'p>>",
                "aaSorting"       : [[0, "asc"]],
                "bPaginate"       : true,
                "sPaginationType" : "full_numbers",
                "bJQueryUI"       : false,
                "aoColumns"       : dontSort

            });
            $.extend($.fn.dataTableExt.oStdClasses, {
                "s`" : "dataTables_wrapper form-inline"
            });
        },

        // instead of reseting values reload the page because its cruel to write to much code to simply do that
        resetVoucher : function () {
            resetVoucher();
        }
    };

};

var purchase = new Purchase();
purchase.init();

// Corrected function to match the HTML ID
$(function () {
    new DynamicOption("#gridItemNameDropdown", {
        requestedUrl    : dropdownOptions.purchaseInventoryCategories,
        placeholderText : "Choose Item Name"
    });

    new DynamicOption("#gridItemShortCodeDropdown", {
        requestedUrl    : dropdownOptions.purchaseInventoryCategoriesShortCode,
        placeholderText : "Choose Short Code"
    });

    new DynamicOption("#accountDropdown", {
        requestedUrl    : dropdownOptions.purchaseAccountLevel3,
        placeholderText : "Choose Supplier"
    });

    new DynamicOption("#purchaseOfficerDropdown", {
        requestedUrl    : dropdownOptions.getAllOfficer,
        placeholderText : "Choose Purchase Officer",
        allowClear      : true
    });

    new DynamicOption("#gridItemRateTypeDropdown", {
        requestedUrl          : `${baseURL}/item/calculationMethod/getAllRateType`,
        placeholderText       : "Choose Rate Type",
        allowClear            : true,
        includeDataAttributes : true
    });

    new DynamicOption("#gridItemWarehouseDropdown", {
        requestedUrl    : `${baseURL}/department/getDepartmentAll`,
        placeholderText : "Choose Warehouse",
        allowClear      : true
    });
});
