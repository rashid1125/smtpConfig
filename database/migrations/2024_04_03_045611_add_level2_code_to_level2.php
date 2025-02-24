<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLevel2CodeToLevel2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('level2', function (Blueprint $table) {
            $table->unsignedBigInteger('level2_code')->nullable()->after('l2');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('level2', function (Blueprint $table) {
            $table->dropColumn('level2_code');
        });
    }
}
