<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePenaltyDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('penalty_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('penalty_id');
            $table->integer('staff_id');
            $table->string('reason')->nullable();
            $table->decimal('amount');

            // foreign key constraints
            $table->foreign('penalty_id')->references('id')->on('penalties');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('penalty_details');
    }
}
