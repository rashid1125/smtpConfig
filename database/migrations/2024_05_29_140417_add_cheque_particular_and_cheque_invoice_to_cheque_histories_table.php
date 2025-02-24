<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddChequeParticularAndChequeInvoiceToChequeHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cheque_histories', function (Blueprint $table) {
            $table->string('cheque_particular')->nullable()->after('cheque_bank_name');
            $table->string('cheque_invoice')->nullable()->after('cheque_particular');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cheque_histories', function (Blueprint $table) {
            $table->dropColumn('cheque_particular');
            $table->dropColumn('cheque_invoice');
        });
    }
}
