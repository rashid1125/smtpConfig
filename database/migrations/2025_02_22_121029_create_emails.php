<?php

use App\Models\Email;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create(Email::tableName(), function (Blueprint $table) {
            $table->id();
            $table->string(Email::EMAIL_PROTOCOL)->comment('Email Protocol');
            $table->string(Email::EMAIL_USERNAME)->unique()->comment('Email Username');
            $table->string(Email::EMAIL_PASSWORD)->comment('Email Password');
            $table->string(Email::EMAIL_HOST)->comment('Email Host');
            $table->integer(Email::EMAIL_PORT)->comment('Email Port');
            $table->string(Email::EMAIL_ENCRYPTION)->comment('Email Encryption')->default('tls');
            $table->string(Email::EMAIL_FROM_EMAIL)->comment('Email From Name');
            $table->string(Email::EMAIL_DOMAIN_IDS)->comment('Email Domain Ids')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emails');
    }
};
