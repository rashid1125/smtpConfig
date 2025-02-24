<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleReturnInvoiceDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_return_invoice_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sale_return_invoice_id')->nullable();
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

            // Foreign Keys
            $table->foreign('sale_return_invoice_id', 'foreign_sale_return_invoice_id')->references('id')->on('sale_return_invoices')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('color_code_id', 'sale_return_invoice_details_color_code_id_foreign')->references('id')->on('color_codes')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('item_id', 'sale_return_invoice_details_item_id_foreign')->references('item_id')->on('items')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('item_price_list_id', 'sale_return_invoice_details_item_price_list_id_foreign')->references('id')->on('item_price_lists')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('rate_type_id', 'sale_return_invoice_details_rate_type_id_foreign')->references('id')->on('item_calculation_methods')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('stock_keeping_method_id', 'sale_return_invoice_details_stock_keeping_method_id_foreign')->references('id')->on('stock_keeping_methods')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('warehouse_id', 'sale_return_invoice_details_warehouse_id_foreign')->references('did')->on('departments')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sale_return_invoice_details');
    }
}
