<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExportInvoiceReceivingChequeDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('export_invoice_receiving_cheque_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('export_invoice_receiving_id')->unsigned()->nullable();
            $table->unsignedBigInteger('cheque_list_number')->nullable();
            $table->text('cheque_particular')->nullable();
            $table->string('cheque_bank_name', 255)->nullable();
            $table->bigInteger('cheque_in_hand_id')->unsigned()->nullable();
            $table->string('cheque_invoice', 255)->nullable();
            $table->date('cheque_vrdate')->nullable();
            $table->string('cheque_no', 255)->nullable();
            $table->decimal('cheque_amount', 20, 3)->nullable();

            $table->foreign('export_invoice_receiving_id','eir_cheque_detail_id')->references('id')->on('export_invoice_receivings')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign('cheque_in_hand_id','eir_cheque_in_hand_id')->references('pid')->on('parties')->onUpdate('RESTRICT')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('export_invoice_receiving_cheque_details');
    }
}
