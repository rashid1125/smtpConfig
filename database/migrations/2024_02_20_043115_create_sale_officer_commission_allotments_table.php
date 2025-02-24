<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleOfficerCommissionAllotmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_officer_commission_allotments', function (Blueprint $table) {
            $table->id();
            $table->date('vrdate')->nullable();
            $table->unsignedBigInteger('sale_officer_id')->nullable();
            $table->tinyInteger('active')->nullable()->default('1');
            $table->unsignedBigInteger('uid')->nullable();
            $table->unsignedBigInteger('fn_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sale_officer_commission_allotments');
    }
}
