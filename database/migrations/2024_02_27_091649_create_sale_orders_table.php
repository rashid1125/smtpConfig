<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSaleOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sale_orders', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('vrnoa')->unsigned()->nullable();
            $table->date('vrdate')->nullable();
            $table->date('due_date')->nullable();
            $table->bigInteger('party_id')->unsigned()->nullable();
            $table->bigInteger('sale_officer_id')->unsigned()->nullable();
            $table->string('supplier_name', 255)->nullable();
            $table->string('supplier_mobile', 255)->nullable();
            $table->string('prepared_by', 255)->nullable();
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->decimal('discount_amount', 10, 3)->nullable();
            $table->decimal('expense_percentage', 5, 2)->nullable();
            $table->decimal('expense_amount', 10, 3)->nullable();
            $table->decimal('further_tax_percentage', 5, 2)->nullable();
            $table->decimal('further_tax_amount', 10, 3)->nullable();
            $table->decimal('net_amount', 20, 3)->nullable();
            $table->tinyInteger('is_post')->default(1)->nullable();
            $table->bigInteger('uid')->unsigned()->nullable();
            $table->bigInteger('fn_id')->unsigned()->nullable();
            $table->bigInteger('company_id')->unsigned()->nullable();
            $table->bigInteger('created_by')->unsigned()->nullable();
            $table->dateTime('created_at')->nullable();
            $table->bigInteger('updated_by')->unsigned()->nullable();
            $table->dateTime('updated_at')->nullable();

            // Indexes
            $table->index('party_id', 'FK_sale_orders_parties');
            $table->index('sale_officer_id', 'FK_sale_orders_officers');
            $table->index('created_by', 'FK_sale_orders_users');
            $table->index('fn_id', 'FK_sale_orders_financial_years');
            $table->index('company_id', 'FK_sale_orders_companies');

            // Foreign Keys
            $table->foreign('party_id', 'FK_sale_orders_parties')->references('pid')->on('parties')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('sale_officer_id', 'FK_sale_orders_officers')->references('id')->on('officers')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('created_by', 'FK_sale_orders_users')->references('id')->on('users')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('fn_id', 'FK_sale_orders_financial_years')->references('fn_id')->on('financial_years')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('company_id', 'FK_sale_orders_companies')->references('company_id')->on('companies')->onUpdate('RESTRICT')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sale_orders', function (Blueprint $table) {
            // Drop foreign keys constraints
            $table->dropForeign('FK_sale_orders_parties');
            $table->dropForeign('FK_sale_orders_officers');
            $table->dropForeign('FK_sale_orders_users');
            $table->dropForeign('FK_sale_orders_financial_years');
            $table->dropForeign('FK_sale_orders_companies');

            // Drop the table
            $table->drop();
        });
    }
}
