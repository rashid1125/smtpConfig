<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOpeningBalanceDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('opening_balance_details', function (Blueprint $table) {
            if (!Schema::hasTable('opening_balance_details')) {
            $table->id();
            $table->bigInteger('opening_balance_id')->unsigned()->nullable();
            $table->bigInteger('party_id')->unsigned()->nullable();
            $table->decimal('debit', 20, 3)->nullable();
            $table->decimal('credit', 20, 3)->nullable();
            $table->text('remarks')->nullable();

            // Indexes for foreign keys
            $table->index('opening_balance_id', 'FK_opening_balance_id');
            $table->index('party_id', 'FK_opening_balance_details_parties');

            // Foreign key constraints
            $table->foreign('opening_balance_id', 'FK_opening_balance_id')->references('id')->on('opening_balances')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign('party_id', 'FK_opening_balance_details_parties')->references('pid')->on('parties')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('opening_balance_details');
    }
}
