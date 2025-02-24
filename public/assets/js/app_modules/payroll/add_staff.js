import AlertComponent from "../../../../js/components/AlertComponent.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { AMOUNT_ROUNDING } from "../../../../js/components/GlobalConstants.js";
import { apiURL, dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, ifNull, parseNumber, updateDatepickerWithFormattedDate } from "../commonFunctions/CommonFunction.js";

var Staff = function () {
    var save = async function (staffObject) {
        const response = await makeAjaxRequest('POST', `${apiURL}/payroll/staff/save`, staffObject, 'Json', { processData: false, contentType: false });
        if (response && response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: 'Error!', message: response.message, type: 'danger' });
        } else if (response && response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: 'Warning!', message: response.message, type: 'warning' });
        } else {
            AlertComponent.getAlertMessage({ title: 'Successfully!', message: response.message, type: 'success' });
            resetVoucher();
        }
    };

    var getStaffById = async function (staffId) {
        const response = await makeAjaxRequest('GET', `${apiURL}/payroll/staff/getStaffById`, {
            staffId: staffId
        });
        resetVoucher();
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: 'Error!', message: response.message, type: 'danger' });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: 'Warning!', message: response.message, type: 'warning' });
        } else {
            populateData(response.data);
        }
    };

    var populateData = function (data) {

        $('#staffHiddenId').val(data.id);
        $('#staffTypeDropdown').val(data.staff_type).trigger('change.select2');
        $('#agreementDropdown').val(data.staff_agreement_list);
        appendSelect2ValueIfDataExists("departmentDropdown", "staff_department", "id", "name", data);
        appendSelect2ValueIfDataExists("designationDropdown", "staff_designation", "id", "name", data);
        $('#staffName').val(data.name);
        $('#staffFatherName').val(data.father_name);
        $('#staffGenderDropdown').val(data.gender).trigger('change.select2');
        $('#staffMartialDropdown').val(data.marital_status).trigger('change.select2');
        $('#staffReligion').val(data.religion);
        $('#staffCnic').val(data.staff_cnic);
        updateDatepickerWithFormattedDate('staffDateOfBirth', data.date_of_birth);
        updateDatepickerWithFormattedDate('staffDateOfJoining', data.date_of_joining);
        appendSelect2ValueIfDataExists("staffShiftDropdown", "staff_shift", "id", "name", data);
        $('#staffShiftDate').val(data.shift_date);
        $('#staffMachineId').val(data.machine_id);
        $('#staffAddress').val(data.staff_address);
        $('#staffPhoneNo').val(data.staff_phone_no);
        $('#staffMobileNo').val(data.staff_mobile_no);
        $('#staffBankName').val(data.staff_bank_name);
        $('#staffAccountName').val(data.staff_account_no);
        $('#staffSalaryAmount').val(data.staff_salary_amount);
        $('#staffMonthlyPaidLeaves').val(data.monthly_paid_leaves);
        const isLoanDeduction = (parseNumber(data.is_loan_deduction) === 1);
        const isOvertime = (parseNumber(data.is_over_time) === 1);
        const isOvertimeAutoManual = (parseNumber(data.overtime_auto_manual) === 1);

        $('#staffIsLoanDeduction').prop('checked', isLoanDeduction).trigger('change');
        $('#staffIsOverTimeAllowed').prop('checked', isOvertime).trigger('change');
        $('#staffOvertimeAutoManual').prop('checked', isOvertimeAutoManual).trigger('change');

        $('#staffOvertimeRate').val(data.over_time_rate);
        $('#weeklyRestDayDropdown').val(data.week_day_id).trigger('change.select2');

        if (data.staff_photo_url) {
            $('#itemImageDisplay').attr('src', data.staff_photo_url);
        } else {
            $('#itemImageDisplay').attr('src', ''); // Or set a default image path
        }


        if (data.salary) {
            $('#staffPayScale').val(parseNumber(data.salary.pay_scale).toFixed(AMOUNT_ROUNDING));
            $('#staffBasicSalary').val(parseNumber(data.salary.basic_salary).toFixed(AMOUNT_ROUNDING));
            $('#staffConveyanceAllowance').val(parseNumber(data.salary.conveyance_allowance).toFixed(AMOUNT_ROUNDING));
            $('#staffHouseRent').val(parseNumber(data.salary.house_rent).toFixed(AMOUNT_ROUNDING));
            $('#staffEntertainment').val(parseNumber(data.salary.entertainment).toFixed(AMOUNT_ROUNDING));
            $('#staffMedicalAllowance').val(parseNumber(data.salary.medical_allowance).toFixed(AMOUNT_ROUNDING));
            $('#staffOther').val(parseNumber(data.salary.others).toFixed(AMOUNT_ROUNDING));
            $('#staffGrossSalary').val(parseNumber(data.salary.gross_salary).toFixed(AMOUNT_ROUNDING));
            $('#staffEOBI').val(parseNumber(data.salary.eobi).toFixed(AMOUNT_ROUNDING));
            $('#staffSocialSecurity').val(parseNumber(data.salary.social_security).toFixed(AMOUNT_ROUNDING));
            $('#staffInsurance').val(parseNumber(data.salary.insurance).toFixed(AMOUNT_ROUNDING));
            $('#staffTotalDeduction').val(parseNumber(data.salary.deduction).toFixed(AMOUNT_ROUNDING));
            $('#staffNetSalary').val(parseNumber(data.salary.net_salary).toFixed(AMOUNT_ROUNDING));
        }
    };

    // checks for the empty fields
    var validateSave = function () {
        let hasError = false;
        let errorMessage = '';
        const staffTypeDropdown = $('#staffTypeDropdown');
        const departmentDropdown = $('#departmentDropdown');
        const designationDropdown = $('#designationDropdown');
        const staffName = $('#staffName');
        const staffFatherName = $('#staffFatherName');
        const staffShiftDropdown = $('#staffShiftDropdown');

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!$(staffTypeDropdown).val()) {
            $('#select2-staffTypeDropdown-container').parent().addClass('inputerror');
            errorMessage += `Staff type is required <br />`;
            hasError = true;
        }
        if (!$(staffName).val()) {
            $(staffName).addClass('inputerror');
            errorMessage += `Staff name is required <br />`;
            hasError = true;
        }
        if (!$(staffFatherName).val()) {
            $(staffFatherName).addClass('inputerror');
            errorMessage += `Staff father name is required <br />`;
            hasError = true;
        }

        if (!$(departmentDropdown).val()) {
            $('#select2-departmentDropdown-container').parent().addClass('inputerror');
            errorMessage += `Staff department is required <br />`;
            hasError = true;
        }
        if (!$(designationDropdown).val()) {
            $('#select2-designationDropdown-container').parent().addClass('inputerror');
            errorMessage += `Staff designation is required <br />`;
            hasError = true;
        }

        if (!$(staffShiftDropdown).val()) {
            $('#select2-staffShiftDropdown-container').parent().addClass('inputerror');
            errorMessage += `Staff Shift is required <br />`;
            hasError = true;
        }

        if (hasError) {
            return errorMessage;
        }
        return null;
    };

    var getSaveObject = function () {
        const staffObject = new FormData();

        // Add existing fields to FormData
        staffObject.append('staffObject[id]', $('#staffHiddenId').val() ? $.trim($('#staffHiddenId').val()) : null);
        staffObject.append('staffObject[staff_type]', $('#staffTypeDropdown').val() || null);
        staffObject.append('staffObject[staff_agreement_list]', $('#agreementDropdown').val() || null);
        staffObject.append('staffObject[staff_department_id]', $('#departmentDropdown').val() || null);
        staffObject.append('staffObject[staff_designation_id]', $('#designationDropdown').val() || null);
        staffObject.append('staffObject[name]', $('#staffName').val() ? $.trim($('#staffName').val()) : null);
        staffObject.append('staffObject[father_name]', $('#staffFatherName').val() ? $.trim($('#staffFatherName').val()) : null);
        staffObject.append('staffObject[gender]', $('#staffGenderDropdown').val() ? $.trim($('#staffGenderDropdown').val()) : null);
        staffObject.append('staffObject[marital_status]', $('#staffMartialDropdown').val() ? $.trim($('#staffMartialDropdown').val()) : null);
        staffObject.append('staffObject[religion]', $('#staffReligion').val() ? $.trim($('#staffReligion').val()) : null);
        staffObject.append('staffObject[staff_cnic]', $('#staffCnic').val() ? $.trim($('#staffCnic').val()) : null);
        staffObject.append('staffObject[date_of_birth]', $('#staffDateOfBirth').val() ? $.trim($('#staffDateOfBirth').val()) : null);
        staffObject.append('staffObject[date_of_joining]', $('#staffDateOfJoining').val() ? $.trim($('#staffDateOfJoining').val()) : null);
        staffObject.append('staffObject[shift_id]', $('#staffShiftDropdown').val() ? $.trim($('#staffShiftDropdown').val()) : null);
        staffObject.append('staffObject[shift_date]', $('#staffShiftDate').val() ? $.trim($('#staffShiftDate').val()) : null);
        staffObject.append('staffObject[machine_id]', $('#staffMachineId').val() ? $.trim($('#staffMachineId').val()) : null);
        staffObject.append('staffObject[staff_address]', $('#staffAddress').val() ? $.trim($('#staffAddress').val()) : null);
        staffObject.append('staffObject[staff_phone_no]', $('#staffPhoneNo').val() ? $.trim($('#staffPhoneNo').val()) : null);
        staffObject.append('staffObject[staff_mobile_no]', $('#staffMobileNo').val() ? $.trim($('#staffMobileNo').val()) : null);
        staffObject.append('staffObject[staff_bank_name]', $('#staffBankName').val() ? $.trim($('#staffBankName').val()) : null);
        staffObject.append('staffObject[staff_account_no]', $('#staffAccountName').val() ? $.trim($('#staffAccountName').val()) : null);
        staffObject.append('staffObject[staff_salary_amount]', $('#staffSalaryAmount').val() ? $.trim($('#staffSalaryAmount').val()) : null);
        staffObject.append('staffObject[monthly_paid_leaves]', $('#staffMonthlyPaidLeaves').val() ? $.trim($('#staffMonthlyPaidLeaves').val()) : null);
        staffObject.append('staffObject[is_over_time]', $('#staffIsOverTimeAllowed').prop('checked') === true ? 1 : 0);
        staffObject.append('staffObject[overtime_auto_manual]', $('#staffOvertimeAutoManual').prop('checked') === true ? 1 : 0);
        staffObject.append('staffObject[is_loan_deduction]', $('#staffIsLoanDeduction').prop('checked') === true ? 1 : 0);
        staffObject.append('staffObject[over_time_rate]', $('#staffOvertimeRate').val());
        staffObject.append('staffObject[week_day_id]', $('#weeklyRestDayDropdown').val() ? $.trim($('#weeklyRestDayDropdown').val()) : null);

        // Add salary object fields to FormData
        staffObject.append('staffObject[staffSalaryObject][pay_scale]', $('#staffPayScale').val() ? $.trim($('#staffPayScale').val()) : null);
        staffObject.append('staffObject[staffSalaryObject][basic_salary]', $('#staffBasicSalary').val() ? $.trim($('#staffBasicSalary').val()) : null);
        staffObject.append('staffObject[staffSalaryObject][conveyance_allowance]', $('#staffConveyanceAllowance').val() ? $.trim($('#staffConveyanceAllowance').val()) : null);
        staffObject.append('staffObject[staffSalaryObject][house_rent]', $('#staffHouseRent').val() ? $.trim($('#staffHouseRent').val()) : null);
        staffObject.append('staffObject[staffSalaryObject][entertainment]', $('#staffEntertainment').val() ? $.trim($('#staffEntertainment').val()) : null);
        staffObject.append('staffObject[staffSalaryObject][medical_allowance]', $('#staffMedicalAllowance').val() ? $.trim($('#staffMedicalAllowance').val()) : null);
        staffObject.append('staffObject[staffSalaryObject][others]', $('#staffOther').val() ? $.trim($('#staffOther').val()) : null);
        staffObject.append('staffObject[staffSalaryObject][gross_salary]', $('#staffGrossSalary').val() ? $.trim($('#staffGrossSalary').val()) : null);
        staffObject.append('staffObject[staffSalaryObject][eobi]', $('#staffEOBI').val() ? $.trim($('#staffEOBI').val()) : null);
        staffObject.append('staffObject[staffSalaryObject][social_security]', $('#staffSocialSecurity').val() ? $.trim($('#staffSocialSecurity').val()) : null);
        staffObject.append('staffObject[staffSalaryObject][insurance]', $('#staffInsurance').val() ? $.trim($('#staffInsurance').val()) : null);
        staffObject.append('staffObject[staffSalaryObject][deduction]', $('#staffTotalDeduction').val() ? $.trim($('#staffTotalDeduction').val()) : null);
        staffObject.append('staffObject[staffSalaryObject][net_salary]', $('#staffNetSalary').val() ? $.trim($('#staffNetSalary').val()) : null);

        // Add deduction object fields to FormData
        staffObject.append('staffObject[staffDeductionObject][eobi]', $('#staffEOBI').val() ? $.trim($('#staffEOBI').val()) : null);
        staffObject.append('staffObject[staffDeductionObject][social_security]', $('#staffSocialSecurity').val() ? $.trim($('#staffSocialSecurity').val()) : null);
        staffObject.append('staffObject[staffDeductionObject][insurance]', $('#staffInsurance').val() ? $.trim($('#staffInsurance').val()) : null);
        staffObject.append('staffObject[staffDeductionObject][deduction]', $('#staffTotalDeduction').val() ? $.trim($('#staffTotalDeduction').val()) : null);
        staffObject.append('staffObject[staffDeductionObject][net_salary]', $('#staffNetSalary').val() ? $.trim($('#staffNetSalary').val()) : null);


        staffObject.append('staff_photo', getImage());
        return staffObject;
    };
    function getImage() {
        var file = $('#itemImage').get(0).files[0]; // Get the uploaded file

        // Check if the file exists and is an image
        if (file && file.type.match(/image.*/)) {
            // Check for FileReader support
            if (window.FileReader) {
                const reader = new FileReader(); // Create a new FileReader

                reader.onloadend = function (e) {
                    // Update the image display with the uploaded image
                    $('#itemImageDisplay').attr('src', e.target.result);

                    // Assuming 'setting' is a global object and 'photo' is a property to be cleared
                    // Ensure 'setting' is defined and accessible in this scope
                    if (typeof staff !== 'undefined') {
                        delete staff.staff_photo;
                    }
                };

                reader.readAsDataURL(file); // Read the file as Data URL
            } else {
                console.log('FileReader API is not supported by your browser.');
            }
        } else {
            console.log('No valid image file selected.');
            // Optionally, reset the image display if no valid image file is selected
            $('#itemImageDisplay').attr('src', ''); // Or set a default image
        }

        return file || null; // Return the file object or null if no valid file
    };
    const resetField = () => {
        const resetArry = [
            'staffName',
            'staffNativeName',
            'staffDescription',
            'staffTypeDropdown',
            'agreementDropdown',
            'departmentDropdown',
            'designationDropdown',
            'staffFatherName',
            'staffGenderDropdown',
            'staffMartialDropdown',
            'staffReligion',
            'staffCnic',
            'staffDateOfBirth',
            'staffDateOfJoining',
            'staffShiftDropdown',
            'staffShiftDate',
            'staffMachineId',
            'staffAddress',
            'staffPhoneNo',
            'staffMobileNo',
            'staffBankName',
            'staffAccountName',
            'weeklyRestDayDropdown',
            'staffPayScale',
            'staffBasicSalary',
            'staffConveyanceAllowance',
            'staffHouseRent',
            'staffEntertainment',
            'staffMedicalAllowance',
            'staffOther',
            'staffEOBI',
            'staffSocialSecurity',
            'staffInsurance',
            'staffMonthlyPaidLeaves',
            'staffOvertimeRate'
        ];
        clearValueAndText(resetArry, '#');
        const resetDisabledArray = [
            { selector: 'staffHiddenId', options: { disabled: true } },
            { selector: 'staffNetSalary', options: { disabled: true } },
            { selector: 'staffTotalDeduction', options: { disabled: true } },
            { selector: 'staffGrossSalary', options: { disabled: true } },
            { selector: 'staffSalaryAmount', options: { disabled: true } },
        ];
        clearValueAndText(resetDisabledArray);
        $('a[href="#basicInformation"]').trigger('click');
        $('#staffIsLoanDeduction').prop('checked', true).trigger('change');
        $('#staffOvertimeAutoManual').prop('checked', true).trigger('change');
        $('#staffIsOverTimeAllowed').prop('checked', false).trigger('change');
        $('.inputerror').removeClass('inputerror');
        // Reset the image reader and file input
        $('#itemImage').val(''); // Clear the file input
        $('#itemImageDisplay').attr('src', ''); // Reset the image display to empty or default image
        staffDataTable.ajax.reload();
    };

    const resetVoucher = () => {
        resetField();
    };
    const updateStaffListStatus = async function (staffId) {
        const response = await makeAjaxRequest('PUT', `${apiURL}/payroll/staff/updateStaffListStatus`, {
            staffId: staffId
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: 'danger' });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: 'Warning', message: response.message, type: 'warning' });
        } else {
            AlertComponent.getAlertMessage({ title: 'Successfully', message: response.message, type: 'success' });
            staffDataTable.ajax.reload();
        }
    };

    const calculateGrossSalary = function () {
        var staffBasicSalary = parseNumber($('#staffBasicSalary').val());
        var staffConveyanceAllowance = parseNumber($('#staffConveyanceAllowance').val());
        var staffHouseRent = parseNumber($('#staffHouseRent').val());
        var staffEntertainment = parseNumber($('#staffEntertainment').val());
        var staffMedicalAllowance = parseNumber($('#staffMedicalAllowance').val());
        var staffOther = parseNumber($('#staffOther').val());

        var staffGrossSalary = staffBasicSalary + staffConveyanceAllowance + staffHouseRent + staffEntertainment + staffMedicalAllowance + staffOther;
        $('#staffGrossSalary').val(parseNumber(staffGrossSalary).toFixed(AMOUNT_ROUNDING));
        calculateNetSalary();
    }

    const calculateNetSalary = function () {
        var staffEOBI = parseNumber($('#staffEOBI').val());
        var staffSocialSecurity = parseNumber($('#staffSocialSecurity').val());
        var staffInsurance = parseNumber($('#staffInsurance').val());

        var staffTotalDeduction = staffEOBI + staffSocialSecurity + staffInsurance;
        $('#staffTotalDeduction').val(staffTotalDeduction);

        var staffGrossSalary = parseNumber($('#staffGrossSalary').val());
        var netSalary = staffGrossSalary - staffTotalDeduction;
        $('#staffNetSalary').val(parseNumber(netSalary).toFixed(AMOUNT_ROUNDING));
        $('#staffSalaryAmount').val(parseNumber(netSalary).toFixed(AMOUNT_ROUNDING));
    };

    let staffDataTable = undefined;
    const getStaffDataTable = (staffType = -1) => {
        if (typeof staffDataTable !== 'undefined') {
            staffDataTable.destroy();
            $('#staffDataTableBody').empty();
        }
        staffDataTable = $("#staffDataTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${apiURL}/payroll/staff/getStaffDataTable`,
                data: { 'staffType': staffType }
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
                    data: "id",
                    name: 'id',
                    className: "id",
                },
                {
                    data: "name",
                    name: 'name',
                    className: "text-left name",
                },
                {
                    data: "staff_designation.name",
                    name: 'staffDesignation.name',
                    className: "staff_designation_name",
                    orderable: false,
                    render: function (data) {
                        return ifNull(data, '-');
                    }
                },
                {
                    data: "staff_department.name",
                    name: 'staffDepartment.name',
                    className: "staff_department_name",
                    orderable: false,
                    render: function (data) {
                        return ifNull(data, '-');
                    }
                },
                {
                    data: "staff_shift.name",
                    name: 'staffShift.name',
                    className: "staff_shift_name",
                    orderable: false,
                    render: function (data) {
                        return ifNull(data, '-');
                    }
                },
                {
                    data: "staff_salary_amount",
                    name: 'staff_salary_amount',
                    className: "staff_salary_amount",
                    orderable: false,
                    render: function (data) {
                        return parseNumber(data).toFixed(AMOUNT_ROUNDING);
                    }
                },
                {
                    data: null,
                    className: "select text-right",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-staff" data-vrnoa_hide="' + row.id + '" data-toggle="tooltip" data-title="View Detail On Modal"><i class="fa fa-edit"></i></button>';
                        if (row.is_active == "1") {
                            buttons += '<a href="#" class="btn btn-sm btn-outline-warning group-hover:bg-yellow-800 group-hover:border-yellow-800 group-hover:text-white btn-edit-staffListActive text-center ml-2" data-vrnoa="' + row.id + '"><i class="fas fa-times-circle"></i></a>';
                        } else if (row.is_active == "0") {
                            buttons += '<a href="#" class="btn btn-sm btn-outline-success group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white btn-edit-staffListInActive text-center ml-2" data-vrnoa="' + row.id + '"><i class="fas fa-check"></i></a>';
                        }
                        return buttons;
                    }
                }
            ],
            createdRow: function (row, data, dataIndex) {
                $(row).addClass('group odd:bg-white even:bg-slate-50 py-1 px-1');
                $('td', row).addClass('py-1 px-1 text-md align-middle text-middle');
            }
        });
    };

    return {

        init: function () {
            this.bindUI();
            $('.select2').select2();
            getStaffDataTable();
            $('#staffIsOverTimeAllowed').prop('checked', false).trigger('change');
            $('#staffOvertimeAutoManual').prop('checked', true).trigger('change');
        },

        bindUI: function () {
            $('[data-toggle="tooltip"]').tooltip();

            const self = this;
            $('#staffBasicSalary, #staffConveyanceAllowance, #staffHouseRent, #staffEntertainment, #staffMedicalAllowance, #staffOther').on('input', calculateGrossSalary);
            $('#staffEOBI, #staffSocialSecurity, #staffInsurance').on('input', calculateNetSalary);
            $('#staffOvertimeAutoManual').on('change', function () {
                if ($(this).prop('checked')) {
                    // Auto state
                    $('#staffOvertimeRate').val('').prop('disabled', true);
                    $('#otToggleLabel').text('Auto');
                } else {
                    // Manual state
                    $('#staffOvertimeRate').val('').prop('disabled', false);
                    $('#otToggleLabel').text('Manual');
                }
            });
            $('#staffIsOverTimeAllowed').on('change', function () {
                if ($(this).prop('checked')) {
                    // Auto state
                    $('.staffIsOverTimeAllowed').removeClass('d-none');
                } else {
                    // Manual state
                    $('.staffIsOverTimeAllowed').addClass('d-none');
                    $('#staffOvertimeRate').val('');
                }
            });
            $(document.body).on('change', 'input[name="staffIsActive"]', function (e) {
                const staffIsActive = parseNumber($('input[type="radio"][name="staffIsActive"]:checked').val());
                getStaffDataTable(staffIsActive);
            });
            $(document.body).on('click', '#staffSyncAlt', function (e) {
                e.preventDefault();
                resetVoucher();
            });
            $('#itemImage').on('change', function () {
                getImage();
            });
            $('#removeImg').on('click', function (e) {
                e.preventDefault();
                var src = $('#itemImageDisplay').attr('src');
                if (confirm("Are you sure to delete this image?") && src.length > 0) {
                    $('#itemImageDisplay').attr('src', '');
                    $("#itemImage").val(null);
                    staff.staff_photo = null;
                }
            });
            shortcut.add("F10", function () {
                $('#saveStaffButton').get(0).click();
            });
            shortcut.add("F5", function () {
                $('#resetStaffButton').get(0).click();
            });
            $('#saveStaffButton').on('click', async function (e) {
                e.preventDefault();
                await self.initSave();
            });

            $('#resetStaffButton').on('click', function (e) {
                e.preventDefault();
                resetVoucher();
            });
            $('#saveStaffButtonBottom').on('click', async function (e) {
                e.preventDefault();
                await self.initSave();
            });

            $('#resetStaffButtonBottom').on('click', function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $('body').on('click', '.btn-edit-staff', async function (e) {
                e.preventDefault();
                await getStaffById($(this).data('vrnoa_hide'));
                $('a[href="#basicInformation"]').trigger('click');
            });
            $(document.body).on('click', '.btn-edit-staffListActive', async function (e) {
                e.preventDefault();
                const staffId = $(this).data('vrnoa');
                await updateStaffListStatus(staffId);
            });
            $(document.body).on('click', '.btn-edit-staffListInActive', async function (e) {
                e.preventDefault();
                const staffId = $(this).data('vrnoa');
                await updateStaffListStatus(staffId);
            });
        },

        initSave: async function () {
            const alertMessage = validateSave();
            if (alertMessage) {
                return _getAlertMessage('Error!', alertMessage, 'danger');;
            }

            const saveObject = getSaveObject();
            await save(saveObject);
        }
    };
};

var staff = new Staff();
staff.init();
// Corrected function to match the HTML ID
$(function () {
    new DynamicOption("#departmentDropdown", {
        requestedUrl: dropdownOptions.getAllStaffDepartment,
        placeholderText: "Choose Department"
    });
    new DynamicOption("#designationDropdown", {
        requestedUrl: dropdownOptions.getAllDesignation,
        placeholderText: "Choose Department"
    });
    new DynamicOption("#staffShiftDropdown", {
        requestedUrl: dropdownOptions.getAllShift,
        placeholderText: "Choose Shift"
    });
});
