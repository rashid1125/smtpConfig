import { clearValueAndText } from "../commonFunctions/CommonFunction.js";

var Currency = function () {
	const $modalInstance = $('#currencyAddModalId');

	var save = async function (currency) {
		general.disableSave();

		try {
			const response = await new Promise((resolve, reject) => {
				$.ajax({
					url: `${base_url}/currency/save`,
					type: 'POST',
					data: { 'currency': JSON.stringify(currency) },
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

	var fetch = function (currencyId) {
        $.ajax({
            url: `${base_url}/currency/fetch`,
            type: 'GET',
            data: { 'currencyId': currencyId },
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
		$('#currencyHiddenId').val(elem.id);
		$('#currencyName').val(elem.name);
		$('#currencySign').val(elem.sign);
		$('#currencyExchangeRate').val(elem.exchange_rate);
	};

	// checks for the empty fields
	var validateSave = function () {

		var errorFlag = false;

		const currencyName = $.trim($('#currencyName').val());
		// remove the error class first
		$('.inputerror').removeClass('inputerror');

		if (currencyName === '') {
			$('#currencyName').addClass('inputerror');
			errorFlag = true;
		}

		return errorFlag;
	};

	var getSaveObject = function () {
		var obj = {};
		obj.id = $.trim($('#currencyHiddenId').val());
		obj.name = $.trim($('#currencyName').val());
		obj.sign = $.trim($('#currencySign').val());
		obj.exchange_rate = $.trim($('#currencyExchangeRate').val());
		return obj;
	};
	
	let currencyDataTable = undefined;
	const getCurrencyDataTable = (currencyId = 0) => {
		if (typeof currencyDataTable !== 'undefined') {
			currencyDataTable.destroy();
			$('#currencyViewListTbody').empty();
		}
		currencyDataTable = $("#currencyViewList").DataTable({
			processing: true,
            serverSide: true,
            ajax: {
                url: `${base_url}/currency/getCurrencyDataTable`,
                type: 'GET',
                data: { 'currencyId': currencyId },
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
					data: "sign",
					name: 'sign',
					className: "currency sign"
				},
				{
					data: "exchange_rate",
					name: 'exchange_rate',
					className: "currency exchange_rate"
				},
				{
					data: null,
					className: "select text-right",
					searchable: false,
					orderable: false,
					render: function (data, type, row) {
						let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-currency" data-vrnoa_hide="' + row.id + '" data-toggle="tooltip" data-title="View Detail On Modal"><i class="fa fa-edit"></i></button>';
                        if (row.active == "1") {
                            buttons += '<a href="#" class="btn btn-sm btn-outline-warning group-hover:bg-yellow-800 group-hover:border-yellow-800 group-hover:text-white btn-edit-currencyListActive text-center ml-2" data-tName="currency"  data-cName="active" data-id="id" data-action="/setup/inactive" data-vrnoa_hide="' + row.id + '"><i class="fas fa-times-circle"></i></a>';
                        } else if (row.active == "0") {
                            buttons += '<a href="#" class="btn btn-sm btn-outline-success group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white btn-edit-currencyListInActive text-center ml-2" data-tName="currency"  data-cName="active" data-id="id" data-action="/setup/active" data-vrnoa_hide="' + row.id + '"><i class="fas fa-check"></i></a>';
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

	const updateCurrencyListStatus = async function (currencyId) {

		const response = await new Promise((resolve, reject) => {
			$.ajax({
				url: `${base_url}/currency/updateCurrencyListStatus`,
				type: 'PUT',
				data: { 'currencyId': JSON.stringify(currencyId) },
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
			currencyDataTable.ajax.reload();
		}
    };

	const resetField = () => {
		const resetArry = [
			'currencyHiddenId',
			'currencyName',
			'currencySign',
			'currencyExchangeRate'
		];
		clearValueAndText(resetArry, '#');
	};

	const resetVoucher = () => {
		resetField();
		getCurrencyDataTable();
	};

	return {

		init: function () {
			this.bindUI();
			getCurrencyDataTable();
		},

		bindUI: function () {
			$('[data-toggle="tooltip"]').tooltip();

			const self = this;
			$(document.body).on('click', '#currencyModalShow', function (e) {
				e.preventDefault();
				resetField();
				$($modalInstance).modal('show');
				setTimeout(function() {
					$('#currencyName').focus();
				}, 500);
			});
			$(document.body).on('click', '#currencySyncAlt', function (e) {
				e.preventDefault();
				getCurrencyDataTable();
			});
			shortcut.add("F10", function () {
				$('#currencySaveButton').get()[0].click();
			});
			shortcut.add("F5", function () {
				$('#currencyResetButton').get()[0].click();
			});
			$('#currencySaveButton').on('click', function (e) {
				e.preventDefault();
				self.initSave();
			});

			$('#currencyResetButton').on('click', function (e) {
				e.preventDefault();
				resetVoucher();
			});

			$('body').on('click', '.btn-edit-currency', function (e) {
				e.preventDefault();
				fetch($(this).data('vrnoa_hide'));
			});
			$(document.body).on('click', '.btn-edit-currencyListActive', async function (e) {
                e.preventDefault();
                const currencyId = $(this).data('vrnoa_hide');
                await updateCurrencyListStatus(currencyId);
            });
            $(document.body).on('click', '.btn-edit-currencyListInActive', async function (e) {
                e.preventDefault();
                const currencyId = $(this).data('vrnoa_hide');
                await updateCurrencyListStatus(currencyId);
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

var currency = new Currency();
currency.init();
