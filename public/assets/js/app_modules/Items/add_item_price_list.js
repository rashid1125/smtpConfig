import AlertComponent                                                                                                                       from "../../../../js/components/AlertComponent.js";
import DynamicOption                                                                                                                        from "../../../../js/components/DynamicOption.js";
import { dropdownOptions, itemPriceApiEndpoints }                                                                                           from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest }                                                                                                                  from "../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText, disableButton, doLoading, enableDisableButton, ifNull, updateDatepickerWithFormattedDate, updateFormattedDate } from "../commonFunctions/CommonFunction.js";

const ItemPriceList = function () {
    var validateSave  = function () {
        let errorFlag = false;

        // Retrieve input values
        const itemPriceName      = $("#itemPriceName").val().trim();
        const itemPriceStartDate = $("#itemPriceStartDate").val().trim();
        const itemPriceEndDate   = $("#itemPriceEndDate").val().trim();

        // Reset previous error states
        $(".inputerror").removeClass("inputerror"); // Remove previous errors

        // Function to display error
        const displayError = (selector, message) => {
            AlertComponent.getAlertMessage({
                title   : "Error",
                message : message,
                type    : "danger"
            });
            $(selector).addClass("inputerror").focus();
            errorFlag = true;
        };

        // Validate Item Price Name
        if (itemPriceName === "") {
            displayError("#itemPriceName", "Please enter a price list name");
        }

        // Validate Item Price Start Date
        if (! errorFlag && itemPriceStartDate === "") {
            displayError("#itemPriceStartDate", "Please enter a start date");
        }

        // Validate Item Price End Date
        if (! errorFlag && itemPriceEndDate === "") {
            displayError("#itemPriceEndDate", "Please enter an end date");
        }

        // Additional validation: Ensure start date is not after end date
        if (! errorFlag && itemPriceStartDate > itemPriceEndDate) {
            displayError("#itemPriceEndDate", "End date must be after the start date");
        }

        return errorFlag;
    };
    var getSaveObject = function () {
        // Initialize the main object
        const itemPrice       = {
            id              : parseFloat($("#itemPriceId").val()) || 0,
            price_list_name : $("#itemPriceName").val().trim(),
            start_date      : $("#itemPriceStartDate").val().trim(),
            end_date        : $("#itemPriceEndDate").val().trim()
        };
        const itemPriceDetail = [];

        // Access the DataTable instance
        const searchItemPriceDataTable = $("#searchItemPriceDataTable").DataTable();
        // Use .data() to get all data or .rows().nodes() to iterate over all rows
        searchItemPriceDataTable.rows().every(function () {
            var row       = $(this.node());
            const details = {
                item_id             : row.find("td.itemName").data("item-id"),
                retail_price        : parseFloat(row.find("td.retailPrice input").val()) || 0,
                wholesale_price     : parseFloat(row.find("td.wholeSalePrice input").val()) || 0,
                distributor_price   : parseFloat(row.find("td.distributorPrice input").val()) || 0,
                discount_percentage : parseFloat(row.find("td.discountPercentage input").val()) || 0,
                gst_percentage      : parseFloat(row.find("td.gstPercentage input").val()) || 0
            };
            // Checking if any of the prices or discount_percentage is greater than 0
            if ([details.retail_price, details.wholesale_price, details.distributor_price, details.discount_percentage].some(price => price > 0)) {
                itemPriceDetail.push(details);
            }
        });

        // Package the collected data
        const data = {
            itemPrice,
            itemPriceDetail
        };

        return data;
    };
    const save        = async function (itemData) {
        doLoading(true);
        await disableButton(".saveButton");
        try {
            const response = await makeAjaxRequest("POST", `${itemPriceApiEndpoints.save}`, {
                itemPrice       : JSON.stringify(itemData.itemPrice),
                itemPriceDetail : JSON.stringify(itemData.itemPriceDetail)
            });

            if (response.status === false) {
                AlertComponent.getAlertMessage({
                    title   : "Error",
                    message : response.message,
                    type    : "danger"
                });
            } else if (response.status === true) {
                AlertComponent.getAlertMessage({
                    title   : "Success",
                    message : response.message,
                    type    : "success"
                });
                resetVoucher();
            }

        } catch (e) {
            console.log(e);
        } finally {
            doLoading(true);
            await enableDisableButton(".saveButton");
        }
    };

    var getItemPriceListById = async function (itemPriceListId) {
        resetField();

        if (typeof itemPriceList.itemPriceListDataTable != "undefined") {
            itemPriceList.itemPriceListDataTable.fnDestroy();
            $("#searchItemPriceDataTableTbody").empty();
        }

        const response = await makeAjaxRequest("GET", `${itemPriceApiEndpoints.getItemPriceListById}`, {
            itemPriceListId : itemPriceListId
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
            $("a[href=\"#Main\"]").trigger("click");
            populateItemData(response.data);
        }
    };

    const populateItemData = function (data) {
        $("#itemPriceFilterDiv").addClass("d-none");
        $("#itemPriceName").val(data.price_list_name);
        $("#itemPriceId").val(data.id);
        updateDatepickerWithFormattedDate("itemPriceStartDate", data.start_date);
        updateDatepickerWithFormattedDate("itemPriceEndDate", data.end_date);
        $("#searchItemPriceDataTable").append(data.htmlContent);
        bindGridDataTable();
    };

    var getItemDetails = async function (itemPriceCategory, itemPriceSubCategory, itemPriceBrand) {
        doLoading(true);
        await disableButton("#itemPriceSearchButton");
        try {
            if (typeof itemPriceList.itemPriceListDataTable != "undefined") {
                itemPriceList.itemPriceListDataTable.fnDestroy();
                $("#searchItemPriceDataTableTbody").empty();
            }
            const response = await makeAjaxRequest("GET", `${itemPriceApiEndpoints.getItemDetails}`, {
                itemPriceCategory    : itemPriceCategory,
                itemPriceSubCategory : itemPriceSubCategory,
                itemPriceBrand       : itemPriceBrand
            });
            if (response.status === false && response.error !== "") {
                AlertComponent.getAlertMessage({
                    title   : "Error",
                    message : response.message,
                    type    : "danger"
                });
            } else if (response.status === false && response.message !== "") {
                AlertComponent.getAlertMessage({
                    title   : "Warning",
                    message : response.message,
                    type    : "warning"
                });
            } else {

                populateItemDetailsData(response.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            doLoading(false);
            await enableDisableButton("#itemPriceSearchButton");
        }
    };

    const populateItemDetailsData = function (data) {
        $("#searchItemPriceDataTable").append(data.htmlContent);
        bindGridDataTable();
    };

    const appendRow = (itemCode, itemId, itemName, lastUpdateDate, retailPrice, wholeSalePrice, distributorPrice, discountPercentage, gstPercentage) => {
        return `<tr class="odd:bg-white even:bg-slate-50">
        <td></td>
        <td class="py-1 px-1 text-md align-middle text-left">${ifNull(itemCode, "")}</td>
        <td class="py-1 px-1 text-md align-middle text-left itemName" data-item-id="${itemId}">${ifNull(itemName, "")}</td>
        <td class="py-1 px-1 text-md align-middle text-left">${ifNull(updateFormattedDate(lastUpdateDate), "")}</td>
        <td class="py- px-1 text-md align-middle text-right retailPrice"><input type="number" class="form-control form-input-class  is_numeric text-right w-20 h-8 float-right retailPrice"  value="${ifNull(retailPrice, "")}" min="1"/></td>
        <td class="py- px-1 text-md align-middle text-right wholeSalePrice"><input type="number" class="form-control form-input-class  is_numeric text-right w-20 h-8 float-right wholeSalePrice"  value="${ifNull(wholeSalePrice, "")}" min="1"/></td>
        <td class="py- px-1 text-md align-middle text-right distributorPrice"><input type="number" class="form-control form-input-class  is_numeric text-right w-20 h-8 float-right distributorPrice"  value="${ifNull(distributorPrice, "")}" min="1"/></td>
        <td class="py- px-1 text-md align-middle text-right discountPercentage"><input type="number" class="form-control form-input-class  is_numeric text-right w-20 h-8 float-right discountPercentage"  value="${ifNull(discountPercentage, "")}" min="1"/></td>
        <td class="py- px-1 text-md align-middle text-right gstPercentage"><input type="number" class="form-control form-input-class  is_numeric text-right w-20 h-8 float-right gstPercentage"  value="${ifNull(gstPercentage, "")}" min="1"/></td>
      </tr>`;
    };

    var updateItemPriceListStatus = async function (itemPriceListId) {
        const response = await makeAjaxRequest("PUT", `${itemPriceApiEndpoints.updateItemPriceListStatus}`, {
            itemPriceListId : itemPriceListId
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
            itemPriceDataTable.ajax.reload();
        }
    };

    const resetField = () => {
        const resetArray = ["itemPriceId", "itemPriceName", "itemPriceStartDate", "itemPriceEndDate", "itemPriceCategoryDropdown", "itemPriceSubCategoryDropdown", "itemPriceBrandDropdown"];
        clearValueAndText(resetArray, "#");
        const resetDisabledArray = [{
            selector : "itemPriceStatus",
            options  : {
                checked : true,
                trigger : "change"
            }
        }];
        clearValueAndText(resetDisabledArray);
        $("#itemPriceFilterDiv").removeClass("d-none");
        $("#searchItemPriceDataTable tbody tr").remove();
    };

    const resetVoucher = () => {
        if (typeof itemPriceList.itemPriceListDataTable != "undefined") {
            itemPriceList.itemPriceListDataTable.fnDestroy();
            $("#searchItemPriceDataTableTbody").empty();
        }
        getItemPriceDataTable();
        resetField();
    };

    const bindGridDataTable = () => {
        itemPriceList.itemPriceListDataTable = $("#searchItemPriceDataTable").dataTable({
            "autoWidth" : false,
            "response"  : true
        });
    };

    let itemPriceDataTable      = undefined;
    const getItemPriceDataTable = (voucherType = "", itemType = "") => {
        if (typeof itemPriceDataTable !== "undefined") {
            itemPriceDataTable.destroy();
            $("#itemPriceDataTableTbody").empty();
        }
        itemPriceDataTable = $("#itemPriceDataTable").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url  : `${itemPriceApiEndpoints.getItemPriceDataTable}`,
                data : function (data) {
                    console.log(data);
                    data.params = {
                        sac : ""
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
                data      : "price_list_name",
                name      : "price_list_name",
                className : "price_list_name"
            }, {
                data      : "vrdate",
                name      : "vrdate",
                className : "text-left createdDate",
                render    : function (data, type, row) {
                    return updateFormattedDate(data);
                }
            }, {
                data      : "start_date",
                name      : "start_date",
                className : "text-left startDate",
                render    : function (data, type, row) {
                    return updateFormattedDate(data);
                }
            }, {
                data      : "end_date",
                name      : "end_date",
                className : "text-left endDate",
                render    : function (data, type, row) {
                    return updateFormattedDate(data);
                }
            }, {
                data      : "active",
                name      : "active",
                className : "text-left active"
            }, {
                data       : null,
                className  : "select text-right",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row) {
                    let buttons = "<button class=\"btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-itemPriceList\" data-id=\"" + row.id + "\" data-toggle=\"tooltip\" data-title=\"View Detail On Modal\"><i class=\"fa fa-edit\"></i></button>";
                    if (row.active === "Yes") {
                        buttons += "<a href=\"#\" class=\"btn btn-sm btn-outline-warning group-hover:bg-yellow-800 group-hover:border-yellow-800 group-hover:text-white btn-Active-actionReload btn-edit-itemPriceListActive text-center ml-2\" data-id=\"" + row.id + "\"><i class=\"fas fa-times-circle\"></i></a>";
                    } else if (row.active == "No") {
                        buttons += "<a href=\"#\" class=\"btn btn-sm btn-outline-success group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white btn-inActive-actionReload btn-edit-itemPriceListInActive text-center ml-2\" data-id=\"" + row.id + "\"><i class=\"fas fa-check\"></i></a>";
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

    return {

        init : function () {
            this.bindUI();
            $(".select2").select2();
            getItemPriceDataTable();
        },

        bindUI : function () {
            const self = this;
            $("[data-toggle=\"tooltip\"]").tooltip();
            $(document.body).on("click", "#itemPriceSyncAlt", function (e) {
                e.preventDefault();
                getItemPriceDataTable();
            });

            $(document.body).on("click", "#itemPriceSearchButton", async function (e) {
                e.preventDefault();
                const itemPriceCategoryDropdown    = $("#itemPriceCategoryDropdown").val();
                const itemPriceSubCategoryDropdown = $("#itemPriceSubCategoryDropdown").val();
                const itemPriceBrandDropdown       = $("#itemPriceBrandDropdown").val();
                await getItemDetails(itemPriceCategoryDropdown, itemPriceSubCategoryDropdown, itemPriceBrandDropdown);
            });

            shortcut.add("F10", function () {
                $("#saveButton").get()[0].click();
            });
            shortcut.add("F5", function () {
                $("#resetButton").get()[0].click();
            });
            // when save button is clicked
            $("#saveButton").on("click", async function (e) {
                e.preventDefault();
                await self.initSave();
            });

            // when the reset button is clicked
            $("#resetButton").on("click", function (e) {
                e.preventDefault();
                resetVoucher();
            });
            // when edit button is clicked inside the table view
            $("body").on("click", ".btn-edit-itemPriceList", async function (e) {
                e.preventDefault();
                const itemPriceListId = $(this).data("id");
                await getItemPriceListById(itemPriceListId);
            });
            $(document.body).on("click", ".btn-edit-itemPriceListActive", async function (e) {
                e.preventDefault();
                const itemPriceListId = $(this).data("id");
                await updateItemPriceListStatus(itemPriceListId);
            });
            $(document.body).on("click", ".btn-edit-itemPriceListInActive", async function (e) {
                e.preventDefault();
                const itemPriceListId = $(this).data("id");
                await updateItemPriceListStatus(itemPriceListId);
            });
        },

        initSave : async function () {
            if (validateSave()) {
                return;
            }
            await save(getSaveObject());
        }
    };

};
const itemPriceList = new ItemPriceList();
itemPriceList.init();

document.addEventListener("DOMContentLoaded", function () {
    new DynamicOption("#itemPriceCategoryDropdown", {
        requestedUrl    : dropdownOptions.getAllCategory,
        placeholderText : "Choose Category"
    });

    new DynamicOption("#itemPriceSubCategoryDropdown", {
        requestedUrl    : dropdownOptions.getAllSubCategory,
        placeholderText : "Choose Sub Category"
    });

    new DynamicOption("#itemPriceBrandDropdown", {
        requestedUrl    : dropdownOptions.getAllBrand,
        placeholderText : "Choose Brand"
    });
});
