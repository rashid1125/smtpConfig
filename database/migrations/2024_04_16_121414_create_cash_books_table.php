<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCashBooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cash_books', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->date('vrdate')->nullable(false);
            $table->bigInteger('vrnoa')->nullable(false);
            $table->unsignedBigInteger('cash_account_id')->nullable(false);
            $table->tinyInteger('is_post')->default(1);
            $table->unsignedBigInteger('uid')->nullable(false);
            $table->unsignedBigInteger('fn_id')->nullable(false);
            $table->unsignedBigInteger('company_id')->nullable(false);
            $table->dateTime('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            // Foreign keys
            $table->foreign('company_id', 'FK_cash_books_companies_id')
                ->references('company_id')->on('companies')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('fn_id', 'FK_cash_books_financial_years')
                ->references('fn_id')->on('financial_years')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('cash_account_id', 'FK_cash_books_parties')
                ->references('pid')->on('parties')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('uid', 'FK_cash_books_users')
                ->references('id')->on('users')
                ->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cash_books');
    }
}
