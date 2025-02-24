<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddProformaStatusToExportProformasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('export_proformas', function (Blueprint $table) {
            $table->enum('proforma_status', ['pending', 'approved','unapproved'])->default('pending');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('export_proformas', function (Blueprint $table) {
            $table->dropColumn('proforma_status');
        });
    }
}
