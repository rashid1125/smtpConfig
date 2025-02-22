var Voucher_modal = function () {
    var getNum = function (num, tof = 0) {
        return isNaN(parseFloat(num)) ? 0 : parseFloat(num).toFixed(tof);
    };

    const getVoucherDataWithVrnoaAndEtype = function (vrnoa, etype, fn_id, company_id, requestname) {
        var etypebeforeundefine = etype;
        if (typeof voucher_modal.voucher_modal_dataTable != 'undefined') {
            voucher_modal.voucher_modal_dataTable.fnDestroy();
            $('#txtdatatable_voucher_modal_DynamicModal thead').remove();
            $('#txtdatatabletbody_voucher_modal_DynamicModal').empty();
        }
        $.ajax({
            url: base_url + 'index.php/general_http_request/' + requestname,
            data: { 'vrnoa': vrnoa, 'etype': etype },
            type: 'POST',
            dataType: 'JSON',
            success: function (respons) {
                // here we are checking for data availability
                if ((respons.status == false) && (respons.message !== ""))
                    return $.notify({ message: respons.message }, { type: 'danger' });
                if (respons.data !== null) {
                    var htmls = '';
                    var grandTotal = 0;
                    var Columns = [];
                    var groupby = 'vrnoa';
                    var subgroupby = 'vrnoa';
                    var columncount = 0;
                    var colspanwidth = 1;
                    var grouptotal = [];
                    var subgrouptotal = [];
                    var grandtotal = [];
                    var groupflag = false;
                    var subgroupflag = false;
                    var sr = 0;
                    var vrprimary = 0;
                    var vrprimaryold = 0;
                    var tdflag = false;
                    var rowvisibility = '';
                    var total_clss = 'text-right';
                    var namountsum = 0;
                    var type = false;
                    var tableallignment = false;
                    if (type == 'Summary') {
                        rowvisibility = "hide";
                    }

                    if (tableallignment == 'rtl') {
                        Serail = '  سیریل نمبر     ';
                        clas = 'text-rightdir serail_number';
                        total_clss = 'text-rightdir';
                    } else {
                        Serail = "Sr #";
                        clas = 'text-left';
                    }

                    var TableHeader = "<thead class='dthead'><tr><th class='" + clas + "'>" + Serail + "</th>";
                    // Loop For Table Header
                    $.each(respons.data[0], function (key, value) {
                        // addClass
                        var p = key.indexOf("_hide");
                        if (key.replace("_hide", "").toLowerCase() != groupby && key.replace("_hide", "").toLowerCase() != subgroupby) {

                            var clas = '';
                            if (key.indexOf("_sum") >= 0) {
                                if (tableallignment == 'rtl') {
                                    clas = 'text-rightdir';
                                } else {
                                    clas = 'text-right';
                                }
                                if (colspanwidth == 1)
                                    colspanwidth = columncount;
                            } else {
                                if (tableallignment == 'rtl') {
                                    clas = 'text-rightdir';
                                } else {
                                    clas = 'text-left';
                                }
                            }

                            if (!key.indexOf("_sum") >= 0 || key.indexOf("_hide") >= 0 || key.indexOf("_num") >= 0) {
                                tdflag = false;

                            } else {
                                tdflag = true;
                            }
                            var width = '';
                            var x = key;
                            if (key.indexOf("_px") >= 0) {
                                arr = x.split('_');
                                if (key.indexOf("_sum") >= 0) {
                                    width = arr[2];
                                } else {
                                    width = arr[1];
                                }
                                x = arr[0];
                                if (components.titleCase(groupby) == arr[0]) {
                                    groupby = key;
                                }


                                if (components.titleCase(subgroupby) == arr[0]) {
                                    subgroupby = key;
                                }


                                width = 'style="width:' + width + 'px !important;"';
                            }
                            if (key != groupby && key != subgroupby) {

                                if (key.indexOf("_hide") < 0) {

                                    var header = [];
                                    if (key.indexOf("_num") < 0) {
                                        if (tableallignment == 'rtl') {
                                            clas = 'text-rightdir';
                                        }
                                        header = x.replace("_sum", "");
                                    } else if (key.indexOf("_avg") > 0) {
                                        var vhead = x.split("_");
                                        header = vhead[0];
                                        if (tableallignment == 'rtl') {
                                            clas = 'text-rightdir';
                                        } else {
                                            clas = 'text-right';
                                        }
                                    } else {
                                        header = x.replace("_num", "");
                                        if (tableallignment == 'rtl') {
                                            clas = 'text-rightdir';
                                        } else {
                                            clas = 'text-right';
                                        }
                                    }

                                    // Adding Class If Language Dricection Right To Lift
                                    if (tableallignment == 'rtl') {
                                        $('#txtdatatable_voucher_modal_DynamicModal').addClass('urdutablefont');
                                    } else {
                                        $('#txtdatatable_voucher_modal_DynamicModal').removeClass('urdutablefont');
                                    }

                                    // Convert English Header Into Other Languages
                                    // $.each(responsData.kdata, function (lkey, lvalue) {
                                    //     if (header == lvalue.keyword) {
                                    //         header = lvalue.alt_lan;
                                    //     }
                                    // });

                                    TableHeader += "<th class=" + clas + " " + width + " >" + header + "</th>";
                                    columncount += 1;
                                    Columns.push(header);
                                }
                            }

                        }
                        var tdDate = moment(value, "YYYY-MM-DD", true);
                        if (tdDate.isValid())
                            value = (value) ? getFormattedDate(value) : "-";
                        $('#txtDynamicModal' + key).text(ifnull(value, '-'));
                        $('#modal_tile' + key).text(value);


                    });
                    TableHeader += "</thead></tr>";
                    $('#txtDynamicModalLinkvrnoa_hide').attr('href', base_url + 'index.php/' + respons.data[0].vr_link_hide + '/?vrnoa=' + respons.data[0].vrnoa_hide + '&etype=' + respons.data[0].etype_hide);
                    $("#txtdatatable_voucher_modal_DynamicModal").append(TableHeader);
                    $('#txtdatatable_voucher_modal_DynamicModal').css("background-color", "#BABABA");
                    $('.purchaseVouchermodal .txtDynamicModalPrint').attr('etype', respons.data[0].etype_hide);
                    $('.purchaseVouchermodal .txtDynamicModalPrint').attr('vrnoa', respons.data[0].vrnoa_hide);

                    // Loop For Table Header End

                    //var Columns = [];
                    groupby = components.titleCase(groupby);
                    subgroupby = components.titleCase(subgroupby);
                    var groupbyval = respons.data[0][groupby];
                    var subgroupbyval = respons.data[0][subgroupby];
                    var tgroupby = groupby;
                    if (groupbyval === undefined) {
                        groupbyval = respons.data[0][groupby + '_hide'];
                        tgroupby = groupby + '_hide';
                        respons.data = components.sortByKeyAsc(respons.data, groupby + '_hide');
                    } else {
                        respons.data = components.sortByKeyAsc(respons.data, groupby);
                    }


                    if (subgroupbyval === undefined) {
                        subgroupbyval = respons.data[0][subgroupby + '_hide'];
                        if (subgroupbyval != undefined) {
                            respons.data[0].sort(firstBy(tgroupby, {
                                ignoreCase: true
                            }).thenBy(subgroupby + '_hide'));
                        }
                    } else {
                        respons.data[0].sort(firstBy(tgroupby, {
                            ignoreCase: true
                        }).thenBy(subgroupby));
                    }






                    // Loop[] For Tacking Sub GroupTotal
                    for (var i = 0; i < respons.data.length; i++) {

                        groupbyval = respons.data[i][groupby];
                        subgroupbyval = respons.data[i][subgroupby];
                        if (groupbyval === undefined) {
                            groupbyval = respons.data[i][groupby + '_hide'];
                        }

                        if (subgroupbyval === undefined) {
                            subgroupbyval = respons.data[i][subgroupby + '_hide'];
                        }

                        var TableHeader2 = "<tr class = " + rowvisibility + ">";
                        var x = 0;
                        TableHeader2 += "<td>" + parseInt(sr + 1) + "</td>";
                        sr = sr + 1;

                        $.each(respons.data[i], function (key, value) {
                            if (key.indexOf("_sum") >= 0) {
                                tdflag = true;
                            } else {
                                tdflag = false;
                            }

                            var tdDate = moment(value, "YYYY-MM-DD", true);
                            if (key.indexOf("_sum") >= 0) {
                                if ((key.indexOf("Qty_sum") >= 0) || (key.indexOf("Qty_num") >= 0) || (key.indexOf("Qty") >= 0)) {
                                    value = (value) ? parseFloat(value).toFixed(QTY_ROUNDING) + value.replace(/[^a-zA-Z]+/g, '') : parseFloat(0).toFixed(2);
                                } else if ((key.indexOf("Rate_sum") >= 0) || (key.indexOf("Rate_num") >= 0) || (key.indexOf("Rate") >= 0)) {
                                    value = (value) ? parseFloat(value).toFixed(RATE_ROUNDING) + value.replace(/[^a-zA-Z]+/g, '') : parseFloat(0).toFixed(2);
                                } else if ((key.indexOf("Meter_sum") >= 0) || (key.indexOf("Meter_num") >= 0) || (key.indexOf("Meter") >= 0)) {
                                    value = (value) ? parseFloat(value).toFixed(METER_ROUNDING) + value.replace(/[^a-zA-Z]+/g, '') : parseFloat(0).toFixed(2);
                                } else if (tdDate.isValid()) {
                                    value = (value) ? getFormattedDate(value) : "-";
                                    clas = 'text-left';
                                } else {
                                    value = (value) ? gettoFixed(value) + value.toString().replace(/[^a-zA-Z]+/g, '') : parseFloat(0).toFixed(2);
                                }
                                if (tableallignment == 'rtl') {
                                    clas = 'text-rightdir';
                                } else {
                                    clas = 'text-right';
                                }


                            } else if (key.indexOf("_num") >= 0) {

                                if ((key.indexOf("Qty_sum") >= 0) || (key.indexOf("Qty_num") >= 0) || (key.indexOf("Qty") >= 0)) {
                                    value = (value) ? parseFloat(value).toFixed(QTY_ROUNDING) + value.replace(/[^a-zA-Z]+/g, '') : parseFloat(0).toFixed(2);
                                } else if ((key.indexOf("Rate_sum") >= 0) || (key.indexOf("Rate_num") >= 0) || (key.indexOf("Rate") >= 0)) {
                                    value = (value) ? parseFloat(value).toFixed(RATE_ROUNDING) + value.replace(/[^a-zA-Z]+/g, '') : parseFloat(0).toFixed(2);
                                } else if ((key.indexOf("Meter_sum") >= 0) || (key.indexOf("Meter_num") >= 0) || (key.indexOf("Meter") >= 0)) {
                                    value = (value) ? parseFloat(value).toFixed(METER_ROUNDING) + value.replace(/[^a-zA-Z]+/g, '') : parseFloat(0).toFixed(2);
                                } else if (tdDate.isValid()) {
                                    value = (value) ? getFormattedDate(value) : "-";
                                    clas = 'text-left';
                                } else {
                                    value = (value) ? gettoFixed(value) + value.replace(/[^a-zA-Z]+/g, '') : parseFloat(0).toFixed(2);
                                }

                                if (tableallignment == 'rtl') {
                                    clas = 'text-rightdir';
                                } else {
                                    clas = 'text-right';
                                }
                            } else {
                                if ((key.indexOf("Qty_sum") >= 0) || (key.indexOf("Qty_num") >= 0) || (key.indexOf("Qty") >= 0)) {
                                    value = (value) ? parseFloat(value).toFixed(QTY_ROUNDING) + value.replace(/[^a-zA-Z]+/g, '') : parseFloat(0).toFixed(2);
                                } else if ((key.indexOf("Rate_sum") >= 0) || (key.indexOf("Rate_num") >= 0) || (key.indexOf("Rate") >= 0)) {
                                    value = (value) ? parseFloat(value).toFixed(RATE_ROUNDING) + value.replace(/[^a-zA-Z]+/g, '') : parseFloat(0).toFixed(2);
                                } else if ((key.indexOf("Meter_sum") >= 0) || (key.indexOf("Meter_num") >= 0) || (key.indexOf("Meter") >= 0)) {
                                    value = (value) ? parseFloat(value).toFixed(METER_ROUNDING) + value.replace(/[^a-zA-Z]+/g, '') : parseFloat(0).toFixed(2);
                                } else if (tdDate.isValid()) {
                                    value = (value) ? getFormattedDate(value) : "-";
                                    clas = 'text-left';
                                } else {
                                    value = (value) ? value : '-';
                                }

                                if (tableallignment == 'rtl') {
                                    clas = 'text-rightdir';
                                } else {
                                    clas = 'text-left';
                                }
                            }

                            if (key.indexOf("_hide") < 0) {
                                TableHeader2 += "<td class=" + clas + ">" + value + "</td>";
                                if (x == 0) {
                                    var st = ((subgroupbyval === undefined) || (subgroupbyval === null)) ? '-' : subgroupbyval;
                                    var checkSubDate = moment(st, "YYYY-MM-DD", true);
                                    st = checkSubDate.isValid() ? getFormattedDate(st) : st;

                                    var t = ((groupbyval === undefined) || (groupbyval === null)) ? '-' : groupbyval;
                                    var checkTotDate = moment(t, "YYYY-MM-DD", true);
                                    t = checkTotDate.isValid() ? getFormattedDate(t) : t;

                                    if (tableallignment == 'rtl') {
                                        grandtotal[x] = 'کل رقم';
                                    } else {
                                        grandtotal[x] = 'TOTAL';
                                    }

                                } else if (key.indexOf("_sum") >= 0) {
                                    if (key.indexOf("_sumc") >= 0) {
                                        if (vrprimary != vrprimaryold) {
                                            vrprimaryold = vrprimary;
                                            grandtotal[x] = (grandtotal[x] ? parseFloat(grandtotal[x]) : 0) + parseFloat(value);

                                            if ((key.indexOf("Qty_sum") >= 0) || (key.indexOf("Qty_num") >= 0) || (key.indexOf("Qty") >= 0)) {
                                                grandtotal[x] = parseFloat(grandtotal[x]).toFixed(QTY_ROUNDING);
                                            } else if ((key.indexOf("Rate_sum") >= 0) || (key.indexOf("Rate_num") >= 0) || (key.indexOf("Rate") >= 0)) {
                                                grandtotal[x] = parseFloat(grandtotal[x]).toFixed(RATE_ROUNDING);
                                            } else if ((key.indexOf("Meter_sum") >= 0) || (key.indexOf("Meter_num") >= 0) || (key.indexOf("Meter") >= 0)) {
                                                grandtotal[x] = parseFloat(grandtotal[x]).toFixed(METER_ROUNDING);
                                            } else {
                                                grandtotal[x] = gettoFixed(grandtotal[x]);
                                            }
                                            groupflag = true;
                                            tdflag = true;
                                        }

                                    } else {
                                        grandtotal[x] = (grandtotal[x] ? parseFloat(grandtotal[x]) : 0) + parseFloat(value);

                                        if ((key.indexOf("Qty_sum") >= 0) || (key.indexOf("Qty_num") >= 0) || (key.indexOf("Qty") >= 0)) {
                                            grandtotal[x] = parseFloat(grandtotal[x]).toFixed(QTY_ROUNDING);
                                        } else if ((key.indexOf("Rate_sum") >= 0) || (key.indexOf("Rate_num") >= 0) || (key.indexOf("Rate") >= 0)) {
                                            grandtotal[x] = parseFloat(grandtotal[x]).toFixed(RATE_ROUNDING);
                                        } else if ((key.indexOf("Meter_sum") >= 0) || (key.indexOf("Meter_num") >= 0) || (key.indexOf("Meter") >= 0)) {
                                            grandtotal[x] = parseFloat(grandtotal[x]).toFixed(METER_ROUNDING);
                                        } else {
                                            grandtotal[x] = gettoFixed(grandtotal[x]);
                                        }
                                        groupflag = true;
                                        tdflag = true;
                                    }

                                } else if (key.indexOf("_avg") >= 0) {
                                    var cols = key.split("_");
                                    subgrouptotal[x] = "_" + cols[2] + "_" + cols[3];
                                    grouptotal[x] = "_" + cols[2] + "_" + cols[3];
                                    grandtotal[x] = "_" + cols[2] + "_" + cols[3];
                                } else {
                                    grouptotal[x] = '';
                                    subgrouptotal[x] = '';
                                    grandtotal[x] = '';
                                }
                                x += 1;
                            }
                        });

                        TableHeader2 += "</tr>";
                        $('#txtdatatabletbody_voucher_modal_DynamicModal').append(TableHeader2);
                        $('#txtdatatabletbody_voucher_modal_DynamicModal').css("background-color", "white");
                    }
                }

                if (groupflag === true) {
                    var GrandTot = "<tr class='finalsum'><td></td>";
                    for (var y = 0; y < columncount; y++) {
                        tdflag = true;
                        if (y == 0) {
                            if (etypebeforeundefine == 'saleinvoicewise') {
                                if (etypebeforeundefine == 'saleinvoicewise') {
                                    namountsum = parseFloat(namountsum) + parseFloat(respons.data[respons.data.length - 1]['Namount_hide']);
                                }
                                GrandTot += '<td class="' + total_clss + ' text-bold" colspan="' + colspanwidth + '" > Net Bill Total:' + namountsum + '</td>';
                            } else {
                                GrandTot += '<td class="' + total_clss + ' text-bold" colspan="' + colspanwidth + '" >' + grandtotal[y] + '</td>';
                            }
                            y += colspanwidth - 1;
                            for (var y = 0; y < colspanwidth - 1; y++) {
                                GrandTot += "<td class='hide'> </td>";
                            }
                        } else {
                            GrandTot += "<td class='" + total_clss + " text-bold'>" + grandtotal[y] + "</td>";
                        }

                    }
                    GrandTot += "</tr>";
                    $('#txtdatatabletbody_voucher_modal_DynamicModal').append(GrandTot);
                }
                var y = 2;
                var TableHeader2 = "";
                $('#txtdatatabletbody_voucher_modal_DynamicModal').append(TableHeader2);
                $('#txtdatatabletbody_voucher_modal_DynamicModal').css("background-color", "white");
                bindGrid();
                $("td.text-right").digits();
            },
            error: function (result) {
                $("#loading").hide();
                alert("Error:" + result);
            }
        });
    };
    var toCapitalize = function (str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
    var getTabLength = function () {
        return $('#txtdatatable_voucher_modal_DynamicModal thead tr th').length;
    };
    var bindGrid = function () {
        var oldTabLength = getTabLength();
        var etype = $('.page_title').text();
        var what = components.getCurrentView();
        var msg = "<b>From </b>" + $('#from_date').val() + " :- <b>To</b> To:- " + $('#to_date').val() + ", " + toCapitalize(what) + " Wise";
        var dontSort = [];
        $('#txtdatatable_voucher_modal_DynamicModal thead th').each(function () {
            if ($(this).hasClass('no_sort')) {
                dontSort.push({
                    "bSortable": false
                });
            } else {
                dontSort.push(null);
            }
        });
        voucher_modal.voucher_modal_dataTable = $('#txtdatatable_voucher_modal_DynamicModal').dataTable({
            "sDom": '<if<t>lp>',
            "aaSorting": [
                [0, "asc"]
            ],
            // "autoWidth": false,
            "bPaginate": true,
            'bFilter': true,
            "fixedHeader": true,
            "sPaginationType": "full_numbers",
            "bJQueryUI": false,
            "aoColumns": dontSort,
            "bSort": false,
            "iDisplayLength": 150,
            buttons: [{
                extend: 'print',
                text: '<i class="fa fa-print"></i> Print',
                className: 'btn btn-primary',
                title: etype,
                message: msg,
                exportOptions: {
                    columns: ':visible',
                    search: 'applied',
                    order: 'applied'
                },
            },
            {
                extend: 'copy',
                text: '<i class="fa fa-copy"></i> Copy',
                className: 'btn btn-default',
                exportOptions: {
                    columns: ':visible',
                    search: 'applied',
                    order: 'applied'
                },
            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fa fa-file"></i> PDF',
                className: 'btn btn-danger',
                // download: 'open',
                orientation: 'portrait',
                pageSize: 'A4',
                title: etype,
                message: "From :-" + $('#from_date').val() + " :- To:- " + $('#to_date').val() + ", " + toCapitalize(what) + " Wise",
                exportOptions: {
                    columns: ':visible',
                    search: 'applied',
                    order: 'applied'
                },

            },
            {
                extend: 'excel',
                text: '<i class="fa fa-file-text-o"></i> Excel',
                className: 'btn btn-warning',
                title: etype,
                customize: function (xlsx) {
                    console.log(xlsx);
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];

                    // Loop over the cells in column `C`
                    $('row c[r^="C"]', sheet).each(function () {
                        // Get the value
                        if ($('is t', this).text() == 'New York') {
                            $(this).attr('s', '20');
                        }
                    });
                }
            },
            {
                extend: 'csv',
                text: '<i class="fa fa-file-text"></i> CSV',
                className: 'btn btn-info'
            },
            {
                extend: 'colvis',
                text: '<i class="fa fa-eye"></i> Columns Visible',
                className: 'btn btn-danger',
                columns: ':not(:first-child)',
            },
            ],
            "oTableTools": {
                "sSwfPath": "js/copy_cvs_xls_pdf.swf",
                "aButtons": [{
                    "sExtends": "print",
                    "sButtonText": "Print Report",
                    "sMessage": "Inventory Report"
                }]
            },
            // "lengthMenu": [[100, 250, 500, -1], [100, 200, 100, "All"]],
            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

        });
        $('.nav-light > a.tool-action').off('click').on('click', function (e, index) {
            var action = $(this).attr('data-action');
            voucher_modal.voucher_modal_dataTable.DataTable().button(action).trigger('click');
        });
        $('.buttons-colvis').on('click', function (e) {
            $('.dt-button-collection').css({
                'display': 'block',
                'top': '499px',
                'left': '609.203px'
            });
            $('.div.dt-button-collection').css('width', '161px');
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            "s`": "dataTables_wrapper form-inline",
        });
    };

    const Print_Voucher_view = (vrnoa_view, etype_view, hd, prnt, wrate = 0) => {
        try {
            const __vrnoa = vrnoa_view;
            const __etype = etype_view;
            const __pre_bal_print = 0;
            const __lang = $('input[name="languagename"]:checked').val();
            const __url = base_url + 'index.php/doc/getPrintVoucherPDF/?etype=' + __etype + '&vrnoa=' + __vrnoa + '&pre_bal_print=' + __pre_bal_print + '&hd=' + hd + '&print=' + prnt + '&wrate=' + (wrate ? wrate : 0) + '&language_id=' + __lang;
            const _encodeURI = encodeURI(__url);
            openPrintOnSettingConfiguration(_encodeURI);
        } catch (error) {
            console.error(error);
        }
        $('#purchaseVoucher').modal('hide');
    };
    const getVoucherViewLayout = (etype, layout_po) => {
        $.ajax({
            url: base_url + 'index.php/general_http_request/getVoucherViewLayout',
            type: 'POST',
            data: { 'etype': etype, 'layout_po': layout_po },
            dataType: 'JSON',
            async: false,
            success: function (response) {
                if (response.status && response.data !== null)
                    populateVoucherViewLayout(response.data, layout_po);
                else {
                    if (layout_po == 'top')
                        $('.txtVoucherViewModalDivtop').empty();
                    else
                        $('.txtVoucherViewModalDiv').empty();
                    console.log(response);
                }

            }, error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };
    const populateVoucherViewLayout = (data, layout_po) => {
        var divCONCAT = '';
        divCONCAT += '<div class="row">';
        var $columnCounter = 1; // Don't change
        $.each(data, function (index, elem) {
            var cols = elem.field_column;
            divCONCAT += '<div class="col-lg-' + elem.field_row + '">';
            if (elem.field_style === 'input-group') {
                divCONCAT += '<div class="input-group">';
                divCONCAT += '<span class="input-group-addon txt-addon">' + elem.field_lable + '</span>';
                divCONCAT += '<span class="form-control" id="txtDynamicModal' + elem.field_value + '"></span>';
                divCONCAT += '</div>';
            }
            if (elem.field_style !== 'input-group') {
                divCONCAT += '<div class="form-group">';
                divCONCAT += '<label>' + elem.field_lable + '</label>';
                divCONCAT += '<span class="form-control" id="txtDynamicModal' + elem.field_value + '"></span>';
                divCONCAT += '</div>';
            }
            divCONCAT += '</div>';
            if (((index + 1) % cols) === 0 && (index + 1) !== data.length) {
                divCONCAT += '</div>';
                divCONCAT += '<div class="row">';
            }
            // Increment column count
            $columnCounter++;

            // Fill with empty columns at the end
            if ((index + 1) === data.length && $columnCounter <= cols) {
                var $spacers = cols - $columnCounter;
                for ($i = $spacers; $i >= 0; $i--) {
                    divCONCAT += '<div class="col spacer">&nbsp;</div>';
                }
            }

            if ($columnCounter > cols)
                $columnCounter = 1;
        });
        divCONCAT += '</div>';
        if (layout_po == 'top') {
            $('.txtVoucherViewModalDivtop').empty();
            $(divCONCAT).appendTo('.txtVoucherViewModalDivtop');
        } else {
            $('.txtVoucherViewModalDiv').empty();
            $(divCONCAT).appendTo('.txtVoucherViewModalDiv');
        }
    };

    return {
        init: function () {
            this.bindUI();
        },
        bindUI: function () {
            $('#txtDynamicModalPrint').on('click', function (e) {
                e.preventDefault();
                const vrnoa_view = $(this).attr('vrnoa');
                const etype_view = $(this).attr('etype');
                const ps_view = $('#setting_print_default').val();
                if ($('#setting_print_default').val() == 5 || $('#setting_print_default').val() == 6) {
                    window.open(base_url + 'application/views/reportprints/thermal_pdf.php', "Quotation Voucher", 'width=1000, height=842');
                } else {
                    Print_Voucher_view(vrnoa_view, etype_view, ps_view, 'lg', '');
                }
            });

            $('body').on('click', '#purchaseView', function (e) {
                e.preventDefault();
                var vrnoa = $.trim($(this).data('vrnoa'));
                var etype = $.trim($(this).data('etype'));
                var fn_id = getNum($(this).data('fn_id'));
                var company_id = getNum($(this).data('company_id'));
                var requestname = $.trim($(this).data('requestname'));
                if (requestname !== "") {
                    getVoucherViewLayout(etype, 'top');
                    getVoucherViewLayout(etype, 'bottom');
                    getVoucherDataWithVrnoaAndEtype(vrnoa, etype, fn_id, company_id, requestname);

                }
            });
        },
    };
};
var voucher_modal = new Voucher_modal();
voucher_modal.init();