import AlertComponent from '../../../../js/components/AlertComponent.js';
import { AMOUNT_ROUNDING } from '../../../../js/components/GlobalConstants.js';
import { apiURL } from '../../../../js/components/GlobalUrl.js';
import { makeAjaxRequest } from '../../../../js/components/MakeAjaxRequest.js';
import {
    clearValueAndText,
    disableButton, doLoading,
    enableDisableButton, isPreviousBalance,
    parseNumber,
    setFinancialYearDate,
    updateDatepickerWithFormattedDate,
    updateDateRangeCurrentDay,
    updateDateRangeToCurrentMonth,
    updateDateRangeToCurrentWeek,
    updateFormattedDate,
} from '../commonFunctions/CommonFunction.js';

const SalarySheetPermanent = function() {

    const salarySheetPermanentTable     = $( '#tblSalarySheetPermanent' );
    const salarySheetPermanentTableBody = salarySheetPermanentTable.find( 'tbody' );

    /**
     * Initializes the grand salary group with default values.
     *
     * This function returns an object representing the grand salary group,
     * with all financial fields initialized to zero.
     *
     * @returns {Object} An object containing the initialized grand salary group.
     */
    const initializeGrandSalaryGroup = () => {
        return {
            totalCaption       : 'Grand Total:',
            totalBasicSalary   : 0,
            totalOverTimeAmount: 0,
            totalGrossSalary   : 0,
            totalIncentive     : 0,
            totalAdvance       : 0,
            totalPenalty       : 0,
            totalLoanDeduction : 0,
            totalEobi          : 0,
            totalInsurance     : 0,
            totalSocialSecurity: 0,
            totalNetSalary     : 0,
        };
    };

    /**
     * Initializes the total salary group with default values.
     *
     * This function returns an object representing the total salary group,
     * with all financial fields initialized to zero.
     *
     * @returns {Object} An object containing the initialized total salary group.
     */
    const initializeTotalSalaryGroup = () => {
        return {
            totalCaption       : 'Total:',
            totalBasicSalary   : 0,
            totalOverTimeAmount: 0,
            totalGrossSalary   : 0,
            totalIncentive     : 0,
            totalAdvance       : 0,
            totalPenalty       : 0,
            totalLoanDeduction : 0,
            totalEobi          : 0,
            totalInsurance     : 0,
            totalSocialSecurity: 0,
            totalNetSalary     : 0,
        };
    };


    /**
     * Creates a group row for the salary sheet table.
     *
     * This function generates an HTML string for a group row, which includes the department name
     * and a specified number of hidden columns.
     *
     * @param {string} departmentName - The name of the department to display in the group row.
     * @returns {string} The HTML string for the group row.
     */
    const createGroupRow = ( departmentName ) => {
        const hiddenColumnsCount = 25; // Number of d-none columns, adjust as needed
        const hiddenColumns      = new Array( hiddenColumnsCount ).fill( '<td class="d-none"></td>' ).join( '' );
        return `
    <tr class="group bg-gray-100 font-weight-bold">
        <td class="text-left text-md px-2 py-2 align-middle" colspan="26">${ departmentName }</td>
        ${ hiddenColumns }
    </tr>
    `;
    };

    /**
     * Creates a table row for an individual salary sheet entry.
     *
     * This function generates an HTML string for a table row, which includes various financial
     * and personal details of a staff member.
     *
     * @param {Object} item - The salary sheet entry data.
     * @param {number} index - The index of the row.
     * @returns {string} The HTML string for the table row.
     */
    const createTableRow = ( item, index ) => {
        const isNetSalaryNegative = item.net_salary < 0;
        const rowClasses          = isNetSalaryNegative ? 'bg-danger' : '';
        const textClasses         = isNetSalaryNegative ? 'text-white' : '';

        return `
        <tr class="group item-row-td hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50 ${ rowClasses }">
            <td class="${ textClasses } text-center sr-no">${ index }</td>
            <td class="${ textClasses } text-left text-md py-1 px-1 align-middle departmentName" data-department_id="${ item.staff.staff_department.id }">${ item.staff.staff_department.name }</td>
            <td class="${ textClasses } text-left text-md py-1 px-1 align-middle staffName" data-staff_id="${ item.staff.id }">${ item.staff.name }</td>
            <td class="${ textClasses } text-left text-md py-1 px-1 align-middle designationName" data-designation_id="${ item.staff.staff_designation.id }">${ item.staff.staff_designation.name }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle basicSalary">${ parseNumber( item.basic_salary ).toFixed( AMOUNT_ROUNDING ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle absents">${ parseNumber( item.absents ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle paidLeaves">${ parseNumber( item.paid_leaves ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle gustedHolidays">${ parseNumber( item.gusted_holidays ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle outdoors">${ parseNumber( item.outdoors ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle shortLeaves">${ parseNumber( item.short_leaves ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle restDays">${ parseNumber( item.rest_days ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle workDays">${ parseNumber( item.work_days ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle paidDays">${ parseNumber( item.paid_days ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle otHours">${ parseNumber( item.ot_hours ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle otRate">${ parseNumber( item.ot_rate ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle otAmount">${ parseNumber( item.ot_amount ).toFixed( AMOUNT_ROUNDING ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle grossSalary">${ parseNumber( item.gross_salary ).toFixed( AMOUNT_ROUNDING ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle incentive">${ parseNumber( item.incentive ).toFixed( AMOUNT_ROUNDING ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle advance">${ parseNumber( item.advance ).toFixed( AMOUNT_ROUNDING ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle penalty">${ parseNumber( item.penalty ).toFixed( AMOUNT_ROUNDING ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle loanBalance">${ parseNumber( item.loan_balance ).toFixed( AMOUNT_ROUNDING ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle loanDeduction"><input type="text" class="form-control form-input-class is_numeric text-right w-20 h-8 float-right loanDeduction" value="${ item.loan_deduction }"></td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle eobi">${ parseNumber( item.eobi ).toFixed( AMOUNT_ROUNDING ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle insurance">${ parseNumber( item.insurance ).toFixed( AMOUNT_ROUNDING ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle socialSecurity">${ parseNumber( item.social_security ).toFixed( AMOUNT_ROUNDING ) }</td>
            <td class="${ textClasses } text-right text-md py-1 px-1 align-middle netSalary">${ parseNumber( item.net_salary ).toFixed( AMOUNT_ROUNDING ) }</td>
        </tr>
    `;
    };

    /**
     * Creates a total row for the salary sheet table.
     *
     * This function generates an HTML string for a total row, which includes the aggregated
     * financial data for a group or the entire salary sheet.
     *
     * @param {Object} row - The aggregated financial data.
     * @returns {string} The HTML string for the total row.
     */
    const createTotalRow = ( row ) => {
        const hiddenColumnsCount = 14; // Number of d-none columns, adjust as needed

        const hiddenColumns = new Array( hiddenColumnsCount ).fill( '<td class="d-none"></td>' ).join( '' );
        const totalTdClass  = `py-1 px-1 text-md text-right text-uppercase text-black font-weight-bold`;
        return `
    <tr class="group odd:bg-orange-500 even:bg-orange-500 py-1 px-1 font-bold">
        <td class="${ totalTdClass }" colspan="4">${ row.totalCaption }</td>
        <td class="${ totalTdClass }">${ parseNumber( row.totalBasicSalary ).toFixed( AMOUNT_ROUNDING ) }</td>
        <td colspan="10"></td>
        <td class="${ totalTdClass }">${ parseNumber( row.totalOverTimeAmount ).toFixed( AMOUNT_ROUNDING ) }</td>
        <td class="${ totalTdClass }">${ parseNumber( row.totalGrossSalary ).toFixed( AMOUNT_ROUNDING ) }</td>
        <td class="${ totalTdClass }">${ parseNumber( row.totalIncentive ).toFixed( AMOUNT_ROUNDING ) }</td>
        <td class="${ totalTdClass }">${ parseNumber( row.totalAdvance ).toFixed( AMOUNT_ROUNDING ) }</td>
        <td class="${ totalTdClass }">${ parseNumber( row.totalPenalty ).toFixed( AMOUNT_ROUNDING ) }</td>
        <td></td>
        <td class="${ totalTdClass }">${ parseNumber( row.totalLoanDeduction ).toFixed( AMOUNT_ROUNDING ) }</td>
        <td class="${ totalTdClass }">${ parseNumber( row.totalEobi ).toFixed( AMOUNT_ROUNDING ) }</td>
        <td class="${ totalTdClass }">${ parseNumber( row.totalInsurance ).toFixed( AMOUNT_ROUNDING ) }</td>
        <td class="${ totalTdClass }">${ parseNumber( row.totalSocialSecurity ).toFixed( AMOUNT_ROUNDING ) }</td>
        <td class="${ totalTdClass }">${ parseNumber( row.totalNetSalary ).toFixed( AMOUNT_ROUNDING ) }</td>
        <!--  hidden td how many colspan due to datatable error   -->
        ${ hiddenColumns }
    </tr>
    `;
    };

    /**
     * Generates the salary sheet permanent data and appends it to the table.
     *
     * This function processes the provided salary sheet data, grouping rows by department,
     * calculating group and grand totals, and appending the generated rows to the table body.
     *
     * @param {Array} data - The salary sheet data to process.
     */
    const generateSalarySheetPermanent = async ( data ) => {
        let previousDepartmentName = '';
        let currentDepartmentName  = '';
        let rowsBuffer             = []; // Buffer to hold department rows
        let grandTotal             = initializeGrandSalaryGroup();
        let groupTotal             = initializeTotalSalaryGroup();

        $.each( data, function( index, item ) {
            const itemRow          = createTableRow( item, rowsBuffer.length + 1 );
            previousDepartmentName = item.staff.staff_department.name;

            if ( currentDepartmentName !== previousDepartmentName ) {
                if ( index !== 0 ) {
                    rowsBuffer.push( createTotalRow( groupTotal ) );
                }
                // Group rows by department
                const groupRow = createGroupRow( previousDepartmentName );
                rowsBuffer.push( groupRow );
                currentDepartmentName = previousDepartmentName;
                groupTotal            = initializeTotalSalaryGroup();
            }

            rowsBuffer.push( itemRow );
            // Calculate group totals
            groupTotal.totalBasicSalary += parseNumber( item.basic_salary );
            groupTotal.totalOverTimeAmount += parseNumber( item.ot_amount );
            groupTotal.totalGrossSalary += parseNumber( item.gross_salary );
            groupTotal.totalIncentive += parseNumber( item.incentive );
            groupTotal.totalAdvance += parseNumber( item.advance );
            groupTotal.totalPenalty += parseNumber( item.penalty );
            groupTotal.totalLoanDeduction += parseNumber( item.loan_deduction );
            groupTotal.totalEobi += parseNumber( item.eobi );
            groupTotal.totalInsurance += parseNumber( item.insurance );
            groupTotal.totalSocialSecurity += parseNumber( item.social_security );
            groupTotal.totalNetSalary += parseNumber( item.net_salary );

            // Calculate grand totals
            grandTotal.totalBasicSalary += parseNumber( item.basic_salary );
            grandTotal.totalOverTimeAmount += parseNumber( item.ot_amount );
            grandTotal.totalGrossSalary += parseNumber( item.gross_salary );
            grandTotal.totalIncentive += parseNumber( item.incentive );
            grandTotal.totalAdvance += parseNumber( item.advance );
            grandTotal.totalPenalty += parseNumber( item.penalty );
            grandTotal.totalLoanDeduction += parseNumber( item.loan_deduction );
            grandTotal.totalEobi += parseNumber( item.eobi );
            grandTotal.totalInsurance += parseNumber( item.insurance );
            grandTotal.totalSocialSecurity += parseNumber( item.social_security );
            grandTotal.totalNetSalary += parseNumber( item.net_salary );

            // Append total row to the buffer
            if ( index === (data.length - 1) ) {
                rowsBuffer.push( createTotalRow( groupTotal ) );
                rowsBuffer.push( createTotalRow( grandTotal ) );
            }
        } );
        // Append rows to the table
        salarySheetPermanentTableBody.append( rowsBuffer.join( '' ) );
    };

    /**
     * Fetches and displays the salary sheet permanent data for a given date range.
     *
     * This function makes an asynchronous request to retrieve the salary sheet permanent data
     * for the specified date range. It handles loading states, clears the existing table data,
     * and appends the new data to the table. If an error occurs during the request, it displays
     * an error message.
     *
     * @param {string} fromDate - The start date of the date range.
     * @param {string} toDate - The end date of the date range.
     */
    const getSalarySheetPermanent = async ( fromDate, toDate ) => {
        try {
            doLoading();
            // Clear Table
            if ( typeof salarySheetPermanent.salarySheetDataTable != 'undefined' ) {
                salarySheetPermanent.salarySheetDataTable.destroy();
                salarySheetPermanentTableBody.html( '' );
            }

            const response = await makeAjaxRequest( 'GET', `${ apiURL }/payroll/salarySheetPermanent/getSalarySheetPermanent`, {
                fromDate: fromDate,
                toDate  : toDate,
            } );

            if ( response && response.status === false ) {
                AlertComponent.getAlertMessage( { title: 'Error', message: response.message, type: response.level } );
                return;
            }

            await appendToTableSalarySheetPermanent( response.data );
        }
        catch ( error ) {
            AlertComponent.getAlertMessage( { title: 'Error', message: 'An unexpected error occurred.', type: 'danger' } );
            console.error( 'Error: ', error );
        }
        finally {
            doLoading();
        }
    };


    /**
     * Appends the generated salary sheet permanent data to the table.
     *
     * This function calls `generateSalarySheetPermanent` to process the provided data
     * and then initializes the DataTable for the salary sheet permanent table.
     *
     * @param {Array} data - The salary sheet data to process and append to the table.
     */
    const appendToTableSalarySheetPermanent = async ( data ) => {
        await generateSalarySheetPermanent( data );
        salarySheetDataTable();
    };

    /**
     * Initializes the DataTable for the salary sheet permanent table.
     *
     * This function sets up the DataTable with specific configurations such as
     * length menu, page length, ordering, and footer settings.
     */
    const salarySheetDataTable = () => {
        salarySheetPermanent.salarySheetDataTable = salarySheetPermanentTable.DataTable( {
            'lengthMenu': [ [ 10, 25, 50, -1 ], [ 10, 25, 50, 'All' ] ],
            'pageLength': 50,
            'order'     : [], // Remove any default sorting
            'ordering'  : false, // Disable sorting
            'autoWidth' : false,
            'footer'    : true,
        } );
    };

    /**
     * Validates the salary sheet permanent table.
     *
     * This function iterates over each row in the salary sheet permanent table body
     * and checks if the loan deduction is greater than the loan balance. If so, it
     * adds an error class to the input field and accumulates an error message.
     *
     * @returns {string|null} Returns the accumulated error message if any validation
     *                        errors are found, otherwise returns null.
     */
    const validateSalarySheetPermanent = () => {
        // Initialize error flag and message accumulator
        let hasError     = false;
        let errorMessage = '';

        salarySheetPermanentTableBody.find( 'tr' ).each( function( index, element ) {
            const departmentId  = $( element ).find( '.departmentName' ).data( 'department_id' );
            const loanBalance   = $( element ).find( '.loanBalance' ).text();
            const loanDeduction = $( element ).find( 'td.loanDeduction input' ).val();
            // check department id and loan deduction
            if ( departmentId && parseFloat( loanDeduction ) > parseFloat( loanBalance ) ) {
                // Add input error class
                $( element ).find( 'td.loanDeduction input' ).addClass( 'inputerror' );
                // Accumulate error message
                errorMessage += AlertComponent.getAlertMessage( { title: 'Error', message: 'Loan deduction is greater than loan balance', type: 'danger' } );
                hasError = true;
            }
        } );

        // Return error message if any validation errors are found
        if ( hasError ) {
            return errorMessage;
        }

        // Return null if no validation errors are found
        return null;
    };

    /**
     * Constructs the save object for the salary sheet permanent data.
     *
     * This function gathers data from the salary sheet permanent table and constructs
     * an object containing the salary sheet details and the salary sheet permanent data.
     *
     * @returns {Object} An object containing the salary sheet and its details.
     */
    const getSaveObject = () => {
        const salarySheet              = {};
        const salarySheetPermanentData = [];

        const fromDate = $( '#fromDate' ).val();
        const toDate   = $( '#toDate' ).val();

        salarySheet.id        = $( '#salarySheetPermanentId' ).val();
        salarySheet.vrdate    = toDate;
        salarySheet.from_date = fromDate;
        salarySheet.to_date   = toDate;
        salarySheet.remarks   = $( '#salarySheetRemarks' ).val();

        const tbl = salarySheetPermanentTable.DataTable();
        tbl.rows().every( function() {
            const row = $( this.node() );

            const departmentId = row.find( '.departmentName' ).data( 'department_id' );

            const staffId        = row.find( '.staffName' ).data( 'staff_id' );
            const designationId  = row.find( '.designationName' ).data( 'designation_id' );
            const basicSalary    = parseNumber( row.find( '.basicSalary' ).text() );
            const absents        = parseNumber( row.find( '.absents' ).text() );
            const paidLeaves     = parseNumber( row.find( '.paidLeaves' ).text() );
            const gustedHolidays = parseNumber( row.find( '.gustedHolidays' ).text() );
            const outdoors       = parseNumber( row.find( '.outdoors' ).text() );
            const shortLeaves    = parseNumber( row.find( '.shortLeaves' ).text() );
            const restDays       = parseNumber( row.find( '.restDays' ).text() );
            const workDays       = parseNumber( row.find( '.workDays' ).text() );
            const paidDays       = parseNumber( row.find( '.paidDays' ).text() );
            const otHours        = parseNumber( row.find( '.otHours' ).text() );
            const otRate         = parseNumber( row.find( '.otRate' ).text() );
            const otAmount       = parseNumber( row.find( '.otAmount' ).text() );
            const grossSalary    = parseNumber( row.find( '.grossSalary' ).text() );
            const incentive      = parseNumber( row.find( '.incentive' ).text() );
            const advance        = parseNumber( row.find( '.advance' ).text() );
            const penalty        = parseNumber( row.find( '.penalty' ).text() );
            const loanBalance    = parseNumber( row.find( '.loanBalance' ).text() );
            const loanDeduction  = parseNumber( row.find( 'td.loanDeduction input' ).val() );
            const eobi           = parseNumber( row.find( '.eobi' ).text() );
            const insurance      = parseNumber( row.find( '.insurance' ).text() );
            const socialSecurity = parseNumber( row.find( '.socialSecurity' ).text() );
            const netSalary      = parseNumber( row.find( '.netSalary' ).text() );

            if ( parseNumber( departmentId ) > 0 ) {
                const data = {
                    department_id  : departmentId,
                    staff_id       : staffId,
                    designation_id : designationId,
                    basic_salary   : basicSalary,
                    absents        : absents,
                    paid_leaves    : paidLeaves,
                    gusted_holidays: gustedHolidays,
                    outdoors       : outdoors,
                    short_leaves   : shortLeaves,
                    rest_days      : restDays,
                    work_days      : workDays,
                    paid_days      : paidDays,
                    ot_hours       : otHours,
                    ot_rate        : otRate,
                    ot_amount      : otAmount,
                    gross_salary   : grossSalary,
                    incentive      : incentive,
                    advance        : advance,
                    penalty        : penalty,
                    loan_balance   : loanBalance,
                    loan_deduction : loanDeduction,
                    eobi           : eobi,
                    insurance      : insurance,
                    social_security: socialSecurity,
                    net_salary     : netSalary,
                };
                salarySheetPermanentData.push( data );
            }


        } );

        return {
            salarySheet      : salarySheet,
            salarySheetDetail: salarySheetPermanentData,
        };
    };

    const saveSalarySheetPermanent = async ( salarySheetPermanentData ) => {
        await disableButton();
        try {
            doLoading();
            const response = await makeAjaxRequest( 'POST', `${ apiURL }/payroll/salarySheetPermanent/saveSalarySheetPermanent`,
                {
                    salarySheet      : JSON.stringify( salarySheetPermanentData.salarySheet ),
                    salarySheetDetail: JSON.stringify( salarySheetPermanentData.salarySheetDetail ),
                    id               : $( '#salarySheetPermanentId' ).val(),
                } );

            if ( response && response.status ) {
                AlertComponent.getAlertMessage( { title: 'Success', message: response.message, type: response.level } );
                await resetVoucher();
                return;
            }

            AlertComponent.getAlertMessage( { title: 'Error', message: response.message, type: response.level } );
        }
        catch ( error ) {
            console.error( 'Error: ', error );
        }
        finally {
            doLoading();
            await enableDisableButton();
        }
    };

    let salarySheetPermanentDataTable;
    const getSalarySheetPermanentDataTable = async ( fromDate = null, toDate = null ) => {
        if ( typeof salarySheetPermanentDataTable !== 'undefined' ) {
            salarySheetPermanentDataTable.destroy();
            $( '#salarySheetPermanentListTableBody' ).empty();
        }

        salarySheetPermanentDataTable = $( '#salarySheetPermanentListTable' ).DataTable( {
            processing: true,
            serverSide: true,
            ajax      : {
                url  : `${ apiURL }/payroll/salarySheetPermanent/getSalarySheetPermanentDataTable`,
                type : 'GET',
                data : { fromDate: fromDate, toDate: toDate },
                error: function( jqXHR, textStatus ) {
                    let message = `Unexpected error: ${ jqXHR.status } ${ textStatus }`;
                    AlertComponent.getAlertMessage( {
                        title  : 'Error',
                        message: jqXHR.responseJSON.message ?? message,
                        type   : 'danger',
                    } );
                },
            },
            autoWidth : false,
            buttons   : true,
            searching : true,
            columns   : [
                {
                    data      : null,
                    className : 'select',
                    searchable: false,
                    orderable : false,
                    render    : function( data, type, row, meta ) {
                        return meta.row + 1;
                    },
                },
                {
                    data     : 'vrnoa',
                    name     : 'vrnoa',
                    className: 'text-left vrnoa',
                },
                {
                    data     : 'vrdate',
                    name     : 'vrdate',
                    className: 'vrdate',
                    render   : function( data ) {
                        return updateFormattedDate( data );
                    },
                },
                {
                    data     : 'salary_month',
                    name     : 'salary_month',
                    className: 'salary_month',
                    render   : function( data ) {
                        return data;
                    },
                },
                {
                    data      : null,
                    className : 'select text-right',
                    searchable: false,
                    orderable : false,
                    render    : function( data, type, row ) {
                        return `
                        <div class="btn-group dropleft">
                            <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">More</button>
                            <div class="dropdown-menu main-dropdown-menu">
                                <a class="dropdown-item btnEditPrevVoucher" data-salary_sheet_permanent_id="${ row.id }"><i class="fa fa-edit"></i> Edit</a>
                                <div class="dropdown-divider"></div>
                                <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"  aria-haspopup="true" aria-expanded="false">
                                    <span class="caret"><i class="fa fa-print"></i> Print Options</span>
                                    <span class="sr-only">Toggle Dropdown</span>
                                </button>
                                <ul class="dropdown-menu dropdown-submenu-left" role="menu">
                                    <li class="dropdown-item"><a href="#" class="btnPrint" data-salary_sheet_permanent_id="${ row.id }">Print</a></li>
                                    <li class="dropdown-item"><a href="#" class="btnPrintSlips" data-salary_sheet_permanent_id="${ row.id }"> Print Slips</a></li>
                                </ul>
                                <a class="dropdown-item btnDelete" data-salary_sheet_permanent_id="${ row.id }" href="#"><i class="fa fa-trash"></i> Delete Voucher</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item btnPrintASEmail" data-salary_sheet_permanent_id="${ row.id }" href="#"><i class="fa fa-envelope"></i> Send Email</a>
                            </div>
                        </div>`;
                    },
                },
            ],
            createdRow: function( row, data, dataIndex ) {
                $( row ).addClass( 'group odd:bg-white even:bg-slate-50 py-1 px-1' );
                $( 'td', row ).addClass( 'py-1 px-1 text-md align-middle text-middle' );
            },
        } );
    };
    var getSalarySheetPermanentById        = async function( salarySheetPermanentId ) {
        const response = await makeAjaxRequest( 'GET', `${ apiURL }/payroll/salarySheetPermanent/getSalarySheetPermanentById`, {
            salarySheetPermanentId: salarySheetPermanentId,
        } );
        resetField();
        if ( response && response.status == false ) {
            AlertComponent.getAlertMessage( { title: 'Operation failed !', message: response.message, type: response.level } );
            await resetVoucher();
            return;
        }

        populateDataSalarySheetPermanent( response.data );
    };

    const populateDataSalarySheetPermanent = async function( data ) {
        $( '#salarySheetPermanentId' ).val( data.id );
        // use updateDatepickerWithFormattedDate function to format date
        updateDatepickerWithFormattedDate( 'fromDate', data.from_date );
        updateDatepickerWithFormattedDate( 'toDate', data.to_date );
        $( '#salarySheetRemarks' ).val( data.remarks );
        // append to table
        await generateSalarySheetPermanent( data.salary_sheet_permanent_detail );
        salarySheetDataTable();
    };

    const resetVoucher = async () => {
        await getSalarySheetPermanentDataTable();
        resetField();
    };
    const resetField   = () => {
        $( '.inputerror' ).removeClass( 'inputerror' );
        const resetArray = [
            'salarySheetPermanentId',
            'fromDate',
            'toDate',
            'salarySheetRemarks',
        ];

        clearValueAndText( resetArray, '#' );


        if ( typeof salarySheetPermanent.salarySheetDataTable != 'undefined' ) {
            salarySheetPermanent.salarySheetDataTable.destroy();
            salarySheetPermanentTableBody.empty();
        }

        salarySheetPermanent.salarySheetDataTable = undefined;
    };

    const deleteVoucher = async ( salarySheetPermanentId ) => {
        await disableButton();
        try {
            const response = await makeAjaxRequest( 'delete', `${ apiURL }/payroll/salarySheetPermanent/delete`, {
                salarySheetPermanentId: salarySheetPermanentId,
            } );
            if ( response.status == false ) {
                AlertComponent.getAlertMessage( { title: 'Error', message: response.message, type: response.level } );
            } else {
                AlertComponent.getAlertMessage( { title: 'Operation Successfully', message: response.message, type: response.level } );
                resetVoucher();
            }
        }
        catch ( error ) {
            console.log( error );
        }
        finally {
            await enableDisableButton();
        }
    };

    const calculateNetSalary = ( currentRow ) => {
        // make loop through all rows and calculate net salary

        const basicSalary    = $( currentRow ).find( 'td.basicSalary' ).text();
        const absents        = $( currentRow ).find( 'td.absents' ).text();
        const paidLeaves     = $( currentRow ).find( 'td.paidLeaves' ).text();
        const gustedHolidays = $( currentRow ).find( 'td.gustedHolidays' ).text();
        const outdoors       = $( currentRow ).find( 'td.outdoors' ).text();
        const shortLeaves    = $( currentRow ).find( 'td.shortLeaves' ).text();
        const restDays       = $( currentRow ).find( 'td.restDays' ).text();
        const workDays       = $( currentRow ).find( 'td.workDays' ).text();
        const paidDays       = $( currentRow ).find( 'td.paidDays' ).text();
        const otHours        = $( currentRow ).find( 'td.otHours' ).text();
        const otRate         = $( currentRow ).find( 'td.otRate' ).text();
        const otAmount       = $( currentRow ).find( 'td.otAmount' ).text();
        const grossSalary    = $( currentRow ).find( 'td.grossSalary' ).text();
        const incentive      = $( currentRow ).find( 'td.incentive' ).text();
        const advance        = $( currentRow ).find( 'td.advance' ).text();
        const penalty        = $( currentRow ).find( 'td.penalty' ).text();
        const loanBalance    = $( currentRow ).find( 'td.loanBalance' ).text();
        const loanDeduction  = $( currentRow ).find( 'td.loanDeduction input' ).val();
        const eobi           = $( currentRow ).find( 'td.eobi' ).text();
        const insurance      = $( currentRow ).find( 'td.insurance' ).text();
        const socialSecurity = $( currentRow ).find( 'td.socialSecurity' ).text();

        const netSalary = parseNumber( grossSalary ) + parseNumber( incentive ) - parseNumber( advance ) - parseNumber( penalty ) - parseNumber( loanDeduction ) - parseNumber( eobi ) - parseNumber( insurance ) - parseNumber( socialSecurity );
        $( currentRow ).find( 'td.netSalary' ).text( parseNumber( netSalary ).toFixed( AMOUNT_ROUNDING ) );

    };

    const printVoucher = ( vrnoa, paperSize, printSize, wrate = '', isSendEmail = false ) => {
        try {
            const etype           = 'salary_sheet_permanents';
            const previousBalance = 0;
            const languageId      = 1;
            const orientation     = 'landscape';
            const printUrl        = `${ apiURL }/doc/getPrintVoucherPDF/?etype=${ etype }&vrnoa=${ vrnoa }&pre_bal_print=${ previousBalance }&paperSize=${ paperSize }&printSize=${ printSize }&wrate=${ wrate ? wrate : 0 }&language_id=${ languageId }&orientation=${ orientation }`;
            openPrintOnSettingConfiguration( printUrl );
        }
        catch ( error ) {
            console.error( error );
        }
    };

    const printSlips = function( salarySheetPermanentId ) {
        const width  = $( window ).width() - 200;
        const height = $( window ).height() - 100;
        window.open( `${ base_url }/htmlPrint/getPrintSalarySlips?salarySheetPermanentId=${ salarySheetPermanentId }`, 'width=' + width + ', height=' + height );
    };

    return {
        init    : async function() {
            this.bindUI();
            await getSalarySheetPermanentDataTable();
        },
        bindUI  : function() {
            const self = this;

            $( document.body ).on( 'change', 'input[name="durType"]', function( e ) {
                const dateType = $( 'input[type="radio"][name="durType"]:checked' ).val();
                if ( dateType === 'today' ) {
                    updateDateRangeCurrentDay( 'listFromDate', 'listToDate' );
                } else if ( dateType === 'year' ) {
                    setFinancialYearDate( 'listFromDate', 'listToDate' );
                } else if ( dateType === 'week' ) {
                    updateDateRangeToCurrentWeek( 'listFromDate', 'listToDate' );
                } else if ( dateType === 'month' ) {
                    updateDateRangeToCurrentMonth( 'listFromDate', 'listToDate' );
                }
            } );
            $( '#salarySheetPermanentSyncAlt' ).on( 'click', async function( e ) {
                e.preventDefault();
                $( '#listFromDate' ).datepicker( 'update', new Date() );
                $( '#listToDate' ).datepicker( 'update', new Date() );
                await getSalarySheetPermanentDataTable();
            } );
            $( '#salarySheetPermanentFilter' ).on( 'click', async function( e ) {
                e.preventDefault();
                const listFromDate = $( '#listFromDate' ).val();
                const listToDate   = $( '#listToDate' ).val();
                await getSalarySheetPermanentDataTable( listFromDate, listToDate );
            } );

            $( document.body ).on( 'click', '.btnEditPrevVoucher', async function( e ) {
                e.preventDefault();
                const salarySheetPermanentId = parseNumber( $( this ).data( 'salary_sheet_permanent_id' ) );
                await getSalarySheetPermanentById( salarySheetPermanentId );
                $( 'a[href="#Main"]' ).trigger( 'click' );
            } );

            $( document.body ).on( 'click', '.btnPrint', function( e ) {
                const salarySheetPermanentId = $( this ).data( 'salary_sheet_permanent_id' );
                e.preventDefault();
                printVoucher( salarySheetPermanentId, 1, 'lg', '' );
            } );
            $( document.body ).on( 'click', '.btnPrintSlips', function( e ) {
                e.preventDefault();
                const salarySheetPermanentId = $( this ).data( 'salary_sheet_permanent_id' );
                printSlips( salarySheetPermanentId);
            } );
            $( document.body ).on( 'click', '.btnDelete', async function( e ) {
                const salarySheetPermanentId = $( this ).data( 'salary_sheet_permanent_id' );
                e.preventDefault();
                if ( salarySheetPermanentId !== '' ) {
                    _getConfirmMessage( 'Warning!', 'Are you sure to delete this voucher', 'warning', async function( result ) {
                        if ( result ) {
                            await deleteVoucher( salarySheetPermanentId );
                        }
                    } );
                }
            } );

            $( document.body ).on( 'click', '#searchButton', async function( event ) {
                event.preventDefault();
                const fromDate = $( '#fromDate' ).val();
                const toDate   = $( '#toDate' ).val();

                if ( fromDate === '' || toDate === '' ) {
                    AlertComponent.getAlertMessage( { title: 'Error', message: 'Please select date range', type: 'danger' } );
                    return;
                }

                await getSalarySheetPermanent( fromDate, toDate );
            } );

            // on input td.loanDeduction input
            $( document.body ).on( 'input', 'td.loanDeduction input', function() {
                const loanDeduction = $( this ).val();
                const loanBalance   = $( this ).closest( 'tr' ).find( 'td.loanBalance' ).text();
                let netSalary       = $( this ).closest( 'tr' ).find( 'td.netSalary' ).text();
                if ( parseFloat( loanDeduction ) > parseFloat( loanBalance ) ) {
                    // alert message and empty input
                    $( this ).addClass( 'inputerror' );
                    AlertComponent.getAlertMessage( { title: 'Error', message: 'Loan deduction is greater than loan balance', type: 'danger' } );
                    $( this ).val( '' );
                } else {
                    $( this ).removeClass( 'inputerror' );
                }
                calculateNetSalary( $( this ).closest( 'tr' ) );
            } );

            // save Salary Sheet Permanent
            $( document.body ).on( 'click', '.btnSave', async function( event ) {
                event.preventDefault();
                self.initSave();
            } );
            // reset Salary Sheet Permanent .btnReset
            $( document.body ).on( 'click', '.btnReset', async function( event ) {
                event.preventDefault();
                await resetVoucher();
            } );

        },
        initSave: async function() {
            await disableButton();
            const alertMessage = validateSalarySheetPermanent();

            if ( !$( alertMessage ).empty() ) {
                AlertComponent.getAlertMessage( { title: 'Error', message: alertMessage, type: 'danger' } );
                return;
            }

            // get all data from table
            const salarySheetPermanentData = getSaveObject();
            await saveSalarySheetPermanent( salarySheetPermanentData );
        },
    };
};

const salarySheetPermanent = new SalarySheetPermanent();
salarySheetPermanent.init();
