<?php

use App\Models\OtpDomain;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('otp_domains', function (Blueprint $table) {
            $table->id();
            $table->string(OtpDomain::OTP_DOMAIN_NAME)->nullable(false)->comment('Name of the domain');
            $table->string(OtpDomain::OTP_DOMAIN_URL)->nullable()->comment('URL of the domain');
            $table->string(OtpDomain::OTP_DOMAIN_ICON)->nullable()->comment('Icon of the domain');
            $table->string(OtpDomain::OTP_DOMAIN_TYPE)->nullable()->comment('Type of the domain');
            $table->string(OtpDomain::OTP_DOMAIN_DESC)->nullable()->comment('Description of the domain');
            $table->string(OtpDomain::OTP_DOMAIN_LOGO)->nullable()->comment('Logo of the domain');
            $table->string(OtpDomain::OTP_DOMAIN_CODE)->nullable()->comment('Code of the domain');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otp_domains');
    }
};
