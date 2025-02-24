"use strict";
import AlertComponent      from "../../../../js/components/AlertComponent.js";
import { doLoading }       from "../commonFunctions/CommonFunction.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";

const Department = function () {
    const saveDepartment    = `${base_url}/department/saveDepartment`;
    const getDepartmentById = `${base_url}/department/getDepartmentById`;

    const warehouseIdSelector          = "#txtId";
    const warehouseNameSelector        = "#txtName";
    const warehouseUNameSelector       = "#txtwharehouse_uname";
    const warehouseStrengthSelector    = "#txtStrength";
    const warehouseDescriptionSelector = "#txtDescription";

    // instance
    const warehouseIdInstance          = $(warehouseIdSelector);
    const warehouseNameInstance        = $(warehouseNameSelector);
    const warehouseUNameInstance       = $(warehouseUNameSelector);
    const warehouseStrengthInstance    = $(warehouseStrengthSelector);
    const warehouseDescriptionInstance = $(warehouseDescriptionSelector);
    const save                         = async function (department) {
        doLoading(true);
        try {
            const response = await makeAjaxRequest("POST", saveDepartment, { "department" : JSON.stringify(department) });
            if (response && response.status === false) {
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : response.message,
                    type    : "danger"
                });
            } else {
                AlertComponent.getAlertMessage({
                    title   : "Success!",
                    message : response.message,
                    type    : "success"
                });
                resetVoucher();
            }
        } catch (e) {
            console.log(e);
        } finally {
            doLoading(false);
        }
    };
    const fetch                        = function (did) {

        $.ajax({
            url      : `${getDepartmentById}`,
            type     : "GET",
            data     : { "did" : did },
            dataType : "JSON",
            success  : function (response) {
                resetFields();
                if (response && response.status === false) {
                    AlertComponent.getAlertMessage({
                        title   : "Error!",
                        message : response.message,
                        type    : "danger"
                    });
                } else {
                    populateData(response.data);
                }
            },
            error    : function (xhr) {
                console.log(xhr.responseText);
            }
        });
    };
    const populateData                 = function (elem) {
        warehouseIdInstance.val(elem.did);
        warehouseNameInstance.val(elem.name);
        warehouseUNameInstance.val(elem.uname);
        warehouseStrengthInstance.val(elem.strength);
        warehouseDescriptionInstance.val(elem.description);
    };

    // checks for the empty fields
    const validateSave  = function () {
        let errorFlag = false;
        const name    = warehouseNameInstance.val();
        $(".inputerror").removeClass("inputerror");
        if (name === "") {
            warehouseNameInstance.addClass("inputerror");
            AlertComponent.getAlertMessage({
                title   : "Error!",
                message : "Please enter the department name",
                type    : "danger"
            });
            errorFlag = true;
        }
        return errorFlag;
    };
    const getSaveObject = function () {
        const obj       = {};
        obj.did         = warehouseIdInstance.val();
        obj.name        = warehouseNameInstance.val();
        obj.uname       = warehouseUNameInstance.val();
        obj.strength    = warehouseStrengthInstance.val();
        obj.description = warehouseDescriptionInstance.val();
        return obj;
    };

    let departmentTable          = undefined;
    const getDepartmentDataTable = (voucherType = "", itemType = "") => {
        if (typeof departmentTable !== "undefined") {
            departmentTable.destroy();
            $("#departmentTableTbody").empty();
        }
        departmentTable = $("#departmentTable").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url  : `${base_url}/department/getDepartmentDataTable`,
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
                data      : "name",
                name      : "name",
                className : "name"
            }, {
                data      : "strength",
                name      : "strength",
                className : "text-left strength"
            }, {
                data      : "description",
                name      : "description",
                className : "description"
            }, {
                data       : null,
                className  : "select text-right",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row) {
                    return "<button class=\"btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-dept\" data-did=\"" + row.did + "\" data-toggle=\"tooltip\" data-title=\"View Detail On Modal\"><i class=\"fa fa-edit\"></i></button>";
                }
            }],
            createdRow : function (row, data, dataIndex) {
                $(row).addClass("group odd:bg-white even:bg-slate-50 py-1 px-1");
                $("td", row).addClass("py-1 px-1 text-md align-middle text-middle");
            }
        });
    };

    const resetVoucher = () => {
        getDepartmentDataTable();
        resetFields();
    };
    const resetFields  = () => {
        warehouseIdInstance.val("");
        warehouseNameInstance.val("");
        warehouseUNameInstance.val("");
        warehouseStrengthInstance.val("");
        warehouseDescriptionInstance.val("");
        warehouseNameInstance.focus();
    };

    return {
        init     : function () {
            this.bindUI();
            getDepartmentDataTable();
        },
        bindUI   : function () {
            $("[data-toggle=\"tooltip\"]").tooltip();
            const self = this;
            $("#txtName").focus();
            shortcut.add("F10", function () {
                $(".btnSave").get()[0].click();
            });
            shortcut.add("F6", function () {
                $("#txtId").focus();
            });
            shortcut.add("F5", function () {
                $(".btnReset").get()[0].click();
            });
            $(".btnSave").on("click", function (e) {
                e.preventDefault();
                self.initSave();
            });
            $(".btnReset").on("click", function (e) {
                e.preventDefault();
                resetVoucher();
            });
            $("body").on("click", ".btn-edit-dept", function (e) {
                e.preventDefault();
                fetch($(this).data("did"));
                $("a[href=\"#add_dept\"]").trigger("click");
            });
        },
        initSave : function () {
            if (! validateSave()) {
                save(getSaveObject());
            }
        }
    };
};

const department = new Department();
department.init();
