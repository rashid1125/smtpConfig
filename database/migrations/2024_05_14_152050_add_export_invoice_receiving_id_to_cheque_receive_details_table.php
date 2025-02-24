<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddExportInvoiceReceivingIdToChequeReceiveDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cheque_receive_details', function (Blueprint $table) {
            $table->unsignedBigInteger('export_invoice_receiving_id')->nullable()->after('cheque_receive_id');
            // If you have a foreign key relationship
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
        Schema::table('cheque_receive_details', function (Blueprint $table) {
            $table->dropForeign(['export_invoice_receiving_id']);
            $table->dropColumn('export_invoice_receiving_id');
        });
    }
}
