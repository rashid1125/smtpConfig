<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameStaffAgreementIdToStaffAgreementListInStaffTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('staff', function (Blueprint $table) {
            $table->dropForeign(['staff_agreement_id']);
            $table->renameColumn('staff_agreement_id', 'staff_agreement_list');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('staff', function (Blueprint $table) {
            $table->renameColumn('staff_agreement_list', 'staff_agreement_id');
            $table->foreign('staff_agreement_id')->references('id')->on('staff_agreements');
        });
    }
}
