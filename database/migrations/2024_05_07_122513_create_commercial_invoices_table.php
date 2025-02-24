<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommercialInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('commercial_invoices', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('vrnoa');
            $table->date('vrdate');
            $table->unsignedBigInteger('packing_list_id')->nullable();
            $table->unsignedBigInteger('party_id');
            $table->unsignedBigInteger('sale_officer_id')->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->unsignedBigInteger('port_of_discharge_id')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_mobile')->nullable();
            $table->string('prepared_by')->nullable();
            $table->decimal('currency_exchange_rate', 18, 2)->nullable();
            $table->decimal('commission_percentage', 18, 2)->nullable();
            $table->decimal('commission_amount', 18, 2)->nullable();
            $table->decimal('freight_amount', 20, 3)->default('0.000');
            $table->decimal('net_amount', 20, 3);
            $table->string('bilty_number', 255)->nullable();
            $table->date('bilty_date')->nullable();
            $table->unsignedBigInteger('transporter_id')->nullable();
            $table->integer('freight_type_id')->nullable();
            $table->boolean('is_post')->default(true);
            $table->unsignedBigInteger('uid');
            $table->unsignedBigInteger('fn_id');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();


            // Foreign keys and other table options, like indexes
            $table->foreign('packing_list_id')->references('id')->on('packing_lists')->onUpdate('CASCADE')->onDelete('CASCADE');
            $table->foreign('party_id')->references('pid')->on('parties');
            $table->foreign('sale_officer_id')->references('id')->on('officers');
            $table->foreign('currency_id')->references('id')->on('currencies');
            $table->foreign('port_of_discharge_id')->references('id')->on('port_of_discharges');
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
        Schema::dropIfExists('commercial_invoices');
    }
}
