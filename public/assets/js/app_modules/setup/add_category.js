import AlertComponent                   from "../../../../js/components/AlertComponent.js";
import { categoryApiEndpoints }         from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest }              from "../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText, doLoading } from "../commonFunctions/CommonFunction.js";

const ClassCategory = function () {
    const $modalInstance              = $("#categoryAddModalId");
    const categoryHiddenIdSelector    = "#categoryHiddenId";
    const categoryNameSelector        = "#categoryName";
    const categoryNativeNameSelector  = "#categoryNativeName";
    const categoryDescriptionSelector = "#categoryDescription";

    // instance
    const categoryHiddenIdInstance    = $(categoryHiddenIdSelector);
    const categoryNameInstance        = $(categoryNameSelector);
    const categoryNativeNameInstance  = $(categoryNativeNameSelector);
    const categoryDescriptionInstance = $(categoryDescriptionSelector);
    const save                        = async function (categoryObject) {
        doLoading(true);
        try {
            const response = await makeAjaxRequest("POST", categoryApiEndpoints.saveCategory, {
                categoryObject : JSON.stringify(categoryObject)
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

    const getCategoryById = async function (categoryId) {
        doLoading(true);
        try {
            const response = await makeAjaxRequest("GET", categoryApiEndpoints.getCategoryById, {
                categoryId : categoryId
            });
            resetVoucher();

            if (response && ! response.status) {
                AlertComponent.getAlertMessage({
                    message : response.message,
                    type    : "danger"
                });
            } else if (response && response.status) {
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
        categoryHiddenIdInstance.val(elem.id);
        categoryNameInstance.val(elem.name);
        categoryNativeNameInstance.val(elem.native_name);
        categoryDescriptionInstance.val(elem.description);
    };

    // checks for the empty fields
    const validateSave         = function () {
        let errorFlag      = false;
        const categoryName = $.trim(categoryNameInstance.val());
        $(".inputerror").removeClass("inputerror");
        if (categoryName === "") {
            $("#categoryName").addClass("inputerror");
            errorFlag = true;
        }
        return errorFlag;
    };
    const getSaveObject        = function () {
        return {
            id          : categoryHiddenIdInstance.val() || "",
            name        : categoryNameInstance.val(),
            native_name : categoryNativeNameInstance.val(),
            description : categoryDescriptionInstance.val()
        };
    };
    let categoryDataTable      = undefined;
    const getCategoryDataTable = () => {
        if (typeof categoryDataTable !== "undefined") {
            categoryDataTable.destroy();
            $("#categoryViewListTbody").empty();
        }
        categoryDataTable = $("#categoryViewList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url : `${categoryApiEndpoints.getCategoryDataTable}`
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
                className : "text-left name"
            }, {
                data      : "native_name",
                name      : "native_name",
                className : "native_name",
                render    : function (data) {
                    return data || " ";
                }
            }, {
                data      : "description",
                name      : "description",
                className : "description",
                render    : function (data) {
                    return data || " ";
                }
            }, {
                data       : null,
                className  : "select text-right",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row) {
                    return "<button class=\"btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-category\" data-vrnoa_hide=\"" + row.id + "\" data-toggle=\"tooltip\" data-title=\"View Detail On Modal\"><i class=\"fa fa-edit\"></i></button>";
                }
            }],
            createdRow : function (row) {
                $(row).addClass("group odd:bg-white even:bg-slate-50 py-1 px-1");
                $("td", row).addClass("py-1 px-1 text-md align-middle text-middle");
            }
        });
    };
    const resetField           = () => {
        clearValueAndText(["categoryHiddenId", "categoryName", "categoryNativeName", "categoryDescription"], "#");
    };

    const resetVoucher = () => {
        resetField();
        getCategoryDataTable();
    };

    return {

        init : function () {
            this.bindUI();
            getCategoryDataTable();
        },

        bindUI : function () {
            $("[data-toggle=\"tooltip\"]").tooltip();

            const self = this;
            $(document.body).on("click", "#categoryModalShow", function (e) {
                e.preventDefault();
                resetField();
                $($modalInstance).modal("show");
                setTimeout(function () {
                    $("#categoryName").focus();
                }, 500);
            });
            $(document.body).on("click", "#categorySyncAlt", function (e) {
                e.preventDefault();
                getCategoryDataTable();
            });
            shortcut.add("F10", function () {
                $("#categorySaveButton").get()[0].click();
            });
            shortcut.add("F5", function () {
                $("#categoryResetButton").get()[0].click();
            });
            $(document.body).on("click", "#categorySaveButton", async function (e) {
                e.preventDefault();
                await self.initSave();
            });

            $("#categoryResetButton").on("click", function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $("body").on("click", ".btn-edit-category", async function (e) {
                e.preventDefault();
                await getCategoryById($(this).data("vrnoa_hide"));
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
        }
    };
};

const classCategory = new ClassCategory();
classCategory.init();
