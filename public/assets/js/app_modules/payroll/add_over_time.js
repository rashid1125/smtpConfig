import AlertComponent from "../../../../js/components/AlertComponent.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { apiURL, dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import {
    clearValueAndText,
    disableButton,
    enableDisableButton,
    isPreviousBalance,
    parseNumber,
    setFinancialYearDate,
    updateDatepickerWithFormattedDate,
    updateDateRangeCurrentDay,
    updateDateRangeToCurrentMonth,
    updateDateRangeToCurrentWeek,
    updateFormattedDate
} from "../commonFunctions/CommonFunction.js";

const OverTime = function () {

    let overTimeDataTable;
    const getOverTimeDataTable = async (fromDate = null, toDate = null) => {
        if (typeof overTimeDataTable !== 'undefined') {
            overTimeDataTable.destroy();
            $('#overTimeTableBody').empty();
        }

        overTimeDataTable = $("#overTimeTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${apiURL}/payroll/overtime/getOverTimeDataTable`,
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
                    data: "staff.name",
                    name: "staff.name",
                    className: "staff_name",
                    render: function (data) {
                        return data ?? 'N/A';
                    }
                },
                {
                    data: "over_time_hours",
                    name: "over_time_hours",
                    className: "staff_name",
                    render: function (data) {
                        return data ?? 'N/A';
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
                                <a class="dropdown-item btnEditPrevVoucher" data-overtime_id="${row.id}"><i class="fa fa-edit"></i> Edit</a>
                                <div class="dropdown-divider"></div>
                                <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                    <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                    <span class="sr-only">Toggle Dropdown</span>
                                </button>
                                <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                    <li class="dropdown-item"><a href="#" class="btnPrint" data-overtime_id="${row.id}">Print Voucher</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-overtime_id="${row.id}"> Print a4 with header</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-overtime_id="${row.id}">Print a4 with out header </a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-overtime_id="${row.id}"> Print b5 with header</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-overtime_id="${row.id}"> Print b5 with out header </a></li>
                                </ul>
                                <a class="dropdown-item btnDelete" data-overtime_id="${row.id}" href="#"><i class='fa fa-trash'></i> Delete Voucher</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item btnPrintASEmail" data-overtime_id="${row.id}" href="#"><i class='fa fa-envelope'></i> Send Email</a>
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

    const validateSave = function () {
        const staffId = parseNumber($('#staffDropdown').val());
        const departmentId = parseNumber($('#departmentDropdown').val());
        const designationId = parseNumber($('#designationDropdown').val());
        const shiftId = parseNumber($('#shiftDropdown').val());
        const date = $('#currentDate').val();
        const timeIn = $('#timeIn').val();
        const timeOut = $('#timeOut').val();
        const approvedBy = $('#approvedBy').val();
        const reason = $('#reason').val();
        const overTimeHours = $('#overTimeHours').val();

        if (staffId === 0) {
            return 'Please select staff';
        }

        if (departmentId === 0) {
            return 'Please select department';
        }

        if (designationId === 0) {
            return 'Please select designation';
        }

        if (shiftId === 0) {
            return 'Please select shift';
        }

        if (date === '') {
            return 'Please select date';
        }

        if (timeIn === '') {
            return 'Please select time in';
        }

        if (timeOut === '') {
            return 'Please select time out';
        }

        // if (approvedBy === '') {
        //     return 'Please enter approved by';
        // }
        //
        // if (reason === '') {
        //     return 'Please enter reason';
        // }

        if (parseNumber(overTimeHours) === 0) {
            return 'Please enter over time hours';
        }

        return '';
    }

    const getSaveObject = function () {
        const id = $('#overTimeHiddenId').val() || "";
        const staffId = parseNumber($('#staffDropdown').val());
        const departmentId = parseNumber($('#departmentDropdown').val());
        const designationId = parseNumber($('#designationDropdown').val());
        const shiftId = parseNumber($('#shiftDropdown').val());
        const date = $('#currentDate').val();
        const timeIn = $('#timeIn').val();
        const timeOut = $('#timeOut').val();
        const approvedBy = $('#approvedBy').val();
        const reason = $('#reason').val();
        const remarks = $('#remarks').val();
        const overTimeHours = $('#overTimeHours').val();

        const overTime = {
            id: id,
            staff_id: staffId,
            department_id: departmentId,
            designation_id: designationId,
            shift_id: shiftId,
            vrdate: date,
            time_in: timeIn,
            time_out: timeOut,
            approved_by: approvedBy,
            reason: reason,
            remarks: remarks,
            over_time_hours: overTimeHours
        };

        return overTime;
    };

    var save = async function (formObject) {
        await disableButton();
        try {
            console.log(formObject);
            const response = await makeAjaxRequest('POST', `${apiURL}/payroll/overtime/save`, {
                'overTime': JSON.stringify(formObject),
                id: $('#overTimeHiddenId').val(),
                voucherDateClose: $('#voucherDateClose').val(),
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
            await enableDisableButton();
        }
    };

    var getOverTimeById = async function (overTimeId) {
        const response = await makeAjaxRequest('GET', `${apiURL}/payroll/overtime/getOverTimeById`, {
            overTimeId: overTimeId
        });
        resetField();
        if (response && response.status == false) {
            AlertComponent.getAlertMessage({ title: 'Operation failed !', message: response.message, type: response.level });
            await resetVoucher();
            return;
        }

        populateDataOverTime(response.data);
    };

    var populateDataOverTime = function (data) {
        $('#overTimeHiddenId').val(data.id);
        updateDatepickerWithFormattedDate('currentDate', data.vrdate);
        updateDatepickerWithFormattedDate('currentDate', data.vrdate);
        triggerAndRenderOptions($('#staffDropdown'), data.staff.name, data.staff.id, true, false);
        $('#approvedBy').val(data.approved_by);
        $('#reason').val(data.reason);
        $('#remarks').val(data.remarks);
        $('#overTimeHours').val(data.over_time_hours);

    };

    const resetVoucher = async () => {
        await getOverTimeDataTable();
        resetField();
    };
    const resetField = () => {
        $('.inputerror').removeClass('inputerror');
        $('a[href="#Main"]').trigger('click');

        $('#overTimeHiddenId').val('');
        // reset
        $('#staffDropdown').val('').trigger('change.select2');
        $('#departmentDropdown').val('').trigger('change.select2');
        $('#designationDropdown').val('').trigger('change.select2');
        $('#shiftDropdown').val('').trigger('change.select2');
        $('#timeIn').val('');
        $('#timeOut').val('');
        $('#approvedBy').val('');
        $('#reason').val('');
        $('#remarks').val('');
        $('#overTimeHours').val('');

        const resetArray = [
            'currentDate',
            'overTimeHiddenId',
            'overTimeHours'
        ]
        clearValueAndText(resetArray,'#');
    };

    const deleteVoucher = async (overTimeId) => {
        await disableButton();
        try {
            const response = await makeAjaxRequest('delete', `${apiURL}/payroll/overtime/delete`, {
                overTimeId: overTimeId
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

    const printVoucher = (vrnoa, paperSize, printSize, wrate = "", isSendEmail = false) => {
        try {
            const etype = "over_times";
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
            await getOverTimeDataTable();

        },

        bindUI: function () {
            $('[data-toggle="tooltip"]').tooltip();
            const self = this;
            $('#staffDropdown').on('change', async function () {
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

                    triggerAndRenderOptions($('#departmentDropdown'), staff.staff_department.name, staff.staff_department.id, false, true);
                    triggerAndRenderOptions($('#designationDropdown'), staff.staff_designation.name, staff.staff_designation.id, false, true);
                    triggerAndRenderOptions($('#shiftDropdown'), staff.staff_shift.name, staff.staff_shift.id, false, true);

                    // time in
                    $('#timeIn').val(staff.staff_shift.time_in);
                    // time out
                    $('#timeOut').val(staff.staff_shift.time_out);
                    // staff information
                    const staffInformation = `
                        <strong>Staff Type:</strong> <span>${staff.staff_type}</span> <br />
                        <strong>Department:</strong> <span>${staff.staff_department.name}</span> <br />
                        <strong>Designation:</strong> <span>${staff.staff_designation.name}</span> <br />
                        <strong>Shift:</strong> <span>${staff.staff_shift.name}</span> <br />
                        <strong>Current Balance:</strong> <span>${staff.balance}</span> <br />
                    `;
                    $('#otherStaffInformation').html(staffInformation);
                } else {
                    $('#otherStaffInformation').empty();
                }
            });


            $('.btnSave').on('click', async function (e) {
                e.preventDefault();
                await self.initSave();
            });
            // reset the voucher
            $('.btnReset').on('click', function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $(document.body).on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                const attendanceId = parseNumber($(this).data('overtime_id'));
                getOverTimeById(attendanceId);
                $('a[href="#Main"]').trigger('click');
            });
            $(document.body).on('click', '.btnPrint', function (e) {
                const attendanceId = $(this).data('overtime_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(attendanceId, settingPrintDefault, 'lg', '');
                }
            });
            $(document.body).on('click', '.btnPrintA4WithHeader', function (e) {
                const attendanceId = $(this).data('overtime_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(attendanceId, 1, 'lg', "");
                }
            });
            $(document.body).on('click', '.btnPrintA4WithOutHeader', function (e) {
                const attendanceId = $(this).data('overtime_id');
                e.preventDefault();
                printVoucher(attendanceId, 2, 'lg', "");
            });
            $(document.body).on('click', '.btnPrintB5WithHeader', function (e) {
                const attendanceId = $(this).data('overtime_id');
                e.preventDefault();
                printVoucher(attendanceId, 3, 'lg', "");
            });
            $(document.body).on('click', '.btnPrintB5WithOutHeader', function (e) {
                const attendanceId = $(this).data('overtime_id');
                e.preventDefault();
                printVoucher(attendanceId, 4, 'lg', "");
            });
            $(document.body).on('click', '.btnDelete', async function (e) {
                const attendanceId = $(this).data('overtime_id');
                e.preventDefault();
                if (attendanceId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', async function (result) {
                        if (result) {
                            await deleteVoucher(attendanceId);
                        }
                    });
                }
            });

            // added shortcut key for save F10 and reset F5
            shortcut.add("F10", function () {
                $('.btnSave').get(0).click();
            });
            shortcut.add("F5", function () {
                $('.btnReset').get(0).click();
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
            $('#overTimeSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getOverTimeDataTable();
            });
            $('#overTimeFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getOverTimeDataTable(fromDate, toDate);
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

const overTime = new OverTime();
overTime.init();

$(function () {
    new DynamicOption('#staffDropdown', {
        requestedUrl: dropdownOptions.getAllStaff,
        placeholderText: 'Choose Staff'
    });
});
