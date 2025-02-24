<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDebitNoteDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('debit_note_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('debit_note_id')->nullable();
            $table->text('particular')->nullable();
            $table->string('invoice', 255)->nullable();
            $table->decimal('amount', 18, 3)->default('0.000');
            // Foreign keys
            $table->foreign('debit_note_id', 'FK_debit_note_details_debit_notes')
                  ->references('id')->on('debit_notes')
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
        Schema::dropIfExists('debit_note_details');
    }
}
