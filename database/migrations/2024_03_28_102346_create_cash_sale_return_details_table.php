<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCashSaleReturnDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cash_sale_return_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cash_sale_return_id')->nullable();
            $table->unsignedBigInteger('item_id')->nullable();
            $table->unsignedBigInteger('warehouse_id')->nullable();
            $table->unsignedBigInteger('stock_keeping_method_id')->nullable();
            $table->unsignedBigInteger('item_price_list_id')->nullable();
            $table->unsignedBigInteger('color_code_id')->nullable();
            $table->decimal('qty', 10, 3)->nullable();
            $table->decimal('weight', 10, 3)->nullable();
            $table->decimal('rate', 10, 3)->nullable();
            $table->unsignedBigInteger('rate_type_id')->nullable();
            $table->decimal('division_factor', 10, 4)->nullable();
            $table->decimal('rate_per_kg', 10, 4)->nullable();
            $table->decimal('gross_amount', 20, 3)->nullable();
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->decimal('discount_per_unit', 10, 2)->nullable();
            $table->decimal('discount_amount', 20, 3)->nullable();
            $table->decimal('rate_per_unit', 10, 4)->nullable();
            $table->decimal('amount_excl_tax', 20, 3)->nullable();
            $table->decimal('tax_percentage', 5, 2)->nullable();
            $table->decimal('tax_amount', 20, 3)->nullable();
            $table->decimal('amount_incl_tax', 20, 3)->nullable();
            $table->text('detail_remarks')->nullable();
            $table->timestamps();
            $table->foreign('cash_sale_return_id','foreign_cash_sale_return_id')->references('id')->on('cash_sale_returns')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('item_id')->references('item_id')->on('items')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('warehouse_id')->references('did')->on('departments')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('stock_keeping_method_id')->references('id')->on('stock_keeping_methods')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('item_price_list_id')->references('id')->on('item_price_lists')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('color_code_id')->references('id')->on('color_codes')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('rate_type_id')->references('id')->on('item_calculation_methods')->onDelete('restrict')->onUpdate('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cash_sale_return_details');
    }
}
