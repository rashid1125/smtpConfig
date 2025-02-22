let Centralized_Account = function () {
    const getViewEtypeWise = (account_etype) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type    : 'POST',
                url     : base_url + 'index.php/accounts/centralized_account/' + account_etype,
                data    : { 'account_etype': account_etype },
                datatype: 'JSON',
                success : function (response) {
                    resolve(response);
                },
                error: function (xhr, status, error) {
                    reject(console.log(xhr.responseText));
                }
            });
        });
    };

    async function getViewLoad(account_etype) {
        $(".loader").show();
        $("#centralized_account_html").html('');
        $("#centralized-account-page-title").html('');
        const response = await getViewEtypeWise(account_etype);
        if (response.status=== false){
            $(".loader").hide();
            return $.notify({ message: response.message }, { type: 'danger' });
        }
        $('#centralized_account_html').html(response.html);
        if ($('#addNewCentralizedAccountModal').hasClass('in')){
            $('#centralized-account-level3-id').select2();
        }
        $('#centralized-account-customer-type').select2();
        
        if (account_etype === 'generalaccounts') {
            $('#centralized-account-level3-id').select2('val', response.setting_configure[0].generalaccountslevel3).trigger('change');
        } else if (account_etype === 'customers') {
            $('#centralized-account-level3-id').select2('val', response.setting_configure[0].customerlevel3).trigger('change');
        } else if (account_etype === 'suppliers') {
            $('#centralized-account-level3-id').select2('val', response.setting_configure[0].supplierslevel3).trigger('change');
        } else if (account_etype === 'incomes') {
            $('#centralized-account-level3-id').select2('val', response.setting_configure[0].incomelevel3).trigger('change');
        } else if (account_etype === 'banks') {
            $('#centralized-account-level3-id').select2('val', response.setting_configure[0].bankslevel3).trigger('change');
        } else if (account_etype === 'expenses') {
            $('#centralized-account-level3-id').select2('val', response.setting_configure[0].expenseslevel3).trigger('change');
        }
        $("#centralized-account-page-title").html(response.title);
        
        $(".loader").hide();

        $('#centralized-account-name').focus();
    };

    const getValidateSaveCentralizedAccount = () => {
        $('.inputerror').removeClass('inputerror');
        const centralizedAccountName     = $('#centralized-account-name');
        const centralizedAccountLevel3Id = $('#centralized-account-level3-id');
        let   errorFlag                  = false;
        if (!centralizedAccountName.val()) {
            centralizedAccountName.addClass('inputerror');
            errorFlag = true;
        }

        if (!centralizedAccountLevel3Id.val()) {
            $('#s2id_centralized-account-level3-id').addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    };
    const getSaveObjectCentralizedAccount = () => {
        const accountObject             = {};
              accountObject.name        = $.trim($('#centralized-account-name').val());
              accountObject.uname       = $.trim($('#centralized-account-uname').val());
              accountObject.custom_type = $.trim($('#centralized-account-customer-type').val());
              accountObject.level3      = $.trim($('#centralized-account-level3-id').val());
              accountObject.etype       = $('input[type="radio"][name="text-centralized-account-etype"]:checked').val();
        return accountObject;
    };
    const saveCentralizedAccount = (accountObject, etype) => {
        $.ajax({
            url     : base_url + 'index.php/accounts/centralized_account/saveCentralizedAccount',
            type    : 'POST',
            data    : { 'accountObject': JSON.stringify(accountObject), 'etype': etype, 'voucher_type_hidden': 'new' },
            dataType: 'JSON',
            async   : false,
            success : function (respons) {
                if ((respons.status == false) && (respons.message !== "")) {
                    $.notify({ message: respons.message }, { type: 'danger' });
                } else if (respons.error === 'true') {
                    $.notify({ message: 'An internal error occured while saving voucher. Please try again.' }, { type: 'danger' });
                } else if (respons === 'duplicate') {
                    $.notify({ message: 'This account name is already saved...' }, { type: 'danger' });
                } else {
                    $.notify({ message: 'Account saved successfully...' }, { type: 'success' });
                    resetVoucher();
                    if ($.trim($('#textHiddenSettingCreditACDropdown').val()) !== '') {
                        const ButtonID = $('#textHiddenSettingCreditACDropdown').val();
                        $('#' + ButtonID).trigger('click');
                        if ($($.trim($('#txthiddenAccountId').val())).hasClass('chosen')) {
                            $($.trim($('#txthiddenAccountId').val())).val(respons[0]).trigger('liszt:updated');
                            $($.trim($('#txthiddenAccountId').val())).trigger('liszt:activate');
                        }
                        else {
                            $($.trim($('#txthiddenAccountId').val())).select2('val', respons[0]);
                            $($.trim($('#txthiddenAccountId').val())).select2('open');
                        }
                        $('#addNewCentralizedAccountModal').modal('hide');
                    } else {
                        getSaveCentralizedAccount(etype, respons[0]);
                    }

                }
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };
    const resetVoucher = () => {
        resetFields();
    };
    const resetFields = () => {
        $('.inputerror').removeClass('inputerror');
        $('#centralized-account-name').val('');
        $('#centralized-account-uname').val('');
        $('#centralized-account-customer-type').select2('val', '');
        $('#centralized-account-level3-id').select2('val', '');
        const account_etype = $('input[type="radio"][name="text-centralized-account-etype"]:checked').val();
        $('#' + account_etype + '-text-centralized-account-etype').prop('checked', true).trigger('change');
    };
    const getSaveCentralizedAccount = (etype, pid) => {
        $.ajax({
            url     : base_url + 'index.php/accounts/centralized_account/getSaveCentralizedAccount',
            type    : 'POST',
            data    : { 'pid': pid, 'etype' : etype },
            dataType: 'JSON',
            success : function (respons) {
                if ((respons.status == false) && (respons.message !== "")) {
                    $.notify({ message: respons.message }, { type: 'danger' });
                } else if (respons.error === 'true') {
                    $.notify({ message: 'An internal error occured while saving voucher. Please try again.' }, { type: 'danger' });
                } else {
                    $('#addNewCentralizedAccountModal').modal('hide');
                    populateDataCentralizedAccount(respons, pid);
                }
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };
    const populateDataCentralizedAccount = (data, selectedAccount = '') => {
        $($.trim($('#txthiddenAccountId').val())).empty();
        $.each(data, function (index, elem) {
            var opt = "<option value='" + elem.pid + "' data-credit='" + elem.balance + "' data-city='" + elem.city + "' data-address='" + elem.address + "' data-cityarea='" + elem.cityarea + "' data-mobile='" + elem.mobile + "' >" + elem.name + "</option>";
            if (ifnull($.trim($('#txthiddenAccountId').val()), '-') !== '-')
                $(opt).appendTo($.trim($('#txthiddenAccountId').val()));
        });
        if (Array.isArray(selectedAccount))
            selectedAccount = selectedAccount[0];
        if ($($.trim($('#txthiddenAccountId').val())).hasClass('chosen')){
            $($.trim($('#txthiddenAccountId').val())).val(selectedAccount).trigger('liszt:updated');

            $($.trim($('#txthiddenAccountId').val())).trigger('liszt:activate');
        } 
        else {
            $($.trim($('#txthiddenAccountId').val())).select2('val', selectedAccount);
            $($.trim($('#txthiddenAccountId').val())).select2('open');
        } 

    };

    return {
        init: function () {
            this.bindUI();
        },
        bindUI: function () {

            $(document.body).on('change', 'input[name="text-centralized-account-etype"]', function (e) {
                const account_etype = $('input[type="radio"][name="text-centralized-account-etype"]:checked').val();
                getViewLoad(account_etype);
            });
            var l3id = $('#setting_level3').val();
            $(document.body).on('change', '#centralized-account-level3-id', function (e) {
                var l3 = $(this).find('option:selected').text();
                var l2 = $(this).find('option:selected').data('level2');
                var l1 = $(this).find('option:selected').data('level1');
                $('#centralized-account-text-level3').html(l3);
                $('#centralized-account-text-level2').html(l2);
                $('#centralized-account-text-level1').html(l1);
            });
            $('#centralized-account-level3-id').val(l3id).trigger('change');
            $(document.body).on('click', '#btnSaveCentralizedAccount', function (e) {
                e.preventDefault();
                centralized_account.initSave();
            });
            $(document.body).on('click', '#btnResetCentralizedAccount', function (e) {
                e.preventDefault();
                resetVoucher();
            });
            $('#generalaccounts-text-centralized-account-etype').prop('checked', true).trigger('change');
        },
        initSave: function () {
            const validateSave = getValidateSaveCentralizedAccount();
            if (validateSave == false) {
                const saveObject = getSaveObjectCentralizedAccount();
                const etype      = $('input[type="radio"][name="text-centralized-account-etype"]:checked').val()
                saveCentralizedAccount(saveObject, etype);
            } else {
                $.notify({ message: 'Correct the errors!!!' }, { type: 'danger' });
            }
        },
    };
};
const centralized_account = new Centralized_Account();
centralized_account.init();