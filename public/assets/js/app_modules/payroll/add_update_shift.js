import AlertComponent              from "../../../../js/components/AlertComponent.js";
import DynamicOption               from "../../../../js/components/DynamicOption.js";
import { apiURL, dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest }         from "../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText }       from "../commonFunctions/CommonFunction.js";

var UpdateShift = function () {
    var getUpdateShiftData = async function (staffObject) {
        // remove the previous data from the table using jQuery DataTable updateShift.updateShiftGridDataTable
        if (typeof updateShift.updateShiftGridDataTable !== "undefined") {
            updateShift.updateShiftGridDataTable.destroy();
            updateShift.updateShiftGridDataTable = undefined;
            $("#updateShiftGridBody").html("");
        }

        const response = await makeAjaxRequest("GET", `${apiURL}/payroll/updateShift/getUpdateShiftData`, { staffObject : JSON.stringify(staffObject) });
        if (response && response.status === false) {
            AlertComponent.getAlertMessage({
                title   : "Error!",
                message : response.message,
                type    : "danger"
            });
        } else if (response && response.status === true) {
            $(response.data).each(async function (index, item) {
                const previousShiftId   = item.staff_shift.id;
                const previousShiftName = item.staff_shift.name;
                await appendToTable(item.id, item.name, item.staff_department.id, item.staff_department.name, item.staff_type, item.staff_designation.id, item.staff_designation.name, previousShiftId, previousShiftName, item.staff_shift.id, item.staff_shift.name);
            });
            updateStaffShiftDataTable();
        }
    };
    const appendToTable    = async (staffId, staffName, staffDepartmentId, staffDepartmentName, staffType, staffDesignationId, staffDesignationName, previousStaffShiftId, previousStaffShiftName, currentStaffShiftId, currentStaffShiftName) => {
        const uniqueId = uuidv4();

        const html = `<tr class="odd:bg-white even:bg-slate-50">
            <td class="py-1 px-1 text-md align-middle text-left srno"></td>
            <td class="py-1 px-1 text-md align-middle text-left staffName" data-staff_id="${staffId}">${staffName}</td>
            <td class="py-1 px-1 text-md align-middle text-left departmentName" data-department_id="${staffDepartmentId}">${staffDepartmentName}</td>
            <td class="py-1 px-1 text-md align-middle text-left staffType" data-staff_type="${staffType}">${staffType}</td>
            <td class="py-1 px-1 text-md align-middle text-left staffDesignationName" data-designation_id="${staffDesignationId}">${staffDesignationName}</td>
            <td class="py-1 px-1 text-md align-middle text-left previousStaffShiftName" data-previous_staff_shift_id="${previousStaffShiftId}">${previousStaffShiftName}</td>

            <td class="py-1 px-1 text-md align-middle text-left currentStaffShiftName">
                <select id="currentStaffShiftId${uniqueId}" class="status-dropdown form-control" data-current_staff_shift_id="${currentStaffShiftId}" data-width="100%">

                </select>
            </td>
            <td class="py-1 px-1 text-md align-middle text-right">
                <button class="btn btn-sm btn-outline-success btn-row-update-shift" data-toggle="tooltip" data-title="Update Staff Shift"><i class="fa fa-save"></i></button>
            </td>
        </tr>`;
        $("#updateShiftGridBody").append(html);
        // Initialize the Select2 dropdown with DynamicOption for AJAX data and pagination
        new DynamicOption(`#currentStaffShiftId${uniqueId}`, {
            requestedUrl    : dropdownOptions.getAllShift, // Make sure this URL is correctly set to fetch status data
            placeholderText : "Choose Status",
            with            : "element",
            allowClear      : true
        });

        triggerAndRenderOptions($(`#currentStaffShiftId${uniqueId}`), currentStaffShiftName, currentStaffShiftId, false);
        getTableSerialNumber("#updateShiftGrid");
    };

    const updateStaffShiftDataTable = () => {
        let dontSort = [];
        $("#updateShiftGrid thead th").each(function () {
            if ($(this).hasClass("no_sort")) {
                dontSort.push({ "bSortable" : false });
            } else {
                dontSort.push(null);
            }
        });
        updateShift.updateShiftGridDataTable = $("#updateShiftGrid").DataTable({
            "sDom"            : "<'row-fluid table_top_bar'<'span12'<'to_hide_phone'<'row-fluid'<'span8' f>>>'<'pag_top' p> T>>t<'row-fluid control-group full top' <'span4 to_hide_tablet'l><'span8 pagination'p>>",
            "aaSorting"       : [[0, "asc"]],
            "bPaginate"       : true,
            "sPaginationType" : "full_numbers",
            "bJQueryUI"       : false,
            "aoColumns"       : dontSort,
            "bSort"           : false,
            "iDisplayLength"  : 100,
            "oTableTools"     : {
                "sSwfPath" : "js/copy_cvs_xls_pdf.swf",
                "aButtons" : [{
                    "sExtends"    : "print",
                    "sButtonText" : "Print Report",
                    "sMessage"    : "Inventory Report"
                }]
            }
        });

        updateShift.updateShiftGridDataTable.on("draw", function () {
            $("#updateShiftGridBody .currentStaffShiftName select").each(function () {
                if (! $(this).hasClass("select2-hidden-accessible")) {
                    new DynamicOption(`#${$(this).attr("id")}`, {
                        requestedUrl    : dropdownOptions.getAllShift,
                        placeholderText : "Choose Status",
                        allowClear      : true
                    });
                }
            });
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            "s`" : "dataTables_wrapper form-input-class"
        });
    };

    // validateRowUpdateShift
    const validateRowUpdateShift = (currentStaffShiftId) => {
        if (! currentStaffShiftId) {
            return "Please select a shift";
        }
        return "";
    };

    // validateSave grid rows in bluk update
    const validateSave = () => {
        // check if the table is empty
        if ($("#updateShiftGridBody tr").length === 0) {
            return "No data to update. Please search for staff using the provided filters.";
        }
        // throw a loop to validate each row
        let alertMessage = "";
        $("#updateShiftGridBody tr").each(function () {
            const currentStaffShiftId = $(this).find(".currentStaffShiftName").find("select").val();
            alertMessage              = validateRowUpdateShift(currentStaffShiftId);
            if (alertMessage) {
                return false;
            }
        });
        return alertMessage;
    };

    // getSaveObject for bulk update
    const getSaveObject = () => {
        const saveObject           = [];
        const updateShiftDataTable = $("#updateShiftGrid").DataTable();
        updateShiftDataTable.rows().every(function () {
            const row                 = $(this.node());
            const staffId             = row.find(".staffName").data("staff_id");
            const currentStaffShiftId = row.find(".currentStaffShiftName").find("select").val();
            saveObject.push({
                staff_id       : staffId,
                staff_shift_id : currentStaffShiftId
            });
        });
        return saveObject;
    };

    // save function for bulk update
    const save             = async (updatedShift, isBulk = false) => {
        const data = { updatedShift : JSON.stringify(updatedShift) };
        const url  = `${apiURL}/payroll/updateShift/save`;

        const response = await makeAjaxRequest("POST", url, data);
        if (response && response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({
                title   : "Error!",
                message : response.message,
                type    : "danger"
            });
            return;
        }

        if (response && response.status == true && response.message !== "") {
            AlertComponent.getAlertMessage({
                title   : "Success!",
                message : response.message,
                type    : "success"
            });
        }

        // reset the update shift voucher if it is bulk update
        if (isBulk) {
            resetVoucher();
        }
    };
    /**
     * Update the shift for all the staff in the table
     * @returns {Promise<string>}
     */
    const updateShiftToAll = async () => {
        let isSelectedShiftUpdated = false;
        $("#select2-shiftSelectAll-container").parent().removeClass("inputerror");
        const selectedShiftId   = $("#shiftSelectAll").val();
        const selectedShiftName = $("#shiftSelectAll option:selected").text();
        if ($("#updateShiftGridBody tr").length === 0) {
            return AlertComponent.getAlertMessage({
                title   : "Error!",
                message : "No data to update. Please search for staff using the provided filters.",
                type    : "danger"
            });
        }
        if (! selectedShiftId) {
            $("#select2-shiftSelectAll-container").parent().addClass("inputerror");
            return AlertComponent.getAlertMessage({
                title   : "Error!",
                message : "Please select a shift.",
                type    : "danger"
            });
        }
        const updateShiftDataTable = $("#updateShiftGrid").DataTable();
        updateShiftDataTable.page.len(-1).draw();
        updateShiftDataTable.rows().data().each(function (data, index) {
            const row                  = $(updateShiftDataTable.row(index).node());
            const currentShiftDropdown = row.find(".currentStaffShiftName select");
            const currentShiftId       = `#${currentShiftDropdown.prop("id")}`;
            triggerAndRenderOptions($(currentShiftId), selectedShiftName, selectedShiftId, true, false, true);
            if (! $(currentShiftId).hasClass("select2-hidden-accessible")) {
                new DynamicOption(currentShiftId, {
                    requestedUrl    : dropdownOptions.getAllShift,
                    placeholderText : "Choose Status",
                    with            : "element",
                    allowClear      : true
                });
            }
            isSelectedShiftUpdated = true;
        });
        updateShiftDataTable.page.len(100).draw();
        if (! isSelectedShiftUpdated) {
            return AlertComponent.getAlertMessage({
                title   : "Error!",
                message : "No rows were updated. Please ensure data is present in the table.",
                type    : "danger"
            });
        }
    };

    const resetVoucher = () => {
        resetField();
    };
    const resetField   = () => {
        // reset the dropdowns and empty the table
        const resetDropdowns = ["#departmentDropdownId", "#shiftDropdownId", "#staffTypeDropdownId", "#designationDropdownId", "#staffNameDropdownId", "#shiftSelectAll"];
        clearValueAndText(resetDropdowns);

        if (typeof updateShift.updateShiftGridDataTable !== "undefined") {
            updateShift.updateShiftGridDataTable.destroy();
            $("#updateShiftGridBody").empty();
        }
        updateShift.updateShiftGridDataTable = undefined;

    };

    return {

        init : function () {
            this.bindUI();
            $(".select2").select2();
        },

        bindUI : function () {
            $("[data-toggle=\"tooltip\"]").tooltip();
            const self = this;

            // event Listener on #showButtonId

            $(document.body).on("click", "#showButtonId", async function (event) {
                event.preventDefault();

                const staffDepartmentId  = $("#departmentDropdownId").val();
                const staffShiftId       = $("#shiftDropdownId").val();
                const staffTypeId        = $("#staffTypeDropdownId").val();
                const staffDesignationId = $("#designationDropdownId").val();
                const staffNameId        = $("#staffNameDropdownId").val();

                const staffObject = {
                    staff_department_id  : staffDepartmentId,
                    staff_shift_id       : staffShiftId,
                    staff_type_id        : staffTypeId,
                    staff_designation_id : staffDesignationId,
                    staff_name_id        : staffNameId
                };
                await getUpdateShiftData(staffObject);
            });

            // event Listener on .btnSave for bulk update
            $(document.body).on("click", ".btnSave", async function (event) {
                event.preventDefault();
                await self.initSave();
            });
            // event Listener on .btnReset
            $(document.body).on("click", ".btnReset", async function (event) {
                event.preventDefault();
                resetVoucher();
            });
            // shortcut key for save F10
            shortcut.add("F10", function () {
                $(".btnSave").get()[0].click();
            });
            shortcut.add("F5", function () {
                $(".btnReset").get()[0].click();
            });

            // event Listener on .btn-row-update-shift

            $(document.body).on("click", ".btn-row-update-shift", async function (event) {
                event.preventDefault();

                const row = $(this).closest("tr");

                const staffId             = $(row).find(".staffName").data("staff_id");
                const currentStaffShiftId = $(row).find(".currentStaffShiftName").find("select").val();

                const alertMessage = validateRowUpdateShift(currentStaffShiftId);
                if (alertMessage) {
                    AlertComponent.getAlertMessage({
                        title   : "Error!",
                        message : alertMessage,
                        type    : "danger"
                    });
                    return;
                }

                const saveObject = [{
                    staff_id       : staffId,
                    staff_shift_id : currentStaffShiftId
                }];
                await save(saveObject);

                // remove the row from the table
                updateShift.updateShiftGridDataTable.row(row).remove().draw();

                // check if the table is empty then reset the table
                if (updateShift.updateShiftGridDataTable.rows().count() === 0) {
                    resetVoucher();
                }
            });

            // Event listener for the "Update to All" button
            $(document.body).on("click", "#updateToAllGridStaff", async function () {
                await updateShiftToAll();
            });
        },

        initSave : async function () {
            const alertMessage = validateSave();
            if (alertMessage) {
                return _getAlertMessage("Error!", alertMessage, "danger");

            }

            const saveObject = getSaveObject();
            await save(saveObject, true);
        }
    };
};

const updateShift = new UpdateShift();
updateShift.init();
// Corrected function to match the HTML ID
$(function () {
    new DynamicOption("#departmentDropdownId", {
        requestedUrl    : dropdownOptions.getAllStaffDepartment,
        placeholderText : "Choose Department",
        allowClear      : true
    });
    new DynamicOption("#shiftDropdownId", {
        requestedUrl    : dropdownOptions.getAllShift,
        placeholderText : "Choose Shift",
        allowClear      : true
    });
    new DynamicOption("#designationDropdownId", {
        requestedUrl    : dropdownOptions.getAllDesignation,
        placeholderText : "Choose Designation",
        allowClear      : true
    });
    new DynamicOption("#staffNameDropdownId", {
        requestedUrl    : dropdownOptions.getAllStaff,
        placeholderText : "Choose Staff",
        allowClear      : true
    });

    new DynamicOption("#shiftSelectAll", {
        requestedUrl    : dropdownOptions.getAllShift,
        placeholderText : "Choose Staff Shift",
        allowClear      : true
    });
});
