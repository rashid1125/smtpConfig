<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSaleReturnInvoiceIdToAccountsLedgersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
             // Add the sale_return_invoice_id column
             $table->unsignedBigInteger('sale_return_invoice_id')->nullable()->after('sale_invoice_id');

             // Add the foreign key constraint
             $table->foreign('sale_return_invoice_id', 'accounts_ledgers_sale_return_invoice_id_foreign')
                   ->references('id')->on('sale_return_invoices')
                   ->onUpdate('cascade')->onDelete('cascade');
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
             // Drop the foreign key constraint
             $table->dropForeign('accounts_ledgers_sale_return_invoice_id_foreign');

             // Drop the sale_return_invoice_id column
             $table->dropColumn('sale_return_invoice_id');
        });
    }
}
