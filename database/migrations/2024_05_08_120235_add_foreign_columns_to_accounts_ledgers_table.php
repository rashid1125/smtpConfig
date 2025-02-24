<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignColumnsToAccountsLedgersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accounts_ledgers', function (Blueprint $table) {
            $table->text('foreign_description')->nullable()->after('credit');
            $table->decimal('foreign_debit', 20, 2)->nullable()->after('foreign_description');
            $table->decimal('foreign_credit', 20, 2)->nullable()->after('foreign_debit');
            $table->unsignedBigInteger('currency_id')->nullable()->after('foreign_credit');
            $table->foreign('currency_id')->references('id')->on('currencies');
            $table->boolean('is_foreign')->default(false)->after('un_tallied_by');
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
            $table->dropColumn(['foreign_description', 'foreign_credit', 'foreign_debit', 'currency_id','is_foreign']);
            $table->dropForeign(['currency_id']);
        });
    }
}
