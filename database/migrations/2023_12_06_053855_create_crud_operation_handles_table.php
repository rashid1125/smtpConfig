<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCrudOperationHandlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('crud_operation_handles', function (Blueprint $table) {
            $table->id();
            $table->string('user_session_id');
            $table->string('table_name');
            $table->string('vrnoa');
            $table->string('etype');
            $table->unsignedBigInteger('financial_year_id');
            $table->unsignedBigInteger('company_id');
            $table->json('model_data');
            $table->unsignedBigInteger('user_id');
            $table->timestamp('post_date');
            $table->string('action');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('crud_operation_handles');
    }
}
