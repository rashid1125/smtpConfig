import AlertComponent from "../../../../js/components/AlertComponent.js";
import { userRoleGroupApi } from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { parseNumber } from "../commonFunctions/CommonFunction.js";

const UserRoleGroup = function () {

    var getSaveObject = function () {
        const voucherData = {};
        const voucher = {};
        const report = {};
        const privilegeGroup = {};
        const voucherTypeList = ['insert', 'update', 'delete', 'print'];
        $('.voucherPrivilege').find('input[type="checkbox"]').each(function (index, elem) {
            const voucherId = $(elem).attr('id');
            const voucherType = $(this).attr('name');
            if (voucherTypeList.indexOf(voucherType) == -1) {
                const detail = {};
                detail[voucherId] = ($(elem).is(':checked') == true) ? 1 : 0;
                detail['insert'] = ($(`#${voucherId}_insert`).is(':checked') == true) ? 1 : 0;
                detail['update'] = ($(`#${voucherId}_update`).is(':checked') == true) ? 1 : 0;
                detail['delete'] = ($(`#${voucherId}_delete`).is(':checked') == true) ? 1 : 0;
                detail['print'] = ($(`#${voucherId}_print`).is(':checked') == true) ? 1 : 0;
                voucher[voucherId] = detail;
            }
        });

        $('.reportGroupPrivilege').find('input[type="checkbox"]').each(function (index, elem) {
            const voucherId = $(elem).attr('id');
            report[voucherId] = ($(elem).is(':checked') == true) ? 1 : 0;
        });

        privilegeGroup.vouchers = voucher;
        privilegeGroup.reports = report;

        const privilegeStringify = JSON.stringify(privilegeGroup);
        const privilegeObject = JSON.parse(privilegeStringify);
        const privilegePretty = JSON.stringify(privilegeObject, null, "\t");

        voucherData.rgid = $('#groupId').val();
        voucherData.name = $('#groupName').val();
        voucherData.desc = privilegePretty;

        return voucherData;
    };


    var validateSave = function () {
        let errorFlag = false;
        // Retrieve input values
        const groupName = $('#groupName').val().trim();
        // Validate Full Name
        if (groupName === '') {
            AlertComponent._getAlertMessage('Error!', 'Please enter your full name', 'danger');
            $('#groupName').addClass('inputerror').focus();
            errorFlag = true;
        }

        return errorFlag;
    };

    // saves the data into the database
    var save = async function (roleGroup) {

        const response = await makeAjaxRequest('POST', `${userRoleGroupApi.saveRoleGroup}`, {
            roleGroup: roleGroup
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ 'title': "Error!", 'message': response.message, 'type': "danger" });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ 'title': "Warning!", 'message': response.message, 'type': "warning" });
        } else {
            AlertComponent.getAlertMessage({ 'title': "Successfully!", 'message': response.message, 'type': "success" });
            general.reloadWindow();
        }
    };

    var populateData = function (data) {
        $('a[href="#Main"]').trigger('click');
        $('#groupId').val(data.rgid);
        $('#groupName').val(data.name);

        const privileges = JSON.parse(data.desc);

        const vouchers = privileges.vouchers;
        const voucherKey = Object.keys(vouchers);

        $.each(voucherKey, function (index, elem) {
            const detail = vouchers[elem];

            const voucherRights = parseNumber(detail[elem]) === 1;
            const voucherInsert = parseNumber(detail['insert']) === 1;
            const voucherUpdate = parseNumber(detail['update']) === 1;
            const voucherDelete = parseNumber(detail['delete']) === 1;
            const voucherPrint = parseNumber(detail['print']) === 1;

            $(`#${elem}`).prop('checked', voucherRights);
            $(`#${elem}_insert`).prop('checked', voucherInsert);
            $(`#${elem}_update`).prop('checked', voucherUpdate);
            $(`#${elem}_delete`).prop('checked', voucherDelete);
            $(`#${elem}_print`).prop('checked', voucherPrint);
        });

        $('.reportGroupPrivilege').find('input[type="checkbox"]').each(function (index, elem) {
            var id = $(elem).attr('id');
            (privileges.reports[id] == 1) ? $('#' + id).prop('checked', true) : $('#' + id).prop('checked', false);
        });
    };

    var getRoleGroupId = async function (roleGroupId) {
        const response = await makeAjaxRequest('GET', `${userRoleGroupApi.getRoleGroupId}`, {
            roleGroupId: roleGroupId
        });
        if (response.status == false && response.error !== "") {
            AlertComponent.getAlertMessage({ 'title': 'Error!', 'message': response.message, 'type': 'danger' });
        } else if (response.status == false && response.message !== "") {
            AlertComponent.getAlertMessage({ 'title': 'Warning!', 'message': response.message, 'type': 'warning' });
        } else {
            populateData(response.data);
        }
    };

    let userDataTable = undefined;
    const getUserRoleGroupDataTable = (voucherType = "", itemType = "") => {
        if (typeof userDataTable !== 'undefined') {
            userDataTable.destroy();
            $('#userRoleGroupDataTableTbody').empty();
        }
        userDataTable = $("#userRoleGroupDataTable").DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: `${userRoleGroupApi.getUserRoleGroupDataTable}`,
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
                    data: "rgid",
                    name: 'rgid',
                    className: "id",
                },
                {
                    data: "name",
                    name: 'name',
                    className: "text-left name",
                },
                {
                    data: null,
                    className: "select text-right",
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row) {
                        let buttons = '<button class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-userRoleGroup" data-rgid="' + row.rgid + '"><i class="fa fa-edit"></i></button>';
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

    var generateVoucherUserRoleGroup = function () {
        let voucherName = "";
        var voucherPrivilege = "";

        let moduleName = "";
        let cardHeader = "";

        $('.voucher').each(function (index, elem) {
            const navModuleName = $(elem).closest('li.voucher-container').find('.nav-link-p').text().trim() || null;

            if (moduleName !== navModuleName && navModuleName !== null) {
                moduleName = navModuleName;
                voucherPrivilege +=
                    `
                    <div class="card shadow-lg h-100">
                        <div class="card-header">
                            <h5 class="card-title font-weight-bold"><span class="sub-heading"> ${moduleName}</span></h5>
                        </div>
                        <div class='card-body'>
                `;
            }

            const classesAssigned = $(this).attr('class').split(' ');
            const voucherClass = classesAssigned[classesAssigned.length - 1];

            voucherPrivilege += `<div class="card shadow-lg h-100">
            <div class="card-header">
                <div class="row mt-1">
                    <div class="col">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="${voucherClass}">
                            <label class="form-check-label cursor-pointer font-weight-bold" for="${voucherClass}">
                                ${$(this).text().trim()}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row mt-1">
                    <div class="col">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="insert" id="${voucherClass}_insert">
                            <label class="form-check-label cursor-pointer" for="${voucherClass}_insert">
                                Insert
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="update" id="${voucherClass}_update">
                            <label class="form-check-label cursor-pointer" for="${voucherClass}_update">
                                Update
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="delete" id="${voucherClass}_delete">
                            <label class="form-check-label cursor-pointer" for="${voucherClass}_delete">
                                Delete
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="print" id="${voucherClass}_print">
                            <label class="form-check-label cursor-pointer" for="${voucherClass}_print">
                                Print
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

            if (index === $('.voucher').length - 1 || $.trim($('.voucher').eq(index + 1).closest('li.voucher-container').find('.nav-link-p').text()) !== moduleName) {
                voucherPrivilege += `</div></div>`;
            }
        });

        $(voucherPrivilege).appendTo('.voucherPrivilege');
    };


    const generateReportUserRoleGroup = function () {
        let moduleName = "";
        let voucherPrivilege = "";

        $('.report').each(function (index, elem) {
            const navModuleName = $(elem).closest('li.voucher-container').find('.nav-link-p').text().trim() || null;

            if (moduleName !== navModuleName && navModuleName !== null) {
                moduleName = navModuleName;
                voucherPrivilege +=
                    `
                    <div class="card shadow-lg h-100">
                        <div class="card-header">
                            <h5 class="card-title font-weight-bold"><span class="sub-heading"> ${moduleName}</span></h5>
                        </div>
                        <div class='card-body'>
                `;
            }

            const classesAssigned = $(this).attr('class').split(' ');
            const voucherClass = classesAssigned[classesAssigned.length - 1];

            voucherPrivilege += `
                <div class="card shadow-lg h-100">
                    <div class="card-body">
                        <div class="row mt-1">
                            <div class="col">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" name="insert" id="${voucherClass}">
                                    <label class="form-check-label cursor-pointer" for="${voucherClass}">
                                        ${$(this).text().trim()}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

            if (index === $('.report').length - 1 || $.trim($('.report').eq(index + 1).closest('li.voucher-container').find('.nav-link-p').text()) !== moduleName) {
                voucherPrivilege += `</div></div>`;
            }
        });

        $(voucherPrivilege).appendTo('.reportGroupPrivilege');
    }

    return {

        init: function () {
            this.bindUI();
            getUserRoleGroupDataTable();
            generateVoucherUserRoleGroup();
            generateReportUserRoleGroup();
            $('.select2').select2();
        },

        bindUI: function () {
            const self = this;
            $('[data-toggle="tooltip"]').tooltip();

            $(document.body).on('click', 'input[type="checkbox"]', function () {
                const isChecked = $(this).is(':checked');
                const voucherId = $(this).attr('id');

                $(`#${voucherId}_insert`).prop('checked', isChecked);
                $(`#${voucherId}_update`).prop('checked', isChecked);
                $(`#${voucherId}_delete`).prop('checked', isChecked);
                $(`#${voucherId}_print`).prop('checked', isChecked);
                const nameArray = ['insert', 'update', 'delete', 'print'];
                const checkBoxName = $(this).attr('name');
                if (isChecked) {
                    if (nameArray.includes(checkBoxName)) {
                        const parentId = voucherId.replace('#', '').replace(`_${checkBoxName}`, '');
                        const parentIsChecked = $(`#${parentId}`).is(':checked');
                        if (!parentIsChecked) {
                            $('#' + parentId).prop('checked', true);
                        }
                    }
                }
            });

            $(document.body).on('click', '#userRoleGroupSyncAlt', function (e) {
                e.preventDefault();
                getUserRoleGroupDataTable();
            });

            shortcut.add("F10", function () {
                $('#saveButton').get()[0].click();
            });
            shortcut.add("F5", function () {
                $('#resetButton').get()[0].click();
            });
            // when save button is clicked
            $('#saveButton').on('click', function (e) {
                e.preventDefault();
                self.initSave();
            });

            // when the reset button is clicked
            $('#resetButton').on('click', function (e) {
                e.preventDefault();
                general.reloadWindow();
            });
            // when edit button is clicked inside the table view
            $(document.body).on('click', '.btn-edit-userRoleGroup', function (e) {
                e.preventDefault();
                const roleGroupId = $(this).data('rgid');
                getRoleGroupId(roleGroupId);
            });
        },

        initSave: function () {
            const error = validateSave();
            if (!error) {
                save(getSaveObject());
            }
        },
    };

};
const userRoleGroup = new UserRoleGroup();
userRoleGroup.init();
