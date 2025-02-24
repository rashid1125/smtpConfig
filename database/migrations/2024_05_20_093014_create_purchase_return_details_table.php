<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchaseReturnDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchase_return_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purchase_return_id');
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('rate_type_id');
            $table->unsignedBigInteger('warehouse_id');
            $table->unsignedBigInteger('stock_keeping_method_id');
            $table->decimal('division_factor', 20, 3);
            $table->decimal('qty', 20, 3)->nullable();
            $table->decimal('weight', 20, 3)->nullable();
            $table->decimal('rate', 20, 3)->nullable();
            $table->decimal('rate_per_kg', 20, 3)->nullable();
            $table->decimal('gross_amount', 20, 3)->nullable();
            $table->decimal('discount_percentage', 20, 2)->nullable();
            $table->decimal('discount_per_unit', 20, 3)->nullable();
            $table->decimal('discount_amount', 20, 3)->nullable();
            $table->decimal('rate_per_unit', 20, 3)->nullable();
            $table->decimal('amount_excl_tax', 20, 3)->nullable();
            $table->decimal('tax_percentage', 20, 2)->nullable();
            $table->decimal('tax_amount', 20, 3)->nullable();
            $table->decimal('amount_incl_tax', 20, 3)->nullable();
            $table->text('detail_remarks')->nullable();

            // Add foreign key constraints
            $table->foreign('purchase_return_id')->references('id')->on('purchase_returns')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('item_id')->references('item_id')->on('items')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('warehouse_id')->references('did')->on('departments')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('stock_keeping_method_id')->references('id')->on('stock_keeping_methods')->onDelete('restrict')->onUpdate('restrict');
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
        Schema::dropIfExists('purchase_return_details');
    }
}
