<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalarySheetPermanentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('salary_sheet_permanent_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('salary_sheet_permanent_id');
            $table->unsignedBigInteger('staff_id');
            $table->unsignedBigInteger('department_id');
            $table->unsignedBigInteger('designation_id');
            $table->decimal('basic_salary', 20, 3)->nullable()->default(0);
            $table->integer('absents')->nullable()->default(0);
            $table->integer('paid_leaves')->nullable()->default(0);
            $table->integer('gusted_holidays')->nullable()->default(0);
            $table->integer('outdoors')->nullable()->default(0);
            $table->integer('short_leaves')->nullable()->default(0);
            $table->integer('rest_days')->nullable()->default(0);
            $table->float('work_days')->nullable()->default(0);
            $table->float('paid_days')->nullable()->default(0);
            $table->decimal('ot_hours', 20, 3)->nullable()->default(0);
            $table->decimal('ot_rate', 20, 3)->nullable()->default(0);
            $table->decimal('ot_amount', 20, 3)->nullable()->default(0);
            $table->decimal('gross_salary', 20, 3)->nullable()->default(0);
            $table->decimal('incentive', 20, 3)->nullable()->default(0);
            $table->decimal('advance', 20, 3)->nullable()->default(0);
            $table->decimal('penalty', 20, 3)->nullable()->default(0);
            $table->decimal('loan_balance', 20, 3)->nullable()->default(0);
            $table->decimal('loan_deduction', 20, 3)->nullable()->default(0);
            $table->decimal('eobi', 20, 3)->nullable()->default(0);
            $table->decimal('insurance', 20, 3)->nullable()->default(0);
            $table->decimal('social_security', 20, 3)->nullable()->default(0);
            $table->decimal('net_salary', 20, 3)->nullable()->default(0);


            $table->foreign('salary_sheet_permanent_id')->references('id')->on('salary_sheet_permanents')->onDelete('cascade')->onDelete('cascade');
            $table->foreign('staff_id')->references('id')->on('staff');
            $table->foreign('department_id')->references('id')->on('staff_departments');
            $table->foreign('designation_id')->references('id')->on('designations');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('salary_sheet_permanent_details');
    }
}
