<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChequeHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cheque_histories', function (Blueprint $table) {
            $table->id();
            $table->integer('cheque_list_number');
            $table->unsignedBigInteger('party_id')->nullable();
            $table->unsignedBigInteger('cheque_in_hand_id')->nullable();
            $table->date('cheque_vrdate')->nullable();
            $table->string('cheque_no')->nullable();
            $table->string('cheque_bank_name')->nullable();
            $table->decimal('cheque_amount', 20, 3)->nullable();
            $table->decimal('received_amount', 20, 3)->nullable();
            $table->unsignedBigInteger('cheque_receive_id')->nullable();
            $table->unsignedBigInteger('cheque_issue_id')->nullable();
            $table->unsignedBigInteger('bank_receive_id')->nullable();
            $table->unsignedBigInteger('export_invoice_receiving_id')->nullable();

            $table->foreign('party_id')->references('pid')->on('parties');
            $table->foreign('cheque_in_hand_id')->references('pid')->on('parties');
            $table->foreign('cheque_receive_id')->references('id')->on('cheque_receives')->onDelete('cascade');
            $table->foreign('cheque_issue_id')->references('id')->on('cheque_issues')->onDelete('cascade');
            $table->foreign('bank_receive_id')->references('id')->on('bank_receives')->onDelete('cascade');
            $table->foreign('export_invoice_receiving_id')->references('id')->on('export_invoice_receivings')->onDelete('cascade');
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
        Schema::dropIfExists('cheque_histories');
    }
}
