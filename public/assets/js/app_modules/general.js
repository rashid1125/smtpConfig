const getAccountBalanced = async (accountId, voucherDate, AccountType = "", accountDropdownId = "") => {
    $(".loader").show();
    try {
        const response = await $.ajax({
            url     : base_url + "/account/getAccountBalanced",
            method  : "GET", // Change to GET method
            data    : {
                "pid"    : accountId,
                "vrdate" : voucherDate
            },
            headers : {
                "Content-Type" : "application/json",
                "X-CSRF-TOKEN" : $("meta[name=\"csrf-token\"]").attr("content")
            }
        });

        if (response.status === false && response.error !== "") {
            _getAlertMessage("Error!", response.message, "danger");
        } else if (response.status === false && response.message !== "") {
            _getAlertMessage("Information!", response.message, "info");
        } else {
            const data = response.data;
            triggerAndRenderOptions($(accountDropdownId), data.name, data.pid);
            var city         = data.city || "-";
            var address      = data.address || "-";
            var city_address = data.cityarea || "-";
            var mobile       = data.mobile || "-";
            var Balance      = data.balance || 0;
            if (AccountType === "Cash") {
                $("#cash_balance").html("Cash Balance is " + Balance + "  <br/>" + city + " <br/>" + address + " " + city_address + "<br/> " + mobile);
            } else if (AccountType === "debit") {
                $("#party_p1").html(" Balance is " + Balance + "  <br/>" + city + " <br/>" + address + " " + city_address + "<br/> " + mobile);
            } else if (AccountType === "credit") {
                $("#party_p2").html(" Balance is " + Balance + "  <br/>" + city + " <br/>" + address + " " + city_address + "<br/> " + mobile);
            } else {
                $("#party_p").html(" Balance is " + Balance + "  <br/>" + city + " <br/>" + address + " " + city_address + "<br/> " + mobile);
            }

            $("#saleOfficerDropdown").val("").trigger("change.select2");
            $("#gridItemCurrencyDropdown").val("").trigger("change.select2");
            if ($("#saleOfficerDropdown").is(":visible") && data.sale_officer) {
                triggerAndRenderOptions($("#saleOfficerDropdown"), data.sale_officer.name, data.sale_officer.id);
            }
            if ($("#gridItemCurrencyDropdown").is(":visible") && data.currency) {
                triggerAndRenderOptions($("#gridItemCurrencyDropdown"), data.currency.name, data.currency.id);
            }
        }
    } catch (error) {
        console.log("Error:", error);
    } finally {
        $(".loader").hide();
    }
};

let searchAccountLookUpModalTable = undefined;
const getAccountLookUpRecord      = (voucherType = "") => {
    if (typeof searchAccountLookUpModalTable !== "undefined") {
        searchAccountLookUpModalTable.destroy();
        $("#AccountLookUpModalTable tbody").empty();
    }
    searchAccountLookUpModalTable = $("#AccountLookUpModalTable").DataTable({
        serverSide : true,
        ajax       : {
            url  : base_url + "/account/getAccountListViewRecord",
            data : function (data) {
                data.params = {
                    sac         : "",
                    voucherType : voucherType
                };
            }
        },
        autoWidth  : false,
        buttons    : true,
        searching  : true,
        createdRow : function (row, data, dataIndex) {
            $(row).addClass("group item-row-td hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50");
            $("td", row).addClass("py-1 px-1 text-md align-middle");
        },
        columns    : [{
            data        : "name",
            className   : "name",
            createdCell : function (td, cellData, rowData, row, col) {
                $(td).attr("data-account_id", rowData.pid);
            }
        }, {
            data : "mobile",
            name : "parties.mobile"
        }, {
            data : "city",
            name : "parties.city"
        }, {
            data       : null,
            className  : "select text-right",
            searchable : false,
            orderable  : false,
            render     : function (data, type, row) {
                return `<button type="button" class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-middle flex-1 populateAccountLookUp" data-pid="${data.pid}" data-name="${data.name}"><i class='fa fa-check'></i></button>`;
            }
        }]
    });
    $("#AccountLookUpModal").modal("show");
};

let searchItemLooupListViewTable = undefined;
const getItemLookUpRecord        = (voucherType = "", itemType = "") => {
    if (typeof searchItemLooupListViewTable !== "undefined") {
        searchItemLooupListViewTable.destroy();
        $("#itemLookupTable tbody").empty();
    }
    searchItemLooupListViewTable = $("#itemLookupTable").DataTable({
        processing : true,
        serverSide : true,
        ajax       : {
            url  : base_url + "/item/getItemListViewRecord",
            data : function (data) {
                data.params = {
                    sac         : "",
                    voucherType : voucherType,
                    itemType    : itemType
                };
            }
        },
        autoWidth  : false,
        buttons    : true,
        searching  : true,
        createdRow : function (row, data, dataIndex) {
            $(row).addClass("group item-row-td hover:bg-slate-200 hover:text-black odd:bg-white even:bg-slate-50");
            $("td", row).addClass("py-2 px-2 text-md align-middle");
        },
        columns    : [{
            data       : null,
            className  : "select",
            searchable : false,
            orderable  : false,
            render     : function (data, type, row, meta) {
                return meta.row + 1;
            }
        }, {
            data      : "item_type",
            name      : "items.item_type",
            className : "item_type"
        }, {
            data      : "category_name",
            name      : "categories.name",
            className : "text-left category_name"
        }, {
            data      : "subcategory_name",
            name      : "sub_categories.name",
            className : "subcategory_name"
        }, {
            data      : "brand_name",
            name      : "brands.name",
            className : "brand_name"
        }, {
            data      : "item_des",
            name      : "items.item_des",
            className : "item_des"
        }, {
            data      : "cost_price",
            name      : "items.cost_price",
            className : "cost_price"
        }, {
            data      : "srate",
            name      : "items.srate",
            className : "srate"
        }, {
            data       : null,
            className  : "select text-right",
            searchable : false,
            orderable  : false,
            render     : function (data, type, row) {
                return `<button type="button" class="btn btn-sm btn-outline-primary mr-2 mb-2 flex-1 populateItem  w-16 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-middle" data-itemid="${data.item_id}"><i class='fa fa-edit'></i></button>`;
            }
        }]
    });
    $("#item-lookup").modal("show");
};

const handleObjectName        = (data, objectName) => {
    if (data[objectName]) {
        return data[objectName];
    }
    return null;
};
const triggerAndRenderOptions = ($selectElement, text, id, triggerChange = true, triggerDisabled = false, checkOptionExist = false) => {
    // Clear existing options
    if (! checkOptionExist) {
        $selectElement.empty();
    }
    // Create and append the option with the specified value
    var option = new Option(text, id, true, true);
    $selectElement.append(option);
    // Trigger the change event only if specified
    if (triggerChange) {
        $selectElement.trigger("change");
    } else {
        $selectElement.trigger("change.select2");
    }

    $selectElement.prop("disabled", triggerDisabled).trigger("change.select2");
};

/**
 * _getAlertMessage
 *
 * Displays an alert message as a notification using the jQuery "notify" plugin.
 *
 * @param {string} title The title of the message. Defaults to "Error" if not specified.
 * @param {string} message The message content. Defaults to an empty string if not specified.
 * @param {string} type The type of alert. Can be "success", "info", "warning", or "danger". Defaults to "danger" if not specified.
 * @param {number} duration The duration of the alert message in milliseconds before it disappears. Defaults to 3000 milliseconds (3 seconds) if not specified.
 *
 * @throws {Error} If the type parameter is not a valid alert type.
 */
const _getAlertMessage = (title = "Error", message = "", type = "danger", duration = 3000) => {
    const validTypes = ["success", "info", "warning", "danger"];

    if (! validTypes.includes(type)) {
        throw new Error(`Invalid alert type: "${type}".`);
    }

    $.notify({
        // options
        title   : `<strong>${title}</strong>`,
        message : `<br>${message}`,
        icon    : "glyphicon glyphicon-remove-sign"
    }, {
        // settings
        element         : "body",
        position        : null,
        type            : type,
        allow_dismiss   : true,
        newest_on_top   : false,
        showProgressbar : false,
        placement       : {
            from  : "top",
            align : "center"
        },
        offset          : 20,
        spacing         : 10,
        z_index         : 999999,
        delay           : 3300,
        timer           : duration,
        url_target      : "_blank",
        mouse_over      : null,
        onShow          : null,
        onShown         : null,
        onClose         : null,
        onClosed        : null,
        icon_type       : "class"
    });
};

/**
 * _getConfirmMessage
 *
 * Displays a confirmation dialog using the Bootbox library.
 *
 * @param {string} title The title of the message.
 * @param {string} message The message content.
 * @param {string} type The type of confirmation dialog. Can be "success", "info", "warning", or "danger". Defaults to "warning" if not specified.
 * @param {Function} callback The callback function to be called with the result (true for confirmation, false for cancellation).
 */
const _getConfirmMessage = (title, message, type = "warning", callback) => {
    if (typeof callback !== "function") {
        console.log("Callback must be a function");
        return;
    }

    Swal.fire({
        title              : title,
        text               : message,
        icon               : type, // Type of alert (success, info, warning, error)
        showCancelButton   : true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor  : "#dd3333",
        confirmButtonText  : "Yes"
    }).then((result) => {
        callback(result.isConfirmed); // Call the callback with true if confirmed, false otherwise
    });
};

const _getConfirmPromise = (title, message, type = "warning") => {
    return new Promise((resolve) => {
        Swal.fire({
            title              : title,
            text               : message,
            icon               : type,
            showCancelButton   : true,
            confirmButtonColor : "#3085d6",
            cancelButtonColor  : "#dd3333",
            confirmButtonText  : "Yes"
        }).then((result) => {
            resolve(result.isConfirmed);
        });
    });
};

const parseNumber = val => parseFloat(val) || 0;

const QTY_ROUNDING    = parseNumber($("#txtqty_rounding").val());
const RATE_ROUNDING   = parseNumber($("#txtrate_rounding").val());
const WEIGHT_ROUNDING = parseNumber($("#weightRounding").val());
const AMOUNT_ROUNDING = parseNumber($("#setting_decimal").val());
const AMOUNT_DECIMAL  = parseNumber($("#setting_decimal").val());
const SETTING_DECIMAL = parseNumber($("#setting_decimal").val());

$(document).ready(function () {
    $(".timer").removeClass("hide");
    let urdu_language = getNumVal($("#txturdu_language"));
    if (urdu_language === 0) {
        $("#getlanguagedata").addClass("hide");
        $("#txtUName").prop("disabled", true);
        $("#txturduname").prop("disabled", true);
        $("#txtUname").prop("disabled", true);
    }
    var previous_balacnce_purchase = $("#txtprevious_balacnce_purchase").val();
    previous_balacnce_purchase     = (previous_balacnce_purchase == "1") ? true : false;
    var previous_balacnce_sale     = $("#txtprevious_balacnce_sale").val();
    previous_balacnce_sale         = (previous_balacnce_sale == "1") ? true : false;
    var headertitle                = $.trim($(".page_title").text());
    if (headertitle == "Purchase Voucher" || headertitle == "Purchase Return Voucher") {
        $("#switchPreBal").bootstrapSwitch("state", previous_balacnce_purchase);
    } else if (headertitle == "Sale Voucher" || headertitle == "Sale Return Voucher") {
        $("#switchPreBal").bootstrapSwitch("state", previous_balacnce_sale);
    }
    $("input[dir=\"rtl\"]").UrduEditor("15px");
    $("textarea[dir=\"rtl\"]").UrduEditor("15px");
});
var populateDateValue                 = function (date_id, date, checkFormat = null) {
    var dates = getFormattedDate(date, null, checkFormat);
    $("#" + date_id).datepicker("update", dates);
};
var getFormattedDate                  = function (date, format = null, checkFormat = null) {
    if (! format) {
        format = $("#default_date_format").val();
    }
    var dt = moment(date);
    if (checkFormat) {
        dt = moment(date, checkFormat.toUpperCase());
    }
    return dt.format(format.toUpperCase());
};
var getSqlFormattedDate               = function (date, format = null) {
    if (! format) {
        format = $("#default_date_format").val();
    }
    var dt = moment(date, format.toUpperCase());
    return dt.format("YYYY-MM-DD");
};
const openPrintOnSettingConfiguration = function (weburl) {
    const openPrintSetting = parseNumber($("#txtprint_setting").val());
    if (openPrintSetting > 0) {
        PDFObject.embed(weburl, "#pdfModalBody");
        $(".pdfObjectModal").modal("show");
    } else {
        window.open(weburl);
    }
};

var getNumText  = function (el) {
    return isNaN(parseFloat(el.text())) ? 0 : parseFloat(el.text());
};
var getNumVal   = function (el) {
    return isNaN(parseFloat(el.val())) ? 0 : parseFloat(el.val());
};
const getNumVar = function (el) {
    return isNaN(parseFloat(el)) ? 0 : parseFloat(el);
};

ifnull                   = function (isJqueryAvailable = 0, isJqueryAvailableValue = "") {
    if (Object.is(isJqueryAvailable, null) || Object.is(isJqueryAvailable, undefined) || Object.is(isJqueryAvailable, "") || Object.is(isJqueryAvailable, "NaN")) {
        return (isJqueryAvailableValue) ? isJqueryAvailableValue : "";
    } else {
        return isJqueryAvailable;
    }
};
var getLanguageAlignment = function (source, language = "1") {
    var sHtml = $.parseHTML(source);
    $(sHtml).find("td").each(function (ind, el) {
        if (language == "2") {
            $(el).toggleClass("text-left");
            $(el).toggleClass("text-right");
        }
    });
    source = "<tr>" + $(sHtml)[1].innerHTML + "</tr>";
    return source;
};

function appendToTable(sr, account_id, name, mobile, address, id, referenceid) {
    var srno = $("#lookuptable tbody tr").length + 1;
    var row  = "<tr>" + "<td class='srno numeric text-left' data-title='Sr#' > " + account_id + "</td>" + "<td class='barcodes numeric' data-title='Barcode' > <input type='hidden' name='hfModalPartyId' value='" + id + "' >" + name + "</td>" + "<td class='qty numeric ' data-title='Qty'>  " + mobile + "</td>" + "<td class='rate numeric ' data-title='Rate'> " + address + "</td>" + "<td><a href='' class='btn btn-primary populateAccount' style='width:50px !important'><span class='fa fa-edit'></span></a> </td>" + "</tr>";
    $(row).appendTo("#lookuptable");
}

function appendToTable2(sr, item_id, short_code, item_des, category_name, brand_name, cost_price, srate) {
    var srno = $("#lookuptable tbody tr").length + 1;
    var row  = "<tr>" + "<td class='srno numeric text-left' data-title='Sr#' > " + item_id + "</td>" + "<td class='barcodes numeric' data-title='Barcode' > <input type='hidden' name='hfModalitemId' value='" + item_id + "' >" + short_code + "</td>" + "<td class='qty numeric ' data-title='Qty'>  " + item_des + "</td>" + "<td class='qty numeric ' data-title='Qty'>  " + category_name + "</td>" + "<td class='qty numeric ' data-title='Qty'>  " + brand_name + "</td>" + "<td class='qty numeric ' data-title='Qty'>  " + cost_price + "</td>" + "<td class='qty numeric ' data-title='Qty'>  " + srate + "</td>" + "<td><a href='' class='btn btn-primary populateItem' style='width:50px !important'><span class='fa fa-edit'></span></a> </td>" + "</tr>";
    $(row).appendTo("#lookuptable2");
}

function getstafflookup() {
    $.ajax({
        url      : base_url + "index.php/payroll/payrollstaff/getstafflookup",
        type     : "POST",
        data     : {
            "active" : 1,
            "etype"  : $("#account_modal_etype").val(),
            "ename"  : ""
        },
        dataType : "JSON",
        success  : function (data) {
            if (typeof general.pdTable != "undefined") {
                general.pdTable.fnDestroy();
                $("#stafflookup_table tbody tr").remove();
            }
            if (data != "false") {
                $.each(data, function (index, elem) {
                    appendToTableStaff("", elem.staid, elem.name, elem.dept_name, elem.designation, elem.mid, elem.type);
                });
            }
            general.bindModalStaffGrid();
        }
    });
}

function appendToTableStaff(sr, staffid, name, department, designation, machine_id, type) {
    var srno = $("#lookuptable tbody tr").length + 1;
    var row  = "<tr>" + "<td class='srno numeric text-left' data-title='Sr#' > " + staffid + "</td>" + "<td class='barcodes numeric' data-title='Barcode' > <input type='hidden' name='hfModalstaffid' value='" + staffid + "' >" + name + "</td>" + "<td class='qty numeric ' data-title='Qty'>  " + department + "</td>" + "<td class='rate numeric ' data-title='Rate'> " + designation + "</td>" + "<td class='rate numeric ' data-title='Rate'> " + machine_id + "</td>" + "<td class='rate numeric ' data-title='Rate'> " + type + "</td>" + "<td><a href='' class='btn btn-primary populatestaffaccount' style='width:50px !important'><span class='fa fa-edit'></span></a> </td>" + "</tr>";
    $(row).appendTo("#stafflookup_table");
}

function fetchsetting_accounts() {
    $.ajax({
        url        : base_url + "index.php/account/fetchsetting_accounts",
        type       : "POST",
        dataType   : "JSON",
        data       : {},
        async      : false,
        beforeSend : function () { },
        success    : function (data) {
            $("#supplierlevel3_account_modal").val(data[0].supplierslevel3);
            $("#customerlevel3_account_modal").val(data[0].customerlevel3);
            fetchl3();
        }
    });
}

function fetchl3() {
    $.ajax({
        url        : base_url + "index.php/account/fetchl3",
        type       : "POST",
        dataType   : "JSON",
        data       : { "data" : 1 },
        async      : false,
        beforeSend : function () { },
        success    : function (data) {
            $("#account_modal_txtLevel3").empty();
            $("#account_modal_txtLevel3").append("<option value=\"\" disabled selected>Choose level3</option>");
            $.each(data, function (index, elem) {
                var row = "<option value='" + elem.l3 + "'  data-level1='" + elem.level1_name + "' data-level2='" + elem.level2_name + "' >" + elem.level3_name + "</option>";
                $(row).appendTo("#account_modal_txtLevel3");
            });
            $("#account_modal_txtLevel3").trigger("liszt:updated");
            var vouchername = $("#voucher_title_hidden").val();
            if (vouchername == "Purchase Order Voucher" || vouchername == "Inward Voucher" || vouchername == "Purchase Voucher" || vouchername == "Purchase Return Voucher") {
                $("#account_modal_txtLevel3").val($("#supplierlevel3_account_modal").val()).trigger("liszt:updated");
            } else {
                $("#account_modal_txtLevel3").val($("#customerlevel3_account_modal").val()).trigger("liszt:updated");
            }
            var level3 = $("#account_modal_txtLevel3").val();
            $("#account_modal_txtselectedLevel1").text("");
            $("#account_modal_txtselectedLevel2").text("");
            if (level3 !== "" && level3 !== null) {
                $("#account_modal_txtselectedLevel2").text(" " + $("#account_modal_txtLevel3").find("option:selected").data("level2"));
                $("#account_modal_txtselectedLevel1").text(" " + $("#account_modal_txtLevel3").find("option:selected").data("level1"));
            }
        }
    });
}

function fetchDisPayCount() {
    var currDate = new Date().toISOString().slice(0, 10).replace("T", " ");
    $.ajax({
        url        : base_url + "index.php/report/fetchDisPayRecvCount",
        type       : "POST",
        dataType   : "JSON",
        data       : {
            company_id : $(".notif_cid").val(),
            etype      : "payable"
        },
        beforeSend : function () { },
        success    : function (data) {
            if (data == 0) {
                $(".payable-result-count").css({
                    "visibility" : "hidden"
                });
            } else {
                $(".payable-result-count").css({
                    "visibility" : "visible"
                });
                $(".payable-result-count").html(data);
            }
        }
    });
}

function setFinancialDate() {
    var sdate = getSqlFormattedDate($("#sdate").val());
    var edate = getSqlFormattedDate($("#edate").val());
    $("#from").datepicker("update", getFormattedDate(sdate));
    $("#to").datepicker("update", getFormattedDate(edate));
    $("#from22").datepicker("update", getFormattedDate(sdate));
    $("#to22").datepicker("update", getFormattedDate(edate));
    $("#from_date").datepicker("update", getFormattedDate(sdate));
    $("#to_date").datepicker("update", getFormattedDate(edate));

    $("#fromDate").datepicker("update", getFormattedDate(sdate));
    $("#toDate").datepicker("update", getFormattedDate(edate));
}

const _getWeekOfCurrentMonth = () => {
    var _currentDate    = new Date();
    var _currentWeekDay = _currentDate.getDay();
    var lessDays        = _currentWeekDay == 0 ? 6 : _currentWeekDay - 1;
    var weekStartDate   = new Date(new Date(_currentDate).setDate(_currentDate.getDate() - lessDays));
    var weekEndDate     = new Date(new Date(weekStartDate).setDate(weekStartDate.getDate() + 6));
};

function setTodayDate() {
    $("#from").datepicker("update", new Date());
    $("#to").datepicker("update", new Date());
    $("#from22").datepicker("update", new Date());
    $("#to22").datepicker("update", new Date());
    $("#to_date").datepicker("update", new Date());
    $("#from_date").datepicker("update", new Date());

    $("#fromDate").datepicker("update", new Date());
    $("#toDate").datepicker("update", new Date());
}

function setWeekAgoDate() {
    var _currentDate    = new Date();
    var _currentWeekDay = _currentDate.getDay();
    var lessDays        = _currentWeekDay == 0 ? 6 : _currentWeekDay - 1;
    var weekStartDate   = new Date(new Date(_currentDate).setDate(_currentDate.getDate() - lessDays));
    var weekEndDate     = new Date(new Date(weekStartDate).setDate(weekStartDate.getDate() + 6));

    $("#from_date").datepicker("update", new Date(weekStartDate));
    $("#to_date").datepicker("update", new Date(weekEndDate));
    $("#from22").datepicker("update", new Date(weekStartDate));
    $("#to22").datepicker("update", new Date(weekEndDate));
    $("#from").datepicker("update", new Date(weekStartDate));
    $("#to").datepicker("update", new Date(weekEndDate));

    $("#fromDate").datepicker("update", new Date(weekStartDate));
    $("#toDate").datepicker("update", new Date(weekEndDate));
}

function setMonthAgoDate() {
    var date     = new Date(),
        y        = date.getFullYear(),
        m        = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay  = new Date(y, m + 1, 0);
    $("#from_date").datepicker("update", new Date(firstDay));
    $("#to_date").datepicker("update", new Date(lastDay));
    $("#from22").datepicker("update", new Date(firstDay));
    $("#to22").datepicker("update", new Date(lastDay));
    $("#from").datepicker("update", new Date(firstDay));
    $("#to").datepicker("update", new Date(lastDay));

    $("#fromDate").datepicker("update", new Date(firstDay));
    $("#toDate").datepicker("update", new Date(lastDay));
}

var getNumTextByVari  = function (el) {
    return isNaN(parseFloat(el)) ? 0 : parseFloat(el);
};
gettoFixed            = function ($b) {
    var setting_decimal = $("#setting_decimal").val();
    return parseFloat($b).toFixed(setting_decimal);
};
var addClassNoDecimal = function () {
    $(".num").each(function (index) {
        var id = $(this).attr("id");
        if (id !== undefined) {
            var type = $(this).attr("type");
            if (type.indexOf("number") >= 0) {
                $(this).removeClass("num");
            }
            if (id.indexOf("txtDiscp") >= 0) {
                $(this).removeClass("num");
                $(this).addClass("no-decimal");
            }
            if (id.indexOf("txttaxup") >= 0) {
                $(this).removeClass("num");
                $(this).addClass("no-decimal");
            }
            if (id.indexOf("txtExpense") >= 0) {
                $(this).removeClass("num");
                $(this).addClass("no-decimal");
            }
            if (id.indexOf("txtTax") >= 0) {
                $(this).removeClass("num");
                $(this).addClass("no-decimal");
            }
            if (id.indexOf("txtBarCodeEnter") >= 0) {
                $(this).addClass("is_numeric");
                $(this).removeClass("num");
            }
            if (id.indexOf("txtOrderNo") >= 0) {
                $(this).removeClass("num");
                $(this).addClass("is_numeric");
            }
        }
    });
};

/**
 * getOptionText
 * return selected option text given dropdown id
 * @param  optionID
 * @return [string]
 * */
const getOptionText                    = (optionID) => {
    return $.trim($(optionID).find("option:selected").text());
};
/**
 * getOptionData
 * return selected option data given dropdown id
 * @param  optionID
 * @param  DataKey
 * @return [string]
 * */
const getOptionData                    = (optionID, DataKey) => {
    return $.trim($(optionID).find("option:selected").data(DataKey));
};
/**
 * getTableTrRowTextNumber
 * Return the table of td text where user perform working of calculation
 * @param  current This is a jquery element like this $(this)
 * @param  clas It's class of current row which give the value
 * @return number
 * */
const getTableTrRowTextNumber          = (current, clas) => {
    return getNumText($(current).closest("tr").find("td." + clas));
};
/**
 * getTableTrRowText
 * Return the table of td text
 * @param  current This is a jquery element like this $(this)
 * @param  clas It's class of current row which give the value
 * @return text
 * */
const getTableTrRowText                = (current, clas) => {
    return $.trim($(current).closest("tr").find("td." + clas).text());
};
/**
 * getTableTrRowData
 * Return the table of td data text
 * @param  current This is a jquery element like this $(this)
 * @param  clas It's class of current row which give the value
 * @param  DataKey It's table td like this data-exm = "this"
 * @return text
 * */
const getTableTrRowData                = (current, clas, DataKey) => {
    return $.trim($(current).closest("tr").find("td." + clas).data(DataKey));
};
/**
 * getTableRowIsAlreadyExsit
 * where you can campare and check row is already exsit?
 * @param  tableid given table id where you can run loop
 * @param  obj given object take the object key of a table row to class with you can compare row
 * @param  flag boolean
 * @return boolean
 * */
const getTableRowIsAlreadyExsit        = (tableid, item_id, tdClassName = "item_desc", tdDataName = "item_id", flag = false) => {
    $(tableid).find("tbody tr").each(function (index, elem) {
        $(this).closest("tr").removeClass("hightlight_tr");
        var _item_id = $.trim($(elem).find("td." + tdClassName).data(tdDataName));
        if (_item_id == item_id) {
            flag = true;
            $(this).closest("tr").addClass("hightlight_tr");
            $(this).closest("tr").focus();
        }
    });
    return flag;
};
/**
 * getSettingDecimal
 * return the value with decimal of setting QTY|RATE|AMOUNT
 * * Q mean Qty Field
 * * R mean Rate Field
 * * A mean Amount Field and A is Defualt value Of CheckNumberField
 * @param  GivenNumber This is number is converting to decimal number
 * @param  CheckNumberField This is Checking Fields QTY|RATE|AMOUNT?
 * @return Number
 * */
const getSettingDecimal                = (GivenNumber, CheckNumberField = "A") => {
    if (CheckNumberField == "Q") {
        return Number.parseFloat(Math.abs(GivenNumber)).toFixed(QTY_ROUNDING);
    }
    if (CheckNumberField == "R") {
        return Number.parseFloat(GivenNumber).toFixed(RATE_ROUNDING);
    }
    if (CheckNumberField == "A") {
        return Number.parseFloat(GivenNumber).toFixed(SETTING_DECIMAL);
    }
};
/**
 * getDateDifference
 * Take the difference between the dates and divide by milliseconds per day.
 * * Current Date
 * * Due Date
 * @param  firstDate This is Current Date
 * @param  secondDate This is Due Date
 * @return Number
 * */
const getDateDifference                = (firstDate, secondDate) => {
    var format   = $("#default_date_format").val();
    var timeDiff = ((moment(secondDate, format.toUpperCase()) - moment(firstDate, format.toUpperCase())));
    var days     = timeDiff / (1000 * 60 * 60 * 24);
    return days;
};
/**
 * getCalculateDatesWithcurrentDate
 * * Default Date Format
 * * Current Date
 * * Due Date
 * @param  due_days This is Due Days
 * @param  id This is dropdown Id with out element like #
 * @return String
 * */
const getCalculateDatesWithcurrentDate = (due_days, id) => {
    var format   = $("#default_date_format").val();
    var due_date = ($("#current_date").val());
    due_date     = moment(due_date, format.toUpperCase());
    due_date     = due_date.add(due_days, "days");
    if (due_days == 0) {
        var curdate = $("#current_date").val();
        curdate     = moment(curdate, format.toUpperCase());
        populateDateValue(id, curdate);
    } else {
        populateDateValue(id, due_date);
    }
};
/**
 * getMaxPercentAge
 * * Here We Can Alert Message That Your PercentAge is greater than 100
 * @param  id This is dropdown Id with out element like #
 * @return bool
 * */
const getMaxPercentAge                 = (id) => {
    if (getNumVal($(id)) >= 101) {
        _getAlertMessage("Error!", "Percentages greater than 100", "danger");
        $(id).val(0);
    } else {
        return true;
    }
};
/**
 * getPostingMethod
 * * Here We Can getting posting method from voucher setting
 * @param  key This is key off postingMethod
 * @return bool
 * */
const getPostingMethod                 = (key) => {
    Window.postingMethod = false;
    $.ajax({
        url      : base_url + "index.php/general_http_request/getPostingMethod",
        type     : "POST",
        data     : { "checkSettingColumn" : key },
        dataType : "JSON",
        async    : false,
        success  : function (data) {
            if (data) {
                Window.postingMethod = true;
            }
        },
        error    : function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
    return Window.postingMethod;
};
/**
 * getTableSerialNumber
 * @param  tableid This is number is converting to decimal number
 * @return Number
 * */
const getTableSerialNumber             = (tableid) => {
    var counter_ = 1;
    $(tableid).find("tbody tr").each(function (index, elem) {
        if ($(elem).hasClass("dont-count") == false) {
            $.trim($(elem).find("td.srno").text(counter_++));
        }
    });
};
/**
 * getValidateCurrentDate
 * @param  givenDate This is given date from voucher date changing
 * @return Number
 * */
const getValidateCurrentDate           = (givenDate) => {
    if (givenDate !== undefined) {
        var format            = $("#default_date_format").val();
        givenDate             = moment(givenDate, format.toUpperCase());
        var CurrentDateHidden = moment($("#txtCurrentDateHidden").val(), format.toUpperCase());
        if (givenDate.isAfter(CurrentDateHidden)) {
            var flag = confirm("The selected date is greater than the current date...");
            if (! flag) {
                $("#current_date").datepicker("update", new Date());
                return true;
            }
        }
        return false;
    }
};
/**
 * getSoftwareUpdate
 * * Here We Can Updateing Software
 * @return bool
 * */
const getSoftwareUpdate                = () => {
    $.ajax({
        url      : base_url + "index.php/user/softwareUpdate",
        type     : "POST",
        dataType : "JSON",
        success  : function (data) {
            setTimeout(function () {
                delaySuccess(data);
            }, 3000);
        },
        error    : function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
};
const delaySuccess                     = (data) => {
    general.reloadWindow();
};
/**
 * getStockValidSettingConfiguration
 * * Here We Can Updateing Software
 * @return bool
 * */
const getCreditLimit                   = (party_id) => {
    let customerLimit = 0;
    $.ajax({
        url      : base_url + "index.php/customer/fetchpartybal",
        type     : "POST",
        data     : {
            "pid"    : party_id,
            "vrdate" : $("#current_date").val()
        },
        dataType : "JSON",
        async    : false,
        success  : function (data) {
            if (data !== false) {
                let Balance = data[0].balance;
                $("#prevbalance").val(Balance);
                customerLimit = data[0].limit;
            }
        },
        error    : function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
    let creditlimit = getNumVal($("#creditlimit"));
    let NetBalance  = getNumVal($("#prevbalance"));
    let NetAmount   = getNumVal($("#txtNetAmount"));
    let NetBill     = parseFloat(NetBalance) + parseFloat(NetAmount);

    Window.CreditLimitFlag = false;
    if (customerLimit > 0 && NetBill > customerLimit) {
        if (creditlimit == "1") {
            return $.notify({ message : "Credit Limit Exceeded..." }, { type : "danger" });
        }
        if (creditlimit == "3") {
            Window.CreditLimitFlag = true;
        }
    }
};
/**
 * getCalculateGridTable
 * Here we can update the calculation of the grid.
 * @param {Event} currentEvent
 * @param {jQuery} currentRowElement
 * @return {void} Updates the grid row's calculations.
 */
const getCalculateGridTable            = (currentEvent, currentRowElement) => {
    let GridQty            = getNumText(currentRowElement.find("td.qty"));
    let GridRate           = getNumVal(currentRowElement.find("td input.rate"));
    let GridGramount       = getNumText(currentRowElement.find("td.gramount"));
    let GridDiscp          = getNumVal(currentRowElement.find("td input.discp"));
    let GridDiscount       = getNumVal(currentRowElement.find("td input.discount"));
    let GridDiscountAmount = getNumText(currentRowElement.find("td.discountamount"));
    let GridAmount         = getNumText(currentRowElement.find("td.amount"));
    let GridTax            = getNumVal(currentRowElement.find("td input.tax"));
    let GridTaxAmount      = getNumText(currentRowElement.find("td.taxupamount"));

    let GridFurtherTax       = getNumVal(currentRowElement.find("td input.txtFurtherTax"));
    let GridFurtherTaxAmount = getNumText(currentRowElement.find("td.txtFurtherTaxAmount"));

    let GridNetAmount = getNumText(currentRowElement.find("td.taxamount"));

    if (currentEvent.target.className.indexOf("rate") >= 0) {
        GridGramount = parseFloat(GridQty) * parseFloat(GridRate);
    }

    currentRowElement.find("td.gramount").text(getSettingDecimal(GridGramount));

    if (currentEvent.target.className.indexOf("discp") >= 0) {
        currentRowElement.find("td input.discp").val();
        getMaxPercentAge(currentRowElement.find("td input.discp"));
        if (GridDiscp > 100) {
            GridDiscp = 0;
        }
    } else {
        currentRowElement.find("td input.discp").val(parseFloat(GridDiscp).toFixed(2));
    }

    if (currentEvent.target.className.indexOf("discp") >= 0) {
        GridDiscount = parseFloat(GridRate) * parseFloat(GridDiscp) / 100;
    } else if (currentEvent.target.className.indexOf("discount") >= 0) {
        GridDiscp = parseFloat(GridDiscount) * 100 / parseFloat(GridRate);
    } else {
        GridDiscount = parseFloat(GridRate) * parseFloat(GridDiscp) / 100;
    }

    if (currentEvent.target.className.indexOf("discount") >= 0) {
        currentRowElement.find("td input.discount").val();
        currentRowElement.find("td input.discp").val(parseFloat(GridDiscp).toFixed(2));
    } else {
        currentRowElement.find("td input.discount").val(parseFloat(GridDiscount).toFixed(2));
    }

    GridAmount = (parseFloat(GridRate) - parseFloat(GridDiscount)) * parseFloat(GridQty);

    if (currentEvent.target.className.indexOf("tax") >= 0) {
        currentRowElement.find("td input.tax").val();
        getMaxPercentAge(currentRowElement.find("td input.tax"));
        if (GridTax >= 100) {
            GridTax = 0;
        }
    } else {
        currentRowElement.find("td input.tax").val(parseFloat(GridTax).toFixed(2));
    }

    if (currentEvent.target.className.indexOf("tax") >= 0 || ! currentEvent.target.className.indexOf("tax")) {
        GridTaxAmount = parseFloat(GridAmount) * parseFloat(GridTax) / 100;
    }

    if (currentEvent.target.className.indexOf("txtFurtherTax") >= 0) {
        currentRowElement.find("td input.txtFurtherTax").val();
        getMaxPercentAge(currentRowElement.find("td input.txtFurtherTax"));
        if (GridFurtherTax >= 100) {
            GridFurtherTax = 0;
        }
    } else {
        currentRowElement.find("td input.txtFurtherTax").val(parseFloat(GridFurtherTax).toFixed(2));
    }

    if (currentEvent.target.className.indexOf("txtFurtherTax") >= 0 || ! currentEvent.target.className.indexOf("txtFurtherTax")) {
        GridFurtherTaxAmount = parseFloat(GridAmount) * parseFloat(GridFurtherTax) / 100;
    }

    GridNetAmount      = parseFloat(GridTaxAmount) + parseFloat(GridFurtherTaxAmount) + parseFloat(GridAmount);
    GridDiscountAmount = parseFloat(GridDiscount) * parseFloat(GridQty);

    currentRowElement.find("td.discountamount").text(getSettingDecimal(GridDiscountAmount));
    currentRowElement.find("td.amount").text(getSettingDecimal(GridAmount));
    currentRowElement.find("td.taxupamount").text(getSettingDecimal(GridTaxAmount));
    currentRowElement.find("td.txtFurtherTaxAmount").text(getSettingDecimal(GridFurtherTaxAmount));
    currentRowElement.find("td.taxamount").text(getSettingDecimal(GridNetAmount));

    $("#txtDiscAmount").trigger("input");
    $("#txtExpAmount").trigger("input");
};

/**
 * getAllItemDetail
 * return the data of all Item with active
 * @param int active
 * @param string setting_categry
 * @param IDoption is the dropdown Id Or Class
 * @return array
 *
 * */
const getAllItemDetail         = (Active, IsItemType = 0, IDoption = "", Setting_Column = "", Item_Column = "") => {
    $.ajax({
        url      : base_url + "index.php/item/getItemAll",
        type     : "POST",
        data     : {
            "Active"         : Active,
            "IsItemType"     : IsItemType,
            "Setting_Column" : Setting_Column,
            "Item_Column"    : Item_Column
        },
        dataType : "JSON",
        success  : function (response) {
            if (response.length > 0) {
                getAllPopulateItemDetail(response, IDoption);
            } else {
                $.notify({ message : "No Data Found" }, { type : "danger" });
            }
        },
        error    : function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
};
/**
 * getAllPopulateItemDetail
 * populate Item in select2 dropdown and appending own id
 * @param  array data
 * @param  IDoption is the dropdown Id Or Class
 * @param  option is the default value
 * @return [Nothing]
 *
 * */
const getAllPopulateItemDetail = (data, IDoption = "", option = "") => {
    let option2 = "";
    $(IDoption).find("option").not(":first").remove().trigger("liszt:updated");
    $(IDoption).val("").trigger("liszt:updated");
    if (IDoption.includes("id")) {
        $.each(data, function (index, elem) {
            if (ifnull(elem.short_code, "-") !== "-") {
                option2 += "<option value=\"" + elem.item_id + "\" data-income_id=\"" + elem.income_id + "\" data-inventory_id=\"" + elem.inventory_id + "\" data-cost_id=\"" + elem.cost_id + "\" data-uomname=\"" + elem.uom + "\" data-prate=\"" + elem.cost_price + "\" data-uom=\"" + elem.uom + "\" data-stqty=\"" + elem.stqty + "\" data-stweight=\"" + elem.stweight + "\" data-uomname=\"" + elem.uom + "\" data-stweight=\"" + elem.stweight + "\" data-ingred_uom=\"" + elem.ingred_uom + "\" data-ingred_uom_qty=\"" + elem.ingred_uom_qty + "\" data-ingred_item_id=\"" + elem.ingred_item_id + "\" data-uom=\"" + elem.uom + "\">" + elem.short_code + "</option>";
            }
        });
        $(option2).appendTo(IDoption);
    } else {
        $.each(data, function (index, elem) {
            option += "<option value=\"" + elem.item_id + "\" data-income_id=\"" + elem.income_id + "\" data-inventory_id=\"" + elem.inventory_id + "\" data-cost_id=\"" + elem.cost_id + "\" data-uomname=\"" + elem.uom + "\" data-prate=\"" + elem.cost_price + "\" data-uom=\"" + elem.uom + "\" data-stqty=\"" + elem.stqty + "\" data-stweight=\"" + elem.stweight + "\" data-uomname=\"" + elem.uom + "\" data-stweight=\"" + elem.stweight + "\" data-ingred_uom=\"" + elem.ingred_uom + "\" data-ingred_uom_qty=\"" + elem.ingred_uom_qty + "\" data-ingred_item_id=\"" + elem.ingred_item_id + "\" data-uom=\"" + elem.uom + "\">" + elem.item_des + "</option>";
        });
        $(option).appendTo(IDoption);
    }
    $(IDoption).trigger("liszt:updated");
};

const getEmailAndSendVoucherPrint = (etype, vrnoa, pre_bal_print = 0, hd = 1, print = "lg", wrate = 0, language_id = 1, emailAddress = "") => {
    $.ajax({
        url      : base_url + "/doc/getPrintVoucherPDF",
        type     : "GET",
        data     : {
            "etype"         : etype,
            "vrnoa"         : vrnoa,
            "pre_bal_print" : pre_bal_print,
            "hd"            : hd,
            "print"         : print,
            "wrate"         : wrate,
            "language_id"   : language_id,
            "emailflag"     : 1,
            "emailAddress"  : emailAddress
        },
        dataType : "JSON",
        success  : function (response) {
            if (response.status === false && response.error !== "") {
                _getAlertMessage("Error!", response.message, "danger");
            } else if (response.status === false && response.message !== "") {
                _getAlertMessage("Information!", response.message, "info");
            } else {
                _getAlertMessage("Successfully!", response.message, "success");
            }
        },
        error    : function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
};
const _getGLAccountLookUp         = (vrnoa, etype) => {
    if (typeof general.gldTable != "undefined") {
        general.gldTable.fnDestroy();
        $("#gldetail_table tbody tr").remove();
        $("#gldetail_table tfoot").remove();
    }
    $.ajax({
        url      : base_url + "index.php/general_http_request/getGLAccountLookUp",
        type     : "POST",
        data     : {
            "vrnoa" : vrnoa,
            "etype" : etype
        },
        dataType : "JSON",
        success  : function (response) {
            if (response.status && response.data !== null) {
                var tcredit = 0;
                var tdebit  = 0;
                $.each(response.data, function (index, elem) {
                    tcredit += parseFloat(elem.credit);
                    tdebit += parseFloat(elem.debit);
                    appendToTableGlTable(elem.vrnoa, elem.vrdate, elem.account_name, elem.Type, elem.description, elem.debit, elem.credit);
                    if (index == (response.data.length - 1)) {
                        var row = "<tfoot> <tr class='finalsum'>" + "<td class='text-left' data-title='vrnoa'></td>" + "<td class='text-left' data-title='vrnoa'></td>" + "<td class='text-left' data-title='vrdate'></td>" + "<td class='text-left' data-title='vrdate'></td>" + "<td class='text-left' data-title='Type'></td>" + "<td class='text-right font-weight-bold' data-title='description'>TOTAL</td>" + "<td class='text-right add-decimal font-weight-bold' data-title='Rate'> " + Number.parseFloat(tdebit).toFixed(AMOUNT_ROUNDING) + "</td>" + "<td class='text-right add-decimal font-weight-bold' data-title='Rate'> " + Number.parseFloat(tcredit).toFixed(AMOUNT_ROUNDING) + "</td>" + "</tr></tfoot>";
                        $(row).appendTo("#gldetail_table");
                        $("td.add-decimal").digits();
                    }
                });
            } else {
            }
            general.bindModalGLGrid();
        }
    });
};

function appendToTableGlTable(vrnoa, vrdate, account_name, Type, description, debit, credit) {
    var row = "<tr>" + "<td class='text-left srno' data-title='srno'></td>" + "<td class='text-left' data-title='vrnoa'>  " + vrnoa + "</td>" + "<td class='text-left' data-title='vrdate'>  " + vrdate + "</td>" + "<td class='text-left' data-title='account_name'>  " + account_name + "</td>" + "<td class='text-left' data-title='Type'>  " + Type + "</td>" + "<td class='text-left' data-title='description'>  " + description + "</td>" + "<td class='text-right add-decimal' data-title='Rate'> " + Number.parseFloat(debit).toFixed(AMOUNT_ROUNDING) + "</td>" + "<td class='text-right add-decimal' data-title='Rate'> " + Number.parseFloat(credit).toFixed(AMOUNT_ROUNDING) + "</td>" + "</tr>";
    $(row).appendTo("#gldetail_table");
    getTableSerialNumber("#gldetail_table");
    $("td.add-decimal").digits();

}

$.fn.digits                  = function () {
    return this.each(function () {
        if ($.isNumeric($(this).text())) {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        }
    });
};
const getGLAccountLookUpShow = () => {
    const voucher_type_hidden = $.trim($("#voucher_type_hidden").val());
    if (voucher_type_hidden === "new") {
        $("#glaccountlookupshow").addClass("hide");
    } else {
        $("#glaccountlookupshow").removeClass("hide");
    }
};
const decimalCount           = (num) => {
    // Convert to String
    const numStr = String(num);
    // String Contains Decimal
    if (numStr.includes(".")) {
        return numStr.split(".")[1].length;
    }
    // String Does Not Contain Decimal
    return 0;
};
const isPositive             = (number) => {
    if (number > 0) {
        return true;
    } else if (number < 0) {
        return false;
    }
    return false;
};
const validateSaveService    = () => {
    var errorFlag            = false;
    const ModalServiceIncome = $("#txtModalServiceIncome");
    const ModalServiceName   = $("#txtModalServiceName");
    // remove the error class first
    $(".inputerror").removeClass("inputerror");

    if (! ModalServiceIncome.val()) {
        $("#txtModalServiceIncome_chzn").addClass("inputerror");
        errorFlag = true;
    }
    if (! ModalServiceName.val()) {
        $(ModalServiceName).addClass("inputerror");
        errorFlag = true;
    }
    return errorFlag;
};
const getSaveObjectService   = () => {
    const SaveObject              = {};
    SaveObject.service_active     = 1;
    SaveObject.service_name       = document.getElementById("txtModalServiceName").value.trim();
    SaveObject.service_remarks    = document.getElementById("txtModalServiceRemarks").value.trim();
    SaveObject.service_account_id = document.getElementById("txtModalServiceIncome").value.trim();
    SaveObject.service_uname      = document.getElementById("txtModalServiceNativeName").value.trim();
    return SaveObject;
};
const saveService            = (obj) => {
    $.ajax({
        url      : base_url + "index.php/setup/service/save",
        type     : "POST",
        data     : {
            "vouchertypehidden" : "new",
            "obj"               : obj
        },
        dataType : "JSON",
        success  : function (respons) {
            if ((respons.status == false) && (respons.message !== "")) {
                $.notify({ message : respons.message }, { type : "danger" });
            } else if (respons.error == false) {
                $.notify({ message : "An internal error occured while saving voucher. Please try again !!!" }, { type : "danger" });
            } else if (respons == "duplicate") {
                $.notify({ message : "Service Is Already Saved !!!" }, { type : "danger" });
            } else {
                $.notify({ message : "Service  saved successfully !!!" }, { type : "success" });
                $("#ServiceAddModel").modal("hide");
                resetFieldsService();
                populateDateService(respons);
            }
        },
        error    : function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
};
const resetFieldsService     = () => {
    $("#txtModalServiceName").val("");
    $("#txtModalServiceRemarks").val("");
    $("#txtModalServiceIncome").val("").trigger("liszt:updated");
};
const populateDateService    = (data) => {
    $.each(data, function (index, elem) {
        var opt = "<option value='" + elem.service_id + "' data-service_account_id='" + elem.service_account_id + "' >" + elem.service_name + "</option>";
        $(opt).appendTo("#service_dropdown");
    });
    $("#service_dropdown").val(data[0].service_id);
    $("#service_dropdown").trigger("liszt:updated");
};
//Simple function that will tell if the function is defined or not
const function_exists        = (func) => {
    return typeof window[func] !== "undefined" && $.isFunction(window[func]);
};

var general = {
    hideLoader                        : false,
    init                              : function () {
        general.bindUI();
        general.fetchDistributionReceivablesCount();
        general.performAjaxSetup();
    },
    bindUI                            : function () {

        $(document).on("keypress", ".num", function (e) {
            general.blockKeys(e);
        });
        $(document).on("keypress", ".is_numeric", function (e) {
            general.blockKeys(e);
        });
        $(".submainnav-li").each(function (key, value) {
            const _current = ($(this));
            const _length  = ($(this).find("ul li").length > 0);
            if (_length == false) {
                $(value).addClass("hide");
            }
        });
        $(".btnResetM_modal").on("click", function () {
            $("#account_modal_txtAccountName").val("");
            $("#txtAccountName").val("");
            $("#txtLevel3").select2("val", "");
        });
        $(".btnSaveMItem_modal").on("click", function (e) {
            if ($(".btnSave").data("saveitembtn") == 0) {
                alert("Sorry! you have not save item rights..........");
            } else {
                e.preventDefault();
                general.initSaveItem();
            }
        });
        if ($(".btngllookup").is(":visible")) {
            shortcut.add("F11", function () {
                $(".btngllookup:visible").get()[0].click();
            });
        }
        $(".btngllookup").on("click", function (e) {
            e.preventDefault();
            const _vrnoa = (getNumVal($("#txtVrnoa")) > 0) ? getNumVal($("#txtVrnoa")) : getNumVal($("#txtId"));
            const _etype = general.getEtypethroughtitle($.trim($(".header_page_title").text()));
            _getGLAccountLookUp(_vrnoa, _etype);
        });
        $("body").on("click", ".modal-lookup .populatestaffaccount", function (e) {
            e.preventDefault();
            var staff       = $(this).closest("tr").find("input[name=hfModalstaffid]").val();
            var headertitle = $.trim($(".page_title").text());
            if (headertitle == "Add Staff") {
                $("#txtStaffId").val(staff);
                $("#txtStaffId").trigger("change");
                $("#stafflookup-center").modal("hide");
            } else if (headertitle == "Advance Report" || headertitle == "Mess Charges Voucher" || headertitle == "Penalty Voucher" || headertitle == "Loan Voucher" || headertitle == "Incentive Voucher" || headertitle == "Advance Voucher") {
                $("#name_dropdown").select2("val", staff);
                $("#id_dropdown").select2("val", staff);
                $("#name_dropdown").trigger("change");
                $("#stafflookup-center").modal("hide");
            } else if (headertitle == "Update Attendance Status") {
                $("#name_dropdown").val(staff).trigger("liszt:updated");
                $("#id_dropdown").val(staff).trigger("liszt:updated");
                $("#name_dropdown").trigger("change");
                $("#stafflookup-center").modal("hide");
            } else if (headertitle == "Staff Attendance Report") {
                $("#drpStaffId").select2("val", staff);
                $("#stafflookup-center").modal("hide");
            } else {
                $("#staff_dropdown").val(staff).trigger("liszt:updated");
                $("#staff_dropdown").trigger("change");
                $("#stafflookup-center").modal("hide");
            }
        });
        $(".btnResetMItem_modal").on("click", function () {
            $("#txtItemName_modal").val("").trigger("liszt:updated");
            $("#category_dropdown_modal").val("").trigger("liszt:updated");
            $("#subcategory_dropdown_modal").val("").trigger("liszt:updated");
            $("#brand_dropdown_modal").val("").trigger("liszt:updated");
            $("#made_dropdown_modal").val("").trigger("liszt:updated");
            $("#txtSalePrice_modal").val("").trigger("liszt:updated");
            $("#txtPurPrice_modal").val("").trigger("liszt:updated");
            $("#uom_dropdown_modal").val("").trigger("liszt:updated");
            $("#txtItemBarCode_modal").val("").trigger("liszt:updated");
            $("#txtShortCode_modal").val("").trigger("liszt:updated");
            $("#txttaxrate_modal").val($("#txttaxrate_modalhidden").val()).trigger("liszt:updated");
        });
        $(".btnSaveM_account").on("click", function (e) {
            if ($(".btnSave").data("saveaccountbtn") == 0) {
                alert("Sorry! you have not save accounts rights..........");
            } else {
                e.preventDefault();
                general.initSaveAccount();
            }
        });
        $(".btnSaveMGodown_modal").on("click", function (e) {
            if ($(".btnSave").data("savegodownbtn") == 0) {
                alert("Sorry! you have not save departments rights..........");
            } else {
                e.preventDefault();
                general.initSaveGodown();
            }
        });
        $(".btnSaveVehicleModal").on("click", function (e) {
            e.preventDefault();
            general.initSaveVehicle();
        });
        $(".btnResetVehicleModal").on("click", function (e) {
            e.preventDefault();
            general.initResetVehicle();
        });
        $(".btnSaveModalService").on("click", function (e) {
            e.preventDefault();
            general.initSaveService();
        });
        $(".btnResetModalService").on("click", function (e) {
            e.preventDefault();
            resetFieldsService();
        });
        $("body input[name=\"get-Header-Text-Inventory-Non-Inventory\"]").on("change", function (event) {
            const getHeaderTextInventoryNonInventory = $.trim($("input[name=\"get-Header-Text-Inventory-Non-Inventory\"]:checked").val());
            if (getHeaderTextInventoryNonInventory === "Non-Inventory") {
                $(".text-Item-Modal-Category-SubCatgeory-Hide").hide();
                $(".text-Item-Modal-Brand-Made-Hide").hide();
                $(".text-Item-Modal-SalePrice-PurPrice-Hide").hide();
                $(".uom_dropdown_modal").hide();
            } else {
                $(".text-Item-Modal-Category-SubCatgeory-Hide").show();
                $(".text-Item-Modal-Brand-Made-Hide").show();
                $(".text-Item-Modal-SalePrice-PurPrice-Hide").show();
                $(".uom_dropdown_modal").show();
            }
        });

        $("#search-btn").on("click", function (e) {
            e.preventDefault();
            $("#myInput").trigger("keyup");
        });

        $.ajaxSetup({
            cache   : false,
            headers : { "X-Requested-Fnid" : $("#fn_id").val() }
        });
        $(document).ajaxStart(function () {
            $(".loader").show();
        });
        $(document).ajaxComplete(function (event, xhr, settings) {
            $(".loader").hide();
        });
        $(".datepicker").datepicker({
            format         : "yyyy/mm/dd",
            todayHighlight : true
        });
        $(".modal").on("shown", function () {
            $(this).find("input:first").focus();
        });
        $("#btnReset, .reload").on("click", function (e) {
            e.preventDefault();
            general.reloadWindow();
        });
        $(".stafflookupcenter").on("click", function () {
            getstafflookup();
        });

        jQuery("div.chzn-container ul").attr("tabindex", -1);
        $(document).on("focus", ".select2-selection.select2-selection--single", function (e) {
            $(this).closest(".select2-container").siblings("select:enabled").select2("open");
        });
        // steal focus during close - only capture once and stop propogation
        $("select.select2").on("select2:closing", function (e) {
            $(e.target).data("select2").$selection.one("focus focusin", function (e) {
                e.stopPropagation();
            });
        });
        $.prototype.disableTab = function () {
            this.each(function () {
                $(this).attr("tabindex", "-1");
            });
        };

        $(".unfocusable-element, .another-unfocusable-element").disableTab();
        // steal focus during close - only capture once and stop propogation
        $("select.select2").on("select2:closing", function (e) {
            $(e.target).data("select2").$selection.one("focus focusin", function (e) {
                e.stopPropagation();
            });
        });

    },
    getEtypethroughtitle              : function (etype) {
        switch (etype) {
            case "Purchase Voucher":
                etype = "purchase";
                break;
            case "Purchase Return":
                etype = "purchasereturn";
                break;
            case "Sale":
                etype = "sale";
                break;
            case "POS":
                etype = "pos";
                break;
            case "Sale Return Voucher":
                etype = "salereturn";
                break;
            case "Opening Stock":
                etype = "ops_v";
                break;
            case "Stock Adjustment":
                etype = "stockadjustment";
                break;
            case "Consumption Voucher":
                etype = "consumption";
                break;
            case "Manual Production Voucher":
                etype = "manualproduction";
                break;
            case "Opening Stock":
                etype = "ops_v";
                break;
            case "Assemble / De Assemble":
                etype = "item_conversion";
                break;
            case "Issuance Voucher":
                etype = "issuance";
                break;
            case "Consumption Voucher":
                etype = "consumption";
                break;
            case "Cash Payment":
                etype = "cpv";
                break;
            case "Cash Reciept":
                etype = "crv";
                break;
            case "Expense Voucher":
                etype = "expense";
                break;
            case "Cheque Receive Voucher":
                etype = "chequereceive";
                break;
            case "Cheque Issue Voucher":
                etype = "chequeissue";
                break;
            case "Bank Receive Voucher":
                etype = "brv";
                break;
            case "Bank Payment":
                etype = "bpv";
                break;
            case "Loan Voucher":
                etype = "loan";
                break;
            case "Advance Voucher":
                etype = "advance";
                break;
            case "Inecntive Voucher":
                etype = "incentive";
                break;
            case "Penalty Voucher":
                etype = "penalty";
                break;
            case "Cash Book Voucher":
                etype = "cash_book";
                break;
            case "BOM Production":
                etype = "production";
                break;
            case "Credit Note Voucher":
                etype = "credit_note";
                break;
            case "Debit Note Voucher":
                etype = "debit_note";
                break;
            case "Bulk Supply Voucher":
                etype = "bulksupply_voucher";
                break;
            case "Service Sale Invoice":
                etype = "service_invoice";
                break;
            default:
                etype = etype.substr(0, 3);
        }

        return (etype.toLowerCase());
    },
    getSaveObjectItem                 : function () {
        const Inventory_Non_Inventory = $("input[name=\"get-Header-Text-Inventory-Non-Inventory\"]:checked").val();
        var itemObj                   = {
            item_id             : 20000,
            active              : "1",
            open_date           : $.trim($("#current_date").val()),
            catid               : $("#category_dropdown_modal").val(),
            subcatid            : $.trim($("#subcategory_dropdown_modal").val()),
            bid                 : $.trim($("#brand_dropdown_modal").val()),
            made_id             : $.trim($("#made_dropdown_modal").val()),
            description         : $.trim($("#txtItemName_modal").val()),
            item_des            : $.trim($("#txtItemName_modal").val()),
            cost_price          : $.trim($("#txtPurPrice_modal").val()),
            srate               : $.trim($("#txtSalePrice_modal").val()),
            voucher_type_hidden : "new",
            uid                 : $.trim($("#uid").val()),
            company_id          : $.trim($("#cid").val()),
            uom                 : $.trim($("#uom_dropdown_modal").val()),
            item_barcode        : $.trim($("#txtItemBarCode_modal").val()),
            short_code          : $.trim($("#txtShortCode_modal").val()),
            taxrate             : $.trim($("#txttaxrate_modal").val()),
            inventory_id        : $.trim($("#setting_inventory_dropdown").val()),
            cost_id             : $.trim($("#setting_cost_dropdown").val()),
            income_id           : $.trim($("#setting_income_dropdown").val()),
            item_type           : (Inventory_Non_Inventory === "Inventory") ? 0 : 1
        };
        return itemObj;
    },
    populateDataItem                  : function (data, type) {
        $("#itemid_dropdown").empty();
        $("#item_dropdown").empty();
        $.each(data, function (index, elem) {
            var opt = "<option value='" + elem.item_id + "' data-size='" + elem.size + "' data-tax2='" + elem.taxexempt + "' data-uom_item='" + elem.uom + "' data-prate='" + elem.cost_price + "' data-dis='" + elem.item_pur_discount + "' data-grweight='" + elem.grweight + "' data-stqty='" + elem.stqty + "' data-stweight='" + elem.stweight + "' data-barcode='" + elem.item_barcode + "' data-tax='" + elem.taxrate + "' >" + elem.item_des + "</option>";
            $(opt).appendTo("#item_dropdown");
            $(opt).appendTo("#item_dropdownItemC");
            var opt1 = "<option value='" + elem.item_id + "' data-size='" + elem.size + "' data-tax2='" + elem.taxexempt + "' data-uom_item='" + elem.uom + "' data-prate='" + elem.cost_price + "' data-dis='" + elem.item_pur_discount + "' data-grweight='" + elem.grweight + "' data-stqty='" + elem.stqty + "' data-stweight='" + elem.stweight + "' data-barcode='" + elem.item_barcode + "' data-tax='" + elem.taxrate + "' >" + elem.item_id + "</option>";
            $(opt1).appendTo("#itemid_dropdownItemC");
            $(opt1).appendTo("#itemid_dropdown");
            $("#itemid_dropdownItemC").trigger("liszt:updated");
            $("#item_dropdownItemC").trigger("liszt:updated");
            $("#item_dropdown").trigger("liszt:updated");
            $("#itemid_dropdown").trigger("liszt:updated");
        });
        if (type == "save") {
            var opt = "<option value='" + data.item_id + "' data-size='" + data.size + "' data-tax2='" + data.taxexempt + "' data-uom_item='" + data.uom + "' data-prate='" + data.cost_price + "' data-dis='" + data.item_pur_discount + "' data-grweight='" + data.grweight + "' data-stqty='" + data.stqty + "' data-stweight='" + data.stweight + "' data-barcode='" + data.item_barcode + "' data-tax='" + data.taxrate + "' >" + data.item_des + "</option>";
            $(opt).appendTo("#item_dropdown");
            $(opt).appendTo("#item_dropdownItemC");
            var opt1 = "<option value='" + data.item_id + "' data-size='" + data.size + "' data-tax2='" + data.taxexempt + "' data-uom_item='" + data.uom + "' data-prate='" + data.cost_price + "' data-dis='" + data.item_pur_discount + "' data-grweight='" + data.grweight + "' data-stqty='" + data.stqty + "' data-stweight='" + data.stweight + "' data-barcode='" + data.item_barcode + "' data-tax='" + data.taxrate + "' >" + data.item_id + "</option>";
            $(opt1).appendTo("#itemid_dropdownItemC");
            $(opt1).appendTo("#itemid_dropdown");
            $("#itemid_dropdownItemC").trigger("liszt:updated");
            $("#item_dropdownItemC").trigger("liszt:updated");
            $("#item_dropdown").trigger("liszt:updated");
            $("#itemid_dropdown").trigger("liszt:updated");
        }
    },
    validateSaveItem                  : function () {
        var errorFlag                 = false;
        const _desc                   = $.trim($("#txtItemName_modal").val());
        const cat                     = $.trim($("#category_dropdown_modal").val());
        const subcat                  = $("#subcategory_dropdown_modal").val();
        const brand                   = $.trim($("#brand_dropdown_modal").val());
        const Inventory_Non_Inventory = $("input[name=\"get-Header-Text-Inventory-Non-Inventory\"]:checked").val();
        $(".inputerror").removeClass("inputerror");

        if (_desc === "" || _desc === null) {
            $("#txtItemName_modal").addClass("inputerror");
            errorFlag = true;
        }
        if (Inventory_Non_Inventory === "Inventory") {

            if (! cat) {
                $("#category_dropdown_modal_chzn").addClass("inputerror");
                errorFlag = true;
            }

            if (! subcat) {
                $("#subcategory_dropdown_modal_chzn").addClass("inputerror");
                errorFlag = true;
            }
        }
        return errorFlag;
    },
    initSaveService                   : function () {
        const errorflag  = validateSaveService();
        const saveObject = getSaveObjectService();
        if (! errorflag) {
            saveService(saveObject);
        } else {
            $.notify({ message : "Correct the errors...!!!" }, { type : "danger" });
        }
    },
    initResetVehicle                  : function () {
        $("#textModalVehicleName").val("");
        $("#textModalVehicleRemarks").val("");
    },
    initSaveVehicle                   : function () {
        var saveObjGodown = general.getSaveObjectVehicle();
        var error         = general.validateSaveVehicle();
        if (! error) {
            general.saveVehicle(saveObjGodown);
        } else {
            alert("Correct the errors...");
        }
    },
    getSaveObjectVehicle              : function () {
        var obj             = {};
        obj.vehicle_id      = -1;
        obj.vehicle_name    = $.trim($("#textModalVehicleName").val());
        obj.vehicle_remarks = $.trim($("#textModalVehicleRemarks").val());
        return obj;
    },
    saveVehicle                       : function (vehicles) {
        $.ajax({
            url      : base_url + "index.php/setup/vehicle/save",
            type     : "POST",
            data     : {
                "obj"               : vehicles,
                "vouchertypehidden" : "new"
            },
            dataType : "JSON",
            success  : function (data) {
                if (data.error === "false") {
                    alert("An internal error occured while saving department. Please try again.");
                } else if (data == "duplicate") {
                    $.notify({ message : "Vehicle is already saved !!!" }, { type : "danger" });
                } else {
                    $.notify({ message : "Vehicle saved successfully !!!" }, { type : "success" });
                    $("#vehicleAddNewModal").modal("hide");
                    general.fetchVehicle(data.vehicle_id);
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    },
    validateSaveVehicle               : function () {
        var errorFlag = false;
        var _desc     = $.trim($("#textModalVehicleName").val());
        $(".inputerror").removeClass("inputerror");
        if (! _desc) {
            $("#textModalVehicleName").addClass("inputerror");
            errorFlag = true;
        }
        return errorFlag;
    },
    fetchVehicle                      : function (vehicle_id = 0) {
        $.ajax({
            url      : base_url + "index.php/setup/vehicle/fetchAllrecords",
            type     : "POST",
            dataType : "JSON",
            success  : function (data) {
                if (data === "false") {
                    alert("No data found");
                } else {
                    general.populateDataVehicle(data, vehicle_id);
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    },
    populateDataVehicle               : function (data, vehicle_id) {
        $("#vehicle_dropdwon").empty();
        const opt = "<option value='' disabled='' selected=''>Choose Vehicle</option>";
        $(opt).appendTo("#vehicle_dropdwon");
        $("#vehicle_dropdwon").trigger("liszt:updated");
        $.each(data, function (index, elem) {
            const opt = "<option value=" + elem.vehicle_id + ">" + elem.vehicle_name + "</option>";
            $(opt).appendTo("#vehicle_dropdwon");
        });
        $("#vehicle_dropdwon").val(vehicle_id).trigger("liszt:updated");
    },
    initSaveGodown                    : function () {
        var saveObjGodown = general.getSaveObjectGodown();
        var error         = general.validateSaveGodown();
        if (! error) {
            general.saveGodown(saveObjGodown);
        } else {
            alert("Correct the errors...");
        }
    },
    populateDataGodowns               : function (data) {
        $("#dept_dropdown").empty();
        $.each(data, function (index, elem) {
            var opt1 = "<option value=" + elem.did + ">" + elem.name + "</option>";
            $(opt1).appendTo("#dept_dropdown");
            $(opt1).appendTo("#dept_dropdownitemc");
            $("#dept_dropdownitemc").trigger("liszt:updated");
            $("#dept_dropdown").trigger("liszt:updated");
        });
    },
    fetchGodowns                      : function () {
        $.ajax({
            url      : base_url + "index.php/department/fetchAllDepartments",
            type     : "POST",
            dataType : "JSON",
            success  : function (data) {
                if (data === "false") {
                    alert("No data found");
                } else {
                    general.populateDataGodowns(data);
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    },
    populateDatamade                  : function (data) {
        $("#made_dropdown_modal").empty();
        $("#made_dropdown_modal").append("<option value=\"\" disabled selected>Choose Made</option>");
        $.each(data, function (index, elem) {
            var opt1 = "<option value=" + elem.made_id + ">" + elem.name + "</option>";
            $(opt1).appendTo("#made_dropdown_modal");
            $(opt1).appendTo("#made_dropdown_modalitemc");
            $("#made_dropdown_modalitemc").trigger("liszt:updated");
            $("#made_dropdown_modal").trigger("liszt:updated");
        });
    },
    fetchAllmades                     : function () {
        $.ajax({
            url      : base_url + "index.php/item/fetchAllmades",
            type     : "POST",
            dataType : "JSON",
            success  : function (data) {
                if (data === "false") {
                    alert("No data found");
                } else {
                    general.populateDatamade(data);
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    },
    getSaveObjectGodown               : function () {
        var obj         = {};
        obj.name        = $.trim($("#txtNameGodownAdd_modal").val());
        obj.description = $.trim($(".page_title").val());
        return obj;
    },
    saveGodown                        : function (department) {
        $.ajax({
            url      : base_url + "index.php/department/saveDepartment",
            type     : "POST",
            data     : {
                "department"          : department,
                "voucher_type_hidden" : "new"
            },
            dataType : "JSON",
            success  : function (data) {
                if (data.error === "false") {
                    alert("An internal error occured while saving department. Please try again.");
                } else {
                    alert("Department saved successfully.");
                    $("#GodownAddModel").modal("hide");
                    general.fetchGodowns();
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    },
    validateSaveGodown                : function () {
        var errorFlag = false;
        var _desc     = $.trim($("#txtNameGodownAdd_modal").val());
        $(".inputerror").removeClass("inputerror");
        if (! _desc) {
            $("#txtNameGodownAdd_modal").addClass("inputerror");
            errorFlag = true;
        }
        return errorFlag;
    },
    fetchItems                        : function (type) {
        $.ajax({
            url      : base_url + "index.php/item/fetchAll",
            type     : "POST",
            data     : { "active" : 1 },
            dataType : "JSON",
            success  : function (data) {
                if (data === "false") {
                    alert("No data found");
                } else {
                    general.populateDataItem(data, type);
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    },
    saveItem                          : function (item) {
        $.ajax({
            url      : base_url + "index.php/item/save",
            type     : "POST",
            data     : item,
            dataType : "JSON",
            success  : function (data) {
                if (data.error === "true") {
                    alert("An internal error occured while saving voucher. Please try again.");
                } else {
                    if (data == "duplicateitem") {
                        alert("item already saved!");
                    } else if (data == "duplicateshortcode") {
                        alert("Short code already saved!");
                    } else if (data == "duplicatebarcode") {
                        alert("Barcode code already saved!");
                    } else {
                        if (data.error === "false") {
                            alert("An internal error occured while saving voucher. Please try again.");
                        } else {
                            alert("Item saved successfully.");
                            $("#ItemAddModel").modal("hide");
                            $("#txtItemName_modal").val("").trigger("liszt:updated");
                            $("#category_dropdown_modal").val("").trigger("liszt:updated");
                            $("#subcategory_dropdown_modal").val("").trigger("liszt:updated");
                            $("#brand_dropdown_modal").val("").trigger("liszt:updated");
                            $("#made_dropdown_modal").val("").trigger("liszt:updated");
                            $("#txtSalePrice_modal").val("").trigger("liszt:updated");
                            $("#txtPurPrice_modal").val("").trigger("liszt:updated");
                            $("#uom_dropdown_modal").val("").trigger("liszt:updated");
                            $("#txtItemBarCode_modal").val("").trigger("liszt:updated");
                            $("#txtShortCode_modal").val("").trigger("liszt:updated");
                            $("#txttaxrate_modal").val($("#txttaxrate_modalhidden").val()).trigger("liszt:updated");
                            general.populateDataItemAfterSaveing(data);
                        }
                    }
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    },
    populateDataItemAfterSaveing      : function (data) {
        var option_id = "<option value=\"" + data.item_id + "\" data-size=\"" + data.size + "\" data-uom_item=\"" + data.uom + "\" data-prate=\"" + data.cost_price + "\" data-srate=\"" + data.srate + "\" data-dis=\"" + data.item_pur_discount + "\" data-tax2=\"" + data.taxexempt + "\" data-grweight=\"" + data.grweight + " \" data-stqty=\"" + data.stqty + "\" data-stweight=\"" + data.stweight + "\" data-tax=\"" + data.taxrate + "\" data-barcode=\"" + data.item_barcode + "\" data-inventory_id=\"" + data.inventory_id + "\" data-cost_id=\"" + data.cost_id + "\" data-income_id=\"" + data.income_id + "\" >" + data.item_id + "</option>";
        $(option_id).appendTo("#itemid_dropdownItemC");
        $(option_id).appendTo("#itemid_dropdown");
        var option = "<option value=\"" + data.item_id + "\" data-size=\"" + data.size + "\" data-uom_item=\"" + data.uom + "\" data-prate=\"" + data.cost_price + "\" data-srate=\"" + data.srate + "\" data-dis=\"" + data.item_pur_discount + "\" data-tax2=\"" + data.taxexempt + "\" data-grweight=\"" + data.grweight + " \" data-stqty=\"" + data.stqty + "\" data-stweight=\"" + data.stweight + "\" data-tax=\"" + data.taxrate + "\" data-barcode=\"" + data.item_barcode + "\" data-inventory_id=\"" + data.inventory_id + "\" data-cost_id=\"" + data.cost_id + "\" data-income_id=\"" + data.income_id + "\" >" + data.item_des + "</option>";
        $(option).appendTo("#item_dropdown");
        $(option).appendTo("#item_dropdownItemC");
        $("#itemid_dropdownItemC").val(data.item_id).trigger("liszt:updated");
        $("#item_dropdownItemC").val(data.item_id).trigger("liszt:updated");
        $("#item_dropdown").val(data.item_id).trigger("liszt:updated");
        $("#itemid_dropdown").val(data.item_id).trigger("liszt:updated");
        $("#item_dropdownItemC").trigger("change");
        $("#item_dropdown").trigger("change");
    },
    initSaveItem                      : function () {
        var error       = general.validateSaveItem();
        var saveObjItem = general.getSaveObjectItem();
        if (! error) {
            general.saveItem(saveObjItem);
        } else {
            alert("Correct the errors...");
        }
    },
    bindModalPartyGrid                : function () {
        var dontSort = [];
        $("#party-lookup table thead th").each(function () {
            if ($(this).hasClass("no_sort")) {
                dontSort.push({ "bSortable" : false });
            } else {
                dontSort.push(null);
            }
        });
        general.pdTable = $("#party-lookup table").dataTable({
            "sDom"            : "<'row-fluid table_top_bar'<'span12'<'to_hide_phone' f>>>t<'row-fluid control-group full top' <'span4 to_hide_tablet'l><'span8 pagination'p>>",
            "aaSorting"       : [[0, "asc"]],
            "bPaginate"       : true,
            "sPaginationType" : "full_numbers",
            "bJQueryUI"       : false,
            "aoColumns"       : dontSort
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            "s`" : "dataTables_wrapper form-inline"
        });
    },
    bindModalItemGrid                 : function () {
        var dontSort = [];
        $("#item-lookup table thead th").each(function () {
            if ($(this).hasClass("no_sort")) {
                dontSort.push({ "bSortable" : false });
            } else {
                dontSort.push(null);
            }
        });
        general.pdTable = $("#item-lookup table").dataTable({
            "sDom"            : "<'row-fluid table_top_bar'<'span12'<'to_hide_phone' f>>>t<'row-fluid control-group full top' <'span4 to_hide_tablet'l><'span8 pagination'p>>",
            "aaSorting"       : [[0, "asc"]],
            "bPaginate"       : true,
            "sPaginationType" : "full_numbers",
            "bJQueryUI"       : false,
            "aoColumns"       : dontSort
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            "s`" : "dataTables_wrapper form-inline"
        });
    },
    savehelp                          : function (obj) {
        $.ajax({
            url        : base_url + "index.php/customer/savehelp",
            type       : "POST",
            data       : { "obj" : obj },
            dataType   : "JSON",
            beforeSend : function (data) {
            },
            success    : function (data) {
            },
            error      : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    },
    setupfetchhelp                    : function (name) {
        $.ajax({
            url      : base_url + "index.php/customer/fetchhelp",
            type     : "POST",
            data     : { "name" : name },
            dataType : "JSON",
            success  : function (data) {
                if (data === "false") {
                } else {
                    $.each(data, function (index, elem) {
                        general.applyinghelp(elem.message, elem.inputid);
                    });
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    },
    applyinghelp                      : function (message, input) {
        $("div").children("input[type='text']").each(function () {
            if ($(this).attr("id") == input) {
                $("#" + $(this).attr("id") + "").attr("data-toggle", "tooltip");
                $("#" + $(this).attr("id") + "").attr("title", "" + message + "");
            }
        });
        $("div").children("input[type='number']").each(function () {
            if ($(this).attr("id") == input) {
                $("#" + $(this).attr("id") + "").attr("data-toggle", "tooltip");
                $("#" + $(this).attr("id") + "").attr("title", "" + message + "");
            }
        });
        $("div").children("input[type='radio']").each(function () {
            if ($(this).attr("id") == input) {
                $("#" + $(this).attr("id") + "").attr("data-toggle", "tooltip");
                $("#" + $(this).attr("id") + "").attr("title", "" + message + "");
            }
        });
        $("div").children("input[type='checkbox']").each(function () {
            if ($(this).attr("id") == input) {
                $("#" + $(this).attr("id") + "").attr("data-toggle", "tooltip");
                $("#" + $(this).attr("id") + "").attr("title", "" + message + "");
            }
        });
        $("div").children("select").each(function () {
            if ($(this).attr("id") == input) {
                $("#s2id_" + $(this).attr("id") + "").attr("data-toggle", "tooltip");
                $("#" + $(this).attr("id") + "_chzn").attr("data-toggle", "tooltip");
                $("#s2id_" + $(this).attr("id") + "").attr("title", "" + message + "");
                $("#" + $(this).attr("id") + "_chzn").attr("title", "" + message + "");
            }
        });
    },
    setPrivillages                    : function () {
        var insert  = $(".btnSave").data("insertbtn");
        var _delete = $(".btnDelete").data("deletetbtn");
        var print   = $(".btnPrint").data("printtbtn");
        var update  = $(".txtidupdate").data("txtidupdate");
        if (print == 0) {
            $(".btnPrint").hide();
            $(".btnCardPrint").hide();
        }
        if (_delete == 0) {
            $(".btnDelete").hide();
        }
        if (insert == 0 && update == 0) {
            $(".btnSave").hide();
            $(".btnReset").hide();
            $(".showallupdatebtn").hide();
        }
        if (insert == 0 && update == 1) {
            $(".btnSave").attr("disabled", true);
        }
    },
    calculateLowerTotalVoucher        : function () {
        var _qtyGrid        = 0;
        var _gamountGrid    = 0;
        var _discountamount = 0;
        var _amountGrid     = 0;
        var _taxamountGrid  = 0;
        var _netamountGrid  = 0;
        $("#purchase_table").find("tbody tr").each(function (index, elem) {
            _qtyGrid += getNumText($(elem).find("td.qty"));
            _gamountGrid += getNumText($(elem).find("td.gramount"));
            _discountamount += getNumText($(elem).find("td.discountamount"));
            _amountGrid += getNumText($(elem).find("td.amount"));
            _taxamountGrid += getNumText($(elem).find("td.taxupamount"));
            _netamountGrid += getNumText($(elem).find("td.taxamount"));
        });
        $(".txtTotalQty").text(_qtyGrid);
        $(".txtTotalGamount").text(_gamountGrid);
        $(".txtTotalDiscount").text(_discountamount);
        $(".txtTotalAmount").text(_amountGrid);
        $(".txtTotalTaxUpAmnt").text(_taxamountGrid);
        $(".txtTotalTaxAmnt").text(_netamountGrid);
    },
    validatedate                      : function (vrdate) {
        if (vrdate !== undefined) {
            var format = $("#default_date_format").val();
            vrdate     = moment(vrdate, format.toUpperCase());
            var sdate  = moment($("#sdate").val(), format.toUpperCase());
            var edate  = moment($("#edate").val(), format.toUpperCase());
            if (vrdate.isBefore(sdate)) {
                return true;
            }
            if (vrdate.isAfter(edate)) {
                return true;
            }
            return false;
        }
    },
    validateFinancialDate             : function (from, to) {
        var format = $("#default_date_format").val();
        from       = moment(from, format.toUpperCase());
        to         = moment(to, format.toUpperCase());
        var sdate  = moment($("#sdate").val(), format.toUpperCase());
        var edate  = moment($("#edate").val(), format.toUpperCase());
        var error  = true;
        if (from.isSameOrAfter(sdate) && from.isSameOrBefore(edate)) {
            error = false;
            if (to.isSameOrAfter(sdate) && to.isSameOrBefore(edate)) {
                error = false;
            } else {
                error = true;
            }
        } else {
            error = true;
        }
        if (error) {
            alert("Please Enter a Date Between " + sdate.format("YYYY/MM/DD") + " to " + edate.format("YYYY/MM/DD"));
        }
        return error;
    },
    fetchDistributionReceivablesCount : function () {
        var currDate = new Date().toISOString().slice(0, 10).replace("T", " ");
        $.ajax({
            url        : base_url + "index.php/report/fetchDisPayRecvCount",
            type       : "POST",
            dataType   : "JSON",
            data       : {
                company_id : $(".notif_cid").val(),
                etype      : "receiveable"
            },
            beforeSend : function () { },
            success    : function (data) {
                if (data == 0) {
                    $(".receiveable-result-count").css({
                        "visibility" : "hidden"
                    });
                } else {
                    $(".receiveable-result-count").css({
                        "visibility" : "visible"
                    });
                    $(".receiveable-result-count").html(data);
                }
            }
        });
    },
    ShowAlert                         : function (msg) {
        var msgg   = "";
        var titlee = "";
        if (msg.trim().toLowerCase() == "save") {
            msgg   = "Voucher is Save Successfully";
            titlee = "Success!";
        } else if (msg.trim().toLowerCase() == "error") {
            msgg   = "Sorry Try Again.....";
            titlee = "Warning!";
        } else {
            msgg   = msg;
            titlee = "Message";
        }
        var box = bootbox.alert({
            title    : titlee,
            message  : msgg,
            callback : function (result) {
                if (result === null) {
                } else {
                    general.reloadWindow();
                }
            }
        });
        setTimeout(function () {
            box.modal("hide");
            general.reloadWindow();
        }, 3000);
    },
    setUpdatePrivillage               : function () {
        var insert = $(".btnSave").data("insertbtn");
        var update = $(".txtidupdate").data("txtidupdate");
        if (insert == 1 && update == 0) {
            $(".btnSave").attr("disabled", true);
        }
    },
    getDateRange                      : function (from, to) {
        Date.prototype.addDays = function (days) {
            var dat = new Date(this.valueOf());
            dat.setDate(dat.getDate() + days);
            return dat;
        };
        var dates              = [];
        var currentDate        = new Date(from);
        dates.push(currentDate);
        var endDate = new Date(to);
        while (currentDate < endDate) {
            currentDate = currentDate.addDays(1);
            dates.push(currentDate);
        }
        return dates;
    },
    convertTo24Hour                   : function (time) {
        var hours = parseInt(time.substr(0, 2));
        if (time.indexOf("am") != -1 && hours == 12) {
            time = time.replace("12", "0");
        }
        if (time.indexOf("pm") != -1 && hours < 12) {
            time = time.replace(hours, (hours + 12));
        }
        return "0000-00-00 " + time.replace(/(am|pm)/, "") + ":00";
    },
    convertTo12Hour                   : function (time) {
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        if (time.length > 1) {
            time    = time.slice(1);
            time[5] = +time[0] < 12 ? " AM" : " PM";
            time[0] = +time[0] % 12 || 12;
        }
        return time.join("");
    },
    getCurrentTime                    : function () {
        var date = new Date(),
            hour = date.getHours();
        var dd   = "AM";
        var h    = hour;
        if (h > 12) {
            h  = hour - 12;
            dd = "PM";
        }
        if (h == 0) {
            h = 12;
        }
        return general.appendZero(h) + ":" + general.appendZero(date.getMinutes()) + " " + dd;
    },
    getTwentyFourHourTime             : function () {
        var d = new Date();
        return general.appendZero(d.getHours()) + ":" + general.appendZero(d.getMinutes());
    },
    getCurrentDate                    : function () {
        var d      = new Date();
        var _year  = d.getFullYear();
        var _month = d.getMonth() + 1;
        var _day   = d.getDate();
        return _year + "-" + _month + "-" + _day;
    },
    appendZero                        : function (num) {
        if (num < 10) {
            return "0" + num;
        }
        return num;
    },
    getDaysInMonth                    : function (month, year) {
        return new Date(year, month, 0).getDate();
    },
    getCurrentMonthName               : function () {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var d      = new Date();
        return months[d.getMonth()];
    },
    performAjaxSetup                  : function () {
        $.ajaxSetup({
            cache : false
        });
    },
    getQueryStringVal                 : function (key) {
        key       = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&");
        var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
        return match && decodeURIComponent(match[1].replace(/\+/g, " "));
    },
    reloadWindow                      : function () {
        var loc   = window.location.href,
            index = loc.indexOf("#");
        if (index > 0) {
            window.location = loc.substring(0, index);
        }
        window.location = self.location;
    },
    getSaveObjectAccount              : function () {
        var obj = {
            pid         : "20000",
            active      : "1",
            name        : $.trim($("#account_modal_txtAccountName").val()),
            level3      : $.trim($("#account_modal_txtLevel3").val()),
            date        : $("#account_current_date").val(),
            custom_type : $("#txtCustomType_account").val(),
            etype       : $("#account_modal_etype").val(),
            uid         : $.trim($("#uid").val()),
            company_id  : $.trim($("#cid").val())
        };
        return obj;
    },
    validateSaveAccount               : function () {
        var errorFlag            = false;
        var partyEl              = $("#account_modal_txtAccountName");
        var deptEl               = $("#account_modal_txtLevel3");
        var account_current_date = $("#account_current_date");
        $(".inputerror").removeClass("inputerror");
        if (! partyEl.val()) {
            $("#account_modal_txtAccountName").addClass("inputerror");
            errorFlag = true;
        }
        if (! deptEl.val()) {
            $("#account_modal_txtLevel3_chzn").addClass("inputerror");
            errorFlag = true;
        }
        if (! account_current_date.val()) {
            $("#account_current_date").addClass("inputerror");
            errorFlag = true;
        }
        return errorFlag;
    },
    saveAccount                       : function (accountObj) {
        $.ajax({
            url      : base_url + "index.php/addaccountonvoucher/save",
            type     : "POST",
            data     : {
                "accountDetail"       : accountObj,
                "voucher_type_hidden" : "new",
                "etype"               : $("#account_modal_etype").val()
            },
            dataType : "JSON",
            success  : function (response) {
                console.log(response);
                if (response == "duplicateAccount") {
                    alert("Account Name already saved!");
                } else if (response.error === "false") {
                    alert("An internal error occured while saving account. Please try again.");
                } else {
                    alert("Account saved successfully.");
                    $("#AccountAddModel").modal("hide");
                    // plz, don't change below the line code because it works for adding new items where the account adds operation with modal level3 wise.
                    const level3Object = {
                        "#inventory_dropdown" : "inventory_levels",
                        "#cost_dropdown"      : "cost_levels",
                        "#income_dropdown"    : "income_levels",
                        "#account_dropdwon"   : "foh_level3"
                    };
                    if (level3Object[$.trim($("#txthiddenAccountId").val())] !== undefined) {
                        general.fetchAccount(response.data, level3Object[$.trim($("#txthiddenAccountId").val())]);
                    } else {
                        general.fetchAccount(response.data);
                    }
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    },
    fetchAccount                      : function (selectedAccount = "", setting_level3 = "") {
        $.ajax({
            url      : base_url + "index.php/addaccountonvoucher/fetchAll",
            type     : "POST",
            data     : {
                "active"         : 1,
                "etype"          : $("#account_modal_etype").val(),
                "ename"          : "",
                "setting_level3" : setting_level3
            },
            dataType : "JSON",
            success  : function (data) {
                if (data === "false") {
                    alert("No data found");
                } else {
                    general.populateDataAccount(data, selectedAccount);
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    },
    populateDataAccount               : function (data, selectedAccount = "") {
        $("#party_dropdown11").empty();
        $($.trim($("#txthiddenAccountId").val())).empty();
        $.each(data, function (index, elem) {
            var opt = "<option value='" + elem.pid + "' data-credit='" + elem.balance + "' data-city='" + elem.city + "' data-address='" + elem.address + "' data-cityarea='" + elem.cityarea + "' data-mobile='" + elem.mobile + "' >" + elem.name + "</option>";
            $(opt).appendTo("#party_dropdown11");
            if (ifnull($.trim($("#txthiddenAccountId").val()), "-") !== "-") {
                $(opt).appendTo($.trim($("#txthiddenAccountId").val()));
            }
        });
        if (Array.isArray(selectedAccount)) {
            selectedAccount = selectedAccount[0];
        }
        $("#party_dropdown11").val(selectedAccount);
        $("#party_dropdown11").trigger("liszt:updated");
        if ($($.trim($("#txthiddenAccountId").val())).hasClass("chosen")) {
            $($.trim($("#txthiddenAccountId").val())).val(selectedAccount).trigger("liszt:updated");
        } else {
            $($.trim($("#txthiddenAccountId").val())).select2("val", selectedAccount);
        }

    },
    bindModalStaffGrid                : function () {
        var dontSort = [];
        $("#stafflookup-center table thead th").each(function () {
            if ($(this).hasClass("no_sort")) {
                dontSort.push({
                    "bSortable" : false
                });
            } else {
                dontSort.push(null);
            }
        });
        general.pdTable = $("#stafflookup-center table").dataTable({
            "sDom"            : "<'row-fluid table_top_bar'<'span12'<'to_hide_phone' f>>>t<'row-fluid control-group full top' <'span4 to_hide_tablet'l><'span8 pagination'p>>",
            "aaSorting"       : [[0, "asc"]],
            "bPaginate"       : true,
            "sPaginationType" : "full_numbers",
            "bJQueryUI"       : false,
            "aoColumns"       : dontSort
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            "s`" : "dataTables_wrapper form-inline"
        });
    },
    bindModalGLGrid                   : function () {
        var dontSort = [];
        $("#gl-lookup table thead th").each(function () {
            if ($(this).hasClass("no_sort")) {
                dontSort.push({
                    "bSortable" : false
                });
            } else {
                dontSort.push(null);
            }
        });
        general.gldTable = $("#gl-lookup table").dataTable({
            "sDom"            : "<'row-fluid table_top_bar'<'span12'<'to_hide_phone' f>>>t<'row-fluid control-group full top' <'span4 to_hide_tablet'l><'span8 pagination'p>>",
            "aaSorting"       : [[0, "asc"]],
            "bPaginate"       : true,
            "sPaginationType" : "full_numbers",
            "bJQueryUI"       : false,
            "iDisplayLength"  : 25,
            "aoColumns"       : dontSort
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            "s`" : "dataTables_wrapper form-inline"
        });
    },
    initSaveAccount                   : function () {
        var saveObjAccount = general.getSaveObjectAccount();
        var error          = general.validateSaveAccount();
        if (! error) {
            general.saveAccount(saveObjAccount);
        } else {
            alert("Correct the errors...");
        }
    },
    enableSave                        : function () {
        // Disable buttons
        $(".btnSave,.btnSave1").attr("disabled", "disabled");
        $(".btnDelete,.btnDelete1").attr("disabled", "disabled");

        // Remove existing shortcuts
        shortcut.remove("F10");
        shortcut.remove("F12");

        // Enable buttons
        $(".btnSave,.btnSave1").removeAttr("disabled");
        $(".btnDelete,.btnDelete1").removeAttr("disabled");

        // Add shortcuts
        if ($(".btnSave").length) {
            shortcut.add("F10", function () {
                $(".btnSave").get(0).click();
            });
        }
        if ($(".btnDelete").length) {
            shortcut.add("F12", function () {
                $(".btnDelete").get(0).click();
            });
        }
    },
    disableSave                       : function () {
        $(".btnSave,.btnSave1").attr("disabled", "disabled");
        $(".btnDelete,.btnDelete1").attr("disabled", "disabled");
        shortcut.remove("F10");
        shortcut.remove("F12");
    },
    disableHoldeSave                  : function () {
        $(".btnHoldBill,.btnHoldBill1").attr("disabled", "disabled");
        $(".btnRuningBill,.btnRuningBill1").attr("disabled", "disabled");
        shortcut.remove("F7");
        shortcut.remove("F8");
    },
    enableHoldeSave                   : function () {
        $(".btnHoldBill,.btnHoldBill1").attr("disabled", "disabled");
        $(".btnRuningBill,.btnRuningBill1").attr("disabled", "disabled");
        shortcut.remove("F7");
        shortcut.remove("F8");
        $(".btnHoldBill,.btnHoldBill1").removeAttr("disabled", "disabled");
        $(".btnRuningBill,.btnRuningBill1").removeAttr("disabled", "disabled");
        shortcut.add("F7", function () {
            $(".btnRuningBill").get()[0].click();
        });
        shortcut.add("F8", function () {
            $(".btnHoldBill").get()[0].click();
        });
    },
    getAbbrEtype                      : function (etype) {
        switch (etype) {
            case "purchase":
                etype = "PI";
                break;
            case "purchasereturn":
                etype = "PRI";
                break;
            case "sale":
                etype = "SI";
                break;
            case "salereturn":
                etype = "SRI";
                break;
            case "advance":
                etype = "ADV";
                break;
            case "banks":
                etype = "BANKS";
                break;
            case "loan":
                etype = "LOAN";
                break;
            case "penalty":
                etype = "PNTY";
                break;
            case "posreturn":
                etype = "posr";
                break;
            case "item_conversion":
                etype = "ASM";
                break;
            default:
                etype = etype.substr(0, 3);
        }
        return (etype.toUpperCase());
    },
    getTopNotifications               : function () {
        $.ajax({
            url        : base_url + "index.php/utility/getTopNotifications",
            type       : "POST",
            dataType   : "JSON",
            data       : { company_id : $(".notif_cid").val() },
            beforeSend : function () { },
            success    : function (notifs) {
                if (notifs[0]) {
                    $(".notifs").html(notifs[0].message);
                } else {
                    $(".notifs").html("Nothing new here!");
                }
            },
            error      : function () {
                console.log("Error showing the notifications!");
            },
            complete   : function () {
            }
        });
    },
    number_format                     : function (number, decimals, dec_point, thousands_sep) {
        var parts = number.toString().split(".");
        parts[0]  = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    },
    getNotificationCount              : function () {
        $.ajax({
            url        : base_url + "index.php/utility/getNotificationCount",
            type       : "POST",
            dataType   : "JSON",
            data       : { company_id : $(".cid").val() },
            beforeSend : function () { },
            success    : function (notifs) {
                $(".notif-count").html(notifs.notifcount);
            },
            error      : function () {
                console.log("Error showing the notification count!");
            },
            complete   : function () {
            }
        });
    },
    CDF                               : function (date) {
        var dates = date;
        var d     = new Date(dates.split("/").reverse().join("-"));
        var dd    = d.getDate();
        var mm    = d.getMonth() + 1;
        var yy    = d.getFullYear();
        if (dd <= 9) {
            dd = "0" + dd;
        }
        if (mm <= 9) {
            mm = "0" + mm;
        }
        var newdate = yy + "-" + mm + "-" + dd;
        return newdate;
    },
    blockKeys                         : function (e) {
        var numericKeys = [];
        var pressedKey  = e.which;
        for (i = 48; i < 58; i++) {
            numericKeys.push(i);
        }
        numericKeys.push(46);
        numericKeys.push(8);
        numericKeys.push(0);
        var flag = numericKeys.indexOf(pressedKey) >= 0;
        if (! flag) {
            e.preventDefault();
        }
    }
};
$(function () {
    $(window).on("load", function () {
        general.init();

    });

    function debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                fn(...args);
            }, delay);
        };
    }

    $("select").on("select2:open", debounce(function (e) {
        const select2Instance = $(e.target).data("select2");
        if (select2Instance) {
            let $search;
            if (select2Instance.options.options.multiple) {
                // For multi-select, search input is in the container.
                $search = select2Instance.$container.find(".select2-search__field");
            } else {
                // For single-select, search input is in the dropdown.
                $search = select2Instance.dropdown.$search[0];
            }

            if ($search) {
                $search.focus();
            }
        }
    }, 0));

    $.ajaxSetup({
        headers : {
            "X-CSRF-TOKEN" : $("meta[name=\"csrf-token\"]").attr("content")
        }
    });

    $("[data-toggle=\"popover\"]").popover({
        container : "body",
        trigger   : "focus"
    });
    $("[data-toggle=\"popover\"]").on("inserted.bs.popover", function () {
        $(".popover").addClass("shadow-lg");
    });
});

jQuery(document).ready(function ($) {
    $(document).on("click", ".pull-bs-canvas-right, .pull-bs-canvas-left", function () {
        $("body").prepend("<div class=\"bs-canvas-overlay bg-dark position-fixed w-100 h-100\"></div>");
        if ($(this).hasClass("pull-bs-canvas-right")) {
            $(".bs-canvas-right").addClass("mr-0");
        } else {
            $(".bs-canvas-left").addClass("ml-0");
        }
        return false;
    });

    $(document).on("click", ".bs-canvas-close, .bs-canvas-overlay", function () {
        var elm = $(this).hasClass("bs-canvas-close") ? $(this).closest(".bs-canvas") : $(".bs-canvas");
        elm.removeClass("mr-0 ml-0");
        $(".bs-canvas-overlay").remove();
        return false;
    });
});







