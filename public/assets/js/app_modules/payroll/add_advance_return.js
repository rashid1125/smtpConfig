import AlertComponent from "../../../../js/components/AlertComponent.js";
import { baseConfiguration } from "../../../../js/components/ConfigurationManager.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { AMOUNT_ROUNDING } from "../../../../js/components/GlobalConstants.js";
import { apiURL, dropdownOptions, staffDepartmentApiEndpoints } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { appendSelect2ValueIfDataExists, clearValueAndText, disableButton, enableDisableButton, getTableTrRowTextNumber, ifNull, parseNumber, setFinancialYearDate, updateDateRangeCurrentDay, updateDateRangeToCurrentMonth, updateDateRangeToCurrentWeek, updateDatepickerWithFormattedDate, updateFormattedDate } from "../commonFunctions/CommonFunction.js";

const AdvanceReturn = function () {
    const formFields = {
        advanceReturnIdHidden: '#advanceReturnIdHidden',
        btnSave: '.btnSave',
        btnReset: '.btnReset',
        currentDate: '#currentDate',
        voucherDateClose: '#voucherDateClose',
        staffDropdownId: '#staffDropdownId',
        advanceReturnDescription: '#advanceReturnDescription',
        advanceReturnAmount: '#advanceReturnAmount',
        btnAdd: '#btnAdd',
        accountCashDropdown: '#accountCashDropdown',
        advanceReturnGrid: '#advanceReturnGrid',
        advanceReturnGridBody: '#advanceReturnGridBody',
        totalAmount: '#totalAmount',
        // staff Other Information
        otherStaffInformation: '#otherStaffInformation',
    };
    let advanceReturnDataTable;
    const getAdvanceReturnDataTable = async (fromDate = null, toDate = null) => {
        if (typeof advanceReturnDataTable !== 'undefined') {
            advanceReturnDataTable.destroy();
            $('#advanceReturnListTableBody').empty();
        }

        advanceReturnDataTable = $("#advanceReturnListTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${apiURL}/payroll/advanceReturn/getAdvanceReturnDataTable`,
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
                    data: "advance_return.vrnoa",
                    name: 'advanceReturn.vrnoa',
                    className: "text-left vrnoa",
                },
                {
                    data: "advance_return.vrdate",
                    name: 'advanceReturn.vrdate',
                    className: "vrdate",
                    render: function (data) {
                        return updateFormattedDate(data);
                    }
                },
                {
                    data: "staff.name",
                    name: 'staff.name',
                    className: "staff_name",
                    render: function (data) {
                        return ifNull(data, "");
                    }
                },
                {
                    data: "advance_return.remarks",
                    name: 'advanceReturn.remarks',
                    className: "remarks",
                    render: function (data) {
                        return ifNull(data, "");
                    }
                },
                {
                    data: "amount",
                    name: 'amount',
                    className: "text-right amount",
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
                                <a class="dropdown-item btnEditPrevVoucher" data-advance_return_id="${row.advance_return.id}"><i class="fa fa-edit"></i> Edit</a>
                                <div class="dropdown-divider"></div>
                                <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                    <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                    <span class="sr-only">Toggle Dropdown</span>
                                </button>
                                <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                    <li class="dropdown-item"><a href="#" class="btnPrint" data-advance_return_id="${row.advance_return.id}">Print Voucher</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithHeader" data-advance_return_id="${row.advance_return.id}"> Print a4 with header</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintA4WithOutHeader" data-advance_return_id="${row.advance_return.id}">Print a4 with out header </a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithHeader" data-advance_return_id="${row.advance_return.id}"> Print b5 with header</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintB5WithOutHeader" data-advance_return_id="${row.advance_return.id}"> Print b5 with out header </a></li>
                                </ul>
                                <a class="dropdown-item btnDelete" data-advance_return_id="${row.advance_return.id}" href="#"><i class='fa fa-trash'></i> Delete Voucher</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item btnPrintASEmail" data-advance_return_id="${row.advance_return.id}" href="#"><i class='fa fa-envelope'></i> Send Email</a>
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
    const validateStaffGrid = () => {
        let hasError = false;
        let errorMessage = '';

        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        // get the values

        if (parseNumber($(formFields.staffDropdownId).val()) === 0) {
            $('#select2-staffDropdownId-container').parent().addClass('inputerror');
            errorMessage += `Staff is required <br />`;
            hasError = true;
        }

        if (parseFloat($(formFields.advanceReturnAmount).val().trim()) <= 0) {
            $(formFields.advanceReturnAmount).addClass('inputerror');
            errorMessage += `Amount is required <br />`;
            hasError = true;
        }

        if (hasError) {
            return errorMessage;
        }
        return null;
    };

    const appendToTable = (staffId, staffName, remarks, amount) => {
        const html = `<tr class="odd:bg-white even:bg-slate-50">
            <td class="py-1 px-1 text-md align-middle text-left srno"></td>
            <td class="py-1 px-1 text-md align-middle text-left staffName" data-staff_id="${staffId}">${staffName}</td>
            <td class="py-1 px-1 text-md align-middle text-left remarks">${remarks}</td>
            <td class="py-1 px-1 text-md align-middle text-right amount">${parseNumber(amount).toFixed(AMOUNT_ROUNDING)}</td>
            <td class="py-1 px-1 text-md align-middle text-right">
                <button class="btn btn-sm btn-outline-primary btn-row-edit-advanceReturn" data-toggle="tooltip" data-title="Edit"><i class="fa fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger btn-row-delete-advanceReturn" data-toggle="tooltip" data-title="Delete"><i class="fa fa-trash"></i></button>
            </td>
        </tr>`;
        $(formFields.advanceReturnGridBody).append(html);
        getTableSerialNumber(formFields.advanceReturnGrid);
    };

    // checks for the empty fields
    var validateSave = function () {
        let hasError = false;
        let errorMessage = '';
        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if ($(formFields.currentDate) === '') {
            $(formFields.currentDate).addClass('inputerror');
            errorMessage += `Date is required <br />`;
            hasError = true;
        }

        if ($.trim($(formFields.accountCashDropdown).val()) === '') {
            $('#select2-accountCashDropdown-container').parent().addClass('inputerror');
            errorMessage += `Account is required <br />`;
            hasError = true;
        }

        if ($(formFields.advanceReturnGridBody).find('tr').length === 0) {
            errorMessage += `Please add at least one staff advance <br />`;
            hasError = true;
        }

        if (hasError) {
            return errorMessage;
        }
        return null;
    };

    var getSaveObject = function () {
        const advanceReturn = {};
        const advanceReturnList = [];
        advanceReturn.id = $(formFields.advanceReturnIdHidden).val();
        advanceReturn.vrdate = $(formFields.currentDate).val();
        advanceReturn.cash_account_id = $(formFields.accountCashDropdown).val();

        $(formFields.advanceReturnGridBody).find('tr').each(function () {
            const advanceReturnObj = {};
            advanceReturnObj.staff_id = $(this).find('.staffName').data('staff_id');
            advanceReturnObj.remarks = $(this).find('.remarks').text();
            advanceReturnObj.amount = $(this).find('.amount').text();
            advanceReturnList.push(advanceReturnObj);
        });

        const data = {
            advanceReturn: advanceReturn,
            advanceReturnList: advanceReturnList
        }

        return data;
    };
    var save = async function (formObject) {
        await disableButton();
        try {
            const response = await makeAjaxRequest('POST', `${apiURL}/payroll/advanceReturn/save`, {
                advanceReturn: JSON.stringify(formObject.advanceReturn),
                advanceReturnList: JSON.stringify(formObject.advanceReturnList),
                voucherDateClose: $(formFields.voucherDateClose).val(),
                id: $(formFields.advanceReturnIdHidden).val(),
                vrdate: $(formFields.currentDate).val()
            });
            if (response.status == false && response.error !== "") {
                AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: 'danger' });
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

    var getAdvanceReturnById = async function (advanceReturnId) {
        const response = await makeAjaxRequest('GET', `${apiURL}/payroll/advanceReturn/getAdvanceReturnById`, {
            advanceReturnId: advanceReturnId
        });
        resetField();
        if (response && response.status == false) {
            AlertComponent.getAlertMessage({ title: 'Operation failed !', message: response.message, type: response.level });
            await resetVoucher();
            return;
        }

        populateDataAdvanceReturn(response.data);
    };

    var populateDataAdvanceReturn = function (data) {
        $(formFields.advanceReturnIdHidden).val(data.id);
        updateDatepickerWithFormattedDate(formFields.currentDate, data.vrdate);
        updateDatepickerWithFormattedDate(formFields.voucherDateClose, data.vrdate);
        appendSelect2ValueIfDataExists("accountCashDropdown", "cash_account", "pid", "name", data);

        data.advance_return_details.forEach(function (item) {
            appendToTable(item.staff.id, item.staff.name, ifNull(item.remarks, ""), item.amount);
        });
        calculateTotalAmount();
    };


    // delete Voucher
    const deleteVoucher = async (advanceReturnId) => {
        await disableButton();
        try {
            const response = await makeAjaxRequest('delete', `${apiURL}/payroll/advanceReturn/delete`, {
                advanceReturnId: advanceReturnId
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
        await getAdvanceReturnDataTable();
        resetField();
        loadSettingConfiguration();
    };
    const resetField = () => {
        $('.inputerror').removeClass('inputerror');
        const resetArray = [
            formFields.advanceReturnIdHidden,
            formFields.currentDate,
            formFields.voucherDateClose,
            formFields.staffDropdownId,
            formFields.advanceReturnDescription,
            formFields.advanceReturnAmount,
            formFields.accountCashDropdown,
            formFields.advanceReturnGridBody,
            formFields.totalAmount

        ];
        clearValueAndText(resetArray);
        $(formFields.advanceReturnGridBody).empty();
        // reset the staff information
        $(formFields.otherStaffInformation).empty();
        // set focus to the staff dropdown if  tab  is on main
        $('a[href="#Main"]').trigger('click');
        $(formFields.staffDropdownId).focus();
    };

    const loadSettingConfiguration = () => {
        triggerAndRenderOptions($(formFields.accountCashDropdown), baseConfiguration.hr_cash_account.name, baseConfiguration.hr_cash_account.pid);
    };

    // calculate the total amount
    const calculateTotalAmount = () => {
        let totalAmount = 0;
        $(formFields.advanceReturnGridBody).find('tr').each(function () {
            totalAmount += parseNumber($(this).find('.amount').text());
        });
        $('#totalAmount').text(parseNumber(totalAmount).toFixed(AMOUNT_ROUNDING));
    };

    const printVoucher = (vrnoa, paperSize, printSize, wrate = "", isSendEmail = false) => {
        try {
            const etype = 'advance_returns';
            const previousBalance = isPreviousBalance();
            const languageId = 1;
            const printUrl = `${baseURL}/doc/getPrintVoucherPDF/?etype=${etype}&vrnoa=${vrnoa}&pre_bal_print=${previousBalance}&paperSize=${paperSize}&printSize=${printSize}&wrate=${wrate ? wrate : 0}&language_id=${languageId}`;
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
            await getAdvanceReturnDataTable();
            loadSettingConfiguration();

        },

        bindUI: function () {
            $('[data-toggle="tooltip"]').tooltip();

            const self = this;
            $(document.body).on('click', formFields.btnAdd, function (e) {
                e.preventDefault();
                const alertMessage = validateStaffGrid();
                if (alertMessage) {
                    return AlertComponent.getAlertMessage({ title: 'Error', message: alertMessage, type: 'danger' });
                }
                const staffId = $(formFields.staffDropdownId).val();
                const staffName = $(formFields.staffDropdownId).find('option:selected').text().trim();
                const remarks = $(formFields.advanceReturnDescription).val().trim(); // remarks
                const amount = $(formFields.advanceReturnAmount).val().trim(); // amount

                // reset the form fields
                $(formFields.staffDropdownId).val('').trigger('change');
                $(formFields.advanceReturnDescription).val('');
                $(formFields.advanceReturnAmount).val('');

                // append the data to the table
                appendToTable(staffId, staffName, remarks, amount);
                // set focus to the staff dropdown
                $(formFields.staffDropdownId).focus();
                calculateTotalAmount();
            });
            // delete the row
            $(document.body).on('click', '.btn-row-delete-advanceReturn', function (e) {
                e.preventDefault();
                $(this).closest('tr').remove();
                getTableSerialNumber(formFields.advanceReturnGrid);
                calculateTotalAmount();
            });
            // edit the row
            $(document.body).on('click', '.btn-row-edit-advanceReturn', function (e) {
                e.preventDefault();
                const staffId = $(this).closest('tr').find('.staffName').data('staff_id');
                const staffName = $(this).closest('tr').find('.staffName').text().trim();
                const remarks = $(this).closest('tr').find('.remarks').text().trim();
                const amount = $(this).closest('tr').find('.amount').text().trim();

                triggerAndRenderOptions($(formFields.staffDropdownId), staffName, staffId, false);

                $(formFields.advanceReturnDescription).val(remarks);
                $(formFields.advanceReturnAmount).val(parseNumber(amount).toFixed(AMOUNT_ROUNDING));
                $(this).closest('tr').remove();
                getTableSerialNumber(formFields.advanceReturnGrid);
                calculateTotalAmount();
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

            $('body').on('click', '.btn-edit-advanceReturn', async function (e) {
                e.preventDefault();
                await getAdvanceReturnById($(this).data('vrnoa_hide'));
            });
            $(document.body).on('click', '.btn-edit-advanceReturnListActive', async function (e) {
                e.preventDefault();
                const advanceReturnId = $(this).data('vrnoa');
                await updateAdvanceReturnListStatus(advanceReturnId);
            });
            $(document.body).on('click', '.btn-edit-advanceReturnListInActive', async function (e) {
                e.preventDefault();
                const advanceReturnId = $(this).data('vrnoa');
                await updateAdvanceReturnListStatus(advanceReturnId);
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
            $('#advanceReturnSyncAlt').on('click', function (e) {
                e.preventDefault();
                $('#fromDate').datepicker('update', new Date());
                $('#toDate').datepicker('update', new Date());
                getAdvanceReturnDataTable();
            });
            $('#advanceReturnFilter').on('click', function (e) {
                e.preventDefault();
                const fromDate = $('#fromDate').val();
                const toDate = $('#toDate').val();
                getAdvanceReturnDataTable(fromDate, toDate);
            });
            $(document.body).on('click', '.btnEditPrevVoucher', function (e) {
                e.preventDefault();
                const advanceReturnId = parseNumber($(this).data('advance_return_id'));
                getAdvanceReturnById(advanceReturnId);
                $('a[href="#Main"]').trigger('click');
            });
            $(document.body).on('click', '.btnPrint', function (e) {
                const advanceReturnId = $(this).data('advance_return_id');
                const settingPrintDefault = $('#setting_print_default').val();
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(advanceReturnId, settingPrintDefault, 'lg', '');
                }
            });
            $(document.body).on('click', '.btnPrintA4WithHeader', function (e) {
                const advanceReturnId = $(this).data('advance_return_id');
                e.preventDefault();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(baseURL + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    printVoucher(advanceReturnId, 1, 'lg', "");
                }
            });
            $(document.body).on('click', '.btnPrintA4WithOutHeader', function (e) {
                const advanceReturnId = $(this).data('advance_return_id');
                e.preventDefault();
                printVoucher(advanceReturnId, 2, 'lg', "");
            });
            $(document.body).on('click', '.btnPrintB5WithHeader', function (e) {
                const advanceReturnId = $(this).data('advance_return_id');
                e.preventDefault();
                printVoucher(advanceReturnId, 3, 'lg', "");
            });
            $(document.body).on('click', '.btnPrintB5WithOutHeader', function (e) {
                const advanceReturnId = $(this).data('advance_return_id');
                e.preventDefault();
                printVoucher(advanceReturnId, 4, 'lg', "");
            });
            $(document.body).on('click', '.btnDelete', async function (e) {
                const advanceReturnId = $(this).data('advance_return_id');
                e.preventDefault();
                if (advanceReturnId !== '') {
                    _getConfirmMessage('Warning!', 'Are you sure to delete this voucher', 'warning', async function (result) {
                        if (result) {
                            await deleteVoucher(advanceReturnId);
                        }
                    });
                }
            });
            // On change staff dropdown
            $(document.body).on('change', formFields.staffDropdownId, async function () {
                const staffId = parseNumber($(this).val());
                if (staffId !== 0) {
                    // make Ajax  on staff
                    const response = await makeAjaxRequest('GET', `${apiURL}/payroll/staff/getStaffById`, {
                        staffId: staffId
                    });

                    if (response.status === false) {
                        AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: 'danger' });
                    }
                    const staff = response.data;
                    // staff information
                    const staffInformation = `
                        <strong>Staff Type:</strong> <span>${staff.staff_type}</span> <br />
                        <strong>Department:</strong> <span>${staff.staff_department.name}</span> <br />
                        <strong>Designation:</strong> <span>${staff.staff_designation.name}</span> <br />
                        <strong>Shift:</strong> <span>${staff.staff_shift.name}</span> <br />
                        <strong>Current Balance:</strong> <span>${staff.balance}</span> <br />
                    `;
                    $(formFields.otherStaffInformation).html(staffInformation);
                } else {
                    $(formFields.otherStaffInformation).empty();
                }
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

const advanceReturn = new AdvanceReturn();
advanceReturn.init();

$(function () {
    new DynamicOption('#staffDropdownId', {
        requestedUrl: dropdownOptions.getAllStaff,
        placeholderText: 'Choose Staff'
    });

    new DynamicOption('#accountCashDropdown', {
        requestedUrl: dropdownOptions.getCashAccountDetailAll,
        placeholderText: 'Choose Account'
    });
});
