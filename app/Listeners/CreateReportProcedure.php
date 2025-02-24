<?php

namespace App\Listeners;

use App\Events\ReportDynamicallyInserted;
use Illuminate\Support\Facades\DB;

class CreateReportProcedure
{
    /**
     * Handle the event.
     *
     * @param  \App\Events\ReportDynamicallyInserted  $event
     * @return void
     */
    public function handle(ReportDynamicallyInserted $event)
    {
        // Generate the SQL query to create the procedure
        $sqlQuery = "
        CREATE PROCEDURE $event->procedure_name (
            IN p_startDate DATE,
            IN p_endDate DATE,
            IN p_what VARCHAR(50),
            IN p_what2 VARCHAR(50),
            IN p_type VARCHAR(50),
            IN p_rtype VARCHAR(50),
            IN p_stockTypes VARCHAR(50),
            IN p_etype VARCHAR(50),
            IN p_crit TEXT,
            IN p_languageId INT,
            IN p_financialYearId INT,
            IN p_companyId INT,
            IN p_userId INT
        )
        BEGIN
    DECLARE sqlQuery LONGTEXT;
    SET @tax := (SELECT tax FROM companies WHERE tax = 1);
    SET @qtyRounding := (SELECT qty_rounding FROM setting_configurations);
    SET @rateRounding := (SELECT rate_rounding FROM setting_configurations);
    SET @amountRounding := (SELECT setting_decimal FROM setting_configurations);
END
    ";

        // Execute the SQL query to create the procedure
        DB::statement($sqlQuery);
    }
}
