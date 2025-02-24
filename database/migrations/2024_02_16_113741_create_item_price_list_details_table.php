<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemPriceListDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('item_price_list_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('item_price_list_id');
            $table->unsignedBigInteger('item_id');
            $table->decimal('retail_price', 8, 3);
            $table->decimal('wholesale_price', 8, 3);
            $table->decimal('distributor_price', 8, 3);
            $table->decimal('discount_percentage', 5, 3);
            $table->decimal('gst_percentage', 5, 3);
            $table->timestamps();
            $table->foreign('item_price_list_id')->references('id')->on('item_price_lists')->onDelete('cascade');
            // Assuming you have an `items` table for `item_id` foreign key
            $table->foreign('item_id')->references('item_id')->on('items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('item_price_list_details');
    }
}
