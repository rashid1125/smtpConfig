import AlertComponent from "../../../../js/components/AlertComponent.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { AMOUNT_ROUNDING } from "../../../../js/components/GlobalConstants.js";
import { apiURL, dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText, disableButton, enableDisableButton, getLocalStorage, ifNull, isPreviousBalance, parseNumber, removeLocalStorage, setFinancialYearDate, setLocalStorage, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek, updateDatepickerWithFormattedDate, updateFormattedDate } from "../commonFunctions/CommonFunction.js";

const Attendance = function () {
    const formFields = {
        attendanceIdHidden: '#attendanceIdHidden',
        btnSave: '.btnSave',
        btnReset: '.btnReset',
        currentDate: '#currentDate',
        voucherDateClose: '#voucherDateClose',
        attendanceGrid: '#attendanceGrid',
        attendanceGridBody: '#attendanceGridBody',

        staffDropdownId: '#staffDropdownId',
        departmentDropdownId: '#departmentDropdownId',
        shiftDropdownId: '#shiftDropdownId',
        timeIn: '#timeIn',
        timeOut: '#timeOut',
        attendanceStatusDropdownId: '#attendanceStatusDropdownId',
        btnAdd: '#btnAdd',
        // staff Other Information
        otherStaffInformation: '#otherStaffInformation',
        autoFromDate: '#autoFromDate',
        autoToDate: '#autoToDate',
        autoDepartmentDropdownId: '#autoDepartmentDropdownId',
        autoStaffAttendanceStatusDropdownId: '#autoStaffAttendanceStatusDropdownId',
        autoPosted: '#autoPosted', // auto posted checkbox
        btnSearch: '#btnSearch',
    };
    let attendanceDataTable;
    const getAttendanceDataTable = async (fromDate = null, toDate = null) => {
        if (typeof attendanceDataTable !== 'undefined') {
            attendanceDataTable.destroy();
            $('#attendanceListTableBody').empty();
        }

        attendanceDataTable = $("#attendanceListTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${apiURL}/payroll/attendance/getAttendanceDataTable`,
                type: 'GET',
                data: { fromDate: fromDate, toDate: toDate },
                error: function (jqXHR, textStatus) {
                    let message = `Unexpected error: ${jqXHR.status} ${textStatus}`;
                    AlertComponent.getAlertMessage({
                        title: 'Error',
                        message: jqXHR.responseJSON.message ?? message,
                        type: 'danger'
                    });
                }
            },
            autoWidth: false,
            buttons: true,
            searching: true,
            columns: [
                {
                    data: null,
                    className: "select",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return meta.row + 1;
                    }
                },
                {
                    data: "vrnoa",
                    name: 'vrnoa',
                    className: "text-left vrnoa",
                },
                {
                    data: "vrdate",
                    name: 'vrdate',
                    className: "vrdate",
                    render: function (data) {
                        return updateFormattedDate(data);
                    }
                },
                {
                    data: "is_auto_post",
                    name: 'is_auto_post',
                    className: "is_auto_post",
                    render: function (data) {
                        if (parseNumber(data) == 1) {
                            return 'Yes';
                        }
                        return 'No';
                    }
                },
                {
                    data: null,
                    className: "select text-right",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        return `
                        <div class="btn-group dropleft">
                            <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">More</button>
                            <div class="dropdown-menu main-dropdown-menu">
                                <a class="dropdown-item btnEditPrevVoucher" data-attendance_id="${row.id}"><i class="fa fa-edit"></i> Edit</a>
                                <div class="dropdown-divider"></div>
                                <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                    <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                    <span class="sr-only">Toggle Dropdown</span>
                                </button>
                                <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                    <li class="dropdown-item"><a href="#" class="btnPrint" data-attendance_id="${row.id}">Print Voucher</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-attendance_id="${row.id}"> Print a4 with header</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-attendance_id="${row.id}">Print a4 with out header </a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-attendance_id="${row.id}"> Print b5 with header</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-attendance_id="${row.id}"> Print b5 with out header </a></li>
                                </ul>
                                <a class="dropdown-item btnDelete" data-attendance_id="${row.id}" href="#"><i class='fa fa-trash'></i> Delete Voucher</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item btnPrintASEmail" data-attendance_id="${row.id}" href="#"><i class='fa fa-envelope'></i> Send Email</a>
                            </div>
                        </div>`;
                    }
                }
            ],
            createdRow: function (row, data, dataIndex) {
                $(row).addClass('group odd:bg-white even:bg-slate-50 py-1 px-1');
                $('td', row).addClass('py-1 px-1 text-md align-middle text-middle');
            }
        });
    };

    /**
     * Validates the staff grid and checks for empty fields.
     *
     * @returns {string|null} Returns an error message if there are validation errors, otherwise returns null.
     */
    const validateAttendanceGrid = () => {
        let hasError = false;
        let errorMessage = '';

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        // get the values

        // check for the empty fields staff , department, shift, timeIn, timeOut, status
        if (parseNumber($(formFields.staffDropdownId).val()) === 0) {
            $('#select2-staffDropdownId-container').parent().addClass('inputerror');
            errorMessage += `Staff is required <br />`;
            hasError = true;
        }

        // department
        if (parseNumber($(formFields.departmentDropdownId).val()) === 0) {
            $('#select2-departmentDropdownId-container').parent().addClass('inputerror');
            errorMessage += `Department is required <br />`;
            hasError = true;
        }
        // shift
        if (parseNumber($(formFields.shiftDropdownId).val()) === 0) {
            $('#select2-shiftDropdownId-container').parent().addClass('inputerror');
            errorMessage += `Shift is required <br />`;
            hasError = true;
        }
        // timeIn
        if ($(formFields.timeIn).val() === '') {
            $(formFields.timeIn).addClass('inputerror');
            errorMessage += `Time In is required <br />`;
            hasError = true;
        }
        // timeOut
        if ($(formFields.timeOut).val() === '') {
            $(formFields.timeOut).addClass('inputerror');
            errorMessage += `Time Out is required <br />`;
            hasError = true;
        }

        // check time in less than time out input type time
        if ($(formFields.timeIn).val() >= $(formFields.timeOut).val()) {
            $(formFields.timeIn).addClass('inputerror');
            $(formFields.timeOut).addClass('inputerror');
            errorMessage += `Time In should be less than Time Out <br />`;
            hasError = true;
        }


        // status
        if (parseNumber($(formFields.attendanceStatusDropdownId).val()) === 0) {
            $('#select2-attendanceStatusDropdownId-container').parent().addClass('inputerror');
            errorMessage += `Status is required <br />`;
            hasError = true;
        }

        if (hasError) {
            return errorMessage;
        }

        return null;
    };

    /**
     * Appends a new row to the attendance table with the provided data.
     *
     * @param {number} staffId - The ID of the staff.
     * @param {string} staffName - The name of the staff.
     * @param {number} staffDepartmentId - The ID of the staff's department.
     * @param {string} staffDepartmentName - The name of the staff's department.
     * @param {number} staffShiftId - The ID of the staff's shift.
     * @param {string} staffShiftName - The name of the staff's shift.
     * @param {string} timeIn - The time in value.
     * @param {string} timeOut - The time out value.
     * @param {number} statusId - The ID of the status.
     * @param {string} statusName - The name of the status.
     * @returns {void}
     */
    const appendToTable = async (staffId, staffName, staffDepartmentId, staffDepartmentName, staffShiftId, staffShiftName, timeIn, timeOut, statusId, statusName, statusOptions) => {
        const uniqueId = uuidv4();

        const html = `<tr class="odd:bg-white even:bg-slate-50">
            <td class="py-1 px-1 text-md align-middle text-left srno"></td>
            <td class="py-1 px-1 text-md align-middle text-left staffName" data-staff_id="${staffId}">${staffName}</td>
            <td class="py-1 px-1 text-md align-middle text-left departmentName" data-department_id="${staffDepartmentId}">${staffDepartmentName}</td>
            <td class="py-1 px-1 text-md align-middle text-left shiftName" data-shift_id="${staffShiftId}">${staffShiftName}</td>
            <td class="py-1 px-1 text-md align-middle text-left timeIn"><input type="time" class="form-input-class w-32" data-title="Time In" placeholder="Time In" value="${timeIn}" /></td>
            <td class="py-1 px-1 text-md align-middle text-left timeOut"><input type="time" class="form-input-class w-32" data-title="Time Out" placeholder="Time Out" value="${timeOut}" /></td>
            <td class="py-1 px-1 text-md align-middle text-left statusName">
                <select id="statusDropdown${uniqueId}" class="status-dropdown form-control" data-status_id="${statusId}" data-width="100%">

                </select>
            </td>
            <td class="py-1 px-1 text-md align-middle text-right">
                <button class="btn btn-sm btn-outline-primary btn-row-edit-attendance" data-toggle="tooltip" data-title="Edit"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger btn-row-delete-attendance" data-toggle="tooltip" data-title="Delete"><i class="fa fa-trash"></i></button>
            </td>
        </tr>`;
        $(formFields.attendanceGridBody).append(html);
        // Initialize the Select2 dropdown with DynamicOption for AJAX data and pagination
        new DynamicOption(`#statusDropdown${uniqueId}`, {
            requestedUrl: dropdownOptions.getAttendanceStatus, // Make sure this URL is correctly set to fetch status data
            placeholderText: 'Choose Status',
            with: 'element',
            allowClear: true,
        });

        triggerAndRenderOptions($(`#statusDropdown${uniqueId}`), statusName, statusId, false);

        getTableSerialNumber(formFields.attendanceGrid);
    };


    // checks for the empty fields
    var validateSave = function () {
        let hasError = false;
        let errorMessage = '';

        // Remove the error class first
        $('.inputerror').removeClass('inputerror');

        // Check if current date is empty
        if ($(formFields.currentDate).val() === '') {
            $(formFields.currentDate).addClass('inputerror');
            errorMessage += `Date is required <br />`;
            hasError = true;
        }

        // Check each row in the attendance grid
        $(formFields.attendanceGridBody).find('tr').each(function () {
            const staffName = $(this).find('td.staffName').text().trim();
            const timeIn = $(this).find('td.timeIn input').val();
            const timeOut = $(this).find('td.timeOut input').val();
            const statusId = parseNumber($(this).find('td.statusName select.status-dropdown').val());
            // get select id from the select dropdown
            const selectId = $(this).find('td.statusName select.status-dropdown').attr('id');

            if (timeIn === '') {
                $(this).find('td.timeIn input').addClass('inputerror');
                errorMessage += `Time In is required <br />`;
                hasError = true;
            }

            if (timeOut === '') {
                $(this).find('td.timeOut input').addClass('inputerror');
                errorMessage += `Time Out is required <br />`;
                hasError = true;
            }

            if (statusId === 0) {
                // add the error class to the select dropdown
                $(this).find(`#select2-${selectId}-container`).parent().addClass('inputerror');
                errorMessage += `Status is required for '${staffName}'<br />`;
                hasError = true;
            }
        });

        // Check auto dates if auto posted is checked
        if ($(formFields.autoPosted).is(':checked')) {
            const fromDate = getSqlFormattedDate($(formFields.autoFromDate).val());
            const toDate = getSqlFormattedDate($(formFields.autoToDate).val());

            if (fromDate === '') {
                $(formFields.autoFromDate).addClass('inputerror');
                errorMessage += `From Date is required <br />`;
                hasError = true;
            }
            if (toDate === '') {
                $(formFields.autoToDate).addClass('inputerror');
                errorMessage += `To Date is required <br />`;
                hasError = true;
            }
            if (fromDate >= toDate) {
                $(formFields.autoFromDate).addClass('inputerror');
                $(formFields.autoToDate).addClass('inputerror');
                errorMessage += `From Date should be less than To Date <br />`;
                hasError = true;
            }
        }

        // Check if at least one staff advance is added
        if ($(formFields.attendanceGridBody).find('tr').length === 0) {
            errorMessage += `Please add at least one staff advance <br />`;
            hasError = true;
        }

        // Return error message if there are errors, otherwise return null
        return hasError ? errorMessage : null;
    };


    var getSaveObject = function () {
        const attendance = {};
        const attendanceList = [];
        attendance.id = $(formFields.attendanceIdHidden).val();
        attendance.vrdate = $(formFields.currentDate).val();
        attendance.vrdate_close = $(formFields.voucherDateClose).val();
        attendance.is_auto_post = $(formFields.autoPosted).is(':checked') ? 1 : 0;

        if (attendance.is_auto_post) {
            attendance.from_date = $(formFields.autoFromDate).val();
            attendance.to_date = $(formFields.autoToDate).val();
        } else {
            attendance.from_date = null;
            attendance.to_date = null;
        }


        $(formFields.attendanceGridBody).find('tr').each(function () {
            const attendanceObj = {};
            attendanceObj.staff_id = $(this).find('td.staffName').data('staff_id');
            attendanceObj.staff_department_id = $(this).find('td.departmentName').data('department_id');
            attendanceObj.staff_shift_id = $(this).find('td.shiftName').data('shift_id');
            attendanceObj.time_in = $(this).find('td.timeIn input').val();
            attendanceObj.time_out = $(this).find('td.timeOut input').val();
            attendanceObj.staff_status_id = $(this).find('td.statusName select.status-dropdown').val();
            attendanceList.push(attendanceObj);
        });

        const data = {
            attendance: attendance,
            attendanceList: attendanceList
        }

        return data;
    };
    var save = async function (formObject) {
        await disableButton();
        try {
            const response = await makeAjaxRequest('POST', `${apiURL}/payroll/attendance/save`, {
                attendance: JSON.stringify(formObject.attendance),
                attendanceList: JSON.stringify(formObject.attendanceList),
                voucherDateClose: $(formFields.voucherDateClose).val(),
                id: $(formFields.attendanceIdHidden).val(),
                vrdate: $(formFields.currentDate).val()
            });
            if (response.status == false) {
                AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: response.level });
            } else if (response.status == false && response.message !== "") {
                AlertComponent.getAlertMessage({ title: 'Warning', message: response.message, type: 'warning' });
            } else {
                AlertComponent.getAlertMessage({ title: 'Successfully', message: response.message, type: 'success' });
                resetVoucher();
            }
        } catch (error) {
            console.log(error)
        } finally {
            // console.log('finally');
            await enableDisableButton();
        }
    };

    var getAttendanceById = async function (attendanceId) {
        const response = await makeAjaxRequest('GET', `${apiURL}/payroll/attendance/getAttendanceById`, {
            attendanceId: attendanceId
        });
        resetField();
        if (response && response.status == false) {
            AlertComponent.getAlertMessage({ title: 'Operation failed !', message: response.message, type: response.level });
            await resetVoucher();
            return;
        }

        populateDataAttendance(response.data);
    };

    var populateDataAttendance = function (data) {
        $(formFields.attendanceIdHidden).val(data.id);
        updateDatepickerWithFormattedDate(formFields.currentDate, data.vrdate);
        updateDatepickerWithFormattedDate(formFields.voucherDateClose, data.vrdate);

        // disable the auto posted checkbox
        $(formFields.autoPosted).prop('checked', data.is_auto_post == 1).prop('disabled', true).addClass('cursor-not-allowed disabled');
        // trigger the change event
        $(formFields.autoPosted).trigger('change');

        // update the auto dates
        updateDatepickerWithFormattedDate(formFields.autoFromDate, data.from_date);
        updateDatepickerWithFormattedDate(formFields.autoToDate, data.to_date);

        // disable the auto dates
        $(formFields.autoFromDate).prop('disabled', true).addClass('cursor-not-allowed disabled');
        $(formFields.autoToDate).prop('disabled', true).addClass('cursor-not-allowed disabled');


        data.attendance_details.forEach(async function (item) {
            await appendToTable(item.staff.id, item.staff.name, item.staff_department.id, item.staff_department.name, item.staff_shift.id, item.staff_shift.name, item.time_in, item.time_out, item.staff_status.id, item.staff_status.status);
        });
        calculateTotalAmount();
    };


    // delete Voucher
    const deleteVoucher = async (attendanceId) => {
        await disableButton();
        try {
            const response = await makeAjaxRequest('delete', `${apiURL}/payroll/attendance/delete`, {
                attendanceId: attendanceId
            });
            if (response.status == false) {
                AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: response.level });
            } else {
                AlertComponent.getAlertMessage({ title: 'Operation Successfully', message: response.message, type: response.level });
                resetVoucher();
            }
        } catch (error) {
            console.log(error);
        } finally {
            await enableDisableButton();
        }
    };

    const resetVoucher = async () => {
        await getAttendanceDataTable();
        resetField();
    };
    const resetField = () => {
        $('.inputerror').removeClass('inputerror');
        const resetArray = [
            formFields.attendanceIdHidden,
            formFields.currentDate,
            formFields.voucherDateClose,
            formFields.staffDropdownId,
            formFields.autoFromDate,
            formFields.autoToDate,
            formFields.autoDepartmentDropdownId,
            formFields.autoStaffAttendanceStatusDropdownId,
            formFields.autoPosted,

            // reset the grid
            formFields.staffDropdownId,
            formFields.departmentDropdownId,
            formFields.shiftDropdownId,
            formFields.timeIn,
            formFields.timeOut,
            formFields.attendanceStatusDropdownId

        ];

        clearValueAndText(resetArray);

        $(formFields.timeIn).val('');
        $(formFields.timeOut).val('');

        // reset the auto dropdown
        $(formFields.autoDepartmentDropdownId).val('').trigger('change');
        $(formFields.autoStaffAttendanceStatusDropdownId).val('').trigger('change');
        // auto posted unchecked and hide the date range
        $(formFields.autoPosted).prop('checked', false).removeClass('cursor-not-allowed disabled').prop('disabled', false);
        // trigger the change event
        $(formFields.autoPosted).trigger('change');

        // update date range
        updateDatepickerWithFormattedDate(formFields.autoFromDate, new Date());
        updateDatepickerWithFormattedDate(formFields.autoToDate, new Date());

        // date range enable
        $(formFields.autoFromDate).prop('disabled', false).removeClass('cursor-not-allowed disabled');
        $(formFields.autoToDate).prop('disabled', false).removeClass('cursor-not-allowed disabled');

        $(formFields.attendanceGridBody).empty();
        // reset the staff information
        $(formFields.otherStaffInformation).empty();
        // set focus to the staff dropdown if  tab  is on main
        $('a[href="#Main"]').trigger('click');

        $(formFields.staffDropdownId).focus();
    };

    // calculate the total amount
    const calculateTotalAmount = () => {
        let totalAmount = 0;

        $(formFields.attendanceGridBody).find('tr').each(function () {
            totalAmount += parseNumber($(this).find('.amount').text());
        });
        $('#totalAmount').text(parseNumber(totalAmount).toFixed(AMOUNT_ROUNDING));

    };

    const printVoucher = (vrnoa, paperSize, printSize, wrate = "", isSendEmail = false) => {
        try {
            const etype = 'attendances';
            const previousBalance = isPreviousBalance();
            const languageId = 1;
            const printUrl = `${apiURL}/doc/getPrintVoucherPDF/?etype=${etype}&vrnoa=${vrnoa}&pre_bal_print=${previousBalance}&paperSize=${paperSize}&printSize=${printSize}&wrate=${wrate ? wrate : 0}&language_id=${languageId}`;
            openPrintOnSettingConfiguration(printUrl);
        } catch (error) {
            console.error(error);
        }
    };
    return {

        init: async function () {
            this.bindUI();
            $('.select2').select2({
                width: 'resolve',
                dropdownAutoWidth: true,
                selectOnClose: true,
            });
            await getAttendanceDataTable();

        },

        bindUI: function () {
            $('[data-toggle="tooltip"]').tooltip();

            const self = this;
            $(document.body).on('click', formFields.btnAdd, async function (e) {
                e.preventDefault();
                const alertMessage = validateAttendanceGrid();
                if (alertMessage) {
                    return AlertComponent.getAlertMessage({ title: 'Error', message: alertMessage, type: 'danger' });
                }
                const staffId = parseNumber($(formFields.staffDropdownId).val());
                const staffName = $.trim($(formFields.staffDropdownId).find('option:selected').text());
                const staffDepartmentId = parseNumber($(formFields.departmentDropdownId).val());
                const staffDepartmentName = $.trim($(formFields.departmentDropdownId).find('option:selected').text());
                const staffShiftId = parseNumber($(formFields.shiftDropdownId).val());
                const staffShiftName = $.trim($(formFields.shiftDropdownId).find('option:selected').text());
                const timeIn = $(formFields.timeIn).val();
                const timeOut = $(formFields.timeOut).val();
                const statusId = parseNumber($(formFields.attendanceStatusDropdownId).val());
                const statusName = $.trim($(formFields.attendanceStatusDropdownId).find('option:selected').text());

                // check if the staff is already added
                const isStaffAdded = $(formFields.attendanceGridBody).find(`td.staffName[data-staff_id="${staffId}"]`).length > 0;
                if (isStaffAdded) {
                    return AlertComponent.getAlertMessage({ title: 'Error', message: 'Staff is already added', type: 'danger' });
                }

                // reset the form fields
                $(formFields.staffDropdownId).val('').trigger('change');
                $(formFields.departmentDropdownId).val('').trigger('change');
                $(formFields.shiftDropdownId).val('').trigger('change');
                $(formFields.timeIn).val('');
                $(formFields.timeOut).val('');
                $(formFields.attendanceStatusDropdownId).val('').trigger('change');
                // append the data to the table
                await appendToTable(staffId, staffName, staffDepartmentId, staffDepartmentName, staffShiftId, staffShiftName, timeIn, timeOut, statusId, statusName);
                // set focus to the staff dropdown
                $(formFields.staffDropdownId).focus();
            });
            // delete the row
            $(document.body).on('click', '.btn-row-delete-attendance', function (e) {
                e.preventDefault();
                $(this).closest('tr').remove();
                getTableSerialNumber(formFields.attendanceGrid);
                calculateTotalAmount();
            });
            // edit the row
            $(document.body).on('click', '.btn-row-edit-attendance', function (e) {
                e.preventDefault();
                const $row = $(this).closest('tr');
                const staffId = $row.find('td.staffName').data('staff_id');
                const staffName = $row.find('td.staffName').text();
                const staffDepartmentId = $row.find('td.departmentName').data('department_id');
                const staffShiftId = $row.find('td.shiftName').data('shift_id');
                const timeIn = $row.find('td.timeIn input').val();
                const timeOut = $row.find('td.timeOut input').val();
                const statusId = $row.find('td.statusName select').val();
                const statusName = $row.find('td.statusName select').find('option:selected').text();

                // populate the data
                triggerAndRenderOptions($(formFields.staffDropdownId), staffName, staffId, false);
                triggerAndRenderOptions($(formFields.departmentDropdownId), $row.find('td.departmentName').text(), staffDepartmentId, false, true);
                triggerAndRenderOptions($(formFields.shiftDropdownId), $row.find('td.shiftName').text(), staffShiftId, false);
                $(formFields.timeIn).val(timeIn);
                $(formFields.timeOut).val(timeOut);
                triggerAndRenderOptions($(formFields.attendanceStatusDropdownId), statusName, statusId, false);
                // remove the row
                $row.remove();
                // calculate the total amount
                calculateTotalAmount();
                getTableSerialNumber(formFields.attendanceGrid);
            });
            // save the voucher
            $(formFields.btnSave).on('click', async function (e) {
                e.preventDefault();
                await self.initSave();
            });
            // reset the voucher
            $(formFields.btnReset).on('click', function (e) {
                e.preventDefault();
                resetVoucher();
            });

            // added shortcut key for save F10 and reset F5
            shortcut.add("F10", function () {
                $(formFields.btnSave).get(0).click();
            });
            shortcut.add("F5", function () {
                $(formFields.btnReset).get(0).click();
            });

            $('body').on('click', '.btn-edit-attendance', async function (e) {
                e.preventDefault();
                await getAttendanceById($(this).data('vrnoa_hide'));
            });
            $(document.body).on('click', '.btn-edit-attendanceListActive', async function (e) {
                e.preventDefault();
                const attendanceId = $(this).data('vrnoa');
                await updateAttendanceListStatus(attendanceId);
            });
            $(document.body).on('click', '.btn-edit-attendanceListInActive', async function (e) {
                e.preventDefault();
                const attendanceId = $(this).data('vrnoa');
                await updateAttendanceListStatus(attendanceId);
            });

            $(document.body).on('change', 'input[name="durType"]', function (e) {
                const dateType = $('input[type="radio"][name="durType"]:checked').val();
                if (dateType === 'today') {
                    updateDateRangeCurrentDay('fromDate', 'toDate');
                } else if (dateType === 'year') {
                    setFinancialYearDate('fromDate', 'toDate');
                } else if (dateType === 'week') {
                    updateDateRangeToCurrentWeek('fromDate', 'toDate');
                } else if (dateType === 'month') {
                    updateDateRangeToCurrentMonth('fromDate', 'toDate');
                }
            });
            $('#attendanceSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getAttendanceDataTable();
            });
            $('#attendanceFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getAttendanceDataTable(fromDate, toDate);
            });
            $(document.body).on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                const attendanceId = parseNumber($(this).data('attendance_id'));
                getAttendanceById(attendanceId);
                $('a[href="#Main"]').trigger('click');
            });
            $(document.body).on('click', '.btnPrint', function (e) {
                const attendanceId = $(this).data('attendance_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(attendanceId, settingPrintDefault, 'lg', '');
                }
            });
            $(document.body).on('click', '.btnPrintA4WithHeader', function (e) {
                const attendanceId = $(this).data('attendance_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(attendanceId, 1, 'lg', "");
                }
            });
            $(document.body).on('click', '.btnPrintA4WithOutHeader', function (e) {
                const attendanceId = $(this).data('attendance_id');
                e.preventDefault();
                printVoucher(attendanceId, 2, 'lg', "");
            });
            $(document.body).on('click', '.btnPrintB5WithHeader', function (e) {
                const attendanceId = $(this).data('attendance_id');
                e.preventDefault();
                printVoucher(attendanceId, 3, 'lg', "");
            });
            $(document.body).on('click', '.btnPrintB5WithOutHeader', function (e) {
                const attendanceId = $(this).data('attendance_id');
                e.preventDefault();
                printVoucher(attendanceId, 4, 'lg', "");
            });
            $(document.body).on('click', '.btnDelete', async function (e) {
                const attendanceId = $(this).data('attendance_id');
                e.preventDefault();
                if (attendanceId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', async function (result) {
                        if (result) {
                            await deleteVoucher(attendanceId);
                        }
                    });
                }
            });
            // On change staff dropdown
            $(formFields.staffDropdownId).on('change', async function () {
                const staffId = parseNumber($(this).val());
                if (staffId !== 0) {
                    // make Ajax  on staff
                    const response = await makeAjaxRequest('GET', `${apiURL}/payroll/staff/getStaffById`, {
                        staffId: staffId
                    });

                    if (response.status == false) {
                        AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: 'danger' });
                    }
                    const staff = response.data;

                    // append the staff department
                    triggerAndRenderOptions($(formFields.departmentDropdownId), staff.staff_department.name, staff.staff_department.id, false, true);
                    // append the staff shift
                    triggerAndRenderOptions($(formFields.shiftDropdownId), staff.staff_shift.name, staff.staff_shift.id, false);
                    // time in
                    $(formFields.timeIn).val(staff.staff_shift.time_in);
                    // time out
                    $(formFields.timeOut).val(staff.staff_shift.time_out);
                    // staff information
                    const staffInformation = `
                        <strong>Staff Type:</strong> <span>${staff.staff_type}</span> <br />
                        <strong>Department:</strong> <span>${staff.staff_department.name}</span> <br />
                        <strong>Designation:</strong> <span>${staff.staff_designation.name}</span> <br />
                        <strong>Shift:</strong> <span>${staff.staff_shift.name}</span> <br />
                        <strong>Current Balance:</strong> <span>${staff.balance}</span> <br />
                    `;
                    $(formFields.otherStaffInformation).html(staffInformation);

                    // check for focus if department is not selected, set focus to department dropdown, or shift dropdown, or time in, or time out or status dropdown
                    if (parseNumber($(formFields.departmentDropdownId).val()) === 0) {
                        $(formFields.departmentDropdownId).focus();
                    } else if (parseNumber($(formFields.shiftDropdownId).val()) === 0) {
                        $(formFields.shiftDropdownId).focus();
                    } else if ($(formFields.timeIn).val() === '') {
                        $(formFields.timeIn).focus();
                    } else if ($(formFields.timeOut).val() === '') {
                        $(formFields.timeOut).focus();
                    } else {
                        $(formFields.attendanceStatusDropdownId).focus();
                    }
                } else {
                    $(formFields.otherStaffInformation).empty();
                }
            });
            // staff shift change
            $(formFields.shiftDropdownId).on('change', async function () {
                const shiftId = parseNumber($(this).val());
                if (shiftId !== 0) {
                    const response = await makeAjaxRequest('GET', `${apiURL}/shift/fetch`, {
                        shiftId: shiftId
                    });

                    if (response.status == false) {
                        $(formFields.timeIn).val('');
                        $(formFields.timeOut).val('');

                        AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: 'danger' });
                        return;
                    }
                    const staffShift = response.data;
                    // time in
                    $(formFields.timeIn).val(staffShift.time_in);
                    // time out
                    $(formFields.timeOut).val(staffShift.time_out);
                }
            });

            // auto post checkbox on change
            $(formFields.autoPosted).on('change', function () {
                const isPosted = $(this).is(':checked');
                if (isPosted) {
                    // remove d-none from #autoDates id
                    $('#autoDates').removeClass('d-none');
                } else {
                    // add d-none from #autoDates id
                    $('#autoDates').addClass('d-none');
                }
            });
            // search button
            $(formFields.btnSearch).on('click', async function (e) {
                e.preventDefault();

                $('#attendanceGridBody').empty();

                const departmentId = ($(formFields.autoDepartmentDropdownId).val()) || null;
                const statusId = parseNumber($(formFields.autoStaffAttendanceStatusDropdownId).val());
                const statusName = $(formFields.autoStaffAttendanceStatusDropdownId).find('option:selected').text();

                // required fields check status
                if (statusId === 0) {
                    $('#select2-autoStaffAttendanceStatusDropdownId-container').parent().addClass('inputerror');
                    return AlertComponent.getAlertMessage({ title: 'Error', message: 'Status is required', type: 'danger' });
                }

                const response = await makeAjaxRequest('GET', `${apiURL}/payroll/attendance/getStaffListByDepartments`, {
                    departmentId: departmentId,
                    statusId: statusId
                });

                if (response.status == false) {
                    AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: 'danger' });
                    return;
                }
                // loop through the data
                response.data.forEach(async function (item) {
                    await appendToTable(item.staffId, item.staffName, item.departmentId, item.departmentName, item.shiftId, item.shiftName, item.timeIn, item.timeOut, statusId, statusName);
                });
            });
        },

        initSave: async function () {
            await disableButton();
            const alertMessage = validateSave();
            if (alertMessage) {
                await enableDisableButton();
                return AlertComponent.getAlertMessage({ title: 'Error', message: alertMessage, type: 'danger' });
            }
            await save(getSaveObject());

        },

        resetVoucher: function () {
            general.reloadWindow();
        }
    };
};

const attendance = new Attendance();
attendance.init();

$(function () {
    new DynamicOption('#staffDropdownId', {
        requestedUrl: dropdownOptions.getAllStaff,
        placeholderText: 'Choose Staff'
    });
    // department Dropdown Id
    new DynamicOption('#departmentDropdownId', {
        requestedUrl: dropdownOptions.getAllStaffDepartment,
        placeholderText: 'Choose Department'
    });
    // shift Dropdown Id
    new DynamicOption('#shiftDropdownId', {
        requestedUrl: dropdownOptions.getAllShift,
        placeholderText: 'Choose Shift'
    });
    // attendance status Dropdown Id
    new DynamicOption('#attendanceStatusDropdownId', {
        requestedUrl: dropdownOptions.getAttendanceStatus,
        placeholderText: 'Choose Status'
    });

    new DynamicOption('#autoDepartmentDropdownId', {
        requestedUrl: dropdownOptions.getAllStaffDepartment,
        placeholderText: 'Choose Department'
    });

    new DynamicOption('#autoStaffAttendanceStatusDropdownId', {
        requestedUrl: dropdownOptions.getAttendanceStatus,
        placeholderText: 'Choose Status'
    });
});
