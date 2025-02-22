var Category = function () {
	const saveSubCategory = `${base_url}/item/subcategory/saveSubCategory`;
	const getSubCategoryById = `${base_url}/item/subcategory/getSubCategoryById`;

	var save = function (category) {
		general.disableSave();
		$.ajax({
			url: `${saveSubCategory}`,
			type: 'POST',
			data: { 'category': JSON.stringify(category) },
			dataType: 'JSON',
			success: function (response) {
				if (response.status == false && response.message !== "" && response.error !== "") {
					_getAlertMessage('Error!', response.message, 'danger');
				} else if (response.status == false && response.message !== "") {
					_getAlertMessage('Information!', response.message, 'info');
				} else {
					_getAlertMessage('Successfully!', response.message, 'success');
					general.reloadWindow();
				}
				general.enableSave();
			}, error: function (xhr, status, error) {
				general.enableSave();
				console.log(xhr.responseText);
			}
		});
	};

	var fetch = function (catid) {

		$.ajax({
			url: `${getSubCategoryById}`,
			type: 'GET',
			data: { 'subcatid': catid },
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

	var populateData = function (elem) {
		$('#vouchertypehidden').val('edit');
		// $('#txtId').val(elem.subcatid);
		$('#txtIdHidden').val(elem.subcatid);
		$('#txtName').val(elem.name);
		$('#txtsubcategory_uname').val(elem.uname);
		$('#txtDescription').val(elem.description);
		$.trim($('#txtcolor').val(elem.color));
		$.trim($('#txtcolorf').val(elem.fontcolor));
		// $('#category_dropdown').select2('val', elem.catid);
	};

	// checks for the empty fields
	var validateSave = function () {

		var errorFlag = false;

		var name = $.trim($('#txtName').val());
		// var category = $('#category_dropdown').val();

		// remove the error class first
		$('#txtName').removeClass('inputerror');

		if (name === '') {
			$('#txtName').addClass('inputerror');
			errorFlag = true;
		}

		// if (category === '') {
		// 	$('#category_dropdown').addClass('inputerror');
		// 	errorFlag = true;
		// }

		return errorFlag;
	};

	var getSaveObject = function () {
		var obj = {};

		obj.subcatid    = $.trim($('#txtIdHidden').val());
		obj.name        = $.trim($('#txtName').val());
		obj.uname       = $.trim($('#txtsubcategory_uname').val());
		obj.description = $.trim($('#txtDescription').val());
		obj.color       = $.trim($('#txtcolor').val());
		obj.fontcolor   = $.trim($('#txtcolorf').val());
		obj.type        = $('#vouchertypehidden').val();

		return obj;
	};

	return {

		init: function () {
			$('#vouchertypehidden').val('new');
			this.bindUI();
		},

		bindUI: function () {
			 
			$('[data-toggle="tooltip"]').tooltip();
			$('#txtName').focus();
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

			$('.btnReset').on('click', function (e) {
				e.preventDefault();
				self.resetVoucher();
			});

			$('#txtId').on('keypress', function (e) {
				if (e.keyCode === 13) {
					if ($('#txtId').val().trim() !== "") {
						var subcatid = $.trim($('#txtId').val());
						fetch(subcatid);
					}
				}
			});

			$('body').on('click', '.btn-edit-cat', function (e) {
				e.preventDefault();
				fetch($(this).data('subcatid'));
				$('a[href="#add_category"]').trigger('click');
			});
		},

		initSave: function () {

			var saveObj = getSaveObject();
			var error = validateSave();

			if (!error) {
				save(saveObj);
			} else {
				_getAlertMessage('Error!', 'Correct the errors', 'danger');
			}
		},

		resetVoucher: function () {
			general.reloadWindow();
		}
	};
};

var category = new Category();
category.init();