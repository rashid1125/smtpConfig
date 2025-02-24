// TableRowAppended.js

export default class TableRowAppended
{
    constructor(tableSelector, props = {}) {
        const defaultPropsTableRowAppended = {
            isUnitRate              : true,
            actionButton            : "",
            attributes              : "",
            isGatePassView          : false,
            itemInformationButton   : false,
            isDepartmentDisplay     : true,
            userCacheId             : null,
            stockKeepingMethodClass : "",
            hideElements            : "",
            is_multiplier           : 0,
            showDiscountSale        : true,
            moduleSettings          : {
                stockKeepingMethodId : null,
                showQty              : "",
                showWeight           : ""
            }, ...props
        };

        this.tableSelector      = tableSelector;
        this.props              = defaultPropsTableRowAppended;
        this.props.hideElements = this.props.isGatePassView ? "d-none" : "";
    }

    appendRow(data) {
        this.props.attributes              = "";
        this.props.stockKeepingMethodClass = "";
        const isStockKeepingMethod         = (parseFloat(data.stock_keeping_method_id) === 1);
        if (isStockKeepingMethod) {
            this.props.attributes              = "disabled";
            this.props.stockKeepingMethodClass = "disabled cursor-not-allowed";
        }
        const serial_number       = $(this.tableSelector + " tbody tr").length + 1;
        const discountColumnClass = this.props.showDiscountSale ? "" : "d-none";

        if (this.props.moduleSettings.stockKeepingMethodId === 1) {
            this.props.moduleSettings.showWeight = "d-none";
        } else if (this.props.moduleSettings.stockKeepingMethodId === 2) {
            this.props.moduleSettings.showQty = "d-none";
        }
        const row = `
      <tr data-row-id="${this.props.userCacheId}" class="odd:bg-white even:bg-slate-50">
      <td class='py-1 px-1 text-md align-middle text-left' data-title='Sr#'> ${serial_number}</td>
      <td class='py-1 px-1 text-md align-middle text-left itemName'
      data-inventory_validated='${data.item_details && data.item_details.inventory_validated ? data.item_details.inventory_validated : "0"}'
      data-item_id='${data.item_details.item_id}'
      data-short_code='${data.item_details.short_code}'
      data-stock_keeping_method_id="${data.stock_keeping_method_id}">${data.item_details.item_des}
          <span>
              <textarea class="form-control form-input-class  no-resize custom-textarea" placeholder="Enter details related to the row above...">${data.detail_remarks}</textarea>
          </span>
      </td>
      ${data.item_price_list ? `<td class='py-1 px-1 text-md align-middle text-left item_price_list_id ${data.item_price_list.hide}' data-item_price_list_id="${data.item_price_list.id}">${data.item_price_list.price_list_name}</td>` : ""}
      ${data.color_code ? `<td class='py-1 px-1 text-md align-middle text-left colorCode' data-color_code_id="${data.color_code.id}">${data.color_code.name}</td>` : ""}
      ${data.department_details ? `<td class='py-1 px-1 text-md align-middle text-left department_id ${this.props.isDepartmentDisplay ? "" : "d-none"}' data-department_id="${data.department_details.did}">${data.department_details.name}</td>` : ""}
      
      <td class='py-1 px-1 text-md align-middle text-right qty ${this.props.moduleSettings.showQty}'> ${parseNumber(data.qty).toFixed(QTY_ROUNDING)}</td>
      <td class='py-1 px-1 text-md align-middle text-right weight ${this.props.moduleSettings.showWeight}'> ${parseNumber(data.weight).toFixed(WEIGHT_ROUNDING)}</td>
      
      <td class='py-1 px-1 text-md align-middle text-right rate ${this.props.hideElements}'>
          <input type='text' class='form-control form-input-class  is_numeric text-right w-20 h-8 float-right rate' value='${parseNumber(data.rate).toFixed(RATE_ROUNDING)}'>
      </td>
      <td class='py-1 px-1 text-md align-middle rateTypeName ${this.props.hideElements}' data-rate_type_id="${data.rate_type.id}" data-is_multiplier="${data.rate_type.is_multiplier && data.rate_type.is_multiplier ? data.rate_type.is_multiplier : 0}" data-division_factor="${data.rate_type.division_factor}" data-calculation_on="${data.rate_type.calculation_on}"> ${data.rate_type.name}</td>
      <td class='py-1 px-1 text-md align-middle text-right ratePerKG ${this.props.hideElements}'>
          <input type='text' class='form-control form-input-class ${this.props.stockKeepingMethodClass}  is_numeric text-right w-20 h-8 float-right ratePerKG' value='${parseNumber(data.rate_per_kg).toFixed(4)}' ${this.props.attributes}>
      </td>
      <td class='py-1 px-1 text-md align-middle text-right gAmount ${this.props.hideElements}'> ${parseNumber(data.gross_amount).toFixed(AMOUNT_ROUNDING)}</td>
      <td class='py-1 px-1 text-md align-middle text-right discountPercentage ${this.props.hideElements} ${discountColumnClass}' data-title='Dis%'>
          <input type='text' class='form-control form-input-class  is_numeric text-right w-14 h-8 float-right discountPercentage ${discountColumnClass}' value='${parseNumber(data.discount_percentage).toFixed(2)}'>
      </td>
      <td class='py-1 px-1 text-md align-middle text-right discountPerUnit ${this.props.hideElements} ${discountColumnClass}' data-title='Discount'>
          <input type='text' class='form-control form-input-class  is_numeric text-right w-20 h-8 float-right discountPerUnit ${discountColumnClass}' value='${parseNumber(data.discount_per_unit).toFixed(4)}'>
      </td>
      <td class='py-1 px-1 text-md align-middle text-right discountAmount d-none ${discountColumnClass}'> ${parseNumber(data.discount_amount).toFixed(AMOUNT_ROUNDING)}</td>
      ${this.props.isUnitRate ? `<td class='py-1 px-1 text-md align-middle text-right ratePerUnit ${this.props.hideElements}' data-title='ratePerUnit'> ${parseNumber(data.rate_per_unit).toFixed(4)}</td>` : ""}
      <td class='py-1 px-1 text-md align-middle text-right amountExclTax ${this.props.hideElements}' data-title='amountExclTax'> ${parseNumber(data.amount_excl_tax).toFixed(AMOUNT_ROUNDING)}</td>
      <td class='py-1 px-1 text-md align-middle text-right taxPercentage ${this.props.hideElements}' data-title='taxPercentage'>
          <input type='text' class='form-control form-input-class  is_numeric text-right w-14 h-8 float-right taxPercentage' value='${parseNumber(data.tax_percentage).toFixed(2)}'>
      </td>
      <td class='py-1 px-1 text-md align-middle text-right taxAmount ${this.props.hideElements}' data-title='taxAmount'> ${parseNumber(data.tax_amount).toFixed(AMOUNT_ROUNDING)}</td>
      <td class='py-1 px-1 text-md align-middle text-right amountInclTax ${this.props.hideElements}' data-title='amountInclTax'> ${parseNumber(data.amount_incl_tax).toFixed(AMOUNT_ROUNDING)}</td>
      <td class='py-1 px-1 text-md align-middle text-right ${this.props.actionButton}'>
      <div class="btn-group">
    <button type="button" class="btn btn-sm btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-ellipsis-v"></i>
    </button>
    <div class="dropdown-menu">
        <!-- Conditional rendering of item information button -->
        ${this.props.itemInformationButton && data.item_details.inventory_validated ? `<button type="button" class="dropdown-item btnRowItemInformation">
                <i class="fa fa-info"></i> Stock Information
            </button>` : ""}
        <!-- Default edit button -->
        <button type="button" class="dropdown-item btnRowEdit">
            <i class="fa fa-edit"></i> Edit
        </button>
        <!-- Remove button -->
        <button type="button" class="dropdown-item btnRowRemove">
            <i class="fa fa-trash-alt"></i> Remove
        </button>
    </div>
</div>
      </td>
  </tr>`;

        $(row).appendTo(this.tableSelector);
        this.updateSerialNumbers();
    }

    updateSerialNumbers() {
        // Assuming you want to update serial numbers after adding a row
        $(this.tableSelector + " tbody tr").each((index, tr) => {
            $(tr).find("td").first().text(index + 1);
        });
    }
}
