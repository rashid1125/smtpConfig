import AlertComponent                       from "../../../../../js/components/AlertComponent.js";
import { baseConfiguration }                from "../../../../../js/components/ConfigurationManager.js";
import { makeAjaxRequest }                  from "../../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText, validateEmail } from "../../commonFunctions/CommonFunction.js";

var Suppliers = function () {
    const fileUrl       = `${base_url}/account/supplier`;
    const modalInstance = $("#supplierAddModalId");
    const VoucherEtype  = "suppliers";
    const routeDropdown = $("#routeDropdown");
    const urduAddress   = $("#txtUrduAddress");

    const handleFileSelect = (evt) => {
        var files   = evt.target.files; // FileList object
        var xl2json = new ExcelToJSON();
        xl2json.parseExcel(files[0]);
    };

    /**
     * @description
     * Excel To HTML Table convert the excel file into an HTML table and append rows in table import.
     */
    const ExcelToJSON = function () {

        $("#txtCustomerTbodyExcelImport").empty(); // remove table imort tbody on every excel file import
        $("caption").empty(); // remove table imort tbody caption like export to xlsx on every excel file import

        this.parseExcel = function (file) {
            const reader  = new FileReader();
            reader.onload = function (e) {

                const data     = e.target.result;
                const workbook = XLSX.read(data, { type : "binary" });

                workbook.SheetNames.forEach(function (sheetName) {

                    const XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        raw    : true,
                        defval : null
                    });

                    const productList = JSON.parse(JSON.stringify(XL_row_object));
                    var rows          = $("#tableImport tbody");
                    for (i = 0; i < productList.length; i++) {
                        const columns = Object.values(productList[i]);
                        rows.append(`
            <tr>
                <td>${i + 1}</td>
                <td class='text-left account_name'>${ifnull(columns[0], "")}</td>
                <td class='text-left account_uname'>${ifnull(columns[1], "")}</td>
                <td class='text-left account_concat'>${ifnull(columns[2], "")}</td>
                <td class='text-left account_type'>${ifnull(columns[3], "")}</td>
                <td class='text-left account_city'>${ifnull(columns[4], "")}</td>
                <td class='text-left account_cityarea'>${ifnull(columns[5], "")}</td>
                <td class='text-left account_trn'>${ifnull(columns[6], "")}</td>
				<td class='text-right amount'>${ifnull(columns[7], "")}</td>
				<td class='text-left dr_cr'>${ifnull(columns[8], "")}</td>
                <td class='text-right'><a href='' class='btn btn-primary btnRowRemove'><span class='fa fa-remove'></span></a></td>
            </tr>`);
                    }
                });
                highlightDuplicates(); // highlight duplicates table rows if are duplicated from the sheet by adding class duplicated for red rows.
            };

            reader.onerror = function (ex) {
                console.log(ex);
            };

            reader.readAsBinaryString(file);
        };

        general.disableSave(); // disable top header button on import excel file
    };

    const highlightDuplicates     = (flg = false) => {
        var txtMsg = "";
        $("#tableImport tbody tr").each(function (index1) {
            var row      = $(this);
            var flag     = false;
            var row_val1 = row.find("td").eq(1).text();
            var row_val2 = row.find("td").eq(7).text();
            $("#tableImport tbody tr").each(function (index2) {
                var compare_row       = $(this);
                var compare_row_val1  = compare_row.find("td").eq(1).text();
                var compare_row_val12 = compare_row.find("td").eq(7).text();
                if (index1 != index2 && row_val1 == compare_row_val1) {
                    flag   = true;
                    txtMsg = "Account Name";
                }
            });

            if (flag == true) {
                row.removeClass("duplicate");
                row.addClass("duplicate");
                flg = true;
            }
            flag = false;
        });
        getValiDateDrCrType();
        if ($("tr.duplicate").length > 0) {
            $.notify({ message : "Duplicates " + txtMsg + " Found" }, { type : "danger" });
        }

        return flg;
    };
    Window.validateExcelSheetflag = false;
    const getValiDateDrCrType     = () => {
        const TypeDrCrArray = [];
        $("#type_dr_cr_dropdown option").each(function (index, elem) {
            if (index != 0) {
                TypeDrCrArray.push($.trim($(this).find("option:selected").text().toLowerCase()));
                TypeDrCrArray.push($(this).val());
            }
        });

        $("#tableImport tbody tr").each(function (index, elem) {
            const dr_cr = $.trim($(elem).find("td.dr_cr").text().toLowerCase());
            const ind   = $.inArray(dr_cr, TypeDrCrArray);
            if (ind == -1) {
                $(elem).find("td.dr_cr").addClass("inputerror");
                $.notify({ message : "Dr/Cr Mismatched...!!!" }, { type : "danger" });
                Window.validateExcelSheetflag = true;
            } else {
                $(elem).find("td.dr_cr").attr("data-dr_cr_id", TypeDrCrArray[ind + 1]);
            }
        });
        return Window.validateExcelSheetflag;
    };

    const getVlidateCustomerNameExist = () => {

        let flag             = null;
        const table          = document.getElementById("tableImport");
        const rowCount       = table.rows.length;
        const supplierDetail = [];
        for (var r = 1; r < rowCount; r++) {
            if (table.rows[r].cells[1].innerText.trim() !== "-") {
                const supplierObject    = {};
                supplierObject.spid     = document.getElementById("txtAccountIdHidden").value.trim();
                supplierObject.pid      = document.getElementById("txtPid").value.trim();
                supplierObject.date     = document.getElementById("current_date").value.trim();
                supplierObject.etype    = VoucherEtype;
                supplierObject.level3   = document.getElementById("supplierLevel3").value.trim();
                supplierObject.active   = 1;
                supplierObject.name     = table.rows[r].cells[1].innerText.trim();
                supplierObject.uname    = table.rows[r].cells[2].innerText.trim();
                supplierObject.phone    = table.rows[r].cells[3].innerText.trim();
                supplierObject.city     = table.rows[r].cells[4].innerText.trim();
                supplierObject.cityarea = table.rows[r].cells[5].innerText.trim();
                supplierObject.address  = table.rows[r].cells[6].innerText.trim();
                supplierObject.ntn      = table.rows[r].cells[7].innerText.trim();
                supplierObject.amount   = table.rows[r].cells[8].innerText.trim();
                supplierObject.type     = table.rows[r].cells[9].innerText.trim();
                if (Window.ExcelFileAccountNameFlag) {
                    flag = true;
                } else if (! (Window.ExcelFileAccountNameFlag)) {
                    flag = false;
                }
                supplierDetail.push(supplierObject);
            }
        }

        if (flag == true) {
            $.notify({ message : "Supplier Name Is Already Saved...!!!" }, { type : "danger" });
        } else if (flag == false) {
            SaveSupplierExcelSheetFile(supplierDetail, VoucherEtype);
        }

    };

    const SaveSupplierExcelSheetFile = (supplierDetail, etype) => {
        $.ajax({
            url      : `${fileUrl}/saveSupplierExcelSheetFile`,
            type     : "POST",
            data     : {
                "supplierDetail" : JSON.stringify(supplierDetail),
                "etype"          : etype
            },
            dataType : "JSON",
            success  : function (response) {
                if (response.status == false && response.message !== "" && response.error !== "") {
                    _getAlertMessage("Error!", response.message, "danger");
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage("Information!", response.message, "info");
                } else {
                    _getAlertMessage("Success!", response.message, "success");
                    general.reloadWindow();
                }
            },
            error    : function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    const validateSaveExcelSheet = () => {
        var errorFlag = false;
        if ($("#input-excel")[0].files.length === 0) {
            $.notify({ message : "Please Import Excel File" }, { type : "danger" });
            errorFlag = true;
        }
        var $flag = false;
        $flag     = highlightDuplicates();
        if ($flag === true) {
            errorFlag = true;
        }
        return errorFlag;
    };

    const resetField = () => {
        const resetArry = ["supplierHiddenId", "supplierName", "nativeSupplierName", "supplierAddress", "nativeSupplierAddress", "supplierMobile", "supplierPhone", "supplierLevel3", "supplierContactPerson", "supplierNTN", "supplierEmail", "supplierCNIC", "supplierCountry", "supplierCity", "supplierCityArea"];
        clearValueAndText(resetArry, "#");
        $("#supplierLevel3").val(baseConfiguration.supplierslevel3).trigger("change.select2");
    };

    const resetVoucher = () => {
        resetField();
        $(modalInstance).modal("hide");
        getSupplierDataTable();
    };

    var getSaveObject = function () {
        const supplier = {
            pid            : $("#supplierHiddenId").val(),
            name           : $("#supplierName").val(),
            uname          : $("#nativeSupplierName").val(),
            address        : $("#supplierAddress").val(),
            uaddress       : $("#nativeSupplierAddress").val(),
            mobile         : $("#supplierMobile").val(),
            phone          : $("#supplierPhone").val(),
            level3         : $("#supplierLevel3").val(),
            contact_person : $("#supplierContactPerson").val(),
            ntn            : $("#supplierNTN").val(),
            email          : $("#supplierEmail").val(),
            cnic           : $("#supplierCNIC").val(),
            country        : $("#supplierCountry").val(),
            city           : $("#supplierCity").val(),
            cityarea       : $("#supplierCityArea").val()
        };
        return supplier;
    };

    // saves the data into the database
    var save = function (supplier) {
        general.disableSave();
        $.ajax({
            url      : `${fileUrl}/saveSupplier`,
            type     : "POST",
            data     : { "supplierData" : JSON.stringify(supplier) },
            dataType : "JSON",
            success  : function (response) {
                if (response.status == false && response.message !== "" && response.error !== "") {
                    AlertComponent._getAlertMessage("Error!", response.message, "danger");
                } else if (response.status == false && response.message !== "") {
                    AlertComponent._getAlertMessage("Information!", response.message, "info");
                } else {
                    AlertComponent._getAlertMessage("Successfully!", response.message, "success");
                    resetVoucher();
                }
                general.enableSave();
            },
            error    : function (xhr, status, error) {
                general.enableSave();
                console.log(xhr.responseText);
            }
        });
    };

    // checks for the empty fields
    var validateSave    = function () {

        let errorFlag = false;

        const supplierName   = $("#supplierName");
        const supplierLevel3 = $("#supplierLevel3");
        const supplierEmail  = $("#supplierEmail");

        // remove the error class first
        $(".inputerror").removeClass("inputerror");

        if (! supplierName.val()) {
            supplierName.addClass("inputerror");
            errorFlag = true;
        }

        if (! supplierLevel3.val()) {
            $("#select2-supplierLevel3-container").parent().addClass("inputerror");
            errorFlag = true;
        }

        return errorFlag;
    };
    var getSupplierById = function (supplierId) {
        $.ajax({
            url      : `${fileUrl}/getSupplierById`,
            type     : "GET",
            data     : { "pid" : supplierId },
            dataType : "JSON",
            success  : function (response) {
                resetField();
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

    // generates the view
    var populateData = function (data) {
        $("#supplierAddModalId").modal("show");
        $(".inputerror").removeClass("inputerror");
        $("#supplierHiddenId").val(data.pid);
        $("#supplierName").val(data.name);
        $("#nativeSupplierName").val(data.uname);
        $("#supplierAddress").val(data.address);
        $("#nativeSupplierAddress").val(data.uaddress);
        $("#supplierMobile").val(data.mobile);
        $("#supplierPhone").val(data.phone);
        $("#supplierLevel3").val(data.level3).trigger("change.select2");
        $("#supplierContactPerson").val(data.contact_person);
        $("#supplierNTN").val(data.ntn);
        $("#supplierEmail").val(data.email);
        $("#supplierCNIC").val(data.cnic);
        $("#supplierCountry").val(data.country);
        $("#supplierCity").val(data.city);
        $("#supplierCityArea").val(data.cityarea);
    };

    let searchSupplierDataTable = undefined;
    const getSupplierDataTable  = (voucherType = "", itemType = "") => {
        if (typeof searchSupplierDataTable !== "undefined") {
            searchSupplierDataTable.destroy();
            $("#supplierViewListTbody").empty();
        }
        searchSupplierDataTable = $("#supplierViewList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url  : `${base_url}/account/supplier/getSupplierDataTable`,
                data : function (data) {
                    data.params = {
                        sac         : "",
                        voucherType : voucherType,
                        itemType    : itemType
                    };
                }
            },
            autoWidth  : false,
            buttons    : true,
            searching  : true,
            columns    : [{
                data           : null,
                className      : "select",
                searchable     : false,
                orderable      : false,
                defaultContent : "",
                render         : function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            }, {
                data      : "spid",
                name      : "spid",
                className : "spid"
            }, {
                data      : "name",
                name      : "name",
                className : "text-left name"
            }, {
                data      : "level3_name",
                name      : "lastLevel.name",
                className : "level3_name"
            }, {
                data      : "mobile",
                name      : "mobile",
                className : "mobile_number"
            }, {
                data       : null,
                className  : "select text-right",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row) {
                    let buttons = "<button class=\"btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-supplier\" data-vrnoa_hide=\"" + row.pid + "\" data-toggle=\"tooltip\" data-title=\"View Detail On Modal\"><i class=\"fa fa-edit\"></i></button>";
                    if (row.active == "1") {
                        buttons += "<a href=\"#\" class=\"btn btn-sm btn-outline-warning group-hover:bg-yellow-800 group-hover:border-yellow-800 group-hover:text-white btn-edit-supplierListInActive text-center ml-2\" data-tName=\"party\" data-eType=\"" + row.etype + "\" data-cName=\"active\" data-pId=\"pid\" data-action=\"/setup/inactive\" data-vrnoa=\"" + row.pid + "\"><i class=\"fas fa-times-circle\"></i></a>";
                    } else if (row.active == "0") {
                        buttons += "<a href=\"#\" class=\"btn btn-sm btn-outline-success group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white btn-edit-supplierListActive text-center ml-2\" data-tName=\"party\" data-eType=\"" + row.etype + "\" data-cName=\"active\" data-pId=\"pid\" data-action=\"/setup/active\" data-vrnoa=\"" + row.pid + "\"><i class=\"fas fa-check\"></i></a>";
                    }
                    return buttons;
                }
            }],
            createdRow : function (row, data, dataIndex) {
                $(row).addClass("group odd:bg-white even:bg-slate-50 py-1 px-1");
                $("td", row).addClass("py-1 px-1 text-md align-middle text-middle");
            }

        });
    };

    const updateSupplierListStatus = async function (supplierId) {
        const response = await makeAjaxRequest("PUT", `${fileUrl}/updateSupplierListStatus`, {
            supplierId : supplierId
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({
                title   : "Error",
                message : response.message,
                type    : "danger"
            });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({
                title   : "Warning",
                message : response.message,
                type    : "warning"
            });
        } else {
            AlertComponent.getAlertMessage({
                title   : "Successfully",
                message : response.message,
                type    : "success"
            });
            searchSupplierDataTable.ajax.reload();
        }
    };
    return {

        init : function () {
            this.bindUI();
            $(".select2").select2();
            getSupplierDataTable();
        },

        bindUI : function () {
            $("[data-toggle=\"tooltip\"]").tooltip();
            const self = this;
            $(document.body).on("click", "#supplierModalShow", function (e) {
                e.preventDefault();
                resetField();
                $(modalInstance).modal("show");
                setTimeout(function () {
                    $("#supplierName").focus();
                }, 500);
            });
            $(document.body).on("click", "#supplierSyncAlt", function (e) {
                e.preventDefault();
                getSupplierDataTable();
            });
            $("#tableImport").on("click", ".btnRowRemove", function (e) {
                e.preventDefault();
                $(this).closest("tr").remove();
            });
            $(".btnExcelFileSave").on("click", function (e) {
                if ($("#VoucherTypeHidden").val() == "edit" && $(".btnSave").data("updatebtn") == 0) {
                    alert("Sorry! you have not update rights..........");
                } else if ($("#VoucherTypeHidden").val() == "new" && $(".btnSave").data("insertbtn") == 0) {
                    alert("Sorry! you have not insert rights..........");
                } else {
                    e.preventDefault();
                    var isValid = validateSaveExcelSheet(); // checks for the empty fields
                    if (! isValid) {
                        getVlidateCustomerNameExist();
                    } else {

                    }
                }
            });
            $("#supplierEmail").on("change", function () {
                const EMail = $.trim($(this).val()).toLowerCase();
                if (validateEmail(EMail)) {
                    $("#supplierEmail").removeClass("inputerror");
                } else {
                    $("#supplierEmail").addClass("inputerror");
                    $("#supplierEmail").focus();
                    return AlertComponent._getAlertMessage("Error!", "The email must be a valid email address.", "danger");
                }
            });

            $("#supplierLevel3").on("change", function () {
                var l3 = $(this).find("option:selected").text();
                var l2 = $(this).find("option:selected").data("level2");
                var l1 = $(this).find("option:selected").data("level1");
                $("#accountTypeLevel3").html(l3);
                $("#accountTypeLevel2").html(l2);
                $("#accountTypeLevel1").html(l1);
            });
            $("#supplierLevel3").val(baseConfiguration.supplierslevel3).trigger("change");
            shortcut.add("F10", function () {
                $("#supplierSaveButton").get()[0].click();
            });
            // when save button is clicked
            $("#supplierSaveButton").on("click", function (e) {
                e.preventDefault();
                self.initSave();
            });
            shortcut.add("F5", function () {
                $("#supplierResetButton").get()[0].click();
            });

            $("#supplierResetButton").on("click", function (e) {
                e.preventDefault();
                resetVoucher();
            });
            // when edit button is clicked inside the table view
            $(document.body).on("click", ".btn-edit-supplier", function (e) {
                e.preventDefault();
                var supplierId = $(this).data("vrnoa_hide");
                getSupplierById(supplierId);
            });
            $(document.body).on("click", ".btn-edit-supplierListActive", async function (e) {
                e.preventDefault();
                const supplierId = $(this).data("vrnoa");
                await updateSupplierListStatus(supplierId);
            });
            $(document.body).on("click", ".btn-edit-supplierListInActive", async function (e) {
                e.preventDefault();
                const supplierId = $(this).data("vrnoa");
                await updateSupplierListStatus(supplierId);
            });
        },

        // makes the voucher ready to save
        initSave : function () {
            const isValid    = validateSave();
            const accountObj = getSaveObject();
            if (isValid) {
                return AlertComponent._getAlertMessage("Error!", "Correct the errors", "danger");
            }
            save(accountObj);
        }
    };
};

var suppliers = new Suppliers();
suppliers.init();
