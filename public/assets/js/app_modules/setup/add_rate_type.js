import { parseNumber, populateSelect2Data } from '../commonFunctions/CommonFunction.js';
var Brand = function () {
    const fileUrl = `${base_url}/item/calculationMethod`;
    var save = async function (calculationMethod) {
        general.disableSave();

        try {
            const response = await new Promise((resolve, reject) => {
                $.ajax({
                    url: `${fileUrl}/saveCalculationMethod`,
                    type: 'POST',
                    data: { 'calculationMethod': JSON.stringify(calculationMethod) },
                    dataType: 'JSON', // Set contentType to false when sending FormData
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (xhr, status, error) {
                        reject(error);
                    }
                });
            });

            if (response.status == false && response.message !== "" && response.error !== "") {
                _getAlertMessage('Error!', response.message, 'danger');
            } else if (response.status == false && response.message !== "") {
                _getAlertMessage('Information!', response.message, 'info');
            } else {
                _getAlertMessage('Successfully!', response.message, 'success');
                general.reloadWindow();
            }
        } catch (error) {
            console.log(error);
        } finally {
            general.enableSave();
        }
    };

    var fetch = function (id) {
        $.ajax({
            url: `${fileUrl}/getCalculationMethodById`,
            type: 'GET',
            data: { 'id': id },
            dataType: 'JSON',
            success: function (response) {
                if (response.status == false && response.message !== "" && response.error !== "") {
                    _getAlertMessage('Error!', response.message, 'danger');
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage('Information!', response.message, 'info');
                } else {
                    populateData(response.data);
                }
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    var populateData = function (elem) {
        $('#txtIdHidden').val(elem.id);
        $('#txtName').val(elem.name);
        $('#calculationMethodDivisionBy').val(elem.division_by);
        populateSelect2Data("calculationMethodOn", elem.calculation_on, true);
        const isMultiplier = parseNumber(elem.is_multiplier) === 0;
        $('#calculationMethodIsMultiplier').prop('checked', isMultiplier).trigger('change');
    };

    // checks for the empty fields
    var validateSave = function () {

        var errorFlag = false;

        const name = $.trim($('#txtName').val());
        const calculationMethodDivisionBy = $.trim($('#calculationMethodDivisionBy').val());
        const measurement = $.trim($('#calculationMethodOn').val());
        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (name === '') {
            $('#txtName').addClass('inputerror');
            errorFlag = true;
        }

        if (calculationMethodDivisionBy === '') {
            $('#calculationMethodDivisionBy').addClass('inputerror');
            errorFlag = true;
        }

        if (measurement === '') {
            $('#s2id_calculationMethodOn').addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    };

    var getSaveObject = function () {
        var obj = {};
        obj.id = $('#txtIdHidden').val();
        obj.name = $('#txtName').val();
        obj.division_by = $('#calculationMethodDivisionBy').val();
        obj.calculation_on = $('#calculationMethodOn').val();
        obj.is_multiplier = ($('#calculationMethodIsMultiplier').prop('checked') === true) ? 0 : 1;
        return obj;
    };

    let searchCalculationMethodsDataTable = undefined;
    const getCalculationMethodsDataTable = () => {
        if (typeof searchCalculationMethodsDataTable !== 'undefined') {
            searchCalculationMethodsDataTable.destroy();
            $('#calculationMethodsDataTableTbody').empty();
        }
        searchCalculationMethodsDataTable = $("#calculationMethodsDataTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/item/calculationMethod/getCalculationMethodDataTable`,
                data: function (data) {
                    data.params = {
                        sac: "",
                    };
                }
            },
            autoWidth: false,
            buttons: true,
            searching: true,
            columns: [
                {
                    data: null,
                    className: "select",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return meta.row + 1;
                    }
                },
                {
                    data: "name",
                    name: 'name',
                    className: "name",
                },
                {
                    data: "division_by",
                    name: 'division_by',
                    className: "text-left division_by",
                },
                {
                    data: "stock_keeping.name",
                    name: 'stockKeeping.name',
                    className: "stock_keeping_name"
                },
                {
                    data: null,
                    className: "select text-right",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-rateType" data-rate_type="' + row.id + '" data-toggle="tooltip"><i class="fa fa-edit"></i></button>';
                        return buttons;
                    }
                }
            ],
            createdRow: function (row, data, dataIndex) {
                $(row).addClass('group odd:bg-white even:bg-slate-50 py-1 px-1');
                $('td', row).addClass('py-1 px-1 text-md align-middle text-middle');
            }
        });
    };

    return {

        init: function () {
            this.bindUI();
            $('.select2').select2();

            getCalculationMethodsDataTable();
        },

        bindUI: function () {
            $('[data-toggle="tooltip"]').tooltip();
            var self = this;
            shortcut.add("F10", function () {
                $('.btnSave').get()[0].click();
            });
            shortcut.add("F6", function () {
                $('#txtId').focus();
            });
            shortcut.add("F5", function () {
                self.resetVoucher();
            });

            $('#txtId').on('change', function () {
                fetch($(this).val());
            });

            $('.btnSave').on('click', function (e) {
                e.preventDefault();
                self.initSave();
            });

            $('.btnReset').on('click', function (e) {
                e.preventDefault();
                self.resetVoucher();
            });

            $('#txtId').on('keypress', function (e) {
                if (e.keyCode === 13) {
                    if ($('#txtId').val().trim() !== "") {
                        var bid = $.trim($('#txtId').val());
                        fetch(bid);
                    }
                }
            });

            $('body').on('click', '.btn-edit-rateType', function (e) {
                e.preventDefault();
                fetch($(this).data('rate_type'));
                $('a[href="#add_calculation"]').trigger('click');
            });
        },

        initSave: function () {

            var saveObj = getSaveObject();
            var error = validateSave();

            if (!error) {
                save(saveObj);
            } else {
                alert('Correct the errors!');
            }
        },

        resetVoucher: function () {
            $('.inputerror').removeClass('inputerror');
            $('#txtIdHidden').val('');
            $('#txtName').val('');
            $('#calculationMethodDivisionBy').val('');
            $('#calculationMethodOn').val('').trigger('change.select2');
            $('#calculationMethodIsMultiplier').prop('checked', true).trigger('change');
            getCalculationMethodsDataTable();
        }
    };
};

var brand = new Brand();
brand.init();
