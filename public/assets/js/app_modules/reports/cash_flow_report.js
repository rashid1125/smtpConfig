import BaseClass                                                           from "../../../../js/components/BaseClass.js";
import AlertComponent                                                      from "../../../../js/components/AlertComponent.js";
import DynamicOption                                                       from "../../../../js/components/DynamicOption.js";
import { dropdownOptions }                                                 from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest }                                                 from "../../../../js/components/MakeAjaxRequest.js";
import { disableSearchButton, doLoading, enableSearchButton, parseNumber } from "../commonFunctions/CommonFunction.js";

const baseInstance   = new BaseClass();
const CashFlowReport = function () {
    const selectColumnList        = Object.freeze({
        account_id  : "account_id",
        name        : "name",
        pid         : "pid",
        level1_id   : "level1_id",
        level1_name : "level1_name",
        level2_id   : "level2_id",
        level2_name : "level2_name",
        level3_id   : "level3_id",
        level3_name : "level3_name",
        debit       : "debit",
        credit      : "credit"
    });
    const fromDate                = "#from_date";
    const toDate                  = "#to_date";
    const accountDropdown         = "#accountDropdown";
    const runningTotal            = ".running-total";
    const openingBalance          = ".opening-bal";
    const cashFlowTable           = "#cashFlowTable";
    const cashFlowRows            = "#cashFlowRows";
    // instance
    const fromDateInstance        = $(fromDate);
    const toDateInstance          = $(toDate);
    const accountDropdownInstance = $(accountDropdown);
    const runningTotalInstance    = $(runningTotal);
    const openingBalanceInstance  = $(openingBalance);
    const cashFlowTableInstance   = $(cashFlowTable);
    const cashFlowRowsInstance    = $(cashFlowRows);

    const getCashFlowOpeningBalance = async (startDate, accountId) => {
        baseInstance.runException(async () => {
            const response = await makeAjaxRequest("GET", `${base_url}/accountLedger/getCashFlowOpeningBalance`, {
                startDate,
                accountId
            });
            if (response && response.status === false) {
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : response.message,
                    type    : "danger"
                });
            } else {
                $(".opening-bal").html(parseNumber(response.data).toFixed(AMOUNT_ROUNDING)).digits();
            }
        });
    };
    const getCashFlowClosingBalance = async (startDate, accountId) => {
        baseInstance.runException(async () => {
            const response = await makeAjaxRequest("GET", `${base_url}/accountLedger/getCashFlowClosingBalance`, {
                startDate,
                accountId
            });
            if (response && response.status === false) {
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : response.message,
                    type    : "danger"
                });
            } else {
                $(".running-total").html(parseNumber(response.data).toFixed(AMOUNT_ROUNDING)).digits();
            }
        });
    };
    const getValidateSearch         = () => {
        let errorFlag   = false;
        const from_date = getSqlFormattedDate(fromDateInstance.val());
        const to_date   = getSqlFormattedDate(toDateInstance.val());
        $(".inputerror").addClass("inputerror");

        if (from_date === "" || from_date === null) {
            fromDateInstance.addClass("inputerror");
            errorFlag = true;
        }
        if (to_date === "" || to_date === null) {
            toDateInstance.addClass("inputerror");
            errorFlag = true;
        }
        if (from_date > to_date) {
            fromDateInstance.addClass("inputerror");
            alert("Starting date must Be less than ending date.........");
            errorFlag = true;
        }
        return errorFlag;
    };

    const getCashFlowReportData = async (startDate, endDate, accountId) => {
        $(".grand-total").html(0);
        $(".net-debit").html(0);
        $(".net-credit").html(0);
        runningTotalInstance.html(0);
        $(".pdc-total").html(0);

        if (typeof cashFlowReport.accountLedgerDataTable != "undefined") {
            cashFlowReport.accountLedgerDataTable.fnDestroy();
            cashFlowRowsInstance.empty();
        }
        doLoading(true);
        try {
            const response = await makeAjaxRequest("GET", `${base_url}/accountLedger/getCashFlowReportData`, {
                startDate,
                endDate,
                accountId
            });
            if (response && response.status === false) {
                const openingBalance = openingBalanceInstance.text();
                runningTotalInstance.text(openingBalance);
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : response.message,
                    type    : "danger"
                });
            } else {
                console.log(response.data);
                populateAccountLedgerData(response.data);
            }
        } catch (error) {
            console.log("Error:", error);
        } finally {
            doLoading(false);
        }
    };

    const populateAccountLedgerData = (result) => {
        if (result === false) {
            $(".running-total").html(getNumText($(".opening-bal")));
        }

        if (result.length !== 0 || result !== false) {
            const th       = $("#general-head-template").html();
            const td1      = $("#voucher-item-template").html();
            const template = Handlebars.compile(th);
            const html     = template({});
            $(".dthead").html(html);

            let $serial_l1 = 0;
            let $serial_l2 = 0;
            let $serial_l3 = 0;

            let $Total_Debit     = 0.00;
            let $Total_Credit    = 0.00;
            let $Total_Debit_l1  = 0.00;
            let $Total_Credit_l1 = 0.00;
            let $Total_Debit_l2  = 0.00;
            let $Total_Credit_l2 = 0.00;
            let $Total_Debit_l3  = 0.00;
            let $Total_Credit_l3 = 0.00;

            let $l1_name   = "";
            let $l2_name   = "";
            let $l3_name   = "";
            let $l1_id     = "";
            let $l2_id     = "";
            let $l3_id     = "";
            let rowCounter = 0;

            const saleRows = $("#cashFlowRows");

            $.each(result, function (index, elem) {
                // level1 data
                if ($l1_id !== elem[selectColumnList.level1_id]) {
                    if ($l3_id !== elem[selectColumnList.level3_id]) {
                        if ($serial_l3 !== 0) {
                            const sourceLevel3   = $("#voucher-level3-sum-template").html();
                            const templateLevel3 = Handlebars.compile(sourceLevel3);
                            const htmlLevel3     = templateLevel3({
                                Total_Debit_l3  : gettoFixed($Total_Debit_l3),
                                Total_Credit_l3 : gettoFixed($Total_Credit_l3),
                                l3_name         : $l3_name,
                                "TOTAL_HEAD"    : $l3_name + " " + "TOTAL"
                            });
                            saleRows.append(htmlLevel3);
                            $Total_Debit_l3  = 0;
                            $Total_Credit_l3 = 0;
                            $serial_l3       = 0;
                        }
                    }

                    if ($l2_id !== elem.level2_id) {
                        if ($serial_l2 !== 0) {
                            const sourceLevel2   = $("#voucher-level2-sum-template").html();
                            const templateLevel2 = Handlebars.compile(sourceLevel2);
                            const htmlLevel2     = templateLevel2({
                                Total_Debit_l2  : gettoFixed($Total_Debit_l2),
                                Total_Credit_l2 : gettoFixed($Total_Credit_l2),
                                l2_name         : $l2_name,
                                "TOTAL_HEAD"    : $l2_name + " " + "TOTAL"
                            });
                            saleRows.append(htmlLevel2);

                            $Total_Debit_l2  = 0;
                            $Total_Credit_l2 = 0;
                            $serial_l2       = 0;
                        }
                    }

                    if ($serial_l1 !== 0) {
                        const sourceLevel3   = $("#voucher-level1-sum-template").html();
                        const templateLevel3 = Handlebars.compile(sourceLevel3);
                        const htmlLevel3     = templateLevel3({
                            Total_Debit_l1  : gettoFixed($Total_Debit_l1),
                            Total_Credit_l1 : gettoFixed($Total_Credit_l1),
                            l1_name         : $l1_name,
                            "TOTAL_HEAD"    : $l1_name + " " + "TOTAL"
                        });
                        saleRows.append(htmlLevel3);
                        $Total_Debit_l1  = 0;
                        $Total_Credit_l1 = 0;
                        $serial_l1       = 0;
                    }

                    const sourceLevel1   = $("#voucher-level1-name-template").html();
                    const templateLevel1 = Handlebars.compile(sourceLevel1);
                    const htmlLevel1     = templateLevel1({
                        LEVEL1ID   : elem.account_id.slice(0, 2),
                        LEVEL1NAME : elem.level1_name
                    });
                    saleRows.append(htmlLevel1);
                    $l1_id   = elem.level1_id;
                    $l1_name = elem.level1_name;
                }
                // Level 2 data
                if ($l2_id !== elem.level2_id) {
                    if ($l3_id !== elem.level3_id) {
                        if ($serial_l3 !== 0) {
                            const sourceLevel3   = $("#voucher-level3-sum-template").html();
                            const templateLevel3 = Handlebars.compile(sourceLevel3);
                            const htmlLevel3     = templateLevel3({
                                Total_Debit_l3  : gettoFixed($Total_Debit_l3),
                                Total_Credit_l3 : gettoFixed($Total_Credit_l3),
                                l3_name         : $l3_name,
                                "TOTAL_HEAD"    : $l3_name + " " + "TOTAL"
                            });
                            saleRows.append(htmlLevel3);
                            $Total_Debit_l3  = 0;
                            $Total_Credit_l3 = 0;
                            $serial_l3       = 0;
                        }
                    }

                    if ($serial_l2 !== 0) {
                        const sourceLevel2   = $("#voucher-level2-sum-template").html();
                        const templateLevel2 = Handlebars.compile(sourceLevel2);
                        const htmlLevel2     = templateLevel2({
                            Total_Debit_l2  : gettoFixed($Total_Debit_l2),
                            Total_Credit_l2 : gettoFixed($Total_Credit_l2),
                            l2_name         : $l2_name,
                            "TOTAL_HEAD"    : $l2_name + " " + "TOTAL"
                        });
                        saleRows.append(htmlLevel2);
                        $Total_Debit_l2  = 0;
                        $Total_Credit_l2 = 0;
                        $serial_l2       = 0;
                    }
                    const sourceLevel2   = $("#voucher-level2-name-template").html();
                    const templateLevel2 = Handlebars.compile(sourceLevel2);
                    const htmlLevel2     = templateLevel2({
                        LEVEL2ID   : elem.account_id.slice(0, 4),
                        LEVEL2NAME : elem.level2_name
                    });
                    saleRows.append(htmlLevel2);
                    $l2_id   = elem.level2_id;
                    $l2_name = elem.level2_name;
                }
                // level3 data
                if ($l3_id !== elem.level3_id) {
                    if ($serial_l3 !== 0) {
                        const sourceLevel3   = $("#voucher-level3-sum-template").html();
                        const templateLevel3 = Handlebars.compile(sourceLevel3);
                        const htmlLevel3     = templateLevel3({
                            Total_Debit_l3  : gettoFixed($Total_Debit_l3),
                            Total_Credit_l3 : gettoFixed($Total_Credit_l3),
                            l3_name         : $l3_name,
                            "TOTAL_HEAD"    : $l3_name + " " + "TOTAL"
                        });
                        saleRows.append(htmlLevel3);
                        $Total_Debit_l3  = 0;
                        $Total_Credit_l3 = 0;
                        $serial_l3       = 0;
                    }
                    const sourceLevel3Value   = $("#voucher-level3-name-template").html();
                    const templateLevel3Value = Handlebars.compile(sourceLevel3Value);
                    const htmlLevel3Value     = templateLevel3Value({
                        LEVEL3ID   : elem.account_id.slice(0, 8),
                        LEVEL3NAME : elem.level3_name
                    });
                    saleRows.append(htmlLevel3Value);
                    $l3_id   = elem.level3_id;
                    $l3_name = elem.level3_name;
                }

                const obj        = {};
                obj.RowCounter   = rowCounter++;
                obj.ACCOUNT_ID   = elem.account_id;
                obj.ACCOUNT_NAME = elem.name;
                obj.PARTY_ID     = elem.pid;
                obj.DURINGCREDIT = (elem.credit !== 0 ? gettoFixed(elem.credit) : 0);
                obj.DURINGDIBET  = (elem.debit !== 0 ? gettoFixed(elem.debit) : 0);

                const templateMainRow = Handlebars.compile(td1);
                const htmlMainRow     = templateMainRow(obj);
                saleRows.append(htmlMainRow);

                $Total_Debit += parseNumber(elem.debit);
                $Total_Credit += parseNumber(elem.credit);
                $Total_Debit_l1 += parseNumber(elem.debit);
                $Total_Credit_l1 += parseNumber(elem.credit);
                $Total_Debit_l2 += parseNumber(elem.debit);
                $Total_Credit_l2 += parseNumber(elem.credit);
                $Total_Debit_l3 += parseNumber(elem.debit);
                $Total_Credit_l3 += parseNumber(elem.credit);

                $serial_l1 += 1;
                $serial_l2 += 1;
                $serial_l3 += 1;
            });

            if ($serial_l3 !== 0) {
                const sourceLevel3Sum   = $("#voucher-level3-sum-template").html();
                const templateLevel3Sum = Handlebars.compile(sourceLevel3Sum);
                const htmlLevel3Sum     = templateLevel3Sum({
                    Total_Debit_l3  : gettoFixed($Total_Debit_l3),
                    Total_Credit_l3 : gettoFixed($Total_Credit_l3),
                    l3_name         : $l3_name,
                    "TOTAL_HEAD"    : $l3_name + " " + "TOTAL"
                });
                saleRows.append(htmlLevel3Sum);
                $Total_Debit_l3  = 0;
                $Total_Credit_l3 = 0;
                $serial_l3       = 0;
            }
            if ($serial_l2 !== 0) {
                const sourceLevel2Sum   = $("#voucher-level2-sum-template").html();
                const templateLevel2Sum = Handlebars.compile(sourceLevel2Sum);
                const htmlLevel2Sum     = templateLevel2Sum({
                    Total_Debit_l2  : gettoFixed($Total_Debit_l2),
                    Total_Credit_l2 : gettoFixed($Total_Credit_l2),
                    l2_name         : $l2_name,
                    "TOTAL_HEAD"    : $l2_name + " " + "TOTAL"
                });
                saleRows.append(htmlLevel2Sum);
                $Total_Debit_l2  = 0;
                $Total_Credit_l2 = 0;
                $serial_l2       = 0;
            }
            if ($serial_l1 !== 0) {
                const sourceLevel1Sum   = $("#voucher-level1-sum-template").html();
                const templateLevel1Sum = Handlebars.compile(sourceLevel1Sum);
                const htmlLevel1Sum     = templateLevel1Sum({
                    Total_Debit_l1  : gettoFixed($Total_Debit_l1),
                    Total_Credit_l1 : gettoFixed($Total_Credit_l1),
                    l1_name         : $l1_name,
                    "TOTAL_HEAD"    : $l1_name + " " + "TOTAL"
                });
                saleRows.append(htmlLevel1Sum);
                $Total_Debit_l1  = 0;
                $Total_Credit_l1 = 0;
                $serial_l1       = 0;
            }
            const sourceGrandTotal   = $("#voucher-grand-sum-template").html();
            const templateGrandTotal = Handlebars.compile(sourceGrandTotal);
            const htmlGrandTotal     = templateGrandTotal({
                Total_Debit  : gettoFixed($Total_Debit),
                Total_Credit : gettoFixed($Total_Credit),
                "TOTAL_HEAD" : "GRAND TOTAL"
            });
            saleRows.append(htmlGrandTotal);
            $(".net-debit").html(parseNumber($Total_Debit).toFixed(AMOUNT_ROUNDING)).digits();
            $(".net-credit").html(parseNumber($Total_Credit).toFixed(AMOUNT_ROUNDING)).digits();
        }
        $("td.text-right").digits();
        bindGrid();
    };
    const bindGrid                  = function () {
        cashFlowReport.accountLedgerDataTable = cashFlowTableInstance.dataTable({
            processing        : true,
            "sDom"            : "<if<t>lp>",
            "bPaginate"       : false,
            "bFilter"         : true,
            "autoWidth"       : false,
            "fixedHeader"     : true,
            "sPaginationType" : "full_numbers",
            "bJQueryUI"       : false,
            "bSort"           : false,
            "iDisplayLength"  : 100,
            "oTableTools"     : {
                "sSwfPath" : "js/copy_cvs_xls_pdf.swf",
                "aButtons" : [{
                    "sExtends"    : "print",
                    "sButtonText" : "Print Report",
                    "sMessage"    : "Inventory Report"
                }]
            },
            buttons           : [{
                extend        : "copyHtml5",
                className     : "btn btn-outline-secondary btn-copy-excel",
                text          : "F3 Copy to clipboard",
                titleAttr     : "Copy to clipboard",
                exportOptions : { rows : ":visible" }
            }, {
                extend        : "excelHtml5",
                className     : "btn btn-outline-info btn-export-excel",
                text          : "F8 Excel",
                titleAttr     : "Export to Excel",
                exportOptions : {
                    rows   : ":visible",
                    format : {
                        body : function (data, row, column, node) {
                            // Strip $ from salary column to make it numeric
                            if (column === 2) {
                                return data.replace(/[$,]/g, "");
                            } else if ($(node).hasClass("text-account-ledger-total") === true) {
                                return data.replace(/[$,]/g, "");
                            } else {
                                return $.trim($(node).text());
                            }
                        }
                    }
                }
            }],
            "dom"             : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>"
        });
        $(".nav-light > a.tool-action").off("click").on("click", function () {
            const action = $(this).attr("data-action");
            cashFlowReport.accountLedgerDataTable.DataTable().button(action).trigger("click");
        });
        $(".buttons-colvis").on("click", function () {
            $(".dt-button-collection").css({
                "display" : "block",
                "top"     : "499px",
                "left"    : "609.203px"
            });
            $(".div.dt-button-collection").css("width", "161px");
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            "s`" : "dataTables_wrapper form-inline form-input-class"
        });
    };
    $.fn.digits                     = function () {
        return this.each(function () {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        });
    };
    const printReport               = (type) => {
        const from_date = getSqlFormattedDate(fromDateInstance.val());
        const to_date   = getSqlFormattedDate(toDateInstance.val());
        const pid       = accountDropdownInstance.val();
        const pidArray  = pid.join(",");
        const newUrl    = `${base_url}/doc/printCashFlowReport?from_date=${from_date}&to_date=${to_date}&pid=${pidArray}&type=${type}`;
        openPrintOnSettingConfiguration(newUrl);
    };
    return {
        init       : function () {
            this.bindUI();
        },
        bindUI     : function () {
            const self = this;
            $("#from_date").datepicker("update", $("#sdate").val());
            $("#to_date").datepicker("update", $("#edate").val());
            $(".modal-lookup .populateAccount").on("click", function () {
                const party_id = $(this).closest("tr").find("input[name=hfModalPartyId]").val();
                $("#accountDropdown").select2("val", party_id);
            });
            $(".btnSearch").on("click", async function (e) {
                e.preventDefault();
                const error1 = general.validateFinancialDate($("#from_date").val(), $("#to_date").val());
                if (! error1) {
                    await self.initSearch();
                }
            });
            shortcut.add("F3", function () {
                $(".copy5 ").get()[0].click();
            });
            shortcut.add("F8", function () {
                $(".excel8 ").get()[0].click();
            });
            shortcut.add("F10", function () {
                $(".csv10 ").get()[0].click();
            });
            $(".btnReset").on("click", function (e) {
                e.preventDefault();
                general.reloadWindow();
            });
            $(".btnPrint").on("click", function (e) {
                e.preventDefault();
                const error1 = general.validateFinancialDate($("#from_date").val(), $("#to_date").val());
                if (! error1) {
                    printReport();
                    // fetchEmail(party_id);
                }
            });
            shortcut.add("F9", function () {
                $(".btnPrint").get()[0].click();
            });
            shortcut.add("F6", function () {
                $(".btnSearch").get()[0].click();
            });
            shortcut.add("F5", function () {
                general.reloadWindow();
            });
        },
        initSearch : async function () {
            await disableSearchButton("#searchButton");
            const error = getValidateSearch();
            if (! error) {
                const _from      = getSqlFormattedDate($("#from_date").val());
                const _to        = getSqlFormattedDate($("#to_date").val());
                const _pid       = accountDropdownInstance.val().join(",");
                const languageId = $("input[name=\"languagename\"]:checked").val();
                await getCashFlowOpeningBalance(_from, _pid);
                await getCashFlowClosingBalance(_to, _pid);
                await getCashFlowReportData(_from, _to, _pid, languageId);
            } else {
                AlertComponent.getAlertMessage({
                    "title"   : "Error!",
                    "message" : "Correct the error!",
                    "type"    : "danger"
                });
            }
            await enableSearchButton("#searchButton");
        }
    };
};
const cashFlowReport = new CashFlowReport();
cashFlowReport.init();

// Usage
$(function () {
    new DynamicOption("#accountDropdown", {
        requestedUrl    : dropdownOptions.getCashFlowAccountDropdown,
        placeholderText : "Choose Account",
        isAccountLedger : 1
    });
});
