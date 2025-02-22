import AlertComponent from "../../../../js/components/AlertComponent.js";
import { userApiEndpoints } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText, ifNull, validateEmail } from "../commonFunctions/CommonFunction.js";

var RegisterUser = function () {
	const modalInstance = $('#userAddModalId');

	var getSaveObj = function () {
		const data = {};
		data.id = $('#userHiddenId').val();
		data.name = $('#userFullName').val();
		data.username = $('#userName').val();
		data.email = $('#userMail').val();
		data.password = $('#userPassword').val().trim();
		data.mobile = $('#userMobile').val().trim();
		data.rgid = $('#userRoleGroupDropdown').val();
		data.allowed_financial_year_id = $('#financialYearDropdown').val().join(",");
		data.company_id = $('#companyDropdown').val();
		data.user_report_to_id = $('#userReportToDropdown').val();
		return data;
	};
  

	var validateSave = function () {
		let errorFlag = false;
		// Retrieve input values
		const userFullName = $('#userFullName').val().trim();
		const userName = $('#userName').val().trim();
		const userMail = $('#userMail').val().trim();
		const userPassword = $('#userPassword').val().trim();
		const userMobile = $('#userMobile').val().trim();
		const userRoleGroupDropdown = $('#userRoleGroupDropdown').val();
		const financialYearDropdown = $('#financialYearDropdown').val();
		const companyDropdown = $('#companyDropdown').val();
		const userReportToDropdown = $('#userReportToDropdown').val();

		// Validate Full Name
		if (userFullName === '') {
			AlertComponent._getAlertMessage('Error!', 'Please enter your full name', 'danger');
			$('#userFullName').addClass('inputerror').focus();
			errorFlag = true;
		}

		// Validate User Name
		if (userName === '') {
			AlertComponent._getAlertMessage('Error!', 'Please enter a user name', 'danger');
			$('#userName').addClass('inputerror').focus();
			errorFlag = true;
		}

		// Validate Email
		if (userMail === '') {
			AlertComponent._getAlertMessage('Error!', 'Please enter your email', 'danger');
			$('#userMail').addClass('inputerror').focus();
			errorFlag = true;
		} else if (!validateEmail(userMail)) {
			AlertComponent._getAlertMessage('Error!', 'Invalid email address', 'danger');
			$('#userMail').addClass('inputerror').focus();
			errorFlag = true;
		}

		// Validate Password
		if (userPassword === '') {
			AlertComponent._getAlertMessage('Error!', 'Please enter a password', 'danger');
			$('#userPassword').addClass('inputerror').focus();
			errorFlag = true;
		} else if (userPassword.length < 8) {
			AlertComponent._getAlertMessage('Error!', 'Password must be at least 8 characters long.', 'danger');
			$('#userPassword').addClass('inputerror').focus();
			errorFlag = true;
		}

		// Validate Mobile Number
		if (userMobile === '') {
			AlertComponent._getAlertMessage('Error!', 'Please enter your mobile number.', 'danger');
			$('#userMobile').addClass('inputerror').focus();
			errorFlag = true;
		}

		// Validate User Role Group Dropdown
		if (userRoleGroupDropdown === null) {
			AlertComponent._getAlertMessage('Error!', 'Please select a role group.', 'danger');
			$('#userRoleGroupDropdown').addClass('inputerror').focus();
			errorFlag = true;
		}

		// Validate Financial Year Dropdown
		if (financialYearDropdown === null) {
			AlertComponent._getAlertMessage('Error!', 'Please select at least one financial year.', 'danger');
			$('#financialYearDropdown').addClass('inputerror').focus();
			errorFlag = true;
		}

		// Validate Company Dropdown
		if (companyDropdown === null) {
			AlertComponent._getAlertMessage('Error!', 'Please select a company.', 'danger');
			$('#companyDropdown').addClass('inputerror').focus();
			errorFlag = true;
		}

		// Validate userReportTo Dropdown
		if (userReportToDropdown === null) {
			AlertComponent._getAlertMessage('Error!', 'Please select a ReportTo.', 'danger');
			$('#userReportToDropdown').addClass('inputerror').focus();
			errorFlag = true;
		}
		return errorFlag;
	};

	// saves the data into the database
	var save = async function (user) {
        
		const response = await makeAjaxRequest('POST', `${userApiEndpoints.saveUser}`, {
			userData: JSON.stringify(user)
		});
		if (response.status == false && response.error !== "") {
			AlertComponent._getAlertMessage('Error!', response.message, 'danger');
		} else if (response.status == false && response.message !== "") {
			AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
		} else {
			AlertComponent._getAlertMessage('Successfully!', response.message, 'success');
			resetVoucher();
			$(modalInstance).modal('hide');
		}
	};

	var populateData = function (data) {
		$('#userAddModalId').modal('show');
		$('#userHiddenId').val(data.id);
		$('#userFullName').val(data.name);
		$('#userName').val(data.username);
		$('#userMail').val(data.email);
		$('#userPassword').val(data.password);
		$('#userMobile').val(data.mobile);
		$('#financialYearDropdown').val(data.allowed_financial_year_id).trigger('change');
		$('#userRoleGroupDropdown').val(data.rgid).trigger('change');
		$('#companyDropdown').val(data.company_id).trigger('change');
		$('#userReportToDropdown').val(data.user_report_to_id).trigger('change');
		$('#vouchertypehidden').val('edit');
	};

	var getUserById = async function (userId) {
        const response = await makeAjaxRequest('GET', `${userApiEndpoints.getUserById}`, {
			id: userId
		});
		resetField();
		if (response.status == false && response.error !== "") {
			AlertComponent._getAlertMessage('Error!', response.message, 'danger');
		} else if (response.status == false && response.message !== "") {
			AlertComponent._getAlertMessage('Warning!', response.message, 'warning');
		} else {
			console.log(response);
			populateData(response.data);
		}
    };

	let userDataTable = undefined;
	const getUserDataTable = (voucherType = "", itemType = "") => {
		if (typeof userDataTable !== 'undefined') {
			userDataTable.destroy();
			$('#userDataTableTbody').empty();
		}
		userDataTable = $("#userDataTable").DataTable({
			processing: true,
			serverSide: true,
			ajax: {
				url: `${userApiEndpoints.getUserDataTable}`,
				data: function (data) {
					data.params = {
						sac: "",
						voucherType: voucherType,
						itemType: itemType,
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
					data: "id",
					name: 'id',
					className: "id",
				},
				{
					data: "name",
					name: 'name',
					className: "text-left name",
				},
				{
					data: "email",
					name: 'email',
					className: "email",
					render: function (data, type, row) {
						return ifNull(data, "-");
					}
				},
				{
					data: "role_group.name",
					name: 'roleGroup.name',
					className: "role_group_name",
					render: function (data, type, row) {
						return ifNull(data, "-");
					}
				},
				{
					data: "user_company.company_name",
					name: 'userCompany.company_name',
					className: "user_company_name",
					render: function (data, type, row) {
						return ifNull(data, "-");
					}
				},
				{
					data: null,
					className: "select text-right",
					searchable: false,
					orderable: false,
					render: function (data, type, row) {
						let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-user" data-vrnoa_hide="' + row.id + '" data-toggle="tooltip" data-title="View Detail On Modal"><i class="fa fa-edit"></i></button>';
						if (row.active == "1") {
							buttons += '<a href="#" class="btn btn-sm btn-outline-warning group-hover:bg-yellow-800 group-hover:border-yellow-800 group-hover:text-white btn-Active-actionReload btn-Active-action text-center ml-2" data-tName="user" data-eType="' + row.etype + '" data-cName="active" data-pId="pid" data-action="/setup/inactive" data-vrnoa="' + row.id + '"><i class="fas fa-times-circle"></i></a>';
						} else if (row.active == "0") {
							buttons += '<a href="#" class="btn btn-sm btn-outline-success group-hover:bg-green-600 group-hover:border-green-600 group-hover:text-white btn-inActive-actionReload btn-inActive-action text-center ml-2" data-tName="user" data-eType="' + row.etype + '" data-cName="active" data-pId="pid" data-action="/setup/active" data-vrnoa="' + row.id + '"><i class="fas fa-check"></i></a>';
						}
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
		const resetArray = [
			'userHiddenId',
			'userFullName',
			'userName',
			'userMail',
			'userPassword',
			'userMobile',
			'userRoleGroupDropdown',
			'financialYearDropdown',
			'companyDropdown',
			'userReportToDropdown'
		];
		$(".inputerror").removeClass("inputerror");
		clearValueAndText(resetArray, '#');
	};

	const resetVoucher = () => {
		resetField();
		getUserDataTable();
	};

	return {

		init: function () {
			this.bindUI();
			getUserDataTable();
			$('.select2').select2();
		},

		bindUI: function () {
			const self = this;
			$('[data-toggle="tooltip"]').tooltip();
			$('input[id$="txtPassowrd"]').keyup(function () {
				var pass = $(this).val();
				if (pass.length < 8) {
					$('#length').removeClass('valid').addClass('invalid');
				} else {
					$('#length').removeClass('invalid').addClass('valid');
				}
				if (pass.match(/[a-z]/)) {
					$('#letter').removeClass('invalid').addClass('valid');
				} else {
					$('#letter').removeClass('valid').addClass('invalid');
				}

				if (pass.match(/[A-Z]/)) {
					$('#capital').removeClass('invalid').addClass('valid');
				} else {
					$('#capital').removeClass('valid').addClass('invalid');
				}

				if (pass.match(/\d/)) {
					$('#number').removeClass('invalid').addClass('valid');
				} else {
					$('#number').removeClass('valid').addClass('invalid');
				}

			}).focus(function () {
				$('#passInfo').show();
			}).blur(function () {
				$('#passInfo').hide();
			});

			$("#txtEmail").on("change", function () {
				var sEmail = $("#txtEmail").val();
				// Checking Empty Fields
				if (validateEmail(sEmail)) {

					$("#txtEmail").removeClass("inputerror");
				} else {
					alert("Invalid Email Address");
					// e.preventDefault();
					$("#txtEmail").addClass("inputerror");
					$("#txtEmail").focus();
				}
			});
			$(document.body).on('click', '#userModalShow', function (e) {
				e.preventDefault();
				resetField();
				$(modalInstance).modal('show');
			});
			$(document.body).on('click', '#userSyncAlt', function (e) {
				e.preventDefault();
				getUserDataTable();
			});

			shortcut.add("F10", function () {
				$('#userSaveButton').get()[0].click();
			});
			shortcut.add("F5", function () {
				$('#userResetButton').get()[0].click();
			});
			// when save button is clicked
			$('#userSaveButton').on('click', function (e) {
				e.preventDefault();
				self.initSave();
			});

			// when the reset button is clicked
			$('#userResetButton').on('click', function (e) {
				e.preventDefault();
				resetVoucher();
			});
			// when edit button is clicked inside the table view
			$('body').on('click', '.btn-edit-user', function (e) {
				e.preventDefault();
				var userId = $(this).data('vrnoa_hide');
				getUserById(userId);
			});
		},

		initSave: function () {
			var error = validateSave();
			var obj = getSaveObj();
			if (!error) {
				save(obj);
			} else {
				alert('Correct the errors...');
			}
		},
	};

};
var registerUser = new RegisterUser();
registerUser.init();
