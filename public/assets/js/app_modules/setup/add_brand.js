import AlertComponent from "../../../../js/components/AlertComponent.js";
import { brandApiEndpoints } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText } from "../commonFunctions/CommonFunction.js";

var Brand = function () {
	const $modalInstance = $('#brandAddModalId');
	var save = async function (brand) {
		const response = await makeAjaxRequest('POST', brandApiEndpoints.saveBrand, {
			brandData: JSON.stringify(brand)
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

	var getBrandById = async function (brandId) {
		const response = await makeAjaxRequest('GET', brandApiEndpoints.getBrandById, {
			brandId: brandId
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
		$('#brandHiddenId').val(elem.bid);
		$('#brandName').val(elem.name);
		$('#brandNativeName').val(elem.native_name);
		$('#brandDescription').val(elem.description);
	};

	// checks for the empty fields
	var validateSave = function () {

		var errorFlag = false;

		const brandName = $.trim($('#brandName').val());
		// remove the error class first
		$('.inputerror').removeClass('inputerror');

		if (brandName === '') {
			$('#brandName').addClass('inputerror');
			errorFlag = true;
		}

		return errorFlag;
	};

	var getSaveObject = function () {
		var obj = {};
		obj.bid = $.trim($('#brandHiddenId').val());
		obj.name = $.trim($('#brandName').val());
		obj.native_name = $.trim($('#brandNativeName').val());
		obj.description = $.trim($('#brandDescription').val());
		return obj;
	};
	let brandDataTable = undefined;
	const getBrandDataTable = () => {
		if (typeof brandDataTable !== 'undefined') {
			brandDataTable.destroy();
			$('#brandViewListTbody').empty();
		}
		brandDataTable = $("#brandViewList").DataTable({
			processing: true,
			serverSide: true,
			ajax: {
				url: `${brandApiEndpoints.getBrandDataTable}`,
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
					data: "bid",
					name: 'bid',
					className: "bid",
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
						let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-brand" data-vrnoa_hide="' + row.bid + '" data-toggle="tooltip" data-title="View Detail On Modal"><i class="fa fa-edit"></i></button>';
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
			'brandHiddenId',
			'brandName',
			'brandNativeName',
			'brandDescription'
		];
		clearValueAndText(resetArry, '#');
	};

	const resetVoucher = () => {
		resetField();
		getBrandDataTable();
	};

	return {

		init: function () {
			this.bindUI();
			getBrandDataTable();
		},

		bindUI: function () {
			$('[data-toggle="tooltip"]').tooltip();

			const self = this;
			$(document.body).on('click', '#brandModalShow', function (e) {
				e.preventDefault();
				resetField();
				$($modalInstance).modal('show');
				setTimeout(function() {
					$('#brandName').focus();
				}, 500);
			});
			$(document.body).on('click', '#brandSyncAlt', function (e) {
				e.preventDefault();
				getBrandDataTable();
			});
			shortcut.add("F10", function () {
				$('#brandSaveButton').get()[0].click();
			});
			shortcut.add("F5", function () {
				$('#brandResetButton').get()[0].click();
			});
			$('#brandSaveButton').on('click', function (e) {
				e.preventDefault();
				self.initSave();
			});

			$('#brandResetButton').on('click', function (e) {
				e.preventDefault();
				resetVoucher();
			});

			$('body').on('click', '.btn-edit-brand', async function (e) {
				e.preventDefault();
				await getBrandById($(this).data('vrnoa_hide'));
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

var brand = new Brand();
brand.init();
