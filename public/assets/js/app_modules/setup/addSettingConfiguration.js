import { ifNull } from "../commonFunctions/CommonFunction.js";

var settingConfiguration = function () {
    const fileUrl       = `${base_url}/setting_configuration`;
    const validateSave  = function () {
        let errorFlag = 0;
        $(".inputerror").removeClass("inputerror");
        $(".save-elem").each(function () {
            const idName = $(this).attr("name");
            const rawVal = $(this).val();
            const val    = rawVal === null ? "" : rawVal.toString().trim();
            if (ifNull(val, "") === "") {
                if ($(this).hasClass("this-optional")) {
                    return true;
                } else if ($(this).hasClass("d-none")) {
                    return true;
                } else if ($(this).hasClass("select2")) {
                    if ($(this).hasClass("this-optional")) {
                        return true;
                    } else {
                        const select2Container = $(this).siblings(".select2-container");
                        if (select2Container.length > 0 && select2Container.find(".select2-selection__rendered").text().trim() === "") {
                            select2Container.addClass("inputerror");
                            if (! $(this).hasClass("hide")) {
                                console.log(idName);
                                errorFlag += 1;
                            }
                        }
                    }
                } else {
                    $(this).addClass("inputerror");
                }

                if (! $(this).hasClass("hide")) {
                    console.log(idName);
                    errorFlag += 1;
                }
            }
        });
        return errorFlag;
    };
    const getSaveObject = function () {
        const obj = {};
        $(".save-elem").each(function () {
            const $elem = $(this);
            if ($elem.is("input, select, textarea")) {
                if ($elem.hasClass("bs_switch")) {
                    obj[$elem.attr("name")] = $elem.bootstrapSwitch("state");
                } else if ($elem.prop("type") === "radio" && $elem.is(":checked")) {
                    obj[$elem.attr("name")] = $elem.val();
                } else if ($elem.hasClass("select2") && $elem.prop("multiple")) {
                    const values            = $elem.val() || []; // Ensure we have an array, even if it's empty
                    obj[$elem.attr("name")] = values.join(","); // Join the array into a string
                } else {
                    obj[$elem.attr("name")] = $.trim($elem.val());
                }
            }
        });

        const LEVEL3_ID = [];
        $.each($("select[data-level3=\"level3\"]"), function () {
            if (LEVEL3_ID) {
                LEVEL3_ID.push($(this).val());
            }
        });
        const setting_configuration_security_level3 = LEVEL3_ID.join(",");

        const ACCOUNT_ID = [];
        $.each($("select[data-account=\"account\"]"), function () {
            if (ACCOUNT_ID) {
                ACCOUNT_ID.push($(this).val());
            }
        });
        const setting_configuration_security_party_id = ACCOUNT_ID.join(",");
        obj.setting_configuration_security_level3     = setting_configuration_security_level3;
        obj.setting_configuration_security_party_id   = setting_configuration_security_party_id;
        obj["date_format_php"]                        = $("#date_format_view").find("option:selected").data("backend");

        const form_data = new FormData();
        for (let key in obj) {
            form_data.append(key, obj[key]);
        }
        form_data.append("photo", getImage() || null);

        return form_data;
    };

    // Function to handle image upload and display to the user
    function getImage() {
        var file = $("#itemImage").get(0).files[0]; // Get the uploaded file

        // Check if the file exists and is an image
        if (file && file.type.match(/image.*/)) {
            // Check for FileReader support
            if (window.FileReader) {
                const reader = new FileReader(); // Create a new FileReader

                reader.onloadend = function (e) {
                    // Update the image display with the uploaded image
                    $("#itemImageDisplay").attr("src", e.target.result);

                    // Assuming 'setting' is a global object and 'photo' is a property to be cleared
                    // Ensure 'setting' is defined and accessible in this scope
                    if (typeof setting !== "undefined") {
                        delete setting.photo;
                    }
                };

                reader.readAsDataURL(file); // Read the file as Data URL
            } else {
                console.log("FileReader API is not supported by your browser.");
            }
        }

        return file; // Return the file object
    }

    /////////////////////////////////////////////////////
    ///////////   Saving Data     ///////////////////////
    /////////////////////////////////////////////////////

    var save = function (obj) {

        $.ajax({
            url         : `${fileUrl}/save`,
            type        : "POST",
            data        : obj,
            processData : false,
            contentType : false,
            dataType    : "JSON",
            success     : function (response) {
                if (response.status == false && response.message !== "" && response.error !== "") {
                    _getAlertMessage("Error!", response.message, "danger");
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage("Information!", response.message, "info");
                } else {
                    _getAlertMessage("Successfully!", response.message, "success");
                    fetch(1);
                }
            },
            error       : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    /////////////////////////////////////////////////
    /////////    Fetching Records   /////////////////
    /////////////////////////////////////////////////

    var fetch = function () {

        $.ajax({

            url      : `${fileUrl}/fetch`,
            type     : "GET",
            data     : {},
            dataType : "JSON",
            success  : function (response) {
                if (response.status == false && response.message !== "" && response.error !== "") {
                    _getAlertMessage("Error!", response.message, "danger");
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage("Information!", response.message, "info");
                } else {
                    populateData(response.data);
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    var populateData       = function (data) {
        for (const [key, value] of Object.entries(data)) {
            const $elem = $("[name=\"" + key + "\"]");
            if ($elem.length) {
                if ($elem.hasClass("bs_switch")) {
                    $elem.bootstrapSwitch("state", value === "true");
                } else if ($elem.is(":radio")) {
                    $("input[name=\"" + key + "\"][value=\"" + value + "\"]").prop("checked", true);
                } else if ($elem.hasClass("select2") && $elem.prop("multiple")) {
                    if (value !== "" && typeof value === "string") {
                        $elem.val(value.split(",")).trigger("change.select2");
                    } else if (Array.isArray(value)) {
                        $elem.val(value).trigger("change.select2");
                    }
                } else if ($elem.is("input, select, textarea")) {
                    if ($elem.hasClass("select2")) {
                        $elem.val(value).trigger("change");
                    }
                    $elem.val(value).trigger("change");
                }
            }
        }
        // $('.save-elem').each(function (ind, elem) {
        // 	var col = $(this).attr('name');
        // 	var name = $(this).prop('name');
        // 	if ($(this).hasClass('bs_switch')) {
        // 		$(this).bootstrapSwitch('state', (data[col] === "true") ? true : false);
        // 	} else if ($(this).prop('type') === 'radio') {
        // 		$("input[name='" + name + "'][value=" + data[col] + "]").prop("checked", true);
        // 	} else if ($(this).prop('type') === 'checkbox') {
        // 		$("input[name='" + name + "'][value=" + data[col] + "]").prop("checked", true);
        // 	} else if ($(this).hasClass('select2')) {
        // 		if ($(this).prop("multiple")) {
        //             data[col] = ifNull(data[col], 0);
        //             // Ensure data[col] is a string before calling .split()
        //             if (data[col] !== "" && typeof data[col] === 'string') {
        //                 $(this).val(data[col].split(",")).trigger('change.select2');
        //             } else if (Array.isArray(data[col])) {
        //                 // If data[col] is already an array, use it directly
        //                 $(this).val(data[col]).trigger('change.select2');
        //             }
        //         }
        // 		else {
        // 			$(this).val(data[col]).trigger('change.select2');
        // 		}
        // 	}
        // 	else {
        // 		$(this).val(data[col]);
        // 	}
        // });

        $("#txtId").val(data.id);
        if (ifNull(data.photoPath, "") !== "") {
            $("#itemImageDisplay").attr("src", `${data.photoPath}`);
        } else {
            $("#itemImageDisplay").attr("src", base_url + "/assets/img/blank.jpg");
        }

    };
    /**
     * stockEtypeOption
     * concat stock etype on change every post method
     * @param  purchase_posting Purchase Posting Change get data-etype
     * @param  sale_posting Sale Posting Change get data-etype
     * @param  purchase_return_posting Purchase Return Posting Change get data-etype
     * @param  sale_return_posting Sale Return Posting Change get data-etype
     * @return [option]
     * */
    const stockEtypeOption = (purchase_posting, sale_posting, purchase_return_posting, sale_return_posting, bulksupplies) => {
        $("select[name=\"stock_etype\"]").empty();
        var Options1 = "<option value=\"" + purchase_posting + "\">" + purchase_posting + "</option>";
        var Options2 = "<option value=\"" + sale_posting + "\">" + sale_posting + "</option>";
        var Options3 = "<option value=\"" + purchase_return_posting + "\">" + purchase_return_posting + "</option>";
        var Options4 = "<option value=\"" + sale_return_posting + "\">" + sale_return_posting + "</option>";
        var Options5 = "<option value=\"" + bulksupplies + "\">" + bulksupplies + "</option>";

        $(Options1).appendTo("select[name=\"stock_etype\"]");
        $(Options2).appendTo("select[name=\"stock_etype\"]");
        $(Options3).appendTo("select[name=\"stock_etype\"]");
        $(Options4).appendTo("select[name=\"stock_etype\"]");
        $(Options5).appendTo("select[name=\"stock_etype\"]");

        var optionArray = purchase_posting + "," + sale_posting + "," + purchase_return_posting + "," + sale_return_posting + "," + bulksupplies;
        optionArray     = optionArray.split(",");
        $("select[name=\"stock_etype\"]").val(optionArray).trigger("liszt:updated");
    };
    return {
        init         : function () {
            this.bindUI();
            $(".select2").select2();
        },
        bindUI       : function () {
            var self = this;
            $("#voucher_type_hidden").val("edit");
            $(".btnSave").on("click", function (e) {

                if ($("#voucher_type_hidden").val() == "edit" && $(".btnSave").data("updatebtn") == 0) {
                    alert("Sorry! you have not update rights..........");
                } else if ($("#voucher_type_hidden").val() == "new" && $(".btnSave").data("insertbtn") == 0) {
                    alert("Sorry! you have not insert rights..........");
                } else {
                    e.preventDefault();
                    self.initSave();
                }
            });
            $("select[name=\"purchase_posting\"]").change(function (e) {
                e.preventDefault();
                const purchase_posting        = getOptionData("select[name=\"purchase_posting\"]", "etype");
                const sale_posting            = getOptionData("select[name=\"sale_posting\"]", "etype");
                const purchase_return_posting = getOptionData("select[name=\"purchase_return_posting\"]", "etype");
                const sale_return_posting     = getOptionData("select[name=\"sale_return_posting\"]", "etype");
                const BulkSupplies            = getOptionData("select[name=\"bulksupply_warehouse_display\"]", "etype");
                stockEtypeOption(purchase_posting, sale_posting, purchase_return_posting, sale_return_posting, BulkSupplies);
            });
            $("select[name=\"sale_posting\"]").change(function (e) {
                e.preventDefault();
                const purchase_posting        = getOptionData("select[name=\"purchase_posting\"]", "etype");
                const sale_posting            = getOptionData("select[name=\"sale_posting\"]", "etype");
                const purchase_return_posting = getOptionData("select[name=\"purchase_return_posting\"]", "etype");
                const sale_return_posting     = getOptionData("select[name=\"sale_return_posting\"]", "etype");
                const BulkSupplies            = getOptionData("select[name=\"bulksupply_warehouse_display\"]", "etype");
                stockEtypeOption(purchase_posting, sale_posting, purchase_return_posting, sale_return_posting, BulkSupplies);
            });
            $("select[name=\"purchase_return_posting\"]").change(function (e) {
                e.preventDefault();
                const purchase_posting        = getOptionData("select[name=\"purchase_posting\"]", "etype");
                const sale_posting            = getOptionData("select[name=\"sale_posting\"]", "etype");
                const purchase_return_posting = getOptionData("select[name=\"purchase_return_posting\"]", "etype");
                const sale_return_posting     = getOptionData("select[name=\"sale_return_posting\"]", "etype");
                const BulkSupplies            = getOptionData("select[name=\"bulksupply_warehouse_display\"]", "etype");
                stockEtypeOption(purchase_posting, sale_posting, purchase_return_posting, sale_return_posting, BulkSupplies);
            });
            $("select[name=\"sale_return_posting\"]").change(function (e) {
                e.preventDefault();
                const purchase_posting        = getOptionData("select[name=\"purchase_posting\"]", "etype");
                const sale_posting            = getOptionData("select[name=\"sale_posting\"]", "etype");
                const purchase_return_posting = getOptionData("select[name=\"purchase_return_posting\"]", "etype");
                const sale_return_posting     = getOptionData("select[name=\"sale_return_posting\"]", "etype");
                const BulkSupplies            = getOptionData("select[name=\"bulksupply_warehouse_display\"]", "etype");
                stockEtypeOption(purchase_posting, sale_posting, purchase_return_posting, sale_return_posting, BulkSupplies);
            });
            $("select[name=\"bulksupply_warehouse_display\"]").change(function (e) {
                e.preventDefault();
                const purchase_posting        = getOptionData("select[name=\"purchase_posting\"]", "etype");
                const sale_posting            = getOptionData("select[name=\"sale_posting\"]", "etype");
                const purchase_return_posting = getOptionData("select[name=\"purchase_return_posting\"]", "etype");
                const sale_return_posting     = getOptionData("select[name=\"sale_return_posting\"]", "etype");
                const BulkSupplies            = getOptionData("select[name=\"bulksupply_warehouse_display\"]", "etype");
                stockEtypeOption(purchase_posting, sale_posting, purchase_return_posting, sale_return_posting, BulkSupplies);
            });
            $("#text-header-language-hide").hide();

            $(".btnReset").on("click", function (e) {
                e.preventDefault();		// prevent the default behaviour of the link
                self.resetVoucher();	// resets the voucher
            });

            shortcut.add("F10", function () {
                self.initSave();
            });
            shortcut.add("F5", function () {
                self.resetVoucher();
            });

            $("#itemImage").on("change", function () {
                getImage();
            });
            $("#removeImg").on("click", function (e) {
                e.preventDefault();
                var src = $("#itemImageDisplay").attr("src");
                if (confirm("Are you sure to delete this image?") && src.length > 0) {
                    $("#itemImageDisplay").attr("src", $("#url").val());
                    $("#itemImage").val(null);
                    setting.photo = "1";
                }
            });

            function debounce(fn, delay) {
                let timeoutId;
                return function (...args) {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    timeoutId = setTimeout(() => {
                        fn(...args);
                    }, delay);
                };
            }

            $("select").on("select2:open", debounce(function (e) {
                const select2Instance = $(e.target).data("select2");
                if (select2Instance) {
                    let $search;
                    if (select2Instance.options.options.multiple) {
                        // For multi-select, search input is in the container.
                        $search = select2Instance.$container.find(".select2-search__field");
                    } else {
                        // For single-select, search input is in the dropdown.
                        $search = select2Instance.dropdown.$search[0];
                    }

                    if ($search) {
                        $search.focus();
                    }
                }
            }, 200));
            fetch();
        }, // makes the voucher ready to save
        initSave     : function () {

            var saveObj = getSaveObject();	// returns the object to save into database
            var error   = validateSave();	// checks for the empty fields

            if (! error) {
                save(saveObj);
            } else {
                alert("Correct the error!!!");
            }
        }, // resets the voucher
        resetVoucher : function () {
            general.reloadWindow();
        }

    };

};
var setting              = new settingConfiguration();
document.addEventListener("DOMContentLoaded", function () {
    setting.init();
});

