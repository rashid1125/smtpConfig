// assets/js/app_modules/purchase/add_sale_order.js
import { AMOUNT_ROUNDING, QTY_ROUNDING, RATE_ROUNDING, WEIGHT_ROUNDING } from "../../../../js/components/GlobalConstants.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, isPositive, parseNumber, setFinancialYearDate, updateDatepickerWithFormattedDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek, updateFormattedDate } from "../commonFunctions/CommonFunction.js";
import { calculateGrossAmountGridItemRow } from "../../../../js/components/calculations/calculateGrossAmountGridItemRow.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import SaverRequest from "../../../../js/components/SaverRequest.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { StockInformation } from "../../../../js/components/StockInformation.js";
import { InventoryManager } from "../../../../js/components/InventoryManager.js";

// Instantiate BaseClass
const StockTransfer = function () {
    const voucherType = 'stock_transfers';
    const baseUrl = base_url;
    const domElement = {
        stockTransferHiddenId: $('#stockTransferHiddenId'),
        currentDate: $('#current_date'),
        remarks: $('#remarks'),
        gridItemShortCodeDropdown: $('#gridItemShortCodeDropdown'),
        gridItemNameDropdown: $('#gridItemNameDropdown'),
        isInventoryValidated: $('#inventoryValidated'),
        stockKeepingMethodId: $('#stockKeepingMethodId'),
        gridItemColorCodeDropdown: $('#gridItemColorCodeDropdown'),
        gridItemQty: $('#gridItemQty'),
        gridItemWeight: $('#gridItemWeight'),
        gridItemFromLocation: $('#gridItemFromLocation'),
        gridItemToLocation: $('#gridItemToLocation'),
        gridItemRemarks: $('#txtGridRemarks'),
        gridItemTotalQty: $('.gridItemTotalQty'),
        gridItemTotalWeight: $('.gridItemTotalWeight'),
        gridItemTotalGrossAmount: $('.gridItemTotalGrossAmount')
    };

    const saverRequest = new SaverRequest(
        baseUrl,
        general,
        {
            requestedUrl: 'stockTransfer/save',
            requestType: 'POST',
            isConfirmed: true,
            propsPrintVoucher: function (param) {
                printVoucher(param.id, 1, 1, '', false);
            },
            propsResetVoucher: function (param) {
                resetVoucher();
            },
        }
    );
    var printVoucher = function (vrnoa, paperSize, printSize, wrate = 0, isSendEmail = false) {
        try {
            const previousBalance = 0;
            const __lang = ($('#print_lang').val()) ? $('#print_lang').val() : 1;
            const __url = baseUrl + '/doc/getPrintVoucherPDF/?etype=' + voucherType + '&vrnoa=' + vrnoa + '&pre_bal_print=' + previousBalance + '&paperSize=' + paperSize + '&printSize=' + printSize + '&wrate=' + (wrate ? wrate : 0) + '&language_id=' + __lang;
            const _encodeURI = encodeURI(__url);
            openPrintOnSettingConfiguration(_encodeURI);
        } catch (error) {
            console.error(error);
        }
    };

    const getSendMail = (vrnoa, paperSize, printSize, wrate = 0, email = "") => {
        const __etype = 'sale_orders';
        const __vrnoa = vrnoa;
        const __pre_bal_print = 0;
        const __lang = $('#print_lang').val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, __pre_bal_print, paperSize, printSize, wrate, __lang, email);
    };

    var getStockTransferById = async function (stockTransferId) {
        const response = await makeAjaxRequest('GET', `${baseUrl}/stockTransfer/getStockTransferById`, {
            stockTransferId: stockTransferId
        });
        resetFields();
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: "Error!", "message": response.message, "type": "danger" });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: "Warning!", "message": response.message, "type": "warning" });
        } else {
            populateData(response.data);
        }
    };

    var populateData = function (data) {
        $('#stockTransferHiddenId').val(data.id);
        updateDatepickerWithFormattedDate('current_date', data.vrdate);
        updateDatepickerWithFormattedDate('chk_date', data.vrdate);

        $('#remarks').val(data.remarks);
        $('#receivedBy').val(data.received_by);
        $.each(data.stock_transfer_detail, function (index, elem) {
            appendToTable(
                elem.item_details.item_id,
                elem.item_details.short_code,
                elem.item_details.item_des,
                elem.stock_keeping_method_id,
                elem.item_details.inventory_validated,
                elem.color_code.id,
                elem.color_code.name,
                elem.qty,
                elem.weight,
                elem.from_location.did,
                elem.from_location.name,
                elem.to_location.did,
                elem.to_location.name,
                elem.detail_remarks
            );
        });
        calculateLowerTotal();
    };

    const validateSingleProductAdd = () => {
        let hasError = false;
        let errorMessage = '';

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        const itemId = parseNumber($(domElement.gridItemNameDropdown).val());
        const fromLocationId = parseNumber($(domElement.gridItemFromLocation).val());
        const toLocationId = parseNumber($(domElement.gridItemToLocation).val());

        if (!itemId) {
            $('#select2-gridItemNameDropdown-container').parent().addClass('inputerror');
            errorMessage += `Item is required <br />`;
            hasError = true;
        }

        if (!fromLocationId) {
            $('#select2-gridItemFromLocation-container').parent().addClass('inputerror');
            errorMessage += `From Location is required <br />`;
            hasError = true;
        }

        if (!toLocationId) {
            $('#select2-gridItemToLocation-container').parent().addClass('inputerror');
            errorMessage += `To Location is required <br />`;
            hasError = true;
        }

        if (fromLocationId && fromLocationId == toLocationId) {
            errorMessage += `Both Location are cannot be same <br />`;
            hasError = true;
        }

        if (itemId > 0) {
            const validateNumericInput = (value, fieldId, fieldName) => {
                const parsedValue = parseNumber(value);
                if (isNaN(parsedValue) || parsedValue <= 0) {
                    $(fieldId).addClass('inputerror');
                    errorMessage += `${fieldName} is required and must be a positive number.<br />`;
                    hasError = true;
                }
            };

            const stockKeepingMethodIdValue = parseNumber($('#stockKeepingMethodId').val());
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
        }

        if (hasError) {
            return errorMessage;
        }
        return null;
    };

    var getSaveObject = function () {
        const stockTransfer = {};
        const stockTransferDetail = [];

        stockTransfer.id = $('#stockTransferHiddenId').val();
        stockTransfer.vrdate = $('#current_date').val();
        stockTransfer.chk_date = $('#chk_date').val();
        stockTransfer.received_by = $('#receivedBy').val();
        stockTransfer.remarks = $('#remarks').val();

        $('#stockTransferTable').find('tbody tr').each(function () {
            const row = $(this);
            // Extracting data using a more streamlined approach
            const itemId = row.find('td.itemName').data('item_id');
            const stockKeepingMethodId = row.find('td.itemName').data('stock_keeping_method_id');
            const colorCodeId = row.find('td.colorCodeName').data('color_code_id');
            const qty = row.find('td.qty').text() || 0;
            const weight = row.find('td.weight').text() || 0;
            const fromLocationId = row.find('td.fromLocationName').data('from_location_id');
            const toLocationId = row.find('td.toLocationName').data('to_location_id');

            // Initializing gridItemDetail with common properties
            const gridItemDetail = {
                item_id: itemId,
                stock_keeping_method_id: stockKeepingMethodId,
                color_code_id: colorCodeId,
                qty: parseNumber(qty),
                weight: parseNumber(weight),
                warehouse_id: fromLocationId,
                to_warehouse_id: toLocationId,
                detail_remarks: row.find('td.itemName textarea').val().trim() || null
            };
            stockTransferDetail.push(gridItemDetail);
        });
        const data = {};
        data.stockTransfer = stockTransfer;
        data.stockTransferDetail = stockTransferDetail;
        data.id = $('#stockTransferHiddenId').val();
        return data;
    };

    var validateSave = function () {
        var errorFlag = false;
        const currentDate = $('#current_date');

        // Remove any previous error indications
        $('.inputerror').removeClass('inputerror');

        // Check if the current date is entered
        if (!currentDate.val()) {
            currentDate.addClass('inputerror');
            errorFlag = true;
        }
        return errorFlag
    };

    var deleteVoucher = async function (vrnoa) {
        general.disableSave();
        const response = await makeAjaxRequest('delete', `${baseUrl}/stockTransfer/delete`,
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
        let gridItemTotalWeight = 0;

        $("#stockTransferTable").find("tbody tr").each(function (index, elem) {
            gridItemTotalQty += getNumText($(this).closest('tr').find('td.qty'));
            gridItemTotalWeight += getNumText($(this).closest('tr').find('td.weight'));
        });

        $('.gridItemTotalQty').text(parseNumber(gridItemTotalQty).toFixed(QTY_ROUNDING));
        $('.gridItemTotalWeight').text(parseNumber(gridItemTotalWeight).toFixed(WEIGHT_ROUNDING));
    };

    var resetVoucher = function () {
        resetFields();
        getStockTransferDataTable();
    };

    var resetFields = function () {
        $('.inputerror').removeClass('inputerror');
        const resetArray = [
            { selector: 'stockTransferHiddenId', options: { disabled: true } },
            'current_date',
            'gridItemFromLocation',
            'gridItemToLocation',
            'remarks',
            'receivedBy',
            'gridItemShortCodeDropdown',
            'gridItemNameDropdown',
            'gridItemColorCodeDropdown',
            'gridItemQty',
            'gridItemWeight',
            'txtGridRemarks'
        ];
        clearValueAndText(resetArray);

        const resetClassArray = [
            'gridItemTotalQty',
            'gridItemTotalWeight',
            'gridItemTotalRate',
            'gridItemTotalGrossAmount'
        ];
        clearValueAndText(resetClassArray, '.');

        $('#stockInformationTable tbody tr').remove();
        $('#stockTransferTable tbody tr').remove();
        $('#party_p').html('');
        $('#otherItemInformation').html('');
    };

    const getItemDetailRecord = (item_id) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: `${baseUrl}/item/getItemDetailRecord`,
                data: { item_id: item_id },
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



    let stockTransferDataTable = undefined;
    const getStockTransferDataTable = (stockTransferId = 0, fromDate = "", toDate = "") => {
        if (typeof stockTransferDataTable !== 'undefined') {
            stockTransferDataTable.destroy();
            $('#stockTransferDataTableTbody').empty();
        }
        stockTransferDataTable = $("#stockTransferDataTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${baseUrl}/stockTransfer/getStockTransferDataTable`,
                type: 'GET',
                data: { 'stockTransferId': stockTransferId, fromDate: fromDate, toDate: toDate },
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
                    className: "text-left",
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
                    className: "text-left openingStockVoucher"
                },
                {
                    data: "vrdate",
                    name: "vrdate",
                    className: "text-left voucherDate",
                    render: function (data, type, row) {
                        return updateFormattedDate(data);
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
								<a class="dropdown-item btnEditPrevVoucher" data-stock_transfer_id="${row.id}" href="#"><i class='fa fa-edit'></i> Edit Voucher</a>
								<a class="dropdown-item btnPrint"  data-stock_transfer_id="${row.id}" href="#"><i class='fa fa-print'></i> Print Voucher</a>
								<a class="dropdown-item btnDelete" data-stock_transfer_id="${row.id}" href="#"><i class='fa fa-trash'></i> Delete Voucher</a>
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
        stockTransferDataTable.on('draw', function () {
            $('[data-toggle="tooltip"]').tooltip(); // For Bootstrap 4
            // $('[data-bs-toggle="tooltip"]').tooltip(); // For Bootstrap 5, if you are using it
        });
    };

    const getItemDetailById = async (item_id) => {
        if (parseNumber(item_id) > 0) {
            const response = await getItemDetailRecord(item_id);
            if (response.status === false && response.error !== "") {
                _getAlertMessage('Error!', response.message, 'danger');
            } else if (response.status === false && response.message !== "") {
                _getAlertMessage('Information!', response.message, 'info');
            } else {
                const purchaseModuleSetting = response.data.purchase_module_settings;
                if (purchaseModuleSetting && purchaseModuleSetting.show_stock_information && parseNumber(response.data.inventory_validated) == 1) {
                    const stockInfo = new StockInformation(response.data.stock_keeping_method_id, { isSale: true });
                    stockInfo.getStockInformation(parseNumber(response.data.item_id), $('#current_date').val(), 0);
                }


                triggerAndRenderOptions($('#gridItemShortCodeDropdown'), response.data.short_code, response.data.item_id, false, false, true);
                triggerAndRenderOptions($('#gridItemNameDropdown'), response.data.item_des, response.data.item_id, false, false, true);
                appendSelect2ValueIfDataExists("gridItemFromLocation", "item_department", "did", "name", response.data);
                $('#stockKeepingMethodId').val(response.data.stock_keeping_method_id);
                $('#inventoryValidated').val(response.data.inventory_validated);

                populateOtherItemInformation(response.data);

                let focusId = $(domElement.gridItemQty);

                const colorCodeValue = parseNumber($(domElement.gridItemColorCodeDropdown).val()) || 0;
                const warehouseValue = parseNumber($(domElement.gridItemFromLocation).val()) || 0;

                if (colorCodeValue == 0) {
                    setTimeout(() => {
                        // Only focus if the value is still 0
                        if (parseNumber($(domElement.gridItemColorCodeDropdown).val()) == 0) {
                            $(domElement.gridItemColorCodeDropdown).focus();
                        }
                    }, 200);
                } else if (warehouseValue == 0) {
                    setTimeout(() => {
                        // Only focus if the value is still 0
                        if (parseNumber($(gridItemFromLocation).val()) == 0) {
                            $(gridItemFromLocation).focus();
                        }
                    }, 200);
                } else {
                    setTimeout(() => {
                        // Only focus if the value is still 0
                        $(focusId).focus();
                    }, 200);
                }
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

            $('#otherItemInformation').html(`<b>Category</b> : ${categoryName} <br /><b>Sub Category</b> : ${subCategoryName} <br /><b>Stock Keeping</b> : ${stockKeepingMethodName} <br /><b>Calculation By</b> : ${calculationType} <br />`);
        }
    };

    const appendToTable =
        (
            itemId,
            itemCode,
            itemName,
            stockKeepingMethodId,
            isInventoryValidated,
            colorCodeId,
            colorCodeName,
            qty,
            weight,
            fromLocationId,
            fromLocationName,
            toLocationId,
            toLocationName,
            detailRemarks = ""
        ) => {
            const row = `
          <tr class="odd:bg-white even:bg-slate-50">
            <td class='py-1 px-1 text-md align-middle srno'></td>
            <td class='py-1 px-1 text-md align-middle itemName'
            data-item_id='${itemId}'
            data-item_code="${itemCode}"
            data-inventory_validated="${isInventoryValidated}"
            data-stock_keeping_method_id="${stockKeepingMethodId}">
                ${itemName}
                <span>
                    <textarea class="form-control form-input-class  no-resize custom-textarea" placeholder="Enter details related to the row above...">${detailRemarks ?? ''}</textarea>
                </span>
            </td>
            <td class='py-1 px-1 text-md align-middle colorCodeName' data-color_code_id='${colorCodeId}'>${colorCodeName}</td>
            <td class='py-1 px-1 text-md align-middle text-right qty'>${parseNumber(qty).toFixed(QTY_ROUNDING)}</td>
            <td class='py-1 px-1 text-md align-middle text-right weight'>${parseNumber(weight).toFixed(WEIGHT_ROUNDING)}</td>
            <td class='py-1 px-1 text-md align-middle fromLocationName' data-from_location_id='${fromLocationId}'>${fromLocationName}</td>
            <td class='py-1 px-1 text-md align-middle toLocationName' data-to_location_id='${toLocationId}'>${toLocationName}</td>
            <td class='py-1 px-1 text-md align-middle text-right'>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu">
                        <button type="button" class="dropdown-item btnRowEdit"><i class="fa fa-edit"></i> Edit</button>
                        <button type="button" class="dropdown-item btnRowRemove"><i class="fa fa-trash-alt"></i> Remove</button>
                    </div>
                </div>
            </td>
          </tr>
        `;
            $(row).appendTo('#stockTransferTable');
            getTableSerialNumber('#stockTransferTable');
        };

    // Since inventoryValidated is async, we use an async function to wait for its result
    async function validateInventory(itemId, stockKeepingMethodId, colorCodeId, departmentId, qty, weight, currentDate) {
        const inventoryManager = new InventoryManager({ "voucherType": voucherType, "voucherId": $('#stockTransferHiddenId').val() });
        const isSuccess = await inventoryManager.inventoryValidated(itemId, stockKeepingMethodId, colorCodeId, departmentId, qty, weight, currentDate);
        if (isSuccess) {
            return true;
        } else {
            return false;
        }
    }

    return {

        init: function () {
            this.bindUI();
            $('.select2').select2();
            getStockTransferDataTable();
        },

        bindUI: function () {
            const self = this;
            $('[data-toggle="tooltip"]').tooltip();

            $(domElement.gridItemShortCodeDropdown).on('change', async function (e) {
                e.preventDefault();
                await getItemDetailById($(this).val());
            });
            $(domElement.gridItemNameDropdown).on('change', async function (e) {
                e.preventDefault();
                await getItemDetailById($(this).val());
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

            $('#gridItemQty,#gridItemWeight,#txtGridRemarks').on('keypress', function (event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    $('#btnAdd').trigger('click');
                }
            });

            $('#btnAdd').on('click', async function (e) {
                e.preventDefault();
                const alertMessage = validateSingleProductAdd();
                if (alertMessage) {
                    return AlertComponent.getAlertMessage({ "title": "Error!", "message": alertMessage, "type": "danger" });
                }

                const rawObject = {
                    itemId: $(domElement.gridItemNameDropdown).val(),
                    itemCode: $(domElement.gridItemShortCodeDropdown).find('option:selected').text().trim(),
                    itemName: $(domElement.gridItemNameDropdown).find('option:selected').text().trim(),
                    stockKeepingMethodId: $(domElement.stockKeepingMethodId).val(),
                    colorCodeId: $(domElement.gridItemColorCodeDropdown).val(),
                    colorCodeName: $(domElement.gridItemColorCodeDropdown).find('option:selected').text().trim(),
                    qty: $(domElement.gridItemQty).val(),
                    weight: $(domElement.gridItemWeight).val(),
                    fromLocationId: $(domElement.gridItemFromLocation).val(),
                    fromLocationName: $(domElement.gridItemFromLocation).find('option:selected').text().trim(),
                    toLocationId: $(domElement.gridItemToLocation).val(),
                    toLocationName: $(domElement.gridItemToLocation).find('option:selected').text().trim(),
                    isInventoryValidated: $(domElement.isInventoryValidated).val(),
                    detailRemarks: $(domElement.gridItemRemarks).val()
                }

                let existRow = false;
                $('#stockTransferTable').find('tbody tr').each(function (index, elem) {
                    const itemId = parseNumber($(elem).find('td.itemName').data('item_id'))
                    const fromLocationId = parseNumber($(elem).find('td.fromLocationName').data('fromLocationId'))
                    if (rawObject.itemId == itemId && rawObject.fromLocationId == fromLocationId) {
                        existRow = true
                    }
                });

                if (existRow) {
                    return AlertComponent.getAlertMessage({ "title": "Error!", "message": "Selected Item Is already in the Table", "type": "danger" });
                }

                const currentDate = $('#current_date').val().trim();
                if (parseNumber(rawObject.isInventoryValidated) === 1) {
                    const isSuccess = await validateInventory(
                        rawObject.itemId,
                        rawObject.stockKeepingMethodId,
                        rawObject.colorCodeId,
                        rawObject.fromLocationId,
                        rawObject.qty,
                        rawObject.weight,
                        currentDate
                    );
                    if (!isSuccess) {
                        return;
                    }
                }

                appendToTable(
                    rawObject.itemId,
                    rawObject.itemCode,
                    rawObject.itemName,
                    rawObject.stockKeepingMethodId,
                    rawObject.isInventoryValidated,
                    rawObject.colorCodeId,
                    rawObject.colorCodeName,
                    rawObject.qty,
                    rawObject.weight,
                    rawObject.fromLocationId,
                    rawObject.fromLocationName,
                    rawObject.toLocationId,
                    rawObject.toLocationName,
                    rawObject.detailRemarks
                );

                $(domElement.gridItemShortCodeDropdown).val('').trigger('change.select2');
                $(domElement.gridItemNameDropdown).val('').trigger('change.select2');
                $(domElement.stockKeepingMethodId).val('');
                $(domElement.gridItemColorCodeDropdown).val('').trigger('change.select2');
                $(domElement.gridItemQty).val('');
                $(domElement.gridItemWeight).val('');
                $(domElement.gridItemFromLocation).val('').trigger('change.select2');
                $(domElement.gridItemToLocation).val('').trigger('change.select2');

                $(domElement.gridItemShortCodeDropdown).focus();

                calculateLowerTotal();
            });

            // when btnRowRemove is clicked
            $('#stockTransferTable').on('click', '.btnRowRemove', function (e) {
                e.preventDefault();
                const row = $(this).closest('tr');

                row.remove();
                calculateLowerTotal();
            });

            $('#stockTransferTable').on('click', '.btnRowEdit', function (e) {
                e.preventDefault();
                const row = $(this).closest('tr');

                const editItemId = $(row).find('td.itemName').data('item_id');
                const editItemName = row.find('td.itemName').clone().children('span').remove().end().text();
                const editItemCode = $(row).find('td.itemName').data('item_code');
                const editInventoryValidated = $(row).find('td.itemName').data('inventory_validated');
                const editStockKeepingMethodId = $(row).find('td.itemName').data('stock_keeping_method_id');
                const editColorCodeId = $(row).find('td.colorCodeName').data('color_code_id');
                const editColorCodeName = $(row).find('td.colorCodeName').text();
                const editQty = parseNumber($(row).find('td.qty').text());
                const editWeight = parseNumber($(row).find('td.weight').text());
                const editFromLocationId = $(row).find('td.fromLocationName').data('from_location_id');
                const editFromLocationName = $(row).find('td.fromLocationName').text();
                const editToLocationId = $(row).find('td.toLocationName').data('to_location_id');
                const editToLocationName = $(row).find('td.toLocationName').text();
                const editRemarks = row.find('td.itemName textarea').val();

                $('#stockKeepingMethodId').val(editStockKeepingMethodId);
                $(domElement.isInventoryValidated).val(editInventoryValidated);

                triggerAndRenderOptions($(domElement.gridItemShortCodeDropdown), editItemCode, editItemId, false);
                triggerAndRenderOptions($(domElement.gridItemNameDropdown), editItemName, editItemId, false);
                triggerAndRenderOptions($(domElement.gridItemColorCodeDropdown), editColorCodeName, editColorCodeId, false);

                $(domElement.gridItemQty).val(editQty);
                $(domElement.gridItemWeight).val(editWeight);

                triggerAndRenderOptions($(domElement.gridItemFromLocation), editFromLocationName, editFromLocationId, false);
                triggerAndRenderOptions($(domElement.gridItemToLocation), editToLocationName, editToLocationId, false);
                $(domElement.gridItemRemarks).val(editRemarks);

                const stockInfo = new StockInformation(editStockKeepingMethodId, { isSale: true, voucherType: voucherType, voucherId: $('#stockTransferHiddenId').val() });
                stockInfo.getStockInformation(parseNumber(editItemId), $('#current_date').val());

                row.remove();
                calculateLowerTotal();
            });

            $('#openingStockSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getStockTransferDataTable();
            });
            $('#openingStockFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getStockTransferDataTable("", fromDate, toDate);
            });
            $(document.body).on('click', '.getItemLookUpRecord', function (e) {
                e.preventDefault();
                getItemLookUpRecord('sale_orders', '');
            });

            $('body').on('click', '#item-lookup .populateItem', function (e) {
                const ItemId = $(this).data('itemid');
                const ItemShortCode = $.trim($(this).closest('tr').find('td.item_des').text());
                triggerAndRenderOptions($('#gridItemNameDropdown'), ItemShortCode, ItemId);
                $('#item-lookup').modal('hide');
            });

            $(document.body).on('click', '.btnEditPrevVoucher', function (event) {
                event.preventDefault();
                const stockTransferId = parseNumber($(this).data('stock_transfer_id'));
                getStockTransferById(stockTransferId);
                $('a[href="#Main"]').trigger('click');
            });

            $(document.body).on('click', '.btnSave', function (event) {
                event.preventDefault();
                self.initSave();
            });

            $(document.body).on('click', '.btnPrint', function (event) {
                event.preventDefault();
                const stockTransferId = parseNumber($(this).data('stock_transfer_id'));
                const settingPrintDefault = $('#setting_print_default').val();
                printVoucher(stockTransferId, settingPrintDefault, 'lg', '');
            });

            $(document.body).on('click', '.btnPrintASEmail', function (event) {
                event.preventDefault();
                const stockTransferId = parseNumber($(this).data('stock_transfer_id'));
                const settingPrintDefault = $('#setting_print_default').val();
                getSendMail(stockTransferId, settingPrintDefault, 'lg', '', true);
            });

            $(document.body).on('click', '.btnReset', function (event) {
                event.preventDefault();
                resetVoucher();
            });

            $(document.body).on('click', '.btnDelete', function (event) {
                const stockTransferId = parseNumber($(this).data('stock_transfer_id'));
                event.preventDefault();
                if (stockTransferId !== 0) {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', function (result) {
                        if (result) {
                            deleteVoucher(stockTransferId);
                        }
                    });
                }
            });

            shortcut.add("F10", function () {
                $('.btnSave').get()[0].click();
            });
            shortcut.add("F2", function () {
                $('.getItemLookUpRecord').get()[0].click();
            });
            shortcut.add("F5", function () {
                $('#resetButton').first().trigger('click');
            });

            stockTransfer.fetchRequestedVr();
        },

        // prepares the data to save it into the database
        initSave: function () {
            const validateSaveFlag = validateSave();
            if (!validateSaveFlag) {
                var rowsCount = $('#stockTransferTable').find('tbody tr').length;
                if (rowsCount > 0) {
                    const saveObj = getSaveObject();
                    const data = { 'stockTransfer': JSON.stringify(saveObj.stockTransfer), 'stockTransferDetail': JSON.stringify(saveObj.stockTransferDetail), 'id': saveObj.id, 'chk_date': $('#chk_date').val(), 'vrdate': $('#current_date').val() };
                    saverRequest.sendRequest(data);
                } else {
                    AlertComponent.getAlertMessage({ title: "Error!", message: "No data found to save", type: "danger" });
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
                getStockTransferById(vrnoa);
            }
        }
    };

};

const stockTransfer = new StockTransfer();
// Corrected function to match the HTML ID
$(function () {
    new DynamicOption('#gridItemShortCodeDropdown', {
        requestedUrl: dropdownOptions.purchaseInventoryCategoriesShortCode,
        placeholderText: 'Choose Short Code',
        allowClear: true
    });
    new DynamicOption('#gridItemNameDropdown', {
        requestedUrl: dropdownOptions.inventoryItem,
        placeholderText: 'Choose Item Name',
        allowClear: true
    });
    new DynamicOption('#gridItemColorCodeDropdown', {
        requestedUrl: dropdownOptions.getAllColorCodes,
        placeholderText: 'Choose Color Code',
        allowClear: true
    });
    new DynamicOption('#gridItemFromLocation', {
        requestedUrl: dropdownOptions.getDepartmentAll,
        placeholderText: 'Choose From Location',
        allowClear: true
    });
    new DynamicOption('#gridItemToLocation', {
        requestedUrl: dropdownOptions.getDepartmentAll,
        placeholderText: 'Choose To Location',
        allowClear: true
    });
    stockTransfer.init();
});
