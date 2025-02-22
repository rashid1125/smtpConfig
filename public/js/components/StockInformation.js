import { parseNumber } from "../../assets/js/app_modules/commonFunctions/CommonFunction.js";
import AlertComponent from "./AlertComponent.js";
import { QTY_ROUNDING, WEIGHT_ROUNDING } from "./GlobalConstants.js";
import { makeAjaxRequest } from "./MakeAjaxRequest.js";

/**
 * Manages the retrieval and display of stock information.
 */
export class StockInformation {
    /**
     * Creates an instance of the StockInformation class.
     *
     * @param {number} stockKeepingMethodId The ID indicating the method of stock keeping.
     * @param {Object} options Additional properties to configure the class.
     * @param {string} [options.isSale="false"] - The isSale false
     * @param {string} [options.stockKeepingMethodId]
     * @param {string} [options.voucherType]
     * @param {number} [options.voucherId]
     */
    constructor(stockKeepingMethodId, options = {}) {
        this.base_url = options.base_url; // Ensure base_url is included in props
        this.stockKeepingMethodId = stockKeepingMethodId;
        this.options = { isSale: false, ...options }
    }

    /**
     * Fetches stock information based on provided criteria and updates the UI accordingly.
     *
     * @param {number} itemId The ID of the item to fetch stock information for.
     * @param {string} currentDate The current date used to filter stock information.
     */
    async getStockInformation(itemId, currentDate, voucherNumber) {
        $("#stockInformationTbody").empty();
        const response = await makeAjaxRequest('GET', `stock/getStockInformation`, {
            itemId,
            currentDate,
            voucherType: this.options.voucherType,
            voucherId: this.options.voucherId,
        });

        if (response.status == false) {
            this._getAlertMessage("Error!", response.message, "danger");
        } else {
            this.appendToStockInformationTable(response.data);
        }
    }

    /**
     * Appends stock information to the table in the UI.
     *
     * @param {Array} stockData An array of stock data objects to be displayed.
     */
    appendToStockInformationTable(stockData) {
        let previousWarehouseName = '';
        let previousWarehouseNameMatch = '';

        const self = this;
        stockData.forEach(data => {
            let row = "";
            const colSpan = self.options.isSale ? `colspan="3"` : `colspan="2"`;
            previousWarehouseNameMatch = data.warehouseName;
            if (previousWarehouseNameMatch !== previousWarehouseName) {
                // Create a new row for the warehouse name header
                row += `<tr class='group item-row-td hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50'><td class='py-1 px-1 text-md align-middle font-weight-bold warehouseRow' ${colSpan}>${previousWarehouseNameMatch}</td></tr>`;
                previousWarehouseName = previousWarehouseNameMatch;
            }
            row += `
            <tr class="group item-row-td hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50">
                <td class="text-left py-1 px-1 text-md align-middle">${data.colorCodeName}</td>
                <td class="text-right py-1 px-1 text-md align-middle">${parseFloat(data.total_qty).toFixed(QTY_ROUNDING)}</td>
                <td class="text-right py-1 px-1 text-md align-middle">${parseFloat(data.total_weight).toFixed(WEIGHT_ROUNDING)}</td>
		    </tr>`;
            $(row).appendTo('#stockInformationTable');
        });
    }


    /**
     * Displays an alert message using the AlertComponent.
     *
     * @param {string} title The title of the alert message.
     * @param {string} message The content of the alert message.
     * @param {string} type The type of the alert (e.g., 'danger', 'warning').
     */
    _getAlertMessage(title, message, type) {
        AlertComponent.getAlertMessage({ title, message, type });
    }
}
