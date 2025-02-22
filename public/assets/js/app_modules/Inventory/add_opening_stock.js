// assets/js/app_modules/purchase/add_sale_order.js
import { AMOUNT_ROUNDING, QTY_ROUNDING, RATE_ROUNDING } from "../../../../js/components/GlobalConstants.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, getTableRowIsAlreadyExist, getValueIfDataExists, ifNull, isPositive, parseNumber, selectLastOption, setFinancialYearDate, updateDatepickerWithFormattedDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek, updateFormattedDate } from "../commonFunctions/CommonFunction.js";
import { calculateGrossAmountGridItemRow } from "../../../../js/components/calculations/calculateGrossAmountGridItemRow.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import SaverRequest from "../../../../js/components/SaverRequest.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { StockInformation } from "../../../../js/components/StockInformation.js";

// Instantiate BaseClass
const OpeningStock = function () {
    const voucherType = 'opening_stocks';
    const baseUrl = base_url;
    const domElement = {
        openingStockHiddenId: $('#openingStockHiddenId'),
        currentDate: $('#current_date'),
        remarks: $('#remarks'),
        gridItemWarehouseDropdown: $('#gridItemWarehouseDropdown'),
        gridItemCategoryDropdown: $('#gridItemCategoryDropdown'),
        gridItemSubCategoryDropdown: $('#gridItemSubCategoryDropdown'),
        gridItemBrandDropdown: $('#gridItemBrandDropdown'),
        gridItemNameDropdown: $('#gridItemNameDropdown'),
        gridItemColorCodeDropdown: $('#gridItemColorCodeDropdown'),
        gridItemQty: $('#gridItemQty'),
        gridItemWeight: $('#gridItemWeight'),
        gridItemRemarks: $('#txtGridRemarks'),
        gridItemTotalQty: $('.gridItemTotalQty'),
        gridItemTotalWeight: $('.gridItemTotalWeight'),
        gridItemTotalGrossAmount: $('.gridItemTotalGrossAmount'),
        isInventoryValidated: $('#inventoryValidated'),
        stockKeepingMethodId: $('#stockKeepingMethodId'),
    };

    const saverRequest = new SaverRequest(
        baseUrl,
        general,
        {
            requestedUrl: 'openingStock/save',
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
            const __etype = voucherType;
            const __vrnoa = vrnoa;
            const __pre_bal_print = 0;
            const __lang = ($('#print_lang').val()) ? $('#print_lang').val() : 1;
            const __url = base_url + '/doc/getPrintVoucherPDF/?etype=' + __etype + '&vrnoa=' + __vrnoa + '&pre_bal_print=' + __pre_bal_print + '&paperSize=' + paperSize + '&printSize=' + printSize + '&wrate=' + (wrate ? wrate : 0) + '&language_id=' + __lang;
            const _encodeURI = encodeURI(__url);
            openPrintOnSettingConfiguration(_encodeURI);
        } catch (error) {
            console.error(error);
        }
    };

    const getSendMail = (vrnoa, paperSize, printSize, wrate = 0, email = "") => {
        const __etype = voucherType;
        const __vrnoa = vrnoa;
        const __pre_bal_print = 0;
        const __lang = $('#print_lang').val();
        getEmailAndSendVoucherPrint(__etype, __vrnoa, __pre_bal_print, paperSize, printSize, wrate, __lang, email);
    };

    var getOpeningStockById = async function (openingStockId) {
        const response = await makeAjaxRequest('GET', `${baseUrl}/openingStock/getOpeningStockById`, {
            openingStockId: openingStockId
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
        $('#openingStockHiddenId').val(data.id);
        updateDatepickerWithFormattedDate('current_date', data.vrdate);
        updateDatepickerWithFormattedDate('chk_date', data.vrdate);
        $('#remarks').val(data.remarks);
        $.each(data.opening_stock_detail, function (index, elem) {
            appendToTable(
                elem.item_details.item_id,
                elem.item_details.item_des,
                elem.stock_keeping_method_id,
                elem.department_details.did,
                elem.department_details.name,
                elem.color_code.id,
                elem.color_code.name,
                elem.qty,
                elem.weight,
                elem.rate,
                elem.gross_amount,
                ifNull(elem.detail_remarks, "")
            );
        });
        calculateLowerTotal();
    };

    const validateSingleProductAdd = () => {
        let hasError = false;
        let errorMessage = '';

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!$('#gridItemWarehouseDropdown').val()) {
            $('#select2-gridItemWarehouseDropdown-container').parent().addClass('inputerror');
            errorMessage += `Warehouse is required <br />`;
            hasError = true;
        }

        if ($('#gridItemNameDropdown').val() > 0) {
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
        const openingStock = {};
        const openingStockDetail = [];

        openingStock.id = $('#openingStockHiddenId').val();
        openingStock.vrdate = $('#current_date').val();
        openingStock.chk_date = $('#chk_date').val();
        openingStock.remarks = $('#remarks').val();

        $('#openingStockTable').find('tbody tr').each(function () {
            const row = $(this);
            // Extracting data using a more streamlined approach
            const itemId = row.find('td.itemName').data('item_id');
            const stockKeepingMethodId = row.find('td.itemName').data('stock_keeping_method_id');
            const warehouseId = row.find('td.warehouseName').data('warehouse_id');
            const colorCodeId = row.find('td.colorCodeName').data('color_code_id');
            const qty = row.find('td.qty input').val() || 0;
            const weight = row.find('td.weight input').val() || 0;

            // Initializing gridItemDetail with common properties
            const gridItemDetail = {
                item_id: itemId,
                stock_keeping_method_id: stockKeepingMethodId,
                warehouse_id: warehouseId,
                color_code_id: colorCodeId,
                qty: parseNumber(qty),
                weight: parseNumber(weight),
                rate: parseNumber(row.find('td.rate input').val() || 0),
                gross_amount: parseNumber(row.find('td.gAmount').text() || 0),
                detail_remarks: row.find('td.itemName textarea').val().trim() || null
            };

            if ((stockKeepingMethodId === 1 && gridItemDetail.qty > 0) || // For qty-based items
                (stockKeepingMethodId === 2 && gridItemDetail.weight > 0) || // For weight-based items
                (stockKeepingMethodId === 3 && (gridItemDetail.qty > 0 || gridItemDetail.weight > 0))) {
                openingStockDetail.push(gridItemDetail);
            }
        });

        const data = {};
        data.openingStock = openingStock;
        data.openingStockDetail = openingStockDetail;
        data.id = $('#openingStockHiddenId').val();
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

    const validateZeroStock = function () {
        const gridItemTotalQty = parseNumber($('.gridItemTotalQty').text());
        const gridItemTotalWeight = parseNumber($('.gridItemTotalWeight').text());


        let confirmMessages = [];
        let showZeroQtyConfirm = false;
        let showZeroWeightConfirm = false;

        $('#openingStockTable tbody tr').each(function () {
            const stockKeepingMethodId = parseNumber($(this).find('td.itemName').data('stock_keeping_method_id'));
            const gridItemTotalQty = parseNumber($(this).find('td.qty input').val());
            const gridItemTotalWeight = parseNumber($(this).find('td.weight input').val());
            switch (stockKeepingMethodId) {
                case 1:
                    if (gridItemTotalQty === 0) {
                        showZeroQtyConfirm = true;
                    }
                    break;
                case 2:
                    if (gridItemTotalWeight === 0) {
                        showZeroWeightConfirm = true;
                    }
                    break;
                case 3:
                    if (gridItemTotalQty === 0) {
                        showZeroQtyConfirm = true;
                    }
                    if (gridItemTotalWeight === 0) {
                        showZeroWeightConfirm = true;
                    }
                    break;
            }
        });

        // Check and confirm for zero quantities
        if (showZeroQtyConfirm) {
            confirmMessages.push("Records with 0 qty will be discarded");
        }

        // Check and confirm for zero weights
        if (showZeroWeightConfirm) {
            confirmMessages.push("Records with 0 weight will be discarded");
        }

        // check and confirm for zero weight & qty
        if (showZeroQtyConfirm || showZeroWeightConfirm) {
            confirmMessages.push("Records with 0 qty and weight will be discarded");
        }
        // Display accumulated messages
        if (confirmMessages.length > 0 && !confirm(confirmMessages.join("\n") + "\nAre you sure to save ?")) {
            return true; // User chose to cancel
        }

        return false; // No z
    };


    var deleteVoucher = async function (vrnoa) {
        general.disableSave();
        const response = await makeAjaxRequest('delete', `${baseUrl}/openingStock/delete`,
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
        let gridItemTotalGrossAmount = 0;
        let gridItemTotalDiscountAmount = 0;
        let gridItemTotalAmountExclTax = 0;
        let gridItemTotalTaxAmount = 0;
        let gridItemTotalAmountInclTax = 0;

        $("#openingStockTable").find("tbody tr").each(function (index, elem) {
            gridItemTotalQty += getNumText($(this).closest('tr').find('td.qty'));
            gridItemTotalWeight += getNumText($(this).closest('tr').find('td.weight'));
            gridItemTotalGrossAmount += getNumText($(this).closest('tr').find('td.gAmount'));
            gridItemTotalDiscountAmount += getNumText($(this).closest('tr').find('td.discountAmount'));
            gridItemTotalAmountExclTax += getNumText($(this).closest('tr').find('td.amountExclTax'));
            gridItemTotalTaxAmount += getNumText($(this).closest('tr').find('td.taxAmount'));
            gridItemTotalAmountInclTax += getNumText($(this).closest('tr').find('td.amountInclTax'));
        });

        $('.gridItemTotalQty').text(parseNumber(gridItemTotalQty).toFixed(QTY_ROUNDING));
        $('.gridItemTotalWeight').text(parseNumber(gridItemTotalWeight).toFixed(WEIGHT_ROUNDING));
        $('.gridItemTotalGrossAmount').text(parseNumber(gridItemTotalGrossAmount).toFixed(AMOUNT_ROUNDING));
        $('.gridItemTotalAmountExclTax').text(parseNumber(gridItemTotalAmountExclTax).toFixed(AMOUNT_ROUNDING));
        $('.gridItemTotalTaxAmount').text(parseNumber(gridItemTotalTaxAmount).toFixed(AMOUNT_ROUNDING));
        $('.gridItemTotalAmountInclTax').text(parseNumber(gridItemTotalAmountInclTax).toFixed(AMOUNT_ROUNDING));

        var _DiscAmount = getNumVal($('#txtDiscAmount'));
        var _ExpenseAmount = getNumVal($('#txtExpAmount'));
        var _TaxAmount = getNumVal($('#txtTaxAmount'));
        const netAmount = parseFloat(gridItemTotalAmountInclTax) - parseFloat(_DiscAmount) + parseFloat(_ExpenseAmount) + parseFloat(_TaxAmount);

        $('#txtNetAmount').val(isPositive(getSettingDecimal(netAmount), 'txtNetAmount'));
    };

    var resetVoucher = function () {
        resetFields();
        getOpeningStockDataTable();
    };

    var resetFields = function () {
        $('.inputerror').removeClass('inputerror');
        const resetArray = [
            { selector: 'openingStockHiddenId', options: { disabled: true } },
            'current_date',
            'gridItemWarehouseDropdown',
            'remarks',
            'gridItemCategoryDropdown',
            'gridItemSubCategoryDropdown',
            'gridItemBrandDropdown',
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
        $('#openingStockTable tbody tr').remove();
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



    let openingStockViewList = undefined;
    const getOpeningStockDataTable = (openingStockId = 0, fromDate = "", toDate = "") => {
        if (typeof openingStockViewList !== 'undefined') {
            openingStockViewList.destroy();
            $('#openingStockViewListTbody').empty();
        }
        openingStockViewList = $("#openingStockViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${baseUrl}/openingStock/getOpeningStockDataTable`,
                type: 'GET',
                data: { 'openingStockId': openingStockId, fromDate: fromDate, toDate: toDate },
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
								<a class="dropdown-item btnEditPrevVoucher" data-opening_stock_id="${row.id}" href="#"><i class='fa fa-edit'></i> Edit Voucher</a>
								<a class="dropdown-item btnPrint"  data-opening_stock_id="${row.id}" href="#"><i class='fa fa-print'></i> Print Voucher</a>
								<a class="dropdown-item btnDelete" data-opening_stock_id="${row.id}" href="#"><i class='fa fa-trash'></i> Delete Voucher</a>
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
        openingStockViewList.on('draw', function () {
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

                $('#stockKeepingMethodId').val(response.data.stock_keeping_method_id);
                $('#inventoryValidated').val(response.data.inventory_validated);

                populateOtherItemInformation(response.data);

                let focusId = $(domElement.gridItemQty);

                const colorCodeValue = parseNumber($(domElement.gridItemColorCodeDropdown).val()) || 0;
                const warehouseValue = parseNumber($(gridItemWarehouseDropdown).val()) || 0;

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
                        if (parseNumber($(gridItemWarehouseDropdown).val()) == 0) {
                            $(gridItemWarehouseDropdown).focus();
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

    const getItemDetailByCriteria = async (criteria) => {
        try {
            const response = await makeAjaxRequest('GET', `${baseUrl}/item/getItemDetailByCriteria`, {
                categoryId: criteria.categoryId,
                subCategoryId: criteria.subCategoryId,
                brandId: criteria.brandId,
                itemId: criteria.itemId,
            });
            if (response.status == false && response.error !== "") {
                AlertComponent.getAlertMessage({ title: "Error!", "message": response.message, "type": "danger" });
            } else if (response.status == false && response.message !== "") {
                AlertComponent.getAlertMessage({ title: "Warning!", "message": response.message, "type": "warning" });
            } else {
                populateItemDetailByCriteria(response.data, criteria);
            }
        } catch (error) {
            AlertComponent.getAlertMessage({ title: "Warning!", "message": error.message, "type": "warning" });
        }
    };

    const populateItemDetailByCriteria = (collection, criteria) => {
        $.each(collection, function (index, elem) {
            appendToTable(
                elem.item_id,
                elem.item_des,
                elem.stock_keeping_method_id,
                criteria.warehouseId,
                criteria.warehouseName,
                criteria.colorCodeId || elem.color_code.id,
                criteria.colorCodeName || elem.color_code.name,
                criteria.qty,
                criteria.weight,
                0,
                0
            );
        });
        calculateLowerTotal();
    };

    const appendToTable = (itemId, itemName, stockKeepingMethodId, warehouseId, warehouseName, colorCodeId, colorCodeName, qty, weight, cost, amount, detailRemarks = "") => {
        const row = `
          <tr class="odd:bg-white even:bg-slate-50">
            <td class='py-1 px-1 text-md align-middle srno'></td>
            <td class='py-1 px-1 text-md align-middle itemName' data-item_id='${itemId}' data-stock_keeping_method_id="${stockKeepingMethodId}">
                ${itemName}
                <span>
                    <textarea class="form-control form-input-class  no-resize custom-textarea" placeholder="Enter details related to the row above...">${detailRemarks}</textarea>
                </span>
            </td>
            <td class='py-1 px-1 text-md align-middle warehouseName' data-warehouse_id='${warehouseId}'>${warehouseName}</td>
            <td class='py-1 px-1 text-md align-middle colorCodeName' data-color_code_id='${colorCodeId}'>${colorCodeName}</td>
            <td class='py-1 px-1 text-md align-middle text-right qty'><input class='form-input-class is_numeric text-right w-20 h-8 float-right qty qty-dec' value='${qty}'></td>
            <td class='py-1 px-1 text-md align-middle text-right weight'><input class='form-input-class is_numeric text-right w-20 h-8 float-right weight weight-dec' value='${weight}'></td>
            <td class='py-1 px-1 text-md align-middle text-right rate'><input class='form-input-class is_numeric text-right w-20 h-8 float-right rate rate-dec' value='${cost}'></td>
            <td class='py-1 px-1 text-md align-middle text-right gAmount'>${amount}</td>
            <td class='py-1 px-1 text-md align-middle text-right'>
                <button type="button" class="btn btn-outline-danger btnRowRemove"><i class="fa fa-trash-alt"></i></button>
            </td>
          </tr>
        `;
        $(row).appendTo('#openingStockTable');
        getTableSerialNumber('#openingStockTable');
    };

    var calculateLowerTotal = function () {
        let gridItemTotalQty = 0;
        let gridItemTotalWeight = 0;
        let gridItemTotalGrossAmount = 0;

        $("#openingStockTable").find("tbody tr").each(function (index, elem) {
            const row = $(this);
            gridItemTotalQty += parseNumber($(row).find('td.qty input').val()) || 0;
            gridItemTotalWeight += parseNumber($(row).find('td.weight input').val()) || 0;
            gridItemTotalGrossAmount += parseNumber($(row).find('td.gAmount').text()) || 0;
        });

        $('.gridItemTotalQty').text(parseNumber(gridItemTotalQty).toFixed(QTY_ROUNDING));
        $('.gridItemTotalWeight').text(parseNumber(gridItemTotalWeight).toFixed(WEIGHT_ROUNDING));
        $('.gridItemTotalGrossAmount').text(parseNumber(gridItemTotalGrossAmount).toFixed(AMOUNT_ROUNDING));
    };

    return {

        init: function () {
            this.bindUI();
            $('.select2').select2();
            getOpeningStockDataTable();
        },

        bindUI: function () {
            const self = this;
            $('[data-toggle="tooltip"]').tooltip();
            $('#openingStockTable').on('input', 'tr input.qty,tr input.weight, tr input.rate', function (event) {
                const row = $(this).closest('tr');
                const stockKeepingMethodId = parseNumber($(row).find('td.itemName').data('stock_keeping_method_id'));
                const gridQty = parseNumber($(row).find('td.qty input').val()) || 0;
                const gridWeight = parseNumber($(row).find('td.weight input').val()) || 0;
                const gridRate = parseNumber($(row).find('td.rate input').val()) || 0;
                const gridAmount = calculateGrossAmountGridItemRow(gridRate, gridQty, gridWeight, 1, stockKeepingMethodId);
                $(row).find('td.gAmount').text(parseNumber(gridAmount).toFixed(AMOUNT_ROUNDING));
                calculateLowerTotal();
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
                    warehouseId: $(domElement.gridItemWarehouseDropdown).val(),
                    warehouseName: $(domElement.gridItemWarehouseDropdown).find('option:selected').text().trim(),
                    categoryId: $(domElement.gridItemCategoryDropdown).val(),
                    categoryName: $(domElement.gridItemCategoryDropdown).find('option:selected').text().trim(),
                    subCategoryId: $(domElement.gridItemSubCategoryDropdown).val(),
                    subCategoryName: $(domElement.gridItemSubCategoryDropdown).find('option:selected').text().trim(),
                    brandId: $(domElement.gridItemBrandDropdown).val(),
                    brandName: $(domElement.gridItemBrandDropdown).find('option:selected').text().trim(),
                    itemId: $(domElement.gridItemNameDropdown).val(),
                    itemName: $(domElement.gridItemNameDropdown).find('option:selected').text().trim(),
                    colorCodeId: $(domElement.gridItemColorCodeDropdown).val(),
                    colorCodeName: $(domElement.gridItemColorCodeDropdown).find('option:selected').text().trim(),
                    stockKeepingMethodId: $(domElement.stockKeepingMethodId).val(),
                    qty: $(domElement.gridItemQty).val(),
                    weight: $(domElement.gridItemWeight).val(),
                }

                let existRow = false;
                $('#openingStockTable').find('tbody tr').each(function (index, elem) {
                    const itemId = $.trim($(elem).find('td.itemName').data('item_id'))
                    const warehouseId = $.trim($(elem).find('td.warehouseName').data('warehouse_id'))
                    if (rawObject.itemId == itemId && rawObject.warehouseId == warehouseId) {
                        existRow = true
                    }
                });

                if (existRow) {
                    return AlertComponent.getAlertMessage({ "title": "Error!", "message": "Selected Item Is already in the Table", "type": "danger" });
                }

                await getItemDetailByCriteria(rawObject);

                $(domElement.gridItemWarehouseDropdown).val('').trigger('change.select2');
                $(domElement.gridItemCategoryDropdown).val('').trigger('change.select2');
                $(domElement.gridItemSubCategoryDropdown).val('').trigger('change.select2');
                $(domElement.gridItemBrandDropdown).val('').trigger('change.select2');
                $(domElement.gridItemNameDropdown).val('').trigger('change.select2');
                $(domElement.gridItemColorCodeDropdown).val('').trigger('change.select2');
                $(domElement.stockKeepingMethodId).val('');
                $(domElement.gridItemQty).val('');
                $(domElement.gridItemWeight).val('');
            });

            $('#openingStockTable').on('click', '.btnRowRemove', function (e) {
                e.preventDefault();

                const row = $(this).closest('tr');
                row.remove();
                calculateLowerTotal();
            });

            $('#openingStockSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getOpeningStockDataTable();
            });
            $('#openingStockFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getOpeningStockDataTable("", fromDate, toDate);
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
                const openingStockId = parseNumber($(this).data('opening_stock_id'));
                getOpeningStockById(openingStockId);
                $('a[href="#Main"]').trigger('click');
            });

            $(document.body).on('click', '.btnSave', function (event) {
                event.preventDefault();
                if (!validateZeroStock()) {
                    self.initSave();
                }
            });

            $(document.body).on('click', '.btnPrint', function (event) {
                event.preventDefault();
                const openingStockId = parseNumber($(this).data('opening_stock_id'));
                const settingPrintDefault = $('#setting_print_default').val();
                printVoucher(openingStockId, settingPrintDefault, 'lg', '');
            });

            $(document.body).on('click', '.btnPrintASEmail', function (event) {
                event.preventDefault();
                const openingStockId = parseNumber($(this).data('opening_stock_id'));
                const settingPrintDefault = $('#setting_print_default').val();
                getSendMail(openingStockId, settingPrintDefault, 'lg', '', true);
            });

            $(document.body).on('click', '.btnReset', function (event) {
                event.preventDefault();
                resetVoucher();
            });

            $(document.body).on('click', '.btnDelete', function (event) {
                const openingStockId = parseNumber($(this).data('opening_stock_id'));
                event.preventDefault();
                if (openingStockId !== 0) {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', function (result) {
                        if (result) {
                            deleteVoucher(openingStockId);
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

            openingStock.fetchRequestedVr();
        },

        // prepares the data to save it into the database
        initSave: function () {
            const validateSaveFlag = validateSave();
            if (!validateSaveFlag) {
                var rowsCount = $('#openingStockTable').find('tbody tr').length;
                if (rowsCount > 0) {
                    const saveObj = getSaveObject();
                    const data = { 'openingStock': JSON.stringify(saveObj.openingStock), 'openingStockDetail': JSON.stringify(saveObj.openingStockDetail), 'id': saveObj.id, 'chk_date': $('#chk_date').val(), 'vrdate': $('#current_date').val() };
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
                getOpeningStockById(vrnoa);
            }
        }
    };

};

const openingStock = new OpeningStock();
// Corrected function to match the HTML ID
$(function () {

    new DynamicOption('#gridItemWarehouseDropdown', {
        requestedUrl: dropdownOptions.getDepartmentAll,
        placeholderText: 'Choose Warehouse'
    });
    new DynamicOption('#gridItemCategoryDropdown', {
        requestedUrl: dropdownOptions.getAllCategory,
        placeholderText: 'Choose Category'
    });
    new DynamicOption('#gridItemSubCategoryDropdown', {
        requestedUrl: dropdownOptions.getAllSubCategory,
        placeholderText: 'Choose Sub Category'
    });
    new DynamicOption('#gridItemBrandDropdown', {
        requestedUrl: dropdownOptions.getAllBrand,
        placeholderText: 'Choose Brand'
    });
    new DynamicOption('#gridItemNameDropdown', {
        requestedUrl: dropdownOptions.inventoryItem,
        placeholderText: 'Choose Item Name'
    });
    new DynamicOption('#gridItemColorCodeDropdown', {
        requestedUrl: dropdownOptions.getAllColorCodes,
        placeholderText: 'Choose Color Code',
        allowClear: true,
    });

    openingStock.init();
});
