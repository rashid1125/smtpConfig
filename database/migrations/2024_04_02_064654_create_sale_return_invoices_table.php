<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleReturnInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_return_invoices', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('vrnoa')->nullable();
            $table->date('vrdate')->nullable();
            $table->date('due_date')->nullable();
            $table->integer('due_days')->nullable();
            $table->unsignedBigInteger('party_id')->nullable();
            $table->unsignedBigInteger('sale_officer_id')->nullable();
            $table->unsignedBigInteger('return_inward_id')->nullable();
            $table->string('customer_name', 255)->nullable();
            $table->string('customer_mobile', 255)->nullable();
            $table->string('prepared_by', 255)->nullable();
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->decimal('discount_amount', 10, 3)->nullable();
            $table->decimal('expense_percentage', 5, 2)->nullable();
            $table->decimal('expense_amount', 10, 3)->nullable();
            $table->decimal('further_tax_percentage', 5, 2)->nullable();
            $table->decimal('further_tax_amount', 10, 3)->nullable();
            $table->decimal('freight_amount', 20, 3)->nullable();
            $table->decimal('commission_percentage', 5, 3)->nullable();
            $table->decimal('commission_amount', 18, 3)->nullable();
            $table->decimal('net_amount', 20, 3)->nullable();
            $table->string('bilty_number', 255)->nullable();
            $table->date('bilty_date')->nullable();
            $table->unsignedBigInteger('transporter_id')->nullable();
            $table->integer('freight_type_id')->nullable();
            $table->tinyInteger('is_post')->nullable()->default('1');
            $table->unsignedBigInteger('uid')->nullable();
            $table->unsignedBigInteger('fn_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();


             // Foreign keys
             $table->foreign('company_id')->references('company_id')->on('companies')->onUpdate('restrict')->onDelete('restrict');
             $table->foreign('party_id')->references('pid')->on('parties')->onUpdate('restrict')->onDelete('restrict');
             $table->foreign('sale_officer_id')->references('id')->on('officers')->onUpdate('restrict')->onDelete('restrict');
             $table->foreign('return_inward_id')->references('id')->on('return_inwards')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sale_return_invoices');
    }
}
