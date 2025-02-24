import { clearValueAndText } from "../commonFunctions/CommonFunction.js";

var PortOfDischarge = function () {
    const $modalInstance = $('#portOfDischargeAddModalId');

    var save = async function (portOfDischarge) {
        general.disableSave();

        try {
            const response = await new Promise((resolve, reject) => {
                $.ajax({
                    url: `${base_url}/portOfDischarge/save`,
                    type: 'POST',
                    data: { 'portOfDischarge': JSON.stringify(portOfDischarge) },
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
                resetVoucher();
                $($modalInstance).modal('hide');
            }
        } catch (error) {
            console.log(error);
        } finally {
            general.enableSave();
        }
    };

    var fetch = function (portOfDischargeId) {
        $.ajax({
            url: `${base_url}/portOfDischarge/fetch`,
            type: 'GET',
            data: { 'portOfDischargeId': portOfDischargeId },
            dataType: 'JSON',
            success: function (response) {
                resetField();
                if (response.status == false && response.error !== "") {
                    _getAlertMessage('Error!', response.message, 'danger');
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage('Information!', response.message, 'info');
                } else {
                    $($modalInstance).modal('show');
                    populateData(response.data);
                }
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    var populateData = function (elem) {
        $('#portOfDischargeHiddenId').val(elem.id);
        $('#portOfDischargeName').val(elem.name);
        $('#portOfDischargeRemarks').val(elem.remarks);
    };

    // checks for the empty fields
    var validateSave = function () {

        var errorFlag = false;

        const portOfDischargeName = $.trim($('#portOfDischargeName').val());
        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        if (portOfDischargeName === '') {
            $('#portOfDischargeName').addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    };

    var getSaveObject = function () {
        var obj = {};
        obj.id = $.trim($('#portOfDischargeHiddenId').val());
        obj.name = $.trim($('#portOfDischargeName').val());
        obj.remarks = $.trim($('#portOfDischargeRemarks').val()) || null;
        return obj;
    };

    let portOfDischargeDataTable = undefined;
    const getPortOfDischargeDataTable = (portOfDischargeId = 0) => {
        if (typeof portOfDischargeDataTable !== 'undefined') {
            portOfDischargeDataTable.destroy();
            $('#portOfDischargeViewListTbody').empty();
        }
        portOfDischargeDataTable = $("#portOfDischargeViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/portOfDischarge/getPortOfDischargeDataTable`,
                type: 'GET',
                data: { 'portOfDischargeId': portOfDischargeId },
                dataSrc: function (json) {
                    return json.data;
                }
            },
            autoWidth: false,
            buttons: true,
            searching: true,
            columns: [
                {
                    data: null,
                    className: "text-center",
                    searchable: false,
                    orderable: false,
                    defaultContent: "",
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;  // This will give you the serial number
                    }
                },
                {
                    data: "name",
                    name: "name",
                    className: "text-left name"
                },
                {
                    data: "remarks",
                    name: 'remarks',
                    className: "portOfDischarge remarks"
                },
                {
                    data: null,
                    className: "select text-right",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-portOfDischarge" data-vrnoa_hide="' + row.id + '" data-toggle="tooltip" data-title="View Detail On Modal"><i class="fa fa-edit"></i></button>';
                        if (row.is_active == "1") {
                            buttons += '<a href="#" class="btn btn-sm btn-outline-warning group-hover:bg-yellow-800 group-hover:border-yellow-800 group-hover:text-white btn-edit-portOfDischargeListActive text-center ml-2" data-tName="portOfDischarge"  data-cName="active" data-id="id" data-action="/setup/inactive" data-vrnoa_hide="' + row.id + '"><i class="fas fa-times-circle"></i></a>';
                        } else if (row.is_active == "0") {
                            buttons += '<a href="#" class="btn btn-sm btn-outline-success group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white btn-edit-portOfDischargeListInActive text-center ml-2" data-tName="portOfDischarge"  data-cName="active" data-id="id" data-action="/setup/active" data-vrnoa_hide="' + row.id + '"><i class="fas fa-check"></i></a>';
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

    const updatePortOfDischargeListStatus = async function (portOfDischargeId) {

        const response = await new Promise((resolve, reject) => {
            $.ajax({
                url: `${base_url}/portOfDischarge/updatePortOfDischargeListStatus`,
                type: 'PUT',
                data: { 'portOfDischargeId': JSON.stringify(portOfDischargeId) },
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
            portOfDischargeDataTable.ajax.reload();
        }
    };

    const resetField = () => {
        const resetArry = [
            'portOfDischargeHiddenId',
            'portOfDischargeName',
            'portOfDischargeRemarks',
            'portOfDischargeExchangeRate'
        ];
        clearValueAndText(resetArry, '#');
    };

    const resetVoucher = () => {
        resetField();
        getPortOfDischargeDataTable();
    };

    return {

        init: function () {
            this.bindUI();
            getPortOfDischargeDataTable();
        },

        bindUI: function () {
            $('[data-toggle="tooltip"]').tooltip();

            const self = this;
            $(document.body).on('click', '#portOfDischargeModalShow', function (e) {
                e.preventDefault();
                resetField();
                $($modalInstance).modal('show');
                setTimeout(function () {
                    $('#portOfDischargeName').focus();
                }, 500);
            });
            $(document.body).on('click', '#portOfDischargeSyncAlt', function (e) {
                e.preventDefault();
                getPortOfDischargeDataTable();
            });
            shortcut.add("F10", function () {
                $('#portOfDischargeSaveButton').get()[0].click();
            });
            shortcut.add("F5", function () {
                $('#portOfDischargeResetButton').get()[0].click();
            });
            $('#portOfDischargeSaveButton').on('click', function (e) {
                e.preventDefault();
                self.initSave();
            });

            $('#portOfDischargeResetButton').on('click', function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $('body').on('click', '.btn-edit-portOfDischarge', function (e) {
                e.preventDefault();
                fetch($(this).data('vrnoa_hide'));
            });
            $(document.body).on('click', '.btn-edit-portOfDischargeListActive', async function (e) {
                e.preventDefault();
                const portOfDischargeId = $(this).data('vrnoa_hide');
                await updatePortOfDischargeListStatus(portOfDischargeId);
            });
            $(document.body).on('click', '.btn-edit-portOfDischargeListInActive', async function (e) {
                e.preventDefault();
                const portOfDischargeId = $(this).data('vrnoa_hide');
                await updatePortOfDischargeListStatus(portOfDischargeId);
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

var portOfDischarge = new PortOfDischarge();
portOfDischarge.init();
