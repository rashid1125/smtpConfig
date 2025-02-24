<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStaffSalariesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('staff_salaries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('staff_id');
            $table->string('pay_scale')->nullable();
            $table->decimal('basic_salary', 20, 3)->nullable();
            $table->decimal('conveyance_allowance', 20, 3)->nullable();
            $table->decimal('house_rent', 20, 3)->nullable();
            $table->decimal('entertainment', 20, 3)->nullable();
            $table->decimal('medical_allowance', 20, 3)->nullable();
            $table->decimal('others', 20, 3)->nullable();
            $table->decimal('gross_salary', 20, 3)->nullable();
            $table->decimal('eobi', 20, 3)->nullable();
            $table->decimal('social_security', 20, 3)->nullable();
            $table->decimal('insurance', 20, 3)->nullable();
            $table->decimal('deduction', 20, 3)->nullable();
            $table->decimal('net_salary', 20, 3)->nullable();
            $table->foreign('staff_id')->references('id')->on('staff')->onUpdate('cascade')->onDelete('cascade');
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
        Schema::dropIfExists('staff_salaries');
    }
}
