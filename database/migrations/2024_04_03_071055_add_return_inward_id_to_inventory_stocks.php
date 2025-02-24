<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddReturnInwardIdToInventoryStocks extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('inventory_stocks', function (Blueprint $table) {
            $table->unsignedBigInteger('return_inward_id')->nullable()->after('return_outward_id');
            $table->foreign('return_inward_id','inventory_stocks_return_inward_id')->references('id')->on('return_inwards')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('inventory_stocks', function (Blueprint $table) {
            $table->dropForeign(['inventory_stocks_return_inward_id']);
            $table->dropColumn('return_inward_id');
        });
    }
}
