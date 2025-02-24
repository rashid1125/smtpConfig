import { makeAjaxRequest } from "../../js/components/MakeAjaxRequest.js";
import { ifNull } from "../js/app_modules/commonFunctions/CommonFunction.js";
import { reportComponent } from "./report_component.js";

const ReportCombination = function (event) {
    async function saveThisReportCombinationAsDefault(obj) {
        $(".loader").show();
        const response = await makeAjaxRequest('POST', `${base_url}/reportCombination/saveThisReportCombinationAsDefault`,
            {
                'reportGroup': JSON.stringify(obj.reportGroup),
                'report_id': $('.report_title').data('report_id')
            }
        );
        if (response.status == false && response.data == null) {
            _getAlertMessage('Error!', response.message, 'danger');
        } else if (response.status === true) {
            _getAlertMessage('Success!', response.message, 'success');
            console.log(response.data);
            getThisReportCombinationAsDefault(response.data.report_id, response.data.id);
        }
        $(".loader").hide();
    }
    const getSaveObjectReportCombination = () => {

        const reportGroup = {
            report_id: $.trim($('.report_title').data('report_id')),
            include_group: ($('#includeGroup').bootstrapSwitch('state') === true) ? 1 : 0,
            include_group_text: reportComponent.getCurrentView(),
            include_group1: ($('#includeGroup1').bootstrapSwitch('state') === true) ? 1 : 0,
            include_group1_text: reportComponent.getCurrentView2(),
            durType: ifNull($('input[type="radio"][name="durType"]:checked').val()),
            types: ifNull($('input[type="radio"][name="types"]:checked').val()),
            rptype: ifNull($('input[type="radio"][name="rptype"]:checked').val()),
            stock_types: ifNull($('input[type="radio"][name="stock_types"]:checked').val()),
            language_name: ifNull($('input[type="radio"][name="languageName"]:checked').val()),
            report_orientation: ifNull($('input[type="radio"][name="report_orientation"]:checked').val()),
        };

        const data = {};
        data.reportGroup = reportGroup;
        return data;
    };

    async function getThisReportCombinationAsDefault(reportId, reportCombinationId) {
        $(".loader").show();
        const response = await makeAjaxRequest('GET', `${base_url}/reportCombination/getThisReportCombinationAsDefault`,
            {
                'report_id': reportId,
                'report_combination_id': reportCombinationId
            });

        if (response.status === true && response.data !== null) {
            const includeGroup = (response.data.include_group == 1) ? true : false;
            const includeGroup1 = (response.data.include_group1 == 1) ? true : false;

            $('#includeGroup').bootstrapSwitch('state', includeGroup);
            $('#includeGroup1').bootstrapSwitch('state', includeGroup1);



            getPopulateInputCheckedValue('input[name="types"]', response.data.types);
            getPopulateInputCheckedValue('input[name="rptype"]', response.data.rptype);
            getPopulateInputCheckedValue('input[name="stock_types"]', response.data.stock_types);
            getPopulateInputCheckedValue('input[name="languageName"]', response.data.language_name);
            getPopulateInputCheckedValue('input[name="report_orientation"]', response.data.report_orientation);
            getPopulateInputCheckedValue('input[name="durType"]', response.data.durType);

            $('.btnSelCre').each(function (key, value) {
                $(value).removeClass('btn-primary');
                if ($.trim($(value).text()).toLowerCase() == response.data.include_group_text) {
                    $(value).addClass('btn-primary');
                    $('#text-report-groups1').text('(' + response.data.include_group_text + ',');
                }
            });

            $('.btnSelCre2').each(function (key, value) {
                $(value).removeClass('btn-primary');
                if ($.trim($(value).text()).toLowerCase() == response.data.include_group1_text) {
                    $(value).addClass('btn-primary');
                    $('#text-report-groups2').text(response.data.include_group1_text + ') Wise');
                }
            });
        }
        $(".loader").hide();
    }

    const getPopulateInputCheckedValue = (loopName, indexName) => {
        $(loopName).each(function (key, value) {
            const ID = $(value).attr('id');
            if ($.trim($(value).val()).toLowerCase() === $.trim(indexName).toLowerCase()) {
                $(value).val($.trim(indexName).toLowerCase()).prop('checked', true);
                $(value).trigger('change').trigger('click');
                return;
            }
        });
    };
    return {
        init: async function (event) {
            this.bindUI();
        },
        bindUI: async function (event) {
            const self = $(this);
            $(document.body).on('click', '#txtReportsCombinationDefault', function (event) {
                const data = getSaveObjectReportCombination();
                saveThisReportCombinationAsDefault(data);
            });

            let reportId = $('.report_title').data('report_id');
            await getThisReportCombinationAsDefault(reportId);
        }
    };
};
const reportCombination = new ReportCombination();
export {
    reportCombination
}

