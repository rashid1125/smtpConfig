import DynamicOption from '../../../../../js/components/DynamicOption.js';
import { dropdownOptions } from '../../../../../js/components/GlobalUrl.js';
import { appendSelect2ValueIfDataExists, clearValueAndText} from '../../commonFunctions/CommonFunction.js';


var Banks = function () {
	const saveBank = `${base_url}/account/bank/saveBank`;
	const getBankById = `${base_url}/account/bank/getBankById`;
	const settingConfigurBanksLevel3 = $('#settingConfigurBanksLevel3').val();
	var settings = {

		// basic information section

		txtBankIdHidden: $('#txtBankIdHidden'),
		txtName: $('#txtName'),
		txtUName: $('#txtUName'),
		txtAddress: $('#txtAddress'),
		creditCardNo: $('#creditCardNo'),
		txtLimit: $('#txtLimit'),
		txtMobileNo: $('#txtMobileNo'),
		txtPid: $("#txtPid"),
		txtLevel3: $('#txtLevel3'),
		txtselectedLevel1: $('#txtselectedLevel1'),
		txtselectedLevel2: $('#txtselectedLevel2'),
		active: $('#switchStatus'),

		// buttons
		btnSave: $('.btnSave'),
		btnReset: $('.btnReset'),

		txtselectedLevel1: $('#txtselectedLevel1'),
		txtselectedLevel2: $('#txtselectedLevel2'),
		uid: $('#uId'),
		cid: $('#cId'),

	};

	var save = async function (accountObj) {
		general.disableSave();

		try {
			const response = await new Promise((resolve, reject) => {
				$.ajax({
					url: `${saveBank}`,
					type: 'POST',
					data: { 'bankdetail': accountObj },
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
				banks.resetVoucher();
			}
		} catch (error) {
			console.log(error);
		} finally {
			general.enableSave();
		}
	};

	var validateSave = function () {

		var errorFlag = false;

		var name = $(settings.txtName).val();
		var level3 = $.trim($(settings.txtLevel3).val());

		// remove the error class first
		$('#txtName').removeClass('inputerror');
		$('#txtLevel3').removeClass('inputerror');

		if (name === '') {
			$('#txtName').addClass('inputerror');
			errorFlag = true;
		}

		if (level3 === '' || level3 == null) {
			$(settings.txtLevel3).parent().addClass('inputerror');
			errorFlag = true;
		}

		return errorFlag;
	};
	var getSaveObject = function () {
		const obj = {
			pid: $.trim($(settings.txtBankIdHidden).val()),
			name: $(settings.txtName).val(),
			level3: $(settings.txtLevel3).val(),
			uname: $(settings.txtUName).val(),
			address: $(settings.txtAddress).val(),
			credit_card_no: $(settings.creditCardNo).val(),
			limit: $(settings.txtLimit).val(),
			mobile: $(settings.txtMobileNo).val(),
			active: ($('#switchStatus').prop('checked') === true) ? 1 : 0,
		};
		return obj;
	};

	var isFieldValid = function () {
		var errorFlag = false;
		var name = settings.txtName;		// get the current fee category name entered by the user
		var spid = settings.txtAccountIdHidden;		// hidden pid
		// var maxId = settings.txtMaxAccountIdHidden;		// hidden max pid
		var txtnameHidden = settings.txtNameHidden;		// hidden fee account name

		var accountNames = new Array();
		// get all branch names from the hidden list
		$("#allNames option").each(function () {
			accountNames.push($(this).text().trim().toLowerCase());
		});


		return errorFlag;
	};

	var fetch = function (pid) {
		$.ajax({
			url: `${getBankById}`,
			type: 'GET',
			data: { 'pid': pid },
			dataType: 'JSON',
			success: function (response) {
				if (response.status == false && response.message !== "" && response.error !== "") {
					_getAlertMessage('Error!', response.message, 'danger');
				} else if (response.status == false && response.message !== "") {
					_getAlertMessage('Information!', response.message, 'info');
					general.reloadWindow();
				} else {
					populateData(response.data);
				}
			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});

	};

	// generates the view
	var populateData = function (elem) {
		$('#txtBankIdHidden').val(elem.pid);
		const active = (parseNumber(elem.active) === 1);
		$('#switchStatus').prop('checked', active).trigger('change');
		$('#txtName').val(elem.name);
		$('#txtUName').val(elem.uname);
		$('#txtMobileNo').val(elem.mobile);
		$('#txtAddress').val(elem.address);
		$('#creditCardNo').val(elem.credit_card_no);
		appendSelect2ValueIfDataExists('txtLevel3', 'level3', 'l3', 'name', elem);
		$('#txtLevel3').trigger('change');

	};


	return {

		init: function () {
			$('.select2').select2();
			this.bindUI();
		},


		bindUI: function () {
			general.setupfetchhelp($(".page_title").text());
			$('[data-toggle="tooltip"]').tooltip();
			var self = this;
			$("#txtLevel3").on("change", function () {

				var l3 = $(this).find("option:selected").text();
				var l2 = $(this).find("option:selected").data("level2");
				var l1 = $(this).find("option:selected").data("level1");

				$("#level3").html(l3);
				$("#level2").html(l2);
				$("#level1").html(l1);
			});


			$('#txtLevel3').val(settingConfigurBanksLevel3).trigger('change');

			shortcut.add("F1", function () {
				$('a[href="#party-lookup"]').get()[0].click();
			});
			shortcut.add("F10", function () {
				$(settings.btnSave).get()[0].click();
			});
			// when save button is clicked
			$(settings.btnSave).on('click', function (e) {
				if ($('#txtBankIdHidden').val() == 'edit' && $('.btnSave').data('updatebtn') == 0) {
					alert('Sorry! you have not update rights..........');
				} else if ($('#txtBankIdHidden').val() == 'new' && $('.btnSave').data('insertbtn') == 0) {
					alert('Sorry! you have not insert rights..........');
				} else {
					e.preventDefault();
					self.initSave();
				}
			});

			shortcut.add("F5", function () {
				self.resetVoucher();

			});


			// alert('enter'+ e.keyCode )
			// when reset button is clicked
			$(settings.btnReset).on('click', function (e) {
				e.preventDefault();
				self.resetVoucher();

			});





			// when edit button is clicked inside the table view

			$('body').on('click', '.btn-edit-bank', function (e) {
				e.preventDefault();		// prevent the default behaviour of the link
				fetch($(this).data('pid'));		// get the fee category detail by id
				$('a[href="#main"]').trigger('click');
			});
		},

		// makes the voucher ready to save

		initSave: function () {

			var accountObj = getSaveObject();	// returns the account detail object to save into database
			var isValid = validateSave();

			if (!isValid) {
				// check if the fee category name is already used??	if false
				if (!isFieldValid()) {
					save(accountObj);		// saves the detail into the database
				} else {	// if fee category name is already used then show error
					alert("Account name already used.");
				}
			} else {
				alert('Correct the errors!');
			}
		},

		resetVoucher: function () {
			$('.inputerror').removeClass('inputerror');
			$('#switchStatus').prop('checked', true).trigger('change');
			const resetArray = [
				'txtName',
				'txtUName',
				'txtAddress',
				'txtMobileNo',
				'creditCardNo',
			];
			clearValueAndText(resetArray, '#');
			$(settings.switchStatus).prop('checked', true).trigger('change');
			// $(settings.txtLevel3).val(settingConfigurBanksLevel3).trigger('change');
		},
	};
};

var banks = new Banks();
banks.init();
$(function () {

	new DynamicOption('#txtLevel3', {
		requestedUrl: dropdownOptions.getAllGeneralAccounts,
		placeholderText: 'Choose associate level',
		allowClear: true,
	});
});
