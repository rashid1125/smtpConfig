<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCreditNotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('credit_notes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->date('vrdate')->nullable(false);
            $table->bigInteger('vrnoa')->nullable(false);
            $table->unsignedBigInteger('credit_account_id')->nullable(false);
            $table->unsignedBigInteger('debit_account_id')->nullable(false);
            $table->string('remarks', 255)->nullable();
            $table->tinyInteger('is_post')->default(1);
            $table->unsignedBigInteger('uid')->nullable(false);
            $table->unsignedBigInteger('fn_id')->nullable(false);
            $table->unsignedBigInteger('company_id')->nullable(false);
            $table->dateTime('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            // Foreign keys
            $table->foreign('company_id', 'FK_credit_notes_companies_id')
                ->references('company_id')->on('companies')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('fn_id', 'FK_credit_notes_financial_years')
                ->references('fn_id')->on('financial_years')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('credit_account_id', 'FK_credit_notes_parties')
                ->references('pid')->on('parties')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('debit_account_id', 'FK_credit_notes_parties_2')
                ->references('pid')->on('parties')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('uid', 'FK_credit_notes_users')
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
        Schema::dropIfExists('credit_notes');
    }
}
