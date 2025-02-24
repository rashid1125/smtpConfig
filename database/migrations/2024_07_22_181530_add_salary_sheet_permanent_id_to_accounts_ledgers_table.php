<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSalarySheetPermanentIdToAccountsLedgersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            $table->unsignedBigInteger('salary_sheet_permanent_id')->nullable()->after('loan_return_id');

            $table->foreign('salary_sheet_permanent_id')->references('id')->on('salary_sheet_permanents')->onDelete('cascade')->onUpdate('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            $table->dropForeign(['salary_sheet_permanent_id']);
            $table->dropColumn('salary_sheet_permanent_id');
        });
    }
}
