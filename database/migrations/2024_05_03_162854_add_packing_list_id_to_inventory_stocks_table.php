<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPackingListIdToInventoryStocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('inventory_stocks', function (Blueprint $table) {
            // Assuming packing_list_id is an unsigned integer
            $table->unsignedBigInteger('packing_list_id')->after('id')->nullable()->after('finished_item_id');
            // Optionally, add a foreign key constraint
            $table->foreign('packing_list_id')->references('id')->on('packing_lists')->onDelete('cascade');
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
            $table->dropForeign(['packing_list_id']);
            $table->dropColumn('packing_list_id');
        });
    }
}
