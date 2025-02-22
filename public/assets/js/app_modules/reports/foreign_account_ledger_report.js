"use strict";
import AlertComponent                                                                                                    from "../../../../js/components/AlertComponent.js";
import DynamicOption                                                                                                     from "../../../../js/components/DynamicOption.js";
import { dropdownOptions }                                                                                               from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest }                                                                                               from "../../../../js/components/MakeAjaxRequest.js";
import { disableButton, doLoading, enableDisableButton, ifNull, parseNumber, setFinancialYearDate, updateFormattedDate } from "../commonFunctions/CommonFunction.js";

const ForeignAccountLedger = function () {
    const grandTotalSelector                          = ".grand-total";
    const openingBalanceSelector                      = ".opening-bal";
    const netDebitSelector                            = ".net-debit";
    const netCreditSelector                           = ".net-credit";
    const runningTotalSelector                        = ".running-total";
    const pdcTotalSelector                            = ".pdc-total";
    const fromDateSelector                            = "#from_date";
    const toDateSelector                              = "#to_date";
    const accountDropdownSelector                     = "#accountDropdown";
    const buttonSearchSelector                        = ".btnSearch";
    const buttonResetSelector                         = ".btnReset";
    const buttonPrintSelector                         = ".btnPrint";
    // table selector
    const foreignAccountLedgerDataTableSelector       = "#foreignAccountLedgerDataTable";
    const foreignAccountLedgerDataTableHeadSelector   = "#foreignAccountLedgerDataTableHead";
    const foreignAccountLedgerDataTableBodySelector   = "#foreignAccountLedgerDataTableBody";
    const foreignAccountLedgerDataTableFooterSelector = "#foreignAccountLedgerDataTableFooter";
    const voucherSumTemplateSelector                  = "#voucher-sum-template";

    // instance variables
    const grandTotalInstance                          = $(grandTotalSelector);
    const openingBalanceInstance                      = $(openingBalanceSelector);
    const netDebitInstance                            = $(netDebitSelector);
    const netCreditInstance                           = $(netCreditSelector);
    const runningTotalInstance                        = $(runningTotalSelector);
    const pdcTotalInstance                            = $(pdcTotalSelector);
    const fromDateInstance                            = $(fromDateSelector);
    const toDateInstance                              = $(toDateSelector);
    const accountDropdownInstance                     = $(accountDropdownSelector);
    const buttonSearchInstance                        = $(buttonSearchSelector);
    const buttonResetInstance                         = $(buttonResetSelector);
    const buttonPrintInstance                         = $(buttonPrintSelector);
    // table instance
    const foreignAccountLedgerDataTableInstance       = $(foreignAccountLedgerDataTableSelector);
    const foreignAccountLedgerDataTableHeadInstance   = $(foreignAccountLedgerDataTableHeadSelector);
    const foreignAccountLedgerDataTableBodyInstance   = $(foreignAccountLedgerDataTableBodySelector);
    const foreignAccountLedgerDataTableFooterInstance = $(foreignAccountLedgerDataTableFooterSelector);

    const dataSet = {
        ID                : "id",
        VRNOA             : "vrnoa",
        VRDATE            : "vrdate",
        NAME              : "name",
        DESCRIPTION       : "foreign_description",
        DESCRIPTION2      : "description2",
        FOREIGN_DEBIT     : "foreign_debit",
        FOREIGN_CREDIT    : "foreign_credit",
        ETYPE             : "etype",
        ETYPE_ABBREVIATES : "etype_abbreviates",
        IS_TALLIED        : "is_tallied",
        LEDGER_BALANCE    : "ledgerBalance"
    };

    const getAccountOpeningBalance = async (startDate, accountId) => {
        doLoading(true);
        await disableButton("#searchButton");
        try {
            const response = await makeAjaxRequest("GET", `${base_url}/foreignAccountLedger/getForeignAccountOpeningBalance`, {
                startDate,
                accountId
            });
            if (response && response.status === false) {
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : response.message,
                    type    : "danger"
                });
            } else if (response && response.status === true) {
                $(".opening-bal").html(parseNumber(response.data).toFixed(AMOUNT_ROUNDING)).digits();
            }
        } catch (e) {
            console.warn("Error:", e);
        } finally {
            doLoading(false);
            await enableDisableButton("#searchButton");
        }
    };
    const _getNumberOfString       = (n) => {
        const _N = $.trim(n).toString().replace(/,/g, "");
        return isNaN(parseFloat(_N)) ? 0 : parseFloat(_N);
    };
    const getValidateSearch        = () => {
        $(".inputerror").removeClass("inputerror");
        let errorFlag   = false;
        const fromDate  = getSqlFormattedDate(fromDateInstance.val());
        const toDate    = getSqlFormattedDate(toDateInstance.val());
        const accountId = parseNumber(accountDropdownInstance.val());

        if (fromDate === "" || fromDate === null) {
            fromDateSelector.addClass("inputerror");
            errorFlag = true;
        }
        if (toDate === "" || toDate === null) {
            toDateInstance.addClass("inputerror");
            errorFlag = true;
        }
        if (parseNumber(accountId) === 0) {
            $("#select2-accountDropdown-container").parent().addClass("inputerror");
            errorFlag = true;
        }
        if (fromDate > toDate) {
            toDateInstance.addClass("inputerror");
            alert("Starting date must Be less than ending date.........");
            errorFlag = true;
        }
        return errorFlag;
    };

    const getAccountLedgerReportData = async (startDate, endDate, accountId) => {
        doLoading(true);
        await disableButton(buttonSearchSelector);
        grandTotalInstance.html(0);
        netDebitInstance.html(0);
        netCreditInstance.html(0);
        runningTotalInstance.html(0);
        pdcTotalInstance.html(0);
        try {
            if (typeof foreignAccountLedger.accountLedgerDataTable != "undefined") {
                foreignAccountLedger.accountLedgerDataTable.fnDestroy();
                foreignAccountLedgerDataTableBodyInstance.empty();
                foreignAccountLedgerDataTableFooterInstance.empty();
            }
            const response = await makeAjaxRequest("GET", `${base_url}/foreignAccountLedger/getForeignAccountLedger`, {
                startDate,
                endDate,
                accountId
            });
            if (response && response.status === false) {
                const openingBalance = $(".opening-bal").text();
                $(".running-total").text(openingBalance);
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : response.message,
                    type    : "danger"
                });
            } else if (response && response.status === true) {
                populateAccountLedgerData(response.data);
            }
        } catch (error) {
            console.warn("Error:", error);
        } finally {
            doLoading(false);
            await enableDisableButton(buttonSearchSelector);
        }
    };

    const populateAccountLedgerData = (result) => {
        if (result === false) {
            grandTotalInstance.html(parseNumber(openingBalanceInstance.text()));
        }

        if (result.length !== 0 || result !== false) {
            const th  = $("#general-head-template").html();
            const td1 = $("#voucher-item-template").html();

            const templateTh = Handlebars.compile(th);
            const htmlTh     = templateTh({});
            foreignAccountLedgerDataTableHeadInstance.html(htmlTh);

            let totalDebit   = 0;
            let totalCredit  = 0;
            let totalBalance = 0;
            let netDebit     = 0;
            let netCredit    = 0;
            let netBalance   = 0;
            let serialNumber = 1;

            $.each(result, function (index, elem) {
                const obj                  = {};
                const voucherNumber        = elem[dataSet.VRNOA];
                const voucherDate          = elem[dataSet.VRDATE];
                const voucherDescription   = elem[dataSet.DESCRIPTION];
                const voucherDebit         = elem[dataSet.FOREIGN_DEBIT];
                const voucherCredit        = elem[dataSet.FOREIGN_CREDIT];
                const etype                = elem[dataSet.ETYPE];
                const etypeAbbreviates     = ifNull(elem[dataSet.ETYPE_ABBREVIATES], "");
                // calculate the ledger balance
                const openingBalance       = parseNumber(_getNumberOfString(openingBalanceInstance.text()));
                const voucherLedgerBalance = parseNumber(elem[dataSet.LEDGER_BALANCE]) + parseNumber(openingBalance);
                // check if the row is tallied
                const isTallied            = (parseNumber(elem[dataSet.IS_TALLIED]) > 0) ? "highlightedTalliedRow" : "";

                obj.SERIAL         = serialNumber++;
                obj.pledid         = ifNull(elem.id);
                obj.VRNOA          = ifNull(voucherNumber, "-");
                obj.VRDATE         = updateFormattedDate(voucherDate);
                obj.ISTALLIED      = isTallied;
                obj.ISDEBIT_CREDIT = ((parseNumber(voucherLedgerBalance) > 0) ? "Dr" : "Cr");
                obj.IS_PIN         = "<span><i class=\"fa fa-thumb-tack\"></i><span>";
                if ((etype || "").toLowerCase() !== "") {
                    obj.VRNOA = `<a data-etype="${etype}" data-vrnoa="${voucherNumber}" data-toggle="modal" id="purchaseView" data-target="#purchaseVoucher" href="#" data-requestname="getPurchaseVoucherData">${voucherNumber}  - ${etypeAbbreviates}</a>`;
                } else {
                    obj.VRNOA = voucherNumber + "-" + etypeAbbreviates;
                }
                obj.DESCRIPTION = (voucherDescription || "").replace(/,\s*$/, "");
                obj.DEBIT       = parseNumber(voucherDebit).toFixed(AMOUNT_ROUNDING);
                obj.CREDIT      = parseNumber(voucherCredit).toFixed(AMOUNT_ROUNDING);
                obj.BALANCE     = parseNumber(voucherLedgerBalance).toFixed(AMOUNT_ROUNDING);
                // Add the item of the new voucher
                const template  = Handlebars.compile(td1);
                const html      = template(obj);
                foreignAccountLedgerDataTableBodyInstance.append(html);

                totalDebit += parseNumber(voucherDebit);
                totalCredit += parseNumber(voucherCredit);
                totalBalance = parseNumber(totalDebit) - parseNumber(totalCredit);
                netDebit     = parseNumber(totalDebit) + parseNumber((openingBalance > 0) ? openingBalance : 0);
                netCredit    = parseNumber(totalCredit) + parseNumber((openingBalance < 0) ? Math.abs(openingBalance) : 0);
                netBalance   = parseNumber(netDebit) - parseNumber(netCredit);

                if (index === (result.length - 1)) {
                    let source   = $(voucherSumTemplateSelector).html();
                    let template = Handlebars.compile(source);
                    let html     = template({
                        "TOTAL_HEAD"          : "Period Total",
                        VOUCHER_TOTAL_DEBIT   : totalDebit.toFixed(AMOUNT_ROUNDING),
                        VOUCHER_TOTAL_CREDIT  : totalCredit.toFixed(AMOUNT_ROUNDING),
                        VOUCHER_TOTAL_BALANCE : totalBalance.toFixed(AMOUNT_ROUNDING)
                    });
                    foreignAccountLedgerDataTableFooterInstance.append(html);

                    let source1   = $(voucherSumTemplateSelector).html();
                    let template1 = Handlebars.compile(source1);
                    let html1     = template1({
                        "TOTAL_HEAD"          : "GRAND TOTAL",
                        VOUCHER_TOTAL_DEBIT   : netDebit.toFixed(AMOUNT_ROUNDING),
                        VOUCHER_TOTAL_CREDIT  : netCredit.toFixed(AMOUNT_ROUNDING),
                        VOUCHER_TOTAL_BALANCE : netBalance.toFixed(AMOUNT_ROUNDING)
                    });
                    foreignAccountLedgerDataTableFooterInstance.append(html1);
                }
                netDebitInstance.html(parseNumber(totalDebit).toFixed(AMOUNT_ROUNDING)).digits();
                netCreditInstance.html(parseNumber(totalCredit).toFixed(AMOUNT_ROUNDING)).digits();
            });

            const opening = parseNumber(_getNumberOfString(openingBalanceInstance.text()));
            const debit   = parseNumber(_getNumberOfString(netDebitInstance.text()));
            const credit  = parseNumber(_getNumberOfString(netCreditInstance.text()));
            const balance = parseNumber(opening) + parseNumber(debit) - parseNumber(credit);
            runningTotalInstance.html(parseNumber(balance).toFixed(AMOUNT_ROUNDING)).digits();
        }
        $("td.text-right").digits();
        bindGrid();
    };
    const bindGrid                  = function () {
        foreignAccountLedger.accountLedgerDataTable = $(foreignAccountLedgerDataTableSelector).dataTable({
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
            foreignAccountLedger.accountLedgerDataTable.DataTable().button(action).trigger("click");
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
    const fetchPartyBalance         = async function (pid) {
        doLoading(true);
        try {
            const response = await makeAjaxRequest("GET", `${base_url}/account/getAccountById`, { pid });
            if (response && response.status === false) {
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : response.message,
                    type    : "danger"
                });
            } else if (response && response.status === true) {
                triggerAndRenderOptions(accountDropdownInstance, response.name, response.pid);
            }
        } catch (error) {
            console.warn("Error:", error);
        } finally {
            doLoading(false);
        }
    };
    const fetchRequestedVr          = async () => {
        const accountId = parseNumber(general.getQueryStringVal("account_id"));
        setFinancialYearDate();
        if (accountId > 0) {
            await fetchPartyBalance(accountId);
            buttonSearchInstance.trigger("click");
        }
    };

    const printReport    = () => {
        const error = getValidateSearch();
        if (! error) {
            const startDate   = fromDateInstance.val();
            const endDate     = toDateInstance.val();
            const accountId   = accountDropdownInstance.val();
            const languageId  = 1;
            const printHeader = $("input[name=\"printheader\"]:checked").val();
            const printURL    = `${base_url}/doc/getAccountLedgerPDF?startDate=${startDate}&endDate=${endDate}&accountId=${accountId}&language_id=${languageId}&paperSize=${printHeader}`;
            openPrintOnSettingConfiguration(printURL);
        } else {
            alert("Correct the errors...");
        }
    };
    const validateEmailS = function (sEmail) {
        $("#txtEmailPdf").removeClass("inputerror");
        var emails = sEmail.split(",");
        var valid  = true;
        var regex  = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        for (var i = 0; i < emails.length; i++) {
            if (emails[i] === "" || ! regex.test(emails[i].replace(/\s/g, ""))) {
                valid = false;
            }
        }
        if ($("#txtEmailPdf").val().length < 1) {
            $("#txtEmailPdf").addClass("inputerror");
        }
        return valid;
    };

    /**
     * Toggles the tally status of a ledger row and updates its appearance based on the result.
     * @param {jQuery} trow - jQuery object representing the table row.
     * @param {number} flag - Indicator of whether the row is currently tallied (1 or 0).
     * */
    const getTallyLedgerRow = async (trow, flag = 0) => {
        const isFlagClass = (parseNumber(flag) == 0) ? "" : "highlightedTalliedRow";
        trow.removeClass("highlightedTalliedRow");
        try {
            const accountLedgerId = trow.find("td.pvrnoa").data("pledid");  // Extract ledger ID from data attribute.
            const response        = await makeAjaxRequest("put", `${base_url}/accountLedger/getTallyLedgerRow`, {
                accountLedgerId : accountLedgerId,
                isAlreadyTally  : flag
            });

            if (response && response.status === true) {
                // Successful operation
                AlertComponent.getAlertMessage({
                    title   : "Successfully!",
                    message : response.message,
                    type    : "success"
                });
                trow.addClass(isFlagClass);  // Re-apply class if operation was successful.
            } else if (response && response.error) {
                // Specific error handling
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : response.error,
                    type    : "danger"
                });
            } else {
                // General information message for other cases
                AlertComponent.getAlertMessage({
                    title   : "Information!",
                    message : response.message,
                    type    : "info"
                });
            }
        } catch (error) {
            console.error("Failed to update tally status:", error);
            AlertComponent.getAlertMessage({
                title   : "Error!",
                message : "Failed to process your request.",
                type    : "danger"
            });
        }
    };
    var fetchEmail          = function (pid) {
        $.ajax({
            url      : base_url + "/customer/fetchEmail",
            type     : "POST",
            data     : { "pid" : pid },
            dataType : "JSON",
            async    : false,
            success  : function (data) {
                if (data !== false) {
                    $("#txtEmailPdf").val(data[0].email);
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    function debounce(func, wait) {
        let timeout;

        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    return {
        init       : async function () {
            await this.bindUI();
        },
        bindUI     : async function () {
            const self = this;
            fromDateInstance.datepicker("update", $("#sdate").val());
            toDateInstance.datepicker("update", $("#edate").val());
            $(".modal-lookup .populateAccount").on("click", function () {
                var party_id = $(this).closest("tr").find("input[name=hfModalPartyId]").val();
                $("#accountDropdown").select2("val", party_id);
            });
            $(document.body).on("click", buttonSearchSelector, async function (e) {
                e.preventDefault();
                if (! general.validateFinancialDate($("#from_date").val(), $("#to_date").val())) {
                    await self.initSearch();
                }
            });
            $(document.body).on("click", buttonResetSelector, function (e) {
                e.preventDefault();
                general.reloadWindow();
            });
            $(document.body).on("click", buttonPrintSelector, function (e) {
                e.preventDefault();
                if (! general.validateFinancialDate($("#from_date").val(), $("#to_date").val())) {
                    const party_id = $.trim($("#accountDropdown").val());
                    printReport(1);
                    fetchEmail(party_id);
                }
            });
            shortcut.add("F6", function () {
                buttonSearchInstance.get()[0].click();
            });
            shortcut.add("F5", function () {
                buttonResetInstance.get()[0].click();
            });
            shortcut.add("F9", function () {
                buttonPrintInstance.get()[0].click();
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
            $(document.body).on("dblclick", "foreignAccountLedgerDataTable tbody tr tr.istally_row", async function (e) {
                const highlightedTalliedRow = $(this).hasClass("highlightedTalliedRow");
                if (highlightedTalliedRow) {
                    await getTallyLedgerRow($(this), 0);
                } else {
                    if (confirm("Are you sure to mark this row?")) {
                        await getTallyLedgerRow($(this), 1);
                    }
                }
            });
            $(document.body).on("click", "#foreignAccountLedgerDataTable tbody tr td button.text-istally-row", async function (e) {
                e.preventDefault();
                const highlightedTalliedRow = $(this).closest("tr").hasClass("highlightedTalliedRow");
                if (highlightedTalliedRow) {
                    await getTallyLedgerRow($(this).closest("tr"), 0);
                } else {
                    if (confirm("Are you sure to mark this row?")) {
                        await getTallyLedgerRow($(this).closest("tr"), 1);
                    }
                }
            });
            await fetchRequestedVr();
        },
        initSearch : async function () {
            if (! getValidateSearch()) {
                const _from      = getSqlFormattedDate($("#from_date").val());
                const _to        = getSqlFormattedDate($("#to_date").val());
                const _pid       = $("#accountDropdown").val();
                const languageId = $("input[name=\"languagename\"]:checked").val();
                await getAccountOpeningBalance(_from, _pid);
                await getAccountLedgerReportData(_from, _to, _pid, languageId);
            } else {
                AlertComponent.getAlertMessage({
                    "title"   : "Error!",
                    "message" : "Correct the error!",
                    "type"    : "danger"
                });
            }
        }
    };
};
const foreignAccountLedger = new ForeignAccountLedger();
await foreignAccountLedger.init();
$(function () {
    new DynamicOption("#accountDropdown", {
        requestedUrl    : dropdownOptions.getAccountDetailAll,
        placeholderText : "Choose Account",
        isAccountLedger : 1
    });
});
