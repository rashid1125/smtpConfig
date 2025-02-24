<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLoanReturnIdToAccountsLedgers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            // add loan_return_id field
            $table->unsignedBigInteger('loan_return_id')->nullable()->after('loan_id');
            // add foreign key constraint
            $table->foreign('loan_return_id')->references('id')->on('loan_returns')->onDelete('cascade')->onUpdate('cascade');
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
            // drop foreign key constraint
            $table->dropForeign(['loan_return_id']);
            // drop loan_return_id field
            $table->dropColumn('loan_return_id');
        });
    }
}
