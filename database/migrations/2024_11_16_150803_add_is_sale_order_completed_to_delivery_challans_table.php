<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsSaleOrderCompletedToDeliveryChallansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('delivery_challans', function (Blueprint $table) {
            $table->boolean('is_sale_order_completed')->default(0)->after('is_post')->comment('0 = No, 1 = Yes');
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
            $table->dropColumn('is_sale_order_completed');
        });
    }
}
