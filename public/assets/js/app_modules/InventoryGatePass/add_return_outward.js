// assets/js/app_modules/purchase/add_return_outward.js
import BaseClass                                                                                                                                                                                                                                                                                             from "../../../../js/components/BaseClass.js";
import DynamicOption                                                                                                                                                                                                                                                                                         from "../../../../js/components/DynamicOption.js";
import { dropdownOptions, returnOutwardApiEndpoints }                                                                                                                                                                                                                                                        from "../../../../js/components/GlobalUrl.js";
import GridItemRowCalculator                                                                                                                                                                                                                                                                                 from "../../../../js/components/GridItemRowCalculator.js";
import { makeAjaxRequest }                                                                                                                                                                                                                                                                                   from "../../../../js/components/MakeAjaxRequest.js";
import { StockInformation }                                                                                                                                                                                                                                                                                  from "../../../../js/components/StockInformation.js";
import TableRowAppended                                                                                                                                                                                                                                                                                      from "../../../../js/components/TableRowAppended.js";
import { calculateAmountExclTaxGridItemRow }                                                                                                                                                                                                                                                                 from "../../../../js/components/calculations/calculateAmountExclTaxGridItemRow.js";
import { calculateAmountInclTaxGridItemRow }                                                                                                                                                                                                                                                                 from "../../../../js/components/calculations/calculateAmountInclTaxGridItemRow.js";
import { calculateDiscountAmountGridItemRow }                                                                                                                                                                                                                                                                from "../../../../js/components/calculations/calculateDiscountAmountGridItemRow.js";
import { calculateDiscountPerUnitGridItemRow }                                                                                                                                                                                                                                                               from "../../../../js/components/calculations/calculateDiscountPerUnitGridItemRow.js";
import { calculateDiscountPercentageGridItemRow }                                                                                                                                                                                                                                                            from "../../../../js/components/calculations/calculateDiscountPercentageGridItemRow.js";
import { calculateGrossAmountGridItemRow }                                                                                                                                                                                                                                                                   from "../../../../js/components/calculations/calculateGrossAmountGridItemRow.js";
import { calculateRateGridItemRow }                                                                                                                                                                                                                                                                          from "../../../../js/components/calculations/calculateRateGridItemRow.js";
import { calculateRatePerKgGridItemRow }                                                                                                                                                                                                                                                                     from "../../../../js/components/calculations/calculateRatePerKgGridItemRow.js";
import { calculateRatePerUnitGridItemRow }                                                                                                                                                                                                                                                                   from "../../../../js/components/calculations/calculateRatePerUnitGridItemRow.js";
import { calculateTaxAmountGridItemRow }                                                                                                                                                                                                                                                                     from "../../../../js/components/calculations/calculateTaxAmountGridItemRow.js";
import { calculateTaxPercentageGridItemRow }                                                                                                                                                                                                                                                                 from "../../../../js/components/calculations/calculateTaxPercentageGridItemRow.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, getItemRateTypeById, getValueIfDataExists, handlePercentageOrAmountInput, ifNull, parseNumber, setFinancialYearDate, updateDatepickerWithFormattedDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek } from "../commonFunctions/CommonFunction.js";
import { propsForTable }                                                                                                                                                                                                                                                                                     from "../commonFunctions/PopulateDataOnVouchers.js";

propsForTable.isGatePassView = true;
const baseInstance           = new BaseClass();
var ReturnOutward            = function () {
    const totalAmountGetter = () => getNumText($(".gridItemTotalAmountInclTax"));
    var settings            = {
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

    var save          = async function (purchaseData) {
        await baseInstance.runException(async () => {
            const sendingData = {
                "main"     : JSON.stringify(purchaseData.main),
                "details"  : JSON.stringify(purchaseData.details),
                "id"       : purchaseData.id,
                "chk_date" : $("#chk_date").val(),
                "vrdate"   : $("#cur_date").val()
            };
            const response    = await makeAjaxRequest("POST", `${base_url}/returnOutward/saveReturnOutward`, sendingData);
            if (response.status == false && response.error !== "") {
                _getAlertMessage("Error!", response.message, "danger");
            } else if (response.status == false && response.message !== "") {
                _getAlertMessage("Warning!", response.message, "warning");
            } else {
                _getConfirmMessage("Successfully!", "Voucher saved!\nWould you like to print the invoice as well?", "success", function (result) {
                    if (result) {
                        $("#txtVrnoaHidden").val(response.data);
                        $("#txtVrnoa").val(response.data);
                        Print_Voucher(response.data.id, 1, "lg", "");
                        resetVoucher();
                    }
                });
                resetVoucher();
            }
        });
    };
    var Print_Voucher = function (vrnoa, paperSize, printSize, wrate = 0, isSendEmail = false) {
        try {
            const __etype         = "return_outwards";
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
        const __etype         = "return_outwards";
        const __vrnoa         = vrnoa;
        const __pre_bal_print = ($(settings.switchPreBal).bootstrapSwitch("state") === true) ? "2" : "1";
        const __lang          = $("#print_lang").val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, __pre_bal_print, paperSize, printSize, wrate, __lang, email);
    };

    var fetch = function (returnOutwardId) {
        $.ajax({
            url      : `${base_url}/returnOutward/fetch`,
            type     : "GET",
            data     : { "returnOutwardId" : returnOutwardId },
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
            $("#returnOutwardIdHidden").val(data.id);

            $("#purchaseIdHidden").val(getValueIfDataExists(data, "purchase.id", ""));
            $("#purchaseVrnoa").val(getValueIfDataExists(data, "purchase.vrnoa", ""));

            updateDatepickerWithFormattedDate("current_date", data.vrdate);
            updateDatepickerWithFormattedDate("chk_date", data.vrdate);

            const party = handleObjectName(data, "party");
            if (party) {
                triggerAndRenderOptions($("#accountDropdown"), party.name, party.pid, false);
            }
            const purchaseOfficer = handleObjectName(data, "purchase_officer");
            if (purchaseOfficer) {
                triggerAndRenderOptions($("#purchaseOfficerDropdown"), purchaseOfficer.name, purchaseOfficer.id, false);
            }
            $("#due_days").val(data.due_days);
            $("#supplierName").val(data.supplier_name);
            $("#supplierMobile").val(data.supplier_mobile);
            $("#receivers_list").val(data.prepared_by);

            $("#biltyNumber").val(data.bilty_number);
            populateDateValue("biltyDate", data.bilty_date);

            const transporter = handleObjectName(data, "transporter");
            if (transporter) {
                triggerAndRenderOptions($("#transporterDropdown"), transporter.name, transporter.transporter_id, false);
            }

            $("#txtDiscount").val(parseNumber(data.discount_percentage).toFixed(2));
            $("#txtDiscAmount").val(parseNumber(data.discount_amount).toFixed(AMOUNT_ROUNDING));
            $("#txtExpense").val(parseNumber(data.expense_percentage).toFixed(2));
            $("#txtExpAmount").val(parseNumber(data.expense_amount).toFixed(AMOUNT_ROUNDING));
            $("#txtTax").val(parseNumber(data.further_tax_percentage).toFixed(2));
            $("#txtTaxAmount").val(parseNumber(data.further_tax_amount).toFixed(AMOUNT_ROUNDING));
            $("#freightAmount").val(parseNumber(data.freight_amount).toFixed(AMOUNT_ROUNDING));
            $("#txtNetAmount").val(parseNumber(data.net_amount).toFixed(AMOUNT_ROUNDING));

            $("#freightTypeDropdown").val(data.freight_type_id).trigger("change");

            const tableAppended = new TableRowAppended("#purchase_table", propsForTable);

            $.each(data.return_outward_detail, function (index, elem) {
                elem.detail_remarks = ifNull(elem.detail_remarks, "");
                tableAppended.appendRow(elem);
            });
            calculateLowerTotal();
        });

    };

    var fetchPurchaseById = function (purchaseId) {
        $.ajax({
            url      : `${base_url}/purchase/getPendingPurchaseCompareReturnOutwardById`,
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
                    populatePurchaseData(response.data);
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    var populatePurchaseData = function (purchaseData) {
        baseInstance.runException(() => {
            const data = purchaseData[0];
            $("#purchaseIdHidden").val(data.purchaseId);
            $("#purchaseVrnoa").val(data.purchaseVrnoa);

            triggerAndRenderOptions($("#accountDropdown"), data.supplierName, data.supplierId, false);
            triggerAndRenderOptions($("#purchaseOfficerDropdown"), data.purchaseOfficerName, data.purchaseOfficerId, false);

            $("#supplierName").val(data.supplier_name);
            $("#supplierMobile").val(data.supplier_mobile);
            $("#receivers_list").val(data.prepared_by);

            $("#txtDiscount").val(data.main_discount_percentage);
            $("#txtDiscAmount").val(data.main_discount_amount);
            $("#txtExpense").val(data.main_expense_percentage);
            $("#txtExpAmount").val(data.main_expense_amount);
            $("#txtTax").val(data.main_further_tax_percentage);
            $("#txtTaxAmount").val(data.main_further_tax_amount);
            $("#txtNetAmount").val(data.main_net_amount);

            const tableAppended = new TableRowAppended("#purchase_table", propsForTable);
            $.each(purchaseData, function (index, elem) {
                const rowElem = {
                    item_details            : {
                        item_id    : elem.item_id,
                        item_des   : elem.item_des,
                        short_code : elem.short_code
                    },
                    stock_keeping_method_id : elem.stock_keeping_method_id,
                    qty                     : elem.qty,
                    weight                  : elem.weight,
                    rate                    : elem.rate,
                    rate_type               : {
                        id              : elem.icmId,
                        name            : elem.icmName,
                        division_factor : elem.icmDivisionFactor
                    },
                    rate_per_kg             : elem.rate_per_kg,
                    gross_amount            : elem.gross_amount,
                    discount_percentage     : elem.discount_percentage,
                    discount_per_unit       : elem.discount_per_unit,
                    discount_amount         : elem.discount_amount,
                    rate_per_unit           : elem.rate_per_unit,
                    amount_excl_tax         : elem.amount_excl_tax,
                    tax_percentage          : elem.tax_percentage,
                    tax_amount              : elem.tax_amount,
                    amount_incl_tax         : elem.amount_incl_tax,
                    detail_remarks          : elem.detail_remarks,
                    department_details      : {
                        did  : elem.did,
                        name : elem.departmentName
                    }
                };
                tableAppended.appendRow(rowElem);
            });
            $("#purchase_table").find("tr").find("td").find("input.rate").trigger("input");
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

        if (! $("#gridItemWarehouseDropdown").val()) {
            $("#select2-gridItemWarehouseDropdown-container").parent().addClass("inputerror");
            errorMessage += `Warehouse is required <br />`;
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

        if (hasError) {
            return errorMessage;
        }
        return null;
    };

    var getSaveObject = function () {
        const main    = {};
        const details = [];

        main.id                     = $("#returnOutwardIdHidden").val();
        main.vrdate                 = $("#current_date").val();
        main.chk_date               = $("#chk_date").val();
        main.due_days               = $("#due_days").val();
        main.party_id               = $("#accountDropdown").val();
        main.purchase_officer_id    = $("#purchaseOfficerDropdown").val();
        main.purchase_id            = $("#purchaseIdHidden").val();
        main.supplier_name          = $("#supplierName").val();
        main.supplier_mobile        = $("#supplierMobile").val();
        main.prepared_by            = $("#receivers_list").val();
        main.bilty_number           = $("#biltyNumber").val();
        main.bilty_date             = $("#biltyDate").val();
        main.transporter_id         = $("#transporterDropdown").val();
        main.freight_amount         = $("#freightAmount").val();
        main.freight_type_id        = $("#freightTypeDropdown").val();
        main.discount_percentage    = $("#txtDiscount").val();
        main.discount_amount        = $("#txtDiscAmount").val();
        main.expense_percentage     = $("#txtExpense").val();
        main.expense_amount         = $("#txtExpAmount").val();
        main.further_tax_percentage = $("#txtTax").val();
        main.further_tax_amount     = $("#txtTaxAmount").val();
        main.net_amount             = $("#txtNetAmount").val();

        $("#purchase_table").find("tbody tr").each(function (index, elem) {
            const gridItemDetail                   = {};
            gridItemDetail.item_id                 = $.trim($(elem).find("td.itemName").data("item_id"));
            gridItemDetail.warehouse_id            = $.trim($(elem).find("td.department_id").data("department_id"));
            gridItemDetail.detail_remarks          = $.trim($(elem).find("td.itemName textarea").val());
            gridItemDetail.stock_keeping_method_id = $.trim($(elem).find("td.itemName").data("stock_keeping_method_id"));
            gridItemDetail.rate_type_id            = $.trim($(elem).find("td.rateTypeName").data("rate_type_id"));
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
            details.push(gridItemDetail);
        });
        var data     = {};
        data.main    = main;
        data.details = details;
        data.id      = $("#returnOutwardIdHidden").val();
        return data;
    };

    // checks for the empty fields
    var validateSave = function () {
        var errorFlag             = false;
        const currentDate         = $("#current_date");
        const accountDropdown     = $("#accountDropdown");
        const freightAmount       = $("#freightAmount");
        const transporterDropdown = $("#transporterDropdown");

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

        if (getNumVal(freightAmount) > 0) {
            if (! getNumVal(transporterDropdown)) {
                $("#select2-transporterDropdown-container").parent().addClass("inputerror");
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

    var deleteVoucher = async function (vrnoa) {
        await baseInstance.runException(async () => {
            const response = await makeAjaxRequest("delete", returnOutwardApiEndpoints.outwardDelete, {
                "chk_date" : $("#chk_date").val(),
                "vrdate"   : $("#cur_date").val(),
                "vrnoa"    : vrnoa
            });
            if (response.status == false && response.error !== "") {
                _getAlertMessage("Error!", response.message, "danger");
            } else if (response.status == false && response.message !== "") {
                _getAlertMessage("Information!", response.message, "info");
                resetVoucher();
            } else {
                _getAlertMessage("Successfully!", response.message, "success");
                resetVoucher();
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
        var _FreightAmount = getNumVal($("#txtFreightAmount"));
        let NetAmount      = 0;
        NetAmount          = parseFloat(gridItemTotalAmountInclTax) - parseFloat(_DiscAmount) + parseFloat(_ExpenseAmount) + parseFloat(_TaxAmount);
        var FreightReceive = $("#txtFreightReceive").bootstrapSwitch("state");
        if (FreightReceive) {
            NetAmount = parseFloat(NetAmount) - parseFloat(_FreightAmount);
        }

        $("#txtNetAmount").val(getSettingDecimal(NetAmount));
    };

    var getNumText = function (el) {
        return isNaN(parseFloat(el.text())) ? 0 : parseFloat(el.text());
    };

    var getNumVal = function (el) {
        return isNaN(parseFloat(el.val())) ? 0 : parseFloat(el.val());
    };

    var resetVoucher = function () {
        resetFields();
        getReturnOutwardViewList();
        $("#voucher_type_hidden").val("new");
        $("#purchaseIdHidden").val("");
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
        const resetArray = [{
            selector : "returnOutwardIdHidden",
            options  : { disabled : true }
        }, {
            selector : "purchaseIdHidden",
            options  : { disabled : true }
        }, {
            selector : "purchaseVrnoa",
            options  : { disabled : true }
        }, "accountDropdown", "current_date", "chk_date", "purchaseOfficerDropdown", "gridItemShortCodeDropdown", "gridItemNameDropdown", "gridItemWarehouseDropdown", "gridItemQty", "gridItemWeight", "gridItemRate", "gridItemRateTypeDropdown", "rateTypeDivisionFactor", "gridItemRatePerKG", "gridItemGAmount", "gridItemDiscountPercentage", "gridItemDiscountPerUnit", "gridItemRatePerUnit", "gridItemAmountExclTax", "gridItemTaxPercentage", "gridItemTaxAmount", "gridItemAmountInclTax", "txtGridRemarks", "txtDiscount", "txtDiscAmount", "txtExpense", "txtExpAmount", "txtTax", "txtTaxAmount", "txtNetAmount", "supplierName", "supplierMobile", "receivers_list", "due_days", "biltyNumber", "biltyDate", "transporterDropdown", "freightAmount", "freightTypeDropdown"];
        clearValueAndText(resetArray);

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
                    const stockInfo = new StockInformation(response.data.stock_keeping_method_id, { isSale : true });
                    stockInfo.getStockInformation(parseNumber(response.data.item_id), $("#current_date").val(), 0);
                }

                triggerAndRenderOptions($("#gridItemShortCodeDropdown"), response.data.short_code, response.data.item_id, false, false, true);
                triggerAndRenderOptions($("#gridItemNameDropdown"), response.data.item_des, response.data.item_id, false, false, true);

                const stockKeepingMethodIdValue = response.data.stock_keeping_method_id;
                const division_by               = response.data.item_calculation_method.division_by;
                appendSelect2ValueIfDataExists("gridItemRateTypeDropdown", "item_calculation_method", "id", "name", response.data);
                appendSelect2ValueIfDataExists("gridItemWarehouseDropdown", "item_department", "did", "name", response.data);
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

                if (parseNumber($("#gridItemWarehouseDropdown").val()) > 0) {
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
            // User is updating discount percentage
            discountPerUnit = calculateDiscountPerUnitGridItemRow(discountPercentage, rate);
            gridItemDiscountPerUnit.val(discountPerUnit.toFixed(4));
        } else if (eventInputId === "gridItemDiscountPerUnit") {
            // User is updating discount per unit
            discountPercentage = calculateDiscountPercentageGridItemRow(discountPerUnit, rate);
            gridItemDiscountPercentage.val(discountPercentage.toFixed(2));
        } else {
            // User is updating discount percentage
            discountPerUnit = calculateDiscountPerUnitGridItemRow(discountPercentage, rate);
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

    let returnOutwardViewList      = undefined;
    const getReturnOutwardViewList = (returnOutwardId = 0, fromDate = "", toDate = "") => {
        if (typeof returnOutwardViewList !== "undefined") {
            returnOutwardViewList.destroy();
            $("#returnOutwardViewListTbody").empty();
        }
        returnOutwardViewList = $("#returnOutwardViewList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url     : `${base_url}/returnOutward/getReturnOutwardViewList`,
                type    : "GET",
                data    : {
                    "returnOutwardId" : returnOutwardId,
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
                data      : "returnOutwardVoucher",
                name      : "sm.vrnoa",
                className : "text-left returnOutwardVoucher"
            }, {
                data      : "voucherDate",
                name      : "sm.vrdate",
                className : "text-left voucherDate",
                render    : function (data, type, row) {
                    return getFormattedDate(data);
                }
            }, {
                data      : "supplierName",
                name      : "parties.name",
                className : "supplierName"
            }, {
                data       : null,
                className  : "select text-right",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row) {
                    return `
						<!-- Default dropleft button -->
						<div class="btn-group dropleft">
							<button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								More
							</button>
							<div class="dropdown-menu">
								<a class="dropdown-item btnEditPrevVoucher" data-return_outward_id="${row.returnOutwardId}" href="#"><i class='fa fa-edit'></i> Edit Voucher</a>
								<a class="dropdown-item btnPrint"  data-return_outward_id="${row.returnOutwardId}" href="#"><i class='fa fa-print'></i> Print Voucher</a>
								<a class="dropdown-item btnDelete" data-return_outward_id="${row.returnOutwardId}" href="#"><i class='fa fa-trash'></i> Delete Voucher</a>
								<div class="dropdown-divider"></div>
								<a class="dropdown-item btnPrintASEmail" data-return_outward_id="${row.returnOutwardId}" href="#">Send Email</a>
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
        returnOutwardViewList.on("draw", function () {
            $("[data-toggle=\"tooltip\"]").tooltip(); // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
    };

    let pendingPurchaseRecordList  = undefined;
    const getPendingPurchaseRecord = () => {
        if (typeof pendingPurchaseRecordList !== "undefined") {
            pendingPurchaseRecordList.destroy();
            $("#pendingPurchaseRecordListTbody").empty();
        }
        pendingPurchaseRecordList = $("#pendingPurchaseRecordList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url     : `${base_url}/purchase/getPendingPurchaseCompareReturnOutward`,
                type    : "GET",
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
                data      : "purchaseVrnoa",
                name      : "purchases.vrnoa",
                className : "text-left purchaseVrnoa"
            }, {
                data      : "purchaseDate",
                name      : "purchases.vrdate",
                className : "text-left purchaseDate",
                render    : function (data, type, row) {
                    return getFormattedDate(data);
                }
            }, {
                data      : "supplierName",
                name      : "parties.name",
                className : "supplierName"
            }, {
                data      : "item_des",
                name      : "items.item_des",
                className : "item_des"
            }, {
                searchable : false,
                data       : "remaining_qty",
                name       : "CASE WHEN skm.id = 1 THEN IFNULL(pod.qty, 0) - IFNULL(rec.qty, 0) ELSE 0 END",
                className  : "text-right remaining_qty",
                render     : function (data, type, row) {
                    return parseNumber(data).toFixed(2);
                }
            }, {
                searchable : false,
                data       : "remaining_weight",
                name       : "CASE WHEN skm.id = 1 THEN IFNULL(pod.qty, 0) - IFNULL(rec.qty, 0) ELSE 0 END",
                className  : "text-right remaining_weight",
                render     : function (data, type, row) {
                    return parseNumber(data).toFixed(2);
                }
            }, {
                data       : null,
                className  : "select text-right",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row) {
                    return `<button type="button" class="btn btn-sm btn-outline-primary mr-2 mb-2 flex-1 getPurchaseById  w-16 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-middle" data-purchase_id="${data.purchaseId}"><i class='fa fa-check'></i></button>`;
                }
            }

            ],
            createdRow : function (row, data, dataIndex) {
                $(row).addClass("group odd:bg-white even:bg-slate-50");
                $("td", row).addClass("py-1 px-1 text-md align-middle");
            }
        });
        // Reinitialize tooltips on table redraw
        pendingPurchaseRecordList.on("draw", function () {
            $("[data-toggle=\"tooltip\"]").tooltip(); // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
        $("#pendingPurchaseLookUp").modal("show");
    };
    return {

        init : function () {
            this.bindUI();
            $(".select2").select2({
                width : "element"
            });
            if (! propsForTable.moduleSettings) {
                propsForTable.moduleSettings = {};
            }
            propsForTable.moduleSettings.stockKeepingMethodId = parseNumber(moduleSettings.stock_keeping_method_id);
            getReturnOutwardViewList();
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
                const tableAppended = new TableRowAppended("#purchase_table", propsForTable);
                tableAppended.appendRow(rowData);
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
                getReturnOutwardViewList();
            });
            $("#purchaseOrderFilter").on("click", function (e) {
                e.preventDefault();
                const fromDate = $("#fromDate").val();
                const toDate   = $("#toDate").val();
                getReturnOutwardViewList("", fromDate, toDate);
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
            $("body").on("click", "#pendingPurchaseLookUp .getPurchaseById", function (e) {
                e.preventDefault();
                $("#pendingPurchaseLookUp").modal("hide");
                const purchaseId = $(this).data("purchase_id");
                fetchPurchaseById(purchaseId);
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

            $(document).on("click", "#searchPurchase", function (e) {
                e.preventDefault();
                getPendingPurchaseRecord();
            });

            $("body").on("click", ".btnEditPrevVoucher", function (e) {
                e.preventDefault();
                var returnOutwardId = parseNumber($(this).data("return_outward_id"));
                fetch(returnOutwardId);
                $("a[href=\"#Main\"]").trigger("click");
            });

            $(".btnSave").on("click", function (e) {
                e.preventDefault();
                self.initSave();
            });
            $("body").on("click", ".btnDelete", function (e) {
                const returnOutwardId = $(this).data("return_outward_id") ? $(this).data("return_outward_id") : $("#returnOutwardIdHidden").val();
                e.preventDefault();
                if (returnOutwardId !== "") {
                    _getConfirmMessage("Warning!", "Are you sure to delete this voucher", "warning", function (result) {
                        if (result) {
                            deleteVoucher(returnOutwardId);
                        }
                    });
                }
            });

            $("body").on("click", ".btnPrint", function (e) {
                const returnOutwardId     = $("#returnOutwardIdHidden").val() ? $("#returnOutwardIdHidden").val() : $(this).data("return_outward_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(base_url + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(returnOutwardId, settingPrintDefault, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintASEmail", function (e) {
                const returnOutwardId     = $(this).data("return_outward_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                getSendMail(returnOutwardId, settingPrintDefault, "lg", "", true);
            });

            $(".btnprintHeader").on("click", function (e) {
                e.preventDefault();
                Print_Voucher(1, "lg", "");
            });

            $(".btnprintwithOutHeader").on("click", function (e) {
                e.preventDefault();
                Print_Voucher(2, "lg", "");
            });

            $(".btnprint_sm").on("click", function (e) {
                e.preventDefault();
                Print_Voucher(3, "lg", "");
            });

            $(".btnprint_sm_withOutHeader").on("click", function (e) {
                e.preventDefault();
                Print_Voucher(4, "lg", "");
            });

            $(".btnprint_th_Header").on("click", function (e) {
                e.preventDefault();
                window.open(base_url + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
            });

            $(".btnprint_sm_rate").on("click", function (e) {
                e.preventDefault();
                Print_Voucher(1, "sm", "wrate");
            });

            $(".btnprint_sm_withOutHeader_rate").on("click", function (e) {
                e.preventDefault();
                Print_Voucher(4, "lg", "");
            });

            $(".btnReset").on("click", function (e) {
                e.preventDefault();
                self.resetVoucher();
            });

            shortcut.add("F10", function () {
                $(".btnSave").get()[0].click();
            });
            shortcut.add("F1", function () {
                $(".getAccountLookUpRecord").get()[0].click();
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

            $("#txtVrnoa").on("keypress", function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    var vrnoa = $("#txtVrnoa").val();
                    if (vrnoa !== "") {
                        fetch(vrnoa);
                    }
                }
            });

            returnOutward.fetchRequestedVr();
        },

        // prepares the data to save it into the database
        initSave         : function () {
            var error  = validateSave();
            var error1 = general.validatedate($("#current_date").val());
            if (! error1) {
                var error3 = validate();
                if (! error3) {
                    if (! error) {
                        var rowsCount = $("#purchase_table").find("tbody tr").length;
                        if (rowsCount > 0) {
                            var saveObj = getSaveObject();
                            save(saveObj);
                        } else {
                            _getAlertMessage("Error!", "Please add at least one row in the grid to save.", "danger");
                        }
                    } else {
                        _getAlertMessage("Error!", "Correct the errors", "danger");
                    }
                } else {
                    _getAlertMessage("Error!", "Validity Date Must be Greater Than Voucher Date", "danger");
                }
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
        resetVoucher     : function () {
            resetVoucher();
        }
    };

};

var returnOutward = new ReturnOutward();
returnOutward.init();

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
        requestedUrl    : dropdownOptions.getAllOfficerByDesignation,
        placeholderText : "Choose Purchase Officer",
        allowClear      : true,
        designation     : "Purchases Officer"
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
