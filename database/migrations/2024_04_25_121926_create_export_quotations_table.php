<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExportQuotationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('export_quotations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('vrnoa');
            $table->date('vrdate');
            $table->date('order_valid_till')->nullable();
            $table->unsignedBigInteger('party_id');
            $table->unsignedBigInteger('sale_officer_id')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_mobile')->nullable();
            $table->string('prepared_by')->nullable();
            $table->decimal('commission_percentage', 18, 2)->nullable();
            $table->decimal('net_amount', 20, 3);
            $table->boolean('is_post')->default(true);
            $table->unsignedBigInteger('uid');
            $table->unsignedBigInteger('fn_id');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();


            // Foreign keys and other table options, like indexes
            $table->foreign('party_id')->references('pid')->on('parties');
            $table->foreign('sale_officer_id')->references('id')->on('officers');
            $table->foreign('uid')->references('id')->on('users');
            $table->foreign('fn_id')->references('fn_id')->on('financial_years');
            $table->foreign('company_id')->references('company_id')->on('companies');

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
        Schema::dropIfExists('export_quotations');
    }
}
