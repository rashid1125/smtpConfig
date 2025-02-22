var Banks = function () {


	var settings = {

		// basic information section
		txtAccountId: $('#txtAccountId'),
		txtMaxAccountIdHidden: $('#txtMaxAccountIdHidden'),
		txtAccountIdHidden: $('#txtAccountIdHidden'),
		// txturduname : $('#txturduname'),
		switchGender: $('#switchGender'),

		txtMobileNo: $('#txtMobileNo'),

		txtName: $('#txtName'),
		txtNameHidden: $('#txtNameHidden'),

		txtLevel3: $('#txtLevel3'),

		addMoreInf: $('#addMoreInf'),


		// detailed Information
		txtContactPerson: $('#txtContactPerson'),
		txtEmail: $('#txtEmail'),
		txtAddress: $('#txtAddress'),
		txtFax: $('#txtFax'),
		txtCountry: $('#txtCountry'),
		etype: 'banks',
		uid: $('#uId'),
		cid: $('#cId'),
		txtCity: $('#txtCity'),
		txtCityArea: $('#txtCityArea'),
		txtCNIC: $('#txtCNIC'),
		txtPhoneNo: $('#txtPhoneNo'),

		// buttons
		btnSave: $('.btnSave'),
		btnReset: $('.btnReset'),
		btnEditAccount: $('.btn-edit-account'),

		// extra (modals)
		btnType1Model: $('#btnType1Model'),
		btnType2Model: $('#btnType2Model'),
		txtType1New: $('#txtType1New'),
		txtType2New: $('#txtType2New'),
		btnNewType1: $('.btnNewType1'),
		btnNewType2: $('.btnNewType2'),

		txtselectedLevel1: $('#txtselectedLevel1'),
		txtselectedLevel2: $('#txtselectedLevel2'),
		txtOpBalance: $('#txtOpBalance'),
		txtLimitStop: $('#txtLimitStop'),
		txtPid: $('#txtPid'),
		txtCustomType: $('#txtCustomType'),
		txtcurrent_date: $('#current_date')

	};

	var getMaxId = function () {

		$.ajax({

			url: base_url + 'index.php/bank/getMaxId',
			type: 'POST',
			dataType: 'JSON',
			success: function (data) {
				console.log(data)
				$(settings.txtAccountId).val(data);
				$(settings.txtMaxAccountIdHidden).val(data);
				$(settings.txtAccountIdHidden).val(data);
			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	}
	var getNumVal = function (el) {
		return isNaN(parseFloat(el.val())) ? 0 : parseFloat(el.val());
	}
	var getSaveAccountObj = function () {
		var ledgers = []
		var obj = {
			spid: $.trim($(settings.txtAccountIdHidden).val()),
			pid: $.trim($(settings.txtPid).val()),
			uname: $.trim($('#txtUName').val()),
			active: ($(settings.switchGender).bootstrapSwitch('state') === true) ? '1' : '0',
			name: $.trim($(settings.txtName).val()),
			level3: $.trim($(settings.txtLevel3).val()),
			dcno: '0',
			contact_person: $.trim($(settings.txtContactPerson).val()),
			email: $.trim($(settings.txtEmail).val()),
			address: $.trim($(settings.txtAddress).val()),
			date: $.trim($(settings.txtcurrent_date).val()),
			fax: $.trim($(settings.txtFax).val()),
			country: $.trim($(settings.txtCountry).val()),
			city: $.trim($(settings.txtCity).val()),
			cityarea: $.trim($(settings.txtCityArea).val()),
			cnic: $.trim($(settings.txtCNIC).val()),
			phone: $.trim($(settings.txtPhoneNo).val()),
			etype: $.trim(settings.etype),
			mobile: $.trim($(settings.txtMobileNo).val()),
			ntn: $.trim($('#txtNTN').val()),
			limit: $.trim($('#txtLimit').val()),
			op_balance: $.trim($('#txtOpBalance').val()),
			limit_stop: $.trim($('#txtLimitStop').val()),
			op_type: $.trim($('#txtCredit').is(':checked') ? 'credit' : 'debit'),
			custom_type: $.trim($('#txtCustomType').val()),
			uid: $.trim(settings.uid),
			// company_id : $.trim(settings.cid)
			fn_id: $('#fn_id').val()
		};
		// if(getNumVal($('#txtOpBalance'))!=0){
		// 	var upper,down,date = new Date();
		// 	// var date = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
		// 	var date = $('#current_date').val();
		// 	if(obj.op_type==='debit')
		// 	{
		// 		upper = $('#op_balance').val();	// pid
		// 		upperdesc = 'OP. Balance For ( '+$('#txtName').val()+' ) As on '+date; // description
		// 		down = 'this';					// pid
		// 		downdesc = 'OP. Balance As on '+date; // description
		// 	}
		// 	else
		// 	{
		// 		upper = 'this';											// pid
		// 		upperdesc = 'OP. Balance As on '+date; // description
		// 		down  = $('#op_balance').val();							// pid
		// 		downdesc = 'OP. Balance For ( '+$('#txtName').val()+' ) As on '+date; // description
		// 	}

		// 	var pledger = {};
		// 	pledger.pledid = '';
		// 	pledger.pid = upper;
		// 	pledger.description = upperdesc;
		// 	pledger.date = date;
		// 	pledger.debit = 0;
		// 	pledger.credit = settings.txtOpBalance.val();
		// 	pledger.dcno = $('#txtAccountIdHidden').val();
		// 	pledger.invoice = $('#txtAccountIdHidden').val();
		// 	pledger.etype = settings.etype;
		// 	pledger.pid_key = down;
		// 	pledger.uid = settings.uid.val();
		// 	pledger.company_id = settings.cid.val();
		// 	pledger.isFinal = 0;
		// 	pledger.fn_id = $('#fn_id').val();
		// 	ledgers.push(pledger);

		// 	var pledger = {};
		// 	pledger.pledid = '';
		// 	pledger.pid = down;
		// 	pledger.description = downdesc;
		// 	pledger.date = date;
		// 	pledger.debit = settings.txtOpBalance.val();
		// 	pledger.credit = 0;
		// 	pledger.dcno = $('#txtAccountIdHidden').val();
		// 	pledger.invoice = $('#txtAccountIdHidden').val();
		// 	pledger.etype = settings.etype;
		// 	pledger.pid_key = upper;
		// 	pledger.uid = settings.uid.val();
		// 	pledger.fn_id = $('#fn_id').val();
		// 	pledger.company_id = settings.cid.val();	
		// 	pledger.isFinal = 0;
		// 	ledgers.push(pledger);
		// }
		var data = {};
		data.ledgers = ledgers;
		data.main = obj;
		return data;

	}

	// saves the data into the database
	var save = function (accountObj) {
		general.disableSave();
		$.ajax({
			url: base_url + 'index.php/bank/save',
			type: 'POST',
			data: { 'accountDetail': accountObj.main, 'ledgerDetail': accountObj.ledgers, 'voucher_type_hidden': $('#VoucherTypeHidden').val(), 'prevl3': $('#prevl3').val() },
			dataType: 'JSON',
			success: function (data) {

				if (data.error === 'false') {
					alert('An internal error occured while saving branch. Please try again.');
				}else if (data.status == false && data.message!=='') {
					$.notify({ message: data.message }, { type: 'danger' });
				} else if (data === 'duplicate') {
					$.notify({ message: 'Cash & Banks name already used...!!!' }, { type: 'success' });
				} else {
					$.notify({ message: 'Cash & Banks saved successfully...!!!' }, { type: 'success' });
					general.reloadWindow();
				}
				general.enableSave();
			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	}

	// checks for the empty fields
	var validateSave = function () {


		var errorFlag = false;
		var name = $.trim($(settings.txtName).val());
		var level3 = $.trim($(settings.txtLevel3).val());

		// remove the error class first
		$(settings.txtName).removeClass('inputerror');
		$(settings.txtType1).removeClass('inputerror');
		$(settings.txtType2).removeClass('inputerror');

		if (name === '') {
			$(settings.txtName).addClass('inputerror');
			errorFlag = true;
		}
		if (level3 === '' || level3 == null) {
			$(settings.txtLevel3).addClass('inputerror');
			errorFlag = true;
		}

		return errorFlag;
	}

	var isFieldValid = function () {
		var errorFlag = false;
		var name = settings.txtName;		// get the current fee category name entered by the user
		var pid = settings.txtAccountIdHidden;		// hidden pid
		var maxId = settings.txtMaxAccountIdHidden;		// hidden max pid
		var txtnameHidden = settings.txtNameHidden;		// hidden fee account name

		var accountNames = new Array();
		// get all branch names from the hidden list
		$("#allNames option").each(function () {
			accountNames.push($(this).text().trim().toLowerCase());
		});

		// if both values are not equal then we are in update mode
		if (pid.val() !== maxId.val()) {

			$.each(accountNames, function (index, elem) {

				if (txtnameHidden.val().toLowerCase() !== elem.toLowerCase() && name.val().toLowerCase() === elem.toLowerCase()) {
					name.addClass('inputerror');
					errorFlag = true;
				}
			});

		} else {	// if both are equal then we are in save mode

			$.each(accountNames, function (index, elem) {

				if (name.val().trim().toLowerCase() === elem) {
					name.addClass('inputerror');
					errorFlag = true;
				}
			});
		}

		return errorFlag;
	}

	var fetch = function (spid) {

		$.ajax({
			url: base_url + 'index.php/bank/fetchAccount',
			type: 'POST',
			data: { 'spid': spid },
			dataType: 'JSON',
			success: function (data) {
				resetFields();
				if (data === 'false') {
					alert('No data found');
					general.reloadWindow();
				} else {
					populateData(data);
				}
			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	}

	// generates the view
	var populateData = function (data) {

		$.each(data, function (index, elem) {

			$(settings.txtAccountId).val(elem.spid);
			$(settings.txtAccountIdHidden).val(elem.spid);
			// $(settings.txturduname).val(elem.uname);
			(elem.active === "1") ? $(settings.switchGender).bootstrapSwitch('state', true) : $(settings.switchGender).bootstrapSwitch('state', false);
			$(settings.txtName).val(elem.name);
			$(settings.txtNameHidden).val(elem.name);
			$(settings.txtLevel3).val(elem.level3);
			$(settings.txtLevel3).trigger('change');
			populateDateValue('current_date', elem.date);
			$(settings.txtContactPerson).val(elem.contact_person);
			$(settings.txtEmail).val(elem.email);
			$('#prevl3').val(elem.level3);
			$('#txtUName').val(elem.uname);
			$(settings.txtAddress).val(elem.address);
			$(settings.txtFax).val(elem.fax);
			$(settings.txtCountry).val(elem.country);
			$(settings.txtCity).val(elem.city);
			$(settings.txtCityArea).val(elem.cityarea);
			$(settings.txtCNIC).val(elem.cnic);
			$(settings.txtPhoneNo).val(elem.phone);
			$(settings.txtMobileNo).val(elem.mobile);
			$('#fn_id').val(elem.fn_id);
			$(settings.txtOpBalance).val(elem.op_balance);
			$(settings.txtPid).val(elem.pid);
			$(settings.txtCustomType).val(elem.custom_type);
			if (elem.op_type == 'debit') {
				$('#txtCredit').prop('checked', false);
				$('#txtDebit').prop('checked', true);
			}
			else {
				$('#txtCredit').prop('checked', true);
				$('#txtDebit').prop('checked', false);
			}
			op_type: $.trim($('#txtCredit').is(':checked') ? 'credit' : 'debit')
			// $('#txtType').val(elem.etype);			
			$('#txtNTN').val(elem.ntn);
			$('#drpacid').select2('val', elem.spid);
			$('#txtLimit').val(parseFloat(elem.limit).toFixed(2));
			$('#VoucherTypeHidden').val('edit');
		});
	}
	var resetFields = function () {
		// $(settings.txtAccountIdHidden).val()
		// $(settings.txtPid).val()
		$('#drpacid').select2('val', '');
		$(settings.txtName).val('');
		$('#txtUName').val('');
		$(settings.txtLevel3).val('')
		$(settings.txtContactPerson).val('')
		$(settings.txtEmail).val('')
		$(settings.txtAddress).val('')
		$(settings.txtFax).val('')
		$(settings.txtCountry).val('')
		$(settings.txtCity).val('')
		$(settings.txtCityArea).val('')
		$(settings.txtcurrent_date).datepicker('update', new Date());
		$(settings.txtCNIC).val('')
		$(settings.txtPhoneNo).val('')
		$(settings.txtwn).val('')
		$(settings.txtMobileNo).val('')
		$('#txtNTN').val('');
		$('#fn_id').val($('#fn_id2').val());
		$('#txtLimit').val('')
		$('#txtOpBalance').val('')
		$('#txtCustomType').select2('val', '')
		$('#txtLimitStop').val('')
		$('#prevl3').val('');

	}
	return {

		init: function () {
			this.bindUI();
			this.bindModalPartyGrid();
		},

		bindUI: function () {
			 
			$('[data-toggle="tooltip"]').tooltip();
			// $("div").children("input[type='text']").each(function(){
			// var obj = {};

			// 			obj.inputid =$(this).attr("id");
			// 			obj.vouchername =$('.page_title').text();
			// 			obj.fieldname=$(this).siblings('.input-group-addon').text();
			// 		general.savehelp(obj);
			// 					});
			// $("div label").children("input[type='radio']").each(function(){
			// var obj = {};

			// 			obj.inputid =$(this).attr("id");
			// 			obj.vouchername =$('.page_title').text();
			// 			obj.fieldname=$(this).siblings('.input-group-addon').text();


			// 	general.savehelp(obj);

			// });
			// $("div").children("select").each(function(){
			// var obj = {};

			// 			obj.inputid =$(this).attr("id");
			// 			obj.vouchername =$('.page_title').text();
			// 			obj.fieldname=$(this).siblings('.input-group-addon').text();


			// 	general.savehelp(obj);

			// });
			// $("div").children("input[type='checkbox']").each(function(){
			// var obj = {};

			// 			obj.inputid =$(this).attr("id");
			// 			obj.vouchername =$('.page_title').text();
			// 			obj.fieldname=$(this).siblings('.input-group-addon').text();


			// 	general.savehelp(obj);

			// });
			// $("div").children("input[type='number']").each(function(){
			// var obj = {};

			// 			obj.inputid =$(this).attr("id");
			// 			obj.vouchername =$('.page_title').text();
			// 			obj.fieldname=$(this).siblings('.input-group-addon').text();

			// 	general.savehelp(obj);

			// });
			var self = this;
			$('#VoucherTypeHidden').val('new');
			$('body').on('click', '.modal-lookup .populateAccount', function () {

				// alert('dfsfsdf');
				var party_id = $(this).closest('tr').find('input[name=hfModalPartyId]').data('spid');
				if (party_id !== "") {
					fetch(party_id);
					$('a[href="#basicInformation"]').trigger('click');
				}
			});
			shortcut.add("F1", function () {
				$('a[href="#party-lookup"]').get()[0].click();
			});
			$('#txtName').focus();
			$("#switchGender").bootstrapSwitch('offText', 'Not Active');
			$("#switchGender").bootstrapSwitch('onText', 'Active');

			$('#txtAccountId').on('change', function () {
				fetch($(this).val());
			});
			var l3id = $('#setting_level3').val();

			$('#txtLevel3').on('change', function () {
				var l3 = $(this).find('option:selected').text();
				var l2 = $(this).find('option:selected').data('level2');
				var l1 = $(this).find('option:selected').data('level1');
				$('#level3').html(l3);
				$('#level2').html(l2);
				$('#level1').html(l1);
			});
			$('#txtLevel3').val(l3id).trigger('change');
			$('#drpacid').on('change', function () {
				fetch($(this).val());
			});

			$('#txtLevel3').select2();
			// $('#txtType').select2();
			shortcut.add("F10", function () {
				$(settings.btnSave).get()[0].click();
			});
			// when save button is clicked
			$(settings.btnSave).on('click', function (e) {
				if ($('#VoucherTypeHidden').val() == 'edit' && $('.btnSave').data('updatebtn') == 0) {
					alert('Sorry! you have not update rights..........');
				} else if ($('#VoucherTypeHidden').val() == 'new' && $('.btnSave').data('insertbtn') == 0) {
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


			// when addMoreInf is clicked
			$(settings.addMoreInf).on('click', function (e) {
				e.preventDefault();
				$("a[href='#detailedInformation']").trigger('click');
			});

			// when text is chenged inside the id textbox
			$(settings.txtAccountId).on('keypress', function (e) {

				// check if enter key is pressed
				if (e.keyCode === 13) {

					// get the based on the id entered by the user
					if ($(settings.txtAccountId).val().trim() !== "") {

						var pid = $.trim($(settings.txtAccountId).val());
						fetch(pid);
					}
				}
			});


			// when edit button is clicked inside the table view
			$(document.body).on('click','.btn-edit-account', function (e) {
				e.preventDefault();
				fetch($(this).data('pid'));		// get the class detail by id
				$('a[href="#basicInformation"]').trigger('click');
			});


			// when selection is change in txtLevel3 dropdown
			$(settings.txtLevel3).on('change', function () {

				var level3 = $(settings.txtLevel3).val();
				var level2 = $(settings.txtselectedLevel2);
				var level1 = $(settings.txtselectedLevel1);

				// reset values
				level2.text('');
				level1.text('');

				if (level3 !== "" && level3 !== null) {


					level2.text(' ' + $(this).find('option:selected').data('level2'));
					level1.text(' ' + $(this).find('option:selected').data('level1'));
				}
			});

			banks.fetchRequestedVr();
		},
		fetchRequestedVr: function () {

			var vrnoa = general.getQueryStringVal('vrnoa');
			vrnoa = parseInt(vrnoa);
			$('#txtVrnoa').val(vrnoa);
			$('#txtVrnoaHidden').val(vrnoa);
			if (!isNaN(vrnoa)) {
				$('a[href="#basicInformation"]').trigger('click');
				fetch(vrnoa);
			} else {
				getMaxId();
			}
		},

		// makes the voucher ready to save
		initSave: function () {
			var accountObj = getSaveAccountObj();	// returns the account detail object to save into database
			var isValid = validateSave();			// checks for the empty fields

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
		bindModalPartyGrid: function () {
			var dontSort = [];
			$('#party-lookup table thead th').each(function () {
				if ($(this).hasClass('no_sort')) {
					dontSort.push({ "bSortable": false });
				} else {
					dontSort.push(null);
				}
			});
			Banks.pdTable = $('#party-lookup table').dataTable({
				// "sDom": "<'row-fluid table_top_bar'<'span12'>'<'to_hide_phone'>'f'<'>r>t<'row-fluid'>",
				"sDom": "<'row-fluid table_top_bar'<'span12'<'to_hide_phone' f>>>t<'row-fluid control-group full top' <'span4 to_hide_tablet'l><'span8 pagination'p>>",
				"aaSorting": [[0, "asc"]],
				"bPaginate": true,
				"sPaginationType": "full_numbers",
				"bJQueryUI": false,
				"aoColumns": dontSort
			});
			$.extend($.fn.dataTableExt.oStdClasses, {
				"s`": "dataTables_wrapper form-inline"
			});
		},

		// resets the voucher
		resetVoucher: function () {
			$('#VoucherTypeHidden').val('new');
			general.reloadWindow();

		}
	};
};

var banks = new Banks();
banks.init();