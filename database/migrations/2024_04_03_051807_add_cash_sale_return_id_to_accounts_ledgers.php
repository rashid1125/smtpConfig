<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCashSaleReturnIdToAccountsLedgers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            $table->unsignedBigInteger('cash_sale_return_id')->nullable()->after('id');
            $table->foreign('cash_sale_return_id')->references('id')->on('cash_sale_returns')->onDelete('cascade');
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
            $table->dropForeign(['cash_sale_return_id']);
            $table->dropColumn('cash_sale_return_id');
        });
    }
}
