<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReturnInwardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('return_inwards', function (Blueprint $table) {
            $table->id();
            $table->date('vrdate');
            $table->bigInteger('vrnoa');
            $table->unsignedBigInteger('party_id');
            $table->unsignedBigInteger('sale_officer_id')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_mobile')->nullable();
            $table->string('prepared_by')->nullable();
            $table->string('vehicle_number')->nullable();
            $table->string('driver_name')->nullable();
            $table->text('remarks')->nullable();
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->decimal('discount_amount', 18, 3)->nullable();
            $table->decimal('expense_percentage', 5, 2)->nullable();
            $table->decimal('expense_amount', 18, 3)->nullable();
            $table->decimal('further_tax_percentage', 5, 2)->nullable();
            $table->decimal('further_tax_amount', 18, 3)->nullable();
            $table->decimal('commission_percentage', 5, 2)->nullable();
            $table->decimal('freight_amount', 18, 3)->nullable();
            $table->decimal('net_amount', 20, 3)->nullable();
            $table->date('bilty_date')->nullable();
            $table->string('bilty_number')->nullable();
            $table->unsignedBigInteger('transporter_id')->nullable();
            $table->unsignedBigInteger('freight_type_id')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('updated_by');
            $table->unsignedBigInteger('uid');
            $table->unsignedBigInteger('fn_id');
            $table->unsignedBigInteger('company_id');
            $table->tinyInteger('is_post')->default(1);
            $table->timestamps();

            // Foreign keys
            $table->foreign('party_id')->references('pid')->on('parties')->onDelete('RESTRICT');
            $table->foreign('sale_officer_id')->references('id')->on('officers')->onDelete('RESTRICT');
            $table->foreign('transporter_id')->references('transporter_id')->on('transporters')->onDelete('RESTRICT');
            $table->foreign('company_id')->references('company_id')->on('companies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('return_inwards');
    }
}
