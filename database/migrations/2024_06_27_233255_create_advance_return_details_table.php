<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdvanceReturnDetailsTable extends Migration
{
    /**
     * Create the advance_return_details table.
     *
     * @return void
     */
    public function up()
    {
        // Create the advance_return_details table
        Schema::create('advance_return_details', function (Blueprint $table) {
            // primary key
            $table->id();
            // foreign key to advance_returns table
            $table->unsignedBigInteger('advance_return_id')->nullable();
            // foreign key to staff table
            $table->unsignedBigInteger('staff_id')->nullable();
            // nullable remarks field
            $table->string('remarks')->nullable();
            // decimal field for amount
            $table->decimal('amount', 20, 3);
            // nullable advance status field
            $table->string('advance_status')->nullable();
            // foreign key constraint
            $table->foreign('advance_return_id')->references('id')->on('advance_returns')->onDelete('cascade')->onUpdate('cascade');
            // foreign key constraint
            $table->foreign('staff_id')->references('id')->on('staff')->onDelete('restrict')->onUpdate('restrict');
            // created_at and updated_at timestamps
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
        Schema::dropIfExists('advance_return_details');
    }
}
