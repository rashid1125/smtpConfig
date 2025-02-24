"use strict";
// assets/js/app_modules/purchase/add_purchase_order.js
import BaseClass from "../../../../js/components/BaseClass.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";

import { AMOUNT_ROUNDING, QTY_ROUNDING }                                                                                                                                                                                                                                                                                                     from "../../../../js/components/GlobalConstants.js";
import { dropdownOptions }                                                                                                                                                                                                                                                                                                                   from "../../../../js/components/GlobalUrl.js";
import GridItemRowCalculator                                                                                                                                                                                                                                                                                                                 from "../../../../js/components/GridItemRowCalculator.js";
import { validPercentage }                                                                                                                                                                                                                                                                                                                   from "../../../../js/components/Helpers.js";
import SaverRequest                                                                                                                                                                                                                                                                                                                          from "../../../../js/components/SaverRequest.js";
import TableRowAppended                                                                                                                                                                                                                                                                                                                      from "../../../../js/components/TableRowAppended.js";
import { calculateAmountExclTaxGridItemRow }                                                                                                                                                                                                                                                                                                 from "../../../../js/components/calculations/calculateAmountExclTaxGridItemRow.js";
import { calculateAmountInclTaxGridItemRow }                                                                                                                                                                                                                                                                                                 from "../../../../js/components/calculations/calculateAmountInclTaxGridItemRow.js";
import { calculateDiscountAmountGridItemRow }                                                                                                                                                                                                                                                                                                from "../../../../js/components/calculations/calculateDiscountAmountGridItemRow.js";
import { calculateDiscountPerUnitGridItemRow }                                                                                                                                                                                                                                                                                               from "../../../../js/components/calculations/calculateDiscountPerUnitGridItemRow.js";
import { calculateDiscountPercentageGridItemRow }                                                                                                                                                                                                                                                                                            from "../../../../js/components/calculations/calculateDiscountPercentageGridItemRow.js";
import { calculateGrossAmountGridItemRow }                                                                                                                                                                                                                                                                                                   from "../../../../js/components/calculations/calculateGrossAmountGridItemRow.js";
import { calculateRateGridItemRow }                                                                                                                                                                                                                                                                                                          from "../../../../js/components/calculations/calculateRateGridItemRow.js";
import { calculateRatePerKgGridItemRow }                                                                                                                                                                                                                                                                                                     from "../../../../js/components/calculations/calculateRatePerKgGridItemRow.js";
import { calculateRatePerUnitGridItemRow }                                                                                                                                                                                                                                                                                                   from "../../../../js/components/calculations/calculateRatePerUnitGridItemRow.js";
import { calculateTaxAmountGridItemRow }                                                                                                                                                                                                                                                                                                     from "../../../../js/components/calculations/calculateTaxAmountGridItemRow.js";
import { calculateTaxPercentageGridItemRow }                                                                                                                                                                                                                                                                                                 from "../../../../js/components/calculations/calculateTaxPercentageGridItemRow.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, getCalculateDatesWithCurrentDate, getValueIfDataExists, handlePercentageOrAmountInput, ifNull, isPreviousBalance, parseNumber, setFinancialYearDate, updateDatepickerWithFormattedDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek } from "../commonFunctions/CommonFunction.js";
import { getInspectionId, getInwardGatePassId, getPurchaseOrderId, propsForTable }                                                                                                                                                                                                                                                           from "../commonFunctions/PopulateDataOnVouchers.js";
import { getPendingInspection, getPendingInwardGatePass, getPendingPurchaseOrder, getPurchaseDataTable }                                                                                                                                                                                                                                     from "../commonFunctions/TableListViwes.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";
const baseInstance         = new BaseClass();
propsForTable.actionButton = "d-none";
var Purchase               = function () {
    const totalAmountGetter               = () => getNumText($(".gridItemTotalAmountInclTax"));
    var settings                          = {
        switchPreBal : $("#switchPreBal")
    };
    const buttonPendingRequisitionsLookup = $(".getPendingRequisitionsLookup");
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
    const settingConfiguration            = setting_configure;
    const saverRequest                    = new SaverRequest(base_url, general, {
        requestedUrl      : "purchase/save",
        requestType       : "POST",
        isConfirmed       : true,
        propsPrintVoucher : function (param) {
            Print_Voucher(param.id, 1, 1, "", false);
        },
        propsResetVoucher : function (param) {
            resetVoucher();
        }
    });

    var fetch = function (purchaseId) {
        $.ajax({
            url      : `${base_url}/purchase/fetch`,
            type     : "GET",
            data     : { "purchaseId" : purchaseId },
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
        $("#purchaseIdHidden").val(data.id);
        appendSelect2ValueIfDataExists("accountDropdown", "party", "pid", "name", data, { disabled : true });
        appendSelect2ValueIfDataExists("purchaseOfficerDropdown", "purchase_officer", "id", "name", data, { disabled : true });

        $("#purchaseOrderVrnoa").val(getValueIfDataExists(data, "purchase_order.vrnoa", null));
        $("#purchaseOrderIdHidden").val(getValueIfDataExists(data, "purchase_order.id", null));

        $("#inwardGatePassVrnoa").val(getValueIfDataExists(data, "inward_gate_pass.vrnoa", null));
        $("#inwardGatePassIdHidden").val(getValueIfDataExists(data, "inward_gate_pass.id", null));

        $("#inspectionVrnoa").val(getValueIfDataExists(data, "inspection.vrnoa", null));
        $("#inspectionIdHidden").val(getValueIfDataExists(data, "inspection.id", null));

        updateDatepickerWithFormattedDate("current_date", data.vrdate);
        updateDatepickerWithFormattedDate("chk_date", data.vrdate);
        updateDatepickerWithFormattedDate("due_date", data.due_date);
        updateDatepickerWithFormattedDate("biltyDate", data.bilty_date);

        $("#due_days").val(data.due_days);
        $("#supplierName").val(data.supplier_name);
        $("#supplierMobile").val(data.supplier_mobile);
        $("#receivers_list").val(data.prepared_by);
        $("#biltyNumber").val(data.bilty_number);

        appendSelect2ValueIfDataExists("transporterDropdown", "transporter", "transporter_id", "name", data);

        $("#txtDiscount").val(data.discount_percentage);
        $("#txtDiscAmount").val(data.discount_amount);
        $("#txtExpense").val(data.expense_percentage);
        $("#txtExpAmount").val(data.expense_amount);
        $("#txtTax").val(data.further_tax_percentage);
        $("#txtTaxAmount").val(data.further_tax_amount);
        $("#freightAmount").val(parseNumber(data.freight_amount).toFixed(AMOUNT_ROUNDING));
        $("#txtNetAmount").val(data.net_amount);
        $("#freightTypeDropdown").val(data.freight_type_id).trigger("change.select2");
        const tableAppended = new TableRowAppended("#purchase_table", propsForTable);
        $.each(data.purchase_detail, function (index, elem) {
            elem.detail_remarks     = ifNull(elem.detail_remarks, "");
            elem.department_details = elem.department_detail;
            tableAppended.appendRow(elem);
        });
        calculateLowerTotal();
    };

    var getSaveObject = function () {
        const purchase       = {};
        const purchaseDetail = [];

        purchase.id                     = $("#purchaseIdHidden").val();
        purchase.vrdate                 = $("#current_date").val();
        purchase.due_date               = $("#due_date").val();
        purchase.due_days               = $("#due_days").val();
        purchase.chk_date               = $("#chk_date").val();
        purchase.party_id               = $("#accountDropdown").val();
        purchase.purchase_officer_id    = $("#purchaseOfficerDropdown").val();
        purchase.purchase_order_id      = $("#purchaseOrderIdHidden").val();
        purchase.inward_gate_pass_id    = $("#inwardGatePassIdHidden").val();
        purchase.inspection_id          = $("#inspectionIdHidden").val();
        purchase.supplier_name          = $("#supplierName").val();
        purchase.supplier_mobile        = $("#supplierMobile").val();
        purchase.prepared_by            = $("#receivers_list").val();
        purchase.bilty_number           = $("#biltyNumber").val();
        purchase.bilty_date             = $("#biltyDate").val();
        purchase.transporter_id         = $("#transporterDropdown").val();
        purchase.freight_amount         = $("#freightAmount").val();
        purchase.freight_type_id        = $("#freightTypeDropdown").val();
        purchase.discount_percentage    = $("#txtDiscount").val();
        purchase.discount_amount        = $("#txtDiscAmount").val();
        purchase.expense_percentage     = $("#txtExpense").val();
        purchase.expense_amount         = $("#txtExpAmount").val();
        purchase.further_tax_percentage = $("#txtTax").val();
        purchase.further_tax_amount     = $("#txtTaxAmount").val();
        purchase.net_amount             = $("#txtNetAmount").val();

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
            purchaseDetail.push(gridItemDetail);
        });
        var data = {};

        data.main     = JSON.stringify(purchase);
        data.details  = JSON.stringify(purchaseDetail);
        data.id       = $("#purchaseIdHidden").val();
        data.chk_date = $("#chk_date").val();
        return data;
    };

    var Print_Voucher = function (vrnoa, paperSize, printSize, wrate = 0, isSendEmail = false) {
        try {
            const __etype         = "purchases";
            const __vrnoa         = vrnoa;
            const previousBalance = isPreviousBalance();
            const __lang          = ($("#print_lang").val()) ? $("#print_lang").val() : 1;
            const __url           = base_url + "/doc/getPrintVoucherPDF/?etype=" + __etype + "&vrnoa=" + __vrnoa + "&pre_bal_print=" + previousBalance + "&paperSize=" + paperSize + "&printSize=" + printSize + "&wrate=" + (wrate ? wrate : 0) + "&language_id=" + __lang;
            const _encodeURI      = encodeURI(__url);
            openPrintOnSettingConfiguration(_encodeURI);
        } catch (error) {
            console.error(error);
        }
    };

    const getSendMail = (vrnoa, paperSize, printSize, wrate = 0, email = "") => {
        const __etype         = "purchases";
        const __vrnoa         = vrnoa;
        const previousBalance = isPreviousBalance();
        const __lang          = $("#print_lang").val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, previousBalance, paperSize, printSize, wrate, __lang, email);
    };

    const validateSingleProductAdd = () => {
        let hasError     = false;
        let errorMessage = "";

        // remove the error class first
        $(".inputerror").removeClass("inputerror");

        const stockKeepingMethodIdValue = parseNumber($("#stockKeepingMethodId").val());

        if (! $("#gridItemNameDropdown").val()) {
            $("#gridItemNameDropdown_chzn").addClass("inputerror");
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
                $("#gridItemRateTypeDropdown_chzn").addClass("inputerror");
                errorMessage += `Rate Type is required <br />`;
                hasError = true;
            }

            if (stockKeepingMethodIdValue === 2) {
                validateNumericInput($(gridItemRatePerKG).val(), "#gridItemRatePerKG", "Rate Per KG");
            } else if (stockKeepingMethodIdValue === 3) {
                validateNumericInput($(gridItemRatePerKG).val(), "#gridItemRatePerKG", "Rate Per KG");
            }
        }

        if (hasError) {
            return errorMessage;
        }
        return null;
    };

    // checks for the empty fields
    var validateSave = function () {
        var errorFlag             = false;
        const currentDate         = $("#current_date");
        const accountDropdown     = $("#accountDropdown");
        const freightAmount       = $("#freightAmount");
        const transporterDropdown = $("#transporterDropdown");
        const freightTypeDropdown = $("#freightTypeDropdown");

        $("#select2-accountDropdown-container").parent().addClass("inputerror");

        // remove the error class first
        $(".inputerror").removeClass("inputerror");

        if (! currentDate.val()) {
            currentDate.addClass("inputerror");
            errorFlag = true;
        }

        if (getNumVal($("#txtNetAmount")) < 0) {
            $("#txtNetAmount").addClass("inputerror");
            errorFlag = true;
        }

        if (! accountDropdown.val()) {
            $("#select2-accountDropdown-container").parent().addClass("inputerror");
            errorFlag = true;
        }
        const checkFreightTypeDropdown = [0, 1, 2, 3];
        if (getNumVal(freightAmount) > 0) {
            if (! getNumVal(transporterDropdown)) {
                $("#select2-transporterDropdown-container").parent().addClass("inputerror");
                errorFlag = true;
            }

            // Check if the selected freight type is within the allowed range
            const selectedFreightType = getNumVal(freightTypeDropdown);
            if (! checkFreightTypeDropdown.includes(selectedFreightType)) {
                $("#select2-freightTypeDropdown-container").parent().addClass("inputerror");
                errorFlag = true;
            }
        }

        if (getNumVal(transporterDropdown) > 0) {
            if (getNumVal(freightAmount) <= 0) {
                freightAmount.addClass("inputerror");
                errorFlag = true;
            }
        }
        return errorFlag;
    };

    var deleteVoucher = function (vrnoa) {
        general.disableSave();
        $.ajax({
            url      : base_url + "/purchase/delete",
            type     : "DELETE",
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
        var _FreightAmount = getNumVal($("#freightAmount"));
        let NetAmount      = 0;
        NetAmount          = parseFloat(gridItemTotalAmountInclTax) - parseFloat(_DiscAmount) + parseFloat(_ExpenseAmount) + parseFloat(_TaxAmount);
        const freightType  = parseNumber($("#freightTypeDropdown").val());
        if (freightType === 1) {
            NetAmount = parseFloat(NetAmount) - parseFloat(_FreightAmount);
        }
        $("#txtNetAmount").val(getSettingDecimal(NetAmount));
    };

    var resetVoucher = function () {
        resetFields();
        getPurchaseDataTable();
        loadSettingConfiguration();
    };

    var validate = function () {
        var errorFlag = false;
        var cur       = getSqlFormattedDate($("#current_date").val());
        var due       = getSqlFormattedDate($("#due_date").val());
        if (due < cur) {
            errorFlag = true;
        }
        return errorFlag;
    };

    var resetFields = function () {
        const resetArray = ["purchaseIdHidden", "current_date", "due_date", "chk_date", "gridItemShortCodeDropdown", "gridItemNameDropdown", "gridItemQty", "gridItemWeight", "gridItemRate", "gridItemRateTypeDropdown", "gridItemRatePerKG", "gridItemGAmount", "gridItemDiscountPercentage", "gridItemDiscountPerUnit", "gridItemRatePerUnit", "gridItemAmountExclTax", "gridItemTaxPercentage", "gridItemTaxAmount", "gridItemAmountInclTax", "txtGridRemarks", "txtDiscount", "txtDiscAmount", "txtExpense", "txtExpAmount", "txtTax", "txtTaxAmount", "txtNetAmount", "supplierName", "supplierMobile", "receivers_list", "biltyNumber", "biltyDate", "transporterDropdown", "freightAmount", "freightTypeDropdown"];
        clearValueAndText(resetArray, "#");

        const resetDisabledArray = [{
            selector : "purchaseOrderVrnoa",
            options  : { disabled : true }
        }, {
            selector : "purchaseOrderIdHidden",
            options  : { disabled : true }
        }, {
            selector : "inwardGatePassVrnoa",
            options  : { disabled : true }
        }, {
            selector : "inwardGatePassIdHidden",
            options  : { disabled : true }
        }, {
            selector : "inspectionVrnoa",
            options  : { disabled : true }
        }, {
            selector : "inspectionIdHidden",
            options  : { disabled : true }
        }, {
            selector : "due_days",
            options  : { disabled : true }
        }, {
            selector : "accountDropdown",
            options  : { disabled : true }
        }, {
            selector : "purchaseOfficerDropdown",
            options  : { disabled : true }
        }];
        clearValueAndText(resetDisabledArray);

        const resetClassArray = ["gridItemTotalQty", "gridItemTotalWeight", "gridItemTotalGrossAmount", "gridItemTotalAmountExclTax", "gridItemTotalTaxAmount", "gridItemTotalAmountInclTax"];
        clearValueAndText(resetClassArray, ".");
        $("#freightTypeDropdown").val("0").trigger("change.select2");
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
                url      : `${base_url}/item/getItemDetailRecord`,
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
                    // Define this function in components.purchase_module.show_stock_information.blade.php
                    // If you want to make changes, go to this file
                    getLastStockLocations(parseNumber(response.data.item_id));
                }

                triggerAndRenderOptions($("#gridItemShortCodeDropdown"), response.data.item_des, response.data.item_id, false, false, true);
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
            getPurchaseDataTable();
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
            $(gridItemRateTypeDropdown).on("change", function (e) {
                e.preventDefault();
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

            $("#due_date").datepicker({
                autoClose : true
            }).on("changeDate", function (ev) {
                var curr  = $("#current_date").val();
                var curr2 = $("#due_date").val();
                $("#due_days").val(getDateDifference(curr, curr2));
            });
            $("#due_days").on("input", function () {
                getCalculateDatesWithCurrentDate(getNumVal($(this)), "due_date");
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
                    ;
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

            $("#freightTypeDropdown").on("change", function (e) {
                e.preventDefault();
                calculateLowerTotal();
            });

            $("#freightAmount").on("input", function (e) {
                e.preventDefault();
                calculateLowerTotal();
            });

            $("#purchaseSyncAlt").on("click", function (e) {
                e.preventDefault();
                $("#fromDate").datepicker("update", new Date());
                $("#toDate").datepicker("update", new Date());
                getPurchaseDataTable();
            });

            $("#purchaseFilter").on("click", function (e) {
                e.preventDefault();
                const fromDate = $("#fromDate").val();
                const toDate   = $("#toDate").val();
                getPurchaseDataTable("", fromDate, toDate);
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

            $("#searchPurchaseOrderVrnoa").on("click", function (e) {
                e.preventDefault();
                getPendingPurchaseOrder();
            });

            $("body").on("click", ".modal-lookup .populatePendingPurchaseOrder", async function (e) {
                e.preventDefault();
                const purchaseOrderId = parseNumber($(this).data("vrnoa"));
                resetFields();
                await getPurchaseOrderId(purchaseOrderId);
                calculateLowerTotal();
            });

            $("#searchInwardGatePassVrnoa").on("click", function (e) {
                e.preventDefault();
                getPendingInwardGatePass();
            });

            $("body").on("click", ".modal-lookup .populatePendingInwardGatePass", function (e) {
                e.preventDefault();
                const inwardGatePassId = parseNumber($(this).data("vrnoa"));
                resetVoucher();
                getInwardGatePassId(inwardGatePassId);
            });

            $("#searchInspectionVrnoa").on("click", function (e) {
                e.preventDefault();
                getPendingInspection();
            });

            $("body").on("click", ".modal-lookup .populatePendingInspection", function (e) {
                e.preventDefault();
                const inspectionId = parseNumber($(this).data("vrnoa"));
                resetVoucher();
                getInspectionId(inspectionId);
            });

            $("body").on("click", ".btnEditPrevVoucher", function (e) {
                e.preventDefault();
                var purchaseId = parseNumber($(this).data("purchase_id"));
                fetch(purchaseId);
                $("a[href=\"#Main\"]").trigger("click");
            });

            $("body").on("click", ".btnPrint", function (e) {
                const purchaseId          = $(this).data("purchase_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(base_url + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(purchaseId, settingPrintDefault, "lg", "");
                }
            });

            $("body").on("click", ".btnPrintA4WithHeader", function (e) {
                const purchaseId = $(this).data("purchase_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(purchaseId, 1, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintA4WithOutHeader", function (e) {
                const purchaseId = $(this).data("purchase_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(purchaseId, 2, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintB5WithHeader", function (e) {
                const purchaseId = $(this).data("purchase_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(purchaseId, 3, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintB5WithOutHeader", function (e) {
                const purchaseId = $(this).data("purchase_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(purchaseId, 4, "lg", "");
                }
            });

            $("body").on("click", ".btnPrintASEmail", function (e) {
                const purchaseId          = $(this).data("purchase_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                getSendMail(purchaseId, settingPrintDefault, "lg", "", true);
            });

            $(".btnSave").on("click", function (e) {
                e.preventDefault();
                self.initSave();
            });

            $(".btnReset").on("click", function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $("body").on("click", ".btnDelete", function (e) {
                const purchaseId = $(this).data("purchase_id");
                e.preventDefault();
                if (purchaseId !== "") {
                    _getConfirmMessage("Warning!", "Are you sure to delete this voucher", "warning", function (result) {
                        if (result) {
                            deleteVoucher(purchaseId);
                        }
                    });
                }
            });

            shortcut.add("F10", function () {
                $(".btnSave").get()[0].click();
            });
            shortcut.add("F9", function () {
                $(".btnPrint").get()[0].click();
            });
            shortcut.add("F5", function () {
                $(".btnReset").get()[0].click();
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
                var saveObj = getSaveObject();
                saverRequest.sendRequest(saveObj);
            } else {
                _getAlertMessage("Error!", "No data found to save", "danger");
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
        }, // instead of reseting values reload the page because its cruel to write to much code to simply do that
        resetVoucher : function () {
            resetVoucher();
        }
    };

};

var purchase = new Purchase();
purchase.init();
// Corrected function to match the HTML ID
document.addEventListener("DOMContentLoaded", function () {
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
        requestedUrl    : dropdownOptions.getAllRateType,
        placeholderText : "Choose Rate Type",
        allowClear      : true
    });

    new DynamicOption("#gridItemWarehouseDropdown", {
        requestedUrl    : dropdownOptions.getDepartmentAll,
        placeholderText : "Choose Warehouse"
    });
    new DynamicOption("#transporterDropdown", {
        requestedUrl    : dropdownOptions.getTransporterAll,
        placeholderText : "Choose Transporter",
        allowClear      : true
    });
});
