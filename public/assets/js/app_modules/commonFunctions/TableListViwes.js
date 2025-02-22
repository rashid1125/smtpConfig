"use strict";
import { brandApiEndpoints, customerApiEndpoints } from "../../../../js/components/GlobalUrl.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";
import BaseClass from "../../../../js/components/BaseClass.js";
import { getValueIfDataExists, updateFormattedDate } from "./CommonFunction.js";

const baseInstance = new BaseClass();

let pendingPurchaseOrderTable = undefined;
const getPendingPurchaseOrder = () => {
    if (typeof pendingPurchaseOrderTable !== 'undefined') {
        pendingPurchaseOrderTable.destroy();
        $('#pendingPurchaseOrderTableTbody').empty();
    }
    pendingPurchaseOrderTable = $("#pendingPurchaseOrderTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: `${base_url}/purchaseorder/getPendingPOComparePurchaseDT`,
            type: 'GET',
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
                data: "purchaseOrderVoucher",
                name: "po.vrnoa",
                className: "text-left purchaseOrderVoucher"
            },
            {
                data: "voucherDate",
                name: "po.vrdate",
                className: "text-left voucherDate",
                render: function (data, type, row) {
                    return getFormattedDate(data);
                }
            },
            { data: "supplierName", name: 'parties.name', className: "supplierName" },
            { data: "itemName", name: 'items.item_des', className: "itemName" },
            {
                searchable: false,
                data: "remaining_qty",
                name: 'remainingQty',
                className: "text-right remaining_qty",
                render: function (data, type, row) {
                    return parseNumber(data).toFixed(2);
                }
            },
            {
                searchable: false, data: "remaining_weight", name: 'remainingWeight', className: "text-right remaining_weight", render: function (data, type, row) {
                    return parseNumber(data).toFixed(2);
                }
            },
            {
                data: "itemRate", name: 'pod.rate', className: "text-right itemRate", render: function (data, type, row) {
                    return parseNumber(data).toFixed(2);
                }
            },
            {
                data: null,
                className: "select text-right",
                searchable: false,
                orderable: false,
                render: function (data, type, row) {
                    return `<button type="button" data-dismiss="modal" class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white mr-2 mb-2 flex-1 populatePendingPurchaseOrder" data-vrnoa="${data.purchaseOrderId}"><i class='fa fa-edit'></i></button>`;
                }
            }

        ],
        createdRow: function (row, data, dataIndex) {
            $(row).addClass('group odd:bg-white even:bg-slate-50');
            $('td', row).addClass('py-1 px-1 text-md align-middle');
        }
    });
    // Reinitialize tooltips on table redraw
    pendingPurchaseOrderTable.on('draw', function () {
        $('[data-toggle="tooltip"]').tooltip(); // For Bootstrap 4
        // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
    });
    $('#pendingPurchaseOrderLookUp').modal('show');
};

let pendingInwardGatePassTable = undefined;
const getPendingInwardGatePass = (vrnoa = 0) => {
    baseInstance.runException(() => {
        if (typeof pendingInwardGatePassTable !== 'undefined') {
            pendingInwardGatePassTable.destroy();
            $('#pendingInwardGatePassTableTbody').empty();
        }
        pendingInwardGatePassTable = $("#pendingInwardGatePassTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: base_url + '/inward/getPendingInwardComparePurchase',
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
                    className: "inwardGatePassVoucher"
                },
                {
                    data: "vrdate",
                    name: "vrdate",
                    className: "voucherDate",
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
                    data: "purchase_order",
                    name: "purchaseOrder.vrnoa",
                    className: "purchaseOrderVoucher",
                    render: function (data, type, row) {
                        return getValueIfDataExists(row, "purchase_order.vrnoa", "Not Available");
                    }
                },
                {
                    data: "purchase_order.vrdate",
                    name: "purchaseOrder.vrdate",
                    className: "purchaseOrderVoucherDate",
                    render: function (data, type, row) {
                        return updateFormattedDate(getValueIfDataExists(row, "purchase_order.vrdate", "Not Available"));
                    }
                },
                {
                    data: null,
                    className: "select",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        return `<button type="button" data-dismiss="modal" class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white mr-2 mb-2 flex-1 populatePendingInwardGatePass" data-vrnoa="${data.id}"><i class='fa fa-edit'></i></button>`;
                    }
                }
            ],
            createdRow: function (row, data, dataIndex) {
                $(row).addClass('group hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50');
                $('td', row).addClass('py-1 px-1 text-md align-middle');
            }
        });
        $('#pendingInwardGatePassLookupModal').modal('show');
    });
};


let pendingInspectionTable = undefined;
const getPendingInspection = (vrnoa = 0) => {
    if (typeof pendingInspectionTable !== 'undefined') {
        pendingInspectionTable.destroy();
        $('#pendingInspectionTableTbody').empty();
    }
    pendingInspectionTable = $("#pendingInspectionTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: base_url + '/inspection/getPendingInspection',
            type: 'GET',
            data: { 'vrnoa': vrnoa },
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
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: "vrnoa",
                name: "vrnoa",
                className: "inspectionVoucher"
            },
            {
                data: "vrdate",
                name: "vrdate",
                className: "voucherDate",
                render: function (data) {
                    return getFormattedDate(data);
                }
            },
            {
                data: "party.name",
                name: "party.name",
                className: "supplierName"
            },
            {
                data: "inward_gate_pass.vrnoa",
                name: "inwardGatePass.vrnoa",
                className: "inwardVoucher"
            },
            {
                data: "inward_gate_pass.vrdate",
                name: "inwardGatePass.vrdate",
                className: "inwardVoucherDate",
                render: function (data) {
                    return getFormattedDate(data);
                }
            },
            {
                data: null,
                className: "select",
                searchable: false,
                orderable: false,
                render: function (data, type, row) {
                    return `<button type="button" data-dismiss="modal" class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white mr-2 mb-2 flex-1  populatePendingInspection" data-vrnoa="${data.id}"><i class='fa fa-edit'></i></button>`;
                }
            }
        ],
        createdRow: function (row, data, dataIndex) {
            $(row).addClass('group hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50');
            $('td', row).addClass('py-1 px-1 text-md align-middle');
        }
    });
    $('#pendingInspectionLookupModal').modal('show');
};

let purchaseDataTable = undefined;
const getPurchaseDataTable = (purchaseId = 0, fromDate = "", toDate = "") => {
    if (typeof purchaseDataTable !== 'undefined') {
        purchaseDataTable.destroy();
        $('#purchaseDataTableTbody').empty();
    }
    purchaseDataTable = $("#purchaseDataTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: `${base_url}/purchase/getPurchaseDataTable`,
            type: 'GET',
            data: { 'purchaseId': purchaseId, fromDate: fromDate, toDate: toDate },
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
                className: "text-left purchaseOrderVoucher"
            },
            {
                data: "vrdate",
                name: "vrdate",
                className: "text-left voucherDate",
                render: function (data, type, row) {
                    return getFormattedDate(data);
                }
            },
            { data: "party.name", name: 'party.name', className: "supplierName" },
            {
                data: "discount_percentage", name: 'discount_percentage', className: "text-right discount_percentage",
                render: function (data, type, row) {
                    return parseNumber(data).toFixed(2);
                }
            },
            {
                data: "expense_percentage", name: 'expense_percentage', className: "text-right expense_percentage", render: function (data, type, row) {
                    return parseNumber(data).toFixed(2);
                }
            },
            {
                data: "further_tax_percentage", name: 'further_tax_percentage', className: "text-right further_tax_percentage", render: function (data, type, row) {
                    return parseNumber(data).toFixed(2);
                }
            },
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
              <a class="dropdown-item btnEditPrevVoucher" data-purchase_id="${row.id}" href="#"><i class='fa fa-edit'></i> Edit Voucher</a>

              <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
              <span class="caret"><i class="fa fa-print"></i> Print Options</span>
              <span class="sr-only">Toggle Dropdown</span>
              </button>
                <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                    <li class="dropdown-item"><a href="#" class="btnPrint" data-purchase_id   ="${row.id}">Print Voucher</a></li>
                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-purchase_id   ="${row.id}"> Print a4 with header</a></li>
                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-purchase_id   ="${row.id}"> Print a4 without header </a></li>
                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-purchase_id   ="${row.id}"> Print b5 with header</a></li>
                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-purchase_id   ="${row.id}"> Print b5 without header </a></li>
                </ul>

              <a class="dropdown-item btnDelete" data-purchase_id="${row.id}" href="#"><i class='fa fa-trash'></i> Delete Voucher</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Send Email</a>
            </div>
          </div>

          `;

                }
            }

        ],
        createdRow: function (row, data, dataIndex) {
            $(row).addClass('group odd:bg-white even:bg-slate-50');
            $('td', row).addClass('py-1 px-1 text-md align-middle');
        }
    });
    // Reinitialize tooltips on table redraw
    purchaseDataTable.on('draw', function () {
        $('[data-toggle="tooltip"]').tooltip(); // For Bootstrap 4
        // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
    });
};

let pendingChequeInHandTable = undefined;
const getPendingChequeInHand = (pid = null, chequeListNumber = null) => {
    if (pendingChequeInHandTable !== undefined) {
        pendingChequeInHandTable.destroy();
        $('#pendingChequeInHandTableTbody').empty();
    }
    pendingChequeInHandTable = $("#pendingChequeInHandTable").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: base_url + '/chequeReceive/getPendingChequeInHand',
            type: 'GET',
            data: { 'party_id': pid, 'cheque_list_number': chequeListNumber },
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
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: "cheque_list_number",
                name: "cheque_list_number",
                className: "chequeListNumber text-nowrap"
            },
            {
                data: "cheque_no",
                name: "cheque_no",
                className: "chequeNumber text-nowrap"
            },
            {
                data: "cheque_vrdate",
                name: "cheque_vrdate",
                className: "vrdate text-nowrap",
                render: function (data) {
                    return getFormattedDate(data);
                }
            },
            {
                data: "accountName",
                name: "accountName",
                className: "ReceiverName"
            },
            {
                data: "chequeInHandName",
                name: "chequeInHandName",
                className: "ChequeInHandName"
            },
            {
                data: "totalChequeAmount",
                name: "totalChequeAmount",
                className: "text-right totalChequeAmount text-nowrap"
            },
            {
                data: "totalReceivedAmount",
                name: "totalReceivedAmount",
                className: "text-right totalReceivedAmount text-nowrap",
            },
            {
                data: "totalPendingAmount",
                name: "totalPendingAmount",
                className: "text-right totalPendingAmount text-nowrap"
            },
            {
                data: null,
                className: "select",
                searchable: false,
                orderable: false,
                render: function (data, type, row) {
                    return `<button type="button" data-dismiss="modal" class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white mr-2 mb-2 flex-1  populatePendingChequeInHand"><i class='fa fa-edit'></i></button>`;
                }
            }
        ],
        createdRow: function (row, data, dataIndex) {
            $(row).addClass('py-2 px-2 text-md group hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50');
            $('td', row).addClass('py-2 px-2 text-md align-middle');
        },
    });
    $('#pendingChequeInHandLookupModal').modal('show');
};


export {
    getPendingPurchaseOrder,
    getPendingInwardGatePass,
    getPendingInspection,
    getPurchaseDataTable,
    getPendingChequeInHand
};
