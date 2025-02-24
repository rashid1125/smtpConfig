<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIncentiveDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incentive_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('incentive_id');
            $table->integer('staff_id');
            $table->string('reason')->nullable();
            $table->decimal('amount');
            // foreign key constraints
            $table->foreign('incentive_id')->references('id')->on('incentives');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('incentive_details');
    }
}
