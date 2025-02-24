<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddExchangeGainLossToSettingConfigurationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('setting_configurations', function (Blueprint $table) {
            $table->unsignedBigInteger('exchange_gain_loss')->nullable()->after('commission_account');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('setting_configurations', function (Blueprint $table) {
            $table->dropColumn('exchange_gain_loss');
        });
    }
}
