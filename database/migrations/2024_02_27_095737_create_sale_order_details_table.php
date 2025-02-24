<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleOrderDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_order_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('sale_order_id')->unsigned()->nullable();
            $table->bigInteger('item_id')->unsigned()->nullable();
            $table->bigInteger('item_price_list_id')->unsigned()->nullable();
            $table->bigInteger('stock_keeping_method_id')->unsigned()->nullable();
            $table->decimal('qty', 10, 3)->nullable();
            $table->decimal('weight', 10, 3)->nullable();
            $table->decimal('rate', 10, 3)->nullable();
            $table->bigInteger('rate_type_id')->unsigned()->nullable();
            $table->decimal('calculation_on', 10, 4)->unsigned()->nullable();
            $table->decimal('division_factor', 10, 4)->unsigned()->nullable();
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

            // Indexes for foreign keys
            $table->index('sale_order_id', 'FK_sale_order_details_sale_orders');
            $table->index('item_id', 'FK_sale_order_details_items');
            $table->index('item_price_list_id', 'FK_sale_order_details_item_price_lists');
            $table->index('stock_keeping_method_id', 'FK_sale_order_details_stock_keeping_methods');
            $table->index('rate_type_id', 'FK_sale_order_details_item_calculation_methods');

            // Foreign key constraints
            $table->foreign('sale_order_id', 'FK_sale_order_details_sale_orders')->references('id')->on('sale_orders')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign('item_id', 'FK_sale_order_details_items')->references('item_id')->on('items')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('item_price_list_id', 'FK_sale_order_details_item_price_lists')->references('id')->on('item_price_lists')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('stock_keeping_method_id', 'FK_sale_order_details_stock_keeping_methods')->references('id')->on('stock_keeping_methods')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('rate_type_id', 'FK_sale_order_details_item_calculation_methods')->references('id')->on('item_calculation_methods')->onUpdate('RESTRICT')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sale_order_details');
    }
}
