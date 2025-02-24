import AlertComponent from "../../../../js/components/AlertComponent.js";
import { designationApiEndpoints } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText } from "../commonFunctions/CommonFunction.js";

var Designation = function () {
    const $modalInstance = $('#designationAddModalId');
    var save = async function (designation) {
        const response = await makeAjaxRequest('POST', designationApiEndpoints.saveDesignation, {
            designationData: JSON.stringify(designation)
        });
        if (response.status == false && response.error !== "") {
            AlertComponent._getAlertMessage('Error!', response.message, 'danger');
        } else if (response.status == false && response.message !== "") {
            AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
        } else {
            AlertComponent._getAlertMessage('Successfully!', response.message, 'success');

            resetVoucher();
            $($modalInstance).modal('hide');
        }
    };

    var getDesignationById = async function (designationId) {
        const response = await makeAjaxRequest('GET', designationApiEndpoints.getDesignationById, {
            designationId: designationId
        });
        resetVoucher();
        if (response.status == false && response.error !== "") {
            AlertComponent._getAlertMessage('Error!', response.message, 'danger');
        } else if (response.status == false && response.message !== "") {
            AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
        } else {
            $($modalInstance).modal('show');
            populateData(response.data);
        }
    };

    var populateData = function (elem) {
        $('#designationHiddenId').val(elem.id);
        $('#designationName').val(elem.name);
        $('#designationNativeName').val(elem.native_name);
        $('#designationDescription').val(elem.description);
    };

    // checks for the empty fields
    var validateSave = function () {

        var errorFlag = false;

        const designationName = $.trim($('#designationName').val());
        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (designationName === '') {
            $('#designationName').addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    };

    var getSaveObject = function () {
        var obj = {};
        obj.id = $.trim($('#designationHiddenId').val());
        obj.name = $.trim($('#designationName').val());
        obj.native_name = $.trim($('#designationNativeName').val());
        obj.description = $.trim($('#designationDescription').val());
        return obj;
    };
    let designationDataTable = undefined;
    const getDesignationDataTable = () => {
        if (typeof designationDataTable !== 'undefined') {
            designationDataTable.destroy();
            $('#designationViewListTbody').empty();
        }
        designationDataTable = $("#designationViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${designationApiEndpoints.getDesignationDataTable}`,
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
                    data: "id",
                    name: 'id',
                    className: "id",
                },
                {
                    data: "name",
                    name: 'name',
                    className: "text-left name",
                },
                {
                    data: "native_name",
                    name: 'native_name',
                    className: "native_name"
                },
                {
                    data: "description",
                    name: 'description',
                    className: "description"
                },
                {
                    data: null,
                    className: "select text-right",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-designation" data-vrnoa_hide="' + row.id + '" data-toggle="tooltip" data-title="View Detail On Modal"><i class="fa fa-edit"></i></button>';
                        if (row.is_active == "1") {
                            buttons += '<a href="#" class="btn btn-sm btn-outline-warning group-hover:bg-yellow-800 group-hover:border-yellow-800 group-hover:text-white btn-edit-designationListActive text-center ml-2" data-vrnoa="' + row.id + '"><i class="fas fa-times-circle"></i></a>';
                        } else if (row.is_active == "0") {
                            buttons += '<a href="#" class="btn btn-sm btn-outline-success group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white btn-edit-designationListInActive text-center ml-2" data-vrnoa="' + row.id + '"><i class="fas fa-check"></i></a>';
                        }
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
    const resetField = () => {
        const resetArry = [
            'designationHiddenId',
            'designationName',
            'designationNativeName',
            'designationDescription'
        ];
        clearValueAndText(resetArry, '#');
        $('.inputerror').removeClass('inputerror');
    };

    const resetVoucher = () => {
        resetField();
        getDesignationDataTable();
    };
    const updateDesignationListStatus = async function (designationId) {
        const response = await makeAjaxRequest('PUT', `${designationApiEndpoints.updateDesignationListStatus}`, {
            designationId: designationId
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ title: 'Error', message: response.message, type: 'danger' });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ title: 'Warning', message: response.message, type: 'warning' });
        } else {
            AlertComponent.getAlertMessage({ title: 'Successfully', message: response.message, type: 'success' });
            designationDataTable.ajax.reload();
        }
    };

    return {

        init: function () {
            this.bindUI();
            getDesignationDataTable();
        },

        bindUI: function () {
            $('[data-toggle="tooltip"]').tooltip();

            const self = this;
            $(document.body).on('click', '#designationModalShow', function (e) {
                e.preventDefault();
                resetField();
                $($modalInstance).modal('show');
                setTimeout(function () {
                    $('#designationName').focus();
                }, 500);
            });
            $(document.body).on('click', '#designationSyncAlt', function (e) {
                e.preventDefault();
                getDesignationDataTable();
            });
            shortcut.add("F10", function () {
                $('#designationSaveButton').get()[0].click();
            });
            shortcut.add("F5", function () {
                $('#designationResetButton').get()[0].click();
            });
            $('#designationSaveButton').on('click', function (e) {
                e.preventDefault();
                self.initSave();
            });

            $('#designationResetButton').on('click', function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $('body').on('click', '.btn-edit-designation', async function (e) {
                e.preventDefault();
                await getDesignationById($(this).data('vrnoa_hide'));
            });
            $(document.body).on('click', '.btn-edit-designationListActive', async function (e) {
                e.preventDefault();
                const designationId = $(this).data('vrnoa');
                await updateDesignationListStatus(designationId);
            });
            $(document.body).on('click', '.btn-edit-designationListInActive', async function (e) {
                e.preventDefault();
                const designationId = $(this).data('vrnoa');
                await updateDesignationListStatus(designationId);
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
            general.reloadWindow();
        }
    };
};

var designation = new Designation();
designation.init();
