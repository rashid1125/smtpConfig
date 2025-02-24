<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCashBookDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cash_book_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('cash_book_id')->nullable();
            $table->unsignedBigInteger('party_id')->nullable(false);
            $table->string('invoice_no', 255)->nullable();
            $table->decimal('debit', 20, 3)->default('0.000');
            $table->decimal('credit', 20, 3)->default('0.000');
            $table->text('remarks')->nullable();

            // Foreign keys
            $table->foreign('cash_book_id', 'FK_cash_book_id')
                  ->references('id')->on('cash_books')
                  ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('party_id', 'FK_cash_book_details_parties')
                ->references('pid')->on('parties')
                ->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cash_book_details');
    }
}
