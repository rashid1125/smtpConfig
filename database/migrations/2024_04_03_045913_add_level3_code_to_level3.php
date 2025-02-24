<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLevel3CodeToLevel3 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('level3', function (Blueprint $table) {
            $table->unsignedBigInteger('level3_code')->nullable()->after('l3');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('level3', function (Blueprint $table) {
            $table->dropColumn('level3_code');
        });
    }
}
