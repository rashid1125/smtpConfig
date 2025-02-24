<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleOfficerCommissionAllotmentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_officer_commission_allotment_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sale_officer_commission_allotment_id')->nullable();
            $table->unsignedBigInteger('sale_officer_id')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->decimal('sale_commission_percentage', 8, 2)->unsigned()->nullable();
            $table->decimal('recovery_commission_percentage', 8, 2)->unsigned()->nullable();
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
        Schema::dropIfExists('sale_officer_commission_allotment_details');
    }
}
