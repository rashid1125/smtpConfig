<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveColumnsFromExportInvoiceReceivingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('export_invoice_receivings', function (Blueprint $table) {
            $table->dropColumn([
                'converted_amount',
                'cash_bank_amount',
                'cheques_amount',
                'difference'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('export_invoice_receivings', function (Blueprint $table) {
            $table->decimal('converted_amount', 20, 2)->nullable();
            $table->decimal('cash_bank_amount', 20, 2)->nullable();
            $table->decimal('cheques_amount', 20, 2)->nullable();
            $table->decimal('difference', 20, 2)->nullable();
        });
    }
}
