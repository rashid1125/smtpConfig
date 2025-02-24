<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColorCodeIdToExportQuotationDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('export_quotation_details', function (Blueprint $table) {
            $table->unsignedBigInteger('color_code_id')->nullable()->after('currency_id');
            $table->foreign('color_code_id')->references('id')->on('color_codes');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('export_quotation_details', function (Blueprint $table) {
            $table->dropForeign(['color_code_id']); // Proper way to remove a foreign key
            $table->dropColumn('color_code_id');
        });
    }
}
