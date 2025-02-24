<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_invoices', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('vrnoa')->nullable();
            $table->date('vrdate')->nullable();
            $table->date('due_date')->nullable();
            $table->integer('due_days')->nullable();
            $table->unsignedBigInteger('party_id')->nullable();
            $table->unsignedBigInteger('sale_officer_id')->nullable();
            $table->unsignedBigInteger('sale_order_id')->nullable();
            $table->unsignedBigInteger('delivery_challan_id')->nullable();
            $table->string('customer_name', 255)->nullable();
            $table->string('customer_mobile', 255)->nullable();
            $table->string('prepared_by', 255)->nullable();
            $table->decimal('discount_percentage', 5, 2)->default('0.00');
            $table->decimal('discount_amount', 10, 3)->default('0.000');
            $table->decimal('expense_percentage', 5, 2)->default('0.00');
            $table->decimal('expense_amount', 10, 3)->default('0.000');
            $table->decimal('further_tax_percentage', 5, 2)->default('0.00');
            $table->decimal('further_tax_amount', 10, 3)->default('0.000');
            $table->decimal('freight_amount', 20, 3)->default('0.000');
            $table->decimal('commission_percentage', 5, 3)->default('0.000');
            $table->decimal('commission_amount', 5, 3)->default('0.000');
            $table->decimal('net_amount', 20, 3)->default('0.000');
            $table->string('bilty_number', 255)->nullable();
            $table->date('bilty_date')->nullable();
            $table->unsignedBigInteger('transporter_id')->nullable();
            $table->integer('freight_type_id')->nullable();
            $table->tinyInteger('is_post')->nullable()->default('1');
            $table->unsignedBigInteger('uid')->nullable();
            $table->unsignedBigInteger('fn_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->dateTime('created_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->foreign('company_id')->references('company_id')->on('companies')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('party_id')->references('pid')->on('parties')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('sale_officer_id')->references('id')->on('officers')->onDelete('restrict')->onUpdate('restrict');
            $table->foreign('sale_order_id')->references('id')->on('sale_orders')->onDelete('cascade')->onUpdate('cascade');
            $table->index(['company_id', 'sale_order_id'], 'sale_invoices_company_id_foreign');
            $table->index(['party_id', 'company_id', 'sale_order_id'], 'sale_invoices_party_id_company_id_sale_order_id_index');
            $table->index('sale_officer_id', 'FK_sale_invoices_officers');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sale_invoices');
    }
}
