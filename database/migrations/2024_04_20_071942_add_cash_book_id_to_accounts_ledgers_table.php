<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCashBookIdToAccountsLedgersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            $table->unsignedBigInteger('cash_book_id')->nullable()->after('id');
            $table->foreign('cash_book_id', 'accountLedgerCashBookId')->references('id')->on('cash_books')->onDelete('cascade');
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
            $table->dropForeign(['accountLedgerCashBookId']);
            $table->dropColumn('cash_book_id');
        });
    }
}
