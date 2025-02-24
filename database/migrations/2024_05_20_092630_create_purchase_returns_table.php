<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchaseReturnsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchase_returns', function (Blueprint $table) {
            $table->id();
            $table->date('vrdate');
            $table->string('vrnoa');
            $table->unsignedBigInteger('return_outward_id')->nullable();
            $table->unsignedBigInteger('party_id');
            $table->unsignedBigInteger('purchase_officer_id')->nullable();
            $table->string('supplier_name')->nullable();
            $table->string('supplier_mobile')->nullable();
            $table->string('prepared_by')->nullable();
            $table->decimal('discount_percentage', 20, 2)->nullable();
            $table->decimal('discount_amount', 20, 3)->nullable();
            $table->decimal('expense_percentage', 20, 2)->nullable();
            $table->decimal('expense_amount', 20, 3)->nullable();
            $table->decimal('further_tax_percentage', 20, 2)->nullable();
            $table->decimal('further_tax_amount', 20, 3)->nullable();
            $table->decimal('freight_amount', 20, 3)->nullable();
            $table->decimal('net_amount', 20, 3)->nullable();
            $table->string('bilty_number')->nullable();
            $table->date('bilty_date')->nullable();
            $table->unsignedBigInteger('transporter_id')->nullable();
            $table->unsignedBigInteger('freight_type_id')->nullable();
            $table->string('uid');
            $table->unsignedBigInteger('fn_id');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_post')->default(true);
            $table->timestamps();

            // Add foreign key constraints with explicit column references
            $table->foreign('return_outward_id')->references('id')->on('return_outwards')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('party_id')->references('pid')->on('parties');
            $table->foreign('purchase_officer_id')->references('id')->on('officers');
            $table->foreign('transporter_id')->references('transporter_id')->on('transporters');
            $table->foreign('fn_id')->references('fn_id')->on('financial_years');
            $table->foreign('company_id')->references('company_id')->on('companies');
            // Adding foreign key constraints
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('purchase_returns');
    }
}
