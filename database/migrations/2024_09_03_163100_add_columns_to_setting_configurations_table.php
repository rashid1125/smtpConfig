<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToSettingConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('setting_configurations', function ( Blueprint $table ) {
            $table->unsignedBigInteger('default_stock_keeping_method')->default(1);  // Default value as 1 (Qty)
            $table->unsignedTinyInteger('default_rate_type')->default(1);            // Default value as 0
            $table->boolean('show_stock_keeping_method')->default(false);            // Default value as true (1)
            $table->boolean('show_rate_type')->default(false);                       // Default value as true (1)
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('setting_configurations', function ( Blueprint $table ) {
            $table->dropColumn('default_stock_keeping_method');
            $table->dropColumn('default_rate_type');
            $table->dropColumn('show_stock_keeping_method');
            $table->dropColumn('show_rate_type');
        });
    }
}

