<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUniqueConstraintOnChequeListNumberToChequeHistories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cheque_histories', function (Blueprint $table) {
            // Add the unique constraint on cheque_list_number, cheque_receive_id, and export_invoice_receiving_id
            $table->unique(['cheque_list_number', 'cheque_receive_id', 'export_invoice_receiving_id'], 'unique_cheque_list_number_combination');
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
            $table->dropUnique('unique_cheque_list_number_combination');
        });
    }
}
