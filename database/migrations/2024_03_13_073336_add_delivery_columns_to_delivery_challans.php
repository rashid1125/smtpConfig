<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeliveryColumnsToDeliveryChallans extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('delivery_challans', function (Blueprint $table) {
            $table->string('vehicle_number')->nullable();
            $table->string('driver_name')->nullable();
            $table->text('remarks')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('delivery_challans', function (Blueprint $table) {
            $table->dropColumn('vehicle_number');
            $table->dropColumn('driver_name');
            $table->dropColumn('remarks');
        });
    }
}
