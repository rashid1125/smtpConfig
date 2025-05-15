<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWhiteListIpsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('white_list_ips', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address')->unique();
            $table->boolean('status')->default(1);
            $table->timestamps();
        });
        
        // Insert default whitelisted IPs
        DB::table('white_list_ips')->insert([
            ['ip_address' => '51.195.139.2', 'status' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['ip_address' => '127.0.0.1', 'status' => 1, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('white_list_ips');
    }
}
