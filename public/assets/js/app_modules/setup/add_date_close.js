var DateClose = function () {
	// saves the data into the database
	var bulksave = function (obj) {
		general.disableSave();
		$.ajax({
			url: base_url + '/utilities/dateClose/saveOpenDateClose',
			type: 'POST',
			data: { 'obj': obj, 'etype': 'dateclose' },
			dataType: 'JSON',
			success: function (response) {
				if (response.status == false && response.error !== "") {
					_getAlertMessage('Error!', response.message, 'danger');
				} else if (response.status == false && response.message !== "") {
					_getAlertMessage('Information!', response.message, 'info');
				} else {
					_getAlertMessage('Successfully!', response.message, 'success');
					resetFields();
				}
				general.enableSave();
				$('#txtPassword').val('');
			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	};
	// saves the data into the database
	var save = function (obj) {
		general.disableSave();
		$.ajax({
			url: base_url + '/utilities/dateClose/saveDateClose',
			type: 'POST',
			data: { 'voucher_type_hidden': $('#vouchertypehidden').val(), 'etype': 'dateclose', 'obj': obj },
			dataType: 'JSON',
			success: function (response) {
				if (response.status == false && response.error !== "") {
					_getAlertMessage('Error!', response.message, 'danger');
				} else if (response.status == false && response.message !== "") {
					_getAlertMessage('Information!', response.message, 'info');
				} else {
					_getAlertMessage('Successfully!', response.message, 'success');
					resetFields();
					fetchallrecord();
				}

				general.enableSave();

			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	};
	var fetch = function (dateclose_id) {
		$.ajax({
			url: base_url + '/utilities/dateClose/fetchDateClose',
			type: 'GET',
			data: { 'dateclose_id': dateclose_id },
			dataType: 'JSON',
			success: function (data) {
				resetFields();
				if (data === 'false') {
					$('#vouchertypehidden').val('new');
					alert('No data found');
					resetFields();
					$('#txtIdHidden').val($('#txtMaxIdHidden').val());
				} else {
					populateData(data[0]);
				}
			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	};

	var resetFields = function () {
		$('#vouchertypehidden').val('new');
		$('.save-elem').each(function (ind, elem) {
			if ($(this).prop('type') === 'radio' || $(this).prop('type') === 'checkbox') {
				return true;
			} else if ($(this).hasClass('ts_datepicker')) {
				$(this).datepicker('update', new Date());
			} else {
				$(this).val('').trigger('liszt:updated');
				$('#user_dropdwon').val('').trigger('liszt:updated');
			}
		});
		$('.btnOpen').prop('disabled', true);
	};

	var deleteVoucher = function (dateclose_id) {

		$.ajax({
			url: base_url + '/utilities/dateClose/deleteVoucher',
			type: 'POST',
			data: { 'dateCloseId': dateclose_id, 'etype': 'dateclose', 'password': $.trim($('#txtPassword').val()) },
			dataType: 'JSON',
			success: function (response) {
				if (response.status == false && response.error !== "") {
					_getAlertMessage('Error!', response.message, 'danger');
				} else if (response.status == false && response.message !== "") {
					_getAlertMessage('Information!', response.message, 'info');
				} else {
					_getAlertMessage('Successfully!', response.message, 'success');
					general.reloadWindow();
				}
			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	};

	// generates the view
	var populateData = function (data) {
		$('#vouchertypehidden').val('edit');
		$('.save-elem').each(function (ind, elem) {
			var col = $(this).attr('name');
			if ($(this).hasClass('bs_switch')) {
				$(this).bootstrapSwitch('state', (data[col] === "true") ? true : false);
			} else if ($(this).prop('type') === 'radio') {
				var name = $(this).prop('name');
				$("input[name='" + name + "'][value=" + data[col] + "]").prop("checked", true);
			} else if ($(this).hasClass('ts_datepicker')) {
				var name = $(this).prop('name');
				$(this).datepicker("update", getFormattedDate(data[col]));
			} else {
				$(this).val(data[col]).trigger('liszt:updated');
				$('#user_dropdwon').val(data.uid).trigger('liszt:updated');
			}
		});
		$('#dateCloseIdHidden').val(data.id);
		$('.btnOpen').prop('disabled', false);
	};

	// checks for the empty fields
	var validateSave = function () {

		var errorFlag = 0;
		// remove the error class first
		$('.inputerror').removeClass('inputerror');

		$('.validate-save').each(function (ind, elem) {
			if ($.trim($(this).val()) === '') {
				if ($(this).hasClass('chosen')) {
					$("#" + $(this).prop('id') + "_chzn").addClass('inputerror');
				} else {
					$(this).addClass('inputerror');
				}
				errorFlag += 1;
			}
		});

		return errorFlag;
	};

	var validateBulkSave = function () {

		var errorFlag = 0;
		// remove the error class first
		$('.inputerror').removeClass('inputerror');
		if ($('#txtPassword').val() == '') {
			$('#txtPassword').addClass('inputerror');
			errorFlag += 1;
		}


		return errorFlag;
	};

	// returns the fee category object to save into database
	var getSaveObject = function () {
		var obj = {};
		$('.save-elem').each(function (ind, elem) {
			if ($(this).is('input') || $(this).is('select') || $(this).is('textarea')) {
				if ($(this).hasClass('bs_switch')) {
					obj[$(this).attr('name')] = $(this).bootstrapSwitch("state");
				} else if ($(this).prop('type') === 'radio') {
					obj[$(this).attr('name')] = $("input[name='" + $(this).prop('name') + "']:checked").val();
				} else if ($(this).prop('type') === 'checkbox') {
					var arr = [];
					$.each($("input[name='" + $(this).prop('name') + "']:checked"), function () {
						arr.push($(this).val());
					});
					obj[$(this).attr('name')] = arr.join(',');
				} else {
					if ($(this).attr('name') === "remarks") {
						obj[$(this).attr('name')] = ($.trim($(this).val())) ? $.trim($(this).val()) : 'Closed';
					} else {
						obj[$(this).attr('name')] = $.trim($(this).val());
					}
				}
			}
		});
		return obj;
	};

	var fetchallrecord = function () {
		if (typeof dateclose.dTable != 'undefined') {
			dateclose.dTable.fnDestroy();
			$('#table_body').empty();
		}
		$.ajax({
			url: base_url + '/utilities/dateClose/fetchAllDateCloseRecord',
			type: 'GET',
			dataType: 'JSON',
			success: function (data) {
				if (data === 'false') {
					alert('No data found');
				} else {
					tabledata(data);
				}
			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	};

	var fetchallopenrecord = function () {
		if (typeof dateclose.dTable != 'undefined') {
			dateclose.dTable.fnDestroy();
			$('#tableopen_body').empty();
		}
		$.ajax({
			url: base_url + '/utilities/dateClose/fetchAllOpenDatesRecord',
			type: 'GET',
			dataType: 'JSON',
			success: function (data) {
				if (data === 'false') {
					alert('No data found');
				} else {
					tabledataopen(data);
				}
			}, error: function (xhr, status, error) {
				console.log(xhr.responseText);
			}
		});
	};
	var tabledata = function (data) {
		$.each(data, function (index, elem) {
			appendToTable('', elem.date_cl, elem.remarks, elem.id);
		});
		bindGrid();
	};

	var tabledataopen = function (data) {
		$.each(data, function (index, elem) {
			appendToOpenTable('', elem.Date, '', '');
		});
		bindGrid2();
	};

	var appendToOpenTable = function (srno, date_cl, remarks, dateclose_id) {
		var srnoa = $('#table_dataopen tbody tr').length + 1;
		var row = "<tr>" +
			"<td class='srno text-left' data-title='Sr#' > " + srnoa + "</td>" +
			"<td class='date_cl' data-title='Programtype Name' data-date_cl='" + getFormattedDate(date_cl) + "'> " + getFormattedDate(date_cl) + "</td>" +
			"</tr>";
		$(row).appendTo('#table_dataopen');
	};

	var appendToTable = function (srno, date_cl, remarks, dateclose_id) {
		var srnoa = $('#table_data tbody tr').length + 1;
		var row = "<tr class='group item-row-td hover:bg-orange-500 hover:text-white hover:cursor-pointer odd:bg-white even:bg-slate-50'>" +
			"<td class='py-1 px-1 text-sm text-md align-middle text-left'> " + srnoa + "</td>" +
			"<td class='py-1 px-1 text-sm text-md align-middle text-left date_cl' data-date_cl='" + getFormattedDate(date_cl) + "'> " + getFormattedDate(date_cl) + "</td>" +
			"<td class='py-1 px-1 text-sm text-md align-middle text-left remarks' data-remarks='" + remarks + "'> " + remarks + "</td>" +
			"<td class='py-1 px-1 text-sm text-md align-middle text-right'><a href='' class='btn btn-sm btn-primary btn-edit-dateclose_id' data-dateclose_id='" + dateclose_id + "' style='width:40px !important'><span class='fa fa-edit'></span></a></td>" +
			"</tr>";
		$(row).appendTo('#table_data');
	};
	var bindGrid = function () {
		var dontSort = [];
		$('#table_data thead th').each(function () {
			if ($(this).hasClass('no_sort')) {
				dontSort.push({ "bSortable": false });
			} else {
				dontSort.push(null);
			}
		});
		dateclose.dTable = $('#table_data').dataTable({
			"aaSorting": [[0, "asc"]],
			"bPaginate": true,
			"sPaginationType": "full_numbers",
			"bJQueryUI": false,
			"aoColumns": dontSort,
			"bSort": true,
			"iDisplayLength": 10,
		});
		$.extend($.fn.dataTableExt.oStdClasses, {
			"s`": "dataTables_wrapper form-inline"
		});
	};


	var bindGrid2 = function () {
		var dontSort = [];
		$('#table_dataopen thead th').each(function () {
			if ($(this).hasClass('no_sort')) {
				dontSort.push({ "bSortable": false });
			} else {
				dontSort.push(null);
			}
		});
		dateclose.dTable = $('#table_dataopen').dataTable({
			"aaSorting": [[0, "asc"]],
			"bPaginate": true,
			"sPaginationType": "full_numbers",
			"bJQueryUI": false,
			"aoColumns": dontSort,
			"bSort": true,
			"iDisplayLength": 10
		});
		$.extend($.fn.dataTableExt.oStdClasses, {
			"s`": "dataTables_wrapper form-inline"
		});
	};


	return {

		init: function () {
			$('#vouchertypehidden').val('new');
			this.bindUI();
			fetchallrecord();
			fetchallopenrecord();
		},
		bindUI: function () {
			var self = this;

			shortcut.add("F10", function () {
				$('.btnSave').first().trigger('click');
			});
			shortcut.add("F6", function () {
				$('#dateCloseIdHidden').focus();
			});
			shortcut.add("F3", function () {
				$('#vehicleLookupBtn').trigger('click');
			});
			shortcut.add("alt+1", function () {
				$('a[href="#adddateclose"]').trigger('click');
			});

			shortcut.add("alt+2", function () {
				$('a[href="#view_all"]').trigger('click');
			});

			shortcut.add("alt+3", function () {
				$('a[href="#view_allopen"]').trigger('click');
			});

			shortcut.add("F5", function () {
				self.resetVoucher();
			});

			$('#dateCloseIdHidden').on('change', function () {
				fetch($(this).val());
				$('.btnOpen').attr('disabled', false);
			});
			// when save button is clicked
			$('.btnSave').on('click', function (e) {
				e.preventDefault();
				self.initSave();
			});

			// when Bulk save button is clicked
			$('.btnBulkSave').on('click', function (e) {
				e.preventDefault();
				self.initBulkSave();
			});
			$('.btnOpen').on('click', function (e) {
				e.preventDefault();
				var vrnoa = $('#dateCloseIdHidden').val();
				var errors = validateSave();			// checks for the empty fields
				if (errors == 0) {
					if (vrnoa !== '') {
						if (confirm('Are you sure to Open this Date?'))
							deleteVoucher(vrnoa);
					}
				} else {
					alert('Correct the errors...');
				}
			});

			// when the reset button is clicked
			$('.btnReset').on('click', function (e) {
				e.preventDefault();		// prevent the default behaviour of the link
				resetFields();
			});
			// when text is chenged inside the id textbox
			$('#dateCloseIdHidden').on('keypress', function (e) {
				// check if enter key is pressed
				if (e.keyCode === 13) {
					// get the based on the id entered by the user
					if ($('#dateCloseIdHidden').val().trim() !== "") {
						var dateclose_id = $.trim($('#dateCloseIdHidden').val());
						fetch(dateclose_id);
						$('.btnOpen').attr('disabled', false);
					}
				}
			});

			// when edit button is clicked inside the table view
			$("body").on('click', '.btn-edit-dateclose_id', function (e) {
				e.preventDefault();
				fetch($(this).data('dateclose_id'));		// get the class detail by id
				$('a[href="#adddateclose"]').trigger('click');
				$('.btnOpen').attr('disabled', false);
			});
		},

		// makes the voucher ready to save
		initSave: function () {

			var saveObj = getSaveObject();	// returns the class detail object to save into database
			var errors = validateSave();			// checks for the empty fields

			if (errors == 0) {
				save(saveObj);
			} else {
				alert('Correct the errors...');
			}
		},
		// makes the voucher ready to save
		initBulkSave: function () {
			var errors = validateBulkSave();
			var saveObj = {};
			saveObj['Password'] = $('#txtPassword').val();
			if (errors == 0) {
				bulksave(saveObj);
			} else {
				alert('Correct the errors...');
			}
		},
		// resets the voucher
		resetVoucher: function () {
			general.reloadWindow();
		}
	};
};
var dateclose = new DateClose();
dateclose.init();

if ($('#vouchertypehidden').val() === 'new') {
    $('.btnOpen').attr('disabled', true);
} else {
	$('.btnOpen').attr('disabled', false);
}
