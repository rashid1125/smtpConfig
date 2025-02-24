<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCreditNoteDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('credit_note_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('credit_note_id')->nullable();
            $table->text('particular')->nullable();
            $table->string('invoice', 255)->nullable();
            $table->decimal('amount', 18, 3)->default('0.000');
            // Foreign keys
            $table->foreign('credit_note_id', 'FK_credit_note_details_credit_notes')
                  ->references('id')->on('credit_notes')
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
        Schema::dropIfExists('credit_note_details');
    }
}
