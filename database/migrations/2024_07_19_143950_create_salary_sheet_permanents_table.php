<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalarySheetPermanentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('salary_sheet_permanents', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('vrnoa');
            $table->date('vrdate')->nullable();
            $table->date('from_date');
            $table->date('to_date');
            $table->string('salary_month')->nullable();
            $table->string('remarks')->nullable();
            $table->boolean('is_post')->default(true);
            $table->unsignedBigInteger('uid');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('fn_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            // foreign keys
            $table->foreign('uid')->references('id')->on('users');
            $table->foreign('company_id')->references('company_id')->on('companies');
            $table->foreign('fn_id')->references('fn_id')->on('financial_years');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('salary_sheet_permanents');
    }
}
