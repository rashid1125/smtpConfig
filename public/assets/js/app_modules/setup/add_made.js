import AlertComponent                   from "../../../../js/components/AlertComponent.js";
import { madeApiEndpoints }             from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest }              from "../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText, doLoading } from "../commonFunctions/CommonFunction.js";

const ClassMade = function () {
    const $modalInstance          = $("#madeAddModalId");
    const madeHiddenIdSelector    = "#madeHiddenId";
    const madeNameSelector        = "#madeName";
    const madeNativeNameSelector  = "#madeNativeName";
    const madeDescriptionSelector = "#madeDescription";

    // instance
    const madeHiddenIdInstance    = $(madeHiddenIdSelector);
    const madeNameInstance        = $(madeNameSelector);
    const madeNativeNameInstance  = $(madeNativeNameSelector);
    const madeDescriptionInstance = $(madeDescriptionSelector);
    const save                    = async function (madeObject) {
        doLoading(true);
        try {
            const response = await makeAjaxRequest("POST", madeApiEndpoints.saveMade, {
                madeObject : JSON.stringify(madeObject)
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

    const getMadeById = async function (madeId) {
        doLoading(true);
        try {
            const response = await makeAjaxRequest("GET", madeApiEndpoints.getMadeById, {
                madeId : madeId
            });
            resetField();

            if (response && ! response.status) {
                AlertComponent.getAlertMessage({
                    message : response.message,
                    type    : "danger"
                });
                resetVoucher();
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
        madeHiddenIdInstance.val(elem.id);
        madeNameInstance.val(elem.name);
        madeNativeNameInstance.val(elem.native_name);
        madeDescriptionInstance.val(elem.description);
    };

    // checks for the empty fields
    const validateSave     = function () {
        let errorFlag  = false;
        const madeName = $.trim(madeNameInstance.val());
        $(".inputerror").removeClass("inputerror");
        if (madeName === "") {
            $("#madeName").addClass("inputerror");
            errorFlag = true;
        }
        return errorFlag;
    };
    const getSaveObject    = function () {
        return {
            id          : madeHiddenIdInstance.val() || "",
            name        : madeNameInstance.val(),
            native_name : madeNativeNameInstance.val(),
            description : madeDescriptionInstance.val()
        };
    };
    let madeDataTable      = undefined;
    const getMadeDataTable = () => {
        if (typeof madeDataTable !== "undefined") {
            madeDataTable.destroy();
            $("#madeViewListTbody").empty();
        }
        madeDataTable = $("#madeViewList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url : `${madeApiEndpoints.getMadeDataTable}`
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
                    return "<button class=\"btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-made\" data-vrnoa_hide=\"" + row.id + "\" data-toggle=\"tooltip\" data-title=\"View Detail On Modal\"><i class=\"fa fa-edit\"></i></button>";
                }
            }],
            createdRow : function (row) {
                $(row).addClass("group odd:bg-white even:bg-slate-50 py-1 px-1");
                $("td", row).addClass("py-1 px-1 text-md align-middle text-middle");
            }
        });
    };
    const resetField       = () => {
        clearValueAndText(["madeHiddenId", "madeName", "madeNativeName", "madeDescription"], "#");
    };

    const resetVoucher = () => {
        resetField();
        getMadeDataTable();
    };

    return {

        init : function () {
            this.bindUI();
            getMadeDataTable();
        },

        bindUI : function () {
            $("[data-toggle=\"tooltip\"]").tooltip();

            const self = this;
            $(document.body).on("click", "#madeModalShow", function (e) {
                e.preventDefault();
                resetField();
                $($modalInstance).modal("show");
                setTimeout(function () {
                    $("#madeName").focus();
                }, 500);
            });
            $(document.body).on("click", "#madeSyncAlt", function (e) {
                e.preventDefault();
                getMadeDataTable();
            });
            shortcut.add("F10", function () {
                $("#madeSaveButton").get()[0].click();
            });
            shortcut.add("F5", function () {
                $("#madeResetButton").get()[0].click();
            });
            $(document.body).on("click", "#madeSaveButton", async function (e) {
                e.preventDefault();
                await self.initSave();
            });

            $("#madeResetButton").on("click", function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $("body").on("click", ".btn-edit-made", async function (e) {
                e.preventDefault();
                await getMadeById($(this).data("vrnoa_hide"));
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

const classMade = new ClassMade();
classMade.init();
