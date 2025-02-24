<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsReceivedToChequeHistories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cheque_histories', function (Blueprint $table) {
            $table->boolean('is_received')->default(false)->after('cheque_amount'); // Using `boolean` assuming 'is_received' is a true/false value
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('fn_id');

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('company_id')->references('company_id')->on('companies');
            $table->foreign('fn_id')->references('fn_id')->on('financial_years');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cheque_histories', function (Blueprint $table) {
            $table->dropColumn(['is_received', 'company_id', 'fn_id', 'user_id']);
        });
    }
}
