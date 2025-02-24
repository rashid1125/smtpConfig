<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExportInvoiceReceivingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('export_invoice_receivings', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('vrnoa');
            $table->date('vrdate');
            $table->unsignedBigInteger('party_id');
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_mobile')->nullable();
            $table->string('prepared_by')->nullable();
            $table->decimal('currency_exchange_rate', 18, 2)->nullable();
            $table->decimal('converted_amount', 20, 3);
            $table->decimal('cash_bank_amount', 20, 3);
            $table->decimal('cheques_amount', 20, 3);
            $table->decimal('difference', 20, 3);
            $table->decimal('net_amount', 20, 3);
            $table->boolean('is_post')->default(true);
            $table->unsignedBigInteger('uid');
            $table->unsignedBigInteger('fn_id');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->foreign('party_id')->references('pid')->on('parties');
            $table->foreign('currency_id')->references('id')->on('currencies');
            $table->foreign('uid')->references('id')->on('users');
            $table->foreign('fn_id')->references('fn_id')->on('financial_years');
            $table->foreign('company_id')->references('company_id')->on('companies');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('export_invoice_receivings');
    }
}
