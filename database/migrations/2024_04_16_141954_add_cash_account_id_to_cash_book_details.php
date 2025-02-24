<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCashAccountIdToCashBookDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cash_book_details', function (Blueprint $table) {
            $table->unsignedBigInteger('cash_account_id')->nullable()->after('party_id');
            // If 'cash_accounts' table exists and 'id' is its primary key
            $table->foreign('cash_account_id')->references('pid')->on('parties')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cash_book_details', function (Blueprint $table) {
            $table->dropForeign(['cash_account_id']);
            $table->dropColumn('cash_account_id');
        });
    }
}
