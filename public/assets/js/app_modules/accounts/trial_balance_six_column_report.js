import AlertComponent from '../../../../js/components/AlertComponent.js';
import { AMOUNT_ROUNDING } from '../../../../js/components/GlobalConstants.js';
import { makeAjaxRequest } from '../../../../js/components/MakeAjaxRequest.js';
import { reportComponent } from '../../../ReportDynamically/report_component.js';
import { formatDateBasedOnSettings, parseNumber } from '../commonFunctions/CommonFunction.js';

var TrialBalance = function() {
    var getTrialBalanceReport        = async function( startDate, endDate, levelId, level2Id, level3Id ) {
        if ( typeof trialBalance.trialBalanceDataTable != 'undefined' ) {
            trialBalance.trialBalanceDataTable.fnDestroy();
            $( '.dthead' ).empty();
            $( '.saleRows' ).empty();
        }

        const response = await makeAjaxRequest( 'GET', `${ base_url }/trialBalance/getTrialBalanceSixColumnReport`, {
            startDate,
            endDate,
            levelId,
            level2Id,
            level3Id,
        } );
        if ( response.status == false && response.error !== '' ) {
            AlertComponent.getAlertMessage( { 'title': 'Error!', 'message': response.message, 'type': 'danger' } );
        } else if ( response.status == false && response.message !== '' ) {
            AlertComponent.getAlertMessage( { 'title': 'Warning!', 'message': response.message, 'type': 'warning' } );
        } else {
            populateTrialBalanceReport( response.data );
        }
    };
    const populateTrialBalanceReport = ( data ) => {
        const th       = $( '#general-head-template' ).html();
        const tdDetail = $( '#voucher-item-template' ).html();
        var template   = Handlebars.compile( th );
        var html       = template( {} );
        $( '.dthead' ).html( html );

        const saleRows = $( '#saleRows' );
        let $serial    = 1;

        let $serialLevel1 = 0;
        let $serialLevel2 = 0;
        let $serialLevel3 = 0;

        let $totalOpeningDebit  = 0.00;
        let $totalOpeningCredit = 0.00;

        let $totalDuringDebit  = 0.00;
        let $totalDuringCredit = 0.00;

        let $totalClosingDebit  = 0.00;
        let $totalClosingCredit = 0.00;

        let $totalOpeningDebitLevel1  = 0.00;
        let $totalOpeningCreditLevel1 = 0.00;
        let $totalDuringDebitLevel1   = 0.00;
        let $totalDuringCreditLevel1  = 0.00;
        let $totalClosingDebitLevel1  = 0.00;
        let $totalClosingCreditLevel1 = 0.00;


        let $totalOpeningDebitLevel2  = 0.00;
        let $totalOpeningCreditLevel2 = 0.00;
        let $totalDuringDebitLevel2   = 0.00;
        let $totalDuringCreditLevel2  = 0.00;
        let $totalClosingDebitLevel2  = 0.00;
        let $totalClosingCreditLevel2 = 0.00;

        let $totalOpeningDebitLevel3  = 0.00;
        let $totalOpeningCreditLevel3 = 0.00;
        let $totalDuringDebitLevel3   = 0.00;
        let $totalDuringCreditLevel3  = 0.00;
        let $totalClosingDebitLevel3  = 0.00;
        let $totalClosingCreditLevel3 = 0.00;


        let $level1Name = '';
        let $level2Name = '';
        let $level3Name = '';

        var $level1Id = '';
        var $level2Id = '';
        var $level3Id = '';
        $.each( data, function( index, $row ) {
            if ( $level1Id != $row.l1 ) {
                if ( $level3Id != $row.l3 ) {
                    if ( $serialLevel3 !== 0 ) {
                        const sourceLevel3 = $( '#voucher-level3-sum-template' ).html();
                        const template     = Handlebars.compile( sourceLevel3 );
                        const htmlLevel3   = template( {
                            totalOpeningDebitLevel3 : parseFloat( $totalOpeningDebitLevel3 ).toFixed( AMOUNT_ROUNDING ),
                            totalOpeningCreditLevel3: parseFloat( $totalOpeningCreditLevel3 ).toFixed( AMOUNT_ROUNDING ),
                            totalDuringDebitLevel3  : parseFloat( $totalDuringDebitLevel3 ).toFixed( AMOUNT_ROUNDING ),
                            totalDuringCreditLevel3 : parseFloat( $totalDuringCreditLevel3 ).toFixed( AMOUNT_ROUNDING ),
                            totalClosingDebitLevel3 : parseFloat( $totalClosingDebitLevel3 ).toFixed( AMOUNT_ROUNDING ),
                            totalClosingCreditLevel3: parseFloat( $totalClosingCreditLevel3 ).toFixed( AMOUNT_ROUNDING ),
                            level3Name              : $level3Name,
                            'TOTAL_HEAD'            : `${ $level3Name } TOTAL`,
                        } );
                        saleRows.append( htmlLevel3 );

                        $totalOpeningDebitLevel3  = 0.00;
                        $totalOpeningCreditLevel3 = 0.00;
                        $totalDuringDebitLevel3   = 0.00;
                        $totalDuringCreditLevel3  = 0.00;
                        $totalClosingDebitLevel3  = 0.00;
                        $totalClosingCreditLevel3 = 0.00;

                        $serialLevel3 = 0;
                    }
                }

                if ( $level2Id != $row.l2 ) {
                    if ( $serialLevel2 !== 0 ) {
                        const sourceLevel2   = $( '#voucher-level2-sum-template' ).html();
                        const templateLevel2 = Handlebars.compile( sourceLevel2 );
                        const htmlLevel2     = templateLevel2( {
                            totalOpeningDebitLevel2 : parseFloat( $totalOpeningDebitLevel2 ).toFixed( AMOUNT_ROUNDING ),
                            totalOpeningCreditLevel2: parseFloat( $totalOpeningCreditLevel2 ).toFixed( AMOUNT_ROUNDING ),
                            totalDuringDebitLevel2  : parseFloat( $totalDuringDebitLevel2 ).toFixed( AMOUNT_ROUNDING ),
                            totalDuringCreditLevel2 : parseFloat( $totalDuringCreditLevel2 ).toFixed( AMOUNT_ROUNDING ),
                            totalClosingDebitLevel2 : parseFloat( $totalClosingDebitLevel2 ).toFixed( AMOUNT_ROUNDING ),
                            totalClosingCreditLevel2: parseFloat( $totalClosingCreditLevel2 ).toFixed( AMOUNT_ROUNDING ),
                            level2Name              : $level2Name,
                            'TOTAL_HEAD'            : `${ $level2Name } TOTAL`,
                        } );
                        saleRows.append( htmlLevel2 );

                        $totalOpeningDebitLevel2  = 0.00;
                        $totalOpeningCreditLevel2 = 0.00;
                        $totalDuringDebitLevel2   = 0.00;
                        $totalDuringCreditLevel2  = 0.00;
                        $totalClosingDebitLevel2  = 0.00;
                        $totalClosingCreditLevel2 = 0.00;
                        $serialLevel2             = 0;
                    }
                }
                if ( $serialLevel1 !== 0 ) {
                    const sourceLevel1   = $( '#voucher-level1-sum-template' ).html();
                    const templateLevel1 = Handlebars.compile( sourceLevel1 );
                    const htmlLevel1     = templateLevel1( {
                        totalOpeningDebitLevel1 : parseFloat( $totalOpeningDebitLevel1 ).toFixed( AMOUNT_ROUNDING ),
                        totalOpeningCreditLevel1: parseFloat( $totalOpeningCreditLevel1 ).toFixed( AMOUNT_ROUNDING ),
                        totalDuringDebitLevel1  : parseFloat( $totalDuringDebitLevel1 ).toFixed( AMOUNT_ROUNDING ),
                        totalDuringCreditLevel1 : parseFloat( $totalDuringCreditLevel1 ).toFixed( AMOUNT_ROUNDING ),
                        totalClosingDebitLevel1 : parseFloat( $totalClosingDebitLevel1 ).toFixed( AMOUNT_ROUNDING ),
                        totalClosingCreditLevel1: parseFloat( $totalClosingCreditLevel1 ).toFixed( AMOUNT_ROUNDING ),
                        level1Name              : $level1Name,
                        'TOTAL_HEAD'            : `${ $level1Name } TOTAL`,
                    } );
                    saleRows.append( htmlLevel1 );

                    $totalOpeningDebitLevel1  = 0.00;
                    $totalOpeningCreditLevel1 = 0.00;
                    $totalDuringDebitLevel1   = 0.00;
                    $totalDuringCreditLevel1  = 0.00;
                    $totalClosingDebitLevel1  = 0.00;
                    $totalClosingCreditLevel1 = 0.00;
                    $serialLevel1             = 0;
                }


                const sourceLevel1Group = $( '#voucher-level1-name-template' ).html();
                const template          = Handlebars.compile( sourceLevel1Group );
                const htmlLevel1Group   = template( {
                    LEVEL1ID  : $row.account_id.substr( 0, 2 ),
                    LEVEL1NAME: $row.l1_name,
                } );
                saleRows.append( htmlLevel1Group );
                $level1Id   = $row.l1;
                $level1Name = $row.l1_name;

            }


            if ( $level2Id != $row.l2 ) {

                if ( $level3Id != $row.l3 ) {
                    if ( $serialLevel3 !== 0 ) {
                        const sourceLevel3   = $( '#voucher-level3-sum-template' ).html();
                        const templateLevel3 = Handlebars.compile( sourceLevel3 );
                        const htmlLevel3     = templateLevel3( {
                            totalOpeningDebitLevel3 : parseFloat( $totalOpeningDebitLevel3 ).toFixed( AMOUNT_ROUNDING ),
                            totalOpeningCreditLevel3: parseFloat( $totalOpeningCreditLevel3 ).toFixed( AMOUNT_ROUNDING ),
                            totalDuringDebitLevel3  : parseFloat( $totalDuringDebitLevel3 ).toFixed( AMOUNT_ROUNDING ),
                            totalDuringCreditLevel3 : parseFloat( $totalDuringCreditLevel3 ).toFixed( AMOUNT_ROUNDING ),
                            totalClosingDebitLevel3 : parseFloat( $totalClosingDebitLevel3 ).toFixed( AMOUNT_ROUNDING ),
                            totalClosingCreditLevel3: parseFloat( $totalClosingCreditLevel3 ).toFixed( AMOUNT_ROUNDING ),
                            level3Name              : $level3Name,
                            'TOTAL_HEAD'            : `${ $level3Name } TOTAL`,
                        } );
                        saleRows.append( htmlLevel3 );

                        $totalOpeningDebitLevel3  = 0;
                        $totalOpeningCreditLevel3 = 0;
                        $totalDuringDebitLevel3   = 0;
                        $totalDuringCreditLevel3  = 0;
                        $totalClosingDebitLevel3  = 0;
                        $totalClosingCreditLevel3 = 0;
                        $serialLevel3             = 0;
                    }
                }

                if ( $serialLevel2 !== 0 ) {

                    const sourceLevel2   = $( '#voucher-level2-sum-template' ).html();
                    const templateLevel2 = Handlebars.compile( sourceLevel2 );
                    const htmlLevel2     = templateLevel2( {
                        totalOpeningDebitLevel2 : parseFloat( $totalOpeningDebitLevel2 ).toFixed( AMOUNT_ROUNDING ),
                        totalOpeningCreditLevel2: parseFloat( $totalOpeningCreditLevel2 ).toFixed( AMOUNT_ROUNDING ),
                        totalDuringDebitLevel2  : parseFloat( $totalDuringDebitLevel2 ).toFixed( AMOUNT_ROUNDING ),
                        totalDuringCreditLevel2 : parseFloat( $totalDuringCreditLevel2 ).toFixed( AMOUNT_ROUNDING ),
                        totalClosingDebitLevel2 : parseFloat( $totalClosingDebitLevel2 ).toFixed( AMOUNT_ROUNDING ),
                        totalClosingCreditLevel2: parseFloat( $totalClosingCreditLevel2 ).toFixed( AMOUNT_ROUNDING ),
                        level2Name              : $level2Name,
                        'TOTAL_HEAD'            : `${ $level2Name } TOTAL`,
                    } );
                    saleRows.append( htmlLevel2 );

                    $totalOpeningDebitLevel2  = 0;
                    $totalOpeningCreditLevel2 = 0;
                    $totalDuringDebitLevel2   = 0;
                    $totalDuringCreditLevel2  = 0;
                    $totalClosingDebitLevel2  = 0;
                    $totalClosingCreditLevel2 = 0;
                    $serialLevel2             = 0;
                }

                const sourceLevel2Group   = $( '#voucher-level2-name-template' ).html();
                const templateLevel2Group = Handlebars.compile( sourceLevel2Group );
                const htmlLevel2Group     = templateLevel2Group( {
                    LEVEL2ID  : $row.account_id.substr( 0, 5 ),
                    LEVEL2NAME: $row.l2_name,
                } );
                saleRows.append( htmlLevel2Group );
                $level2Id   = $row.l2;
                $level2Name = $row.l2_name;
            }

            if ( $level3Id != $row.l3 ) {
                if ( $serialLevel3 !== 0 ) {

                    const sourceLevel3   = $( '#voucher-level3-sum-template' ).html();
                    const templateLevel3 = Handlebars.compile( sourceLevel3 );
                    const htmlLevel3     = templateLevel3( {
                        totalOpeningDebitLevel3 : parseFloat( $totalOpeningDebitLevel3 ).toFixed( AMOUNT_ROUNDING ),
                        totalOpeningCreditLevel3: parseFloat( $totalOpeningCreditLevel3 ).toFixed( AMOUNT_ROUNDING ),
                        totalDuringDebitLevel3  : parseFloat( $totalDuringDebitLevel3 ).toFixed( AMOUNT_ROUNDING ),
                        totalDuringCreditLevel3 : parseFloat( $totalDuringCreditLevel3 ).toFixed( AMOUNT_ROUNDING ),
                        totalClosingDebitLevel3 : parseFloat( $totalClosingDebitLevel3 ).toFixed( AMOUNT_ROUNDING ),
                        totalClosingCreditLevel3: parseFloat( $totalClosingCreditLevel3 ).toFixed( AMOUNT_ROUNDING ),
                        level3Name              : $level3Name,
                        'TOTAL_HEAD'            : `${ $level3Name } TOTAL`,
                    } );
                    saleRows.append( htmlLevel3 );

                    $totalOpeningDebitLevel3  = 0;
                    $totalOpeningCreditLevel3 = 0;
                    $totalDuringDebitLevel3   = 0;
                    $totalDuringCreditLevel3  = 0;
                    $totalClosingDebitLevel3  = 0;
                    $totalClosingCreditLevel3 = 0;

                    $serialLevel3 = 0;
                }
                const sourceLevel3Group   = $( '#voucher-level3-name-template' ).html();
                const templateLevel3Group = Handlebars.compile( sourceLevel3Group );
                const htmlLevel3Group     = templateLevel3Group( {
                    LEVEL3ID  : $row.account_id.substr( 0, 8 ),
                    LEVEL3NAME: $row.l3_name,
                } );
                saleRows.append( htmlLevel3Group );

                $level3Id   = $row.l3;
                $level3Name = $row.l3_name;
            }

            const obj = {};

            const openingBalanceDebit  = ($row.openingBalance && $row.openingBalance > 0) ? $row.openingBalance : 0;
            const openingBalanceCredit = ($row.openingBalance && $row.openingBalance < 0) ? Math.abs( $row.openingBalance ) : 0;

            const closingBalanceDebit  = (parseNumber( $row.openingBalance ) + parseNumber( $row.closingBalance ) > 0) ? parseNumber( $row.openingBalance ) + parseNumber( $row.closingBalance ) : 0;
            const closingBalanceCredit = (parseNumber( $row.openingBalance ) + parseNumber( $row.closingBalance ) < 0) ? Math.abs( parseNumber( $row.openingBalance ) + parseNumber( $row.closingBalance ) ) : 0;

            obj.accountId     = ($row.account_id) ? $row.account_id : 'Not Available';
            obj.accountName   = ($row.party_name) ? $row.party_name : 'Not Available';
            obj.accountPId    = ($row.pid) ? $row.pid : 'Not Available';
            obj.openingDebit  = parseNumber( openingBalanceDebit ).toFixed( AMOUNT_ROUNDING );
            obj.openingCredit = parseNumber( openingBalanceCredit ).toFixed( AMOUNT_ROUNDING );
            obj.duringDebit   = ($row.debit !== 0) ? parseNumber( $row.debit ).toFixed( AMOUNT_ROUNDING ) : 0;
            obj.duringCredit  = ($row.credit !== 0) ? parseNumber( $row.credit ).toFixed( AMOUNT_ROUNDING ) : 0;
            obj.closingDebit  = parseNumber( closingBalanceDebit ).toFixed( AMOUNT_ROUNDING );
            obj.closingCredit = parseNumber( closingBalanceCredit ).toFixed( AMOUNT_ROUNDING );

            var source   = tdDetail;
            var template = Handlebars.compile( source );
            var html     = template( obj );
            saleRows.append( html );


            $totalOpeningDebit += ($row.openingBalance && $row.openingBalance > 0) ? parseNumber( $row.openingBalance ) : 0;
            $totalOpeningCredit += ($row.openingBalance && $row.openingBalance < 0) ? parseNumber( Math.abs( $row.openingBalance ) ) : 0;

            $totalDuringDebit += ($row.debit !== 0) ? parseNumber( $row.debit ) : 0;
            $totalDuringCredit += ($row.credit !== 0) ? parseNumber( $row.credit ) : 0;

            $totalClosingDebit += closingBalanceDebit;
            $totalClosingCredit += closingBalanceCredit;

            $totalOpeningDebitLevel1 += ($row.openingBalance && $row.openingBalance > 0) ? parseNumber( $row.openingBalance ) : 0;
            $totalOpeningCreditLevel1 += ($row.openingBalance && $row.openingBalance < 0) ? parseNumber( Math.abs( $row.openingBalance ) ) : 0;
            $totalDuringDebitLevel1 += ($row.debit !== 0) ? parseNumber( $row.debit ) : 0;
            $totalDuringCreditLevel1 += ($row.credit !== 0) ? parseNumber( $row.credit ) : 0;
            $totalClosingDebitLevel1 += closingBalanceDebit;
            $totalClosingCreditLevel1 += closingBalanceCredit;


            $totalOpeningDebitLevel2 += ($row.openingBalance && $row.openingBalance > 0) ? parseNumber( $row.openingBalance ) : 0;
            $totalOpeningCreditLevel2 += ($row.openingBalance && $row.openingBalance < 0) ? parseNumber( Math.abs( $row.openingBalance ) ) : 0;
            $totalDuringDebitLevel2 += ($row.debit !== 0) ? parseNumber( $row.debit ) : 0;
            $totalDuringCreditLevel2 += ($row.credit !== 0) ? parseNumber( $row.credit ) : 0;
            $totalClosingDebitLevel2 += closingBalanceDebit;
            $totalClosingCreditLevel2 += closingBalanceCredit;

            $totalOpeningDebitLevel3 += ($row.openingBalance && $row.openingBalance > 0) ? parseNumber( $row.openingBalance ) : 0;
            $totalOpeningCreditLevel3 += ($row.openingBalance && $row.openingBalance < 0) ? parseNumber( Math.abs( $row.openingBalance ) ) : 0;
            $totalDuringDebitLevel3 += ($row.debit !== 0) ? parseNumber( $row.debit ) : 0;
            $totalDuringCreditLevel3 += ($row.credit !== 0) ? parseNumber( $row.credit ) : 0;
            $totalClosingDebitLevel3 += closingBalanceDebit;
            $totalClosingCreditLevel3 += closingBalanceCredit;

            $serialLevel1 += 1;
            $serialLevel2 += 1;
            $serialLevel3 += 1;


            // each loop
        } );

        if ( $serialLevel3 !== 0 ) {
            var sourcel3 = $( '#voucher-level3-sum-template' ).html();
            var template = Handlebars.compile( sourcel3 );
            var htmll3   = template( {
                totalOpeningDebitLevel3 : parseFloat( $totalOpeningDebitLevel3 ).toFixed( AMOUNT_ROUNDING ),
                totalOpeningCreditLevel3: parseFloat( $totalOpeningCreditLevel3 ).toFixed( AMOUNT_ROUNDING ),
                totalDuringDebitLevel3  : parseFloat( $totalDuringDebitLevel3 ).toFixed( AMOUNT_ROUNDING ),
                totalDuringCreditLevel3 : parseFloat( $totalDuringCreditLevel3 ).toFixed( AMOUNT_ROUNDING ),
                totalClosingDebitLevel3 : parseFloat( $totalClosingDebitLevel3 ).toFixed( AMOUNT_ROUNDING ),
                totalClosingCreditLevel3: parseFloat( $totalClosingCreditLevel3 ).toFixed( AMOUNT_ROUNDING ),
                level3Name              : $level3Name,
                'TOTAL_HEAD'            : `${ $level3Name } TOTAL`,
            } );
            saleRows.append( htmll3 );

            $totalOpeningDebitLevel3  = 0;
            $totalOpeningCreditLevel3 = 0;
            $totalDuringDebitLevel3   = 0;
            $totalDuringCreditLevel3  = 0;
            $totalClosingDebitLevel3  = 0;
            $totalClosingCreditLevel3 = 0;
            $serialLevel3             = 0;
        }

        if ( $serialLevel2 !== 0 ) {

            var sourcel2 = $( '#voucher-level2-sum-template' ).html();
            var template = Handlebars.compile( sourcel2 );
            var htmll2   = template( {
                totalOpeningDebitLevel2 : parseFloat( $totalOpeningDebitLevel2 ).toFixed( AMOUNT_ROUNDING ),
                totalOpeningCreditLevel2: parseFloat( $totalOpeningCreditLevel2 ).toFixed( AMOUNT_ROUNDING ),
                totalDuringDebitLevel2  : parseFloat( $totalDuringDebitLevel2 ).toFixed( AMOUNT_ROUNDING ),
                totalDuringCreditLevel2 : parseFloat( $totalDuringCreditLevel2 ).toFixed( AMOUNT_ROUNDING ),
                totalClosingDebitLevel2 : parseFloat( $totalClosingDebitLevel2 ).toFixed( AMOUNT_ROUNDING ),
                totalClosingCreditLevel2: parseFloat( $totalClosingCreditLevel2 ).toFixed( AMOUNT_ROUNDING ),
                level2Name              : $level2Name,
                'TOTAL_HEAD'            : `${ $level2Name } TOTAL`,
            } );
            saleRows.append( htmll2 );

            $totalOpeningDebitLevel2  = 0;
            $totalOpeningCreditLevel2 = 0;
            $totalDuringDebitLevel2   = 0;
            $totalDuringCreditLevel2  = 0;
            $totalClosingDebitLevel2  = 0;
            $totalClosingCreditLevel2 = 0;

            $serialLevel2 = 0;
        }
        if ( $serialLevel1 !== 0 ) {

            var sourcel1 = $( '#voucher-level1-sum-template' ).html();
            var template = Handlebars.compile( sourcel1 );
            var htmll1   = template( {
                totalOpeningDebitLevel1 : parseFloat( $totalOpeningDebitLevel1 ).toFixed( AMOUNT_ROUNDING ),
                totalOpeningCreditLevel1: parseFloat( $totalOpeningCreditLevel1 ).toFixed( AMOUNT_ROUNDING ),
                totalDuringDebitLevel1  : parseFloat( $totalDuringDebitLevel1 ).toFixed( AMOUNT_ROUNDING ),
                totalDuringCreditLevel1 : parseFloat( $totalDuringCreditLevel1 ).toFixed( AMOUNT_ROUNDING ),
                totalClosingDebitLevel1 : parseFloat( $totalClosingDebitLevel1 ).toFixed( AMOUNT_ROUNDING ),
                totalClosingCreditLevel1: parseFloat( $totalClosingCreditLevel1 ).toFixed( AMOUNT_ROUNDING ),
                level1Name              : $level1Name,
                'TOTAL_HEAD'            : `${ $level1Name } TOTAL`,
            } );
            saleRows.append( htmll1 );

            $totalOpeningDebitLevel1  = 0;
            $totalOpeningCreditLevel1 = 0;
            $totalDuringDebitLevel1   = 0;
            $totalDuringCreditLevel1  = 0;
            $totalClosingDebitLevel1  = 0;
            $totalClosingCreditLevel1 = 0;

            $serialLevel1 = 0;
        }


        var sourcel1 = $( '#voucher-grand-sum-template' ).html();
        var template = Handlebars.compile( sourcel1 );
        var htmll1   = template( {
            totalOpeningDebit : parseFloat( $totalOpeningDebit ).toFixed( AMOUNT_ROUNDING ),
            totalOpeningCredit: parseFloat( $totalOpeningCredit ).toFixed( AMOUNT_ROUNDING ),
            totalDuringDebit  : parseFloat( $totalDuringDebit ).toFixed( AMOUNT_ROUNDING ),
            totalDuringCredit : parseFloat( $totalDuringCredit ).toFixed( AMOUNT_ROUNDING ),
            totalClosingDebit : parseFloat( $totalClosingDebit ).toFixed( AMOUNT_ROUNDING ),
            totalClosingCredit: parseFloat( $totalClosingCredit ).toFixed( AMOUNT_ROUNDING ),
            'TOTAL_HEAD'      : 'GRAND TOTAL',
        } );
        saleRows.append( htmll1 );
        trialBalanceBindGrid();
        $( 'td.text-right' ).digits();

    };
    $.fn.digits                      = function() {
        return this.each( function() {
            $( this ).text( $( this ).text().replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' ) );
        } );
    };
    var trialBalanceBindGrid         = function( type = 'D' ) {
        const isSummaryReport = type.toLocaleLowerCase() === 'summary report';
        const bPaginate       = !isSummaryReport; // Disable pagination for 'Summary Report'

        trialBalance.trialBalanceDataTable = $( '#trialBalanceDataTable' ).dataTable( {
            processing       : true,
            'sDom'           : '<if<t>lp>',
            'bPaginate'      : bPaginate,
            'bFilter'        : bPaginate,
            'autoWidth'      : false,
            'fixedHeader'    : true,
            'sPaginationType': 'full_numbers',
            'bJQueryUI'      : false,
            'bSort'          : false,
            'iDisplayLength' : 100,
            'oTableTools'    : {
                'sSwfPath': 'js/copy_cvs_xls_pdf.swf',
                'aButtons': [ {
                    'sExtends'   : 'print',
                    'sButtonText': 'Print Report',
                    'sMessage'   : 'Inventory Report',
                } ],
            },
            'columns'        : [
                { 'title': 'Id' },
                { 'title': 'Account', 'colspan': 2 },
                { 'title': 'Debit', 'className': 'text-right' },
                { 'title': 'Credit', 'className': 'text-right' },
                { 'title': 'Debit', 'className': 'text-right' },
                { 'title': 'Credit', 'className': 'text-right' },
                { 'title': 'Debit', 'className': 'text-right' },
                { 'title': 'Credit', 'className': 'text-right' },
            ],
            buttons          : [
                {
                    extend       : 'copyHtml5',
                    className    : 'btn btn-outline-secondary btn-copy-excel',
                    text         : 'F3 Copy to clipboard',
                    titleAttr    : 'Copy to clipboard',
                    exportOptions: { rows: ':visible' },
                },
                {
                    extend       : 'excelHtml5',
                    className    : 'btn btn-outline-info btn-export-excel',
                    text         : 'F8 Excel',
                    titleAttr    : 'Export to Excel',
                    exportOptions: { rows: ':visible' },
                },
            ],
            'dom'            : '<\'row\' <\'col-md-12\'B>><\'row\'<\'col-md-6 col-sm-12\'l><\'col-md-6 col-sm-12\'f>r><\'table-scrollable\'t><\'row\'<\'col-md-5 col-sm-12\'i><\'col-md-7 col-sm-12\'p>>',
        } );
        $( '.nav-light > a.tool-action' ).off( 'click' ).on( 'click', function( e, index ) {
            var action = $( this ).attr( 'data-action' );
            trialBalance.trialBalanceDataTable.DataTable().button( action ).trigger( 'click' );
        } );
    };
    const printTrialBalance          = () => {
        const hasMultipleTableRows = $( '#trialBalanceDataTable tbody tr' ).length > 0;
        if ( !hasMultipleTableRows ) {
            AlertComponent.getAlertMessage( {
                title  : 'Error',
                message: 'Please search for data before issuing a print command.',
                type   : 'danger',
            } );
            return;
        }
        const startDate     = $( '#from_date' ).val();
        const endDate       = $( '#to_date' ).val();
        const levelId       = $( '#drpLevel1' ).val() || 0;
        const level2Id      = $( '#drpLevel2' ).val() || 0;
        const level3Id      = $( '#drpLevel3' ).val() || 0;
        const criteriaText  = reportComponent.getCriteriaText() || -1;
        const windowOpenURL = `${ base_url }/doc/getTrialBalanceSixColumn/?startDate=${ startDate }&endDate=${ endDate }&levelId=${ levelId }&level2Id=${ level2Id }&level3Id=${ level3Id }&criteriaText=${ criteriaText.Include }`;
        openPrintOnSettingConfiguration( windowOpenURL );
    };
    return {

        init: function() {
            this.bindUI();
            $( '.select2' ).select2();
            $( '#btnResetfilters' ).trigger( 'click' );
        },

        bindUI: function() {
            const self                   = this;
            const financialYearStartDate = $( '#sdate' ).val();
            const financialYearEndDate   = $( '#edate' ).val();

            $( '#from_date' ).val( financialYearStartDate );
            $( '#to_date' ).val( financialYearEndDate );

            $( '.btnSearch' ).on( 'click', function( e ) {
                e.preventDefault();
                self.initSearch();
            } );
            $( '.btnPrint' ).on( 'click', function( e ) {
                e.preventDefault();
                printTrialBalance();
            } );
            $( '#drpLevel3' ).on( 'change', function() {
                $( '#drpLevel1' ).val( $( '#drpLevel3 option:selected' ).data( 'l1' ) ).trigger( 'change.select2' );
                $( '#drpLevel2' ).val( $( '#drpLevel3 option:selected' ).data( 'l2' ) ).trigger( 'change.select2' );
            } );
            $( '#drpLevel2' ).on( 'change', function() {
                $( '#drpLevel1' ).val( $( '#drpLevel2 option:selected' ).data( 'l1' ) ).trigger( 'change.select2' );
                $( '#drpLevel3' ).val( '' ).trigger( 'change.select2' );
            } );
            $( '#drpLevel1' ).on( 'change', function() {
                $( '#drpLevel2' ).val( '' ).trigger( 'change.select2' );
                $( '#drpLevel3' ).val( '' ).trigger( 'change.select2' );
            } );

            $( '#btnResetfilters' ).on( 'click', function( e ) {
                e.preventDefault();
                $( '#drpLevel1' ).val( '' ).trigger( 'change.select2' );
                $( '#drpLevel2' ).val( '' ).trigger( 'change.select2' );
                $( '#drpLevel3' ).val( '' ).trigger( 'change.select2' );
            } );
            $( '.btnReset' ).on( 'click', function( e ) {

                self.resetVoucher();
            } );
            $( 'body' ).on( 'click', '.btnEditPrevVoucher', function( e ) {
                e.preventDefault();
                const accountId = $( this ).closest( 'tr' ).find( 'td.PARTY_ID' ).data( 'account_id' );
                const url       = `${ base_url }/accountLedger?account_id=${ accountId }`;
                window.open( url, '_blank' ).focus();
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

            shortcut.add( 'F9', function() {
                $( '.btnPrint' ).get()[0].click();
            } );
            shortcut.add( 'F6', function() {
                self.initSearch();
            } );
            shortcut.add( 'F5', function() {
                self.resetVoucher();
            } );

        },

        initSearch: function() {

            const startDate = $( '#from_date' ).val();
            const endDate   = $( '#to_date' ).val();
            const levelId   = $( '#drpLevel1' ).val() || null;
            const level2Id  = $( '#drpLevel2' ).val() || null;
            const level3Id  = $( '#drpLevel3' ).val() || null;
            getTrialBalanceReport( startDate, endDate, levelId, level2Id, level3Id );
        },

        // resets the voucher to its default state
        resetVoucher: function() {
            general.reloadWindow();
        },
    };

};

const trialBalance = new TrialBalance();
trialBalance.init();
