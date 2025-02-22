var Level = function() {

	var settings = {
		// level 1 data
		txtLevel1Id : $('#txtLevel1Id'),
		txtMaxLevel1IdHidden : $('#txtMaxLevel1IdHidden'),
		txtLevel1IdHidden : $('#txtLevel1IdHidden'),

		txtLevel1Name : $('#txtLevel1Name'),
		txtLevel1NameHidden : $('#txtLevel1NameHidden'),

		btnEditLevel1 : $('.btn-edit-level1'),

		btnSaveL1 : $('.btnSaveL1'),
		btnResetL1 : $('.btnResetL1'),

		// level 2 data
		txtLevel2Id : $('#txtLevel2Id'),
		txtMaxLevel2IdHidden : $('#txtMaxLevel2IdHidden'),
		txtLevel2IdHidden : $('#txtLevel2IdHidden'),

		level1_dropdown : $('#level1_dropdown'),

		txtLevel2Name : $('#txtLevel2Name'),
		txtLevel2NameHidden : $('#txtLevel2NameHidden'),

		btnEditLevel2 : $('.btn-edit-level2'),
		btnSaveL2 : $('.btnSaveL2'),
		btnResetL2 : $('.btnResetL2'),

		// level 3 data
		txtLevel3Id : $('#txtLevel3Id'),
		txtMaxLevel3IdHidden : $('#txtMaxLevel3IdHidden'),
		txtLevel3IdHidden : $('#txtLevel3IdHidden'),

		level2_dropdown : $('#level2_dropdown'),

		txtLevel3Name : $('#txtLevel3Name'),
		txtLevel3NameHidden : $('#txtLevel3NameHidden'),

		btnEditLevel3 : $('.btn-edit-level3'),
		btnSaveL3 : $('.btnSaveL3'),
		btnResetL3 : $('.btnResetL3')
	};

	var save = function( l1Obj, level ) {
		general.disableSave();
		$.ajax({
			url : base_url + 'index.php/level/save',
			dataType : 'JSON',
			data : { 'levelDetail' : l1Obj, 'level' : level },
			type : 'POST',
			success: function(data) {
				if (data.error === 'true') {
					alert('An internal error occured while saving branch. Please try again.');
				} else if (data.status == false && data.message!=='') {
					$.notify({ message: data.message }, { type: 'danger' });
				} else {
					alert('Level saved successfully.');
					general.reloadWindow();
				}
				general.enableSave();
			}, error : function(xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	}

	var fetchL1 = function(l1) {

		$.ajax({
			url : base_url + 'index.php/level/fetchl1',
			type : 'POST',
			data : { 'l1' : l1 },
			dataType : 'JSON',
			success : function(data) {

				if (data === 'false') {
					alert('No data found');
				} else {
					populateDataL1(data);
				}

			}, error : function(xhr, status, error) {
				$('.btnSave').attr('disabled', false);
				if ($('#VoucherTypeHidden').val()=='edit' && $('.btnSave').data('updatebtn')==0 ){
					alert('Sorry! you have not update rights..........');
				}else if($('#VoucherTypeHidden').val()=='new' && $('.btnSave').data('insertbtn')==0){
					alert('Sorry! you have not insert rights..........');
				}else{
					e.preventDefault();
					self.initSave();
				}

				console.log(xhr.responseText);
			}
		});
	}

	var fetchL2 = function(l2) {

		$.ajax({
			url : base_url + 'index.php/level/fetchl2',
			type : 'POST',
			data : { 'l2' : l2 },
			dataType : 'JSON',
			success : function(data) {

				if (data === 'false') {
					alert('No data found');
				} else {
					populateDataL2(data);
				}

			}, error : function(xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	}

	var fetchL3 = function(l3) {

		$.ajax({
			url : base_url + 'index.php/level/fetchl3',
			type : 'POST',
			data : { 'l3' : l3 },
			dataType : 'JSON',
			success : function(data) {

				if (data === 'false') {
					alert('No data found');
				} else {
					populateDataL3(data);
				}

			}, error : function(xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	}

	var populateDataL1 = function(data) {
		$('#VoucherTypeHidden').val('edit');
		$.each(data, function(index, elem){

			$(settings.txtLevel1Id).val(elem.l1);
			$(settings.txtLevel1IdHidden).val(elem.l1);

			$(settings.txtLevel1Name).val(elem.name);
			$(settings.txtLevel1NameHidden).val(elem.name);
		});
	}

	var populateDataL2 = function(data) {
		$('#VoucherTypeHidden').val('edit');
		$.each(data, function(index, elem){

			$(settings.txtLevel2Id).val(elem.l2);
			$(settings.txtLevel2IdHidden).val(elem.l2);

			$(settings.level1_dropdown).select2('val',elem.l1);

			$(settings.txtLevel2Name).val(elem.name);
			$(settings.txtLevel2NameHidden).val(elem.name);
		});
	}

	var populateDataL3 = function(data) {
		$('#VoucherTypeHidden').val('edit');
		$.each(data, function(index, elem){

			$(settings.txtLevel3Id).val(elem.l3);
			$(settings.txtLevel3IdHidden).val(elem.l3);

			$(settings.level2_dropdown).select2('val',elem.l2);

			$(settings.txtLevel3Name).val(elem.name);
			$(settings.txtLevel3NameHidden).val(elem.name);
		});
	}

	// get the max id
	var setMaxId = function() {

		$.ajax({
			url : base_url + 'index.php/level/getMaxId',
			type : 'POST',
			dataType : 'JSON',
			success : function(data) {

				// set level 1 ids
				$(txtLevel1Id).val(data.l1);
				$(txtMaxLevel1IdHidden).val(data.l1);
				$(txtLevel1IdHidden).val(data.l1);

				// set level 2 ids
				$(txtLevel2Id).val(data.l2);
				$(txtMaxLevel2IdHidden).val(data.l2);
				$(txtLevel2IdHidden).val(data.l2);

				// set level 3 ids
				$(txtLevel3Id).val(data.l3);
				$(txtMaxLevel3IdHidden).val(data.l3);
				$(txtLevel3IdHidden).val(data.l3);

			}, error : function(xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	}

	// checks for the empty fields
	var validateL1Save = function() {

		var errorFlag = false;
		var name = $.trim($(settings.txtLevel1Name).val());

		if ( name === "" ) {
			$(settings.txtLevel1Name).addClass('inputerror');
			errorFlag = true;
		}

		return errorFlag;
	}

	// checks for the empty fields
	var validateL2Save = function() {

		var errorFlag = false;
		var name = $.trim($(settings.txtLevel2Name).val());
		var l1 = $(settings.level1_dropdown).val();

		// remove the previous classes
		$(settings.txtLevel2Name).removeClass('inputerror');
		$(settings.level1_dropdown).removeClass('inputerror');

		if ( name === "" ) {
			$(settings.txtLevel2Name).addClass('inputerror');
			errorFlag = true;
		}

		if ( l1 === "" || l1 === null ) {
			$(settings.level1_dropdown).addClass('inputerror');
			errorFlag = true;
		}

		return errorFlag;
	}

	// checks for the empty fields
	var validateL3Save = function() {

		var errorFlag = false;
		var name = $.trim($(settings.txtLevel3Name).val());
		var l2 = $(settings.level2_dropdown).val();

		// remove the previous classes
		$(settings.txtLevel3Name).removeClass('inputerror');
		$(settings.level2_dropdown).removeClass('inputerror');

		if ( name === "" ) {
			$(settings.txtLevel3Name).addClass('inputerror');
			errorFlag = true;
		}

		if ( l2 === "" || l2 === null ) {
			$(settings.level2_dropdown).addClass('inputerror');
			errorFlag = true;
		}

		return errorFlag;
	}

	//  checks if the name is already used?
	var isFieldValid = function( level ) {

		var errorFlag = false;
		var name = "";		// get the current level name entered by the user
		var lidHidden = "";		// hidden id
		var maxId = "";		// hidden max id
		var txtnameHidden = "";		// hidden level name

		if ( level === 'level1') {

			name = settings.txtLevel1Name;		// get the current level1 name entered by the user
			lidHidden = settings.txtLevel1Id;		// hidden l1
			maxId = settings.txtMaxLevel1IdHidden;		// hidden max l1
			txtnameHidden = settings.txtLevel1NameHidden;		// hidden level1 name
		}

		if ( level === 'level2') {

			name = settings.txtLevel2Name;		// get the current level2 name entered by the user
			lidHidden = settings.txtLevel2Id;		// hidden l2
			maxId = settings.txtMaxLevel2IdHidden;		// hidden max l2
			txtnameHidden = settings.txtLevel2NameHidden;		// hidden level2 name
		}

		if ( level === 'level3') {

			name = settings.txtLevel3Name;		// get the current level3 name entered by the user
			lidHidden = settings.txtLevel3Id;		// hidden l3
			maxId = settings.txtMaxLevel3IdHidden;		// hidden max l3
			txtnameHidden = settings.txtLevel3NameHidden;		// hidden level3 name
		}

		// remove the previous classes
		name.removeClass('inputerror');

		// if both values are not equal then we are in update mode
		if (lidHidden.val() !== maxId.val()) {

			$.ajax({
				url : base_url + 'index.php/level/updateNameCheck',
				type : 'POST',
				data : { 'txtnameHidden' : txtnameHidden.val().toLowerCase(), 'name': name.val().toLowerCase(), 'level': level },
				dataType : 'JSON',
				async : false,
				success : function(data) {

					if (data.error === 'true') {
						name.addClass('inputerror');
						errorFlag = true;
					}

				}, error : function(xhr, status, error) {
					console.log(xhr.responseText);
				}
			});

		} else {	// if both are equal then we are in save mode

			$.ajax({
				url : base_url + 'index.php/level/simpleNameCheck',
				type : 'POST',
				data : { 'name': name.val().toLowerCase(), 'level': level },
				dataType : 'JSON',
				async : false,
				success : function(data) {

					if (data.error === 'true') {
						name.addClass('inputerror');
						errorFlag = true;
					}
				}, error : function(xhr, status, error) {
					console.log(xhr.responseText);
				}
			});
		}

		return errorFlag;
	}

	// returns the level 1 object to save into database
	var getSaveL1Obj = function() {

		return obj = {

			l1 : $.trim($(settings.txtLevel1IdHidden).val()),
			name : $.trim($(settings.txtLevel1Name).val())
		};
	}

	// returns the level 2 object to save into database
	var getSaveL2Obj = function() {

		return obj = {

			l2 : $.trim($(settings.txtLevel2IdHidden).val()),
			name : $.trim($(settings.txtLevel2Name).val()),
			l1 : $(settings.level1_dropdown).val()
		};
	}

	// returns the level 2 object to save into database
	var getSaveL3Obj = function() {

		return obj = {

			l3 : $.trim($(settings.txtLevel3IdHidden).val()),
			name : $.trim($(settings.txtLevel3Name).val()),
			l2 : $(settings.level2_dropdown).val()
		};
	}

	return {

		init : function() {
			this.bindUI();
			$('#VoucherTypeHidden').val('new');
		},

		bindUI : function() {
			 
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

			///////////////////////////////////////////////////////////////////////
			///		Level 1 Events
			///////////////////////////////////////////////////////////////////////

			// when save button is clicked
			$(settings.btnSaveL1).on('click', function(e){
				if ($('#VoucherTypeHidden').val()=='edit' && $('.btnSaveL1').data('updatebtn')==0 ){
					alert('Sorry! you have not update rights..........');
				}else if($('#VoucherTypeHidden').val()=='new' && $('.btnSaveL1').data('insertbtn')==0){
					alert('Sorry! you have not insert rights..........');
				}else{
					e.preventDefault();		// prevent the default behaviour of the link
					self.initSaveL1();		// makes the voucher ready to save
				}
				
			});

			// when reset button is clicked
			$(settings.btnResetL1).on('click', function(e){
				e.preventDefault();		// prevent the default behaviour of the link
				self.resetVoucher();	// resets the voucher
			});

			// when btnEditLevel1 is clicked
			$('body').on('click','.btn-edit-level1', function(e) {
				e.preventDefault();		// prevent the default behaviour of the link
				fetchL1($(this).data('l1'));		// get the fee category detail by id

				$('a[href="#add_level1"]').trigger('click');
			});


			///////////////////////////////////////////////////////////////////////
			///		Level 2 Events
			///////////////////////////////////////////////////////////////////////

			// when save button is clicked
			$(settings.btnSaveL2).on('click', function(e){
				if ($('#VoucherTypeHidden').val()=='edit' && $('.btnSaveL1').data('updatebtn')==0 ){
					alert('Sorry! you have not update rights..........');
				}else if($('#VoucherTypeHidden').val()=='new' && $('.btnSaveL1').data('insertbtn')==0){
					alert('Sorry! you have not insert rights..........');
				}else{
					e.preventDefault();		// prevent the default behaviour of the link
					self.initSaveL2();		// makes the voucher ready to save
				}
			});

			// when reset button is clicked
			$(settings.btnResetL2).on('click', function(e){
				e.preventDefault();		// prevent the default behaviour of the link
				self.resetVoucherL2();	// resets the voucher
			});

			// when btnEditLevel2 is clicked
			$('body').on('click', '.btn-edit-level2', function (e) {
				e.preventDefault();		// prevent the default behaviour of the link
				fetchL2($(this).data('l2'));		// get the fee category detail by id

				$('a[href="#add_level2"]').trigger('click');
			});


			///////////////////////////////////////////////////////////////////////
			///		Level 3 Events
			///////////////////////////////////////////////////////////////////////

			// when save button is clicked
			$(settings.btnSaveL3).on('click', function(e){
				if ($('#VoucherTypeHidden').val()=='edit' && $('.btnSaveL1').data('updatebtn')==0 ){
					alert('Sorry! you have not update rights..........');
				}else if($('#VoucherTypeHidden').val()=='new' && $('.btnSaveL1').data('insertbtn')==0){
					alert('Sorry! you have not insert rights..........');
				}else{
					e.preventDefault();		// prevent the default behaviour of the link
					self.initSaveL3();		// makes the voucher ready to save
				}
			});

			// when reset button is clicked
			$(settings.btnResetL3).on('click', function(e){
				e.preventDefault();		// prevent the default behaviour of the link
				self.resetVoucherL3();	// resets the voucher
			});

			// when btnEditLevel3 is clicked
			$('body').on('click', '.btn-edit-level3', function (e) {
				e.preventDefault();		// prevent the default behaviour of the link
				fetchL3($(this).data('l3'));		// get the fee category detail by id

				$('a[href="#add_level3"]').trigger('click');
			});

			setMaxId();		// gets the max id of voucher
		},

		// makes the voucher ready to save
		initSaveL1 : function() {
			var l1Obj = getSaveL1Obj();	// returns the level 1 object to save into database
			var isValid = validateL1Save();		// checks for the empty fields

			if ( !isValid ) {

				isValid = isFieldValid('level1');
				// check if the level 1 name is already used??	if false
				if ( !isValid ) {

					// save the data in to the database
					save( l1Obj, 'level1' );
				} else {	// if fee category name is already used then show error
					alert("Level name already used.");
				}

			} else {
				alert('Correct the errors...');
			}
		},

		// makes the voucher ready to save
		initSaveL2 : function() {

			var l2Obj = getSaveL2Obj();	// returns the level 2 object to save into database
			var isValid = validateL2Save();		// checks for the empty fields

			if ( !isValid ) {

				isValid = isFieldValid('level2');
				// check if the level 1 name is already used??	if false
				if ( !isValid ) {

					// save the data in to the database
					save( l2Obj, 'level2' );
				} else {	// if fee category name is already used then show error
					alert("Level name already used.");
				}
			} else {
				alert('Correct the errors...');
			}
		},

		// makes the voucher ready to save
		initSaveL3 : function() {

			var l3Obj = getSaveL3Obj();	// returns the level 2 object to save into database
			var isValid = validateL3Save();		// checks for the empty fields

			if ( !isValid ) {

				isValid = isFieldValid('level3');
				// check if the level 3 name is already used??	if false
				if ( !isValid ) {

					// save the data in to the database
					save( l3Obj, 'level3' );
				} else {	// if fee category name is already used then show error
					alert("Level name already used.");
				}
			} else {
				alert('Correct the errors...');
			}
		},

		// resets the voucher
		resetVoucher : function() {
			$('.inputerror').removeClass('inputerror');

			$(settings.txtLevel1Id).val('');
			$(settings.txtLevel1Name).val('');
			$(settings.txtLevel1NameHidden).val('');
			$('#VoucherTypeHidden').val('new');
			setMaxId();		// gets the max id of voucher
			general.setPrivillages();
		},

		// resets the voucher Level 2
		resetVoucherL2 : function() {
			$('.inputerror').removeClass('inputerror');
			$(settings.txtLevel2Id).val('');
			$(settings.txtLevel2Name).val('');
			$(settings.txtLevel2NameHidden).val('');
			$(settings.level1_dropdown).val('');
			$('#VoucherTypeHidden').val('new');
			setMaxId();		// gets the max id of voucher
			general.setPrivillages();
		},

		// resets the voucher Level 3
		resetVoucherL3 : function() {
			$('.inputerror').removeClass('inputerror');
			$(settings.txtLevel3Id).val('');
			$(settings.txtLevel3Name).val('');
			$(settings.txtLevel3NameHidden).val('');
			$(settings.level2_dropdown).val('');
			$('#VoucherTypeHidden').val('new');
			setMaxId();		// gets the max id of voucher
		}
	};

};

var level = new Level();
level.init();