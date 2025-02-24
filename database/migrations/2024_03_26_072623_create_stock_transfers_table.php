<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStockTransfersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_transfers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->dateTime('vrdate')->nullable();
            $table->bigInteger('vrnoa')->nullable();
            $table->string('received_by')->nullable();
            $table->string('remarks')->nullable();
            $table->unsignedBigInteger('uid');
            $table->unsignedBigInteger('fn_id');
            $table->unsignedBigInteger('company_id');
            $table->dateTime('created_at')->nullable();
            $table->bigInteger('created_by')->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->bigInteger('updated_by')->nullable();
            $table->tinyInteger('is_post')->default('1');

            // Define foreign keys and indices
            $table->foreign('uid')->references('id')->on('users')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('fn_id')->references('fn_id')->on('financial_years')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('company_id')->references('company_id')->on('companies')
                ->onUpdate('restrict')->onDelete('restrict');

            $table->index('uid');
            $table->index('fn_id');
            $table->index('company_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stock_transfers');
    }
}
