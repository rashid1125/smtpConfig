<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdvanceReturnsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('advance_returns', function (Blueprint $table) {
            $table->id();
            $table->integer('vrnoa');
            $table->date('vrdate');
            $table->unsignedBigInteger('cash_account_id')->nullable();

            $table->string('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_post')->nullable()->default(1);
            $table->unsignedBigInteger('uid')->nullable();
            $table->unsignedBigInteger('fn_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();

            $table->foreign('cash_account_id')->references('pid')->on('parties')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('uid')->references('id')->on('users')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('fn_id')->references('fn_id')->on('financial_years')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('company_id')->references('company_id')->on('companies')->onDelete('restrict')->onUpdate('restrict');
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
        Schema::dropIfExists('advance_returns');
    }
}
