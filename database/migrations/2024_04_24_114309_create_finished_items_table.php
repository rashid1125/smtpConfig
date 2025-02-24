<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFinishedItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('finished_items', function (Blueprint $table) {
            $table->id();
            $table->integer('vrnoa');
            $table->date('vrdate');
            $table->string('received_by')->nullable();
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('uid');
            $table->unsignedBigInteger('fn_id');
            $table->boolean('is_post')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            // Foreign keys and other table options, like indexes
            $table->foreign('company_id')->references('company_id')->on('companies');
            $table->foreign('uid')->references('id')->on('users');
            $table->foreign('fn_id')->references('fn_id')->on('financial_years')->onDelete('cascade');
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
        Schema::dropIfExists('finished_items');
    }
}
