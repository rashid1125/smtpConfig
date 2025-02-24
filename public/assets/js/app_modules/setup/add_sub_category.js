"use strict";
import AlertComponent                   from "../../../../js/components/AlertComponent.js";
import { subCategoryApiEndpoints }      from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest }              from "../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText, doLoading } from "../commonFunctions/CommonFunction.js";

const ClassSubCategory = function () {
    const $modalInstance                 = $("#subCategoryAddModalId");
    const subCategoryHiddenIdSelector    = "#subCategoryHiddenId";
    const subCategoryNameSelector        = "#subCategoryName";
    const subCategoryNativeNameSelector  = "#subCategoryNativeName";
    const subCategoryDescriptionSelector = "#subCategoryDescription";

    // instance
    const subCategoryHiddenIdInstance    = $(subCategoryHiddenIdSelector);
    const subCategoryNameInstance        = $(subCategoryNameSelector);
    const subCategoryNativeNameInstance  = $(subCategoryNativeNameSelector);
    const subCategoryDescriptionInstance = $(subCategoryDescriptionSelector);
    const save                           = async function (subCategoryObject) {
        doLoading(true);
        try {
            const response = await makeAjaxRequest("POST", subCategoryApiEndpoints.saveSubCategory, {
                subCategoryObject : JSON.stringify(subCategoryObject)
            });
            if (response && ! response.status) {
                AlertComponent.getAlertMessage({
                    message : response.message,
                    type    : "danger"
                });
            } else if (response && response.status) {
                resetVoucher();
                $($modalInstance).modal("hide");
            }
        } catch (e) {
            console.log(e);
        } finally {
            doLoading(false);
        }
    };

    const getSubCategoryById = async function (subCategoryId) {
        doLoading(true);
        try {
            const response = await makeAjaxRequest("GET", subCategoryApiEndpoints.getSubCategoryById, {
                subCategoryId : subCategoryId
            });
            resetVoucher();
            if (response && ! response.status) {
                AlertComponent.getAlertMessage({
                    message : response.message,
                    type    : "danger"
                });
            } else {
                $($modalInstance).modal("show");
                populateData(response.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            doLoading(false);
        }
    };

    const populateData = function (elem) {
        subCategoryHiddenIdInstance.val(elem.id);
        subCategoryNameInstance.val(elem.name);
        subCategoryNativeNameInstance.val(elem.native_name);
        subCategoryDescriptionInstance.val(elem.description);
    };
    const validateSave = function () {

        let errorFlag         = false;
        const subCategoryName = $.trim($(subCategoryNameInstance).val());
        $(".inputerror").removeClass("inputerror");
        if (subCategoryName === "") {
            $(subCategoryNameSelector).addClass("inputerror");
            errorFlag = true;
        }
        return errorFlag;
    };

    const getSaveObject           = function () {
        return {
            id          : subCategoryHiddenIdInstance.val() || "",
            name        : subCategoryNameInstance.val(),
            native_name : subCategoryNativeNameInstance.val(),
            description : subCategoryDescriptionInstance.val()
        };
    };
    let subCategoryDataTable      = undefined;
    const getSubCategoryDataTable = () => {
        if (typeof subCategoryDataTable !== "undefined") {
            subCategoryDataTable.destroy();
            $("#subCategoryViewListTbody").empty();
        }
        subCategoryDataTable = $("#subCategoryViewList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url : `${subCategoryApiEndpoints.getSubCategoryDataTable}`
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
                data      : "id",
                name      : "id",
                className : "id"
            }, {
                data      : "name",
                name      : "name",
                className : "text-left name",
                render    : function (data) {
                    return data || "";
                }
            }, {
                data      : "native_name",
                name      : "native_name",
                className : "native_name",
                render    : function (data) {
                    return data || "";
                }
            }, {
                data      : "description",
                name      : "description",
                className : "description",
                render    : function (data) {
                    return data || "";
                }
            }, {
                data       : null,
                className  : "select text-right",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row) {
                    return "<button class=\"btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-subCategory\" data-vrnoa_hide=\"" + row.id + "\" data-toggle=\"tooltip\" data-title=\"View Detail On Modal\"><i class=\"fa fa-edit\"></i></button>";
                }
            }],
            createdRow : function (row) {
                $(row).addClass("group odd:bg-white even:bg-slate-50 py-1 px-1");
                $("td", row).addClass("py-1 px-1 text-md align-middle text-middle");
            }
        });
    };
    const resetField              = () => {
        clearValueAndText(["subCategoryHiddenId", "subCategoryName", "subCategoryNativeName", "subCategoryDescription"], "#");
    };

    const resetVoucher = () => {
        resetField();
        getSubCategoryDataTable();
    };

    return {

        init : function () {
            this.bindUI();
            getSubCategoryDataTable();
        },

        bindUI : function () {
            $("[data-toggle=\"tooltip\"]").tooltip();

            const self = this;
            $(document.body).on("click", "#subCategoryModalShow", function (e) {
                e.preventDefault();
                resetField();
                $($modalInstance).modal("show");
                setTimeout(function () {
                    $(subCategoryNameSelector).focus();
                }, 500);
            });
            $(document.body).on("click", "#subCategorySyncAlt", function (e) {
                e.preventDefault();
                getSubCategoryDataTable();
            });
            shortcut.add("F10", function () {
                $("#subCategorySaveButton").get()[0].click();
            });
            shortcut.add("F5", function () {
                $("#subCategoryResetButton").get()[0].click();
            });
            $(document.body).on("click", "#subCategorySaveButton", async function (e) {
                e.preventDefault();
                await self.initSave();
            });

            $("#subCategoryResetButton").on("click", function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $("body").on("click", ".btn-edit-subCategory", async function (e) {
                e.preventDefault();
                await getSubCategoryById($(this).data("vrnoa_hide"));
            });
        },

        initSave : async function () {
            if (validateSave()) {
                AlertComponent.getAlertMessage({
                    message : "Please fill the required fields!",
                    type    : "danger"
                });
                return;
            }
            await save(getSaveObject());
        },

        resetVoucher : function () {
            general.reloadWindow();
        }
    };
};

const classSubCategory = new ClassSubCategory();
classSubCategory.init();
