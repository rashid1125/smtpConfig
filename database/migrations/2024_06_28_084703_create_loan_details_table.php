<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLoanDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('loan_details', function (Blueprint $table) {
            $table->id();
            // foreign key to loan table
            $table->unsignedBigInteger('loan_id')->nullable();
            // foreign key to staff table
            $table->unsignedBigInteger('staff_id')->nullable();
            // nullable remarks field
            $table->string('remarks')->nullable();
            // decimal field for amount
            $table->decimal('amount', 20, 3)->nullable();
            // decimal field for monthly deduction
            $table->decimal('monthly_deduction', 20, 3)->nullable();
            // nullable advance status field
            $table->string('loan_status')->nullable();
            // foreign key constraint
            $table->foreign('loan_id')->references('id')->on('loans')->onDelete('cascade')->onUpdate('cascade');
            // foreign key constraint
            $table->foreign('staff_id')->references('id')->on('staff');
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('loan_details');
    }
}
