import AlertComponent                   from "../../../../js/components/AlertComponent.js";
import { emailApiEndpoints }            from "../../../../js/components/GlobalUrl.js";
import { makeAjaxRequest }              from "../../../../js/components/MakeAjaxRequest.js";
import { clearValueAndText, doLoading } from "../commonFunctions/CommonFunction.js";

const ClassEmail = function () {
    const $modalInstance          = $("#emailAddModalId");
    const emailHiddenIdSelector   = "#emailHiddenId";
    const emailProtocolSelector   = "#emailProtocol";
    const emailHostSelector       = "#emailHost";
    const emailPortSelector       = "#emailPort";
    const emailUsernameSelector   = "#emailUsername";
    const emailPasswordSelector   = "#emailPassword";
    const emailFromEmailSelector  = "#emailFromEmail";
    const emailDomainListSelector = "#emailDomainList";

    // instance
    const emailHiddenIdInstance   = $(emailHiddenIdSelector);
    const emailProtocolInstance   = $(emailProtocolSelector);
    const emailHostInstance       = $(emailHostSelector);
    const emailPortInstance       = $(emailPortSelector);
    const emailUsernameInstance   = $(emailUsernameSelector);
    const emailPasswordInstance   = $(emailPasswordSelector);
    const emailFromEmailInstance  = $(emailFromEmailSelector);
    const emailDomainListInstance = $(emailDomainListSelector);

    const save = async function (emailObject) {
        doLoading(true);
        try {
            const response = await makeAjaxRequest("POST", emailApiEndpoints.saveEmail, {
                emailObject : JSON.stringify(emailObject)
            });
            if (response && ! response.status) {
                AlertComponent.getAlertMessage({
                    message : response.message,
                    type    : "danger"
                });
            } else if (response && response.status) {
                resetVoucher();
                $($modalInstance).modal("hide");
            }
        } catch (e) {
            console.log(e);
        } finally {
            doLoading(false);
        }
    };

    const getEmailById = async function (emailId) {
        doLoading(true);
        try {
            const response = await makeAjaxRequest("GET", emailApiEndpoints.getEmailById, {
                emailId : emailId
            });
            resetVoucher();

            if (response && ! response.status) {
                AlertComponent.getAlertMessage({
                    message : response.message,
                    type    : "danger"
                });
            } else if (response && response.status) {
                $($modalInstance).modal("show");
                populateData(response.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            doLoading(false);
        }
    };

    const populateData = function (elem) {
        emailHiddenIdInstance.val(elem.id);
        emailProtocolInstance.val(elem.protocol);
        emailHostInstance.val(elem.host);
        emailPortInstance.val(elem.port);
        emailUsernameInstance.val(elem.username);
        emailPasswordInstance.val(elem.password);
        emailFromEmailInstance.val(elem.from_email);
        emailDomainListInstance.val(elem.domain_ids.split(",")).trigger("change");
    };

    // checks for the empty fields
    const validateSave      = function () {
        let errorFlag = false;
        $(".inputerror").removeClass("inputerror");
        if ($.trim(emailProtocolInstance.val()) === "") {
            $(emailProtocolSelector).addClass("inputerror");
            errorFlag = true;
        }
        if ($.trim(emailHostInstance.val()) === "") {
            $(emailHostSelector).addClass("inputerror");
            errorFlag = true;
        }
        if ($.trim(emailPortInstance.val()) === "") {
            $(emailPortSelector).addClass("inputerror");
            errorFlag = true;
        }
        if ($.trim(emailUsernameInstance.val()) === "") {
            $(emailUsernameSelector).addClass("inputerror");
            errorFlag = true;
        }
        if (parseNumber($(emailHiddenIdSelector).val()) === 0 && $.trim(emailPasswordInstance.val()) === "") {
            $(emailPasswordSelector).addClass("inputerror");
            errorFlag = true;
        }
        if ($.trim(emailFromEmailInstance.val()) === "") {
            $(emailFromEmailSelector).addClass("inputerror");
            errorFlag = true;
        }

        if ($.trim(emailDomainListInstance.val()) === "") {
            $(emailDomainListSelector).addClass("inputerror");
            errorFlag = true;
        }

        return errorFlag;
    };
    const getSaveObject     = function () {
        return {
            id         : emailHiddenIdInstance.val() || "",
            protocol   : emailProtocolInstance.val(),
            host       : emailHostInstance.val(),
            port       : emailPortInstance.val(),
            username   : emailUsernameInstance.val(),
            password   : emailPasswordInstance.val(),
            from_email : emailFromEmailInstance.val(),
            domain_ids : emailDomainListInstance.val().join(",")
        };
    };
    let emailDataTable      = undefined;
    const getEmailDataTable = () => {
        if (typeof emailDataTable !== "undefined") {
            emailDataTable.destroy();
            $("#emailViewListTbody").empty();
        }
        emailDataTable = $("#emailViewList").DataTable({
            processing : true,
            serverSide : true,
            ajax       : {
                url : `${emailApiEndpoints.getEmailDataTable}`
            },
            autoWidth  : false,
            buttons    : true,
            searching  : true,
            columns    : [{
                data       : null,
                className  : "select",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row, meta) {
                    return meta.row + 1;
                }
            }, {
                data      : "protocol",
                name      : "protocol",
                className : "text-left protocol"
            }, {
                data      : "host",
                name      : "host",
                className : "host",
                render    : function (data) {
                    return data || " ";
                }
            }, {
                data      : "port",
                name      : "port",
                className : "port",
                render    : function (data) {
                    return data || " ";
                }
            }, {
                data      : "username",
                name      : "username",
                className : "username",
                render    : function (data) {
                    return data || " ";
                }
            }, {
                data      : "password",
                name      : "password",
                className : "password",
                render    : function (data) {
                    return data || " ";
                }
            }, {
                data      : "from_email",
                name      : "from_email",
                className : "from_email",
                render    : function (data) {
                    return data || " ";
                }
            }, {
                data       : null,
                className  : "select text-right",
                searchable : false,
                orderable  : false,
                render     : function (data, type, row) {
                    return "<button class=\"btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-email\" data-vrnoa_hide=\"" + row.id + "\" data-toggle=\"tooltip\" data-title=\"View Detail On Modal\"><i class=\"fa fa-edit\"></i></button>";
                }
            }],
            createdRow : function (row) {
                $(row).addClass("group odd:bg-white even:bg-slate-50 py-1 px-1");
                $("td", row).addClass("py-1 px-1 text-md align-middle text-middle");
            }
        });
    };
    const resetField        = () => {
        $(".inputerror").removeClass("inputerror");
        clearValueAndText(["emailHiddenId", "emailProtocol", "emailHost", "emailPort", "emailUsername", "emailPassword", "emailFromEmail", "emailDomainList"], "#");
    };

    const resetVoucher = () => {
        resetField();
        getEmailDataTable();
    };

    return {

        init : function () {
            this.bindUI();
            getEmailDataTable();
            $(".select2").select2();
        },

        bindUI : function () {
            $("[data-toggle=\"tooltip\"]").tooltip();

            const self = this;
            $(document.body).on("click", "#emailModalShow", function (e) {
                e.preventDefault();
                resetField();
                $($modalInstance).modal("show");
                setTimeout(function () {
                    $("#emailName").focus();
                }, 500);
            });
            $(document.body).on("click", "#emailSyncAlt", function (e) {
                e.preventDefault();
                getEmailDataTable();
            });
            shortcut.add("F10", function () {
                $("#emailSaveButton").get()[0].click();
            });
            shortcut.add("F5", function () {
                $("#emailResetButton").get()[0].click();
            });
            $(document.body).on("click", "#emailSaveButton", async function (e) {
                e.preventDefault();
                await self.initSave();
            });

            $("#emailResetButton").on("click", function (e) {
                e.preventDefault();
                resetVoucher();
            });

            $("body").on("click", ".btn-edit-email", async function (e) {
                e.preventDefault();
                await getEmailById($(this).data("vrnoa_hide"));
            });
        },

        initSave : async function () {
            if (validateSave()) {
                AlertComponent.getAlertMessage({
                    message : "Please fill the required fields!",
                    type    : "danger"
                });
                return;
            }
            await save(getSaveObject());
        }
    };
};

const classEmail = new ClassEmail();
classEmail.init();
