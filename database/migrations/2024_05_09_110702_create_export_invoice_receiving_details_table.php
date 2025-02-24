<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExportInvoiceReceivingDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('export_invoice_receiving_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('export_invoice_receiving_id')->unsigned()->nullable();
            $table->bigInteger('commercial_invoice_id')->unsigned()->nullable();
            $table->bigInteger('commercial_invoice_date')->unsigned();
            $table->bigInteger('currency_id')->unsigned();
            $table->decimal('invoice_amount_fcy', 20, 3)->nullable();
            $table->decimal('received_amount_fcy', 20, 3)->nullable();
            $table->decimal('balance_fcy', 20, 3)->nullable();
            $table->decimal('exchange_rate', 20, 3)->nullable();
            $table->decimal('balance_lcy', 20, 3)->nullable();
            $table->decimal('received_amount_lcy', 20, 3)->nullable();
            $table->decimal('converted_amount_lcy', 20, 3)->nullable();
            $table->text('detail_remarks')->nullable();
            // Foreign key constraints
            $table->foreign('export_invoice_receiving_id','eir_detail_id')->references('id')->on('export_invoice_receivings')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign('commercial_invoice_id')->references('id')->on('commercial_invoices')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('currency_id')->references('id')->on('currencies')->onUpdate('RESTRICT')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('export_invoice_receiving_details');
    }
}
