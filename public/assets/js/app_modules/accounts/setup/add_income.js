import { appendSelect2ValueIfDataExists, parseNumber} from '../../commonFunctions/CommonFunction.js';
import { dropdownOptions } from "../../../../../js/components/GlobalUrl.js";
import DynamicOption from "../../../../../js/components/DynamicOption.js";

var Income = function() {

    const saveIncome = `${base_url}/account/income/saveIncome`;
	const fileIncomeUrl = `${base_url}/account/income/getIncomeById`;
	const settingConfigurIncomesLevel3 = $('#settingConfigurIncomesLevel3').val();

	var settings = {

		// income data
		txtIncomeIdHidden : $('#txtIncomeIdHidden'),
		txtIncomeName : $('#txtIncomeName'),
        txtIncomeUrduName : $('#txtIncomeUrduName'),
		txtIncomeLevel3Dropdown : $('#txtIncomeLevel3Dropdown'),
		txtselectedLevel1: $('#level1'),
		txtselectedLevel2: $('#level2'),

		switchStatus: $('#switchStatus'),
		btnSave : $('.btnSave'),
		btnReset : $('.btnReset'),
	};

    var save = async function (lObj) {
		general.disableSave();

		try {
			const response = await new Promise((resolve, reject) => {
				$.ajax({
					url: `${saveIncome}`,
					type: 'POST',
					data: { 'incomeDetail' : lObj},
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
				$('#switchStatus').prop('checked', true).trigger('change');
				general.reloadWindow();
			}
		} catch (error) {
			console.log(error);
		} finally {
			general.enableSave();
		}
	};

    var validateSave = function () {

		var errorFlag = false;

		var name = $(settings.txtIncomeName).val();
		var level3 = $(settings.txtIncomeLevel3Dropdown).val();

		// remove the error class first
		$('#txtIncomeName').removeClass('inputerror');
		$('#txtIncomeLevel3Dropdown').removeClass('inputerror');

		if (name === '') {
			$(settings.txtIncomeName).addClass('inputerror');
			errorFlag = true;
		}

		if (level3 === '' || level3 == null) {
			$(settings.txtIncomeLevel3Dropdown).parent().addClass('inputerror');
			errorFlag = true;
		}

		return errorFlag;
	};
	var getSaveObject = function () {
		const obj = {
			pid: $.trim($(settings.txtIncomeIdHidden).val()),
			name: $(settings.txtIncomeName).val(),
			level3: $(settings.txtIncomeLevel3Dropdown).val(),
			uname: $(settings.txtIncomeUrduName).val(),
			active: ($(settings.switchStatus).prop('checked') === true) ? 1 : 0,

		};
		return obj;
	};

	var isFieldValid = function () {
		var errorFlag = false;
		var name = settings.txtName;
		var spid = settings.txtAccountIdHidden;

		var accountNames = new Array();
		// get all branch names from the hidden list
		$("#allNames option").each(function () {
			accountNames.push($(this).text().trim().toLowerCase());
		});


		return errorFlag;
	};

	var fetch = function(pid) {

		$.ajax({
			url :  `${fileIncomeUrl}`,
			type : 'GET',
			data : { 'pid' : pid },
			dataType : 'JSON',
			success: function (response) {
				if (response.status == false && response.message !== "" && response.error !== "") {
					_getAlertMessage('Error!', response.message, 'danger');
				} else if (response.status == false && response.message !== "") {
					_getAlertMessage('Information!', response.message, 'info');
					level.resetVoucher();

				} else {
					populateData(response.data);
				}
			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	}

	// generates the view

	var populateData = function(elem) {
		$('#VoucherTypeHidden').val('edit');
		$('#txtIncomeIdHidden').val(elem.pid);
		const active = elem.active === 1;
		$('#switchStatus').prop('checked', active).trigger('change');
		$('#txtIncomeName').val(elem.name);
		$('#txtIncomeUrduName').val(elem.uname);
		appendSelect2ValueIfDataExists("txtIncomeLevel3Dropdown", "level3", "l3", "name", elem);
		$('#txtIncomeLevel3Dropdown').trigger('change');
	}



	return {
		init: function () {
			this.bindUI();
		},

		bindUI : function() {
			general.setupfetchhelp($(".page_title").text());
			$('[data-toggle="tooltip"]').tooltip();
			var self = this;
			$('#txtIncomeName').focus();

			$("#txtIncomeLevel3Dropdown").on('change', function () {
				var l3 = $(this).find("option:selected").text();
				var l2 = $(this).find("option:selected").data("level2");
				var l1 = $(this).find("option:selected").data("level1");
				$("#level3").html(l3);
				$("#level2").html(l2);
				$("#level1").html(l1);
			});
			$('#txtIncomeLevel3Dropdown').val(settingConfigurIncomesLevel3).trigger('change');
			shortcut.add("F1", function () {
				$('a[href="#income_lookup"]').get()[0].click();
			});
			shortcut.add("F10", function () {
				$(settings.btnSave).get()[0].click();
			});
			///		Income Events

			// when save button is clicked
			$(settings.btnSave).on('click', function(e){
				if ($('#VoucherTypeHidden').val()=='edit' && $('.btnSave').data('updatebtn')==0 ){
					alert('Sorry! you have not update rights..........');
				}else if($('#VoucherTypeHidden').val()=='new' && $('.btnSave').data('insertbtn')==0){
					alert('Sorry! you have not insert rights..........');
				}else{
					e.preventDefault();
					self.initSave();
				}
			});

			// when reset button is clicked
			$(settings.btnReset).on('click', function(e){
				e.preventDefault();
				self.resetVoucher();
			});

			// when btnEditIncome is clicked
			$('body').on('click', '.btn-edit-income', function (e) {
				e.preventDefault();
				fetch($(this).data('pid'));
				$('a[href="#add_income"]').trigger('click');

			});


		},

		// makes the voucher ready to save2
		initSave : function() {

			var incomeObj = getSaveObject();
			var isValid = validateSave();

			if ( !isValid ) {

				isValid = isFieldValid();
				// check if the level 2 name is already used??	if false
				if ( !isValid ) {
					save(incomeObj);
				} else {
					alert("Income name already used.");
				}
			} else {
				alert('Correct the errors...');
			}
		},
		// resets the voucher Level 3
		resetVoucher : function() {
			$('.inputerror').removeClass('inputerror');

			$(settings.switchStatus).prop('checked', true).trigger('change');  // Change switchStatus to active

			$(settings.txtIncomeIdHidden).val('');
			$(settings.txtIncomeName).val('');
			$(settings.txtIncomeUrduName).val('');


		}
	};

};

var income = new Income();
income.init();
$(function () {
	new DynamicOption('#txtIncomeLevel3Dropdown', {
		requestedUrl: dropdownOptions.getAllGeneralAccounts,
		placeholderText: 'Choose associate level',
		allowClear: true,
	});
});
