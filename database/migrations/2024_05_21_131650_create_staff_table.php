<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStaffTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->integer('vrnoa');
            $table->string('staff_type');
            $table->unsignedBigInteger('staff_agreement_id');
            $table->unsignedBigInteger('staff_department_id');
            $table->unsignedBigInteger('staff_designation_id');
            $table->string('name');
            $table->string('father_name');
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
            $table->string('religion')->nullable();
            $table->string('staff_cnic')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->date('date_of_joining');
            $table->unsignedBigInteger('shift_id')->nullable();
            $table->date('shift_date')->nullable();
            $table->string('machine_id')->nullable();
            $table->string('staff_address')->nullable();
            $table->string('staff_phone_no')->nullable();
            $table->string('staff_mobile_no')->nullable();
            $table->string('staff_bank_name')->nullable();
            $table->string('staff_account_no')->nullable();
            $table->decimal('staff_salary_amount',20,3)->nullable();
            $table->integer('monthly_paid_leaves')->nullable();
            $table->integer('unpaid_leaves')->nullable();
            $table->boolean('is_loan_deduction')->nullable()->default(false);
            $table->boolean('is_over_time')->nullable()->default(false);
            $table->decimal('over_time_rate', 20, 3)->nullable();
            $table->string('staff_photo')->nullable();
            $table->unsignedBigInteger('week_day_id')->nullable();
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('uid');
            $table->unsignedBigInteger('fn_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->boolean('is_active')->default(true);
            $table->foreign('staff_agreement_id')->references('id')->on('staff_agreements');
            $table->foreign('staff_department_id')->references('id')->on('staff_departments');
            $table->foreign('staff_designation_id')->references('id')->on('designations');
            $table->foreign('week_day_id')->references('id')->on('week_days');
            $table->foreign('shift_id')->references('id')->on('shifts');
            $table->foreign('fn_id')->references('fn_id')->on('financial_years');
            $table->foreign('company_id')->references('company_id')->on('companies');
            // Adding foreign key constraints
            $table->foreign('uid')->references('id')->on('users');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
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
        Schema::dropIfExists('staff');
    }
}
