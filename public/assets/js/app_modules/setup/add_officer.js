import { dropdownOptions, officerApiEndpoints } from "../../../../js/components/GlobalUrl.js";
import { ifNull, clearValueAndText, appendSelect2ValueIfDataExists, populateSelect2Data } from "../commonFunctions/CommonFunction.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import AlertComponent from "../../../../js/components/AlertComponent.js";
import DynamicOption from "../../../../js/components/DynamicOption.js";

var SalesMan = function () {
	const modalInstance = $('#officerAddModalId');
	const resetField = () => {
		const resetArray = [
			'officerHiddenId',
			'officerName',
			'officerDesignationDropdown',
			'officerAccountDropdown',
			'officerPhone',
			'officerMobile',
			'officerAddress'
		];
		clearValueAndText(resetArray, '#');
	};

	const resetVoucher = () => {
		$('.inputerror').removeClass('inputerror'),
			resetField();
		getOfficerDataTable();
	};

	// saves the data into the database
	var save = async function (officer) {
		const response = await makeAjaxRequest('POST', `${officerApiEndpoints.saveOfficer}`, {
			officerData: JSON.stringify(officer)
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

	var getOfficerById = async function (officerId) {
		const response = await makeAjaxRequest('GET', `${officerApiEndpoints.getOfficerById}`, {
			officerId: officerId
		});
		$(modalInstance).modal('hide');
		if (response.status == false && response.error !== "") {
			AlertComponent._getAlertMessage('Error!', response.message, 'danger');
		} else if (response.status == false && response.message !== "") {
			AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
		} else {
			$(modalInstance).modal('show');
			populateData(response.data);
		}
	};

	var populateData = function (elem) {
		$('#officerHiddenId').val(elem.id);
		$('#officerName').val(elem.name);
		$('#officerDesignationDropdown').val(elem.designation).trigger('change.select2');
		appendSelect2ValueIfDataExists("officerAccountDropdown", "account_data", "pid", "name", elem);
		$('#officerPhone').val(elem.phone);
		$('#officerMobile').val(elem.mobile);
		$('#officerAddress').val(elem.address);
	};

	// checks for the empty fields
	var validateSave = function () {

		var errorFlag = false;

		const officerName = $.trim($('#officerName').val());
		const officerDesignationDropdown = $.trim($('#officerDesignationDropdown').val());
		const officerAccountDropdown = $.trim($('#officerAccountDropdown').val());

		// remove the error class first
		$('.inputerror').removeClass('inputerror');
		if (officerName === '') {
			$('#officerName').addClass('inputerror');
			errorFlag = true;
		}

		if (!officerDesignationDropdown || officerDesignationDropdown === '') {
			$('#select2-officerDesignationDropdown-container').parent().addClass('inputerror');
			errorFlag = true;
		}
		if (!officerAccountDropdown || officerAccountDropdown === '') {
			$('#select2-officerAccountDropdown-container').parent().addClass('inputerror');
			errorFlag = true;
		}
		return errorFlag;
	};

	// returns the fee category object to save into database
	var getSaveObject = function () {
		var obj = {};
		obj.id = $.trim($('#officerHiddenId').val());
		obj.name = $.trim($('#officerName').val());
		obj.designation = $.trim($('#officerDesignationDropdown').val());
		obj.account_id = $.trim($('#officerAccountDropdown').val());
		obj.phone = $.trim($('#officerPhone').val());
		obj.mobile = $.trim($('#officerMobile').val());
		obj.address = $.trim($('#officerAddress').val());
		return obj;
	};

	let searchOfficerDataTable = undefined;
	const getOfficerDataTable = () => {
		if (typeof searchOfficerDataTable !== 'undefined') {
			searchOfficerDataTable.destroy();
			$('#officerDataTableTbody').empty();
		}
		searchOfficerDataTable = $("#officerDataTable").DataTable({
			processing: true,
			serverSide: true,
			ajax: {
				url: `${officerApiEndpoints.getOfficerDataTable}`,
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
					data: "designation",
					name: 'designation',
					className: "text-left Designation",
				},
				{
					data: "account_data.name",
					name: 'accountData.name',
					className: "text-left account_data",
					render: function (data) {
						return ifNull(data, '-')
					}
				},
				{
					data: "phone",
					name: 'phone',
					className: "phone"
				},
				{
					data: "mobile",
					name: 'mobile',
					className: "mobile_number"
				},
				{
					data: null,
					className: "select text-right",
					searchable: false,
					orderable: false,
					render: function (data, type, row) {
						let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-officer" data-officer="' + row.id + '" data-toggle="tooltip" data-title="View Detail On Modal"><i class="fa fa-edit"></i></button>';
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
			getOfficerDataTable();
		},

		bindUI: function () {
			$('[data-toggle="tooltip"]').tooltip();
			const self = this;
			$(document.body).on('click', '#officerModalShow', function (e) {
				e.preventDefault();
				resetField();
				$(modalInstance).modal('show');
				setTimeout(function() {
					$('#officerName').focus();
				}, 500);
			});
			$(document.body).on('click', '#officerSyncAlt', function (e) {
				e.preventDefault();
				getOfficerDataTable();
			});

			shortcut.add("F10", function () {
				$('#officerSaveButton').get()[0].click();
			});
			// shortcut.add("F5", function () {
			// 	$('#officerResetButton').get()[0].click();
			// });
			shortcut.add("F5", function () {
				resetVoucher();
			});

			// when save button is clicked
			$('#officerSaveButton').on('click', function (e) {
				e.preventDefault();
				self.initSave();
			});

			// when the reset button is clicked
			$('#officerResetButton').on('click', function (e) {
				e.preventDefault();		// prevent the default behaviour of the link
				resetVoucher();	// resets the voucher
			});
			// when edit button is clicked inside the table view
			$('body').on('click', '.btn-edit-officer', async function (e) {
				e.preventDefault();
				await getOfficerById($(this).data('officer'));		// get the class detail by id

			});
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
		}
	};
};

var salesMan = new SalesMan();
salesMan.init();

// document.addEventListener("DOMContentLoaded", function () {
// 	new DynamicOption('#officerAccountDropdown', {
// 		requestedUrl: dropdownOptions.getAccountSalesOfficerLevelsAll,
// 		placeholderText: 'Choose Account'
// 	});
// });
$(function () {

	new DynamicOption('#officerAccountDropdown', {
		requestedUrl: dropdownOptions.getAccountSalesOfficerLevelsAll,
		placeholderText: 'Choose Account',
		allowClear: true,
	});
});