import AlertComponent from "../../../../js/components/AlertComponent.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";
import { dropdownOptions, customerDiscountIssuanceApi } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText, ifNull, parseNumber } from "../commonFunctions/CommonFunction.js";
import { validPercentage } from "../../../../js/components/Helpers.js";
class CustomerDiscountIssuance {
    constructor(props = {}) {
        this.customerDataTable;
        this.props = props;
        this.bindUIActions();
        this.initDynamicOptions();
    }

    initDynamicOptions() {
        // Initialize any other components or dynamic options here
        new DynamicOption('#customerDropdown', {
            requestedUrl: dropdownOptions.getAllCustomerLevelAccount,
            placeholderText: 'Choose Customer'
        });
        $('[data-toggle="tooltip"]').tooltip();
        $('.select2').select2();
    }

    bindUIActions() {
        $('#searchButton').on('click', async (e) => {
            e.preventDefault();
            const customerId = $('#customerDropdown').val();
            await this.getItemFinishCategoryDetail(customerId);
        });
        $('#saveButton').on('click', (e) => {
            e.preventDefault();
            this.initSave();
        });
        $('#resetButton').on('click', (e) => {
            e.preventDefault();
            this.resetVoucher();
        });
        shortcut.add("F10", function () {
            $('#saveButton').get()[0].click();
        });
        shortcut.add("F5", function () {
            $('#resetButton').get()[0].click();
        });
        $('#customerDataTable').on('input', 'tr input.discountPercentage', function (event) {
            event.preventDefault();
            const value = parseNumber($(this).val());
            validPercentage(value, event.target)
        });
    }

    // Implement the rest of your methods here
    async getItemFinishCategoryDetail(customerId) {

        if (typeof this.customerDataTable != 'undefined') {
            this.customerDataTable.fnDestroy();
            $('#customerDataTableTbody').empty();
        }

        const response = await makeAjaxRequest('GET', `${customerDiscountIssuanceApi.getItemFinishCategoryDetail}`, {
            customerId: customerId
        });

        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: 'danger' });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: 'Warning', message: response.message, type: 'warning' });
        } else {
            this.populateItemFinishCategoryDetail(response.data);
            this.itemFinishCategoryDetailDataTable();
        }
    }

    populateItemFinishCategoryDetail(data) {
        data.forEach((element) => {
            // Using an arrow function to maintain the correct 'this' context
            const rowHtml = this.appendRow(element.item_id, element.item_des, element.discount_percentage);
            // Assuming you want to append this row to a table with a specific ID
            $('#customerDataTableTbody').append(rowHtml);
        });
        this.updateSerialNumbers('customerDataTable');
    }

    updateSerialNumbers(customerDataTable) {
        $(`#${customerDataTable} tbody tr`).each((index, tr) => {
            $(tr).find('td').first().text(index + 1);
        });
    }

    appendRow(itemId, itemName, discount_percentage) {
        return `<tr class="odd:bg-white even:bg-slate-50">
            <td></td>
            <td class="py-1 px-1 text-md align-middle text-left itemName" data-item-id="${itemId}">${ifNull(itemName, "")}</td>
            <td class="py- px-1 text-md align-middle text-right discountPercentage"><input type="number" class="form-control form-input-class is_numeric text-right w-20 h-8 float-right discountPercentage"  value="${(discount_percentage)}" min="0" max="100" step="0.01"/></td>
          </tr>`;
    }

    displayError(selector, message) {
        AlertComponent.getAlertMessage({ title: 'Error', message: message, type: 'danger' });
        $(selector).addClass('inputerror').focus();
    };

    validateSave() {
        var errorFlag = false;
        const customerDropdown = $('#customerDropdown').val() || 0;
        const customerDetailBySaleOfficer = $('#customerDataTableTbody tr');
        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (!customerDropdown || customerDropdown === '') {
            this.displayError('#customerDropdown', 'Please select a Customer');
            $('#select2-customerDropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }


        if (parseNumber(customerDetailBySaleOfficer.length) === 0) {
            AlertComponent.getAlertMessage({ title: 'Error', message: 'No Data to save  in this table.', type: 'danger' });
            errorFlag = true;
        }

        return errorFlag;
    }

    getSaveObject() {
        const main = {
            customer_id: $('#customerDropdown').val(),
        }
        const detail = [];
        const dataTable = $('#customerDataTable').DataTable();

        dataTable.rows().every(function () {
            var row = $(this.node());
            const itemId = row.find('td.itemName').data('item-id');
            const discountPercentage = parseFloat(row.find('td.discountPercentage input').val()) || 0;
            const details = {
                customer_id: main.customer_id,
                item_id: itemId,
                discount_percentage: discountPercentage
            };

            if (parseNumber(discountPercentage) > 0) {
                detail.push(details);
            }
        });
        return {
            customerDiscountIssuance: main,
            customerDiscountIssuanceDetail: detail,
        };
    }

    async save(discountIssuance) {
        try {
            // Ensure runException is correctly implemented to handle async operations
            const response = await makeAjaxRequest('POST', customerDiscountIssuanceApi.save, {
                'customerDiscountIssuance': JSON.stringify(discountIssuance.customerDiscountIssuance),
                'customerDiscountIssuanceDetail': JSON.stringify(discountIssuance.customerDiscountIssuanceDetail),
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

    resetVoucher() {
        this.resetField();
    }
    resetField = () => {
        if (typeof this.customerDataTable != 'undefined') {
            this.customerDataTable.fnDestroy();
            $('#customerDataTableTbody').empty();
        }
        const resetArray = [
            'customerDropdown'
        ];
        clearValueAndText(resetArray, '#');
        $('#saleCommissionFilterDiv').removeClass('d-none');
    };

    itemFinishCategoryDetailDataTable() {
        this.customerDataTable = $('#customerDataTable').dataTable({
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
    const customerDiscountIssuance = new CustomerDiscountIssuance();
});