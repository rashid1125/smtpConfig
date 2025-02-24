var Color = function () {
	const saveColor = `${base_url}/color/saveColor`;
	const getColorById = `${base_url}/color/getColorById`;
	var settings = {

		// basic information section

		txtColorIdHidden: $('#txtColorIdHidden'),
		txtName: $('#txtName'),
        txtColor: $('#txtColor'),
		
		// buttons
		btnSave: $('.btnSave'),
		btnReset: $('.btnReset'),
	};


	var save = async function (accountObj) {
		general.disableSave();

		try {
			const response = await new Promise((resolve, reject) => {
				$.ajax({
					url: `${saveColor}`,
					type: 'POST',
					data: { 'colordetail': accountObj },
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
				self.resetVoucher();
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

	var validateSave = function () {

		var errorFlag = false;

		var name = $(settings.txtName).val();

		// remove the error class first
		$('#txtName').removeClass('inputerror');
		

		if (name === '') {
			$('#txtName').addClass('inputerror');
			errorFlag = true;
		}


		return errorFlag;
	};

    var validateSave = function () {
        var errorFlag = false;

        var name = $(settings.txtName).val();

        // Remove the error class first
        $(settings.txtName).removeClass('inputerror');

        if (name === '') {
            $(settings.txtName).addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    };

    var getSaveObject = function () {
        const obj = {
            id: $.trim($(settings.txtColorIdHidden).val()),
            name: $(settings.txtName).val(),
            color: $(settings.txtColor).val()
        };
        return obj;
    }
	
	var isFieldValid = function () {
		var errorFlag = false;
		var name = settings.txtName;
		var txtColorIdHidden = settings.txtColorIdHidden;		

		var accountNames = new Array();
		// get all branch names from the hidden list
		$("#allNames option").each(function () {
			accountNames.push($(this).text().trim().toLowerCase());
		});


		return errorFlag;
	};

	var fetch = function (id) {
		$.ajax({
			url: `${getColorById}`,
			type: 'GET',
			data: { 'id': id },
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
		$('#txtColorIdHidden').val(elem.id);
		$('#txtName').val(elem.name);
       	$('#txtColor').val(elem.color);
		
	};


	return {

		init: function () {
			this.bindUI();
		},


		bindUI: function () {
			general.setupfetchhelp($(".page_title").text());
			$('[data-toggle="tooltip"]').tooltip();
			var self = this;
			

			

			shortcut.add("F1", function () {
				$('a[href="#party-lookup"]').get()[0].click();
			});
			shortcut.add("F10", function () {
				$(settings.btnSave).get()[0].click();
			});
			// when save button is clicked
			$(settings.btnSave).on('click', function (e) {
				if ($('#txtColorIdHidden').val() == 'edit' && $('.btnSave').data('updatebtn') == 0) {
					alert('Sorry! you have not update rights..........');
				} else if ($('#txtColorIdHidden').val() == 'new' && $('.btnSave').data('insertbtn') == 0) {
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

			$('body').on('click', '.btn-edit-color', function (e) {
				e.preventDefault();		// prevent the default behaviour of the link
				fetch($(this).data('id'));		// get the detail by id
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
					save(accountObj);	// saves the detail into the database
				} else {	// if fee category name is already used then show error
					alert("Color name already used.");
				}
			} else {
				alert('Correct the errors!');
			}
		},

        resetVoucher: function () {
            $('.inputerror').removeClass('inputerror');
            
            const resetArray = [
                'txtName',
                'txtColor'
            ];
        
            // Reset the values of elements in the resetArray
            resetArray.forEach(function(elementId) {
                $('#' + elementId).val('');
            });
        },
        
        
	};
};
var color = new Color();
color.init();