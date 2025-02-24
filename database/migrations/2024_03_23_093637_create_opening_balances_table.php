<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOpeningBalancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('opening_balances', function (Blueprint $table) {
            $table->id();
            $table->date('vrdate')->nullable();
            $table->bigInteger('vrnoa')->unsigned()->nullable();
            $table->decimal('net_amount', 20, 3)->nullable();
            $table->tinyInteger('is_post')->default(1)->nullable();
            $table->bigInteger('uid')->unsigned()->nullable();
            $table->bigInteger('fn_id')->unsigned()->nullable();
            $table->bigInteger('company_id')->unsigned()->nullable();
            $table->bigInteger('created_by')->unsigned()->nullable();
            $table->dateTime('created_at')->nullable();
            $table->bigInteger('updated_by')->unsigned()->nullable();
            $table->dateTime('updated_at')->nullable();

            // Indexes

            $table->index('created_by', 'FK_opening_balance_users');
            $table->index('fn_id', 'FK_opening_balance_financial_years');
            $table->index('company_id', 'FK_opening_balance_companies');

            // Foreign Keys

            $table->foreign('created_by', 'FK_opening_balance_users')->references('id')->on('users')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('fn_id', 'FK_opening_balance_financial_years')->references('fn_id')->on('financial_years')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('company_id', 'FK_opening_balance_companies')->references('company_id')->on('companies')->onUpdate('RESTRICT')->onDelete('RESTRICT');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('opening_balances', function (Blueprint $table) {
            // Drop foreign keys constraints

            $table->dropForeign('FK_opening_balance_users');
            $table->dropForeign('FK_opening_balance_financial_years');
            $table->dropForeign('FK_opening_balance_companies');

            // Drop the table
            $table->drop();
        });
    }
}
