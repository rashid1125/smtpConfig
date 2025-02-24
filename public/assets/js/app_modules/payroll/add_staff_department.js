import { baseConfiguration } from "../../../../js/components/ConfigurationManager.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions, staffDepartmentApiEndpoints } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { appendSelect2ValueIfDataExists, clearValueAndText } from "../commonFunctions/CommonFunction.js";

var StaffDepartment = function () {
    const $modalInstance = $('#staffDepartmentAddModalId');
    var save = async function (staffDepartment) {
        const response = await makeAjaxRequest('POST', staffDepartmentApiEndpoints.saveStaffDepartment, {
            staffDepartmentData: JSON.stringify(staffDepartment)
        });
        if (response.status == false && response.error !== "") {
            AlertComponent._getAlertMessage('Error!', response.message, 'danger');
        } else if (response.status == false && response.message !== "") {
            AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
        } else {
            AlertComponent._getAlertMessage('Successfully!', response.message, 'success');

            resetVoucher();
            $($modalInstance).modal('hide');
        }
    };

    var getStaffDepartmentById = async function (staffDepartmentId) {
        const response = await makeAjaxRequest('GET', staffDepartmentApiEndpoints.getStaffDepartmentById, {
            staffDepartmentId: staffDepartmentId
        });
        resetField();
        if (response.status == false && response.error !== "") {
            AlertComponent._getAlertMessage('Error!', response.message, 'danger');
        } else if (response.status == false && response.message !== "") {
            AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
        } else {
            $($modalInstance).modal('show');
            populateData(response.data);
        }
    };

    var populateData = function (data) {
        $('#staffDepartmentHiddenId').val(data.id);
        $('#staffDepartmentName').val(data.name);
        $('#staffDepartmentNativeName').val(data.native_name);
        $('#staffDepartmentDescription').val(data.description);
        // Payroll accounts
        appendSelect2ValueIfDataExists("staffDepartmentSalaryAccount", "salary_account", "pid", "name", data);
        appendSelect2ValueIfDataExists("staffDepartmentSalaryPayableAccount", "salary_payable_account", "pid", "name", data);
        appendSelect2ValueIfDataExists("staffDepartmentWagesAccount", "wages_account", "pid", "name", data);
        appendSelect2ValueIfDataExists("staffDepartmentWagesPayableAccount", "wages_payable_account", "pid", "name", data);
        appendSelect2ValueIfDataExists("staffDepartmentEobiAccount", "eobi_account", "pid", "name", data);
        appendSelect2ValueIfDataExists("staffDepartmentInsuranceAccount", "insurance_account", "pid", "name", data);
        appendSelect2ValueIfDataExists("staffDepartmentSocialSecurityAccount", "social_security_account", "pid", "name", data);
        appendSelect2ValueIfDataExists("staffDepartmentStaffIncentiveAccount", "incentive_account", "pid", "name", data);
        appendSelect2ValueIfDataExists("staffDepartmentStaffPenaltyAccount", "penalty_account", "pid", "name", data);

    };

    // checks for the empty fields
    var validateSave = function () {

        var errorMessage = "";
        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        const staffDepartmentName = $.trim($('#staffDepartmentName').val());
        // Payroll accounts

        const payrollAccount = [
            { id: 'staffDepartmentSalaryAccount', messageKey: 'Salary Account' },
            { id: 'staffDepartmentSalaryPayableAccount', messageKey: 'Salary Payable Account' },
            { id: 'staffDepartmentWagesAccount', messageKey: 'Wages Account' },
            { id: 'staffDepartmentWagesPayableAccount', messageKey: 'Wages Payable Account' },
            { id: 'staffDepartmentEobiAccount', messageKey: 'EOBI Account' },
            { id: 'staffDepartmentInsuranceAccount', messageKey: 'Insurance Account' },
            { id: 'staffDepartmentSocialSecurityAccount', messageKey: 'Social Security Account' },
            { id: 'staffDepartmentStaffIncentiveAccount', messageKey: 'Staff Incentive Account' },
            { id: 'staffDepartmentStaffPenaltyAccount', messageKey: 'Staff Penalty Account' }
        ];

        if (staffDepartmentName === '') {
            $('#staffDepartmentName').addClass('inputerror');
            errorMessage += "Name is required! <br />";
        }

        // Payroll accounts loop
        payrollAccount.forEach((element) => {
            if (!$(`#${element.id}`).val()) {
                $(`#select2-${element.id}-container`).parent().addClass('inputerror');
                errorMessage += `${element.messageKey} is required! <br />`;
            }
        });

        return errorMessage;
    };

    var getSaveObject = function () {
        const obj = {};
        obj.id = $.trim($('#staffDepartmentHiddenId').val());
        obj.name = $.trim($('#staffDepartmentName').val());
        obj.native_name = $.trim($('#staffDepartmentNativeName').val());
        obj.description = $.trim($('#staffDepartmentDescription').val());
        // Payroll accounts
        obj.salary_account_id = $('#staffDepartmentSalaryAccount').val();
        obj.salary_payable_account_id = $('#staffDepartmentSalaryPayableAccount').val();
        obj.wages_account_id = $('#staffDepartmentWagesAccount').val();
        obj.wages_payable_account_id = $('#staffDepartmentWagesPayableAccount').val();
        obj.eobi_account_id = $('#staffDepartmentEobiAccount').val();
        obj.insurance_account_id = $('#staffDepartmentInsuranceAccount').val();
        obj.social_security_account_id = $('#staffDepartmentSocialSecurityAccount').val();
        obj.staff_incentive_account_id = $('#staffDepartmentStaffIncentiveAccount').val();
        obj.staff_penalty_account_id = $('#staffDepartmentStaffPenaltyAccount').val();

        return obj;
    };
    let staffDepartmentDataTable = undefined;
    const getStaffDepartmentDataTable = () => {
        if (typeof staffDepartmentDataTable !== 'undefined') {
            staffDepartmentDataTable.destroy();
            $('#staffDepartmentViewListTbody').empty();
        }
        staffDepartmentDataTable = $("#staffDepartmentViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${staffDepartmentApiEndpoints.getStaffDepartmentDataTable}`,
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
                    data: "native_name",
                    name: 'native_name',
                    className: "native_name"
                },
                {
                    data: "description",
                    name: 'description',
                    className: "description"
                },
                {
                    data: null,
                    className: "select text-right",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-staffDepartment" data-vrnoa_hide="' + row.id + '" data-toggle="tooltip" data-title="View Detail On Modal"><i class="fa fa-edit"></i></button>';
                        if (row.is_active == "1") {
                            buttons += '<a href="#" class="btn btn-sm btn-outline-warning group-hover:bg-yellow-800 group-hover:border-yellow-800 group-hover:text-white btn-edit-staffDepartmentListActive text-center ml-2" data-vrnoa="' + row.id + '"><i class="fas fa-times-circle"></i></a>';
                        } else if (row.is_active == "0") {
                            buttons += '<a href="#" class="btn btn-sm btn-outline-success group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white btn-edit-staffDepartmentListInActive text-center ml-2" data-vrnoa="' + row.id + '"><i class="fas fa-check"></i></a>';
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
    const resetField = () => {
        const resetArry = [
            'staffDepartmentHiddenId',
            'staffDepartmentName',
            'staffDepartmentNativeName',
            'staffDepartmentDescription',
            // Payroll accounts
            'staffDepartmentSalaryAccount',
            'staffDepartmentSalaryPayableAccount',
            'staffDepartmentWagesAccount',
            'staffDepartmentWagesPayableAccount',
            'staffDepartmentEobiAccount',
            'staffDepartmentInsuranceAccount',
            'staffDepartmentSocialSecurityAccount',
            'staffDepartmentStaffIncentiveAccount',
            'staffDepartmentStaffPenaltyAccount'
        ];
        clearValueAndText(resetArry, '#');
        $('.inputerror').removeClass('inputerror');
    };

    const resetVoucher = () => {
        resetField();
        getStaffDepartmentDataTable();
        loadSettings();
    };
    const updateStaffDepartmentListStatus = async function (staffDepartmentId) {
        const response = await makeAjaxRequest('PUT', `${staffDepartmentApiEndpoints.updateStaffDepartmentListStatus}`, {
            staffDepartmentId: staffDepartmentId
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: 'danger' });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: 'Warning', message: response.message, type: 'warning' });
        } else {
            AlertComponent.getAlertMessage({ title: 'Successfully', message: response.message, type: 'success' });
            staffDepartmentDataTable.ajax.reload();
        }
    };
    const loadSettings = async () => {
        triggerAndRenderOptions($("#staffDepartmentSalaryAccount"), baseConfiguration.salary_account.name, baseConfiguration.salary_account.pid, true);
        triggerAndRenderOptions($("#staffDepartmentSalaryPayableAccount"), baseConfiguration.salary_payable_account.name, baseConfiguration.salary_payable_account.pid, true);
        triggerAndRenderOptions($("#staffDepartmentWagesAccount"), baseConfiguration.wages_account.name, baseConfiguration.wages_account.pid, true);
        triggerAndRenderOptions($("#staffDepartmentWagesPayableAccount"), baseConfiguration.wages_payable_account.name, baseConfiguration.wages_payable_account.pid, true);
        triggerAndRenderOptions($("#staffDepartmentEobiAccount"), baseConfiguration.eobi_account.name, baseConfiguration.eobi_account.pid, true);
        triggerAndRenderOptions($("#staffDepartmentInsuranceAccount"), baseConfiguration.insurance_account.name, baseConfiguration.insurance_account.pid, true);
        triggerAndRenderOptions($("#staffDepartmentSocialSecurityAccount"), baseConfiguration.social_security_account.name, baseConfiguration.social_security_account.pid, true);
        triggerAndRenderOptions($("#staffDepartmentStaffIncentiveAccount"), baseConfiguration.incentive_account.name, baseConfiguration.incentive_account.pid, true);
        triggerAndRenderOptions($("#staffDepartmentStaffPenaltyAccount"), baseConfiguration.penalty_account.name, baseConfiguration.penalty_account.pid, true);

    }

    return {

        init: async function () {
            this.bindUI();
            getStaffDepartmentDataTable();
            $('.select2').select2();
            await loadSettings();
        },

        bindUI: function () {
            $('[data-toggle="tooltip"]').tooltip();

            const self = this;
            $(document.body).on('click', '#staffDepartmentModalShow', function (e) {
                e.preventDefault();
                resetVoucher();
                $($modalInstance).modal('show');
                setTimeout(function () {
                    $('#staffDepartmentName').focus();
                }, 500);
            });
            $(document.body).on('click', '#staffDepartmentSyncAlt', function (e) {
                e.preventDefault();
                getStaffDepartmentDataTable();
            });
            shortcut.add("F10", function () {
                $('#staffDepartmentSaveButton').get()[0].click();
            });
            shortcut.add("F5", function () {
                $('#staffDepartmentResetButton').get()[0].click();
            });
            $('#staffDepartmentSaveButton').on('click', function (e) {
                e.preventDefault();
                self.initSave();
            });

            $('#staffDepartmentResetButton').on('click', function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $('body').on('click', '.btn-edit-staffDepartment', async function (e) {
                e.preventDefault();
                await getStaffDepartmentById($(this).data('vrnoa_hide'));
            });
            $(document.body).on('click', '.btn-edit-staffDepartmentListActive', async function (e) {
                e.preventDefault();
                const staffDepartmentId = $(this).data('vrnoa');
                await updateStaffDepartmentListStatus(staffDepartmentId);
            });
            $(document.body).on('click', '.btn-edit-staffDepartmentListInActive', async function (e) {
                e.preventDefault();
                const staffDepartmentId = $(this).data('vrnoa');
                await updateStaffDepartmentListStatus(staffDepartmentId);
            });
        },

        initSave: function () {

            var saveObj = getSaveObject();
            const errorMessage = validateSave();

            if (errorMessage) {
                return AlertComponent.getAlertMessage({ title: 'Error', message: errorMessage, type: 'danger' });
            }

            save(saveObj);
        },

        resetVoucher: function () {
            general.reloadWindow();
        }
    };
};

var staffDepartment = new StaffDepartment();
staffDepartment.init();

$(function () {
    const dynamicOptionIds = [
        'staffDepartmentSalaryAccount',
        'staffDepartmentSalaryPayableAccount',
        'staffDepartmentWagesAccount',
        'staffDepartmentWagesPayableAccount',
        'staffDepartmentEobiAccount',
        'staffDepartmentInsuranceAccount',
        'staffDepartmentSocialSecurityAccount',
        'staffDepartmentSocialSecurityAccount',
        'staffDepartmentStaffIncentiveAccount',
        'staffDepartmentStaffPenaltyAccount'
    ];

    dynamicOptionIds.forEach((id) => {
        const element = $(`#${id}`);
        const elementId = element.attr('id'); // Get the string ID of the element
        const requestedUrl = elementId.substring(15);  // Remove the first 15 characters ("staffDepartment")

        // Assuming dropdownOptions contains properties like getAllSalaryAccountDropdown, getAllWagesAccountDropdown, etc.
        const dynamicUrl = dropdownOptions[`getAll${requestedUrl}Dropdown`];
        if (dynamicUrl) {
            new DynamicOption(`#${id}`, {
                // Remove the staffDepartment and get the last part like SalaryAccount
                requestedUrl: dynamicUrl,
                placeholder: `Select ${requestedUrl}`,
            });
        } else {
            console.error(`URL not found for ${requestedUrl}`);
        }
    });
});

