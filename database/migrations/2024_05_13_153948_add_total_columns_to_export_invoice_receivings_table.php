<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTotalColumnsToExportInvoiceReceivingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('export_invoice_receivings', function (Blueprint $table) {
            $table->decimal('total_converted_amount', 20, 2)->nullable()->after('prepared_by');
            $table->decimal('total_reference_amount', 20, 2)->nullable()->after('total_converted_amount');
            $table->decimal('total_cheque_amount', 20, 2)->nullable()->after('total_reference_amount');
            $table->decimal('total_received_amount', 20, 2)->nullable()->after('total_cheque_amount');
            $table->decimal('total_difference_amount', 20, 2)->nullable()->after('total_received_amount');
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
            $table->dropColumn('total_converted_amount');
            $table->dropColumn('total_reference_amount');
            $table->dropColumn('total_cheque_amount');
            $table->dropColumn('total_received_amount');
            $table->dropColumn('total_difference_amount');
        });
    }
}
