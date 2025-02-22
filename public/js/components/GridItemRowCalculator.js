import BaseClass from "./BaseClass.js";
import { validPercentage } from "./Helpers.js";
import { isPositive } from "../../assets/js/app_modules/commonFunctions/CommonFunction.js";
import { calculateTaxPercentageGridItemRow } from "./calculations/calculateTaxPercentageGridItemRow.js";
import { calculateTaxAmountGridItemRow } from "./calculations/calculateTaxAmountGridItemRow.js";
import { calculateRatePerUnitGridItemRow } from "./calculations/calculateRatePerUnitGridItemRow.js";
import { calculateRatePerKgGridItemRow } from "./calculations/calculateRatePerKgGridItemRow.js";
import { calculateRateGridItemRow } from "./calculations/calculateRateGridItemRow.js";
import { calculateGrossAmountGridItemRow } from "./calculations/calculateGrossAmountGridItemRow.js";
import { calculateDiscountPerUnitGridItemRow } from "./calculations/calculateDiscountPerUnitGridItemRow.js";
import { calculateDiscountPercentageGridItemRow } from "./calculations/calculateDiscountPercentageGridItemRow.js";
import { calculateDiscountAmountGridItemRow } from "./calculations/calculateDiscountAmountGridItemRow.js";
import { calculateAmountInclTaxGridItemRow } from "./calculations/calculateAmountInclTaxGridItemRow.js";
import { calculateAmountExclTaxGridItemRow } from "./calculations/calculateAmountExclTaxGridItemRow.js";

const baseInstance = new BaseClass();
export default class GridItemRowCalculator {

    constructor(rowElement, moduleSettings, props = {}) {
        this.rowElement = rowElement;
        this.moduleSettings = moduleSettings;
        this.props = props;
    }

    getSpecificClass(classString, specificClass) {
        const classes = classString.split(' ');
        return classes.find(cls => cls === specificClass) || null; // Find the specific class
    }

    getValueFromElement(selector, dataAttr = null, isDataAttr = false) {
        const element = this.rowElement.find(selector);

        if (element.is('input, select, textarea')) {
            return element.val();
        } else if (isDataAttr && dataAttr) {
            return element.data(dataAttr);
        } else {
            return element.text();
        }
    }
    /**
     * Calculates various financial metrics based on user input.
     * This function is primarily used within the sales module. The 'calculation_on' attribute
     * is specific to the sales module and dictates the calculation method.
     * If 'calculation_on' is undefined, it falls back to using 'stock_keeping_method_id'.
     *
     * @param {Event} event - The event that triggered this calculation.
     */
    calculate(event) {
        baseInstance.runException(() => {
            const gridRate = this.getValueFromElement('td.rate input') || 0;
            // Attempt to retrieve 'calculation_on' value. If undefined, fall back to 'stock_keeping_method_id'
            const calculationOnValue = this.getValueFromElement('td.rateTypeName', 'calculation_on', true);
            const gridStockKeepingMethodId = calculationOnValue !== undefined ? calculationOnValue : this.getValueFromElement('td.itemName', 'stock_keeping_method_id', true);
            const gridQty = parseFloat(this.getValueFromElement('td.qty')) || 0;
            const gridWeight = parseFloat(this.getValueFromElement('td.weight')) || 0;
            const gridDivisionFactor = this.getValueFromElement('td.rateTypeName', 'division_factor', true);
            const rateTypeIsMultiplier = this.getValueFromElement('td.rateTypeName', 'is_multiplier', true);
            const divisionFactor = {
                factor: parseNumber(gridDivisionFactor) ? parseNumber(gridDivisionFactor) : 1,
                is_multiplier: rateTypeIsMultiplier
            }
            const eventInputClass = event.target.getAttribute('class');
            const gridCalculatedRate = this.handleRateChange(eventInputClass, gridRate, divisionFactor, gridStockKeepingMethodId);
            const grossAmount = this.handleGrossAmountCalculation(gridCalculatedRate, gridQty, gridWeight, divisionFactor, gridStockKeepingMethodId);
            const discountPerUnit = this.handleDiscountCalculations(eventInputClass, gridCalculatedRate, grossAmount, divisionFactor, gridStockKeepingMethodId, event);
            this.handleTaxCalculations(eventInputClass, gridCalculatedRate, gridQty, gridWeight, discountPerUnit, divisionFactor, gridStockKeepingMethodId, event);
            this.calculateVoucherLowerTotal();
        });
        this.triggerInputEvents();
    }

    handleRateChange(eventInputClass, rate, divisionFactor, stockKeepingMethodId) {
        if (this.getSpecificClass(eventInputClass, 'rate')) {
            const ratePerKg = calculateRatePerKgGridItemRow(rate, divisionFactor, stockKeepingMethodId);
            this.rowElement.find('td.ratePerKG input').val(parseNumber(ratePerKg).toFixed(4));
        } else if (this.getSpecificClass(eventInputClass, 'ratePerKG')) {
            const gridItemRatePerKG = this.rowElement.find('td.ratePerKG input');
            const calculatedRate = calculateRateGridItemRow(gridItemRatePerKG.val(), divisionFactor, stockKeepingMethodId);
            this.rowElement.find('td.rate input').val(parseNumber(calculatedRate).toFixed(RATE_ROUNDING));
            rate = calculatedRate;
        } else {
            const ratePerKg = calculateRatePerKgGridItemRow(rate, divisionFactor, stockKeepingMethodId);
            this.rowElement.find('td.ratePerKG input').val(parseNumber(ratePerKg).toFixed(4));
        }
        return parseNumber(rate);
    }

    handleGrossAmountCalculation(rate, qty, weight, divisionFactor, stockKeepingMethodId) {
        const grossAmount = calculateGrossAmountGridItemRow(rate, qty, weight, divisionFactor, stockKeepingMethodId);
        this.rowElement.find('td.gAmount').text(parseNumber(grossAmount).toFixed(AMOUNT_ROUNDING));
        return grossAmount;
    }

    handleDiscountCalculations(eventInputClass, rate, grossAmount, divisionFactor, stockKeepingMethodId, event) {
        let discountPercentage = parseFloat(this.rowElement.find('td.discountPercentage input').val()) || 0;
        let discountPerUnit = parseFloat(this.rowElement.find('td.discountPerUnit input').val()) || 0;

        if (this.getSpecificClass(eventInputClass, 'discountPercentage')) {
            discountPercentage = validPercentage(discountPercentage, event.target);
            discountPerUnit = calculateDiscountPerUnitGridItemRow(discountPercentage, rate);
            this.rowElement.find('td.discountPerUnit input').val(discountPerUnit.toFixed(4));
        } else if (this.getSpecificClass(eventInputClass, 'discountPerUnit')) {
            discountPercentage = validPercentage(calculateDiscountPercentageGridItemRow(discountPerUnit, rate), event.target);
            this.rowElement.find('td.discountPercentage input').val(discountPercentage.toFixed(2));
            if (parseNumber(discountPercentage) == 0) {
                discountPerUnit = 0;
            }
        } else {
            discountPerUnit = calculateDiscountPerUnitGridItemRow(discountPercentage, rate);
            this.rowElement.find('td.discountPerUnit input').val(discountPerUnit.toFixed(4));
        }
        const discountAmount = calculateDiscountAmountGridItemRow(grossAmount, discountPercentage);
        const ratePerUnit = calculateRatePerUnitGridItemRow(rate, discountPerUnit, divisionFactor, stockKeepingMethodId);
        this.rowElement.find('td.ratePerUnit').text(ratePerUnit.toFixed(4));
        return discountPerUnit;
    }

    handleTaxCalculations(eventInputClass, rate, qty, weight, discountPerUnit, divisionFactor, stockKeepingMethodId, event) {
        const amountExclTax = calculateAmountExclTaxGridItemRow(rate, qty, weight, divisionFactor, stockKeepingMethodId, discountPerUnit);
        this.rowElement.find('td.amountExclTax').text(amountExclTax.toFixed(AMOUNT_ROUNDING));

        let taxPercentage = validPercentage(parseFloat(this.rowElement.find('td.taxPercentage input').val()), event.target) || 0;
        let taxAmount = parseFloat(this.rowElement.find('td.taxAmount').text()) || 0;

        if (this.getSpecificClass(eventInputClass, 'taxPercentage')) {
            taxAmount = calculateTaxAmountGridItemRow(amountExclTax, taxPercentage);
            this.rowElement.find('td.taxAmount').text(taxAmount.toFixed(AMOUNT_ROUNDING));
        } else if (this.getSpecificClass(eventInputClass, 'taxAmount')) {
            taxPercentage = calculateTaxPercentageGridItemRow(amountExclTax, taxAmount);
            this.rowElement.find('td.taxPercentage input').val(taxPercentage.toFixed(2));
        } else {
            taxAmount = calculateTaxAmountGridItemRow(amountExclTax, taxPercentage);
            this.rowElement.find('td.taxAmount').text(taxAmount.toFixed(AMOUNT_ROUNDING));
        }

        const amountInclTax = calculateAmountInclTaxGridItemRow(amountExclTax, taxAmount);
        this.rowElement.find('td.amountInclTax').text(amountInclTax.toFixed(AMOUNT_ROUNDING));
    }

    triggerInputEvents() {
        $('#saleCommissionPercentage').trigger('input');
        $('#txtDiscount').trigger('input');
        $('#txtExpense').trigger('input');
        $('#txtTax').trigger('input');
    }

    calculateVoucherLowerTotal() {
        baseInstance.runException(() => {

            let gridItemTotalQty = 0;
            let gridItemTotalWeight = 0;
            let gridItemTotalGrossAmount = 0;
            let gridItemTotalDiscountAmount = 0;
            let gridItemTotalAmountExclTax = 0;
            let gridItemTotalTaxAmount = 0;
            let gridItemTotalAmountInclTax = 0;

            $("#purchase_table").find("tbody tr").each(function (index, elem) {
                gridItemTotalQty += getNumText($(this).closest('tr').find('td.qty'));
                gridItemTotalWeight += getNumText($(this).closest('tr').find('td.weight'));
                gridItemTotalGrossAmount += getNumText($(this).closest('tr').find('td.gAmount'));
                gridItemTotalDiscountAmount += getNumText($(this).closest('tr').find('td.discountAmount'));
                gridItemTotalAmountExclTax += getNumText($(this).closest('tr').find('td.amountExclTax'));
                gridItemTotalTaxAmount += getNumText($(this).closest('tr').find('td.taxAmount'));
                gridItemTotalAmountInclTax += getNumText($(this).closest('tr').find('td.amountInclTax'));
            });

            $('.gridItemTotalQty').text(parseNumber(gridItemTotalQty).toFixed(QTY_ROUNDING));
            $('.gridItemTotalWeight').text(parseNumber(gridItemTotalWeight).toFixed(WEIGHT_ROUNDING));
            $('.gridItemTotalGrossAmount').text(parseNumber(gridItemTotalGrossAmount).toFixed(AMOUNT_ROUNDING));
            $('.gridItemTotalAmountExclTax').text(parseNumber(gridItemTotalAmountExclTax).toFixed(AMOUNT_ROUNDING));
            $('.gridItemTotalTaxAmount').text(parseNumber(gridItemTotalTaxAmount).toFixed(AMOUNT_ROUNDING));
            $('.gridItemTotalAmountInclTax').text(parseNumber(gridItemTotalAmountInclTax).toFixed(AMOUNT_ROUNDING));

            this.triggerInputEvents();

            var _DiscAmount = getNumVal($('#txtDiscAmount'));
            var _ExpenseAmount = getNumVal($('#txtExpAmount'));
            var _TaxAmount = getNumVal($('#txtTaxAmount'));

            const netAmount = parseFloat(gridItemTotalAmountInclTax) - parseFloat(_DiscAmount) + parseFloat(_ExpenseAmount) + parseFloat(_TaxAmount);
            $('#txtNetAmount').val(isPositive(getSettingDecimal(netAmount), 'txtNetAmount'));
        });
    }
}
