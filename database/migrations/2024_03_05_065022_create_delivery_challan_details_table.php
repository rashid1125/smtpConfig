<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDeliveryChallanDetailsTable extends Migration
{
    public function up()
    {
        Schema::create('delivery_challan_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_challan_id')->nullable()->constrained('delivery_challans')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('item_id')->nullable();
            $table->foreignId('warehouse_id')->nullable();
            $table->foreignId('stock_keeping_method_id')->nullable();
            $table->decimal('qty', 10, 3)->nullable();
            $table->decimal('weight', 10, 3)->nullable();
            $table->decimal('rate', 10, 3)->nullable();
            $table->foreignId('rate_type_id')->nullable();
            $table->foreignId('color_code_id')->nullable();
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

            // Define foreign keys and indexes
            $table->index(['delivery_challan_id', 'item_id', 'warehouse_id', 'stock_keeping_method_id'], 'delivery_challan_details_index');
        });
    }

    public function down()
    {
        Schema::dropIfExists('delivery_challan_details');
    }
}