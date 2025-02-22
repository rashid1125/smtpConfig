<?php

use App\Models\Company;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create(Company::tableName(), function (Blueprint $table) {
            $table->id();
            $table->string(Company::COMPANY_NAME);
            $table->string(Company::CONTACT_PERSON);
            $table->boolean(Company::COMPANY_STATUS);
            $table->date(Company::COMPANY_EXPIRY_DATE);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_companies');
    }
};
