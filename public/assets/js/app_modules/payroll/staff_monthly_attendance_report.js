import { disableButton, doLoading, enableDisableButton, parseNumber } from "../commonFunctions/CommonFunction.js";
import { makeAjaxRequest }                                            from "../../../../js/components/MakeAjaxRequest.js";
import AlertComponent                                                 from "../../../../js/components/AlertComponent.js";

const MonthlyAttendanceReport = function () {
    const monthYearDate      = $("#from_date");
    const departmentDropdown = $("#departmentDropdown");
    const searchButton       = $(".btnSearch");
    const resetButton        = $(".btnReset");
    const printButton        = $(".btnPrint");
    const atndTable          = $("#atnd-table");
    const validateSearch     = function () {
        let errorFlag = false;

        const departmentId       = $(departmentDropdown).val();
        const monthYearDateValue = $(monthYearDate).val();
        // remove from .inputerror class
        $(".inputerror").removeClass("inputerror");

        if (departmentId === "" || departmentId === null) {
            $(departmentDropdown).addClass("inputerror");
            errorFlag = true;
        }
        if (monthYearDateValue === "" || monthYearDateValue === null) {
            $(monthYearDate).addClass("inputerror");
            errorFlag = true;
        }

        return errorFlag;
    };

    const search = async function (month, year, did) {
        doLoading(true);
        await disableButton(".btnSearch");
        if (typeof monthlyAttendanceReport.dTable != "undefined") {
            monthlyAttendanceReport.dTable.fnDestroy();
            $("#saleRows").empty();
        }
        $("#atnd-table").find("tbody tr").remove();
        try {
            const response = await makeAjaxRequest("POST", base_url + "/payroll/getStaffMonthlyAttendanceReportData", {
                "did"   : did,
                "month" : month,
                "year"  : year
            });
            if (response.status === false) {
                AlertComponent.getAlertMessage({
                    title   : "Error!",
                    message : response.message,
                    type    : "danger"
                });
            } else if (response.status === true) {
                populateData(response.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            doLoading(false);
            await enableDisableButton(".btnSearch");
        }
    };

    const populateData = function (data) {

        let month_year = $.trim($(".month_year_picker").val());
        let month      = parseInt(month_year.substring(0, 2));
        let year       = parseInt(month_year.substring(3));
        let days       = general.getDaysInMonth(month, year);
        let staff_name = "";
        let counter    = 1;
        let dept_name  = "";
        let vh         = $("#atnd-table thead").find("tr th").length;

        $.each(data, function (index, elem) {
            if (elem.staff_name !== staff_name) {
                const cols = new Array(days);
                $.each(data, function (ind, el) {
                    if (el.staff_name.toLowerCase() === elem.staff_name.toLowerCase()) {
                        if (el.status.toLowerCase() === "paid leave") {
                            cols[el.day] = "PL";
                        } else if (el.status.toLowerCase() === "sick leave") {
                            cols[el.day] = "SL";
                        } else {
                            cols[el.day] = el.status.substring(0, 1);
                        }
                    }
                });
                if (elem.dept_name.toLowerCase() !== dept_name.toLowerCase()) {
                    let row = `
					<tr class="group item-row-td hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50">
						<td class='py-1 px-1 text-md align-middle'></td>
						<td class='py-1 px-1 text-md align-middle'></td>
						<td class='py-1 px-1 text-md align-middle'></td>
						<td class='py-1 px-1 text-md align-middle text-left font-weight-bold text-uppercase' colspan="${vh - 3}">${elem.dept_name}</td>
					`;
                    for (let i = 0; i < vh - 4; i++) {
                        row += "<td class='py-1 px-1 text-md align-middle d-none'></td>";
                    }
                    row += "</tr>";
                    $(row).appendTo("#atnd-table tbody");
                    dept_name = elem.dept_name;
                }

                let row = `
				<tr class="group item-row-td hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50">
						<td class='py-1 px-1 text-md align-middle text-left'>${counter++}</td>
						<td class='py-1 px-1 text-md align-middle text-left'>${elem.staid}</td>
						<td class='py-1 px-1 text-md align-middle text-left'>${elem.staff_name}</td>
		`;

                for (i = 1; i <= vh - 3; i++) {
                    let cellClass      = "py-1 px-1 text-md align-middle text-center";
                    let cellContent    = "-"; // Default content
                    let cellColorClass = "";

                    if (typeof (cols[i]) != "undefined") {
                        cellContent = cols[i];

                        switch (cols[i]) {
                            case "A":
                                cellColorClass = "bg-red-600 text-white";
                                break;
                            case "U":
                                cellContent    = "UL";
                                cellColorClass = "bg-yellow-500 text-white";
                                break;
                            case "R":
                                cellColorClass = "bg-yellow-100 text-black";
                                break;
                            case "G":
                                cellColorClass = "bg-green-500 text-white";
                                break;
                            case "SL":
                                cellContent    = "S";
                                cellColorClass = "bg-blue-500 text-white";
                                break;
                            case "PL":
                                cellContent    = "PL";
                                cellColorClass = "bg-pink-500 text-white";
                                break;
                        }
                    }

                    row += `<td class='${cellClass} ${cellColorClass}'>${cellContent}</td>`;
                }
                row += "</tr>";

                $(row).appendTo("#atnd-table tbody");

                staff_name = elem.staff_name;
            }
        });

        bindGrid();

    };

    var bindGrid = function () {
        var etype    = $(".page_title").text();
        var dontSort = [];
        $("#atnd-table thead th").each(function () {
            if ($(this).hasClass("no_sort")) {
                dontSort.push({ "bSortable" : false });
            } else {
                dontSort.push(null);
            }
        });

        monthlyAttendanceReport.dTable = $("#atnd-table").dataTable({
            "aaSorting"       : [[0, "asc"]],
            "bPaginate"       : true,
            "bFilter"         : true,
            "sPaginationType" : "full_numbers",
            "bJQueryUI"       : false,
            "aoColumns"       : dontSort,
            "bSort"           : false,
            "iDisplayLength"  : 150
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            "s`" : "dataTables_wrapper form-inline"
        });
    };

    var populateTableHeader = function (month, year) {
        if (typeof monthlyAttendanceReport.dTable != "undefined") {
            monthlyAttendanceReport.dTable.fnDestroy();
            $("#saleRows").empty();
        }
        $("#atnd-table thead").find("tr").remove();
        $("#atnd-table").find("tbody tr").remove();
        var days = general.getDaysInMonth(month, year);

        var cols = `
    <tr class="py-2 px-2 text-md">
        <th class="py-2 px-2 text-md align-middle text-left">Sr#</th>
        <th class="py-2 px-2 text-md align-middle text-left">Id</th>
        <th class="py-2 px-2 text-md align-middle text-left">Staff Name</th>
`;

        for (i = 1; i <= days; i++) {
            var backgroundColor = (i % 2 == 0) ? "#e6f3fd" : "#ffffff";
            cols += `<th class="py-2 px-2 text-md align-middle text-right" style='background: ${backgroundColor};'>${i}</th>`;
        }
        cols += `</tr>`;
        $(cols).appendTo("#atnd-table thead");
    };

    const printReport = function () {
        const month_year = $.trim($(".month_year_picker").val());
        const month      = parseNumber(month_year.substring(0, 2));
        const year       = parseNumber(month_year.substring(3));
        const did        = parseNumber($(departmentDropdown).val());
        const newUrl     = `${base_url}/doc/printStaffMonthlyAttendanceReport?month=${month}&year=${year}&did=${did}`;
        window.open(newUrl);
    };

    return {

        init : function () {
            this.bindUI();
            $("#departmentDropdown").select2({
                placeholder : "Select Department",
                allowClear  : true
            });
        },

        bindUI : function () {

            const self = this;
            shortcut.add("F6", function () {
                $(".btnSearch").get()[0].click();
            });
            shortcut.add("F9", function () {
                $(".btnPrint").get()[0].click();
            });
            shortcut.add("F5", function () {
                $(".btnReset").get()[0].click();
                $(".month_year_picker").get()[0].click();
            });
            $(searchButton).on("click", async function (e) {
                e.preventDefault();
                await self.initSearch();
            });
            $(resetButton).on("click", function (e) {
                e.preventDefault();
                self.resetVoucher();
            });
            $(printButton).on("click", function (e) {
                e.preventDefault();
                printReport();
            });

            $(".month_year_picker").datepicker().on("changeDate", function () {
                const month_year = $.trim($(".month_year_picker").val());
                const month      = parseInt(month_year.substring(0, 2));
                const year       = parseInt(month_year.substring(3));
                populateTableHeader(month, year);
            });

            let d     = new Date();
            let year  = d.getFullYear();
            let month = d.getMonth();
            month++;
            populateTableHeader(month, year);
        },

        initSearch : async function () {
            let error = validateSearch();
            if (! error) {
                let month_year = $.trim($(".month_year_picker").val());
                let month      = parseInt(month_year.substring(0, 2));
                let year       = parseInt(month_year.substring(3));
                month--;
                let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                let did        = $(departmentDropdown).val();
                await search(monthNames[month], year, did);
            } else {
                alert("Correct the errors...");
            }
        },

        resetVoucher : function () {

            $(".inputerror").removeClass("inputerror");
            $(departmentDropdown).select2("val", "-1");
            if (typeof monthlyAttendanceReport.dTable != "undefined") {
                monthlyAttendanceReport.dTable.fnDestroy();
                $("#saleRows").empty();
            }
            $(".month_year_picker").datepicker("update", new Date());
            $("#atnd-table").find("tbody tr").remove();
        }

    };
};
const monthlyAttendanceReport = new MonthlyAttendanceReport();
monthlyAttendanceReport.init();
