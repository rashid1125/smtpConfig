"use strict";

import BaseClass from "../../../../js/components/BaseClass.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import TableRowAppended from "../../../../js/components/TableRowAppended.js";
import { appendSelect2ValueIfDataExists, getValueIfDataExists, ifNull, updateDatepickerWithFormattedDate } from "./CommonFunction.js";
let propsForTable = {
    userCacheId: uuidv4(),
    actionButton: "",
    isDepartmentDisplay: true
};
const baseInstance = new BaseClass();
const getPurchaseOrderId = async (purchaseOrderId) => {
    await baseInstance.runException(async () => {
        const sendingData = {
            'purchaseOrderId': purchaseOrderId
        };
        const response = await makeAjaxRequest('GET', `${base_url}/purchaseorder/getPendingPOComparePurchaseById`, sendingData);
        if (response.status == false && response.error !== "") {
            _getAlertMessage('Error!', response.message, 'danger');
        } else if (response.status == false && response.message !== "") {
            _getAlertMessage('Information!', response.message, 'info');
            resetVoucher();
        } else {
            populatePurchaseOrderData(response.data);
        }
    });
};

var populatePurchaseOrderData = function (purchaseOrderData) {
    baseInstance.runException(() => {
        const data = purchaseOrderData[0];
        $('#purchaseOrderIdHidden').val(data.purchase_order_id);
        $('#purchaseOrderVrnoa').val(data.vrnoa);
        triggerAndRenderOptions($('#accountDropdown'), data.party_name, data.party_id, false);
        triggerAndRenderOptions($('#purchaseOfficerDropdown'), data.purchaseOfficer_name, data.purchaseOfficer_id, false);

        $('#supplierName').val(data.supplier_name);
        $('#supplierMobile').val(data.supplier_mobile);
        $('#receivers_list').val(data.prepared_by);

        $('#txtDiscount').val(parseNumber(data.main_discount_percentage).toFixed(2));
        $('#txtDiscAmount').val(parseNumber(data.main_discount_amount).toFixed(AMOUNT_ROUNDING));
        $('#txtExpense').val(parseNumber(data.main_expense_percentage).toFixed(2));
        $('#txtExpAmount').val(parseNumber(data.main_expense_amount).toFixed(AMOUNT_ROUNDING));
        $('#txtTax').val(parseNumber(data.main_further_tax_percentage).toFixed(2));
        $('#txtTaxAmount').val(parseNumber(data.main_further_tax_amount).toFixed(AMOUNT_ROUNDING));
        $('#freightAmount').val(parseNumber(data.main_freight_amount).toFixed(AMOUNT_ROUNDING));
        $('#txtNetAmount').val(parseNumber(data.main_net_amount).toFixed(AMOUNT_ROUNDING));

        const tableAppender = new TableRowAppended('#purchase_table', propsForTable);

        $.each(purchaseOrderData, function (index, elem) {
            const rowElem = {
                item_details: {
                    item_id: elem.item_id,
                    item_des: elem.item_des,
                    short_code: elem.short_code
                },
                stock_keeping_method_id: elem.stock_keeping_method_id,
                qty: elem.qty,
                weight: elem.weight,
                rate: elem.rate,
                rate_type: {
                    id: elem.icmId,
                    name: elem.icmName,
                    division_factor: elem.icmDivisionFactor
                },
                rate_per_kg: elem.rate_per_kg,
                gross_amount: elem.gross_amount,
                discount_percentage: elem.discount_percentage,
                discount_per_unit: elem.discount_per_unit,
                discount_amount: elem.discount_amount,
                rate_per_unit: elem.rate_per_unit,
                amount_excl_tax: elem.amount_excl_tax,
                tax_percentage: elem.tax_percentage,
                tax_amount: elem.tax_amount,
                amount_incl_tax: elem.amount_incl_tax,
                detail_remarks: ifNull(elem.detail_remarks, ""),
                department_details: {
                    did: elem.did,
                    name: elem.departmentName
                }
            };
            tableAppender.appendRow(rowElem);
        });
        $('#purchase_table').find('tr').find('td').find('input.rate').trigger('input');
    });
};


var getInwardGatePassId = function (inwardGatePassId) {
    $.ajax({
        url: `${base_url}/inward/fetch`,
        type: 'GET',
        data: { 'inwardGatePassId': inwardGatePassId },
        dataType: 'JSON',
        success: function (response) {
            if (response.status == false && response.error !== "") {
                _getAlertMessage('Error!', response.message, 'danger');
            } else if (response.status == false && response.message !== "") {
                _getAlertMessage('Information!', response.message, 'info');
                resetVoucher();
            } else {
                populateInwardGatePassData(response.data);
            }
        }, error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
};

var populateInwardGatePassData = function (data) {

    $('#inwardGatePassIdHidden').val(data.id);
    $('#inwardGatePassVrnoa').val(data.vrnoa);

    $('#purchaseOrderIdHidden').val(getValueIfDataExists(data, "purchase_order.id", ""));
    $('#purchaseOrderVrnoa').val(getValueIfDataExists(data, "purchase_order.vrnoa", ""));

    updateDatepickerWithFormattedDate('due_date', data.due_date);
    $('#due_days').val(getValueIfDataExists(data, "due_days", ""));
    updateDatepickerWithFormattedDate('biltyDate', data.bilty_date);

    appendSelect2ValueIfDataExists("accountDropdown", "party", "pid", "name", data, { disabled: true });
    appendSelect2ValueIfDataExists("purchaseOfficerDropdown", "purchase_officer", "id", "name", data, { disabled: true });

    $('#supplierName').val(data.supplier_name);
    $('#supplierMobile').val(data.supplier_mobile);
    $('#receivers_list').val(data.prepared_by);
    $('#biltyNumber').val(data.bilty_number);

    appendSelect2ValueIfDataExists("transporterDropdown", "transporter", "transporter_id", "name", data);

    $('#txtDiscount').val(parseNumber(data.discount_percentage).toFixed(2));
    $('#txtDiscAmount').val(parseNumber(data.discount_amount).toFixed(AMOUNT_ROUNDING));
    $('#txtExpense').val(parseNumber(data.expense_percentage).toFixed(2));
    $('#txtExpAmount').val(parseNumber(data.expense_amount).toFixed(AMOUNT_ROUNDING));
    $('#txtTax').val(parseNumber(data.further_tax_percentage).toFixed(2));
    $('#txtTaxAmount').val(parseNumber(data.further_tax_amount).toFixed(AMOUNT_ROUNDING));
    $('#freightAmount').val(parseNumber(data.freight_amount).toFixed(AMOUNT_ROUNDING));
    $('#txtNetAmount').val(parseNumber(data.net_amount).toFixed(AMOUNT_ROUNDING));

    $('#freightTypeDropdown').val(data.freight_type_id).trigger('change.select2');
    propsForTable.actionButton = 'd-none';
    const tableAppender = new TableRowAppended('#purchase_table', propsForTable);
    $.each(data.inward_gate_pass_details, function (index, elem) {
        elem.department_details = elem.inward_department;
        elem.detail_remarks = ifNull(elem.detail_remarks, "");
        tableAppender.appendRow(elem);
        $('#purchase_table').find('tr').find('td').find('input.rate').trigger('input');
    });
    $('#due_days').trigger('input');
};

const getInspectionId = function (inspectionId) {
    $.ajax({
        url: `${base_url}/inspection/fetch`,
        type: 'GET',
        data: { 'inspectionId': inspectionId },
        dataType: 'JSON',
        success: function (response) {
            if (response.status == false && response.error !== "") {
                _getAlertMessage('Error!', response.message, 'danger');
            } else if (response.status == false && response.message !== "") {
                _getAlertMessage('Information!', response.message, 'info');
                resetVoucher();
            } else {
                populateInspectionData(response.data);
            }
        }, error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
};

var populateInspectionData = function (data) {


    $('#inspectionIdHidden').val(data.id);
    $('#inspectionVrnoa').val(data.vrnoa);


    $('#inwardGatePassIdHidden').val(data.inward_gate_pass.id);
    $('#inwardGatePassVrnoa').val(data.inward_gate_pass.vrnoa);

    $('#purchaseOrderIdHidden').val(getValueIfDataExists(data, "inward_gate_pass.purchase_order.id", ""));
    $('#purchaseOrderVrnoa').val(getValueIfDataExists(data, "inward_gate_pass.purchase_order.vrnoa", ""));

    updateDatepickerWithFormattedDate('due_date', data.due_date);
    updateDatepickerWithFormattedDate('biltyDate', data.bilty_date);

    appendSelect2ValueIfDataExists('accountDropdown', "party", "pid", "name", data, { disabled: true, triggerChange: true });
    appendSelect2ValueIfDataExists('purchaseOfficerDropdown', "purchase_officer", "id", "name", data, { disabled: true });

    $('#due_days').val(data.due_days);
    $('#supplierName').val(data.supplier_name);
    $('#supplierMobile').val(data.supplier_mobile);
    $('#receivers_list').val(data.prepared_by);
    $('#biltyNumber').val(data.bilty_number);

    appendSelect2ValueIfDataExists("transporterDropdown", "transporter", "transporter_id", "name", data);

    $('#txtDiscount').val(parseNumber(data.discount_percentage).toFixed(2));
    $('#txtDiscAmount').val(parseNumber(data.discount_amount).toFixed(AMOUNT_ROUNDING));
    $('#txtExpense').val(parseNumber(data.expense_percentage).toFixed(2));
    $('#txtExpAmount').val(parseNumber(data.expense_amount).toFixed(AMOUNT_ROUNDING));
    $('#txtTax').val(parseNumber(data.further_tax_percentage).toFixed(2));
    $('#txtTaxAmount').val(parseNumber(data.further_tax_amount).toFixed(AMOUNT_ROUNDING));
    $('#freightAmount').val(parseNumber(data.freight_amount).toFixed(AMOUNT_ROUNDING));
    $('#txtNetAmount').val(parseNumber(data.net_amount).toFixed(AMOUNT_ROUNDING));

    $('#freightTypeDropdown').val(data.freight_type_id).trigger('change.select2');
    propsForTable.actionButton = 'd-none';
    const tableAppender = new TableRowAppended('#purchase_table', propsForTable);
    $.each(data.inspection_detail, function (index, elem) {
        elem.rate_type.division_factor = elem.rate_type.division_by;
        elem.detail_remarks = ifNull(elem.detail_remarks, "");
        tableAppender.appendRow(elem);
        $('#purchase_table').find('tr').find('td').find('input.rate').trigger('input');
    });
    $('#due_days').trigger('input');
};



export {
    getPurchaseOrderId,
    getInwardGatePassId,
    getInspectionId,
    propsForTable
};
