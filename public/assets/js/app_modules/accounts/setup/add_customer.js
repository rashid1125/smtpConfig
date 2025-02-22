import { customerApiEndpoints, dropdownOptions }                            from "../../../../../js/components/GlobalUrl.js";
import AlertComponent                                                       from "../../../../../js/components/AlertComponent.js";
import { baseConfiguration }                                                from "../../../../../js/components/ConfigurationManager.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, validateEmail } from "../../commonFunctions/CommonFunction.js";
import { makeAjaxRequest }                                                  from "../../../../../js/components/MakeAjaxRequest.js";
import DynamicOption                                                        from "../../../../../js/components/DynamicOption.js";

var Customer = function () {
    const modalInstance = $("#customerAddModalId");
    const VoucherEtype  = "customers";

    const resetField = () => {
        const resetArray = ["customerHiddenId", "customerName", "nativeCustomerName", "customerAddress", "nativeCustomerAddress", "customerMobile", "customerPhone", "customerCreditDays", "customerCreditLimit", "customerLevel3", "customerContactPerson", "customerNTN", "customerEmail", "customerCNIC", "customerCountry", "customerCity", "customerCityArea", "customerSaleOfficer", "customerCurrency"];
        clearValueAndText(resetArray, "#");
        $(".inputerror").removeClass("inputerror");
        $("#customerLevel3").val(baseConfiguration.customerlevel3).trigger("change.select2");
        $("#customerType").val(1).trigger("change.select2");
    };

    const resetVoucher = () => {
        resetField();
        getCustomerDataTable();
    };

    var getSaveObject = function () {
        const customer = {
            pid             : $("#customerHiddenId").val(),
            name            : $("#customerName").val(),
            uname           : $("#nativeCustomerName").val(),
            address         : $("#customerAddress").val(),
            uaddress        : $("#nativeCustomerAddress").val(),
            mobile          : $("#customerMobile").val(),
            phone           : $("#customerPhone").val(),
            credit_days     : $("#customerCreditDays").val(),
            limit           : $("#customerCreditLimit").val(),
            custom_type     : $("#customerType").val(),
            level3          : $("#customerLevel3").val(),
            contact_person  : $("#customerContactPerson").val(),
            ntn             : $("#customerNTN").val(),
            email           : $("#customerEmail").val(),
            cnic            : $("#customerCNIC").val(),
            country         : $("#customerCountry").val(),
            city            : $("#customerCity").val(),
            cityarea        : $("#customerCityArea").val(),
            sale_officer_id : $("#customerSaleOfficer").val(),
            currency_id     : $("#customerCurrency").val()
        };
        return customer;
    };

    // saves the data into the database
    var save = async function (customer) {
        const response = await makeAjaxRequest("POST", customerApiEndpoints.saveCustomer, {
            customerData : JSON.stringify(customer)
        });
        if (response.status == false && response.error !== "") {
            AlertComponent._getAlertMessage("Error!", response.message, "danger");
        } else if (response.status == false && response.message !== "") {
            AlertComponent._getAlertMessage("Warning!", response.message, "warning");
        } else {
            AlertComponent._getAlertMessage("Successfully!", response.message, "success");
            resetVoucher();
        }
    };

    // checks for the empty fields
    var validateSave = function () {

        let errorFlag = false;

        const customerName        = $("#customerName");
        const customerLevel3      = $("#customerLevel3");
        const customerType        = $("#customerType");
        const customerSaleOfficer = $("#customerSaleOfficer");

        // remove the error class first
        $(".inputerror").removeClass("inputerror");

        if (! customerName.val()) {
            customerName.addClass("inputerror");
            errorFlag = true;
        }

        if (! customerType.val()) {
            $("#select2-customerType-container").parent().addClass("inputerror");
            errorFlag = true;
        }

        if (! customerLevel3.val()) {
            $("#select2-customerLevel3-container").parent().addClass("inputerror");
            errorFlag = true;
        }

        if (! customerSaleOfficer.val()) {
            $("#select2-customerSaleOfficer-container").parent().addClass("inputerror");
            errorFlag = true;
        }

        return errorFlag;
    };

    var getCustomerById = function (customerId) {
        $.ajax({
            url      : `${customerApiEndpoints.getCustomerById}`,
            type     : "GET",
            data     : { "pid" : customerId },
            dataType : "JSON",
            success  : function (response) {
                resetField();
                if (response.status == false && response.message !== "" && response.error !== "") {
                    _getAlertMessage("Error!", response.message, "danger");
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage("Information!", response.message, "info");
                } else {
                    populateData(response.data);
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    // generates the view
    var populateData = function (data) {
        $("#customerAddModalId").modal("show");
        $("#customerHiddenId").val(data.pid);
        $("#customerName").val(data.name);
        $("#nativeCustomerName").val(data.uname);
        $("#customerAddress").val(data.address);
        $("#nativeCustomerAddress").val(data.uaddress);
        $("#customerMobile").val(data.mobile);
        $("#customerPhone").val(data.phone);
        $("#customerCreditDays").val(data.credit_days);
        $("#customerCreditLimit").val(data.limit);
        $("#customerType").val(data.custom_type).trigger("change.select2");
        $("#customerLevel3").val(data.level3).trigger("change.select2");
        $("#customerContactPerson").val(data.contact_person);
        $("#customerNTN").val(data.ntn);
        $("#customerEmail").val(data.email);
        $("#customerCNIC").val(data.cnic);
        $("#customerCountry").val(data.cnic);
        $("#customerCity").val(data.city);
        $("#customerCityArea").val(data.cityarea);
        $("#customerSaleOfficer").val(data.sale_officer_id).trigger("change.select2");
        appendSelect2ValueIfDataExists("customerCurrency", "currency", "id", "name", data);
    };

    let searchCustomerListViewTable = undefined;
    const getCustomerDataTable      = (voucherType = "", itemType = "") => {
        if (typeof searchCustomerListViewTable !== "undefined") {
            searchCustomerListViewTable.destroy();
            $("#customerViewListTbody").empty();
        }
        searchCustomerListViewTable = $("#customerViewList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url  : `${customerApiEndpoints.getCustomerDataTable}`,
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
            columns    : [{
                data       : null,
                className  : "select",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row, meta) {
                    return meta.row + 1;
                }
            }, {
                data      : "spid",
                name      : "spid",
                className : "spid"
            }, {
                data      : "name",
                name      : "name",
                className : "text-left name"
            }, {
                data      : "level3_name",
                name      : "lastLevel.name",
                className : "level3_name"
            }, {
                data      : "mobile",
                name      : "mobile",
                className : "mobile_number"
            }, {
                data       : null,
                className  : "select text-right",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row) {
                    let buttons = "<button class=\"btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-customer\" data-vrnoa_hide=\"" + row.pid + "\" data-toggle=\"tooltip\" data-title=\"View Detail On Modal\"><i class=\"fa fa-edit\"></i></button>";
                    if (row.active == "1") {
                        buttons += "<a href=\"#\" class=\"btn btn-sm btn-outline-warning group-hover:bg-yellow-800 group-hover:border-yellow-800 group-hover:text-white btn-edit-customerListActive text-center ml-2\" data-tName=\"party\" data-eType=\"" + row.etype + "\" data-cName=\"active\" data-pId=\"pid\" data-action=\"/setup/inactive\" data-vrnoa=\"" + row.pid + "\"><i class=\"fas fa-times-circle\"></i></a>";
                    } else if (row.active == "0") {
                        buttons += "<a href=\"#\" class=\"btn btn-sm btn-outline-success group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white btn-edit-customerListInActive text-center ml-2\" data-tName=\"party\" data-eType=\"" + row.etype + "\" data-cName=\"active\" data-pId=\"pid\" data-action=\"/setup/active\" data-vrnoa=\"" + row.pid + "\"><i class=\"fas fa-check\"></i></a>";
                    }
                    return buttons;
                }
            }],
            createdRow : function (row, data, dataIndex) {
                $(row).addClass("group odd:bg-white even:bg-slate-50 py-1 px-1");
                $("td", row).addClass("py-1 px-1 text-md align-middle text-middle");
            }
        });
    };

    const updateCustomerListStatus = async function (customerId) {
        const response = await makeAjaxRequest("PUT", `${customerApiEndpoints.updateCustomerListStatus}`, {
            customerId : customerId
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({
                title   : "Error",
                message : response.message,
                type    : "danger"
            });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({
                title   : "Warning",
                message : response.message,
                type    : "warning"
            });
        } else {
            AlertComponent.getAlertMessage({
                title   : "Successfully",
                message : response.message,
                type    : "success"
            });
            searchCustomerListViewTable.ajax.reload();
        }
    };

    return {

        init : function () {
            this.bindUI();
            $(".select2").select2();
            getCustomerDataTable();
        },

        bindUI   : function () {
            $("[data-toggle=\"tooltip\"]").tooltip();
            const self = this;
            $(document.body).on("click", "#customerModalShow", function (e) {
                e.preventDefault();
                resetField();
                $(modalInstance).modal("show");
                setTimeout(function () {
                    $("#customerName").focus();
                }, 500);
            });
            $(document.body).on("click", "#customerSyncAlt", function (e) {
                e.preventDefault();
                getCustomerDataTable();
            });
            $("#tableImport").on("click", ".btnRowRemove", function (e) {
                e.preventDefault();
                $(this).closest("tr").remove();
            });

            $("#customerLevel3").on("change", function () {
                var l3 = $(this).find("option:selected").text();
                var l2 = $(this).find("option:selected").data("level2");
                var l1 = $(this).find("option:selected").data("level1");
                $("#accountTypeLevel3").html(l3);
                $("#accountTypeLevel2").html(l2);
                $("#accountTypeLevel1").html(l1);
            });

            $("#customerLevel3").val(baseConfiguration.customerlevel3).trigger("change");
            shortcut.add("F10", function () {
                $("#customerSaveButton").get()[0].click();
            });
            $("#customerSaveButton").on("click", async function (e) {
                e.preventDefault();
                await self.initSave();
            });
            shortcut.add("F5", function () {
                $("#customerResetButton").get()[0].click();
            });

            $("#customerResetButton").on("click", function (e) {
                e.preventDefault();
                resetVoucher();
            });
            // when edit button is clicked inside the table view
            $(document.body).on("click", ".btn-edit-customer", function (e) {
                e.preventDefault();
                const customerId = $(this).data("vrnoa_hide");
                getCustomerById(customerId);
            });
            $("#customerEmail").on("change", function () {
                const EMail = $.trim($(this).val()).toLowerCase();
                if (validateEmail(EMail)) {
                    $("#customerEmail").removeClass("inputerror");
                } else {
                    $("#customerEmail").addClass("inputerror");
                    $("#customerEmail").focus();
                    return AlertComponent._getAlertMessage("Error!", "The email must be a valid email address.", "danger");
                }
            });
            $(document.body).on("click", ".btn-edit-customerListActive", async function (e) {
                e.preventDefault();
                const customerId = $(this).data("vrnoa");
                await updateCustomerListStatus(customerId);
            });
            $(document.body).on("click", ".btn-edit-customerListInActive", async function (e) {
                e.preventDefault();
                const customerId = $(this).data("vrnoa");
                await updateCustomerListStatus(customerId);
            });
        },
        initSave : async function () {
            const isValid    = validateSave();
            const accountObj = getSaveObject();
            if (isValid) {
                return AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : "Correct the errors",
                    type    : "danger"
                });
            }
            await save(accountObj);
        }
    };
};

var customer = new Customer();
customer.init();

$(function () {
    new DynamicOption("#customerCurrency", {
        requestedUrl    : dropdownOptions.getAllCurrency,
        placeholderText : "Choose Currency",
        allowClear      : true
    });
});
