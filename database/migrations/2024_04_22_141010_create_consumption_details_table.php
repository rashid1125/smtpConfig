<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConsumptionDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('consumption_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('consumption_id');
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->unsignedBigInteger('stock_keeping_method_id');
            $table->unsignedBigInteger('color_code_id');
            $table->unsignedBigInteger('rate_type_id');
            $table->decimal('division_factor', 10, 4);
            $table->string('work_detail')->nullable();
            $table->string('received_by')->nullable();
            $table->decimal('qty', 18, 3)->nullable();
            $table->decimal('weight', 18, 3)->nullable();
            $table->decimal('rate', 18, 3)->nullable();
            $table->decimal('gross_amount', 18, 3)->nullable();
            $table->string('detail_remarks')->nullable();


            $table->foreign('consumption_id', 'consumption_details_consumption_id')->references('id')->on('consumptions')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('color_code_id', 'consumption_details_color_code_id_foreign')->references('id')->on('color_codes')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('item_id', 'consumption_details_item_id_foreign')->references('item_id')->on('items')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('rate_type_id', 'consumption_details_rate_type_id_foreign')->references('id')->on('item_calculation_methods')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('stock_keeping_method_id', 'consumption_details_stock_keeping_method_id_foreign')->references('id')->on('stock_keeping_methods')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('warehouse_id', 'consumption_details_warehouse_id_foreign')->references('did')->on('departments')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('consumption_details');
    }
}
