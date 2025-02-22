<?php

use App\Models\SettingConfiguration;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create(SettingConfiguration::tableName(), function (Blueprint $table) {
            $table->id();
            $table->integer(SettingConfiguration::FAILED_ATTEMPTS)->default(5)->comment('Failed Attempts');
            $table->integer(SettingConfiguration::TOKEN_EXPIRY_DAYS)->default(1)->comment('Token Expiry Days');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting_configurations');
    }
};
