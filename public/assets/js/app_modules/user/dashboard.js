import DynamicOption                              from "../../../../js/components/DynamicOption.js";
import { dropdownOptions }                        from "../../../../js/components/GlobalUrl.js";
import { doLoading, ifNull, updateFormattedDate } from "../commonFunctions/CommonFunction.js";
import { makeAjaxRequest }                        from "../../../../js/components/MakeAjaxRequest.js";
import AlertComponent                             from "../../../../js/components/AlertComponent.js";

class dashBoard
{
    constructor() {

        this.colors = ["#3498db", "#16a085", "#e74c3c", "#d35400", "#2c3e50", "#c0392b", "#2ecc71", "#2980b9"];

        this.getRandomNumber = function (minimum, maximum) {
            return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        };

        this.getRandomColor = function () {
            var randIndex = this.getRandomNumber(0, this.colors.length - 1);
            return this.colors[randIndex];
        };

        const getDashboardAccountBalance = async (pid) => {
            try {
                const response = await $.ajax({
                    url      : `${base_url}/dashboard/getDashboardAccountBalance`,
                    type     : "GET",
                    dataType : "JSON",
                    data     : { pid : pid }
                });
                $("#dashboardBalanceTable tbody tr").empty();
                if (response.data) {
                    appendToDashboardAccountBalanceTable(response.data);
                } else {
                    // Handle the scenario where there is no data
                }
            } catch (error) {
                _getAlertMessage("Error!", error, "danger");
            }
        };

        const appendToDashboardAccountBalanceTable = (data) => {
            const row = `<tr class='group item-row-td hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50'>
        <td class='py-1 px-1 text-md align-middle amount numeric text-right' data-title='Amount'>${parseNumber(data.opening).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle tax text-right' data-title='Amount'>${parseNumber(data.debit).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle taxupamount text-right' data-title='Amount'>${parseNumber(data.credit).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle taxamount text-right' data-title='Amount'>${parseNumber(data.closing).toFixed(AMOUNT_ROUNDING)}</td>
    </tr>`;
            $(row).appendTo("#dashboardBalanceTable");
        };
        const getDashboardItemStock                = async (item_id) => {
            try {
                doLoading(true);
                const response = await makeAjaxRequest("GET", `${base_url}/dashboard/getDashboardItemStock`, { item_id : item_id });
                if (response.status === false) {
                    AlertComponent.getAlertMessage({
                        message : response.message,
                        type    : "danger"
                    });
                } else if (response.status === true) {
                    $("#dashboardItemTable tbody tr").empty();
                    if (response.data) {
                        appendToDashboardItemStockTable(response.data);
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                doLoading(false);
            }
        };

        const appendToDashboardItemStockTable = (data) => {
            const row = `<tr class='group item-row-td hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50'>
		<td class='py-1 px-1 text-md align-middle amount numeric text-left' data-title='Item'>${data.item_name}</td>
        <td class='py-1 px-1 text-md align-middle amount numeric text-right' data-title='Amount'>${parseNumber(data.opening).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle tax text-right' data-title='Amount'>${parseNumber(data.stockin).toFixed(AMOUNT_ROUNDING)}</td>
        <td class='py-1 px-1 text-md align-middle taxupamount text-right' data-title='Amount'>${Math.abs(parseNumber(data.stockout).toFixed(AMOUNT_ROUNDING))}</td>
        <td class='py-1 px-1 text-md align-middle taxamount text-right' data-title='Amount'>${parseNumber(data.closing).toFixed(AMOUNT_ROUNDING)}</td>
    </tr>`;
            $(row).appendTo("#dashboardItemTable");
        };

        const getDashboardBankReserved = async () => {
            doLoading(true);
            try {
                const response       = await makeAjaxRequest("GET", `${base_url}/dashboard/getDashboardBankReserved`);
                const pieChartCanvas = $("#pieChart").get(0).getContext("2d");
                const PieData        = response.data.map(elem => {
                    const color = this.getRandomColor();
                    return {
                        value     : parseFloat(elem.balance),
                        color     : color,
                        highlight : color,
                        label     : `${elem.name} ${elem.balance}`
                    };
                });
                const pieOptions     = {
                    responsive            : true,
                    maintainAspectRatio   : false,
                    segmentShowStroke     : true,
                    segmentStrokeColor    : "#ffffff",
                    segmentStrokeWidth    : 2,
                    percentageInnerCutout : 50,
                    animationSteps        : 100,
                    animationEasing       : "easeOutBounce",
                    animateRotate         : true,
                    animateScale          : false,
                    legend                : {
                        display  : true,
                        position : "right"
                    },
                    tooltips              : {
                        enabled   : true,
                        mode      : "index",
                        intersect : false
                    }
                };
                $("#pieChart").attr("width", "1000");
                const pieChart = new Chart(pieChartCanvas, {
                    type    : "doughnut",
                    data    : {
                        datasets : [{
                            data                 : PieData.map(data => data.value),
                            backgroundColor      : PieData.map(data => data.color),
                            hoverBackgroundColor : PieData.map(data => data.highlight)
                        }],
                        labels   : PieData.map(data => data.label) // Use the label names here, not HTML
                    },
                    options : pieOptions
                });
            } catch (error) {
                console.error("Error fetching bank reserve data:", error);
            }finally {
                doLoading(false);
            }
        };

        let dashboardPendingDeliveryChallanDataTable      = undefined;
        const getDashboardPendingDeliveryChallanDataTable = () => {
            if (typeof dashboardPendingDeliveryChallanDataTable !== "undefined") {
                dashboardPendingDeliveryChallanDataTable.destroy();
                $("#dashboardPendingSaleInvoicesTbody").empty();
            }
            dashboardPendingDeliveryChallanDataTable = $("#dashboardPendingSaleInvoices").DataTable({
                processing : true,
                serverSide : true,
                ajax       : {
                    url     : `${base_url}/deliveryChallan/getPendingDeliveryChallanDataTable`,
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
                    className : "text-left saleOrderVrnoa"
                }, {
                    data      : "vrdate",
                    name      : "vrdate",
                    className : "text-left vrdate",
                    render    : function (data, type, row) {
                        return getFormattedDate(data);
                    }
                }, {
                    data           : "party.name",
                    name           : "party.name",
                    className      : "customerName",
                    defaultContent : "-"
                }, {
                    data      : "sale_order.vrnoa",
                    name      : "saleOrder.vrnoa",
                    className : "saleOrderVrnoa",
                    render    : function (data, type, row) {
                        return ifNull(data, "-");
                    }
                }, {
                    data      : "sale_order.vrdate",
                    name      : "saleOrder.vrdate",
                    className : "saleOrderVrdate",
                    render    : function (data, type, row) {
                        if (data !== undefined) {
                            return updateFormattedDate(row.sale_order.vrdate);
                        }
                        return "-";
                    }
                }],
                createdRow : function (row, data, dataIndex) {
                    $(row).addClass("group odd:bg-white even:bg-slate-50");
                    $("td", row).addClass("py-1 px-1 text-md align-middle");
                }
            });
            dashboardPendingDeliveryChallanDataTable.on("draw", function () {
                $("[data-toggle=\"tooltip\"]").tooltip();
            });
        };

        var getPendingSaleInvoicesAndSave  = function (deliveryChallanNumber) {

            $.ajax({
                url      : base_url + "/dashboard/getPendingSaleInvoiceAndSave",
                type     : "POST",
                data     : { "deliveryChallanNumber" : deliveryChallanNumber },
                dataType : "JSON",
                success  : function (response) {
                    if (response.status == false && response.error !== "") {
                        _getAlertMessage("Error!", response.message, "danger");
                    } else if (response.status == false && response.message !== "") {
                        _getAlertMessage("Warning!", response.message, "warning");
                    } else {
                        _getAlertMessage("Successfully!", response.message, "success");
                        $("#pendingInvoicesSyncAlt").trigger("click");
                    }
                },
                error    : function (xhr, status, error) {
                    console.log(xhr.responseText);
                }
            });
        };
        const getDebitorCreditorData       = async (fromDate, debitorCreditor, debitorCreditorIndividual, dateRangeType) => {
            try {
                const response = await fetch(base_url + "/dashboard/getDebitorCreditorData", {
                    method  : "POST",
                    body    : JSON.stringify({
                        "fromDate"                  : fromDate,
                        "debitorCreditor"           : debitorCreditor,
                        "debitorCreditorIndividual" : debitorCreditorIndividual,
                        "dateRangeType"             : dateRangeType
                    }),
                    headers : {
                        "Content-Type" : "application/json",
                        "X-CSRF-TOKEN" : $("meta[name=\"csrf-token\"]").attr("content")
                    }
                });

                if (! response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error:", error);
            }
        };
        const populateDebitorCreditor      = async (fromDate, debitorCreditor, debitorCreditorIndividual, dateRangeType) => {
            const $loader    = $(".loader");
            const $tableBody = $("#debitorCreditorTableTbody");
            $(".totalGridOpeningBalance").text("");
            $(".totalGridDebitBalance").text("");
            $(".totalGridCreditBalance").text("");
            $(".totalGridTurnOverBalance").text("");
            $(".totalGridBalance").text("");
            if (typeof dashboard.debitorCreditorTable != "undefined") {
                dashboard.debitorCreditorTable.fnDestroy();
                $tableBody.empty();
            }
            $loader.show();

            try {
                const response = await getDebitorCreditorData(fromDate, debitorCreditor, debitorCreditorIndividual, dateRangeType);
                if (response.status === true) {
                    for (const elem of response.data) {
                        if (parseNumber(elem[`Op Balance_sum`]) !== 0 || parseNumber(elem[`Debit_sum`]) !== 0 || parseNumber(elem[`Credit_sum`]) !== 0 || parseNumber(elem[`Balance_sum`]) !== 0 || parseNumber(elem[`Turn Over_sum`]) !== 0) {
                            appendToTableDebitorCreditor(elem[`Account Name`], elem[`Op Balance_sum`], elem[`Debit_sum`], elem[`Credit_sum`], elem[`Balance_sum`], elem[`Turn Over_sum`]);
                        }

                    }
                    calculateLowerTotalDebitorCreditor();
                    $("td.text-right").digits();
                    $("tfoot th.text-right").digits();
                    bindGridDebitorCreditor();
                }
            } catch (error) {
                console.error(error.message);
            } finally {
                $loader.hide();
            }
        };
        /**
         * appendToTableDebitorCreditor
         * @param {String} accountName
         * @param {Number} openingBalance
         * @param {Number} debitBalance
         * @param {Number} creditBalance
         * @param {Number} balance
         * @param {Number} turnOverBalance
         */
        const appendToTableDebitorCreditor = (accountName, openingBalance, debitBalance, creditBalance, balance, turnOverBalance) => {
            var row = `
    <tr>
      <td class="text-left srno"></td>
      <td class="text-left accountName text-nowrap">${accountName}</td>
      <td class="text-right openingBalance text-nowrap">${parseNumber(openingBalance).toFixed(0)}</td>
      <td class="text-right debitBalance text-nowrap">${parseNumber(debitBalance).toFixed(0)}</td>
			<td class="text-right creditBalance text-nowrap">${parseNumber(creditBalance).toFixed(0)}</td>
			<td class="text-right turnOverBalance text-nowrap">${parseNumber(turnOverBalance).toFixed(0)}</td>
			<td class="text-right balance text-nowrap">${parseNumber(balance).toFixed(0)}</td>
    </tr>
    `;
            $(row).appendTo("#debitorCreditorTable");
            getTableSerialNumber("#debitorCreditorTable");

        };

        const calculateLowerTotalDebitorCreditor = () => {
            // Initialize the variables to keep track of the total values
            let totalGridOpeningBalance  = 0;
            let totalGridDebitBalance    = 0;
            let totalGridCreditBalance   = 0;
            let totalGridTurnOverBalance = 0;
            let totalGridBalance         = 0;
            // Loop through each row in the table
            $("#debitorCreditorTable").find("tbody tr").each(function (index, elem) {
                // Sum the values in the cells for each of the columns
                totalGridOpeningBalance += parseNumber($(this).closest("tr").find("td.openingBalance").text());
                totalGridDebitBalance += parseNumber($(this).closest("tr").find("td.debitBalance").text());
                totalGridCreditBalance += parseNumber($(this).closest("tr").find("td.creditBalance").text());
                totalGridTurnOverBalance += parseNumber($(this).closest("tr").find("td.turnOverBalance").text());
                totalGridBalance += parseNumber($(this).closest("tr").find("td.balance").text());
            });
            // Update the text of the total fields with the calculated values
            $(".totalGridOpeningBalance").text(parseNumber(totalGridOpeningBalance).toFixed(0));
            $(".totalGridDebitBalance").text(parseNumber(totalGridDebitBalance).toFixed(0));
            $(".totalGridCreditBalance").text(parseNumber(totalGridCreditBalance).toFixed(0));
            $(".totalGridTurnOverBalance").text(parseNumber(totalGridTurnOverBalance).toFixed(0));
            $(".totalGridBalance").text(parseNumber(totalGridBalance).toFixed(0));
        };
        const bindGridDebitorCreditor            = function () {
            var dontSort = [];
            $("#debitorCreditorTable thead th").each(function () {
                if ($(this).hasClass("no_sort")) {
                    dontSort.push({ "bSortable" : false });
                } else {
                    dontSort.push(null);
                }
            });
            dashboard.debitorCreditorTable = $("#debitorCreditorTable").dataTable({
                "aaSorting"       : [[0, "asc"]],
                "bPaginate"       : true,
                "sPaginationType" : "full_numbers",
                "bJQueryUI"       : false,
                "aoColumns"       : dontSort,
                "bSort"           : true,
                "iDisplayLength"  : 10
            });
            $.extend($.fn.dataTableExt.oStdClasses, {
                "s`" : "dataTables_wrapper form-inline"
            });
        };

        const getDebitorCreditorIndividualAccount = async (debitorCreditor) => {
            try {
                const response = await fetch(base_url + "/dashboard/getDebitorCreditorIndividualAccount", {
                    method  : "POST",
                    body    : JSON.stringify({ "debitorCreditor" : debitorCreditor }),
                    headers : {
                        "Content-Type" : "application/json",
                        "X-CSRF-TOKEN" : $("meta[name=\"csrf-token\"]").attr("content")
                    }
                });

                if (! response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error:", error);
            }
        };

        const populateDebitorCreditorIndividualDropdown = async (debitorCreditor) => {
            $(".loader").show();
            const debitorCreditorIndividualDropdown = document.querySelector("#debitorCreditorIndividualDropdown");
            try {
                const data = await getDebitorCreditorIndividualAccount(debitorCreditor);

                // Clear the dropdown options
                debitorCreditorIndividualDropdown.innerHTML = "";

                // Add a default "Select an option" option
                const defaultOption = document.createElement("option");
                defaultOption.text  = "Select an option";
                defaultOption.value = "";
                debitorCreditorIndividualDropdown.add(defaultOption);

                // Add the data to the dropdown options
                data.forEach((item) => {
                    const option = document.createElement("option");
                    option.text  = item.name;
                    option.value = item.pid;
                    debitorCreditorIndividualDropdown.add(option);
                });
            } catch (error) {
                console.log(error.message);
            } finally {
                $(".loader").hide();
            }
        };

        return {
            init   : async function () {

                await this.bindUI();
                $(".select2").select2();

            },
            bindUI : async function () {
                const self = this;

                $("#dashboardAccountDropdown").on("change", async function (e) {
                    e.preventDefault();
                    await getDashboardAccountBalance($(this).val());
                });

                $("#dashboardItemDropdown").on("change", async function (e) {
                    e.preventDefault();
                    await getDashboardItemStock($(this).val());
                });
                $("#dashboardAccountPrint").on("click", function (e) {
                    if (($("#dashboardAccountDropdown").val()) != null) {
                        const accountId = $("#dashboardAccountDropdown").val();
                        const url       = `${base_url}/dashboard/getDashboardAccountLedgerPDF/?pid=${accountId}`;
                        openPrintOnSettingConfiguration(url);
                    } else {
                        _getAlertMessage("Error!", "Please Select Account", "danger");
                    }
                });
                $("#dashboardItemPrint").on("click", function (e) {
                    if (($("#dashboardItemDropdown").val()) != null) {
                        const ItemId = $("#dashboardItemDropdown").val();
                        const url    = `${base_url}/doc/getItemLedgerPDF?itemId=${ItemId}&dashboardItem=1`;
                        openPrintOnSettingConfiguration(url);
                    } else {
                        _getAlertMessage("Error!", "Please Select Item", "danger");
                    }
                });
                $("#pendingInvoicesSyncAlt").on("click", function (e) {
                    e.preventDefault();
                    getDashboardPendingDeliveryChallanDataTable();
                });

                // Delegate event for 'Edit OGP' button
                $("body").on("click", ".dashboardDeliveryChallan", function (e) {
                    e.preventDefault();
                    const vrnoa = $(this).data("vrnoa");
                    const url   = `${base_url}/deliveryChallan?vrnoa=${vrnoa}`;
                    window.open(url);
                });

                // Delegate event for 'Post Save Invoice' button
                $("body").on("click", ".dashboardSaleInvoiceSave", function (e) {
                    e.preventDefault();
                    const invoice = $(this).data("invoice");
                    getPendingSaleInvoicesAndSave(invoice);
                });

                // Delegate event for 'Post Manual Sale' button
                $("body").on("click", ".dashboardSaleInvoiceCalled", function (e) {
                    e.preventDefault();
                    const sale = $(this).data("sale");
                    const url  = `${base_url}/saleInvoice?deliveryChallanNumber=${sale}`;
                    window.open(url);
                });
                $("#debitorCreditorDropdown").change(async function () {
                    const $tableBody = $("#debitorCreditorTableTbody");
                    const $tableFoot = $("#debitorCreditorTableTfoot");
                    if (typeof dashboard.debitorCreditorTable != "undefined") {
                        dashboard.debitorCreditorTable.fnDestroy();
                        $tableBody.empty();

                    }
                    $(".totalGridOpeningBalance").text("");
                    $(".totalGridDebitBalance").text("");
                    $(".totalGridCreditBalance").text("");
                    $(".totalGridTurnOverBalance").text("");
                    $(".totalGridBalance").text("");
                    const debitorCreditor = $(this).val().trim();
                    // Call the function with the selected debitorCreditor value
                    populateDebitorCreditorIndividualDropdown(debitorCreditor);
                });

                $("#debitorCreditorSearch").click(async function () {
                    const timestamp                 = Date.now();                              // Or any other timestamp you want to use
                    const fromDate                  = moment(timestamp).format("YYYY-MM-DD");
                    // Call the function with the selected debitorCreditor value
                    const debitorCreditor           = $("#debitorCreditorDropdown").val().trim();
                    const debitorCreditorIndividual = $("#debitorCreditorIndividualDropdown").val();
                    const dateRangeType             = $("input[type=radio][name=debitorCreditorDateRange]:checked").val();
                    populateDebitorCreditor(fromDate, debitorCreditor, debitorCreditorIndividual, dateRangeType);
                });

                $("#debitorCreditorRefreshTable").click(async function () {
                    const timestamp                 = Date.now();                              // Or any other timestamp you want to use
                    const fromDate                  = moment(timestamp).format("YYYY-MM-DD");
                    // Call the function with the selected debitorCreditor value
                    const debitorCreditor           = $("#debitorCreditorDropdown").val().trim();
                    const debitorCreditorIndividual = $("#debitorCreditorIndividualDropdown").val();
                    const dateRangeType             = $("input[type=radio][name=debitorCreditorDateRange]:checked").val();
                    populateDebitorCreditor(fromDate, debitorCreditor, debitorCreditorIndividual, dateRangeType);
                });
                await getDashboardBankReserved();
                await getDashboardPendingDeliveryChallanDataTable();
            }
        };
    }
}

var dashboard = new dashBoard();
dashboard.init();
// Usage
$(function () {
    new DynamicOption("#dashboardAccountDropdown", {
        requestedUrl    : dropdownOptions.getAccountDetailAll,
        placeholderText : "Choose Account",
        isAccountLedger : 1
    });

    new DynamicOption("#dashboardItemDropdown", {
        requestedUrl    : dropdownOptions.purchaseInventoryCategories,
        placeholderText : "Choose Item"
    });
});
$(document).ready(function () {
    $("[data-toggle=\"tooltip\"]").tooltip();
});
