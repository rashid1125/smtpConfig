import BaseClass from "../../../../js/components/BaseClass.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { disableSearchButton, enableSearchButton, ifNull, parseNumber, setFinancialYearDate, updateDatepickerWithFormattedDate, updateFormattedDate } from "../commonFunctions/CommonFunction.js";
import { AMOUNT_ROUNDING, QTY_ROUNDING, WEIGHT_ROUNDING } from "../../../../js/components/GlobalConstants.js";
const baseInstance = new BaseClass();
var ItemLedger = function () {
    const getItemOpeningStock = async (startDate, endDate, itemId, itemCrit) => {
        const response = await makeAjaxRequest('GET', `${base_url}/itemLedger/getItemOpeningStock`, { startDate, itemId, itemCrit });
        if (response.status == false && response.error !== "") {
            AlertComponent._getAlertMessage('Error!', response.message, 'danger');
        } else if (response.status == false && response.message !== "") {
            AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
        } else {
            $('.openingQty').html(parseNumber(response.data.openingQty).toFixed(QTY_ROUNDING)).digits();
            $('.openingWeight').html(parseNumber(response.data.openingWeight).toFixed(WEIGHT_ROUNDING)).digits();
        }
    };
    const _getNumberOfString = (n) => {
        const _N = $.trim(n).toString().replace(/,/g, '');
        return isNaN(parseFloat(_N)) ? 0 : parseFloat(_N);
    };
    const getValidateSearch = () => {
        var errorFlag = false;
        const fromDate = getSqlFormattedDate($('#from_date').val());
        const toDate = getSqlFormattedDate($('#to_date').val());
        const itemId = $('#itemDropdown').val();

        $('.inputerror').removeClass('inputerror');


        if (fromDate === '' || fromDate === null) {
            $('#from_date').addClass('inputerror');
            errorFlag = true;
        }
        if (toDate === '' || toDate === null) {
            $('#to_date').addClass('inputerror');
            errorFlag = true;
        }
        if (itemId === '' || itemId === null) {
            $('#select2-itemDropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }
        if (fromDate > toDate) {
            $('#from_date').addClass('inputerror');
            alert('Starting date must Be less than ending date.........');
            errorFlag = true;
        }
        return errorFlag;
    };

    const getItemLedgerReportData = async (startDate, endDate, itemId, itemCrit) => {
        if (typeof itemLedger.itemLedgerDataTable != 'undefined') {
            itemLedger.itemLedgerDataTable.fnDestroy();
            $('#itemLedgerDataTableRows').empty();
            $('#itemLedgerDataTableFooter').empty();
        }

        $(".loader").show();

        try {
            const response = await makeAjaxRequest('GET', `${base_url}/itemLedger/getItemLedger`, { startDate, endDate, itemId, itemCrit });
            if (response && response.status == false && response.error !== "") {
                const openingBalance = $('.opening-bal').text();
                $('.running-total').text(openingBalance);
                AlertComponent.getAlertMessage({ title: 'Error!', message: response.message, type: 'danger' });
            } else if (response && response.status == false && response.message !== "") {
                AlertComponent.getAlertMessage({ title: 'Warning!', message: response.message, type: 'warning' });
            } else {
                populateItemLedgerData(response.data);
            }
        } catch (error) {
            console.log('Error:', error);
        } finally {
            $(".loader").hide();
        }
    };

    const populateItemLedgerData = (result) => {
        if (result == false) {
            $('.running-total').html(getNumText($('.opening-bal')));
        }

        if (result.length !== 0 || result !== false) {

            var th;
            var td1;


            th = $('#general-head-template').html();
            td1 = $("#voucher-item-template").html();

            var template = Handlebars.compile(th);
            var html = template({});
            $('.itemLedgerDataTableHeader').html(html);

            let totalQtyIn = 0;
            let totalQtyOut = 0;
            let runningQtyBalance = parseNumber($('.openingQty').text());

            let totalWeightIn = 0;
            let totalWeightOut = 0;
            let runningWeightBalance = parseNumber($('.openingWeight').text());

            var SERIAL = 1;
            const saleRows = $("#itemLedgerDataTableRows");
            const accountLedgerFooter = $("#itemLedgerDataTableFooter");

            $.each(result, function (index, elem) {
                const obj = {};
                obj.SERIAL = SERIAL++;

                const vrnoa = elem.vrnoa;
                const vrdate = elem.vrdate;
                const accountName = elem.party_name;
                const warehouseName = elem.department_name;
                const colorCodeName = elem.color_code_name;

                obj.vrnoa = ifNull(vrnoa, "-");
                obj.vrdate = updateFormattedDate(vrdate);
                obj.accountName = accountName;
                obj.warehouseName = warehouseName;
                obj.colorCodeName = colorCodeName;

                // Running total
                runningQtyBalance += parseNumber(elem.qty);
                runningWeightBalance += parseNumber(elem.weight);

                // Qty
                obj.qtyIn = (parseNumber(elem.qty) > 0) ? parseNumber(elem.qty).toFixed(QTY_ROUNDING) : 0;
                obj.qtyOut = (parseNumber(elem.qty) < 0) ? Math.abs(elem.qty).toFixed(QTY_ROUNDING) : 0;
                obj.qtyBalance = parseNumber(runningQtyBalance).toFixed(QTY_ROUNDING);

                // Weight
                obj.weightIn = (parseNumber(elem.weight) > 0) ? parseNumber(elem.weight).toFixed(WEIGHT_ROUNDING) : 0;
                obj.weightOut = (parseNumber(elem.weight) < 0) ? Math.abs(elem.weight).toFixed(WEIGHT_ROUNDING) : 0;
                obj.weightBalance = parseNumber(runningWeightBalance).toFixed(WEIGHT_ROUNDING);


                totalQtyIn += (parseNumber(elem.qty) > 0) ? parseNumber(elem.qty) : 0;
                totalQtyOut += (parseNumber(elem.qty) < 0) ? Math.abs(elem.qty) : 0;

                totalWeightIn += (parseNumber(elem.weight) > 0) ? parseNumber(elem.weight) : 0;
                totalWeightOut += (parseNumber(elem.weight) < 0) ? Math.abs(elem.weight) : 0;

                // Add the item of the new voucher
                var source = td1;
                var template = Handlebars.compile(source);
                var html = template(obj);
                saleRows.append(html);

                if (index === (result.length - 1)) {
                    const source = $("#voucher-sum-template").html();
                    const template = Handlebars.compile(source);
                    const html = template({
                        'TOTAL_HEAD': 'Total',
                        voucherTotalQtyIn: parseNumber(totalQtyIn).toFixed(QTY_ROUNDING),
                        voucherTotalQtyOut: parseNumber(totalQtyOut).toFixed(QTY_ROUNDING),
                        voucherTotalWeightIn: parseNumber(totalWeightIn).toFixed(WEIGHT_ROUNDING),
                        voucherTotalWeightOut: parseNumber(totalWeightOut).toFixed(WEIGHT_ROUNDING)
                    });
                    accountLedgerFooter.append(html);
                }
            });
        }
        $("td.text-right").digits();
        bindGrid();
    };

    var bindGrid = function () {
        itemLedger.itemLedgerDataTable = $('#itemLedgerDataTable').dataTable({
            processing: true,
            "sDom": '<if<t>lp>',
            "bPaginate": false,
            'bFilter': true,
            'autoWidth': false,
            "fixedHeader": true,
            "sPaginationType": "full_numbers",
            "bJQueryUI": false,
            "bSort": false,
            "iDisplayLength": 100,
            "oTableTools": {
                "sSwfPath": "js/copy_cvs_xls_pdf.swf",
                "aButtons": [{
                    "sExtends": "print",
                    "sButtonText": "Print Report",
                    "sMessage": "Inventory Report"
                }]
            },
            buttons: [
                {
                    extend: 'copyHtml5',
                    className: 'btn btn-outline-secondary btn-copy-excel',
                    text: 'F3 Copy to clipboard',
                    titleAttr: 'Copy to clipboard',
                    exportOptions: { rows: ':visible' }
                },
                {
                    extend: 'excelHtml5',
                    className: 'btn btn-outline-info btn-export-excel',
                    text: 'F8 Excel',
                    titleAttr: 'Export to Excel',
                    exportOptions: {
                        rows: ':visible',
                        format: {
                            body: function (data, row, column, node) {
                                // Strip $ from salary column to make it numeric
                                if (column === 2)
                                    return data.replace(/[$,]/g, '');
                                else if ($(node).hasClass('text-account-ledger-total') === true)
                                    return data.replace(/[$,]/g, '');
                                else return $.trim($(node).text());
                            }
                        }
                    }
                }
            ],
            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });
        $('.nav-light > a.tool-action').off('click').on('click', function (e, index) {
            var action = $(this).attr('data-action');
            itemLedger.itemLedgerDataTable.DataTable().button(action).trigger('click');
        });
        $('.buttons-colvis').on('click', function (e) {
            $('.dt-button-collection').css({ 'display': 'block', 'top': '499px', 'left': '609.203px' });
            $('.div.dt-button-collection').css('width', '161px');
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            "s`": "dataTables_wrapper form-inline form-input-class",
        });
    };
    $.fn.digits = function () {
        return this.each(function () {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        });
    };

    const printReport = () => {
        var error = getValidateSearch();
        if (!error) {
            const startDate = $('#from_date').val();
            const endDate = $('#to_date').val();
            const accountId = $('#itemDropdown').val();
            const languageId = 1;
            const printHeader = $('input[name="printheader"]:checked').val();
            const itemCrit = getItemCrit() || -1;
            const printURL = `${base_url}/doc/getItemLedgerPDF?startDate=${startDate}&endDate=${endDate}&itemId=${accountId}&language_id=${languageId}&paperSize=${printHeader}&itemCrit=${encodeURIComponent(JSON.stringify(itemCrit))}`;
            openPrintOnSettingConfiguration(printURL);
        } else {
            alert('Correct the errors...');
        }
    };

    const getItemCrit = function (etype) {
        const warehouseId = $('#gridItemWarehouseDropdown').val() || -1;
        const colorCodeId = $('#gridItemColorDropdown').val() || -1;
        return {
            warehouseId,
            colorCodeId
        };
    }

    return {
        init: function () {
            this.bindUI();
        },
        bindUI: function () {
            var self = this;
            $('#from_date').datepicker('update', $('#sdate').val());
            $('#to_date').datepicker('update', $('#edate').val());

            $('.btnSearch').on('click', async function (e) {
                e.preventDefault();
                var error1 = general.validateFinancialDate($('#from_date').val(), $('#to_date').val());
                if (!error1) {
                    await self.initSearch();
                }
            });
            $('.btnReset').on('click', function (e) {
                e.preventDefault();
                general.reloadWindow();
            });
            $('.btnPrint').on('click', function (e) {
                e.preventDefault();
                var error1 = general.validateFinancialDate($('#from_date').val(), $('#to_date').val());
                if (!error1) {
                    const partyId = $.trim($('#accountDropdown').val());
                    printReport(1);
                    fetchEmail(partyId);
                }
            });
            shortcut.add("F9", function () {
                $('.btnPrint').get()[0].click();
            });
            shortcut.add("F6", function () {
                $('.btnSearch').get()[0].click();
            });
            shortcut.add("F5", function () {
                general.reloadWindow();
            });
            shortcut.add("F3", function () {
                $('.copy5 ').get()[0].click();
            });
            shortcut.add("F8", function () {
                $('.excel8 ').get()[0].click();
            });
            shortcut.add("F10", function () {
                $('.csv10 ').get()[0].click();
            });
        },
        initSearch: async function () {
            await disableSearchButton('#searchButton');
            var error = getValidateSearch();
            if (!error) {
                const from = getSqlFormattedDate($('#from_date').val());
                const to = getSqlFormattedDate($('#to_date').val());
                const itemId = $('#itemDropdown').val();
                const itemCrit = getItemCrit() || -1;
                console.log(itemCrit)
                await getItemOpeningStock(from, to, itemId, itemCrit);
                await getItemLedgerReportData(from, to, itemId, itemCrit);
            } else {
                AlertComponent.getAlertMessage({ 'title': "Error!", 'message': "Correct the error!", 'type': 'danger' });
            }
            await enableSearchButton('#searchButton');
        },
    };
};
var itemLedger = new ItemLedger();
itemLedger.init();

// Usage
$(function () {
    new DynamicOption('#itemDropdown', {
        requestedUrl: dropdownOptions.purchaseInventoryCategories,
        placeholderText: 'Choose Item',
    });
    new DynamicOption('#gridItemColorDropdown', {
        requestedUrl: `${base_url}/color/getAllColorCodes`,
        placeholderText: 'Choose Color Code',
        allowClear: true,
    });
    new DynamicOption('#gridItemWarehouseDropdown', {
        requestedUrl: dropdownOptions.getDepartmentAll,
        placeholderText: 'Choose Warehouse',
        allowClear: true,
    });
});
