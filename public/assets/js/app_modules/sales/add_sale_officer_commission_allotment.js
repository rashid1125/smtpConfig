import AlertComponent from "../../../../js/components/AlertComponent.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions, saleOfficerCommissionApi } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText, ifNull, parseNumber } from "../commonFunctions/CommonFunction.js";
import { validPercentage } from "../../../../js/components/Helpers.js";
class SaleOfficerCommissionAllotment {
    constructor(props = {}) {
        this.onSearchSaleCommissionDataTable;
        this.saleCommissionDataTable;
        this.props = props;
        this.bindUIActions();
        this.initDynamicOptions();
    }

    initDynamicOptions() {
        // Initialize any other components or dynamic options here
        new DynamicOption(this.props.saleOfficerCommissionDropdown, {
            requestedUrl: dropdownOptions.getAllOfficerByDesignation,
            placeholderText: 'Choose Sale Man',
            designation: 'Sales Officer'
        });
        $('[data-toggle="tooltip"]').tooltip();
        $('.select2').select2();
    }

    bindUIActions() {
        $(this.props.saleOfficerCommissionSearchButton).on('click', async (e) => {
            e.preventDefault();
            const saleOfficerId = $(this.props.saleOfficerCommissionDropdown).val();
            await this.getCustomerDetailBySaleOfficerId(saleOfficerId);
        });
        $(this.props.saveButton).on('click', (e) => {
            e.preventDefault();
            this.initSave();
        });
        $(this.props.resetButton).on('click', (e) => {
            e.preventDefault();
            this.resetVoucher();
        });

        shortcut.add("F10", function () {
            $('#saveButton').get()[0].click();
        });
        shortcut.add("F5", function () {
            $('#resetButton').get()[0].click();
        });

        $('#customerDetailBySaleOfficer').on('input', 'tr input.saleCommissionPercentage,tr input.recoveryCommissionPercentage', function (event) {
            event.preventDefault();
            const value = parseNumber($(this).val());
            validPercentage(value, event.target)
        });
        $(document.body).on('click', '.btn-edit-commission-percentage', async (e) => {
            e.preventDefault();
            const id = $(e.currentTarget).data('id');
            await this.getSaleCommissionById(id);
        });
    }

    // Implement the rest of your methods here
    async getCustomerDetailBySaleOfficerId(saleOfficerId) {

        if (typeof this.onSearchSaleCommissionDataTable != 'undefined') {
            this.onSearchSaleCommissionDataTable.fnDestroy();
            $('#customerDetailBySaleOfficerTbody').empty();
        }

        const response = await makeAjaxRequest('GET', `${saleOfficerCommissionApi.getCustomerDetailBySaleOfficerId}`, {
            saleOfficerId: saleOfficerId
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: 'danger' });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: 'Warning', message: response.message, type: 'warning' });
        } else {
            this.populateSaleOfficerCommissionData(response.data);
            this.customerDetailBySaleOfficerDataTable();
        }
    }

    populateSaleOfficerCommissionData(data) {
        data.forEach((element) => {
            // Using an arrow function to maintain the correct 'this' context
            const rowHtml = this.appendRow(element.pid, element.name, element.sale_commission_percentage, element.recovery_commission_percentage);
            // Assuming you want to append this row to a table with a specific ID
            $('#customerDetailBySaleOfficer tbody').append(rowHtml);
        });
        this.updateSerialNumbers('customerDetailBySaleOfficer');
    }

    updateSerialNumbers(customerDetailBySaleOfficer) {
        $(`#${customerDetailBySaleOfficer} tbody tr`).each((index, tr) => {
            $(tr).find('td').first().text(index + 1);
        });
    }

    appendRow(customerId, customerName, saleCommissionPercentage, recoveryCommissionPercentage) {
        return `<tr class="odd:bg-white even:bg-slate-50">
            <td></td>
            <td class="py-1 px-1 text-md align-middle text-left customerName" data-customer-id="${customerId}">${ifNull(customerName, "")}</td>
            <td class="py- px-1 text-md align-middle text-right saleCommissionPercentage"><input type="number" class="form-control form-input-class is_numeric text-right w-20 h-8 float-right saleCommissionPercentage"  value="${(saleCommissionPercentage)}" min="0" max="100" step="0.01"/></td>
            <td class="py- px-1 text-md align-middle text-right recoveryCommissionPercentage"><input type="number" class="form-control form-input-class is_numeric text-right w-20 h-8 float-right recoveryCommissionPercentage"  value="${(recoveryCommissionPercentage)}" min="0" max="100" step="0.01"/></td>
          </tr>`;
    }

    displayError(selector, message) {
        AlertComponent.getAlertMessage({ title: 'Error', message: message, type: 'danger' });
        $(selector).addClass('inputerror').focus();
    };

    validateSave() {
        var errorFlag = false;
        const officerAccountDropdown = $('#saleOfficerCommissionDropdown').val() || 0;
        const customerDetailBySaleOfficer = $('#customerDetailBySaleOfficer tbody tr');
        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!officerAccountDropdown || officerAccountDropdown === '') {
            this.displayError('#saleOfficerCommissionDropdown', 'Please select an sale main');
            $('#select2-saleOfficerCommissionDropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }

        if (parseNumber(customerDetailBySaleOfficer.length) == 0) {
            this.displayError('#saleOfficerCommissionDropdown', 'No Data to save  in this table.');
            errorFlag = true;
        }

        return errorFlag;
    }

    getSaveObject() {
        const main = {
            sale_officer_id: $(this.props.saleOfficerCommissionDropdown).val(),
        }
        const detail = [];
        const dataTable = $('#customerDetailBySaleOfficer').DataTable();

        // Use .rows().count() to get the number of rows in the table
        if (dataTable.rows().count() == 0) {
            AlertComponent.getAlertMessage({
                title: "No Records Found",
                message: "There are no records in the table to save. Please add some data before trying to save again.",
                type: "warning"
            });
            return false;
        }

        dataTable.rows().every(function () {
            var row = $(this.node());
            const customerId = row.find('td.customerName').data('customer-id');
            const saleCommissionPercentage = parseFloat(row.find('td.saleCommissionPercentage input').val()) || 0;
            const recoveryCommissionPercentage = parseFloat(row.find('td.recoveryCommissionPercentage input').val()) || 0;
            const details = {
                sale_officer_id: main.sale_officer_id,
                customer_id: customerId,
                sale_commission_percentage: saleCommissionPercentage,
                recovery_commission_percentage: recoveryCommissionPercentage,
            };
            
            if (parseNumber(saleCommissionPercentage) > 0) {
                detail.push(details);
            }
        });
        return {
            saleOfficerCommission: main,
            saleOfficerCommissionDetail: detail,
        };
    }

    async save(commission) {
        try {
            // Ensure runException is correctly implemented to handle async operations
            const response = await makeAjaxRequest('POST', saleOfficerCommissionApi.save, {
                'saleOfficerCommission': JSON.stringify(commission.saleOfficerCommission),
                'saleOfficerCommissionDetail': JSON.stringify(commission.saleOfficerCommissionDetail),
            });

            // Assuming response handling is done within runException if it catches errors,
            // otherwise, check response here
            if (response && response.status === false) {
                const messageType = response.error !== "" ? 'danger' : 'warning';
                AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: messageType });
            } else {
                // Assuming successful response handling
                AlertComponent.getAlertMessage({ title: 'Successfully', message: response.message, type: 'success' });
                this.resetVoucher();
            }
        } catch (error) {
            console.error('Error saving commission:', error);
            // Handle unexpected errors
            AlertComponent.getAlertMessage({ title: 'Error', message: 'An unexpected error occurred.', type: 'danger', placement: { from: "left", align: "center" } });
        }
    }

    async getSaleCommissionById(saleCommissionId) {
        const response = await makeAjaxRequest('GET', `${saleOfficerCommissionApi.getSaleCommissionById}`, {
            saleCommissionId: saleCommissionId
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: 'danger' });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: 'Warning', message: response.message, type: 'warning' });
        } else {
            this.populateSaleOfficerCommissionData(response.data);
            this.customerDetailBySaleOfficerDataTable();
        }
    }

    resetVoucher() {
        this.resetField();
    }

    resetField = () => {
        if (typeof this.onSearchSaleCommissionDataTable != 'undefined') {
            this.onSearchSaleCommissionDataTable.fnDestroy();
            $('#customerDetailBySaleOfficerTbody').empty();
        }
        const resetArray = [
            'saleCommissionId',
            'saleOfficerCommissionDropdown'
        ];
        clearValueAndText(resetArray, '#');
        $('#saleCommissionFilterDiv').removeClass('d-none');
    };

    customerDetailBySaleOfficerDataTable() {
        this.onSearchSaleCommissionDataTable = $('#customerDetailBySaleOfficer').dataTable({
            'autoWidth': false,
            'response': true
        });
    }

    initSave() {
        if (this.validateSave()) {
            return;
        }

        if (this.getSaveObject()) {
            this.save((this.getSaveObject()));
        }

    }
}

// Initialization with jQuery selectors as properties
$(document).ready(() => {
    const saleOfficerCommissionAllotment = new SaleOfficerCommissionAllotment({
        saleOfficerCommissionDropdown: '#saleOfficerCommissionDropdown',
        saleOfficerCommissionSearchButton: '#saleOfficerCommissionSearchButton',
        saveButton: '#saveButton',
        resetButton: '#resetButton',
    });
});