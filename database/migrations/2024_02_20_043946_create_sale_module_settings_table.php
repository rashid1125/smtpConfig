<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleModuleSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_module_settings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('grid_type')->nullable()->default(0);
            $table->boolean('show_other_information')->nullable()->default(true);
            $table->boolean('show_stock_information')->nullable()->default(true);
            $table->boolean('show_last_5_purchase_rate')->nullable()->default(true);
            $table->boolean('show_account_information')->nullable()->default(true);
            $table->boolean('show_item_information')->nullable()->default(true);
            $table->boolean('show_item_stock_keeping_type')->nullable()->default(true);
            $table->tinyInteger('grid_rate_type')->unsigned()->nullable()->default(1);
            $table->tinyInteger('further_tax')->unsigned()->nullable()->default(1);
            $table->bigInteger('stock_keeping_method_id')->unsigned()->nullable()->default(1);
            $table->engine = 'InnoDB';
            $table->collation = 'utf8mb4_general_ci';
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sale_module_settings');
    }
}
