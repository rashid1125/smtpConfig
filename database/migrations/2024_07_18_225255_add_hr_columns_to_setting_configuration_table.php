<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddHrColumnsToSettingConfigurationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('setting_configurations', function (Blueprint $table) {
            $table->string('salary_Levels')->nullable();
            $table->string('salary_payable_levels')->nullable();
            $table->string('wages_levels')->nullable();
            $table->string('wages_payable_levels')->nullable();
            $table->string('penalty_levels')->nullable();
            $table->string('incentive_levels')->nullable();
            $table->string('eobi_levels')->nullable();
            $table->string('insurance_levels')->nullable();
            $table->string('social_security_levels')->nullable();
            $table->string('salary_month_day')->nullable();
            $table->string('debit_salary_in_account')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('setting_configurations', function (Blueprint $table) {
            $table->dropColumn([
                'salary_Levels',
                'salary_payable_levels',
                'wages_levels',
                'wages_payable_levels',
                'penalty_levels',
                'incentive_levels',
                'eobi_levels',
                'insurance_levels',
                'social_security_levels',
                'salary_month_day',
                'debit_salary_in_account',
            ]);
        });
    }
}
