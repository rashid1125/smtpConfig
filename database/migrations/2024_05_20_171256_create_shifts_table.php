<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShiftsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable()->collation('utf8mb4_general_ci');
            $table->time('time_in')->nullable();
            $table->time('time_out')->nullable();
            $table->tinyInteger('is_rest_time')->nullable()->default(0);
            $table->time('rest_time_in')->nullable();
            $table->time('rest_time_out')->nullable();
            $table->integer('shift_hours')->nullable();
            $table->unsignedBigInteger('uid')->nullable();
            $table->unsignedBigInteger('fn_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->index('company_id', 'FK_shifts_companies');
            $table->foreign('company_id', 'FK_shifts_companies')
                ->references('company_id')->on('companies')
                ->onUpdate('restrict')
                ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shifts');
    }
}
