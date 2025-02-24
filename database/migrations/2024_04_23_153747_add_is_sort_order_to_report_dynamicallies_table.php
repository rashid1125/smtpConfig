<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsSortOrderToReportDynamicalliesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('report_dynamicallies', function (Blueprint $table) {
            $table->enum('is_sort_order', ['yes', 'no'])->default('yes');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('report_dynamicallies', function (Blueprint $table) {
            $table->dropColumn('is_sort_order');
        });
    }
}
