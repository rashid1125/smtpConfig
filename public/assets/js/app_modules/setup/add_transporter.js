import { ifNull, populateSelect2Data } from '../commonFunctions/CommonFunction.js';
var Transporter = function () {

	const saveTransporter = `${base_url}/transporter/saveTransporter`;
	const getTransporterById = `${base_url}/transporter/getTransporterById`;

	var save = async function (transporter) {
		general.disableSave();

		try {
			const response = await new Promise((resolve, reject) => {
				$.ajax({
					url: `${saveTransporter}`,
					type: 'POST',
					data: { 'transporter': JSON.stringify(transporter) },
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

	// checks for the empty fields
	var validateSave = function () {

		var errorFlag = false;
		$('.inputerror').removeClass('inputerror');

		var name = $('#txtName').val();
		const TransporterDropdown = $('#txtTransporterDropdown');

		if (!TransporterDropdown.val()) {
			$('#txtTransporterDropdown').parent().addClass('inputerror');
			errorFlag = true;
		}

		if (name === '') {
			$('#txtName').addClass('inputerror');
			errorFlag = true;
		}

		return errorFlag;
	};

	var getSaveObject = function () {
		const obj = {
			transporter_id: $.trim($('#txtTransporterIdHidden').val()),
			name: $('#txtName').val(),
			contact: $('#txtContact').val(),
			phone: $('#txtPhone').val(),
			area_covers: $('#txtAreaCovers').val(),
			pid: $('#txtTransporterDropdown').val(),
		};
		return obj;
	};

	var fetch = function (transporter_id) {

		$.ajax({
			url: `${getTransporterById}`,
			type: 'GET',
			data: { 'transporter_id': transporter_id },
			dataType: 'JSON',
			success: function (response) {
				if (response.status == false && response.message !== "" && response.error !== "") {
					_getAlertMessage('Error!', response.message, 'danger');
				} else if (response.status == false && response.message !== "") {
					_getAlertMessage('Information!', response.message, 'info');
					transporter.resetVoucher();
				} else {
					transporter.resetVoucher();
					populateData(response.data);
				}
			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	};

	// generates the view
	var populateData = function (elem) {

		$('#vouchertypehidden').val('edit');
		$('#txtTransporterIdHidden').val(elem.transporter_id);
		$('#txtName').val(elem.name);
		$('#txtContact').val(elem.contact);
		$('#txtPhone').val(elem.phone);
		$('#txtAreaCovers').val(elem.area_covers);
		populateSelect2Data("txtTransporterDropdown", elem.pid, true);
	};

	const getAccountDetail = (active, IDoption = "") => {
		$.ajax({
			url: base_url + '/account/getAccountDetail',
			type: 'GET',
			data: { 'active': active, 'setting_level3': 'transporter_level' },
			dataType: 'JSON',
			success: function (response) {
				if (response.status && response.data !== null)
					getpopulateAccountDetail(response.data, IDoption);
			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	};

	const getpopulateAccountDetail = (data, IDoption = "", option = "") => {
		$(IDoption).empty();
		option = '<option value="" disabled="" selected="">Choose Account</option>';
		$.each(data, function (index, elem) {
			option += '<option value="' + elem.pid + '">' + elem.name + '</option>';
		});
		$(option).appendTo(IDoption).trigger('liszt:updated');
	};

	let searchTransporterViewTable = undefined;
	const getTransporterAll = () => {
		if (typeof searchTransporterViewTable !== 'undefined') {
			searchTransporterViewTable.destroy();
			$('#text-transporter-table tbody').empty();
		}
		searchTransporterViewTable = $("#text-transporter-table").DataTable({
			processing: true,
			serverSide: true,
			ajax: {
				url: base_url + '/transporter/getTransporterDataTable',
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
					className: "serial number",
					searchable: false,
					orderable: false,
					render: function (data, type, row, meta) {
						return meta.row + 1;
					}
				},
				{
					data: "name",
					name: 'name',
					className: "transporters_name",
					render: function (data, type, row) {
						return ifNull(data,'-')
					}
				},
				{
					data: "contact",
					name: 'contact',
					className: "contact",
					render: function (data, type, row) {
						return ifNull(data,'-')
					}
				},
				{
					data: "phone",
					name: 'phone',
					className: "phone",
					render: function (data, type, row) {
						return ifNull(data,'-')
					}
				},
				{
					data: "area_covers",
					name: 'area_covers',
					className: "area_covers",
					render: function (data, type, row) {
						return ifNull(data,'-')
					}
				},
				{
					data: null,
					className: "select text-right",
					searchable: false,
					orderable: false,
					render: function (data, type, row) {
						let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-transporter" data-transporter_id="' + row.transporter_id + '" data-toggle="tooltip" data-title="View Detail On Modal"><i class="fa fa-edit"></i></button>';
						return buttons;
					}
				}
			],
			createdRow: function (row, data, dataIndex) {
				$(row).addClass('group odd:bg-white even:bg-slate-50');
				$('td', row).addClass('py-1 px-1 text-md align-middle');
			}
		});

		searchTransporterViewTable.on('draw', function () {
			$('[data-toggle="tooltip"]').tooltip();
		});
	};

	return {

		init: function () {
			this.bindUI();
			$('.chosen').chosen();
			$('.select2').select2();
			$('#vouchertypehidden').val('new');

			getTransporterAll();
			getAccountDetail(1, '#txtTransporterDropdown');
		},

		bindUI: function () {

			$('[data-toggle="tooltip"]').tooltip();
			$('#txtName').focus();

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
			$('#txtaccount_refresh').click(function (e) {
				e.preventDefault();
				getAccountDetail(1, '#txtTransporterDropdown');
			});

			// when save button is clicked
			$('.btnSave').on('click', function (e) {
				if ($('#vouchertypehidden').val() == 'edit' && $('.btnSave').data('updatebtn') == 0) {
					alert('Sorry! you have not update rights..........');
				} else if ($('#vouchertypehidden').val() == 'new' && $('.btnSave').data('insertbtn') == 0) {
					alert('Sorry! you have not insert rights..........');
				} else {
					e.preventDefault();
					self.initSave();
				}
			});

			// when the reset button is clicked
			$('.btnReset').on('click', function (e) {
				e.preventDefault();		// prevent the default behaviour of the link
				self.resetVoucher();	// resets the voucher
			});

			// when edit button is clicked inside the table view
			$('body').on('click', '.btn-edit-transporter', function (e) {
				e.preventDefault();

				fetch($(this).data('transporter_id'));		// get the class detail by id
				$('a[href="#add_transporter"]').trigger('click');
			});

			getTransporterAll();
		},

		// makes the voucher ready to save
		initSave: function () {

			var saveObj = getSaveObject();	// returns the class detail object to save into database
			var error = validateSave();			// checks for the empty fields

			if (!error) {
				save(saveObj);
			} else {
				alert('Correct the errors...');
			}
		},

		// resets the voucher
		resetVoucher: function () {

			$('.inputerror').removeClass('inputerror');
			$('#txtTransporterIdHidden').val('');
			$('#txtName').val('');
			$('#txtContact').val('');
			$('#txtPhone').val('');
			$('#txtAreaCovers').val('');
			$('#txtTransporterDropdown').val('').trigger('change.select2');
			// getAccountDetail(1, '#txtTransporterDropdown');
			getTransporterAll();
		}
	};
};

var transporter = new Transporter();
transporter.init();
