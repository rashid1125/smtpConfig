<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserLogActivitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_log_activities', function (Blueprint $table) {
            $table->id();
            $table->string('user_session_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('financialyear_id');
            $table->unsignedBigInteger('company_id');
            $table->string('vrnoa');
            $table->string('etype');
            $table->string('function_name');
            $table->string('controller_name');
            $table->string('action_name');
            $table->unsignedBigInteger('log_details_id');
            $table->timestamps();

            $table->foreign('log_details_id')->references('id')->on('user_log_details')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_log_activities');
    }
}
