<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReturnInwardDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('return_inward_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('return_inward_id');
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('stock_keeping_method_id');
            $table->unsignedBigInteger('rate_type_id');
            $table->unsignedBigInteger('item_price_list_id');
            $table->unsignedBigInteger('color_code_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->decimal('qty',18,3);
            $table->decimal('weight', 18, 3);
            $table->decimal('rate', 18, 3)->nullable();
            $table->decimal('rate_per_kg', 18, 3)->nullable();
            $table->decimal('gross_amount', 18, 3)->nullable();
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->decimal('discount_per_unit', 18, 3)->nullable();
            $table->decimal('discount_amount', 18, 3)->nullable();
            $table->decimal('rate_per_unit', 18, 3)->nullable();
            $table->decimal('amount_excl_tax', 18, 3)->nullable();
            $table->decimal('tax_percentage', 5, 2)->nullable();
            $table->decimal('tax_amount', 18, 3)->nullable();
            $table->decimal('amount_incl_tax', 18, 3)->nullable();
            $table->decimal('division_factor', 18, 3)->nullable();
            $table->text('detail_remarks')->nullable();
            $table->timestamps();


            $table->foreign('return_inward_id')->references('id')->on('return_inwards')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('item_id')->references('item_id')->on('items')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('stock_keeping_method_id')->references('id')->on('stock_keeping_methods')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('rate_type_id')->references('id')->on('item_calculation_methods')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('item_price_list_id')->references('id')->on('item_price_lists')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('color_code_id')->references('id')->on('color_codes')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('warehouse_id')->references('did')->on('departments')->onDelete('restrict')->onUpdate('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('return_inward_details');
    }
}
