<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddConsumptionIdToAccountsLedgersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            // Adding the consumption_id column as an unsigned big integer
            $table->unsignedBigInteger('consumption_id')->nullable()->after('opening_balance_id');
            // Optionally adding a foreign key constraint
            $table->foreign('consumption_id')->references('id')->on('consumptions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
              // If rolling back the migration, drop the foreign key first
              $table->dropForeign(['consumption_id']);
              $table->dropColumn('consumption_id');
        });
    }
}
