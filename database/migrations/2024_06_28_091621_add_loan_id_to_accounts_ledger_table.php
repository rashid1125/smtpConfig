<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLoanIdToAccountsLedgerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            // Assuming 'loan_id' is an integer. Adjust the column type as needed.
            $table->unsignedBigInteger('loan_id')->nullable()->after('advance_return_id');
            // If 'loan_id' needs to reference an 'id' on another table, consider adding a foreign key constraint.
            $table->foreign('loan_id')->references('id')->on('loans')->onDelete('cascade')->onUpdate('cascade');
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
            // If you added a foreign key constraint, make sure to drop it here.
            $table->dropForeign(['loan_id']);
            $table->dropColumn('loan_id');
        });
    }
}
