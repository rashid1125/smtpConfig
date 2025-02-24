import AlertComponent from "./AlertComponent.js";
import { makeAjaxRequest } from "./MakeAjaxRequest.js";
export class InventoryManager {
    constructor(options = {}, props = {}) {
        // Initialize properties if needed
        this.props = { voucherType: "", ...options };
    }

    async inventoryValidated(itemId, stockKeepingMethodId, colorCodeId, departmentId, qty, weight, currentDate) {
        try {
            const response = await makeAjaxRequest('GET', `stock/getInventoryValidated`, {
                itemId,
                stockKeepingMethodId,
                colorCodeId,
                departmentId,
                qty,
                weight,
                currentDate,
                // Make sure to correctly pass these properties to the API
                voucherType: this.props.voucherType,
                voucherId: this.props.voucherId,
                deliveryChallanId: this.props.deliveryChallanId
            });

            if (response && response.status === false) {
                this._getAlertMessage("Error!", response.message, "danger");
                return false; // Indicate failure
            }

            if (response && response.status) {
                return true;
            }

        } catch (error) {
            this._getAlertMessage("Error!", error.message || "An unexpected error occurred", "danger");
            return false; // Indicate failure
        }
    }


    _getAlertMessage(title, message, type) {
        AlertComponent.getAlertMessage({ title, message, type });

    }
}
