import { appendSelect2ValueIfDataExists, clearValueAndText, padNumberWithLeadingCharacters, updateDatepickerWithFormattedDate } from './../commonFunctions/CommonFunction.js';
import DynamicOption from '../../../../js/components/DynamicOption.js';
import { dropdownOptions } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from '../../../../js/components/MakeAjaxRequest.js';
import AlertComponent from '../../../../js/components/AlertComponent.js';
import { baseConfiguration } from '../../../../js/components/ConfigurationManager.js';
var AddItem = function () {

    const getMaxItemId = `${base_url}/item/getMaxItemId`;
    const getItemById = `${base_url}/item/getItemById`;
    const saveItem = `${base_url}/item/saveItem`;

    var save = async function (item) {
        general.disableSave();

        try {
            const response = await makeAjaxRequest('POST', `${saveItem}`, item, 'json', { processData: false, contentType: false });
            if (response.status == false && response.message !== "" && response.error !== "") {
                AlertComponent.getAlertMessage({ title: "Error!", message: response.message, type: "danger" });
            } else if (response.status == false && response.message !== "") {
                AlertComponent.getAlertMessage({ title: "Information!", message: response.message, type: "info" });
            } else {
                AlertComponent.getAlertMessage({ title: "Successfully!", message: response.message, type: "success" });
                addItem.resetVoucher();
            }
        } catch (error) {
            console.log(error);
        } finally {
            general.enableSave();
        }
    };

    // gets the image uploaded and show it to the user
    var getImage = function () {

        var file = $('#itemImage').get(0).files[0];
        if (file) {
            if (!!file.type.match(/image.*/)) {
                if (window.FileReader) {
                    reader = new FileReader();
                    reader.onloadend = function (e) {
                        //showUploadedItem(e.target.result, file.fileName);
                        $('#itemImageDisplay').attr('src', e.target.result);
                        delete addItem.photo;
                    };
                    reader.readAsDataURL(file);
                }
            }
        }

        return file;
    };

    var fetchItem = function (item_id) {
        $.ajax({
            url: `${getItemById}`,
            type: 'GET',
            data: { 'item_id': item_id },
            dataType: 'JSON',
            success: function (response) {
                $('#itemImageDisplay').attr('src', base_url + 'assets/img/blank_image.png');
                if (response.status == false && response.message !== "" && response.error !== "") {
                    _getAlertMessage('Error!', response.message, 'danger');
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage('Information!', response.message, 'info');
                    addItem.resetVoucher();
                } else {
                    resetFields();
                    populateItemData(response.data);
                }
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    var populateItemData = function (data) {
        $('#itemIdHidden').val(data.item_id);
        const active = (parseNumber(data.active) === 1);
        const taxexempt = (parseNumber(data.taxexempt) === 1);
        $('#txtItemStatus').prop('checked', active).trigger('change');
        $('#active2').bootstrapSwitch('state', taxexempt);

        const itemType = parseNumber(data.item_type);
        if ((itemType === 0)) {
            $('#text-Inventory-0').prop('checked', true).trigger('change');
        } else {
            $('#text-Inventory-1').prop('checked', true).trigger('change');
        }

        $('input[name="text-Inventory-Non-Inventory"]').addClass('disabled cursor-not-allowed').prop('disabled', true);

        updateDatepickerWithFormattedDate('current_date', data.open_date);

        appendSelect2ValueIfDataExists("itemCategoryDropdown", "item_category", "catid", "name", data);
        appendSelect2ValueIfDataExists("itemSubCategoryDropdown", "item_sub_category", "subcatid", "name", data);
        appendSelect2ValueIfDataExists("itemBrandDropdown", "item_brand", "bid", "name", data);
        appendSelect2ValueIfDataExists("itemMadeDropdown", "item_made", "made_id", "name", data);

        $('#txtShortCode').val(data.short_code);
        $('#txtItemBarCode').val(data.item_barcode);
        $('#txtDescription').val(data.item_des);
        $('#txtUname').val(data.uname);
        $('#txtMinLevel').val(data.min_level);
        $('#txtMaxLevel').val(data.max_level);
        $('#uom_dropdown').val(data.uom);

        appendSelect2ValueIfDataExists("stockKeepingMethodDropdown", "stock_keeping_method", "id", "name", data);
        appendSelect2ValueIfDataExists("itemCalculationMethodDropdown", "item_calculation_method", "id", "name", data);
        appendSelect2ValueIfDataExists("txtItemWarehouse", "item_department", "did", "name", data);

        $('#txtPurPrice').val(data.cost_price);
        $('#txtSalePrice').val(data.srate);
        $('#txtWHRate').val(data.srate1);
        $('#txtComm').val(data.srate2);
        $('#txtDiscountPer').val(data.item_discount);
        $('#txtPurDiscountPer').val(data.item_pur_discount);
        $('#taxrate').val(data.taxrate);
        $('#txtRemarks').val(data.description);
        // appendSelect2ValueIfDataExists("ingred_dropdown", data.item_calculation_method.id, data.item_calculation_method.name);
        $('#ingred_dropdown').val(data.ingred_item_id);
        $('#ingred_uom').val(data.ingred_uom);
        $('#ingred_uom_qty').val(data.ingred_uom_qty);
        $('#ingred_cost').val(data.ingred_cost);
        $('#ingred_packing').val(data.ingred_packing);
        $('#tare_per_unit').val(data.tare_per_unit);

        appendSelect2ValueIfDataExists("inventory_dropdown", "item_inventory_account", "pid", "name", data);
        appendSelect2ValueIfDataExists("cost_dropdown", "item_cost_account", "pid", "name", data);
        appendSelect2ValueIfDataExists("income_dropdown", "item_income_account", "pid", "name", data);
        // set image
        if (data.photoPath !== "") {
            $('#itemImageDisplay').attr('src', `${data.photoPath}`);
        }

    };
    // gets the max id of the voucher
    var getMaxId = function () {
        $.ajax({
            url: `${getMaxItemId}`,
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                $('#txtItemBarCode').val(padNumberWithLeadingCharacters(data, 4));
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    const getSaveObject = () => {
        const Inventory_Non_Inventory = $('input[name="text-Inventory-Non-Inventory"]:checked').val();
        const itemObj = {
            item_id: $.trim($('#itemIdHidden').val()),
            active: ($('#txtItemStatus').prop('checked') === true) ? 1 : 0,
            catid: $('#itemCategoryDropdown').val(),
            subcatid: $('#itemSubCategoryDropdown').val(),
            bid: $('#itemBrandDropdown').val() || null,
            made_id: $('#itemMadeDropdown').val(),
            short_code: $.trim($('#txtShortCode').val()),
            item_barcode: $('#txtItemBarCode').val().trim() || padNumberWithLeadingCharacters(($('#txtItemBarCode').val().trim()), 4),
            item_des: $.trim($('#txtDescription').val()),
            uname: $('#txtUname').val(),
            min_level: $.trim($('#txtMinLevel').val()),
            max_level: $.trim($('#txtMaxLevel').val()),
            uom: $.trim($('#uom_dropdown').val()),
            stock_keeping_method_id: $.trim($('#stockKeepingMethodDropdown').val()),
            item_calculation_method_id: $.trim($('#itemCalculationMethodDropdown').val()),
            cost_price: $.trim($('#txtPurPrice').val()),
            srate: $.trim($('#txtSalePrice').val()),
            srate1: $.trim($('#txtWHRate').val()),
            srate2: $.trim($('#txtComm').val()),
            item_discount: $.trim($('#txtDiscountPer').val()),
            item_pur_discount: $.trim($('#txtPurDiscountPer').val()),
            taxrate: $.trim($('#taxrate').val()),
            description: $.trim($('#txtRemarks').val()),
            taxexempt: ($('#active2').bootstrapSwitch('state') === true) ? 1 : 0,
            ingred_item_id: $.trim($('#ingred_dropdown').val()),
            ingred_uom: $.trim($('#ingred_uom').val()),
            ingred_packing: $.trim($('#ingred_packing').val()),
            ingred_uom_qty: $.trim($('#ingred_uom_qty').val()),
            ingred_cost: $.trim($('#ingred_cost').val()),
            inventory_id: $('#inventory_dropdown').val(),
            cost_id: $('#cost_dropdown').val(),
            income_id: $('#income_dropdown').val(),
            department_id: $('#txtItemWarehouse').val(),
            tare_per_unit: $('#tare_per_unit').val(),
            item_type: (Inventory_Non_Inventory === 'Non-Inventory') ? 1 : 0,
        };

        if (addItem.photo != undefined) {
            itemObj.photo_del = addItem.photo;
        }

        const form_data = new FormData();
        for (const key in itemObj) {
            form_data.append(key, itemObj[key]);
        }
        // form_data.append("photo", getImage());
        return form_data;
    };

    var getNumVal = function (el) {
        return isNaN(parseFloat(el.val())) ? 0 : parseFloat(el.val());
    };

    // checks for the empty fields
    const validateSave = () => {
        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        let errorFlag = false;
        const Item_Name = $.trim($('#txtDescription').val());
        const Item_Category = $('#itemCategoryDropdown').val();
        const Item_SubCategory = $('#itemSubCategoryDropdown').val();
        const Item_Brand = $('#itemBrandDropdown').val();
        const itemWarehouse = $('#txtItemWarehouse').val();

        const Item_Inventory_Id = $('#inventory_dropdown').val();
        const Item_Cost_Id = $('#cost_dropdown').val();
        const Item_Income_Id = $('#income_dropdown').val();

        const Inventory_Non_Inventory = $('input[name="text-Inventory-Non-Inventory"]:checked').val();

        if (Item_Name === '' || Item_Name === null) {
            $('#txtDescription').addClass('inputerror');
            errorFlag = true;
        }

        if (Inventory_Non_Inventory === 'Inventory') {

            if (!Item_Category) {
                $('#select2-itemCategoryDropdown-container').parent().addClass('inputerror');
                errorFlag = true;
            }

            if (!Item_SubCategory) {
                $('#select2-itemSubCategoryDropdown-container').parent().addClass('inputerror');
                errorFlag = true;
            }

            if (!itemWarehouse) {
                $('#select2-txtItemWarehouse-container').parent().addClass('inputerror');
                errorFlag = true;
            }
        }

        if (!Item_Inventory_Id) {
            $('#select2-inventory_dropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }

        if (!Item_Cost_Id) {
            $('#select2-cost_dropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }

        if (!Item_Income_Id) {
            $('#select2-income_dropdown-container').parent().addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    };

    var Print_Barcode = function (hd, prnt, barcodeprintsize) {
        var print_size = $("input[name='38x28_mm']:checked").val();
        if (prnt == 'lg' && print_size == '38x28_mm') {
            window.open(base_url + "application/views/reportprints/barcode38x28mm.php?hd=" + hd + "&print=" + prnt, + "&barcodeprintsize=" + barcodeprintsize, "Purchase Report", 'width=1210, height=842');
        } else if (prnt == 'lg' && print_size == '58x40_mm') {
            window.open(base_url + "application/views/reportprints/barcode58X40mm.php?hd=" + hd + "&print=lg_58X40", "Purchase Report", 'width=1210, height=842');
        } else if (prnt == 'lg' && print_size == '38x28_mm1up') {
            window.open(base_url + "application/views/reportprints/barcode38x28mm1up.php?hd=" + hd + "&print=lg_38X28", "Purchase Report", 'width=1210, height=842');
        }
    };

    const resetIngredients = () => {
        $('#ingred_dropdown').val('').trigger('change');
        $('#ingred_uom').val('');
        $('#ingred_uom_qty').val('');
        $('#ingred_cost').val('');
    };
    const updateGLaccounts = () => {
        appendSelect2ValueIfDataExists("inventory_dropdown", "inventory_account", "pid", "name", settingConfigur);
        appendSelect2ValueIfDataExists("cost_dropdown", "cost_account", "pid", "name", settingConfigur);
        appendSelect2ValueIfDataExists("income_dropdown", "income_account", "pid", "name", settingConfigur);
    };

    var resetFields = function () {
        const resetElements = [
            "ingred_dropdown",
            "ingred_cost",
            "ingred_packing",
            "ingred_uom_qty",
            "ingred_uom",
            "itemIdHidden",
            "txtComm",
            "txtDescription",
            "txtDiscountPer",
            "txtItemBarCode",
            "txtMaxLevel",
            "txtMinLevel",
            "txtPurDiscountPer",
            "txtPurPrice",
            "txtRemarks",
            "txtSalePrice",
            "txtShortCode",
            "txtUname",
            "txtWHRate",
            "uom_dropdown",
            "itemCategoryDropdown",
            "itemSubCategoryDropdown",
            "itemBrandDropdown",
            "itemMadeDropdown",
            "stockKeepingMethodDropdown",
            "itemCalculationMethodDropdown",
            "txtItemWarehouse",
            "tare_per_unit",
        ];
        clearValueAndText(resetElements, '#');
        updateGLaccounts();
        $('#itemImageDisplay').attr('src', ``);
        $('#taxrate').val(baseConfiguration.taxrate);

    };

    let itemDataTable = undefined;
    const getItemDataTable = (voucherType = "", itemType = null) => {
        if (typeof itemDataTable !== 'undefined') {
            itemDataTable.destroy();
            $('#text-item-table tbody').empty();
        }
        const columnsArray = getColumnWithItemType(itemType);
        itemDataTable = $("#text-item-table").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: base_url + '/item/getItemListViewRecord',
                data: function (data) {
                    data.params = {
                        sac: "",
                        voucherType: voucherType,
                        itemType: itemType,
                    };
                }
            },
            autoWidth: false,
            buttons: true,
            searching: true,
            columns: columnsArray,
            createdRow: function (row, data, dataIndex) {
                $(row).addClass('group odd:bg-white even:bg-slate-50 py-1 px-1');
                $('td', row).addClass('py-1 px-1 text-md align-middle text-middle');
            }
        });
    };

    const getColumnWithItemType = (itemType) => {
        return [{
            data: null,
            className: "select",
            searchable: false,
            orderable: false,
            render: function (data, type, row, meta) {
                return meta.row + 1;
            }
        },
        {
            data: "item_type",
            name: 'items.item_type',
            className: "item_type",
        },
        {
            data: "category_name",
            name: 'categories.name',
            className: "text-left category_name",
        },
        {
            data: "subcategory_name",
            name: 'sub_categories.name',
            className: "subcategory_name"
        },
        {
            data: "brand_name",
            name: 'brands.name',
            className: "brand_name"
        },
        {
            data: "item_des",
            name: 'items.item_des',
            className: "item_des"
        },
        {
            data: "cost_price",
            name: 'items.cost_price',
            className: "cost_price"
        },
        {
            data: "srate",
            name: 'items.srate',
            className: "srate"
        },
        {
            data: null,
            className: "select text-right",
            searchable: false,
            orderable: false,
            render: function (data, type, row) {
                let buttons = `<button type="button" class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 ${dataCallFromAddNewItem ? 'btn-edit-item' : 'populateItem'}" data-itemid="${data.item_id}"> <i class='fa fa-edit'></i> </button>`;
                if (row.active == "1") {
                    buttons += '<a href="#" class="btn btn-sm btn-outline-warning group-hover:bg-yellow-800 group-hover:border-yellow-800 group-hover:text-white btn-edit-itemListActive text-center ml-2" data-item_id="' + data.item_id + '"><i class="fas fa-times-circle"></i></a>';
                } else if (row.active == "0") {
                    buttons += '<a href="#" class="btn btn-sm btn-outline-success group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white btn-edit-itemListInActive text-center ml-2" data-item_id="' + data.item_id + '"><i class="fas fa-check"></i></a>';
                }
                return buttons;
            }
        }
        ]
    }

    const updateItemListStatus = async function (itemId) {
        const response = await makeAjaxRequest('PUT',
            `${base_url}/item/updateItemListStatus`, {
            itemId: itemId
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({
                title: 'Error',
                message: response.message,
                type: 'danger'
            });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({
                title: 'Warning',
                message: response.message,
                type: 'warning'
            });
        } else {
            AlertComponent.getAlertMessage({
                title: 'Successfully',
                message: response.message,
                type: 'success'
            });
            itemDataTable.ajax.reload();
        }
    };

    return {

        init: function () {
            this.bindUI();
            $('.select2').select2();
            $('#active2').bootstrapSwitch('state', false);
            getItemDataTable();
            updateGLaccounts();
        },

        bindUI: function () {
            $('[data-toggle="tooltip"]').tooltip();
            const self = this;

            $('input[name="get-Text-Inventory-Non-Inventory"]').on('change', function (event) {
                const Item_Type = $.trim($(this).val());
                if ($(this).val() === '1') {
                    getItemDataTable("", Item_Type);
                } else {
                    getItemDataTable("", Item_Type);
                }
            });
            $('#addItemSyncAlt').on('click', function (e) {
                e.preventDefault();
                const itemType = $('input[name="get-Text-Inventory-Non-Inventory"]:checked').val();
                getItemDataTable("", itemType);
            });

            $('#tableImport').on('click', '.btnRowRemove', function (e) {
                e.preventDefault();
                $(this).closest('tr').remove();
            });

            $('#ingred_dropdown').on('change', function () {
                var prate = $(this).find('option:selected').data('prate');
                var uom = $(this).find('option:selected').data('uom');
                var has = "";
                $('#ingred_cost').val(has);
                $('#ingred_uom').val(uom);
            });
            $('#btnremoverow').on('click', function (e) {
                e.preventDefault();
                resetIngredients();
            });
            $('#txtPurPrice,#ingred_uom_qty').on('input', function (e) {
                e.preventDefault();
                var cost = getNumVal($('#txtPurPrice'));
                var ingred_uom_qty = getNumVal($('#ingred_uom_qty'));
                if (ingred_uom_qty == 0) {
                    $('#ingred_cost').val(0);
                } else {
                    $('#ingred_cost').val(parseFloat(cost / ingred_uom_qty).toFixed(2));
                }
            });

            $("#active2").bootstrapSwitch('offText', 'No');
            $("#active2").bootstrapSwitch('onText', 'Yes');

            $('input[name="text-Inventory-Non-Inventory"]').on('change', function (event) {
                if ($(this).val() === 'Non-Inventory') {
                    $('#text-col-lg-9-change-to-col-lg-12').removeClass('col-lg-9');
                    $('#text-col-lg-9-change-to-col-lg-12').addClass('col-xs-12 col-sm-12 col-md-12 col-lg-12');
                    $('#text-div-Category-subCategory-brand-made-hide').hide();
                    $('#text-div-StockKeepingMethod-hide').hide();
                    $('#text-div-CalculationMethodType-hide').hide();
                    $('#text-div-Category-subCategory-brand-hide').hide();
                    $('#text-div-item-image-hide').hide();
                    $('#text-div-item-min-level-remarks').hide();
                    $('#text-div-item-min-level-production-module').hide();
                    $('#text-div-cost-hide').hide();
                    $('#text-inventory-dropdown').text('Expenses');
                    $('#text-div-stock-rateType-warehouse-hide').hide();
                } else {
                    $('#text-col-lg-9-change-to-col-lg-12').addClass('col-lg-9');
                    $('#text-col-lg-9-change-to-col-lg-12').removeClass('col-xs-12 col-sm-12 col-md-12 col-lg-12');
                    $('#text-div-Category-subCategory-brand-made-hide').show();
                    $('#text-div-stock-rateType-warehouse-hide').show();
                    $('#text-div-StockKeepingMethod-hide').show();
                    $('#text-div-CalculationMethodType-hide').show();
                    $('#text-div-Category-subCategory-brand-colshow').show();
                    $('#text-div-item-image-hide').show();
                    $('#text-div-item-min-level-remarks').show();
                    $('#text-div-item-min-level-production-module').show();
                    $('#text-div-cost-hide').show();
                    $('#text-inventory-dropdown').text('Inventory');
                }
            });
            // when btnSave is clicked
            $('.btnSave').on('click', function (e) {
                e.preventDefault();
                self.initSave();
            });
            // when btnReset is clicked
            $('.btnReset').on('click', function (e) {
                e.preventDefault();		// removes the default behavior of the click event
                self.resetVoucher();

            });
            $('.btnPrint').on('click', function (e) {
                e.preventDefault();		// removes the default behavior of the click event
                window.open(base_url + 'application/views/reportprints/barcode_report.php', "Purchase Report", 'width=1210, height=842');
            });
            // when image is changed
            $('#itemImage').on('change', function () {
                getImage();
            });
            $('#removeImg').on('click', function (e) {
                e.preventDefault();
                var src = $('#itemImageDisplay').attr('src');
                if (confirm("Are you sure to delete this image?") && src.length > 0) {
                    $('#itemImageDisplay').attr('src', base_url + 'assets/img/blank_image.png');
                    $("#itemImage").val(null);
                    addItem.photo = '1';
                }
            });
            $('.btn-Compony').on('click', function (e) {
                e.preventDefault();
                $('#txthiddenValueM').val('1');
            });
            $('.btn-ComponyRate').on('click', function (e) {
                e.preventDefault();
                $('#txthiddenValueM').val('11');
            });
            $('.btn-Rate').on('click', function (e) {
                e.preventDefault();
                $('#txthiddenValueM').val('01');
            });
            $('.btn-wComponyRate').on('click', function (e) {
                e.preventDefault();
                $('#txthiddenValueM').val('00');
            });
            $('.btnPrintBarcodeCompany').on('click', function (e) {
                e.preventDefault();
                var hd = $('#txthiddenValueM').val();
                var print = $("input[name='optradio']:checked").val();
                var barcodeprintsize = $('#txtprint').val();
                Print_Barcode(hd, print, barcodeprintsize);
            });
            // when edit button is clicked inside the table view
            $('table').on('click', '.btn-edit-item', function (e) {
                e.preventDefault();
                fetchItem($(this).data('itemid'));		// get the class detail by id
                $('a[href="#Main"]').trigger('click');
                $('#text-Inventory-0').prop('checked', true).trigger('change');

            });
            $(document.body).on('click', '.btn-edit-itemListActive', async function (e) {
                e.preventDefault();
                const itemId = $(this).data('item_id');
                await updateItemListStatus(itemId);
            });
            $(document.body).on('click', '.btn-edit-itemListInActive', async function (e) {
                e.preventDefault();
                const itemId = $(this).data('item_id');
                await updateItemListStatus(itemId);
            });

            $('#txtIngredients_refresh').click(function (e) {
                e.preventDefault();
                getItemDetail(1, 'ingredient_categories', '#ingred_dropdown');
            });
            $('.getItemLookUpRecord').on('click', function (e) {
                e.preventDefault();
                getItemLookUpRecord('', '');
            });

            $('#txtDisabledGLAccountOffItemRights *').prop('disabled', true);
            shortcut.add("F10", function () {
                $('.btnSave').get()[0].click();
            });
            shortcut.add("F5", function () {
                $('.btnReset').get()[0].click();
            });
            getMaxId();
            addItem.fetchRequestedVr();
        },
        fetchRequestedVr: function () {
            const voucherNumber = parseNumber(general.getQueryStringVal('vrnoa'));
            if (voucherNumber > 0) {
                fetchItem(voucherNumber);
                $('a[href="#Main"]').trigger('click');
            } else {
                getMaxId();
            }
        },
        // prepares the data to save it into the database
        initSave: async function () {
            const errorFlag = validateSave();
            if (errorFlag) {
                AlertComponent.getAlertMessage({ title: "Error!", message: "Correct the errors...", type: "danger" });
                return;
            }
            await save(getSaveObject());
        },
        // resets the voucher to its default state
        resetVoucher: function () {
            $('.inputerror').removeClass('inputerror');
            $('#active2').bootstrapSwitch('state', true);
            $('input[name="text-Inventory-Non-Inventory"]').removeClass('disabled cursor-not-allowed').prop('disabled', false).trigger('change');
            $('#text-Inventory-0').prop('checked', true).trigger('change');
            $('#txtItemStatus').prop('checked', true).trigger('change');
            updateDatepickerWithFormattedDate('current_date', new Date());
            getMaxId();
            resetFields();
        }
    };
};

var addItem = new AddItem();
addItem.init();
// Corrected function to match the HTML ID
$(function () {
    new DynamicOption('#itemCategoryDropdown', {
        requestedUrl: dropdownOptions.getAllCategory,
        placeholderText: 'Choose Category'
    });

    new DynamicOption('#itemSubCategoryDropdown', {
        requestedUrl: dropdownOptions.getAllSubCategory,
        placeholderText: 'Choose Sub Category'
    });

    new DynamicOption('#itemBrandDropdown', {
        requestedUrl: dropdownOptions.getAllBrand,
        placeholderText: 'Choose Brand'
    });

    new DynamicOption('#itemMadeDropdown', {
        requestedUrl: dropdownOptions.getAllMade,
        placeholderText: 'Choose Made'
    });


    new DynamicOption('#stockKeepingMethodDropdown', {
        requestedUrl: dropdownOptions.getStockKeepingMethod,
        placeholderText: 'Choose Keeping Method'
    });

    new DynamicOption('#itemCalculationMethodDropdown', {
        requestedUrl: dropdownOptions.getitemCalculationMethod,
        placeholderText: 'Choose Rate Type'
    });

    new DynamicOption('#inventory_dropdown', {
        requestedUrl: dropdownOptions.getAllInventoryLevel,
        placeholderText: 'Choose Inventory'
    });

    new DynamicOption('#inventory_dropdown', {
        requestedUrl: dropdownOptions.getAllInventoryLevel,
        placeholderText: 'Choose Inventory'
    });

    new DynamicOption('#cost_dropdown', {
        requestedUrl: dropdownOptions.getAllCostLevel,
        placeholderText: 'Choose Cost'
    });

    new DynamicOption('#income_dropdown', {
        requestedUrl: dropdownOptions.getAllIncomeLevel,
        placeholderText: 'Choose Cost'
    });

    new DynamicOption('#txtItemWarehouse', {
        requestedUrl: dropdownOptions.getDepartmentAll,
        placeholderText: 'Choose Warehouse'
    });

});
