<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommercialInvoiceDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('commercial_invoice_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('commercial_invoice_id')->unsigned()->nullable();
            $table->bigInteger('item_id')->unsigned();
            $table->bigInteger('stock_keeping_method_id')->unsigned();
            $table->bigInteger('rate_type_id')->unsigned();
            $table->bigInteger('color_code_id')->unsigned();
            $table->bigInteger('currency_id')->unsigned();
            $table->bigInteger('warehouse_id')->unsigned();
            $table->decimal('calculation_on', 18, 4)->unsigned()->nullable();
            $table->decimal('division_factor', 18, 4);
            $table->decimal('qty', 18, 3)->nullable();
            $table->decimal('weight', 18, 3)->nullable();
            $table->decimal('rate', 18, 3)->nullable();
            $table->decimal('rate_fcy', 18, 3)->nullable();
            $table->decimal('rate_per_kg', 18, 4)->nullable();
            $table->decimal('rate_per_kg_fcy', 18, 4)->nullable();
            $table->decimal('amount', 20, 3)->nullable();
            $table->decimal('amount_fcy', 20, 3)->nullable();
            $table->text('detail_remarks')->nullable();

            // Foreign key constraints
            $table->foreign('commercial_invoice_id')->references('id')->on('commercial_invoices')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign('item_id')->references('item_id')->on('items')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('stock_keeping_method_id')->references('id')->on('stock_keeping_methods')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('rate_type_id')->references('id')->on('item_calculation_methods')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('color_code_id')->references('id')->on('color_codes')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('currency_id')->references('id')->on('currencies')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('warehouse_id')->references('did')->on('departments')->onUpdate('RESTRICT')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('commercial_invoice_details');
    }
}
