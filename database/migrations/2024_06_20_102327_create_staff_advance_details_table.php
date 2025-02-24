<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStaffAdvanceDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('staff_advance_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('staff_advance_id')->nullable();
            $table->unsignedBigInteger('staff_id')->nullable();
            $table->string('remarks')->nullable();
            $table->decimal('amount', 20, 3);
            $table->string('advance_status')->nullable();
            $table->foreign('staff_advance_id')->references('id')->on('staff_advances')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('staff_id')->references('id')->on('staff')->onDelete('restrict')->onUpdate('restrict');
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
        Schema::dropIfExists('staff_advance_details');
    }
}
