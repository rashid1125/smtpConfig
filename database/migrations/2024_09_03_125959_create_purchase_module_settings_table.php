<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchaseModuleSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchase_module_settings', function ( Blueprint $table ) {
            $table->id();
            $table->integer('grid_type')->default(0)->nullable();
            $table->boolean('show_other_information')->default(true);
            $table->boolean('show_stock_information')->default(true);
            $table->boolean('show_last_5_purchase_rate')->default(true);
            $table->boolean('show_account_information')->default(true);
            $table->boolean('show_item_information')->default(true);
            $table->boolean('show_item_stock_keeping_type')->default(true);
            $table->boolean('grid_rate_type')->default(true);
            $table->boolean('further_tax')->nullable()->default(true);
            $table->unsignedBigInteger('stock_keeping_method_id')->default(1);
            $table->timestamps();

            $table->foreign('stock_keeping_method_id')->references('id')->on('stock_keeping_methods');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('purchase_module_settings');
    }
}
