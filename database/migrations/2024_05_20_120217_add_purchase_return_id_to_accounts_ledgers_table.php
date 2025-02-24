<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPurchaseReturnIdToAccountsLedgersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            $table->unsignedBigInteger('purchase_return_id')->nullable()->after('commercial_invoice_id');
            $table->foreign('purchase_return_id')->references('id')->on('purchase_returns')->onDelete('cascade')->onUpdate('cascade');
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
            // Drop the foreign key constraint first
            $table->dropForeign(['purchase_return_id']);

            // Drop the column
            $table->dropColumn('purchase_return_id');
        });
    }
}
