import { appendSelect2ValueIfDataExists, clearValueAndText, padNumberWithLeadingCharacters, resetSelect2Option, updateDatepickerWithFormattedDate } from './../commonFunctions/CommonFunction.js';
import DynamicOption from "../../../../js/components/DynamicOption.js";
var Level = function () {

    const saveLevel2 = `${base_url}/accountlevel/saveLevel2`;
    const saveLevel3 = `${base_url}/accountlevel/saveLevel3`;
    const fileLevelUrl = `${base_url}/accountlevel`;

    var settings = {

        // level 2 data
        txtLevel2IdHidden: $('#txtLevel2IdHidden'),
        txtLevel1Dropdown: $('#txtLevel1Dropdown'),
        txtLevel2Name: $('#txtLevel2Name'),
        txtLevel2NameHidden: $('#txtLevel2NameHidden'),
        btnSaveL2: $('.btnSaveL2'),
        btnResetL2: $('.btnResetL2'),

        // level 3 data
        txtLevel3IdHidden: $('#txtLevel3IdHidden'),
        txtLevel2Dropdown: $('#txtLevel2Dropdown'),
        txtLevel3Name: $('#txtLevel3Name'),
        txtLevel3NameHidden: $('#txtLevel3NameHidden'),
        btnSaveL3: $('.btnSaveL3'),
        btnResetL3: $('.btnResetL3')
    };

    var save = async function (lObj, level, url) {
        general.disableSave();

        try {
            const response = await new Promise((resolve, reject) => {
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: { 'levelDetail': lObj, 'level': level },
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
                general.reloadWindow();
            }
        } catch (error) {
            console.log(error);
        } finally {
            general.enableSave();
        }
    };

    var fetchL2 = function (l2) {

        $.ajax({
            url: `${fileLevelUrl}/getlevel2ById`,
            type: 'GET',
            data: { 'l2': l2 },
            dataType: 'JSON',
            success: function (response) {
                if (response.status == false && response.message !== "" && response.error !== "") {
                    _getAlertMessage('Error!', response.message, 'danger');
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage('Information!', response.message, 'info');
                    level.resetVoucherL2();

                } else {
                    populateDataL2(response.data);
                }
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    }

    var fetchL3 = function (l3) {

        $.ajax({
            url: `${fileLevelUrl}/getlevel3ById`,
            type: 'GET',
            data: { 'l3': l3 },
            dataType: 'JSON',
            success: function (response) {
                if (response.status == false && response.message !== "" && response.error !== "") {
                    _getAlertMessage('Error!', response.message, 'danger');
                } else if (response.status == false && response.message !== "") {
                    _getAlertMessage('Information!', response.message, 'info');
                    level.resetVoucherL3();

                } else {
                    populateDataL3(response.data);
                }
            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    }

    var populateDataL2 = function (elem) {
        $('#VoucherTypeHidden').val('edit');
        $('#txtLevel2IdHidden').val(elem.l2);
        appendSelect2ValueIfDataExists("txtLevel1Dropdown", "level1", "l1", "name", elem);
        $('#txtLevel2Name').val(elem.name);
    }

    var populateDataL3 = function (elem) {
        $('#VoucherTypeHidden').val('edit');
        $('#txtLevel3IdHidden').val(elem.l3);
        appendSelect2ValueIfDataExists("txtLevel2Dropdown", "level2", "l2", "name", elem);
        $('#txtLevel3Name').val(elem.name);
    }

    // checks for the empty fields
    var validateL2Save = function () {

        var errorFlag = false;
        var name = $(settings.txtLevel2Name).val();
        var l1 = $(settings.txtLevel1Dropdown).val();

        // remove the previous classes
        $(settings.txtLevel2Name).removeClass('inputerror');
        $(settings.txtLevel1Dropdown).parent().removeClass('inputerror');

        if (name === "") {
            $(settings.txtLevel2Name).addClass('inputerror');
            errorFlag = true;
        }

        if (l1 === "" || l1 === null) {
            $(settings.txtLevel1Dropdown).parent().addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    }

    // checks for the empty fields
    var validateL3Save = function () {

        var errorFlag = false;
        var name = $(settings.txtLevel3Name).val();
        var l2 = $(settings.txtLevel2Dropdown).val();

        // remove the previous classes
        $(settings.txtLevel3Name).removeClass('inputerror');
        $(settings.txtLevel2Dropdown).parent().removeClass('inputerror');

        if (name === "") {
            $(settings.txtLevel3Name).addClass('inputerror');
            errorFlag = true;
        }

        if (l2 === "" || l2 === null) {
            $(settings.txtLevel2Dropdown).parent().addClass('inputerror');
            errorFlag = true;
        }

        return errorFlag;
    }

    //  checks if the name is already used?
    var isFieldValid = function (level) {

        var errorFlag = false;
        var name = "";		// get the current level name entered by the user
        var lidHidden = "";		// hidden id

        if (level === 'level2') {

            lidHidden = settings.txtLevel2IdHidden;		// hidden l2
            name = settings.txtLevel2Name;		// get the current level2 name entered by the user

        }

        if (level === 'level3') {

            lidHidden = settings.txtLevel3IdHidden;		// hidden l3
            name = settings.txtLevel3Name;		// get the current level3 name entered by the user

        }

        // remove the previous classes
        name.removeClass('inputerror');

        return errorFlag;
    }

    // returns the level 2 object to save into database
    var getSaveL2Obj = function () {

        const obj = {

            l2: $(settings.txtLevel2IdHidden).val(),
            name: $(settings.txtLevel2Name).val(),
            l1: $(settings.txtLevel1Dropdown).val()
        };
        return obj;
    }

    // returns the level 2 object to save into database
    var getSaveL3Obj = function () {

        const obj = {

            l3: $(settings.txtLevel3IdHidden).val(),
            name: $(settings.txtLevel3Name).val(),
            l2: $(settings.txtLevel2Dropdown).val()
        };
        return obj;
    }

    return {
        init: function () {
            this.bindUI();
        },

        bindUI: function () {
            $('[data-toggle="tooltip"]').tooltip();
            var self = this;

            // shortcut.add("F5", function () {
            // 	self.resetVoucherL2();
            // 	self.resetVoucherL3();
            // });

            // shortcut.add("F10", function () {
            // 	$(settings.btnSaveL2).get()[0].click();
            // 	$(settings.btnSaveL3).get()[0].click();
            // });

            ///		Level 2 Events

            // when save button is clicked
            $(settings.btnSaveL2).on('click', function (e) {
                if ($('#VoucherTypeHidden').val() == 'edit' && $('.btnSaveL1').data('updatebtn') == 0) {
                    alert('Sorry! you have not update rights..........');
                } else if ($('#VoucherTypeHidden').val() == 'new' && $('.btnSaveL1').data('insertbtn') == 0) {
                    alert('Sorry! you have not insert rights..........');
                } else {
                    e.preventDefault();		// prevent the default behaviour of the link
                    self.initSaveL2();		// makes the voucher ready to save
                }
            });

            // when reset button is clicked
            $(settings.btnResetL2).on('click', function (e) {
                e.preventDefault();		// prevent the default behaviour of the link
                self.resetVoucherL2();	// resets the voucher
            });

            // when btnEditLevel2 is clicked
            $('body').on('click', '.btn-edit-level2', function (e) {
                e.preventDefault();		// prevent the default behaviour of the link
                fetchL2($(this).data('l2'));		// get the Level 2 detail by id

                $('a[href="#add_level2"]').trigger('click');
            });


            ///		Level 3 Events

            // when save button is clicked
            $(settings.btnSaveL3).on('click', function (e) {
                if ($('#VoucherTypeHidden').val() == 'edit' && $('.btnSaveL1').data('updatebtn') == 0) {
                    alert('Sorry! you have not update rights..........');
                } else if ($('#VoucherTypeHidden').val() == 'new' && $('.btnSaveL1').data('insertbtn') == 0) {
                    alert('Sorry! you have not insert rights..........');
                } else {
                    e.preventDefault();		// prevent the default behaviour of the link
                    self.initSaveL3();		// makes the voucher ready to save
                }
            });

            // when reset button is clicked
            $(settings.btnResetL3).on('click', function (e) {
                e.preventDefault();		// prevent the default behaviour of the link
                self.resetVoucherL3();	// resets the voucher
            });

            // when btnEditLevel3 is clicked
            $('body').on('click', '.btn-edit-level3', function (e) {
                e.preventDefault();		// prevent the default behaviour of the link
                fetchL3($(this).data('l3'));		// get the Level 3 mdetail by id

                $('a[href="#add_level3"]').trigger('click');
            });
        },

        // makes the voucher ready to save2
        initSaveL2: function () {

            var l2Obj = getSaveL2Obj();	// returns the level 2 object to save into database
            var isValid = validateL2Save();		// checks for the empty fields

            if (!isValid) {

                isValid = isFieldValid('level2');
                // check if the level 2 name is already used??	if false
                if (!isValid) {
                    save(l2Obj, 'level2', saveLevel2);
                } else {
                    alert("Level name already used.");
                }
            } else {
                alert('Correct the errors...');
            }
        },

        // makes the voucher ready to save3
        initSaveL3: function () {

            var l3Obj = getSaveL3Obj();	// returns the level 2 object to save into database
            var isValid = validateL3Save();		// checks for the empty fields

            if (!isValid) {

                isValid = isFieldValid('level3');
                // check if the level 3 name is already used??	if false
                if (!isValid) {

                    // save the data in to the database
                    save(l3Obj, 'level3', saveLevel3);
                } else {	// if level name is already used then show error
                    alert("Level name already used.");
                } loo
            } else {
                alert('Correct the errors...');
            }
        },

        // resets the voucher Level 2
        resetVoucherL2: function () {
            $('.inputerror').removeClass('inputerror');
            $(settings.txtLevel2IdHidden).val('');
            $(settings.txtLevel2Name).val('');
            // $(settings.txtLevel1Dropdown).val('');
            resetSelect2Option("txtLevel1Dropdown");
            $('#VoucherTypeHidden').val('new');
            // general.reloadWindow();
        },

        // resets the voucher Level 3
        resetVoucherL3: function () {
            $('.inputerror').removeClass('inputerror');
            $(settings.txtLevel3IdHidden).val('');
            $(settings.txtLevel3Name).val('');
            resetSelect2Option("txtLevel2Dropdown");
            $('#VoucherTypeHidden').val('new');
            // general.reloadWindow();
        }
    };

};

var level = new Level();
level.init();

$(function () {
    new DynamicOption('#txtLevel1Dropdown', {
        requestedUrl: `${base_url}/accountlevel/getAllLevel1`,
        placeholderText: 'Choose Level 1'
    });

    new DynamicOption('#txtLevel2Dropdown', {
        requestedUrl: `${base_url}/accountlevel/getAllLevel2`,
        placeholderText: 'Choose Level 2'
    });
});
