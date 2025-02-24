<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropStaffAgreementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('staff_agreements');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('staff_agreements', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 255)->collation('utf8mb4_unicode_ci');
            $table->timestamps();
        });
    }
}
