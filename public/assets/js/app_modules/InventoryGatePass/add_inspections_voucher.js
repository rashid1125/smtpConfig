import BaseClass                                                                                                                                                                                                from "../../../../js/components/BaseClass.js";
import GridItemRowCalculator                                                                                                                                                                                    from "../../../../js/components/GridItemRowCalculator.js";
import { makeAjaxRequest }                                                                                                                                                                                      from "../../../../js/components/MakeAjaxRequest.js";
import { StockInformation }                                                                                                                                                                                     from "../../../../js/components/StockInformation.js";
import { appendSelect2ValueIfDataExists, ifNull, parseNumber, setFinancialYearDate, updateDatepickerWithFormattedDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek } from "../commonFunctions/CommonFunction.js";
import { propsForTable }                                                                                                                                                                                        from "../commonFunctions/PopulateDataOnVouchers.js";
import AlertComponent                                                                                                                                                                                           from "../../../../js/components/AlertComponent.js";

const baseInstance = new BaseClass();
var Purchase       = function () {
    var settings = {
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

    var save = async function (purchaseData) {
        await baseInstance.runException(async () => {
            const sendingData = {
                "main"     : JSON.stringify(purchaseData.main),
                "details"  : JSON.stringify(purchaseData.details),
                "id"       : purchaseData.id,
                "chk_date" : $("#chk_date").val()
            };
            const response    = await makeAjaxRequest("POST", `${base_url}/inspection/saveInspection`, sendingData);
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
            const __etype         = "inspections";
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
        const __etype         = "inspections";
        const __vrnoa         = vrnoa;
        const __pre_bal_print = ($(settings.switchPreBal).bootstrapSwitch("state") === true) ? "2" : "1";
        const __lang          = $("#print_lang").val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, __pre_bal_print, paperSize, printSize, wrate, __lang, email);
    };

    var fetch = function (inspectionId) {
        $.ajax({
            url      : `${base_url}/inspection/fetch`,
            type     : "GET",
            data     : { "inspectionId" : inspectionId },
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
        $("#inspectionIdHidden").val(data.id);
        $("#inwardGatePassId").val(data.inward_gate_pass_id);
        $("#inwardGatePassVrnoa").val(data.inward_gate_pass_vrnoa);

        populateDateValue("current_date", data.vrdate);
        populateDateValue("chk_date", data.vrdate);
        populateDateValue("due_date", data.due_date);

        $("#due_days").val(data.due_days);
        appendSelect2ValueIfDataExists("accountDropdown", "party", "pid", "name", data, { disabled : true });
        appendSelect2ValueIfDataExists("purchaseOfficerDropdown", "purchase_officer", "id", "name", data, { disabled : true });

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

        $("#freightTypeDropdown").val(data.freight_type_id).trigger("change.select2");

        $.each(data.inspection_detail, function (index, elem) {
            appendToTable(elem.item_id, elem.item_details.item_des, elem.department_details.did, elem.department_details.name, ifNull(elem.detail_remarks, ""), elem.stock_keeping_method.id, elem.inward_qty, elem.inward_weight, elem.rate, elem.rate_type.id, elem.rate_type.name, elem.division_factor, elem.rate_per_kg, elem.gross_amount, elem.discount_percentage, elem.discount_per_unit, elem.discount_amount, elem.rate_per_unit, elem.amount_excl_tax, elem.tax_percentage, elem.tax_amount, elem.amount_incl_tax, elem.rejected_qty, elem.qty, elem.rejected_weight, elem.weight);
        });
        calculateLowerTotal();
    };

    var fetchInwardGatePassById = function (inwardGatePassId) {
        $.ajax({
            url      : `${base_url}/inward/fetch`,
            type     : "GET",
            data     : { "inwardGatePassId" : inwardGatePassId },
            dataType : "JSON",
            success  : function (response) {
                resetFields();
                if (response.status == false && response.error !== "") {
                    _getAlertMessage("Error!", response.message, "danger");
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage("Information!", response.message, "info");
                    resetVoucher();
                } else {
                    populateInwardGatePasssData(response.data);
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    var populateInwardGatePasssData = function (data) {

        $("#inwardGatePassId").val(data.id);
        $("#inwardGatePassVrnoa").val(data.vrnoa);
        $("#due_days").val(data.due_days);

        appendSelect2ValueIfDataExists("accountDropdown", "party", "pid", "name", data, { disabled : true });
        appendSelect2ValueIfDataExists("purchaseOfficerDropdown", "purchase_officer", "id", "name", data, { disabled : true });

        $("#supplierName").val(data.supplier_name);
        $("#supplierMobile").val(data.supplier_mobile);
        $("#receivers_list").val(data.prepared_by);

        $("#txtDiscount").val(data.discount_percentage);
        $("#txtDiscAmount").val(data.discount_amount);
        $("#txtExpense").val(data.expense_percentage);
        $("#txtExpAmount").val(data.expense_amount);
        $("#txtTax").val(data.further_tax_percentage);
        $("#txtTaxAmount").val(data.further_tax_amount);
        $("#freightAmount").val(parseNumber(data.freight_amount).toFixed(AMOUNT_ROUNDING));
        $("#txtNetAmount").val(data.net_amount);

        updateDatepickerWithFormattedDate("biltyDate", data.bilty_date);
        $("#biltyNumber").val(data.bilty_number);
        appendSelect2ValueIfDataExists("transporterDropdown", "transporter", "transporter_id", "name", data);
        $("#freightTypeDropdown").val(data.freight_type_id).trigger("change.select2");
        $.each(data.inward_gate_pass_details, function (index, elem) {
            appendToTable(elem.item_id, elem.item_details.item_des, elem.inward_department.did, elem.inward_department.name, ifNull(elem.detail_remarks, " "), elem.stock_keeping_method.id, elem.qty, elem.weight, elem.rate, elem.rate_type.id, elem.rate_type.name, elem.division_factor, elem.rate_per_kg, elem.gross_amount, elem.discount_percentage, elem.discount_per_unit, elem.discount_amount, elem.rate_per_unit, elem.amount_excl_tax, elem.tax_percentage, elem.tax_amount, elem.amount_incl_tax, 0, elem.qty, 0, elem.weight);
        });
        calculateLowerTotal();
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

    var appendToTable = function (itemId, itemName, department_id, department_name, remarks, stockKeepingMethodId, qty, weight, rate, rateTypeId, rateTypeName, divisionFactor, ratePerKG, gAmount, discountPercentage, discountPerUnit, discountAmount, ratePerUnit, amountExclTax, taxPercentage, taxAmount, amountInclTax, rejectedQty, netQty, rejectedWeight, netWeight) {
        const userCacheId = uuidv4();
        const isTaxHidden = getNumVal($("#header_tax")) === 0;
        const hideClass   = isTaxHidden ? "hide" : "";

        const srno = $("#purchase_table tbody tr").length + 1;

        const row = `
        <tr data-row-id="${userCacheId}" class="odd:bg-white even:bg-slate-50">
            <td class='py-1 px-1 text-md align-middle text-left' data-title='Sr#'> ${srno}</td>
            <td class='py-1 px-1 text-md align-middle text-left itemName' data-item_id='${itemId}' data-stock_keeping_method_id="${stockKeepingMethodId}">${itemName}
							<span><textarea class="form-input-class no-resize custom-textarea" placeholder="Enter details related to the row above...">${remarks}</textarea></span>
						</td>
            <td class='py-1 px-1 text-md align-middle text-left department_id' data-department_id="${department_id}"> ${department_name}</td>
            <td class='py-1 px-1 text-md align-middle text-right inwardQty'> ${parseNumber(qty).toFixed(QTY_ROUNDING)}</td>
						<td class='py-1 px-1 text-md align-middle text-right rejectedQty'>
                <input type='text' class='form-input-class is_numeric text-right w-20 h-8 float-right rejectedQty' value='${parseNumber(rejectedQty).toFixed(QTY_ROUNDING)}'>
            </td>
						<td class='py-1 px-1 text-md align-middle text-right qty'> ${parseNumber(netQty).toFixed(QTY_ROUNDING)}</td>

						<td class='py-1 px-1 text-md align-middle text-right inwardWeight'> ${parseNumber(weight).toFixed(WEIGHT_ROUNDING)}</td>
						<td class='py-1 px-1 text-md align-middle text-right rejectedWeight'>
                <input type='text' class='form-input-class is_numeric text-right w-20 h-8 float-right rejectedWeight' value='${parseNumber(rejectedWeight).toFixed(WEIGHT_ROUNDING)}'>
            </td>
						<td class='py-1 px-1 text-md align-middle text-right weight'> ${parseNumber(netWeight).toFixed(WEIGHT_ROUNDING)}</td>

						<td class='py-1 px-1 text-md align-middle text-right rate d-none'>
                <input type='text' class='form-input-class is_numeric text-right w-20 h-8 float-right rate' value='${parseNumber(rate).toFixed(RATE_ROUNDING)}'>
            </td>
            <td class='py-1 px-1 text-md align-middle text-right rateTypeName d-none' data-rate_type_id="${rateTypeId}" data-division_factor="${divisionFactor}"> ${rateTypeName}</td>
						<td class='py-1 px-1 text-md align-middle text-right ratePerKG d-none'>
                <input type='text' class='form-input-class is_numeric text-right w-20 h-8 float-right ratePerKG' value='${parseNumber(ratePerKG).toFixed(4)}'>
            </td>
            <td class='py-1 px-1 text-md align-middle text-right gAmount d-none'> ${parseNumber(gAmount).toFixed(AMOUNT_ROUNDING)}</td>
            <td class='py-1 px-1 text-md align-middle text-right discountPercentage d-none' data-title='Dis%'>
                <input type='text' class='form-input-class is_numeric text-right w-14 h-8 float-right discountPercentage' value='${parseNumber(discountPercentage).toFixed(2)}'>
            </td>
            <td class='py-1 px-1 text-md align-middle text-right discountPerUnit d-none' data-title='Discount'>
                <input type='text' class='form-input-class is_numeric text-right w-20 h-8 float-right discountPerUnit' value='${parseNumber(discountPerUnit).toFixed(4)}'>
            </td>
            <td class='py-1 px-1 text-md align-middle text-right discountAmount d-none'> ${parseNumber(discountAmount).toFixed(AMOUNT_ROUNDING)}</td>
            <td class='py-1 px-1 text-md align-middle text-right ratePerUnit d-none' data-title='ratePerUnit'> ${parseNumber(ratePerUnit).toFixed(4)}</td>
            <td class='py-1 px-1 text-md align-middle text-right amountExclTax d-none' data-title='amountExclTax'> ${parseNumber(amountExclTax).toFixed(AMOUNT_ROUNDING)}</td>
						<td class='py-1 px-1 text-md align-middle text-right taxPercentage d-none' data-title='taxPercentage'>
                <input type='text' class='form-input-class is_numeric text-right w-14 h-8 float-right taxPercentage' value='${parseNumber(taxPercentage).toFixed(2)}'>
            </td>
            <td class='py-1 px-1 text-md align-middle text-right taxAmount d-none' data-title='taxAmount'> ${parseNumber(taxAmount).toFixed(AMOUNT_ROUNDING)}</td>
            <td class='py-1 px-1 text-md align-middle text-right amountInclTax d-none' data-title='amountInclTax'> ${parseNumber(amountInclTax).toFixed(AMOUNT_ROUNDING)}</td>
            <td class='py-1 px-1 text-md align-middle text-right'><button type="button" class="btn btn-outline-primary btnRowItemInfo"><i class="fa fa-info"></i></button></td>
        </tr>`;

        $(row).appendTo("#purchase_table");
        getTableSerialNumber("#purchase_table");
    };

    var getSaveObject = function () {
        const main    = {};
        const details = [];

        main.id                     = $("#inspectionIdHidden").val();
        main.vrdate                 = $("#current_date").val();
        main.due_date               = $("#due_date").val();
        main.chk_date               = $("#chk_date").val();
        main.due_days               = $("#due_days").val();
        main.party_id               = $("#accountDropdown").val();
        main.purchase_officer_id    = $("#purchaseOfficerDropdown").val();
        main.inward_gate_pass_id    = $("#inwardGatePassId").val();
        main.inward_gate_pass_vrnoa = $("#inwardGatePassVrnoa").val();
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
            gridItemDetail.inward_qty              = $.trim($(elem).find("td.inwardQty").text());
            gridItemDetail.rejected_qty            = $.trim($(elem).find("td.rejectedQty input.rejectedQty").val());
            gridItemDetail.qty                     = $.trim($(elem).find("td.qty").text());
            gridItemDetail.inward_weight           = $.trim($(elem).find("td.inwardWeight").text());
            gridItemDetail.rejected_weight         = $.trim($(elem).find("td.rejectedWeight input.rejectedWeight").val());
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
        data.id      = $("#inspectionIdHidden").val();
        return data;
    };

    // checks for the empty fields
    var validateSave   = function () {
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
            url      : base_url + "/inspection/delete",
            type     : "delete",
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

        let gridItemTotalInwardQty   = 0;
        let gridItemTotalRejectedQty = 0;
        let gridItemTotalQty         = 0;

        let gridItemTotalInwardWeight   = 0;
        let gridItemTotalRejectedWeight = 0;
        let gridItemTotalWeight         = 0;
        let gridItemTotalGrossAmount    = 0;
        let gridItemTotalDiscountAmount = 0;
        let gridItemTotalAmountExclTax  = 0;
        let gridItemTotalTaxAmount      = 0;
        let gridItemTotalAmountInclTax  = 0;

        $("#purchase_table").find("tbody tr").each(function (index, elem) {

            gridItemTotalInwardQty += getNumText($(this).closest("tr").find("td.inwardQty"));
            gridItemTotalRejectedQty += getNumVal($(this).closest("tr").find("td.rejectedQty input.rejectedQty"));
            gridItemTotalQty += getNumText($(this).closest("tr").find("td.qty"));

            gridItemTotalInwardWeight += getNumText($(this).closest("tr").find("td.inwardWeight"));
            gridItemTotalRejectedWeight += getNumVal($(this).closest("tr").find("td.rejectedWeight input.rejectedWeight"));
            gridItemTotalWeight += getNumText($(this).closest("tr").find("td.weight"));

            gridItemTotalGrossAmount += getNumText($(this).closest("tr").find("td.gAmount"));
            gridItemTotalDiscountAmount += getNumText($(this).closest("tr").find("td.discountAmount"));
            gridItemTotalAmountExclTax += getNumText($(this).closest("tr").find("td.amountExclTax"));
            gridItemTotalTaxAmount += getNumText($(this).closest("tr").find("td.taxAmount"));
            gridItemTotalAmountInclTax += getNumText($(this).closest("tr").find("td.amountInclTax"));
        });

        $(".gridItemTotalInwardQty").text(parseNumber(gridItemTotalInwardQty).toFixed(QTY_ROUNDING));
        $(".gridItemTotalRejectedQty").text(parseNumber(gridItemTotalRejectedQty).toFixed(QTY_ROUNDING));
        $(".gridItemTotalQty").text(parseNumber(gridItemTotalQty).toFixed(QTY_ROUNDING));
        $(".gridItemTotalInwardWeight").text(parseNumber(gridItemTotalInwardWeight).toFixed(WEIGHT_ROUNDING));
        $(".gridItemTotalRejectedWeight").text(parseNumber(gridItemTotalRejectedWeight).toFixed(WEIGHT_ROUNDING));
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
        getInspectionViewList();
        loadSettingConfiguration();
        $("#voucher_type_hidden").val("new");
        $("#purchaseOrderId").val("");
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

        $("#inspectionIdHidden").val("");
        $("#inwardGatePassVrnoa").val("");
        $("#inwardGatePassId").val("");
        $("#accountDropdown").val("").trigger("change.select2");
        $("#current_date").datepicker("update", new Date());
        $("#due_date").datepicker("update", new Date());
        $("#chk_date").datepicker("update", new Date());
        $("#purchaseOfficerDropdown").val("").trigger("change.select2");
        $("#gridItemNameDropdown").val("").trigger("change.select2");
        $("#gridItemShortCodeDropdown").val("").trigger("change.select2");
        $("#gridItemQty").val("");
        $("#gridItemWeight").val("");
        $("#gridItemRate").val("");
        $("#gridItemRateTypeDropdown").val("").trigger("change.select2");
        $("#gridItemRatePerKG").val("");
        $("#gridItemGAmount").val("");
        $("#gridItemDiscountPercentage").val("");
        $("#gridItemDiscountPerUnit").val("");
        $("#gridItemRatePerUnit").val("");
        $("#gridItemAmountExclTax").val("");
        $("#gridItemTaxPercentage").val("");
        $("#gridItemTaxAmount").val("");
        $("#gridItemAmountInclTax").val("");
        $("#txtGridRemarks").val("");
        $("#txtDiscount").val("");
        $("#txtDiscAmount").val("");
        $("#txtExpense").val("");
        $("#txtExpAmount").val("");
        $("#txtTax").val("");
        $("#txtTaxAmount").val("");
        $("#txtNetAmount").val("");
        $("#supplierName").val("");
        $("#supplierMobile").val("");
        $("#receivers_list").val("");
        $("#biltyNumber").val("");
        $("#freightAmount").val("");
        $("#due_days").val("");

        $("#biltyDate").datepicker("update", new Date());
        $("#transporterDropdown").val("").trigger("change.select2");
        $("#freightTypeDropdown").val("").trigger("change.select2");

        $(".gridItemTotalInwardQty").text("");
        $(".gridItemTotalRejectedQty").text("");
        $(".gridItemTotalQty").text("");
        $(".gridItemTotalInwardWeight").text("");
        $(".gridItemTotalRejectedWeight").text("");
        $(".gridItemTotalWeight").text("");
        $(".gridItemTotalGrossAmount").text("");
        $(".gridItemTotalAmountExclTax").text("");
        $(".gridItemTotalTaxAmount").text("");
        $(".gridItemTotalAmountInclTax").text("");

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

                triggerAndRenderOptions($("#gridItemShortCodeDropdown"), response.data.item_des, response.data.item_id, false, false, true);
                triggerAndRenderOptions($("#gridItemNameDropdown"), response.data.item_des, response.data.item_id, false, false, true);

                const stockKeepingMethodIdValue = response.data.stock_keeping_method_id;
                appendSelect2ValueIfDataExists("gridItemRateTypeDropdown", "item_calculation_method", "id", "name", response.data);
                $("#rateTypeDivisionFactor").val(response.data.item_calculation_method.division_by);
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
            var itemName               = "";
            var categoryName           = "";
            var subCategoryName        = "";
            var stockKeepingMethodName = "";
            var calculationType        = "";

            itemName               = (data.item_des) ? data.item_des : "-";
            categoryName           = (data.item_category) ? data.item_category.name : "-";
            subCategoryName        = (data.item_sub_category) ? data.item_sub_category.name : "-";
            stockKeepingMethodName = (data.stock_keeping_method) ? data.stock_keeping_method.description : "-";
            calculationType        = `${(data.item_calculation_method) ? data.item_calculation_method.name : "-"}`;

            $("#otherItemInformation").html(`<b>Item Name</b> : ${itemName} <br /><b>Category</b> : ${categoryName} <br /><b>Sub Category</b> : ${subCategoryName} <br /><b>Stock Keeping</b> : ${stockKeepingMethodName} <br /><b>Calcualtion By</b> : ${calculationType} <br />`);
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
            const ratePerKg = calculateRatePerKg(rate, divisionFactor, stockKeepingMethodId);
            gridItemRatePerKG.val(parseNumber(ratePerKg).toFixed(RATE_ROUNDING));
        } else if (eventInputId === "gridItemRatePerKG") {
            const calculatedRate = calculateRate(gridItemRatePerKG.val(), divisionFactor, stockKeepingMethodId);
            gridItemRate.val(parseNumber(calculatedRate).toFixed(RATE_ROUNDING));
            rate = calculatedRate;
        } else {
            const ratePerKg = calculateRatePerKg(rate, divisionFactor, stockKeepingMethodId);
            gridItemRatePerKG.val(parseNumber(ratePerKg).toFixed(RATE_ROUNDING));
        }

        // Gross Amount calculation
        const grossAmount = calculateGrossAmount(rate, qty, weight, divisionFactor, stockKeepingMethodId);
        gridItemGAmount.val(parseNumber(grossAmount).toFixed(AMOUNT_ROUNDING));
        // Discount calculations

        var discountPercentage = parseFloat(gridItemDiscountPercentage.val()) || 0;
        var discountPerUnit    = parseFloat(gridItemDiscountPerUnit.val()) || 0;
        if (eventInputId === "gridItemDiscountPercentage") {
            // User is updating discount percentage
            discountPerUnit = calculateDiscountPerUnit(discountPercentage, rate);
            gridItemDiscountPerUnit.val(discountPerUnit.toFixed(4));
        } else if (eventInputId === "gridItemDiscountPerUnit") {
            // User is updating discount per unit
            discountPercentage = calculateDiscountPercentage(discountPerUnit, rate);
            gridItemDiscountPercentage.val(discountPercentage.toFixed(2));
        } else {
            // User is updating discount percentage
            discountPerUnit = calculateDiscountPerUnit(discountPercentage, rate);
            gridItemDiscountPerUnit.val(discountPerUnit.toFixed(4));
        }
        const discountAmount = calculateDiscountAmount(grossAmount, discountPercentage);

        // Unit Rate calculation
        const ratePerUnit = calculateRatePerUnit(rate, discountPerUnit, divisionFactor, stockKeepingMethodId);
        gridItemRatePerUnit.val(ratePerUnit.toFixed(RATE_ROUNDING));

        // Amount Excl. Tax calculation
        const amountExclTax = calculateAmountExclTax(rate, qty, weight, divisionFactor, stockKeepingMethodId, discountPerUnit);
        gridItemAmountExclTax.val(amountExclTax.toFixed(AMOUNT_ROUNDING));

        // Tax Amount calculation
        var taxPercentage = parseFloat(gridItemTaxPercentage.val()) || 0;
        var taxAmount     = parseFloat(gridItemTaxAmount.val()) || 0;
        if (eventInputId === "gridItemTaxPercentage") {
            taxAmount = calculateTaxAmount(amountExclTax, taxPercentage);
            gridItemTaxAmount.val(taxAmount.toFixed(AMOUNT_ROUNDING));
        } else if (eventInputId === "gridItemTaxAmount") {
            taxPercentage = calculateTaxPercentage(amountExclTax, taxAmount);
            gridItemTaxPercentage.val(taxPercentage.toFixed(2));
        } else {
            taxAmount = calculateTaxAmount(amountExclTax, taxPercentage);
            gridItemTaxAmount.val(taxAmount.toFixed(AMOUNT_ROUNDING));
        }

        gridItemTaxAmount.val(taxAmount.toFixed(AMOUNT_ROUNDING));

        const amountInclTax = calculateAmountInclTax(amountExclTax, taxAmount);
        gridItemAmountInclTax.val(amountInclTax.toFixed(AMOUNT_ROUNDING));
    };

    const calculateRatePerKg = (rate, divisionFactor, stockKeepingMethodId) => {
        const _divisionFactor = parseNumber(divisionFactor);
        if (parseNumber(_divisionFactor) == 0 && parseNumber(stockKeepingMethodId) > 1) {
            return _getAlertMessage("Error!", "_divisionFactor can't be Zero", "danger");
        }

        var $ratePerKG;

        if (parseNumber(stockKeepingMethodId) === 1) {
            $ratePerKG = 0;
        } else if (parseNumber(stockKeepingMethodId) === 2) {
            $ratePerKG = parseNumber(rate) / parseNumber(divisionFactor);
        } else if (parseNumber(stockKeepingMethodId) === 3) {
            $ratePerKG = parseNumber(rate) / parseNumber(divisionFactor);
        }
        return parseNumber($ratePerKG);
    };

    const calculateRate = (ratePerKG, divisionFactor, stockKeepingMethodId) => {
        const _divisionFactor = parseNumber(divisionFactor);
        if (parseNumber(_divisionFactor) == 0 && parseNumber(stockKeepingMethodId) > 1) {
            return _getAlertMessage("Error!", "_divisionFactor can't be Zero", "danger");
        }

        var $rate;

        if (parseNumber(stockKeepingMethodId) === 1) {
            $rate = parseNumber(ratePerKG);
        } else if (parseNumber(stockKeepingMethodId) === 2) {
            $rate = parseNumber(ratePerKG) * parseNumber(divisionFactor);
        } else if (parseNumber(stockKeepingMethodId) === 3) {
            $rate = parseNumber(ratePerKG) * parseNumber(divisionFactor);
        }
        return parseNumber($rate);
    };

    const calculateGrossAmount        = (rate, qty, weight, divisionFactor, stockKeepingMethodId) => {
        var $grossAmount = 0;
        if (parseNumber(stockKeepingMethodId) === 1) {
            $grossAmount = (parseNumber(qty) / parseNumber(divisionFactor)) * parseNumber(rate);
        } else if (parseNumber(stockKeepingMethodId) === 2) {
            $grossAmount = (parseNumber(weight) / parseNumber(divisionFactor)) * parseNumber(rate);
        } else if (parseNumber(stockKeepingMethodId) === 3) {
            $grossAmount = (parseNumber(weight) / parseNumber(divisionFactor)) * parseNumber(rate);
        }
        return parseNumber($grossAmount);
    };
    // Function to calculate discount percentage based on discount per unit
    const calculateDiscountPercentage = (discountPerUnit, rate) => {
        return (discountPerUnit / rate) * 100;
    };

    const calculateDiscountPerUnit = (discountPercentage, rate) => {
        return parseNumber(rate) * parseNumber(discountPercentage) / parseNumber(100);
    };

    const calculateDiscountAmount = (amount, discountPercentage) => {
        return (parseNumber(discountPercentage) / parseNumber(100)) * parseNumber(amount);
    };

    const calculateRatePerUnit = (rate, discountPerUnit, divisionFactor, stockKeepingMethodId) => {
        return parseNumber((parseNumber(rate) - parseNumber(discountPerUnit)) / parseNumber(divisionFactor));
    };

    const calculateAmountExclTax = (rate, qty, weight, divisionFactor, stockKeepingMethodId, discountPerUnit) => {
        if (parseNumber(stockKeepingMethodId) === 1) {
            return (parseNumber(qty) / parseNumber(divisionFactor)) * (parseNumber(rate) - parseNumber(discountPerUnit));
        } else if (parseNumber(stockKeepingMethodId) === 2) {
            return (parseNumber(weight) / parseNumber(divisionFactor)) * (parseNumber(rate) - parseNumber(discountPerUnit));
        } else if (parseNumber(stockKeepingMethodId) === 3) {
            return (parseNumber(weight) / parseNumber(divisionFactor)) * (parseNumber(rate) - parseNumber(discountPerUnit));
        } else {
            return 0;
        }
    };
    const calculateTaxPercentage = (amountExclTax, taxAmount) => {
        return (taxAmount / amountExclTax) * 100;
    };

    const calculateTaxAmount = (amountExclTax, taxPercentage) => {
        return (parseNumber(taxPercentage) / parseNumber(100)) * parseNumber(amountExclTax);
    };

    const calculateAmountInclTax = (amountExclTax, taxAmount) => {
        return parseNumber(amountExclTax) + parseNumber(taxAmount);
    };

    let inspectionViewList      = undefined;
    const getInspectionViewList = (inspectionId = 0, fromDate = "", toDate = "") => {
        if (typeof inspectionViewList !== "undefined") {
            inspectionViewList.destroy();
            $("#inspectionViewListTbody").empty();
        }
        inspectionViewList = $("#inspectionViewList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url     : `${base_url}/inspection/getInspectionViewList`,
                type    : "GET",
                data    : {
                    "inspectionId" : inspectionId,
                    fromDate       : fromDate,
                    toDate         : toDate
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
                data      : "inspectionVoucher",
                name      : "insp.vrnoa",
                className : "text-left inspectionVoucher"
            }, {
                data      : "voucherDate",
                name      : "insp.vrdate",
                className : "text-left voucherDate",
                render    : function (data, type, row) {
                    return getFormattedDate(data);
                }
            }, {
                data      : "inwardVoucher",
                name      : "inward_gate_passes.vrnoa",
                className : "text-left inwardVoucher"
            }, {
                data      : "inwardVoucherDate",
                name      : "inward_gate_passes.vrdate",
                className : "text-left inwardVoucherDate",
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
								<a class="dropdown-item btnEditPrevVoucher" data-inspection_id="${row.inspectionId}" href="#"><i class='fa fa-edit'></i> Edit Voucher</a>

								<button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                <li class="dropdown-item"><a href="#" class="btnPrint" data-inspection_id  ="${row.inspectionId}">Print Voucher</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-inspection_id  ="${row.inspectionId}"> Print a4 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-inspection_id  ="${row.inspectionId}"> Print a4 without header </a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-inspection_id  ="${row.inspectionId}"> Print b5 with header</a></li>
                                <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-inspection_id  ="${row.inspectionId}"> Print b5 without header </a></li>
                            </ul>

								<a class="dropdown-item btnPrintGatePas"  data-inspection_id="${row.inspectionId}" href="#"><i class='fa fa-print'></i> Print Gate Pass</a>
								<a class="dropdown-item btnDelete" data-inspection_id="${row.inspectionId}" href="#"><i class='fa fa-trash'></i> Delete Voucher</a>
								<div class="dropdown-divider"></div>
								<a class="dropdown-item btnPrintASEmail" data-inspection_id="${row.inspectionId}" href="#">Send Email</a>
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
        inspectionViewList.on("draw", function () {
            $("[data-toggle=\"tooltip\"]").tooltip(); // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
    };

    let pendingInwardGatePassRecordList = undefined;
    const getPendingInwardGatePass      = () => {
        if (typeof pendingInwardGatePassRecordList !== "undefined") {
            pendingInwardGatePassRecordList.destroy();
            $("#pendingInwardGatePassRecordListTbody").empty();
        }
        pendingInwardGatePassRecordList = $("#pendingInwardGatePassRecordList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url     : `${base_url}/inward/getPendingInwardCompareInspection`,
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
                data      : "vrnoa",
                name      : "vrnoa",
                className : "text-left inwardGatePassVoucher text-nowrap"
            }, {
                data      : "vrdate",
                name      : "vrdate",
                className : "text-left voucherDate text-nowrap",
                render    : function (data, type, row) {
                    return getFormattedDate(data);
                }
            }, {
                data      : "party.name",
                name      : "party.name",
                className : "text-left supplierName"
            }, {
                data      : "bilty_number",
                name      : "bilty_number",
                className : "text-left biltyNumber"
            }, {
                data      : "bilty_date",
                name      : "bilty_date",
                className : "text-left voucherDate text-nowrap",
                render    : function (data, type, row) {
                    return getFormattedDate(data);
                }
            }, {
                data       : null,
                className  : "select text-right",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row) {
                    return `<button type="button" class="btn btn-sm btn-outline-primary mr-2 mb-2 flex-1 getInwardGatePassById  w-16 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-middle" data-inward_gate_pass_id="${data.id}"><i class='fa fa-check'></i></button>`;
                }
            }

            ],
            createdRow : function (row, data, dataIndex) {
                $(row).addClass("group odd:bg-white even:bg-slate-50");
                $("td", row).addClass("py-1 px-1 text-md align-middle");
            }
        });
        // Reinitialize tooltips on table redraw
        pendingInwardGatePassRecordList.on("draw", function () {
            $("[data-toggle=\"tooltip\"]").tooltip(); // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
        $("#pendingInwardGatePassLookUp").modal("show");
    };
    const loadSettingConfiguration      = () => {
        $("#txtTax").val(parseNumber(setting_configure[0].ftax).toFixed(2));
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
            if (typeof moduleSettings !== "undefined" && moduleSettings.stock_keeping_method_id) {
                propsForTable.moduleSettings.stockKeepingMethodId = parseNumber(moduleSettings.stock_keeping_method_id);
            } else {
                propsForTable.moduleSettings.stockKeepingMethodId = null;
            }

            getInspectionViewList();
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
                const itemId   = parseNumber((gridItemNameDropdown.val()));
                const itemName = $.trim($(gridItemNameDropdown).find("option:selected").text());

                const warehouseId   = parseNumber($("#gridItemWarehouseDropdown").val());
                const warehouseName = $.trim($("#gridItemWarehouseDropdown").find("option:selected").text());

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
                const discountAmount       = calculateDiscountAmount(gAmount, discountPercentage);
                const ratePerUnit          = $(gridItemRatePerUnit).val();
                const amountExclTax        = $(gridItemAmountExclTax).val();
                const taxPercentage        = $(gridItemTaxPercentage).val();
                const taxAmount            = $(gridItemTaxAmount).val();
                const amountInclTax        = $(gridItemAmountInclTax).val();
                const remarks              = $(gridRemarks).val();

                const requisitionNumber = $("#txtRequisitionNumber").val();

                var IsAlreadyExsit = getTableRowIsAlreadyExsit("#purchase_table", itemId);
                if (IsAlreadyExsit) {
                    return alert("Already Exist in the Following Table!!");
                }

                // reset the values of the annoying fields
                $(gridItemNameDropdown).val("").trigger("change.select2");
                $("#gridItemWarehouseDropdown").val("").trigger("change.select2");
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
                $("#txtRequisitionNumber").val("");
                appendToTable(itemId, itemName, warehouseId, warehouseName, remarks, stockKeepingMethodId, qty, weight, rate, rateTypeId, rateTypeName, divisionFactor, ratePerKG, gAmount, discountPercentage, discountPerUnit, discountAmount, ratePerUnit, amountExclTax, taxPercentage, taxAmount, amountInclTax);
                $("#txtDiscount").trigger("input");
                $("#txtExpense").trigger("input");
                $(gridItemNameDropdown).focus();
            });

            $("#purchase_table").on("click", ".btnRowEdit", function (e) {
                e.preventDefault();
                const currentRowId = $(this).closest("tr").data("row-id");
                const row          = $(this).closest("tr");

                const editItemId        = row.find("td.itemName").data("item_id");
                const editItemName      = row.find("td.itemName").clone().children("span").remove().end().text();
                const editWarehouseId   = row.find("td.department_id").data("department_id");
                const editWarehouseName = $.trim(row.find("td.department_id").text());

                const editStockKeepingMethodId = row.find("td.itemName").data("stock_keeping_method_id");
                const editItemQty              = parseNumber(row.find("td.qty").text());
                const editItemWeight           = parseNumber(row.find("td.weight").text());
                const editItemRate             = parseNumber(row.find("td.rate input").val());
                const editRateTypeId           = row.find("td.rateTypeName").data("rate_type_id");
                const editRatePerKG            = parseNumber(row.find("td.ratePerKG input").val());
                const editGAmount              = parseNumber(row.find("td.gAmount").text());
                const editDiscountPercentage   = parseNumber(row.find("td.discountPercentage input").val());
                const editDiscountPerUnit      = parseNumber(row.find("td.discountPerUnit input").val());
                const editDiscountAmount       = parseNumber(row.find("td.discountAmount").text());
                const editRatePerUnit          = parseNumber(row.find("td.ratePerUnit").text());
                const editAmountExclTax        = parseNumber(row.find("td.amountExclTax").text());
                const editTaxPercentage        = parseNumber(row.find("td.taxPercentage input").val());
                const editTaxAmount            = parseNumber(row.find("td.taxAmount").text());
                const editAmountInclTax        = parseNumber(row.find("td.amountInclTax").text());
                const remarks                  = row.find("td.itemName textarea").val();

                triggerAndRenderOptions($("#gridItemNameDropdown"), editItemName, editItemId, false);
                triggerAndRenderOptions($("#gridItemWarehouseDropdown"), editWarehouseName, editWarehouseId, false);

                $("#stockKeepingMethodId").val(editStockKeepingMethodId);
                $(gridItemQty).val(editItemQty);
                $(gridItemWeight).val(editItemWeight);
                $(gridItemRate).val(editItemRate);
                $(gridItemRateTypeDropdown).val(editRateTypeId).trigger("change.select2");
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

                $(this).closest("tr").remove();
                $("#txtDiscAmount").trigger("input");
                $("#txtExpAmount").trigger("input");
            });
            $("#purchase_table").on("click", ".btnRowItemInfo", async function (e) {
                e.preventDefault();
                const row        = $(this).closest("tr");
                const editItemId = row.find("td.itemName").data("item_id");
                await getItemDetailById(editItemId);
            });
            // when btnRowRemove is clicked
            $("#purchase_table").on("click", ".btnRowRemove", function (e) {
                e.preventDefault();
                const currentRowId = $(this).closest("tr").data("row-id");
                const row          = $(this).closest("tr");
                $("#purchase_table").find(`tr[data-remark-for="${currentRowId}"]`).remove();

                row.remove();
                calculateLowerTotal();
                $("#txtDiscAmount").trigger("input");
                $("#txtExpAmount").trigger("input");
            });

            $("#txtDiscount").on("input", function () {
                var _disc        = getNumVal($("#txtDiscount"));
                var _totalAmount = getNumText($(".gridItemTotalAmountInclTax"));
                getMaxPercentAge($(this));
                if (_disc >= 101) {
                    _disc = 0;
                }
                var _discamount = 0;
                if (_disc != 0 && _totalAmount != 0) {
                    _discamount = _totalAmount * _disc / 100;
                }
                $("#txtDiscAmount").val(getSettingDecimal(_discamount));
                calculateLowerTotal();
            });

            $("#txtDiscAmount").on("input", function () {
                var _discamount  = getNumVal($("#txtDiscAmount"));
                var _totalAmount = getNumText($(".gridItemTotalAmountInclTax"));
                var _discp       = 0;
                if (_discamount != 0 && _totalAmount != 0) {
                    _discp = _discamount * 100 / _totalAmount;
                }
                $("#txtDiscount").val(parseFloat(_discp).toFixed(2));
                calculateLowerTotal();
            });

            $("#txtExpense").on("input", function () {
                var _disc        = getNumVal($("#txtExpense"));
                var _totalAmount = getNumText($(".gridItemTotalAmountInclTax"));
                getMaxPercentAge($(this));
                if (_disc >= 101) {
                    _disc = 0;
                }
                var _discamount = 0;
                if (_disc != 0 && _totalAmount != 0) {
                    _discamount = _totalAmount * _disc / 100;
                }
                $("#txtExpAmount").val(getSettingDecimal(_discamount));
                calculateLowerTotal();
            });

            $("#txtExpAmount").on("input", function () {
                var _discamount  = getNumVal($("#txtExpAmount"));
                var _totalAmount = getNumText($(".gridItemTotalAmountInclTax"));
                var _discp       = 0;
                if (_discamount != 0 && _totalAmount != 0) {
                    _discp = _discamount * 100 / _totalAmount;
                }
                $("#txtExpense").val(parseFloat(_discp).toFixed(2));
                calculateLowerTotal();
            });

            $("#txtTax").on("input", function () {
                var _disc        = getNumVal($("#txtTax"));
                var _totalAmount = getNumText($(".gridItemTotalAmountInclTax"));
                getMaxPercentAge($(this));
                if (_disc >= 101) {
                    _disc = 0;
                }
                var _discamount = 0;
                if (_disc != 0 && _totalAmount != 0) {
                    _discamount = _totalAmount * _disc / 100;
                }
                $("#txtTaxAmount").val(getSettingDecimal(_discamount));
                calculateLowerTotal();
            });

            $("#txtTaxAmount").on("input", function () {
                var _discamount  = getNumVal($("#txtTaxAmount"));
                var _totalAmount = getNumText($(".gridItemTotalAmountInclTax"));
                var _discp       = 0;
                if (_discamount != 0 && _totalAmount != 0) {
                    _discp = _discamount * 100 / _totalAmount;
                }
                $("#txtTax").val(parseFloat(_discp).toFixed(2));
                calculateLowerTotal();
            });

            $("#purchaseOrderSyncAlt").on("click", function (e) {
                e.preventDefault();
                $("#fromDate").datepicker("update", new Date());
                $("#toDate").datepicker("update", new Date());
                getInspectionViewList();
            });
            $("#purchaseOrderFilter").on("click", function (e) {
                e.preventDefault();
                const fromDate = $("#fromDate").val();
                const toDate   = $("#toDate").val();
                getInspectionViewList("", fromDate, toDate);
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
            $("body").on("click", "#pendingInwardGatePassLookUp .getInwardGatePassById", function (e) {
                e.preventDefault();
                $("#pendingInwardGatePassLookUp").modal("hide");
                const inwardGatePassId = $(this).data("inward_gate_pass_id");
                fetchInwardGatePassById(inwardGatePassId);
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

            $(document).on("click", ".getPendingInwardGatePass", function (e) {
                e.preventDefault();
                getPendingInwardGatePass();
            });

            /**
             * * This event working Grid Input Change Rate|Discount Percentage|Discount|Tax
             * */
            // Attach input event listeners for each row
            $("#purchase_table").on("input", "tr input.rate, tr input.discountPercentage, tr input.taxPercentage", function (event) {
                const currentRow            = $(this).closest("tr");
                const gridItemRowCalculator = new GridItemRowCalculator(currentRow, purchaseModuleSettings);
                gridItemRowCalculator.calculate(event, currentRow);
            });
            $("#purchase_table tbody").on("input", "tr td input.rejectedQty,tr td input.rejectedWeight", function (event) {
                event.preventDefault();
                const row = $(this).closest("tr");

                const inwardQty    = parseNumber($(row).find("td.inwardQty").text());
                const inwardWeight = parseNumber($(row).find("td.inwardWeight").text());

                const rejectedQty    = parseNumber($(row).find("td.rejectedQty input.rejectedQty").val());
                const rejectedWeight = parseNumber($(row).find("td.rejectedWeight input.rejectedWeight").val());

                const netQty = parseNumber(inwardQty) - parseNumber(rejectedQty);
                $(row).find("td.qty").text(netQty.toFixed(QTY_ROUNDING));
                if (parseNumber(rejectedQty) > parseNumber(inwardQty)) {
                    _getAlertMessage("Information", "Rejected qty cannot be greater than Inward qty", "info");
                    $(row).find("td.rejectedQty input.rejectedQty").val("");
                    $(row).find("td.qty").text(inwardQty.toFixed(QTY_ROUNDING));
                }

                const netWeight = inwardWeight - rejectedWeight;
                $(row).find("td.weight").text(netWeight.toFixed(WEIGHT_ROUNDING));
                // Validate the rejected weight
                if (parseNumber(rejectedWeight) > parseNumber(inwardWeight)) {
                    _getAlertMessage("Information", "Rejected weight cannot be greater than Inward weight", "info");
                    $(row).find("td.rejectedWeight input.rejectedWeight").val("");
                    $(row).find("td.weight").text(inwardWeight.toFixed(WEIGHT_ROUNDING));
                }
                const gridItemRowCalculator = new GridItemRowCalculator(row, purchaseModuleSettings);
                gridItemRowCalculator.calculate(event, row);
                $("#purchase_table").find("tr").find("td").find("input.rate").trigger("input");
            });

            $("body").on("click", ".btnEditPrevVoucher", function (e) {
                e.preventDefault();
                var inspectionId = parseNumber($(this).data("inspection_id"));
                fetch(inspectionId);
                $("a[href=\"#Main\"]").trigger("click");
            });

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

            $(".btnSave").on("click", async function (e) {
                e.preventDefault();
                await self.initSave();
            });

            $("body").on("click", ".btnPrint", function (e) {
                const inspectionId        = $(this).data("inspection_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(base_url + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(inspectionId, settingPrintDefault, "lg", "");
                }
            });

            $("body").on("click", ".btnPrintA4WithHeader", function (e) {
                const inspectionId = $(this).data("inspection_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(inspectionId, 1, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintA4WithOutHeader", function (e) {
                const inspectionId = $(this).data("inspection_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(inspectionId, 2, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintB5WithHeader", function (e) {
                const inspectionId = $(this).data("inspection_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(inspectionId, 3, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintB5WithOutHeader", function (e) {
                const inspectionId = $(this).data("inspection_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(inspectionId, 4, "lg", "");
                }
            });

            $("body").on("click", ".btnPrintGatePas", function (e) {
                const inspectionId        = $(this).data("inspection_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(base_url + "application/views/reportprints/thermal_pdf.php", "Quotation Voucher", "width=1000, height=842");
                } else {
                    Print_Voucher(inspectionId, settingPrintDefault, "lg", "gatePass");
                }
            });
            $("body").on("click", ".btnPrintASEmail", function (e) {
                const inspectionId        = $(this).data("inspection_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                getSendMail(inspectionId, settingPrintDefault, "lg", "", true);
            });
            $("body").on("click", ".btnDelete", function (e) {
                const inspectionId = $(this).data("inspection_id");
                e.preventDefault();
                if (inspectionId !== "") {
                    _getConfirmMessage("Warning!", "Are you sure to delete this voucher", "warning", function (result) {
                        if (result) {
                            deleteVoucher(inspectionId);
                        }
                    });
                }
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
                $("a[href=\"#party-lookup\"]").get()[0].click();
            });
            shortcut.add("F2", function () {
                $("a[href=\"#item-lookup\"]").get()[0].click();
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

            purchase.fetchRequestedVr();
        },

        // prepares the data to save it into the database
        initSave         : async function () {
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
                await save(getSaveObject());
            } else {
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : "Please add at least one row in the grid to save",
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
                fetch(vrnoa);
            }
        },
        resetVoucher     : function () {
            resetVoucher();
        }
    };

};

var purchase = new Purchase();
purchase.init();
