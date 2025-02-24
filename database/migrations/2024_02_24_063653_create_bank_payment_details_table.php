<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBankPaymentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bank_payment_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('bank_payment_id')->unsigned()->nullable();
            $table->bigInteger('party_id')->unsigned()->nullable();
            $table->bigInteger('cheque_bank_id')->unsigned()->nullable();
            $table->text('cheque_particular')->nullable();
            $table->string('cheque_invoice_no')->nullable();
            $table->date('cheque_vrdate')->nullable();
            $table->string('cheque_no')->nullable();
            $table->decimal('cheque_amount', 20, 3)->default(0.000);
            $table->timestamps();

            $table->foreign('bank_payment_id')->references('id')->on('bank_payments')->onUpdate('CASCADE')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bank_payment_details');
    }
}
