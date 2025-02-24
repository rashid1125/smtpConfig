<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsMultiplierToItemCalculationMethodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('item_calculation_methods', function (Blueprint $table) {
            $table->boolean('is_multiplier')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('item_calculation_methods', function (Blueprint $table) {
            $table->boolean('is_multiplier')->default(false);
        });
    }
}
