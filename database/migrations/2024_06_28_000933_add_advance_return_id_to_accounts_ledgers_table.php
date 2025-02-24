<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdvanceReturnIdToAccountsLedgersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            // Assuming 'advance_return_id' is an integer. Adjust the column type as needed.
            $table->unsignedBigInteger('advance_return_id')->nullable()->after('staff_advance_id');
            // If 'advance_return_id' needs to reference an 'id' on another table, consider adding a foreign key constraint.
            $table->foreign('advance_return_id')->references('id')->on('advance_returns')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            $table->dropColumn('advance_return_id');
            // If you added a foreign key constraint, make sure to drop it here.
            $table->dropForeign(['advance_return_id']);
        });
    }
}
