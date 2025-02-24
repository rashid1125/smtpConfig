<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExportInvoiceReceivingCashBanksDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('export_invoice_receiving_cash_banks_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('export_invoice_receiving_id')->nullable();
            $table->unsignedBigInteger('account_id')->nullable();
            $table->string('mop', 50)->nullable();
            $table->string('bank_name', 255)->nullable();
            $table->string('detail_remarks', 255)->nullable();
            $table->string('instrument_number', 255)->nullable();
            $table->decimal('amount_lcy', 20, 3)->nullable();

            $table->foreign('export_invoice_receiving_id','eir_bank_detail_id')->references('id')->on('export_invoice_receivings')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign('account_id')->references('pid')->on('parties')->onUpdate('RESTRICT')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('export_invoice_receiving_cash_banks_details');
    }
}
