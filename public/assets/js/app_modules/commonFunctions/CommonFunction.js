// public/assets/js/app_modules/commonfunctions/commonfunction.js
"use strict";

import AlertComponent          from "../../../../js/components/AlertComponent.js";
import BaseClass               from "../../../../js/components/BaseClass.js";
import { makeAjaxRequest }     from "../../../../js/components/MakeAjaxRequest.js";
import { calculateAmount }     from "../../../../js/components/calculations/calculateAmount.js";
import { calculatePercentage } from "../../../../js/components/calculations/calculatePercentage.js";

const baseInstance = new BaseClass();

/**
 * Sets the value for a Select2 element and optionally triggers a change event or disables it.
 * @param {string} elementById - The ID of the Select2 element.
 * @param {*} value - The value to be set on the Select2 element.
 * @param {boolean} [triggerChange=false] - Whether to trigger a 'change' event.
 * @param {boolean} [disabled=false] - Whether to disable the Select2 element.
 */
function populateSelect2Data(elementById, value, triggerChange = false, disabled = false) {
    // Check if the given elementById exists in the DOM
    const element = $(`#${elementById}`);
    if (! element.length) {
        console.warn(`Element with ID ${elementById} not found.`);
        return;
    }

    // Set the value for the Select2 element
    element.val(value).trigger("change.select2");

    if (triggerChange) {
        element.trigger("change");
    }
    // Enable or disable the Select2 element
    element.prop("disabled", disabled);
}

/**
 * Appends a new option to a Select2 element, sets its value, and optionally triggers change events or disables it.
 * @param {string} elementById - The ID of the Select2 element.
 * @param {*} value - The value of the new option to be appended.
 * @param {string} text - The display text of the new option.
 * @param {boolean} [checkOptionExist=false] - If true, it doesn't clear existing options.
 * @param {boolean} [triggerChange=false] - Whether to trigger a 'change' event.
 * @param {boolean} [disabled=false] - Whether to disable the Select2 element.
 */
function appendOptionAndSetSelect2Value(elementById, value, text, select2Props) {
    // Clear existing options if checkOptionExist is false
    if (! select2Props.checkOptionExist) {
        $(`#${elementById}`).empty();
    }

    // Create and append the option
    var option = new Option(text, value, true, true);

    if (select2Props.includeDataAttributes && select2Props.dataAttributes) {
        $.each(select2Props.dataAttrs, (key, value) => {
            option.setAttribute(`data-${key}`, value);
        });
    }

    $(`#${elementById}`).append(option);
    // Call populateSelect2Data to handle value setting, change triggering, and disabling
    populateSelect2Data(elementById, value, select2Props.triggerChange, select2Props.disabled);
}

/**
 * Dynamically appends a value to a Select2 dropdown if a specific nested property exists within a data object.
 *
 * @param {string} dropdownId - The ID of the Select2 dropdown element to append the value to.
 * @param {string} nestedPropertyPath - A dot-separated string representing the path to the nested property within the data object.
 * @param {string} idFieldKey - The key name for the 'id' field in the target object.
 * @param {string} nameFieldKey - The key name for the 'name' field in the target object.
 * @param {Object} props - The configuration options for the alert message.
 * @param {boolean} [props.includeDataAttributes=false]
 * @param {boolean} [props.checkOptionExist=false]
 * @param {boolean} [props.triggerChange=false]
 * @param {boolean} [props.disabled=false]
 *
 * This function navigates through the nested properties of the provided source data object based on the nestedPropertyPath.
 * If the nested property exists and contains the fields specified by idFieldKey and nameFieldKey,
 * it will append these as a new option to the specified Select2 dropdown.
 */
function appendSelect2ValueIfDataExists(dropdownId, nestedPropertyPath, idFieldKey, nameFieldKey, sourceDataObject, props = {}) {
    const settingOptions = {
        includeDataAttributes : false,
        checkOptionExist      : false,
        triggerChange         : false,
        disabled              : false, ...props
    };
    // Determine if nestedPropertyPath is provided and valid
    let targetNestedProperty;
    if (nestedPropertyPath && typeof nestedPropertyPath === "string") {
        let pathSegments     = nestedPropertyPath.split(".");
        targetNestedProperty = sourceDataObject;

        for (let segment of pathSegments) {
            if (targetNestedProperty[segment] === undefined) {
                console.warn(`The specified property does not exist in the data path, exit the function. ${dropdownId}`);
                return;
            }
            targetNestedProperty = targetNestedProperty[segment];
        }
    } else {
        targetNestedProperty = sourceDataObject;
    }

    // Check if targetNestedProperty has the required keys
    if (targetNestedProperty && targetNestedProperty[idFieldKey] !== undefined && targetNestedProperty[nameFieldKey] !== undefined) {
        let dataAttrs = {};
        if (settingOptions.includeDataAttributes && settingOptions.dataAttributes) {
            // Map data attributes from allowableDataAttributes
            for (let [key, value] of Object.entries(settingOptions.dataAttributes)) {
                dataAttrs[key] = targetNestedProperty[value];
            }
            settingOptions.dataAttrs = dataAttrs;
        }

        appendOptionAndSetSelect2Value(dropdownId, targetNestedProperty[idFieldKey], targetNestedProperty[nameFieldKey], settingOptions);
    }
}

function resetSelect2Option(dropdownId) {
    $(`#${dropdownId}`).val("").trigger("change.select2");
}

function clearValueAndText(selectors, prefix = "", options = {}) {
    try {
        const defaults = {
            checked   : false,
            disabled  : false,
            resetDate : new Date(),
            trigger   : ""
        };
        const settings = { ...defaults, ...options };

        // Ensure selectors is always an array
        if (typeof selectors === "string") {
            selectors = selectors.split(",").map(selector => prefix + selector.trim());
        } else if (Array.isArray(selectors)) {
            selectors = selectors.map(selector => {
                if (typeof selector === "string") {
                    return prefix + selector.trim(); // Trim only if it's a string
                }
                return selector; // Keep it as is if it's an object
            });
        } else {
            throw new Error("Invalid selectors type. Selectors should be a string or an array.");
        }

        selectors.forEach(selector => {
            let elements,
                selectorWithoutPrefix;

            if (typeof selector === "string") {
                if (selector.startsWith(".")) {
                    // Handle class-based selector
                    selectorWithoutPrefix = selector.substring(1);
                    elements              = document.querySelectorAll(selector);
                } else {
                    selectorWithoutPrefix = selector;
                    elements              = document.getElementById(selectorWithoutPrefix.startsWith("#") ? selectorWithoutPrefix.substring(1) : selectorWithoutPrefix);
                }
            } else if (typeof selector === "object" && selector !== null) {
                selectorWithoutPrefix = selector.selector;
                elements              = document.getElementById(selectorWithoutPrefix.startsWith("#") ? selectorWithoutPrefix.substring(1) : selectorWithoutPrefix);
                if (! elements) {
                    console.warn(`No element found for object selector: ${selector.selector}`);
                    return; // Skip if element not found
                }
                const elementSettings = Object.assign(defaults, settings, selector.options);
                clearElementValue(elementSettings, elements);
                return;
            } else {
                if (appDebug) {
                    throw new Error("Invalid element type. Elements should be either a string or an object.");
                }

            }

            if (elements && ! (elements instanceof NodeList)) {
                elements = [elements];
            }

            if (! elements || elements.length === 0) {
                if (appDebug) {
                    console.warn(`No elements found for selector: ${selectorWithoutPrefix}.`);
                }

                return;
            }

            elements.forEach(element => {
                if (! element) {
                    return;
                }

                switch (element.tagName) {
                    case "INPUT":
                        handleInput(element, settings);
                        break;
                    case "TEXTAREA":
                        element.value = "";
                        break;
                    case "SELECT":
                        handleSelect(element, settings);
                        break;
                    case "LABEL":
                    case "SPAN":
                    case "TD":
                    case "DIV":
                        element.textContent = "";
                        break;
                    default:
                        if (appDebug) {
                            console.warn(`Selector: ${selectorWithoutPrefix} is not a supported element type for clearing.`);
                        }

                        break;
                }
            });
        });
    } catch (error) {
        if (appDebug) {
            console.error(`Error in clearValueAndText: ${error.message}`);
        }
    }
}

function clearElementValue(settings, element) {
    switch (element.tagName) {
        case "INPUT":
            handleInput(element, settings);
            break;
        case "TEXTAREA":
            element.value = "";
            break;
        case "SELECT":
            handleSelect(element, settings);
            break;
        case "LABEL":
        case "SPAN":
        case "TD":
        case "DIV":
            element.textContent = "";
            break;
        default:
            console.warn(`Selector: ${element.id} is not a supported element type for clearing.`);
            break;
    }
}

function handleInput(input, settings) {
    switch (input.type) {
        case "checkbox":
        case "radio":
            input.checked = !! settings.checked;
            break;
        case "text":
            if ($(input).hasClass("ts_datepicker")) {
                updateDatepickerWithFormattedDate(input.id, settings.resetDate);
            } else {
                input.value = "";
            }
            break;
        case "hidden":
            if ($(input).hasClass("ts_datepicker")) {
                updateDatepickerWithFormattedDate(input.id, settings.resetDate);
            } else {
                input.value = "";
            }
            break;
        case "number":
        case "email":
        case "password":
            // Explicitly empty the value for these input types
            input.value = "";
            break;
        // Removed default case to prevent unintended value clearing
    }
    input.disabled = settings.disabled;
    if (settings.trigger) {
        $(input).trigger(settings.trigger);
    }
}

function handleSelect(element, settings) {
    const $element = $(element);
    if ($element.data("select2")) {
        $element.val("").trigger("change.select2");
    } else if ($element.hasClass("chosen-select")) {
        $element.val("").trigger("chosen:updated");
    } else {
        element.value = "";
    }
    element.disabled = settings.disabled;
    if (settings.trigger) {
        $(element).trigger(settings.trigger);
    }
}

/**
 * Updates a datepicker element with a formatted date.
 * @param {string} elementById - The ID of the datepicker element.
 * @param {string} dateValue - The initial date value to format and set.
 * @param {string|null} [checkFormat=null] - The format to check the date against.
 */
function updateDatepickerWithFormattedDate(elementById, dateValue, checkFormat = null) {
    // Ensure elementById starts with '#'
    if (! elementById.startsWith("#")) {
        elementById = `#${elementById}`;
    }

    const formattedDate = formatDateBasedOnSettings(dateValue, checkFormat);
    $(elementById).datepicker("update", formattedDate);
}

function updateFormattedDate(date, format = null, checkFormat = null) {
    try {
        // Check if the date is a special string indicating unavailability
        if (date === "-" || /not|no|unavailable|na/i.test(date)) {
            console.warn("Unprocessable date string:", date);
            return "-";
        }

        // Create a Moment object from the date, considering the checkFormat if provided
        let momentDate = checkFormat ? moment(date, checkFormat.toUpperCase()) : moment(date);

        // Check if the date is valid
        if (! momentDate.isValid()) {
            console.warn("Invalid date provided:", date);
            return "Invalid Date"; // or any default message or action you want
        }

        // Determine the format to use
        if (! format) {
            format = document.getElementById("default_date_format").value;
        }

        // Format the date using Moment.js
        return momentDate.format(format.toUpperCase());
    } catch (error) {
        console.warn("Error formatting date:", error);
        return "Error"; // You can customize this return for error scenarios
    }
}

/**
 * Formats a date based on a specified format or a default format.
 * @param {string} date - The date to be formatted.
 * @param {string|null} [checkFormat=null] - The format to be used for formatting. If null, the default format is used.
 * @returns {string} The formatted date.
 */
function formatDateBasedOnSettings(date, checkFormat = null) {
    const defaultFormat = $("#default_date_format").val() || "YYYY-MM-DD"; // Fallback default format
    let momentDate;

    if (checkFormat) {
        // Use the specified format to parse the date
        momentDate = moment(date, checkFormat.toUpperCase());
    } else {
        // Parse the date with the default format
        momentDate = moment(date);
    }
    // Format the date, defaulting to the specified format or the fallback format
    return momentDate.isValid() ? momentDate.format((defaultFormat || "YYYY-MM-DD").toUpperCase()) : "";
}

/**
 * Pads a given number/string with leading characters to reach a specified width.
 *
 * @param {number|string} n - The number or string to pad.
 * @param {number} width - The desired total width of the output.
 * @param {string} [z='0'] - The character to use for padding. Defaults to '0'.
 * @returns {string} The padded string.
 *
 * @example
 * // returns '005'
 * padNumberWithLeadingCharacters(5, 3);
 *
 * @example
 * // returns 'abc__'
 * padNumberWithLeadingCharacters('abc', 5, '_');
 */
const padNumberWithLeadingCharacters = (n, width, z = "0") => {
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

function normalizeSelectors(selectors, prefix) {
    if (Array.isArray(selectors)) {
        return selectors.map(selector => prefix + selector.trim());
    } else if (typeof selectors === "string") {
        return selectors.split(",").map(selector => selector.trim());
    }
    return [];
}

function getElement(selector) {
    return selector.startsWith(".") ? document.querySelector(selector) : document.getElementById(selector.substring(1));
}

function getFormData(selectors, prefix = "") {
    const formData = new FormData();
    selectors      = normalizeSelectors(selectors, prefix);
    selectors.forEach(selector => {
        const element = getElement(selector);
        if (! element) {
            return;
        }

        const value = getValueFromElement(element);
        formData.append(selector, value);
    });
    return formData;
}

function getValueFromElement(element) {
    if (element.tagName === "INPUT") {
        return getInputValue(element);
    } else if (element.tagName === "SELECT") {
        return getSelectValue(element);
    }
    return element.value || "";
}

function getInputValue(element) {
    if (element.type === "checkbox") {
        return element.checked ? 1 : 0;
    } else if (element.type === "radio") {
        return document.querySelector(`input[name="${element.name}"]:checked`).value || "";
    }
    return element.value || "";
}

function getSelectValue(element) {
    const $element = $(element);
    if ($element.data("select2")) {
        return $element.select2("val");
    } else if ($element.hasClass("chosen-select")) {
        return $element.val();
    }
    return element.value || "";
}

function ifNull(value, defaultValue) {
    const falsyValues = [null, undefined, "null", "nan", "infinity", "undefined", "Invalid Date"];

    if (falsyValues.includes(value) || Number.isNaN(value)) {
        return defaultValue;
    }

    return value;
}

function getValueIfDataExists(sourceDataObject, nestedPropertyPath, defaultValue = null) {
    if (typeof sourceDataObject !== "object" || sourceDataObject === null) {
        if (appDebug) {
            console.warn(`sourceDataObject must be an object. Received: ${typeof sourceDataObject}`);
        }
        return defaultValue;
    }

    if (typeof nestedPropertyPath !== "string") {
        if (appDebug) {
            console.warn(`nestedPropertyPath must be a string. Received: ${typeof nestedPropertyPath}`);
        }
        return defaultValue;
    }

    let pathSegments         = nestedPropertyPath.split(".");
    let targetNestedProperty = sourceDataObject;

    for (let segment of pathSegments) {
        // Check if the property is null or undefined before trying to access the next segment
        if (targetNestedProperty === null || targetNestedProperty[segment] === undefined) {
            if (appDebug) {
                console.warn(`Property path '${nestedPropertyPath}' is either non-existent, null, or undefined in the provided data.`);
            }
            return defaultValue;
        }
        targetNestedProperty = targetNestedProperty[segment];
    }

    return targetNestedProperty;
}

function handlePercentageOrAmountInput(percentageInputId, amountInputId, totalAmount, isCalculatingPercentage, currencyRate = 0) {
    if (! percentageInputId || ! amountInputId) {
        console.warn("Both percentageInputId and amountInputId are required.");
        return;
    }

    const $percentageInput = percentageInputId.startsWith("#") ? $(percentageInputId) : $(`#${percentageInputId}`);
    const $amountInput     = amountInputId.startsWith("#") ? $(amountInputId) : $(`#${amountInputId}`);

    if ($percentageInput.length === 0) {
        console.warn(`Percentage input with ID "${percentageInputId}" not found.`);
        return;
    }
    if ($amountInput.length === 0) {
        console.warn(`Amount input with ID "${amountInputId}" not found.`);
        return;
    }

    if (isCalculatingPercentage) {
        const amount     = parseNumber($amountInput.val());
        const percentage = calculatePercentage(amount, totalAmount, amountInputId);
        $percentageInput.val(parseNumber(percentage).toFixed(2));
    } else {
        const percentage = parseNumber($percentageInput.val());
        const amount     = calculateAmount(totalAmount, percentage, percentageInputId);
        $amountInput.val(parseNumber(amount).toFixed(AMOUNT_ROUNDING));
    }
}

function validatePercentage(n) {
    const num = parseNumber(n);
    return num >= 0 && num <= 100 ? num.toFixed(2) : "0.00";
}

function isPositive(number, elementById) {
    // Convert the input to a floating-point number
    const parsedNumber = parseFloat(number);

    // Check if the number is positive
    if (parsedNumber > 0) {
        document.getElementById(elementById).classList.remove("inputerror");
        // Return the number itself if positive
        return parsedNumber;
    }

    if (parsedNumber < 0) {
        // Add 'in-valid' class to the element if the number is not positive
        document.getElementById(elementById).classList.add("inputerror");
        AlertComponent._getAlertMessage("Information", "The highlighted with red value is not positive", "info");
    }

    // Return 0 to indicate a non-positive input
    return parsedNumber;
}

export const getItemRateTypeById = async (id, elementById) => {
    await baseInstance.runException(async () => {
        if (parseNumber(id) > 0) {
            // Making the AJAX request
            const response = await makeAjaxRequest("GET", `${base_url}/item/calculationMethod/getCalculationMethodById`, { id });
            // Process the response
            if (response.status === false && response.error !== "") {
                AlertComponent._getAlertMessage("Error!", response.error, "danger");
            } else {
                if (elementById) {
                    const isMultiplier = response.data.is_multiplier;
                    $("#calculationOn").val(response.data.calculation_on);
                    $("#rateTypeIsMultiplier").val(isMultiplier);
                    document.getElementById(elementById).value = parseNumber(response.data.division_by);
                }
            }
        }
    });
};

const parseNumber             = val => parseFloat(val) || 0;
/**
 * getOptionText
 * return selected option text given dropdown id
 * @param  elementById
 * @return [string]
 * */
const getOptionText           = (elementById) => {
    return $.trim($(elementById).find("option:selected").text());
};
/**
 * getOptionData
 * return selected option data given dropdown id
 * @param  elementById
 * @param  DataKey
 * @return [string]
 * */
const getOptionData           = (elementById, DataKey) => {
    return $.trim($(elementById).find("option:selected").data(DataKey));
};
/**
 * getTableTrRowTextNumber
 * Return the table of td text where user perform working of calculation
 * @param  rowElement This is a jquery element like this $(this)
 * @param  clas It's class of current row which give the value
 * @return number
 * */
const getTableTrRowTextNumber = (rowElement, clas) => {
    return parseNumber($(rowElement).closest("tr").find("td." + clas));
};
/**
 * getTableTrRowText
 * Return the table of td text
 * @param  rowElement This is a jquery element like this $(this)
 * @param  clas It's class of current row which give the value
 * @return text
 * */
const getTableTrRowText       = (rowElement, clas) => {
    return $.trim($(rowElement).closest("tr").find("td." + clas).text());
};

/**
 * Checks if a table row exists based on the comparison of either a data attribute or text content.
 * @param {string} tableId - The ID of the table to search within.
 * @param {string} compareValue - The value to compare against the data attribute or text content.
 * @param {string} tdClassName - The class name of the <td> element to search.
 * @param {string} [tdDataName] - The data attribute name to compare against. Required if mode is 'data'.
 * @param {string} [mode='data'] - The comparison mode: 'data' for data attributes or 'text' for text content.
 * @return {boolean} Returns true if a matching row is found, otherwise false.
 */
const getTableRowIsAlreadyExist = (tableId, compareValue, tdClassName, tdDataName = "item_id", mode = "data") => {
    let isExist = false;
    $(tableId).find("tbody tr").each(function () {
        $(this).closest("tr").removeClass("highlight_tr");
        let elementValue;

        if (mode === "data") {
            elementValue = $.trim($(this).find(`td.${tdClassName}`).data(tdDataName));
        } else if (mode === "text") {
            elementValue = $.trim($(this).find(`td.${tdClassName}`).text());
        }

        if (elementValue === compareValue) {
            isExist = true;
            $(this).closest("tr").addClass("highlight_tr");
            $(this).closest("tr").focus();
        }
    });
    return isExist;
};

/**
 * getDateDifference
 * Take the difference between the dates and divide by milliseconds per day.
 * * Current Date
 * * Due Date
 * @param  firstDate This is Current Date
 * @param  secondDate This is Due Date
 * @return Number
 * */
const getDateDifference = (firstDate, secondDate) => {
    var format   = $("#default_date_format").val();
    var timeDiff = ((moment(secondDate, format.toUpperCase()) - moment(firstDate, format.toUpperCase())));
    var days     = timeDiff / (1000 * 60 * 60 * 24);
    return days;
};

const handleObjectName = (data, objectName) => {
    if (data[objectName]) {
        return data[objectName];
    }
    return null;
};

/**
 * getCalculateDatesWithCurrentDate
 * * Default Date Format
 * * Current Date
 * * Due Date
 * @param  dueDay This is Due Days
 * @param  id This is dropdown Id with out element like #
 * @return String
 * */
const getCalculateDatesWithCurrentDate = (dueDay, id) => {
    var format      = $("#default_date_format").val();
    var currentDate = ($("#current_date").val());
    currentDate     = moment(currentDate, format.toUpperCase());
    currentDate     = currentDate.add(dueDay, "days");
    if (dueDay == 0) {
        var currentDate = $("#current_date").val();
        currentDate     = moment(currentDate, format.toUpperCase());
        updateDatepickerWithFormattedDate(id, currentDate);
    } else {
        updateDatepickerWithFormattedDate(id, currentDate);
    }
};

function validateEmail(sEmail) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (pattern.test(sEmail)) {
        return true;
    } else {
        return false;
    }
}

function selectLastOption(elementById) {
    const $dropdown = $(`#${elementById}`);
    // Assuming the data has just been loaded and the Select2 initialized or updated
    $dropdown.find("option").first().prop("selected", true);
    $dropdown.trigger("change");

}

const setFinancialYearDate = (startDateId, endDateId) => {
    const sDate = getSqlFormattedDate($("#sdate").val());
    const eDate = getSqlFormattedDate($("#edate").val());

    $(`#${startDateId}`).datepicker("update", formatDateBasedOnSettings(sDate));
    $(`#${endDateId}`).datepicker("update", formatDateBasedOnSettings(eDate));
};

const updateDateRangeToCurrentWeek = (startDateId, endDateId) => {
    const currentDate    = new Date();
    const currentWeekDay = currentDate.getDay();
    const lessDays       = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
    const weekStartDate  = new Date(new Date(currentDate).setDate(currentDate.getDate() - lessDays));
    const weekEndDate    = new Date(new Date(weekStartDate).setDate(weekStartDate.getDate() + 6));

    $(`#${startDateId}`).datepicker("update", new Date(weekStartDate));
    $(`#${endDateId}`).datepicker("update", new Date(weekEndDate));
};

const updateDateRangeToCurrentMonth = (startDateId, endDateId) => {
    const date     = new Date(),
          year     = date.getFullYear(),
          month    = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);

    $(`#${startDateId}`).datepicker("update", new Date(firstDay));
    $(`#${endDateId}`).datepicker("update", new Date(lastDay));
};

const updateDateRangeCurrentDay = (startDateId, endDateId) => {
    $(`#${startDateId}`).datepicker("update", new Date());
    $(`#${endDateId}`).datepicker("update", new Date());
};

// Helper function to disable a button
const disableSearchButton = (selector) => {
    return new Promise(resolve => {
        $(".btnSearch").prop("disabled", true);
        $(".btnReset").prop("disabled", true);
        $(".btnPrint").prop("disabled", true);
        shortcut.remove("F6");
        shortcut.remove("F6");
        shortcut.remove("F9");
        shortcut.remove("F9");
        resolve();
    });
};

// Helper function to enable a button
const enableSearchButton = (selector) => {
    return new Promise(resolve => {
        $(".btnSearch").prop("disabled", false);
        $(".btnReset").prop("disabled", false);
        $(".btnPrint").prop("disabled", false);
        shortcut.add("F9", function () {
            $(".btnPrint").get()[0].click();
        });
        shortcut.add("F6", function () {
            $(".btnSearch").get()[0].click();
        });
        resolve();
    });
};

const isPreviousBalance = () => {
    return $("#textPreviousBalance").prop("checked") ? 1 : 0;
};

const convertToLCY = (amount, rate) => {
    return parseNumber(amount) * parseNumber(rate); // Converts FCY to LCY
};

const convertToFCY = (amount, rate) => {
    return parseNumber(amount) / parseNumber(rate); // Converts LCY to FCY
};

function reinitializeSelect2WithoutAjax(selector, placeholder) {
    // Destroy the current Select2 instance
    $(selector).select2("destroy");

    // Re-initialize Select2 without AJAX
    $(selector).select2({
        placeholder : placeholder
    });
}

/**
 * Disables specified buttons and removes keyboard shortcuts.
 */
const disableButton = async (elementId = "") => {
    return new Promise((resolve) => {
        $(".btnSave").prop("disabled", true);
        $(".btnReset").prop("disabled", true);
        $(".btnPrint").prop("disabled", true);
        $(".btnDelete").prop("disabled", true);
        if (typeof elementId === "string" && elementId.length) {
            $(elementId).prop("disabled", true);
        }
        shortcut.remove("F5");
        shortcut.remove("F9");
        shortcut.remove("F10");
        shortcut.remove("F12");

        resolve();
    });
};

/**
 * Enables specified buttons and adds keyboard shortcuts.
 */
const enableDisableButton = async (elementId = "", saveShortcut = false) => {
    return new Promise((resolve) => {
        $(".btnSave").prop("disabled", false);
        $(".btnReset").prop("disabled", false);
        $(".btnPrint").prop("disabled", false);
        $(".btnDelete").prop("disabled", false);
        if (typeof elementId === "string" && elementId.length) {
            $(elementId).prop("disabled", false);
            if (saveShortcut) {
                shortcut.add("F10", function () {
                    $(elementId).get()[0].click();
                });
            }
        }
        shortcut.add("F5", function () {
            const btnReset = $(".btnReset");
            if (btnReset.length) {
                $(btnReset).get()[0].click();
            }
        });
        shortcut.add("F9", function () {
            const btnPrint = $(".btnPrint");
            if (typeof btnPrint === "object" && btnPrint.length) {
                $(btnPrint).get()[0].click();
            }
        });
        shortcut.add("F10", function () {
            const btnSave = $(".btnSave");
            if (typeof btnSave === "object" && btnSave.length) {
                $(btnSave).get()[0].click();
            }
        });
        shortcut.add("F12", function () {
            const btnDelete = $(".btnDelete");
            if (typeof btnDelete === "object" && btnDelete.length) {
                $(btnDelete).get()[0].click();
            }
        });

        resolve();
    });
};

/**
 * Removes an item from the local storage.
 *
 * @param {string} key - The key of the item to be removed.
 * @returns {void}
 */
const removeLocalStorage = (key) => {
    localStorage.removeItem(key);
};

/**
 * Sets a value in the local storage with the specified key.
 *
 * @param {string} key - The key to set in the local storage.
 * @param {any} value - The value to be stored in the local storage.
 * @returns {void}
 */
const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Retrieves the value from local storage based on the provided key.
 *
 * @param {string} key - The key used to retrieve the value from local storage.
 * @returns {any} The value retrieved from local storage.
 */
const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
};

/**
 * Toggles the visibility of a loading spinner within a specified element.
 *
 * This function checks if a loader element (with class 'loader') is currently visible within the specified element.
 * If the loader is visible, it hides the loader. If the loader is hidden, it shows the loader.
 *
 * @param {boolean} isTrue
 * @param {jQuery} [element=$( 'body' )] - The jQuery element within which to toggle the loader visibility. Defaults to the body element.
 */
const doLoading = (isTrue = false, element = $("body")) => {
    const loading = element.find(".loader");
    if (! isTrue && loading.is(":visible")) {
        loading.hide();
    } else if (isTrue) {
        loading.show();
    }
};

export {
    parseNumber, populateSelect2Data, appendOptionAndSetSelect2Value, appendSelect2ValueIfDataExists, updateDatepickerWithFormattedDate, updateFormattedDate, formatDateBasedOnSettings, padNumberWithLeadingCharacters, resetSelect2Option, clearValueAndText, ifNull, getValueIfDataExists, handlePercentageOrAmountInput, isPositive, getOptionText, getOptionData, getTableTrRowTextNumber, getTableTrRowText, getTableRowIsAlreadyExist, validatePercentage, getDateDifference, getCalculateDatesWithCurrentDate, handleObjectName, validateEmail, selectLastOption, updateDateRangeCurrentDay, setFinancialYearDate, updateDateRangeToCurrentWeek, updateDateRangeToCurrentMonth, disableSearchButton, enableSearchButton, isPreviousBalance, convertToLCY, convertToFCY, reinitializeSelect2WithoutAjax, disableButton, enableDisableButton, setLocalStorage, getLocalStorage, removeLocalStorage, doLoading
};
