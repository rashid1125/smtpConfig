<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTallyColumnsToAccountsLedgersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            $table->dateTime('tallied_date_time')->nullable()->after('is_tallied'); // Adjust the 'after' part as needed
            $table->unsignedBigInteger('tallied_by')->nullable()->after('tallied_date_time');
            $table->dateTime('un_tallied_date_time')->nullable()->after('tallied_by');
            $table->unsignedBigInteger('un_tallied_by')->nullable()->after('un_tallied_date_time');
            // Foreign keys (optional, based on your database design)
            $table->foreign('tallied_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('un_tallied_by')->references('id')->on('users')->onDelete('set null');
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
            $table->dropForeign(['tallied_by']);
            $table->dropForeign(['un_tallied_by']);
            $table->dropColumn(['tallied_date_time', 'tallied_by', 'un_tallied_date_time', 'un_tallied_by']);
        });
    }
}
