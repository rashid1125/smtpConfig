<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateAttendanceStatusesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attendance_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('status')->unique();
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert the attendance status options
        DB::table('attendance_statuses')->insert([
            ['status' => 'Absent', 'description' => 'Absent from work'],
            ['status' => 'Gusted Holiday', 'description' => 'Official holiday'],
            ['status' => 'Outdoor', 'description' => 'Working outside the office'],
            ['status' => 'Paid Leave', 'description' => 'On paid leave'],
            ['status' => 'Present', 'description' => 'Present at work'],
            ['status' => 'Rest Day', 'description' => 'Official rest day'],
            ['status' => 'Short Leave', 'description' => 'Short leave during working hours'],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('attendance_statuses');
    }
}
