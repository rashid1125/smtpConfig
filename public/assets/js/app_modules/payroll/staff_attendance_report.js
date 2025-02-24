import { makeAjaxRequest } from '../../../../js/components/MakeAjaxRequest.js';
import AlertComponent from '../../../../js/components/AlertComponent.js';
import { doLoading } from '../commonFunctions/CommonFunction.js';

const StaffAttendanceReport = function() {

    var settings = {

        from_date      : $( '#from_date' ),
        to_date        : $( '#to_date' ),
        dept_dropdown  : $( '#dept_dropdown' ),
        staff_dropdown : $( '#staff_dropdown' ),
        status_dropdown: $( '#status_dropdown' ),

        // buttons
        btnSearch: $( '.btnSearch' ),
        btnReset : $( '.btnReset' ),
    };

    var fetchStaid         = function( did ) {

        $.ajax( {
            url     : base_url + 'index.php/payroll/payrollstaff/fetchByDepartment',
            type    : 'POST',
            data    : {
                'did': did,
            },
            dataType: 'JSON',
            success : function( data ) {

                removeStaidOptions();
                if ( data !== 'false' ) {
                    populateStaid( data );
                }

            },
            error   : function( xhr, status, error ) {
                console.log( xhr.responseText );
            },
        } );
    };
    var populateStaid      = function( data ) {

        var staidOptions = '';
        $.each( data, function( index, elem ) {

            staidOptions += '<option value=\'' + elem.staid + '\' >' + elem.staid + ' - ' + elem.name + '</option>';
        } );

        $( staidOptions ).appendTo( settings.staff_dropdown );
    };
    var removeStaidOptions = function() {

        $( staff_dropdown ).children( 'option' ).each( function() {
            if ( $( this ).val() !== '' ) {
                $( this ).remove();
            }
        } );
    };
    var validateSearch     = function() {

        var errorFlag       = false;
        var dept_dropdown   = $( settings.dept_dropdown ).val();
        var status_dropdown = $( settings.status_dropdown ).val();
        var from_date       = $( settings.from_date ).val();
        var to_date         = $( settings.to_date ).val();

        // remove the error class first
        $( settings.dept_dropdown ).removeClass( 'inputerror' );
        $( settings.status_dropdown ).removeClass( 'inputerror' );
        $( settings.from_date ).removeClass( 'inputerror' );
        $( settings.to_date ).removeClass( 'inputerror' );

        if ( dept_dropdown === '' || dept_dropdown === null ) {
            $( settings.dept_dropdown ).addClass( 'inputerror' );
            errorFlag = true;
        }
        if ( status_dropdown === '' || status_dropdown === null ) {
            $( settings.status_dropdown ).addClass( 'inputerror' );
            errorFlag = true;
        }
        if ( from_date === '' || from_date === null ) {
            $( settings.from_date ).addClass( 'inputerror' );
            errorFlag = true;
        }
        if ( to_date === '' || to_date === null ) {
            $( settings.to_date ).addClass( 'inputerror' );
            errorFlag = true;
        }

        return errorFlag;
    };

    const searchStaffAttendanceReport = async function( from, to, crit, orderBy, groupBy, name ) {
        if ( typeof staffAttendanceReport.dTable != 'undefined' ) {
            staffAttendanceReport.dTable.fnDestroy();
            $( '#atnd-table tbody' ).empty();
        }
        doLoading();
        try {
            const response = await makeAjaxRequest( 'POST', '/payroll/getStaffAttendanceReportData', {
                'from'   : from,
                'to'     : to,
                'crit'   : crit,
                'orderBy': orderBy,
                'groupBy': groupBy,
                'name'   : name,
            } );
            if ( response && response.status === false ) {
                AlertComponent.getAlertMessage( { title: 'Error!', message: response.message, type: 'danger' } );
                return;
            }
            populateData( response.data );
            bindGrid();
        }
        catch ( error ) {
            console.log( error );
        }
        finally {
            doLoading();
        }
    };

    var populateData  = function( data ) {

        $( '.Presents' ).html( '0' );
        $( '.Absents' ).html( '0' );
        $( '.Paid-Leave' ).html( '0' );
        $( '.Unpaid-Leave' ).html( '0' );
        $( '.Rest-Day' ).html( '0' );
        $( '.Gusted-Holiday' ).html( '0' );
        $( '.Short-Leave' ).html( '0' );
        $( '.Outdoor' ).html( '0' );
        $( '.Sick' ).html( '0' );
        $( '.Annual' ).html( '0' );

        var t_Present       = 0,
            t_Absent        = 0,
            t_paidleave     = 0,
            t_unpaidleave   = 0,
            t_restday       = 0,
            t_gustedholyday = 0,
            t_shortleave    = 0,
            t_outdoor       = 0,
            t_Sick          = 0,
            t_Annual        = 0;
        var g_Present       = 0,
            g_Absent        = 0,
            g_paidleave     = 0,
            g_unpaidleave   = 0,
            g_restday       = 0,
            g_gustedholyday = 0,
            g_shortleave    = 0,
            g_outdoor       = 0,
            g_Sick          = 0,
            g_Annual        = 0;
        var th, td1, td2;

        var SERIAL           = 1;
        var prevVoucher      = '',
            prevVoucherMatch = '',
            staff_name       = '';


        th  = $( '#general-head-template' ).html();
        td1 = $( '#voucher-item-template' ).html();
        td2 = $( '#voucher-asbsentitem-template' ).html();

        var template = Handlebars.compile( th );
        var html     = template( {} );
        $( '.dthead' ).html( html );

        $( '#datatable_example_wrapper' ).fadeIn();
        var rows = $( '#atnd-table tbody' );

        $.each( data, function( index, elem ) {
            console.log();

            var obj = {};

            obj.SERIAL         = SERIAL++;
            obj.VOUCHER_NUMBER = elem.vrnoa;
            obj.DATE           = (elem.date) ? (elem.date).substring( 0, 10 ) : '-';
            obj.NAME           = (elem.staffName) ? elem.staffName : '-';
            obj.DEPT_NAME      = (elem.departmentName) ? elem.departmentName : '-';
            obj.DESIGNATION    = (elem.designationName) ? elem.designationName : '-';
            obj.SHIFT          = (elem.shiftName) ? elem.shiftName : '-';
            obj.TIN            = (new Date( `${ elem.date } ${ elem.time_in }` ).toLocaleTimeString().replace( /([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3' )) ? new Date( `${ elem.date } ${ elem.time_in }` ).toLocaleTimeString().replace( /([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3' ) : '-';
            obj.TOUT           = (new Date( `${ elem.date } ${ elem.time_out }` ).toLocaleTimeString().replace( /([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3' )) ? new Date( `${ elem.date } ${ elem.time_out }` ).toLocaleTimeString().replace( /([\d]+:[\d]{2})(:[\d]{2})(.*)/, '$1$3' ) : '-';
            obj.REMARKS        = (elem.description) ? elem.description : '-';
            obj.TYPE           = (elem.staffType) ? elem.staffType : '-';
            obj.STATUS         = (elem.statusName) ? elem.statusName : '-';

            prevVoucherMatch = elem.field;
            if ( prevVoucher != prevVoucherMatch ) {
                if ( index !== 0 ) {
                    const total  = 'Total: ' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Presents: ' + t_Present + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Absents: ' + t_Absent + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Paid Leaves: ' + t_paidleave + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Unpaid Leave : ' + +t_unpaidleave + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Rest Day: ' + t_restday + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Gusted Holiday: ' + t_gustedholyday + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Short Leave: ' + t_shortleave + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Outdoor: ' + t_outdoor;
                    // add the previous one's sum
                    var source   = $( '#voucher-sum-template' ).html();
                    var template = Handlebars.compile( source );
                    var html     = template( {
                        TOTAL: total,
                    } );
                    rows.append( html );
                }

                // Create the heading for this new voucher.
                var source   = $( '#voucher-vhead-template' ).html();
                var template = Handlebars.compile( source );
                var html     = template( {
                    VRNOA1: prevVoucherMatch,
                } );

                rows.append( html );
                // Reset the previous voucher's sum
                t_Present       = 0;
                t_Absent        = 0;
                t_paidleave     = 0;
                t_unpaidleave   = 0;
                t_restday       = 0;
                t_gustedholyday = 0;
                t_shortleave    = 0;
                t_outdoor       = 0;
                t_Sick          = 0;
                t_Annual        = 0;
                // Reset the previous voucher to current voucher.
                prevVoucher     = prevVoucherMatch;
                // dept_name = elem.dept_name;
            }

            if ( elem.statusName == 'Absent' ) {
                var source = td2;
            } else {
                var source = td1;
            }
            var template = Handlebars.compile( source );
            var html     = template( obj );
            rows.append( html );
            elem.statusName = elem.statusName.toLowerCase();
            g_Present += (elem.statusName === 'present' ? 1 : 0);
            g_Absent += (elem.statusName === 'absent' ? 1 : 0);
            g_paidleave += (elem.statusName === 'paid leave' ? 1 : 0);
            g_unpaidleave += (elem.statusName === 'unpaid leave' ? 1 : 0);
            g_restday += (elem.statusName === 'rest day' ? 1 : 0);
            g_gustedholyday += (elem.statusName === 'gusted holiday' ? 1 : 0);
            g_shortleave += (elem.statusName === 'short leave' ? 1 : 0);
            g_outdoor += (elem.statusName === 'outdoor' ? 1 : 0);
            g_Sick += (elem.statusName === 'sick leave' ? 1 : 0);
            g_Annual += (elem.statusName === 'annual' ? 1 : 0);

            t_Present += (elem.statusName === 'present' ? 1 : 0);
            t_Absent += (elem.statusName === 'absent' ? 1 : 0);
            t_paidleave += (elem.statusName === 'paid leave' ? 1 : 0);
            t_unpaidleave += (elem.statusName === 'unpaid leave' ? 1 : 0);
            t_restday += (elem.statusName === 'rest day' ? 1 : 0);
            t_gustedholyday += (elem.statusName === 'gusted holiday' ? 1 : 0);
            t_shortleave += (elem.statusName === 'short leave' ? 1 : 0);
            t_outdoor += (elem.statusName === 'outdoor' ? 1 : 0);
            t_Sick += (elem.statusName === 'sick leave' ? 1 : 0);
            t_Annual += (elem.statusName === 'annual' ? 1 : 0);
            let total = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Presents: ' + t_Present + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Absents: ' + t_Absent + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Paid Leaves: ' + t_paidleave + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Unpaid Leave : ' + +t_unpaidleave + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Rest Day: ' + t_restday + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Gusted Holiday: ' + t_gustedholyday + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Short Leave: ' + t_shortleave + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Outdoor: ' + t_outdoor;
            if ( index === (data.length - 1) ) {
                var source   = $( '#voucher-sum-template' ).html();
                var template = Handlebars.compile( source );
                total        = 'Total: ' + total;
                var html     = template( {
                    TOTAL: total,
                } );
                rows.append( html );

                total        = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Presents: ' + g_Present + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Absents: ' + g_Absent + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Paid Leaves: ' + g_paidleave + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Unpaid Leave : ' + +g_unpaidleave + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Rest Day: ' + g_restday + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Gusted Holiday: ' + g_gustedholyday + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Short Leave: ' + g_shortleave + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Outdoor: ' + g_outdoor;
                var source   = $( '#voucher-sum-template' ).html();
                var template = Handlebars.compile( source );
                total        = 'Grand Total: ' + total;
                var html     = template( {
                    TOTAL: total,
                } );
                rows.append( html );
            }
        } );

        $( '.Presents' ).html( g_Present );
        $( '.Absents' ).html( g_Absent );
        $( '.Paid-Leave' ).html( g_paidleave );
        $( '.Unpaid-Leave' ).html( g_unpaidleave );
        $( '.Rest-Day' ).html( g_restday );
        $( '.Gusted-Holiday' ).html( g_gustedholyday );
        $( '.Short-Leave' ).html( g_shortleave );
        $( '.Outdoor' ).html( g_outdoor );
        $( '.Sick' ).html( g_Sick );
        $( '.Annual' ).html( g_Annual );

    };
    var Print_Voucher = function() {

        var from = $( '#fromDate' ).val();
        var to   = $( '#toDate' ).val();
        var what = getCurrentView();
        var type = ($( '#Radio1' ).is( ':checked' ) ? 'detailed' : 'summary'); // if true means detailed view if false sumamry view

        var etype = 'staffatnrpt';
        var crit  = getcrit( etype );

        var orderBy = '';
        var groupBy = '';
        var field   = '';
        var name    = '';

        if ( what === 'voucher' ) {
            field   = 'ad.vrnoa';
            orderBy = 'ad.vrnoa';
            groupBy = 'ad.vrnoa';
            name    = 'ad.vrnoa';
        } else if ( what === 'department' ) {
            field   = 'd.name';
            orderBy = 'd.name';
            groupBy = 'd.name';
            name    = 'd.name';
        } else if ( what === 'employee' ) {
            field   = 'stf.name';
            orderBy = 'stf.name';
            groupBy = 'stf.name';
            name    = 'stf.name';
        } else if ( what === 'type' ) {
            field   = 'stf.staff_type';
            orderBy = 'stf.staff_type';
            groupBy = 'stf.staff_type';
            name    = 'stf.staff_type';
        } else if ( what === 'date' ) {
            field   = 'date(ad.vrdate)';
            orderBy = 'date(ad.vrdate)';
            groupBy = 'date(ad.vrdate)';
            name    = 'date(ad.vrdate)';
        } else if ( what === 'year' ) {
            field   = 'year(ad.vrdate)';
            orderBy = 'year(ad.vrdate)';
            groupBy = 'year(ad.vrdate)';
            name    = 'year(ad.vrdate)';
        } else if ( what === 'month' ) {
            field   = 'month(ad.vrdate) ';
            orderBy = 'month(ad.vrdate)';
            groupBy = 'month(ad.vrdate)';
            name    = 'month(ad.vrdate)';
        } else if ( what === 'weekday' ) {
            field   = 'DAYNAME(ad.vrdate)';
            orderBy = 'DAYNAME(ad.vrdate)';
            groupBy = 'DAYNAME(ad.vrdate)';
            name    = 'DAYNAME(ad.vrdate)';
        } else if ( what === 'user' ) {
            field   = 'u.name ';
            orderBy = 'u.name';
            groupBy = 'u.name';
            name    = 'u.name';
        } else if ( what === 'shift group' ) {
            field   = 's.name ';
            orderBy = 's.name';
            groupBy = 's.name';
            name    = 's.name';
        }

        const url = `${ base_url }/doc/Print_payroll_Report/?from=${ from }&to=${ to }&what=${ what }&type=${ type }&etype=${ etype }&crit=${ crit }&field=${ field }&orderBy=${ orderBy }&groupBy=${ groupBy }&name=${ name }`;
        window.open( url );
    };
    var toCapitalize  = function( str ) {
        return str.replace( /\w\S*/g, function( txt ) {
            return txt.charAt( 0 ).toUpperCase() + txt.substr( 1 ).toLowerCase();
        } );
    };

    var getTabLength = function() {
        return $( '#atnd-table thead tr th' ).length;
    };
    var bindGrid     = function() {
        var oldTabLength = getTabLength();
        var etype        = $( '.page_title' ).text();
        var what         = getCurrentView();
        var msg          = '<b>From </b>' + $( '#from_date' ).val() + ' :- <b>To</b> To:- ' + $( '#to_date' ).val() + ', ' + toCapitalize( what ) + ' Wise';
        var dontSort     = [];
        $( '#atnd-table thead th' ).each( function() {
            if ( $( this ).hasClass( 'no_sort' ) ) {
                dontSort.push( {
                    'bSortable': false,
                } );
            } else {
                dontSort.push( null );
            }
        } );

        staffAttendanceReport.dTable = $( '#atnd-table' ).dataTable( {
            'sDom'           : '<if<t>lp>',
            'bPaginate'      : true,
            'bFilter'        : true,
            'sPaginationType': 'full_numbers',
            'bJQueryUI'      : false,
            'aoColumns'      : dontSort,
            'bSort'          : false,
            'iDisplayLength' : 200,
        } );
        $( '.nav-light > a.tool-action' ).off( 'click' ).on( 'click', function( e, index ) {
            var action = $( this ).attr( 'data-action' );
            dTable.DataTable().button( action ).trigger( 'click' );
        } );
        $.extend( $.fn.dataTableExt.oStdClasses, {
            's`': 'dataTables_wrapper form-inline',
        } );
    };

    var getCurrentView = function() {
        var what = $( '.btnSelCre.btn-primary-group' ).text().split( 'Wise' )[0].trim().toLowerCase();
        return what;
    };

    const getcrit = function( etype ) {

        const staffId    = $( '#drpStaffId' ).select2( 'val' );
        const staffType  = $( '#drpStaffType' ).select2( 'val' );   // staff type
        const statusType = $( '#drpstatusId' ).select2( 'val' );
        const shiftGroup = $( '#drpShiftGroup' ).select2( 'val' );
        const userId     = $( '#drpuserId' ).select2( 'val' );

        let crit = '';

        if ( Array.isArray( staffId ) && staffId.length > 0 ) {
            crit += 'AND stf.id in (' + staffId + ') ';
        }

        if ( Array.isArray( staffType ) && staffType.length > 0 ) {
            let query = '';
            $.each( staffType, function( text ) {
                query += '\'' + staffType[text] + '\',';
            } );
            query = query.slice( 0, -1 );
            crit += 'AND stf.staff_type in (' + query + ') ';
        }

        if ( Array.isArray( statusType ) && statusType.length > 0 ) {
            crit += 'AND adt.staff_status_id in (' + statusType + ') ';
        }

        if ( Array.isArray( userId ) && userId.length > 0 ) {
            crit += 'AND u.id in (' + userId + ') ';
        }


        crit += 'AND ad.vrnoa <>0  ';

        return crit;
    };

    var printReport = function() {
        window.open( base_url + 'application/views/reportprints/payroll/staffattendance.php', $( '.page_title' ).text().trim(), 'width=720, height=850' );
    };

    return {

        init: function() {
            $( '.select2' ).select2();
            this.bindUI();
        },

        bindUI: function() {

            var self = this;

            shortcut.add( 'F6', function() {
                $( '.btnSearch' ).get()[0].click();
            } );
            shortcut.add( 'F9', function() {
                Print_Voucher();
            } );

            shortcut.add( 'F3', function() {
                $( '.copy5' ).get()[0].click();
            } );
            shortcut.add( 'F8', function() {
                $( '.excel8' ).get()[0].click();
            } );
            shortcut.add( 'F10', function() {
                $( '.csv10' ).get()[0].click();
            } );

            shortcut.add( 'F5', function() {
                self.resetVoucher();
            } );
            $( '.btnPrint' ).on( 'click', function( ev ) {
                ev.preventDefault();
                Print_Voucher();
                // window.open(base_url + 'application/views/reportprints/vouchers_reports.php', "Purchase Report", 'width=1210, height=842');
            } );

            $( '#reset_criteria' ).on( 'click', function( e ) {
                e.preventDefault();
                $( '#collapseOne' ).find( 'select' ).select2( 'val', '' );
            } );

            $( '.btnAdvaced' ).on( 'click', function( ev ) {
                ev.preventDefault();
                $( '.panel-group' ).toggleClass( 'panelDisplay' );
            } );

            $( '.btnSelCre' ).on( 'click', function( e ) {
                e.preventDefault();
                $( this ).addClass( 'btn-primary-group' );
                $( this ).siblings( '.btnSelCre' ).removeClass( 'btn-primary-group' );
            } );

            // when selection is changed in fromdept_dropdown
            $( settings.dept_dropdown ).on( 'change', function() {

                var did = $( settings.dept_dropdown ).val();
                fetchStaid( did );
            } );

            $( settings.btnSearch ).on( 'click', async function( e ) {
                e.preventDefault();
                await self.initSearch();
            } );

            // $('.btnPrint').on('click', function(e) {
            // 	e.preventDefault();
            // 	printReport();
            // });

            $( settings.btnReset ).on( 'click', function( e ) {
                e.preventDefault();
                self.resetVoucher();
            } );
        },

        initSearch: async function() {
            var error = validateSearch();

            if ( !error ) {

                var field   = '';
                var orderBy = '';
                var groupBy = '';
                var what    = getCurrentView();

                if ( what === 'voucher' ) {
                    field   = 'ad.vrnoa';
                    orderBy = 'ad.vrnoa';
                    groupBy = 'ad.vrnoa';
                    name    = 'ad.vrnoa';
                } else if ( what === 'department' ) {
                    field   = 'd.name';
                    orderBy = 'd.name';
                    groupBy = 'd.name';
                    name    = 'd.name';
                } else if ( what === 'employee' ) {
                    field   = 'stf.name';
                    orderBy = 'stf.name';
                    groupBy = 'stf.name';
                    name    = 'stf.name';
                } else if ( what === 'type' ) {
                    field   = 'stf.staff_type';
                    orderBy = 'stf.staff_type';
                    groupBy = 'stf.staff_type';
                    name    = 'stf.staff_type';
                } else if ( what === 'date' ) {
                    field   = 'date(ad.vrdate)';
                    orderBy = 'date(ad.vrdate)';
                    groupBy = 'date(ad.vrdate)';
                    name    = 'date(ad.vrdate)';
                } else if ( what === 'year' ) {
                    field   = 'year(ad.vrdate)';
                    orderBy = 'year(ad.vrdate)';
                    groupBy = 'year(ad.vrdate)';
                    name    = 'year(ad.vrdate)';
                } else if ( what === 'month' ) {
                    field   = 'month(ad.vrdate) ';
                    orderBy = 'month(ad.vrdate)';
                    groupBy = 'month(ad.vrdate)';
                    name    = 'month(ad.vrdate)';
                } else if ( what === 'weekday' ) {
                    field   = 'DAYNAME(ad.vrdate)';
                    orderBy = 'DAYNAME(ad.vrdate)';
                    groupBy = 'DAYNAME(ad.vrdate)';
                    name    = 'DAYNAME(ad.vrdate)';
                } else if ( what === 'user' ) {
                    field   = 'u.name ';
                    orderBy = 'u.name';
                    groupBy = 'u.name';
                    name    = 'u.name';
                } else if ( what === 'shift group' ) {
                    field   = 's.name ';
                    orderBy = 's.name';
                    groupBy = 's.name';
                    name    = 's.name';
                }

                var crit = getcrit();
                var from = $( '#fromDate' ).val();
                var to   = $( '#toDate' ).val();

                await searchStaffAttendanceReport( from, to, crit, orderBy, groupBy, name );
            } else {
                alert( 'Correct the errors...' );
            }
        },

        resetVoucher: function() {
            general.reloadWindow();
        },

    };
};
const staffAttendanceReport = new StaffAttendanceReport();
staffAttendanceReport.init();