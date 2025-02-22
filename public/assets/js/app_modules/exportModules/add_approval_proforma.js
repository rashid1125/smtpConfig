import AlertComponent from "../../../../js/components/AlertComponent.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { AMOUNT_ROUNDING } from "../../../../js/components/GlobalConstants.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { getValueIfDataExists, ifNull, parseNumber, updateFormattedDate } from "../commonFunctions/CommonFunction.js";

const ApprovalProforma = function () {


    let approvalProformaDataTable = undefined;
    const getApprovalProformaDataTable = (fromDate, endDate, accountIds, status) => {
        if (typeof approvalProformaDataTable !== 'undefined') {
            approvalProformaDataTable.destroy();
            $('#approvalProformaDataTableBody').empty();
        }
        approvalProformaDataTable = $("#approvalProformaDataTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/approvalProforma/getApprovalProformaDataTable`,
                data: { fromDate: fromDate, endDate: endDate, accountIds: accountIds, status: status },
            },
            autoWidth: false,
            buttons: true,
            searching: true,
            columns: [
                {
                    data: null,
                    className: "select",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return meta.row + 1;
                    }
                },
                {
                    data: "vrnoa",
                    name: 'vrnoa',
                    className: "vrnoa",
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
                    data: "port_of_discharge.name",
                    name: "portOfDischarge.name",
                    className: "port_of_discharge_name"
                },
                {
                    data: "currency.name",
                    name: "currency.name",
                    className: "currency_name"
                },
                {
                    data: "net_amount",
                    name: "net_amount",
                    className: "text-right net_amount",
                    render: function (data) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: "balance",
                    name: "balance",
                    className: "text-right balance",
                    orderable: false, // Disable ordering as it's a computed column
                    searchable: false, // Disable searching on this column
                    render: function (data) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: "users.name",
                    name: 'users.name',
                    className: "user_name"
                },
                {
                    data: null,
                    className: "select text-right",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-view-proforma"  data-proforma_id="' + row.id + '" data-toggle="tooltip" data-title="View Detail On Modal"><i class="fa fa-eye"></i></button>';
                        if (row.proforma_status.toLocaleLowerCase() === 'pending') {
                            buttons += '<button class="btn btn-sm btn-outline-success group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-update-proforma-approved" data-proforma_id="' + row.id + '" data-toggle="tooltip" data-title="Export proforma approved"><i class="fas fa-check"></i></button>';
                        }

                        if (row.proforma_status.toLocaleLowerCase() === 'approved') {
                            buttons += '<button class="btn btn-sm btn-outline-warning group-hover:bg-yellow-800 group-hover:border-yellow-800 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-update-proforma-pending" data-proforma_id="' + row.id + '" data-toggle="tooltip" data-title="Export proforma unapproved"><i class="fas fa-times-circle"></i></button>';
                        }

                        return buttons;
                    }
                }
            ],
            createdRow: function (row, data, dataIndex) {
                $(row).addClass('group odd:bg-white even:bg-slate-50 py-1 px-1');
                $('td', row).addClass('py-1 px-1 text-md align-middle text-middle');
                $('[data-toggle="tooltip"]', row).tooltip();
            }
        });
    };



    var getExportProformaById = async function (exportProformaId) {
        $('#purchase_table tbody tr').remove();
        const response = await makeAjaxRequest('GET', `${base_url}/exportProforma/getExportProformaById`, {
            exportProformaId: exportProformaId
        });
        populateData(response.data);
    };

    var populateData = function (data) {
        $('#exportProformaModal').modal('show');

        $('#customerName').text(getValueIfDataExists(data, "party.name", null));
        $('#current_date').text(data.vrdate);
        $('#saleOfficerDropdown').text(getValueIfDataExists(data, "sale_officer.name", null));
        $('#gridItemCurrencyDropdown').text(getValueIfDataExists(data, "currency.name", null));
        $('#portOfDischargeDropdown').text(getValueIfDataExists(data, "port_of_discharge.name", null));
        $.each(data.export_proforma_detail, function (index, elem) {
            elem.rate_type.division_factor = elem.division_factor;
            elem.detail_remarks = ifNull(elem.detail_remarks, "");
            appendToTable(elem);
        });
        calculateLowerTotal();
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
        <tr class="odd:bg-white even:bg-slate-50">
        <td class='py-1 px-1 text-md align-middle text-left itemName'
        data-item_id='${rowData.item_details.item_id}'
        data-short_code='${rowData.item_details.short_code}'
        data-stock_keeping_method_id="${rowData.stock_keeping_method_id}">${rowData.item_details.item_des}</td>
        <td class='py-1 px-1 text-md align-middle text-left currencyName d-none' data-currency_id="${rowData.currency.id}">${rowData.currency.name}</td>
        <td class='py-1 px-1 text-md align-middle text-left colorCode' data-color_code_id="${rowData.color_code.id}">${rowData.color_code.name}</td>
        <td class='py-1 px-1 text-md align-middle rateTypeName' data-rate_type_id="${rowData.rate_type.id}" data-is_multiplier="${rowData.rate_type.is_multiplier && rowData.rate_type.is_multiplier ? rowData.rate_type.is_multiplier : 0}" data-division_factor="${rowData.rate_type.division_factor}" data-calculation_on="${rowData.rate_type.calculation_on}"> ${rowData.rate_type.name}</td>
        <td class='py-1 px-1 text-md align-middle text-right qty'> ${parseNumber(rowData.qty).toFixed(QTY_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right weightPerUnit'> ${parseNumber(rowData.weight_per_unit).toFixed(WEIGHT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right tarePerUnit'> ${parseNumber(rowData.tare_per_unit).toFixed(WEIGHT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right totalTare'> ${parseNumber(rowData.tare).toFixed(WEIGHT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right weight'> ${parseNumber(rowData.weight).toFixed(WEIGHT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right rate'>${parseNumber(rowData.rate).toFixed(RATE_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle text-right ratePerKG'>${parseNumber(rowData.rate_per_kg).toFixed(4)}</td>
        <td class='py-1 px-1 text-md align-middle text-right gAmount'> ${parseNumber(rowData.gross_amount).toFixed(AMOUNT_ROUNDING)}</td>
    </tr>`

        $(row).appendTo('#purchase_table');
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

    var updateStatusExportProformaById = async function (exportProformaId, statusText = "") {
        const response = await makeAjaxRequest('POST', `${base_url}/approvalProforma/updateStatusExportProformaById`, {
            exportProformaId: exportProformaId,
            statusText: statusText
        });

        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: "Error!", "message": response.message, "type": "danger" });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: "Warning!", "message": response.message, "type": "warning" });
        } else {
            approvalProformaDataTable.ajax.reload();
        }
    };
    return {

        init: function () {
            this.bindUI();
            $('.select2').select2();
        },

        bindUI: function () {
            const self = this;
            $('[data-toggle="tooltip"]').tooltip();
            $(document.body).on('click', '#btnSearch', function (e) {
                e.preventDefault();
                const $fromDate = $('#from_date').val();
                const $toDate = $('#to_date').val();
                const $accountIds = $('#accountDropdown').val();
                const $status = $('input[name="orderType"]:checked').val() || null;
                getApprovalProformaDataTable($fromDate, $toDate, $accountIds, $status);
            });
            $(document.body).on('click', '.btn-view-proforma', function (e) {
                e.preventDefault();
                const $proformaId = $(this).data('proforma_id');
                getExportProformaById($proformaId);
            });
            $(document.body).on('click', '.btn-update-proforma-approved', function (e) {
                e.preventDefault();
                const $proformaId = $(this).data('proforma_id');
                updateStatusExportProformaById($proformaId, 'approved');
            });
            $(document.body).on('click', '.btn-update-proforma-pending', function (e) {
                e.preventDefault();
                const $proformaId = $(this).data('proforma_id');
                updateStatusExportProformaById($proformaId, 'pending');
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
        },
    };

};

const approvalProforma = new ApprovalProforma();
approvalProforma.init();

$(function () {
    new DynamicOption("#accountDropdown", {
        requestedUrl: dropdownOptions.getAllCustomerLevelAccount,
        placeholderText: "Choose Account",
        allowClear: true,
    });
});
