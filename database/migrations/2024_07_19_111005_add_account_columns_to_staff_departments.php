<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAccountColumnsToStaffDepartments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('staff_departments', function (Blueprint $table) {
            $table->unsignedBigInteger('salary_account_id')->nullable()->after('description');
            $table->unsignedBigInteger('salary_payable_account_id')->nullable()->after('salary_account_id');
            $table->unsignedBigInteger('wages_account_id')->nullable()->after('salary_payable_account_id');
            $table->unsignedBigInteger('wages_payable_account_id')->nullable()->after('wages_account_id');
            $table->unsignedBigInteger('eobi_account_id')->nullable()->after('wages_payable_account_id');
            $table->unsignedBigInteger('insurance_account_id')->nullable()->after('eobi_account_id');
            $table->unsignedBigInteger('social_security_account_id')->nullable()->after('insurance_account_id');
            $table->unsignedBigInteger('staff_incentive_account_id')->nullable()->after('social_security_account_id');
            $table->unsignedBigInteger('staff_penalty_account_id')->nullable()->after('staff_incentive_account_id');

            // Adding foreign key constraints
            $table->foreign('salary_account_id')->references('pid')->on('parties')->onDelete('set null');
            $table->foreign('salary_payable_account_id')->references('pid')->on('parties')->onDelete('set null');
            $table->foreign('wages_account_id')->references('pid')->on('parties')->onDelete('set null');
            $table->foreign('wages_payable_account_id')->references('pid')->on('parties')->onDelete('set null');
            $table->foreign('eobi_account_id')->references('pid')->on('parties')->onDelete('set null');
            $table->foreign('insurance_account_id')->references('pid')->on('parties')->onDelete('set null');
            $table->foreign('social_security_account_id')->references('pid')->on('parties')->onDelete('set null');
            $table->foreign('staff_incentive_account_id')->references('pid')->on('parties')->onDelete('set null');
            $table->foreign('staff_penalty_account_id')->references('pid')->on('parties')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('staff_departments', function (Blueprint $table) {
            // Drop foreign key constraints
            $table->dropForeign(['salary_account_id']);
            $table->dropForeign(['salary_payable_account_id']);
            $table->dropForeign(['wages_account_id']);
            $table->dropForeign(['wages_payable_account_id']);
            $table->dropForeign(['eobi_account_id']);
            $table->dropForeign(['insurance_account_id']);
            $table->dropForeign(['social_security_account_id']);
            $table->dropForeign(['staff_incentive_account_id']);
            $table->dropForeign(['staff_penalty_account_id']);

            // Drop columns
            $table->dropColumn([
                'salary_account_id',
                'salary_payable_account_id',
                'wages_account_id',
                'wages_payable_account_id',
                'eobi_account_id',
                'insurance_account_id',
                'social_security_account_id',
                'staff_incentive_account_id',
                'staff_penalty_account_id'
            ]);
        });
    }
}
