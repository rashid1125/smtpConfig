import AlertComponent      from "./AlertComponent.js";
import { makeAjaxRequest } from "./MakeAjaxRequest.js";

export default class DynamicOption
{
    constructor(element, props = {}) {
        this.props    = {
            requestedUrl          : "",
            allowClear            : false,
            disabled              : false,
            includeDataAttributes : false,
            loadImmediatelyData   : false,
            placeholderText       : "Choose", ...props
        };
        this.element  = element;
        this.pageSize = 3000;
        localStorage.removeItem(`${this.element}_allRows`);
        this.initSelect2();
    }

    initSelect2() {
        const self = this;
        $.fn.select2.amd.require(["select2/data/array", "select2/utils"], (ArrayData, Utils) => {
            class CustomData extends ArrayData
            {
                constructor($element, options) {
                    super($element, options);
                }

                fetchDataFromLocalStorage(searchTerm) {
                    const allData = JSON.parse(localStorage.getItem(`${self.element}_allRows`) || "[]");
                    const results = allData.filter(item => item && item.text && item.text.toUpperCase().startsWith(searchTerm.toUpperCase()));

                    results.sort((a, b) => {
                        if (a.text.toUpperCase() === searchTerm.toUpperCase()) {
                            return -1;
                        }
                        if (b.text.toUpperCase() === searchTerm.toUpperCase()) {
                            return 1;
                        }
                        return 0;
                    });

                    return results;
                }

                async query(params, callback) {
                    const searchTerm = (params.term || "").toUpperCase();
                    let results      = this.fetchDataFromLocalStorage(searchTerm);
                    const pageNumber = params.page || 1;

                    if (results.length > 0) {
                        const startIndex = (pageNumber - 1) * self.pageSize;
                        const endIndex   = startIndex + self.pageSize;

                        if (startIndex >= results.length) {
                            callback({
                                results    : [],
                                pagination : { more : results.length >= pageNumber * self.pageSize }
                            });
                            return;
                        }

                        callback({
                            results    : results.slice(startIndex, endIndex),
                            pagination : { more : results.length > endIndex }
                        });
                    } else {
                        const response = await makeAjaxRequest("GET", self.props.requestedUrl, {
                            term     : searchTerm,
                            page     : pageNumber,
                            pageSize : self.pageSize,
                            props    : self.props
                        });
                        if (response && response.status == false && response.error !== "") {
                            AlertComponent._getAlertMessage("Error!", response.message, "danger");
                        } else if (response && response.status == false && response.message !== "") {
                            AlertComponent._getAlertMessage("Warning!", response.message, "warning");
                        } else {
                            if (response && response.data) {
                                this.processFetchedData(response.data, callback);
                            }
                        }
                    }
                }

                processFetchedData(data, callback) {
                    if (! data || ! Array.isArray(data.results)) {
                        console.error("Invalid data format received:", data);
                        callback({ results : [] }); // Callback with empty results
                        return;
                    }

                    const allData       = JSON.parse(localStorage.getItem(`${self.element}_allRows`) || "[]");
                    const uniqueResults = data.results.filter(result => ! allData.some(item => item.id === result.id));
                    const updatedData   = [...allData, ...uniqueResults];
                    localStorage.setItem(`${self.element}_allRows`, JSON.stringify(updatedData));
                    callback(data);
                }

                option(data) {
                    const regularOption = document.createElement("option");
                    regularOption.value = data.id;
                    regularOption.text  = data.text;
                    if (self.props.includeDataAttributes && data.dataAttributes) {
                        $.each(data.dataAttributes, (key, value) => {
                            regularOption.setAttribute(`data-${key}`, value);
                        });
                    }

                    return regularOption;
                }
            }

            Utils.Extend(CustomData, ArrayData);

            $(this.element).select2({
                allowClear    : this.props.allowClear,
                placeholder   : this.props.placeholderText,
                width         : "element",
                ajax          : {},
                dataAdapter   : CustomData,
                initSelection : function (element, callback) {
                    var id = $(element).val();
                    console.log(id);
                    if (id !== "") {
                        // Use your custom AJAX request method here
                        makeAjaxRequest("GET", self.props.requestedUrl, { id : id }, "json").then(data => {
                            callback({
                                id   : data.id,
                                text : data.name
                            });
                        }).catch(error => {
                            console.error("Error:", error);
                            AlertComponent._getAlertMessage("Error!", "An error occurred during the request.", "danger");
                        });
                    }
                }
            });

            if (self.props.loadImmediatelyData) {
                $(this.element).select2("open");
            }

            $(this.element).on("select2:results:all", () => {
                const resultsContainer = $(this.element).parent().find(".select2-results__options");
                resultsContainer.scrollTop(0);
            });
        });
    }

    updateOptions(newOptions) {
        this.props = { ...this.props, ...newOptions };
        localStorage.removeItem(`${this.element}_allRows`);
        this.initSelect2();
    }

    triggerAndRenderOptions(text, id, options = {}) {
        const defaultProp    = {
            checkOptionExist : false,
            triggerDisabled  : false, ...options
        };
        const $selectElement = $(this.element);
        // Clear existing options
        if (! defaultProp.checkOptionExist) {
            $selectElement.empty();
        }

        // Create and append the option with the specified value
        var option = new Option(text, id, false, true);
        $selectElement.append(option);
        // Trigger the change event only if specified
        if (defaultProp.triggerChange) {
            $selectElement.trigger("change");
        } else {
            $selectElement.trigger("change.select2");
        }
        $selectElement.prop('disabled', defaultProp.triggerDisabled).trigger('change.select2');
    };

}
