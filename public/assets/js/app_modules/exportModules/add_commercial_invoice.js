// assets/js/app_modules/purchase/add_sale_order.js
import { AMOUNT_ROUNDING, QTY_ROUNDING, RATE_ROUNDING, WEIGHT_ROUNDING }                                                                                                                                                                                                                                     from "../../../../js/components/GlobalConstants.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, getValueIfDataExists, handlePercentageOrAmountInput, ifNull, parseNumber, setFinancialYearDate, updateDatepickerWithFormattedDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek, updateFormattedDate } from "../commonFunctions/CommonFunction.js";
import { calculateGrossAmountGridItemRow }                                                                                                                                                                                                                                                                   from "../../../../js/components/calculations/calculateGrossAmountGridItemRow.js";
import { calculateRateGridItemRow }                                                                                                                                                                                                                                                                          from "../../../../js/components/calculations/calculateRateGridItemRow.js";
import { calculateRatePerKgGridItemRow }                                                                                                                                                                                                                                                                     from "../../../../js/components/calculations/calculateRatePerKgGridItemRow.js";
import { dropdownOptions }                                                                                                                                                                                                                                                                                   from "../../../../js/components/GlobalUrl.js";
import { propsForTable }                                                                                                                                                                                                                                                                                     from "../commonFunctions/PopulateDataOnVouchers.js";
import { validPercentage }                                                                                                                                                                                                                                                                                   from "../../../../js/components/Helpers.js";
import DynamicOption                                                                                                                                                                                                                                                                                         from "../../../../js/components/DynamicOption.js";
import SaverRequest                                                                                                                                                                                                                                                                                          from "../../../../js/components/SaverRequest.js";
import AlertComponent                                                                                                                                                                                                                                                                                        from "../../../../js/components/AlertComponent.js";
import { makeAjaxRequest }                                                                                                                                                                                                                                                                                   from "../../../../js/components/MakeAjaxRequest.js";
// Instantiate BaseClass
var CommercialInvoice = function () {
    const currencyRateSelector           = "#currencyRate";
    const freightAmountFcySelector       = "#freightAmount";
    const freightAmountLcySelector       = "#freightAmountLcy";
    const freightTypeDropdownSelector    = "#freightTypeDropdown";
    const discountFcySelector            = "#discountFcy";
    const discountAmountFcySelector      = "#discountAmountFcy";
    const expenseFcySelector             = "#expenseFcy";
    const expenseAmountFcySelector       = "#expenseAmountFcy";
    const discountLcySelector            = "#discountLcy";
    const discountAmountLcySelector      = "#discountAmountLcy";
    const expenseLcySelector             = "#expenseLcy";
    const expenseAmountLcySelector       = "#expenseAmountLcy";
    const netAmountFcySelector           = "#txtNetAmountFcy";
    const netAmountLcySelector           = "#txtNetAmountLcy";
    const otherInfoInvoiceNumberSelector = "#otherInfoInvoiceNumber";
    const otherInfoContainerNoSelector   = "#otherInfoContainerNo";
    const otherInfoPaymentTermsSelector  = "#otherInfoPaymentTerm";
    const otherInfoDeliveryTermsSelector = "#otherInfoDeliveryTerm";

    // instance
    const currencyRateInstance           = $(currencyRateSelector);
    const freightAmountFcyInstance       = $(freightAmountFcySelector);
    const freightAmountLcyInstance       = $(freightAmountLcySelector);
    const freightTypeDropdownInstance    = $(freightTypeDropdownSelector);
    const discountFcyInstance            = $(discountFcySelector);
    const discountAmountFcyInstance      = $(discountAmountFcySelector);
    const expenseFcyInstance             = $(expenseFcySelector);
    const expenseAmountFcyInstance       = $(expenseAmountFcySelector);
    const discountLcyInstance            = $(discountLcySelector);
    const discountAmountLcyInstance      = $(discountAmountLcySelector);
    const expenseLcyInstance             = $(expenseLcySelector);
    const expenseAmountLcyInstance       = $(expenseAmountLcySelector);
    const netAmountFcyInstance           = $(netAmountFcySelector);
    const netAmountLcyInstance           = $(netAmountLcySelector);
    const otherInfoInvoiceNumberInstance = $(otherInfoInvoiceNumberSelector);
    const otherInfoContainerNoInstance   = $(otherInfoContainerNoSelector);
    const otherInfoPaymentTermsInstance  = $(otherInfoPaymentTermsSelector);
    const otherInfoDeliveryTermsInstance = $(otherInfoDeliveryTermsSelector);

    const voucherType  = "commercial_invoices";
    const saverRequest = new SaverRequest(base_url, general, {
        requestedUrl      : "commercialInvoice/save",
        requestType       : "POST",
        isConfirmed       : true,
        propsPrintVoucher : function (param) {
            printVoucher(param.id, 1, 1, "", false);
        },
        propsResetVoucher : function (param) {
            resetVoucher();
        }
    });
    var printVoucher   = function (vrnoa, paperSize, printSize, wrate = 0, isSendEmail = false) {
        try {
            const __etype         = voucherType;
            const __vrnoa         = vrnoa;
            const preBalancePrint = 0;
            const __lang          = ($("#print_lang").val()) ? $("#print_lang").val() : 1;
            const __url           = base_url + "/doc/getPrintVoucherPDF/?etype=" + __etype + "&vrnoa=" + __vrnoa + "&pre_bal_print=" + preBalancePrint + "&paperSize=" + paperSize + "&printSize=" + printSize + "&wrate=" + (wrate ? wrate : 0) + "&language_id=" + __lang;
            const _encodeURI      = encodeURI(__url);
            openPrintOnSettingConfiguration(_encodeURI);
        } catch (error) {
            console.error(error);
        }
    };

    const getSendMail = (vrnoa, paperSize, printSize, wrate = 0, email = "") => {
        const __etype         = voucherType;
        const __vrnoa         = vrnoa;
        const preBalancePrint = 0;
        const __lang          = $("#print_lang").val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, preBalancePrint, paperSize, printSize, wrate, __lang, email);
    };

    var getCommercialInvoiceById = async function (commercialInvoiceId) {
        const response = await makeAjaxRequest("GET", `${base_url}/commercialInvoice/getCommercialInvoiceById`, {
            commercialInvoiceId : commercialInvoiceId
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
        $("#commercialInvoiceIdHidden").val(data.id);

        appendSelect2ValueIfDataExists("accountDropdown", "party", "pid", "name", data, { disabled : true });
        $("button.getAccountLookUpRecord").prop("disabled", true);

        $("#packingListNumber").val(getValueIfDataExists(data, "packing_list.vrnoa", null));
        $("#packingListIdHidden").val(getValueIfDataExists(data, "packing_list.id", null));

        appendSelect2ValueIfDataExists("saleOfficerDropdown", "sale_officer", "id", "name", data);
        appendSelect2ValueIfDataExists("portOfDischargeDropdown", "port_of_discharge", "id", "name", data, { disabled : true });
        appendSelect2ValueIfDataExists("gridItemCurrencyDropdown", "currency", "id", "name", data, { disabled : true });
        updateDatepickerWithFormattedDate("current_date", data.vrdate);
        updateDatepickerWithFormattedDate("chk_date", data.vrdate);
        $("#currencyRate").val(data.currency_exchange_rate);

        $("#saleCommissionPercentage").val(data.commission_percentage);
        $("#saleCommissionAmount").val(data.commission_amount);
        $("#customerName").val(data.customer_name);
        $("#customerMobile").val(data.customer_mobile);
        otherInfoInvoiceNumberInstance.val(data.invoice_number);
        otherInfoContainerNoInstance.val(data.container_number);
        otherInfoPaymentTermsInstance.val(data.payment_terms);
        otherInfoDeliveryTermsInstance.val(data.delivery_terms);
        $("#receivers_list").val(data.prepared_by);
        $("#biltyNumber").val(data.bilty_number);
        updateDatepickerWithFormattedDate("biltyDate", data.bilty_date);
        appendSelect2ValueIfDataExists("transporterDropdown", "transporter", "transporter_id", "name", data);
        $("#freightTypeDropdown").val(data.freight_type_id).trigger("change");
        freightAmountFcyInstance.val(parseNumber(data.freight_amount_fcy).toFixed(AMOUNT_ROUNDING));
        freightAmountLcyInstance.val(parseNumber(data.freight_amount_lcy).toFixed(AMOUNT_ROUNDING));
        $.each(data.commercial_invoice_detail, function (index, elem) {
            console.log(elem);
            elem.rate_type.division_factor = elem.division_factor;
            elem.detail_remarks            = ifNull(elem.detail_remarks, "");
            appendToTable(elem);
        });
        discountFcyInstance.val(parseNumber(data.discount_fcy).toFixed(2));
        discountAmountFcyInstance.val(parseNumber(data.discount_amount_fcy).toFixed(AMOUNT_ROUNDING));
        expenseFcyInstance.val(parseNumber(data.expense_fcy).toFixed(2));
        expenseAmountFcyInstance.val(parseNumber(data.expense_amount_fcy).toFixed(AMOUNT_ROUNDING));
        discountLcyInstance.val(parseNumber(data.discount_lcy).toFixed(2));
        discountAmountLcyInstance.val(parseNumber(data.discount_amount_lcy).toFixed(AMOUNT_ROUNDING));
        expenseLcyInstance.val(parseNumber(data.expense_lcy).toFixed(2));
        expenseAmountLcyInstance.val(parseNumber(data.expense_amount_lcy).toFixed(AMOUNT_ROUNDING));
        netAmountFcyInstance.val(parseNumber(data.net_amount_fcy).toFixed(AMOUNT_ROUNDING));
        netAmountLcyInstance.val(parseNumber(data.net_amount_lcy).toFixed(AMOUNT_ROUNDING));
        calculateLowerTotal();
    };

    var getSaveObject = function () {
        const commercialInvoice       = {};
        const commercialInvoiceDetail = [];

        commercialInvoice.id                     = $("#commercialInvoiceIdHidden").val();
        commercialInvoice.vrdate                 = $("#current_date").val();
        commercialInvoice.chk_date               = $("#chk_date").val();
        commercialInvoice.party_id               = $("#accountDropdown").val();
        commercialInvoice.sale_officer_id        = $("#saleOfficerDropdown").val();
        commercialInvoice.packing_list_id        = $("#packingListIdHidden").val();
        commercialInvoice.currency_id            = $("#gridItemCurrencyDropdown").val();
        commercialInvoice.currency_exchange_rate = $("#currencyRate").val();
        commercialInvoice.port_of_discharge_id   = $("#portOfDischargeDropdown").val();
        commercialInvoice.invoice_number         = $("#otherInfoInvoiceNumber").val();
        commercialInvoice.container_number       = $("#otherInfoContainerNo").val();
        commercialInvoice.payment_terms          = $("#otherInfoPaymentTerm").val();
        commercialInvoice.delivery_terms         = $("#otherInfoDeliveryTerm").val();
        commercialInvoice.customer_name          = $("#customerName").val();
        commercialInvoice.customer_mobile        = $("#customerMobile").val();
        commercialInvoice.prepared_by            = $("#receivers_list").val();
        commercialInvoice.commission_percentage  = $("#saleCommissionPercentage").val();
        commercialInvoice.commission_amount      = $("#saleCommissionAmount").val();
        commercialInvoice.bilty_number           = $("#biltyNumber").val();
        commercialInvoice.bilty_date             = $("#biltyDate").val();
        commercialInvoice.transporter_id         = $("#transporterDropdown").val() || null;
        commercialInvoice.freight_amount_fcy     = $("#freightAmount").val() || 0;
        commercialInvoice.freight_amount_lcy     = $("#freightAmountLcy").val() || 0;
        commercialInvoice.freight_amount         = freightAmountLcyInstance.val() || 0;
        commercialInvoice.discount_fcy           = parseNumber(discountFcyInstance.val()) || 0;
        commercialInvoice.discount_amount_fcy    = parseNumber(discountAmountFcyInstance.val()) || 0;
        commercialInvoice.expense_fcy            = parseNumber(expenseFcyInstance.val()) || 0;
        commercialInvoice.expense_amount_fcy     = parseNumber(expenseAmountFcyInstance.val()) || 0;
        commercialInvoice.discount_lcy           = parseNumber(discountLcyInstance.val()) || 0;
        commercialInvoice.discount_amount_lcy    = parseNumber(discountAmountLcyInstance.val()) || 0;
        commercialInvoice.expense_lcy            = parseNumber(expenseLcyInstance.val()) || 0;
        commercialInvoice.expense_amount_lcy     = parseNumber(expenseAmountLcyInstance.val()) || 0;
        commercialInvoice.freight_type_id        = $("#freightTypeDropdown").val() || 0;
        commercialInvoice.net_amount_fcy         = parseNumber(netAmountFcyInstance.val()) || 0;
        commercialInvoice.net_amount_lcy         = parseNumber(netAmountLcyInstance.val()) || 0;
        commercialInvoice.net_amount             = parseNumber(netAmountLcyInstance.val()) || 0;

        $("#commercialInvoiceTable").find("tbody tr").each(function (index, elem) {
            const gridItemDetail                   = {};
            gridItemDetail.item_id                 = $.trim($(elem).find("td.itemName").data("item_id"));
            gridItemDetail.warehouse_id            = $.trim($(elem).find("td.department_id").data("department_id"));
            gridItemDetail.stock_keeping_method_id = $.trim($(elem).find("td.itemName").data("stock_keeping_method_id"));
            gridItemDetail.color_code_id           = $.trim($(elem).find("td.colorCode").data("color_code_id"));
            gridItemDetail.rate_type_id            = $.trim($(elem).find("td.rateTypeName").data("rate_type_id"));
            gridItemDetail.currency_id             = $.trim($(elem).find("td.currencyName").data("currency_id"));
            gridItemDetail.calculation_on          = $.trim($(elem).find("td.rateTypeName").data("calculation_on"));
            gridItemDetail.division_factor         = $.trim($(elem).find("td.rateTypeName").data("division_factor"));
            gridItemDetail.qty                     = $(elem).find("td.qty").text().trim();
            gridItemDetail.weight                  = $(elem).find("td.weight").text().trim();
            gridItemDetail.rate                    = getNumVal($(elem).find("td input.rate"));
            gridItemDetail.rate_fcy                = getNumVal($(elem).find("td input.rateFCY"));
            gridItemDetail.rate_per_kg             = getNumVal($(elem).find("td input.ratePerKG"));
            gridItemDetail.rate_per_kg_fcy         = getNumVal($(elem).find("td input.ratePerKgFCY"));
            gridItemDetail.amount                  = $(elem).find("td.gAmount").text().trim();
            gridItemDetail.amount_fcy              = $(elem).find("td.gAmountFCY").text().trim();
            gridItemDetail.detail_remarks          = $.trim($(elem).find("td.itemName textarea").val());
            commercialInvoiceDetail.push(gridItemDetail);
        });
        const data                   = {};
        data.commercialInvoice       = commercialInvoice;
        data.commercialInvoiceDetail = commercialInvoiceDetail;
        data.id                      = $("#commercialInvoiceIdHidden").val();
        return data;
    };

    // checks for the empty fields
    var validateSave = function () {

        var errorFlag = false;

        var accountDropdown       = $("#accountDropdown");
        var currentDate           = $("#current_date");
        const freightAmount       = $("#freightAmount");
        const transporterDropdown = $("#transporterDropdown");
        const freightTypeDropdown = $("#freightTypeDropdown");
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

    var deleteVoucher         = async function (vrnoa) {
        general.disableSave();
        const response = await makeAjaxRequest("delete", `${base_url}/commercialInvoice/delete`, {
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
    /**
     * Calculate the total of the lower grid
     * @returns {void}
     */
    const calculateLowerTotal = function () {

        let gridItemTotalQty       = 0;
        let gridItemTotalWeight    = 0;
        let gridItemTotalAmountFCY = 0;
        let gridItemTotalAmount    = 0;

        $("#commercialInvoiceTable").find("tbody tr").each(function (index, elem) {
            gridItemTotalQty += getNumText($(this).closest("tr").find("td.qty"));
            gridItemTotalWeight += getNumText($(this).closest("tr").find("td.weight"));
            gridItemTotalAmountFCY += getNumText($(this).closest("tr").find("td.gAmountFCY"));
            gridItemTotalAmount += getNumText($(this).closest("tr").find("td.gAmount"));
        });

        $(".gridItemTotalQty").text(parseNumber(gridItemTotalQty).toFixed(QTY_ROUNDING));
        $(".gridItemTotalWeight").text(parseNumber(gridItemTotalWeight).toFixed(WEIGHT_ROUNDING));
        $(".gridItemTotalGrossAmountFCY").text(parseNumber(gridItemTotalAmountFCY).toFixed(AMOUNT_ROUNDING));
        $(".gridItemTotalGrossAmount").text(parseNumber(gridItemTotalAmount).toFixed(AMOUNT_ROUNDING));
        const discountAmountFcy = parseNumber(discountAmountFcyInstance.val());
        const expenseAmountFcy  = parseNumber(expenseAmountFcyInstance.val());
        const discountAmountLcy = parseNumber(discountAmountLcyInstance.val());
        const expenseAmountLcy  = parseNumber(expenseAmountLcyInstance.val());
        const freightAmountFcy  = parseNumber(freightAmountFcyInstance.val());
        const freightAmountLcy  = parseNumber(freightAmountLcyInstance.val());
        const freightType       = parseNumber(freightTypeDropdownInstance.val());
        let netAmountFcy        = parseNumber(gridItemTotalAmountFCY) - parseNumber(discountAmountFcy) + parseNumber(expenseAmountFcy);
        let netAmountLcy        = parseNumber(gridItemTotalAmount) - parseNumber(discountAmountLcy) + parseNumber(expenseAmountLcy);
        if (freightType === 1) {
            netAmountFcy += freightAmountFcy;
            netAmountLcy += freightAmountLcy;
        }
        console.log(netAmountFcy, "netAmountFcy");
        console.log(netAmountLcy, "netAmountLcy");
        netAmountFcyInstance.val(netAmountFcy.toFixed(AMOUNT_ROUNDING));
        netAmountLcyInstance.val(netAmountLcy.toFixed(AMOUNT_ROUNDING));
    };

    const resetVoucher = function () {
        resetFields();
        getCommercialInvoiceDataTable();
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
            selector : "commercialInvoiceIdHidden",
            options  : { disabled : true }
        }, {
            selector : "packingListNumber",
            options  : { disabled : true }
        }, {
            selector : "packingListIdHidden",
            options  : { disabled : true }
        }, "accountDropdown", "saleOfficerDropdown", "gridItemCurrencyDropdown", "currencyRate", "portOfDischargeDropdown", "current_date", "chk_date", "biltyNumber", "biltyDate", "transporterDropdown", "freightAmount", "freightTypeDropdown", "saleCommissionPercentage", "saleCommissionAmount", "txtNetAmount", "customerName", "customerMobile", "receivers_list", "voucherRemarks"];
        clearValueAndText(resetArray);

        const resetClassArray = ["gridItemTotalQty", "gridItemTotalWeightPerUnit", "gridItemTotalTarePerUnit", "gridItemTotalTare", "gridItemTotalWeight", "gridItemTotalGrossAmount"];
        clearValueAndText(resetClassArray, ".");

        const resetDisabledArray = [{
            selector : "due_days",
            options  : { disabled : true }
        }, {
            selector : "accountDropdown",
            options  : { disabled : true }
        }, {
            selector : "gridItemCurrencyDropdown",
            options  : { disabled : true }
        }, {
            selector : "portOfDischargeDropdown",
            options  : { disabled : true }
        }, {
            selector : "packingListNumber",
            options  : { disabled : true }
        }, {
            selector : "packingListIdHidden",
            options  : { disabled : true }
        }];
        clearValueAndText(resetDisabledArray);

        const resetNewArray = [{
            selector : "freightAmountLcy",
            options  : { disabled : true }
        }, {
            selector : "freightAmount",
            options  : { disabled : false }
        }, {
            selector : "discountFcy",
            options  : { disabled : false }
        }, {
            selector : "discountAmountFcy",
            options  : { disabled : false }
        }, {
            selector : "expenseFcy",
            options  : { disabled : false }
        }, {
            selector : "expenseAmountFcy",
            options  : { disabled : false }
        }, {
            selector : "discountLcy",
            options  : { disabled : true }
        }, {
            selector : "discountAmountLcy",
            options  : { disabled : true }
        }, {
            selector : "expenseLcy",
            options  : { disabled : true }
        }, {
            selector : "expenseAmountLcy",
            options  : { disabled : true }
        }, {
            selector : "txtNetAmountFcy",
            options  : { disabled : true }
        }, {
            selector : "txtNetAmountLcy",
            options  : { disabled : true }
        }, {
            selector : "otherInfoInvoiceNumber",
            options  : { disabled : false }
        }, {
            selector : "otherInfoContainerNo",
            options  : { disabled : false }
        }, {
            selector : "otherInfoPaymentTerm",
            options  : { disabled : false }
        }, {
            selector : "otherInfoDeliveryTerm",
            options  : { disabled : false }
        }];
        clearValueAndText(resetNewArray);

        $(".gridItemTotalGrossAmountFCY").text("");

        $("#freightTypeDropdown").val("0").trigger("change.select2");
        $("#commercialInvoiceTable tbody tr").remove();
        $("#commercialInvoiceTableReport tbody tr").remove();

        $("#party_p").html("");
        $("#otherItemInformation").html("");
    };

    let commercialInvoiceViewList       = undefined;
    const getCommercialInvoiceDataTable = (commercialInvoiceId = 0, fromDate = "", toDate = "") => {
        if (typeof commercialInvoiceViewList !== "undefined") {
            commercialInvoiceViewList.destroy();
            $("#commercialInvoiceViewListTbody").empty();
        }
        commercialInvoiceViewList = $("#commercialInvoiceViewList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url     : `${base_url}/commercialInvoice/getCommercialInvoiceDataTable`,
                type    : "GET",
                data    : {
                    "commercialInvoiceId" : commercialInvoiceId,
                    fromDate              : fromDate,
                    toDate                : toDate
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
                className : "text-left commercialInvoiceVoucher"
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
						<!-- Default dropleft button -->
						<div class="btn-group dropleft">
							<button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								More
							</button>
							<div class="dropdown-menu">
								<a class="dropdown-item btnEditPrevVoucher" data-commercial_invoice_id="${row.id}" href="#"><i class='fa fa-edit'></i> Edit Voucher</a>
                                <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                    <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                    <span class="sr-only">Toggle Dropdown</span>
                                </button>
                                <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                    <li class="dropdown-item"><a href="#" class="btnPrint" data-commercial_invoice_id   ="${row.id}">Print Voucher</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-commercial_invoice_id   ="${row.id}"> Print a4 with header</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-commercial_invoice_id   ="${row.id}"> Print a4 without header </a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-commercial_invoice_id   ="${row.id}"> Print b5 with header</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-commercial_invoice_id   ="${row.id}"> Print b5 without header </a></li>
                                </ul>
								<a class="dropdown-item btnDelete" data-commercial_invoice_id="${row.id}" href="#"><i class='fa fa-trash'></i> Delete Voucher</a>
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" href="#">Send Email</a>
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
        commercialInvoiceViewList.on("draw", function () {
            $("[data-toggle=\"tooltip\"]").tooltip(); // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
    };
    var getSaleCommissionPercentage     = async function (accountId, saleOfficerId) {
        const response = await makeAjaxRequest("GET", `${base_url}/saleOfficerCommissionAllotment/getSaleCommissionPercentage`, {
            accountId     : accountId,
            saleOfficerId : saleOfficerId
        });

        $("#saleCommissionPercentage").val(0);
        if (response.status == true && response.data) {
            $("#saleCommissionPercentage").val(response.data.sale_commission_percentage);
        }
    };

    const appendToTable       = (rowData) => {
        const serialNumber          = $(`#commercialInvoiceTable tbody tr`).length + 1;
        let stockKeepingMethodClass = "";
        let attributes              = "";
        const isStockKeepingMethod  = (parseFloat(rowData.stock_keeping_method_id) === 1);
        if (isStockKeepingMethod) {
            attributes              = "disabled";
            stockKeepingMethodClass = "disabled cursor-not-allowed";
        }
        const row = `
        <tr data-row-id="${propsForTable.userCacheId}" class="odd:bg-white even:bg-slate-50">
        <td class='py-1 px-1 text-md align-middle text-left' data-title='Sr#'>${serialNumber}</td>
        <td class='py-1 px-1 text-md align-middle text-left itemName'
        data-item_id='${rowData.item_details.item_id}'
        data-inventory_validated='${rowData.item_details.inventory_validated}'
        data-short_code='${rowData.item_details.short_code}'
        data-stock_keeping_method_id="${rowData.stock_keeping_method_id}">${rowData.item_details.item_des}
            <span>
                <textarea class="form-control form-input-class  no-resize custom-textarea" placeholder="Enter details related to the row above..." rows="1" data-toggle="tooltip" title="Particulars">${rowData.detail_remarks}</textarea>
            </span>
        </td>
        <td class='py-1 px-1 text-md align-middle text-left currencyName d-none' data-currency_id="${rowData.currency.id}">${rowData.currency.name}</td>
        <td class='py-1 px-1 text-md align-middle text-left colorCode' data-color_code_id="${rowData.color_code.id}">${rowData.color_code.name}</td>
        <td class='py-1 px-1 text-md align-middle rateTypeName' data-rate_type_id="${rowData.rate_type.id}" data-is_multiplier="${rowData.rate_type.is_multiplier && rowData.rate_type.is_multiplier ? rowData.rate_type.is_multiplier : 0}" data-division_factor="${rowData.rate_type.division_factor}" data-calculation_on="${rowData.rate_type.calculation_on}"> ${rowData.rate_type.name}</td>
        <td class='py-1 px-1 text-md align-middle text-left department_id d-none' data-department_id="${rowData.department_details.did}">${rowData.department_details.name}</td>
        <td class='py-1 px-1 text-md align-middle text-right qty'> ${parseNumber(rowData.qty).toFixed(QTY_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right weight'> ${parseNumber(rowData.weight).toFixed(WEIGHT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right rateFCY'>
            <input type='text' class='form-control form-input-class  is_numeric text-right w-20 h-8 float-right rateFCY' value='${parseNumber(rowData.rate_fcy).toFixed(RATE_ROUNDING)}'>
        </td>
        <td class='py-1 px-1 text-md align-middle text-right rate'>
            <input type='text' class='form-control form-input-class  is_numeric text-right w-20 h-8 float-right rate' value='${parseNumber(rowData.rate).toFixed(RATE_ROUNDING)}'>
        </td>
        <td class='py-1 px-1 text-md align-middle text-right ratePerKgFCY'>
            <input type='text' class='form-control form-input-class ${stockKeepingMethodClass}  is_numeric text-right w-20 h-8 float-right ratePerKgFCY' value='${parseNumber(rowData.rate_per_kg_fcy).toFixed(4)}' ${attributes}>
        </td>
        <td class='py-1 px-1 text-md align-middle text-right ratePerKG'>
            <input type='text' class='form-control form-input-class ${stockKeepingMethodClass}  is_numeric text-right w-20 h-8 float-right ratePerKG' value='${parseNumber(rowData.rate_per_kg).toFixed(4)}' ${attributes}>
        </td>
        <td class='py-1 px-1 text-md align-middle text-right gAmountFCY'> ${parseNumber(rowData.amount_fcy).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right gAmount'> ${parseNumber(rowData.amount).toFixed(AMOUNT_ROUNDING)}</td>
    </tr>`;

        $(row).appendTo("#commercialInvoiceTable");
        updateSerialNumbers();
    };
    const updateSerialNumbers = () => {
        // Assuming you want to update serial numbers after adding a row
        $(`commercialInvoiceTable tbody tr`).each((index, tr) => {
            $(tr).find("td").first().text(index + 1);
        });
    };

    let pendingPackingListDataTable      = undefined;
    const getPendingPackingListDataTable = () => {
        if (typeof pendingPackingListDataTable !== "undefined") {
            pendingPackingListDataTable.destroy();
            $("#pendingPackingListDataTableTbody").empty();
        }
        pendingPackingListDataTable = $("#pendingPackingListDataTable").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url     : `${base_url}/packingList/getPendingPackingListDataTable`,
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
                className : "text-left packingListNumber"
            }, {
                data      : "vrdate",
                name      : "vrdate",
                className : "text-left voucherDate",
                render    : function (data, type, row) {
                    return getFormattedDate(data);
                }
            }, {
                data      : "party.name",
                name      : "party.name",
                className : "customerName"
            }, {
                data      : "currency.name",
                name      : "currency.name",
                className : "currencyName"
            }, {
                data      : "port_of_discharge.name",
                name      : "portOfDischarge.name",
                className : "portOfDischargeName"
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
                    return `<button type="button" data-dismiss="modal" class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white mr-2 mb-2 flex-1 populatePendingPackingList" data-vrnoa="${data.id}"><i class='fa fa-edit'></i></button>`;
                }
            }

            ],
            createdRow : function (row, data, dataIndex) {
                $(row).addClass("group odd:bg-white even:bg-slate-50");
                $("td", row).addClass("py-1 px-1 text-md align-middle");
            }
        });
        pendingPackingListDataTable.on("draw", function () {
            $("[data-toggle=\"tooltip\"]").tooltip();
        });
        $("#pendingPackingListDataTableLookUp").modal("show");
    };

    var getPackingListById = async function (packingListId) {
        const response = await makeAjaxRequest("GET", `${base_url}/packingList/getPackingListById`, {
            packingListId : packingListId
        });
        resetFields();
        if (response && response.status === false) {
            AlertComponent.getAlertMessage({
                title     : "Error!",
                "message" : response.message,
                "type"    : "danger"
            });
            resetVoucher();
        } else if (response && response.status === true) {
            populatePackingListData(response.data);
        }
    };

    var populatePackingListData = function (data) {

        $("#packingListIdHidden").val(data.id);
        $("#packingListNumber").val(data.vrnoa);

        appendSelect2ValueIfDataExists("accountDropdown", "party", "pid", "name", data, { disabled : true });
        appendSelect2ValueIfDataExists("saleOfficerDropdown", "sale_officer", "id", "name", data);
        appendSelect2ValueIfDataExists("gridItemCurrencyDropdown", "currency", "id", "name", data, { disabled : true });
        appendSelect2ValueIfDataExists("portOfDischargeDropdown", "port_of_discharge", "id", "name", data, { disabled : true });

        $("#currencyRate").val(parseNumber(data.currency.exchange_rate).toFixed(2));

        $("#customerName").val(data.customer_name);
        $("#customerMobile").val(data.customer_mobile);
        $("#receivers_list").val(data.prepared_by);

        $("#biltyNumber").val(data.bilty_number);
        updateDatepickerWithFormattedDate("biltyDate", data.bilty_date);
        appendSelect2ValueIfDataExists("transporterDropdown", "transporter", "transporter_id", "name", data);
        $("#saleCommissionPercentage").val(data.commission_percentage);
        freightAmountFcyInstance.val(parseNumber(data.freight_amount).toFixed(AMOUNT_ROUNDING));

        $("#freightTypeDropdown").val(data.freight_type_id).trigger("change");
        $.each(data.packing_list_detail, function (index, elem) {
            elem.rate_type.division_factor = elem.division_factor;
            elem.detail_remarks            = ifNull(elem.detail_remarks, "");
            elem.rate_fcy                  = elem.rate;
            appendToTable(elem);
            $("#commercialInvoiceTable").find("tr").find("td").find("input.rateFCY").trigger("input");
        });
        freightAmountFcyInstance.trigger("input");
    };

    const getSpecificClass = (classString, specificClass) => {
        const classes = classString.split(" ");
        return classes.find(cls => cls === specificClass) || null;
    };

    const getValueFromElement = (rowElement, selector, dataAttr = null, isDataAttr = false) => {
        const element = rowElement.find(selector);
        if (element.is("input, select, textarea")) {
            return element.val();
        } else if (isDataAttr && dataAttr) {
            return element.data(dataAttr);
        } else {
            return element.text();
        }
    };

    // Handles local currency rate changes
    const handleRateChange = (rowElement, eventInputClass, rate, divisionFactor, stockKeepingMethodId, currencyRate) => {
        // Convert FCY rate to LCY using the currency rate
        let rateFCY = rate / currencyRate;

        if (getSpecificClass(eventInputClass, "rate")) {
            const ratePerKgFCY = calculateRatePerKgGridItemRow(rateFCY, divisionFactor, stockKeepingMethodId);
            rowElement.find("td.ratePerKgFCY input").val(parseNumber(ratePerKgFCY).toFixed(4));
            rowElement.find("td.rateFCY input").val(parseNumber(rateFCY).toFixed(RATE_ROUNDING));
            const ratePerKgLCY = calculateRatePerKgGridItemRow(rate, divisionFactor, stockKeepingMethodId);
            rowElement.find("td.ratePerKG input").val(parseNumber(ratePerKgLCY).toFixed(4));
        } else if (getSpecificClass(eventInputClass, "ratePerKG")) {
            const gridItemRatePerKg = rowElement.find("td.ratePerKG input");
            const calculatedRate    = calculateRateGridItemRow(gridItemRatePerKg.val(), divisionFactor, stockKeepingMethodId);
            rowElement.find("td.rate input").val(parseNumber(calculatedRate).toFixed(RATE_ROUNDING));
            rateFCY            = calculatedRate / currencyRate;
            rate               = calculatedRate;
            const ratePerKgFCY = calculateRatePerKgGridItemRow(rateFCY, divisionFactor, stockKeepingMethodId);
            rowElement.find("td.ratePerKgFCY input").val(parseNumber(ratePerKgFCY).toFixed(4));
            rowElement.find("td.rateFCY input").val(parseNumber(rateFCY).toFixed(RATE_ROUNDING));
        }
        // Return the latest FCY rate for further processing or use
        return parseNumber(rate);
    };

    // Handles foreign currency rate changes
    const handleForeignRateChange = (rowElement, eventInputClass, rateFCY, divisionFactor, stockKeepingMethodId, currencyRate) => {
        // Convert FCY rate to LCY using the currency rate
        let rateLCY = rateFCY * currencyRate;

        if (getSpecificClass(eventInputClass, "rateFCY")) {
            // Calculate the rate per kilogram in FCY
            const ratePerKgFCY = calculateRatePerKgGridItemRow(rateFCY, divisionFactor, stockKeepingMethodId);
            rowElement.find("td.ratePerKgFCY input").val(parseNumber(ratePerKgFCY).toFixed(4));
            rowElement.find("td.rate input").val(parseNumber(rateLCY).toFixed(RATE_ROUNDING));
            // Update the LCY rate based on the FCY rate
            const ratePerKgLCY = calculateRatePerKgGridItemRow(rateLCY, divisionFactor, stockKeepingMethodId);
            rowElement.find("td.ratePerKG input").val(parseNumber(ratePerKgLCY).toFixed(4));
        } else if (getSpecificClass(eventInputClass, "ratePerKgFCY")) {
            // Calculate the rate in FCY from the rate per Kg FCY value
            const gridItemRatePerKGFCY = rowElement.find("td.ratePerKgFCY input");
            const calculatedRateFCY    = calculateRateGridItemRow(gridItemRatePerKGFCY.val(), divisionFactor, stockKeepingMethodId);
            rowElement.find("td.rateFCY input").val(parseNumber(calculatedRateFCY).toFixed(RATE_ROUNDING));

            // Recalculate the LCY rate from the newly calculated FCY rate
            rateFCY            = calculatedRateFCY;
            rateLCY            = rateFCY * currencyRate;
            const ratePerKgLCY = calculateRatePerKgGridItemRow(rateLCY, divisionFactor, stockKeepingMethodId);
            rowElement.find("td.ratePerKG input").val(parseNumber(ratePerKgLCY).toFixed(4));
            rowElement.find("td.rate input").val(parseNumber(rateLCY).toFixed(RATE_ROUNDING));
        }

        // Return the latest FCY rate for further processing or use
        return parseNumber(rateFCY);
    };
    const handleAmount            = (rowElement, rateLCY, qty, weight, divisionFactor, stockKeepingMethodId) => {
        const grossAmountLCY = calculateGrossAmountGridItemRow(rateLCY, qty, weight, divisionFactor, stockKeepingMethodId);
        rowElement.find("td.gAmount").text(parseNumber(grossAmountLCY).toFixed(AMOUNT_ROUNDING));
        return grossAmountLCY;
    };
    const handleForeignAmount     = (rowElement, rateFCY, qty, weight, divisionFactor, stockKeepingMethodId, currencyRate) => {
        const grossAmountFCY = calculateGrossAmountGridItemRow(rateFCY, qty, weight, divisionFactor, stockKeepingMethodId);
        rowElement.find("td.gAmountFCY").text(parseNumber(grossAmountFCY).toFixed(AMOUNT_ROUNDING));
        return grossAmountFCY;
    };

    return {

        init : function () {
            this.bindUI();
            $(".select2").select2();
            getCommercialInvoiceDataTable();
        },

        bindUI : function () {

            $("[data-toggle=\"tooltip\"]").tooltip({
                placement : "bottom"
            });
            var self = this;
            $("#currencyRate").on("input", function (e) {
                e.preventDefault();
                $("input.rateFCY").trigger("input");
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
             * * This event working Grid Input Change Rate|RateFCY RatePerKGRatePerKgFCY
             * FCY mean foreign Currency
             * */
            // Attach input event listeners for each row
            $("#commercialInvoiceTable").on("input", "tr input.rate, tr input.rateFCY, tr input.ratePerKG, tr input.ratePerKgFCY, tr input.qty, tr input.weight", function (event) {
                const currentRow           = $(this).closest("tr");
                const currencyRate         = parseNumber($("#currencyRate").val());
                const gridRateLCY          = parseNumber(getValueFromElement(currentRow, "td.rate input"));
                const gridRateFCY          = parseNumber(getValueFromElement(currentRow, "td.rateFCY input"));
                const gridQty              = parseNumber(getValueFromElement(currentRow, "td.qty"));
                const gridWeight           = parseNumber(getValueFromElement(currentRow, "td.weight"));
                const stockKeepingMethodId = getValueFromElement(currentRow, "td.rateTypeName", "calculation_on", true);
                const divisionFactor       = {
                    factor        : parseNumber(getValueFromElement(currentRow, "td.rateTypeName", "division_factor", true)),
                    is_multiplier : getValueFromElement(currentRow, "td.rateTypeName", "is_multiplier", true) === "true"
                };

                handleRateChange(currentRow, event.target.getAttribute("class"), gridRateLCY, divisionFactor, stockKeepingMethodId, currencyRate);
                handleForeignRateChange(currentRow, event.target.getAttribute("class"), gridRateFCY, divisionFactor, stockKeepingMethodId, currencyRate);
                const foreignRate = parseNumber(getValueFromElement(currentRow, "td.rateFCY input"));
                handleForeignAmount(currentRow, foreignRate, gridQty, gridWeight, divisionFactor, stockKeepingMethodId);
                const rate = parseNumber(getValueFromElement(currentRow, "td.rate input"));
                handleAmount(currentRow, rate, gridQty, gridWeight, divisionFactor, stockKeepingMethodId);
                calculateLowerTotal();
                freightAmountFcyInstance.trigger("input");
                discountFcyInstance.trigger("input");
                discountLcyInstance.trigger("input");
                expenseFcyInstance.trigger("input");
                expenseLcyInstance.trigger("input");
                $("#saleCommissionPercentage").trigger("input");

            });
            $("#saleCommissionPercentage, #saleCommissionAmount").on("input", function () {
                const totalAmount             = parseNumber($(".gridItemTotalGrossAmount").text());
                const isCalculatingPercentage = $(this).attr("id").includes("Amount");
                handlePercentageOrAmountInput("saleCommissionPercentage", "saleCommissionAmount", totalAmount, isCalculatingPercentage);
                calculateLowerTotal();
            });
            $(document.body).on("change", freightTypeDropdownSelector, function (e) {
                e.preventDefault();
                calculateLowerTotal();
            });
            $(document.body).on("input", freightAmountFcySelector, function (e) {
                e.preventDefault();
                const freightAmountFcy = parseNumber($(this).val());
                const currencyRate     = parseNumber(currencyRateInstance.val());
                const freightAmount    = parseNumber(freightAmountFcy) * parseNumber(currencyRate);
                freightAmountLcyInstance.val(freightAmount.toFixed(AMOUNT_ROUNDING));
                calculateLowerTotal();
            });
            $(`${discountFcySelector}, ${discountAmountFcySelector}, ${expenseFcySelector}, ${expenseAmountFcySelector}`).on("input", function () {
                const totalAmount             = parseNumber($(".gridItemTotalGrossAmountFCY").text());
                const isCalculatingPercentage = $(this).attr("id").includes("Amount");
                debugger;
                if ($(this).is(`${discountFcySelector}, ${discountAmountFcySelector}`)) {
                    handlePercentageOrAmountInput(discountFcySelector, discountAmountFcySelector, totalAmount, isCalculatingPercentage);
                    discountAmountLcyInstance.val(parseNumber(discountAmountFcyInstance.val()) * parseNumber(currencyRateInstance.val()));
                    discountAmountLcyInstance.trigger("input");
                } else if ($(this).is(`${expenseFcySelector}, ${expenseAmountFcySelector}`)) {
                    handlePercentageOrAmountInput(expenseFcySelector, expenseAmountFcySelector, totalAmount, isCalculatingPercentage);
                    expenseAmountLcyInstance.val(parseNumber(expenseAmountFcyInstance.val()) * parseNumber(currencyRateInstance.val()));
                    expenseAmountLcyInstance.trigger("input");
                }
                calculateLowerTotal();
            });
            $(`${discountLcySelector}, ${discountAmountLcySelector}, ${expenseLcySelector}, ${expenseAmountLcySelector}`).on("input", function () {
                const totalAmount             = parseNumber($(".gridItemTotalGrossAmount").text());
                const isCalculatingPercentage = $(this).attr("id").includes("Amount");
                const currencyRate            = parseNumber(currencyRateInstance.val());
                if (parseNumber(discountAmountFcyInstance.val()) === 0 || parseNumber(expenseAmountFcyInstance.val()) === 0) {
                    return;
                }
                if ($(this).is(`${discountLcySelector}, ${discountAmountLcySelector}`)) {
                    handlePercentageOrAmountInput(discountLcySelector, discountAmountLcySelector, totalAmount, isCalculatingPercentage, currencyRate);
                } else if ($(this).is(`${expenseLcySelector}, ${expenseAmountLcySelector}`)) {
                    handlePercentageOrAmountInput(expenseLcySelector, expenseAmountLcySelector, totalAmount, isCalculatingPercentage, currencyRate);
                }
                calculateLowerTotal();
            });
            $("#commercialInvoiceSyncAlt").on("click", function (e) {
                e.preventDefault();
                $("#fromDate").datepicker("update", new Date());
                $("#toDate").datepicker("update", new Date());
                getCommercialInvoiceDataTable();
            });
            $("#commercialInvoiceFilter").on("click", function (e) {
                e.preventDefault();
                const fromDate = $("#fromDate").val();
                const toDate   = $("#toDate").val();
                getCommercialInvoiceDataTable("", fromDate, toDate);
            });
            $(document.body).on("click", ".getItemLookUpRecord", function (e) {
                e.preventDefault();
                getItemLookUpRecord(voucherType, "");
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
                getAccountLookUpRecord(voucherType);
            });

            $("#saleOfficerDropdown").on("change", async function () {
                const accountId = $("#accountDropdown").val();
                await getSaleCommissionPercentage(accountId, $(this).val());
            });
            $("body").on("click", ".btnEditPrevVoucher", function (e) {
                e.preventDefault();
                var commercialInvoiceId = parseNumber($(this).data("commercial_invoice_id"));
                getCommercialInvoiceById(commercialInvoiceId);
                $("a[href=\"#Main\"]").trigger("click");
            });
            $("body").on("click", ".modal-lookup .populatePendingPackingList", async function (e) {
                e.preventDefault();
                const packingListId = parseNumber($(this).data("vrnoa"));
                resetFields();
                await getPackingListById(packingListId);
                calculateLowerTotal();
            });
            $("body").on("click", "#packingListButton", function (event) {
                getPendingPackingListDataTable();
            });
            $(".btnSave").on("click", function (e) {
                e.preventDefault();
                self.initSave();
            });
            $("body").on("click", ".btnPrint", function (e) {
                const commercialInvoiceId = $(this).data("commercial_invoice_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(base_url + "application/views/reportprints/thermal_pdf.php", "Packing Lists Voucher", "width=1000, height=842");
                } else {
                    printVoucher(commercialInvoiceId, settingPrintDefault, "lg", "");
                }
            });

            $("body").on("click", ".btnPrintA4WithHeader", function (e) {
                const commercialInvoiceId = $(this).data("commercial_invoice_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Packing Lists Voucher", "width=1000, height=842");
                } else {
                    printVoucher(commercialInvoiceId, 1, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintA4WithOutHeader", function (e) {
                const commercialInvoiceId = $(this).data("commercial_invoice_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Packing Lists Voucher", "width=1000, height=842");
                } else {
                    printVoucher(commercialInvoiceId, 2, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintB5WithHeader", function (e) {
                const commercialInvoiceId = $(this).data("commercial_invoice_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Packing Lists Voucher", "width=1000, height=842");
                } else {
                    printVoucher(commercialInvoiceId, 3, "lg", "");
                }
            });
            $("body").on("click", ".btnPrintB5WithOutHeader", function (e) {
                const commercialInvoiceId = $(this).data("commercial_invoice_id");
                e.preventDefault();
                if ($("#setting_print_default").val() == 5 || $("#setting_print_default").val() == 6) {
                    window.open(baseURL + "application/views/reportprints/thermal_pdf.php", "Packing Lists Voucher", "width=1000, height=842");
                } else {
                    printVoucher(commercialInvoiceId, 4, "lg", "");
                }
            });

            $("body").on("click", ".btnPrintASEmail", function (e) {
                const commercialInvoiceId = $(this).data("commercial_invoice_id");
                const settingPrintDefault = $("#setting_print_default").val();
                e.preventDefault();
                getSendMail(commercialInvoiceId, settingPrintDefault, "lg", "", true);
            });

            $(".btnReset").on("click", function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $("body").on("click", ".btnDelete", function (e) {
                const commercialInvoiceId = $(this).data("commercial_invoice_id");
                e.preventDefault();
                if (commercialInvoiceId !== "") {
                    _getConfirmMessage("Warning!", "Are you sure to delete this voucher", "warning", function (result) {
                        if (result) {
                            deleteVoucher(commercialInvoiceId);
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

            commercialInvoice.fetchRequestedVr();
        },

        // prepares the data to save it into the database
        initSave         : function () {
            const validateSaveFlag = validateSave();
            const validateDueDate  = validate();
            if (! validateSaveFlag) {
                if (! validateDueDate) {
                    var rowsCount = $("#commercialInvoiceTable").find("tbody tr").length;
                    if (rowsCount > 0) {
                        const saveObj = getSaveObject();
                        const data    = {
                            "commercialInvoice"       : JSON.stringify(saveObj.commercialInvoice),
                            "commercialInvoiceDetail" : JSON.stringify(saveObj.commercialInvoiceDetail),
                            "id"                      : saveObj.id,
                            "chk_date"                : $("#chk_date").val(),
                            "vrdate"                  : $("#cur_date").val()
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
                getCommercialInvoiceById(vrnoa);
            }
        }
    };

};

const commercialInvoice = new CommercialInvoice();
commercialInvoice.init();

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

    new DynamicOption("#gridItemCurrencyDropdown", {
        requestedUrl    : dropdownOptions.getAllCurrency,
        placeholderText : "Choose Currency",
        allowClear      : true
    });

    new DynamicOption("#portOfDischargeDropdown", {
        requestedUrl    : `${base_url}/portOfDischarge/getAllPortOfDischarge`,
        placeholderText : "Choose Port Of Discharge"
    });

    new DynamicOption("#transporterDropdown", {
        requestedUrl    : dropdownOptions.getTransporterAll,
        placeholderText : "Choose Transporter",
        allowClear      : true
    });
});
