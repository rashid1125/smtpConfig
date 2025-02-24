<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddExportInvoiceReceivingIdToAccountsLedgersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            // Add the export_invoice_receiving_id column as an unsigned integer
            $table->unsignedBigInteger('export_invoice_receiving_id')->nullable();
            // Optionally add a foreign key constraint
            $table->foreign('export_invoice_receiving_id')->references('id')->on('export_invoice_receivings')->onDelete('cascade');
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
             // Drop the foreign key constraint first if it exists
             $table->dropForeign(['export_invoice_receiving_id']);

             // Then drop the column
             $table->dropColumn('export_invoice_receiving_id');
        });
    }
}
