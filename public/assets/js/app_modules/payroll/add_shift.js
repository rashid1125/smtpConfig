import { ifNull } from "../commonFunctions/CommonFunction.js";

var Shift = function () {

    const $modalInstance = $('#shiftAddModalId');

    const shiftName = $('#shiftName');
    const shiftTimeIn = $('#shiftTimeIn');
    const shiftTimeOut = $('#shiftTimeOut');
    const shiftRestTimeIn = $('#shiftRestTimeIn');
    const shiftRestTimeOut = $('#shiftRestTimeOut');
    const shiftHour = $('#shiftHour');
    const shiftIsRestTime = $('#shiftIsRestTime');

    var save = async function (shift) {
        try {
            const response = await new Promise((resolve, reject) => {
                $.ajax({
                    url: `${base_url}/shift/save`,
                    type: 'POST',
                    data: { 'shift': JSON.stringify(shift) },
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
        }
    };

    var fetch = function (shiftId) {
        $.ajax({
            url: `${base_url}/shift/fetch`,
            type: 'GET',
            data: { 'shiftId': shiftId },
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
        $('#shiftHiddenId').val(elem.id);
        $('#shiftName').val(elem.name);
        $('#shiftTimeIn').val(elem.time_in);
        $('#shiftTimeOut').val(elem.time_out);
        $('#shiftHour').val(elem.shift_hours);
        const isRestTime = (parseNumber(elem.is_rest_time) === 1);
        $('#shiftIsRestTime').bootstrapSwitch('state', isRestTime).trigger('change');
        if (isRestTime) {
            $('.resttime').show();
            $('#shiftRestTimeIn').val(elem.rest_time_in);
            $('#shiftRestTimeOut').val(elem.rest_time_out);
        } else {
            $('.resttime').hide();
        }

    };

    // checks for the empty fields
    var validateSave = function () {
        var errorFlag = false;
        // remove the error class first
        $('.inputerror').removeClass('inputerror');

        const shiftName = $('#shiftName');
        const shiftTimeIn = $('#shiftTimeIn');
        const shiftTimeOut = $('#shiftTimeOut');

        if (!shiftName.val()) {
            shiftName.addClass('inputerror');
            errorFlag = true;
        }

        if (!shiftTimeIn.val()) {
            shiftTimeIn.addClass('inputerror');
            errorFlag = true;
        }

        if (!shiftTimeOut.val()) {
            shiftTimeOut.addClass('inputerror');
            errorFlag = true;
        }

        // Check if time in and time out are valid
        const timeIn = shiftTimeIn.val();
        const timeOut = shiftTimeOut.val();

        if (timeIn && timeOut) {
            const [timeInHours, timeInMinutes] = timeIn.split(':').map(Number);
            const [timeOutHours, timeOutMinutes] = timeOut.split(':').map(Number);

            if (timeInHours > timeOutHours || (timeInHours === timeOutHours && timeInMinutes >= timeOutMinutes)) {
                shiftTimeIn.addClass('inputerror');
                shiftTimeOut.addClass('inputerror');
                errorFlag = true;
            }
        }

        return errorFlag;
    };

    var getSaveObject = function () {
        const obj = {};
        const isRestTime = ($('#shiftIsRestTime').bootstrapSwitch('state') === true) ? 1 : 0;
        obj.id = $('#shiftHiddenId').val();
        obj.name = $('#shiftName').val().trim();
        obj.time_in = $('#shiftTimeIn').val();
        obj.time_out = $('#shiftTimeOut').val()
        obj.is_rest_time = ($('#shiftIsRestTime').bootstrapSwitch('state') === true) ? 1 : 0;
        obj.rest_time_in = (isRestTime) ? $('#shiftRestTimeIn').val() : null;
        obj.rest_time_out = (isRestTime) ? $('#shiftRestTimeOut').val() : null;
        obj.shift_hours = $('#shiftHour').val();

        return obj;
    };
    let shiftDataTable = undefined;
    const getShiftDataTable = (shiftId = 0) => {
        if (typeof shiftDataTable !== 'undefined') {
            shiftDataTable.destroy();
            $('#shiftViewListTbody').empty();
        }
        shiftDataTable = $("#shiftViewList").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/shift/getShiftDataTable`,
                type: 'GET',
                data: { 'shiftId': shiftId },
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
                    data: "time_in",
                    name: 'time_in',
                    className: "time_in"
                },
                {
                    data: "time_out",
                    name: 'time_out',
                    className: "time_out"
                },
                {
                    data: "rest_time_in",
                    name: 'rest_time_in',
                    className: "rest_time_in",
                    render: function (data) {
                        return ifNull(data, '-');
                    }
                },
                {
                    data: "rest_time_out",
                    name: 'rest_time_out',
                    className: "rest_time_out",
                    render: function (data) {
                        return ifNull(data, '-');
                    }
                },
                {
                    data: null,
                    className: "select text-right",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-shift" data-vrnoa_hide="' + row.id + '" data-toggle="tooltip" data-title="View Detail On Modal"><i class="fa fa-edit"></i></button>';
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

    const resetField = function () {
        $('#shiftHiddenId').val('');
        $(shiftName).val('');
        $(shiftTimeIn).val(general.getTwentyFourHourTime());
        $(shiftTimeOut).val(general.getTwentyFourHourTime());
        $(shiftRestTimeIn).val(general.getTwentyFourHourTime());
        $(shiftRestTimeOut).val(general.getTwentyFourHourTime());
        $(shiftHour).val('');
        $('.resttime').hide();

    };

    const resetVoucher = function () {
        resetField();
        getShiftDataTable();
    };
    function calculateHours() {
        const timeIn = $('#shiftTimeIn').val();
        const timeOut = $('#shiftTimeOut').val();

        if (timeIn && timeOut) {
            const [timeInHours, timeInMinutes] = timeIn.split(':').map(Number);
            const [timeOutHours, timeOutMinutes] = timeOut.split(':').map(Number);

            let timeInDate = new Date(2000, 0, 1, timeInHours, timeInMinutes);
            let timeOutDate = new Date(2000, 0, 1, timeOutHours, timeOutMinutes);

            // Adjust for time going past midnight
            if (timeOutDate <= timeInDate) {
                timeOutDate.setDate(timeOutDate.getDate() + 1);
            }

            const diff = timeOutDate - timeInDate;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            $('#shiftHour').val(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
        } else {
            $('#shiftHour').val('');
        }
    }
    return {

        init: function () {
            this.bindUI();
            getShiftDataTable();
        },

        bindUI: function () {
            $('[data-toggle="tooltip"]').tooltip();

            const self = this;

            $(document.body).on('click', '#shiftModalShow', function (e) {
                e.preventDefault();
                $($modalInstance).modal('show');

                setTimeout(function () {
                    $('#shiftIsRestTime').bootstrapSwitch('state', false).trigger('change');
                    $('#shiftName').focus();
                }, 500);
                resetField();
            });

            $('.resttime').hide();

            $('#shiftIsRestTime').on('switchChange.bootstrapSwitch', function () {
                var state = $('#shiftIsRestTime').bootstrapSwitch('state');
                if (state == true) {
                    $('.resttime').fadeIn('slow');
                } else {
                    $('.resttime').fadeOut('slow');
                }
            });

            $('#shiftTimeIn').on('change', calculateHours);
            $('#shiftTimeOut').on('change', calculateHours);

            $(document.body).on('click', '#shiftSyncAlt', function (e) {
                e.preventDefault();
                getShiftDataTable();
            });
            shortcut.add("F10", function (event) {
                $('#shiftSaveButton').get(0).click();
            });
            shortcut.add("F5", function () {
                $('#shiftResetButton').get()[0].click();
            });
            $('#shiftSaveButton').on('click', function (e) {
                e.preventDefault();
                self.initSave();
            });

            $('#shiftResetButton').on('click', function (e) {
                e.preventDefault();
                self.resetVoucher();
            });

            $('body').on('click', '.btn-edit-shift', function (e) {
                e.preventDefault();
                const shiftId = parseNumber($(this).data('vrnoa_hide'));
                fetch(shiftId);
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
            $(shiftIsRestTime).bootstrapSwitch('state', false).trigger('change');
            resetVoucher();

        }
    };
};

var shift = new Shift();
shift.init();
