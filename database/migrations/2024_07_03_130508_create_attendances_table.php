<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->integer('vrnoa');
            $table->date('vrdate');
            $table->date('from_date')->nullable();
            $table->date('to_date')->nullable();
            $table->boolean('is_auto_post')->default(false);
            $table->boolean('is_post')->default(false);

            $table->unsignedBigInteger('uid');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('fn_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();


            $table->foreign('uid')->references('id')->on('users');
            $table->foreign('company_id')->references('company_id')->on('companies');
            $table->foreign('fn_id')->references('fn_id')->on('financial_years');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
            $table->softDeletes();
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
        Schema::dropIfExists('attendances');
    }
}
