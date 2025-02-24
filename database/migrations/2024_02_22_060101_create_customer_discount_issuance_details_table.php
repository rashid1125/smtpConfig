<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomerDiscountIssuanceDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customer_discount_issuance_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_discount_issuance_id')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('item_id')->nullable();
            $table->decimal('discount_percentage', 8, 2)->unsigned()->nullable();
            $table->timestamps();

            // Define indexes
            $table->index('customer_discount_issuance_id', 'FK_customer_discount_issuance_details_c_d_i');
            $table->index('customer_id', 'FK_customer_discount_issuance_details_parties');
            $table->index('item_id', 'FK_customer_discount_issuance_details_items');

            // Define foreign keys
            $table->foreign('customer_discount_issuance_id', 'FK_customer_discount_issuance_details_c_d_i')
                ->references('id')->on('customer_discount_issuances')
                ->onUpdate('cascade')->onDelete('cascade');

            $table->foreign('item_id', 'FK_customer_discount_issuance_details_items')
                ->references('item_id')->on('items')
                ->onUpdate('restrict')->onDelete('restrict');

            $table->foreign('customer_id', 'FK_customer_discount_issuance_details_parties')
                ->references('pid')->on('parties')
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
        Schema::table('customer_discount_issuance_details', function (Blueprint $table) {
            // Drop foreign key constraints
            $table->dropForeign('FK_customer_discount_issuance_details_c_d_i');
            $table->dropForeign('FK_customer_discount_issuance_details_items');
            $table->dropForeign('FK_customer_discount_issuance_details_parties');

            // Drop indexes
            $table->dropIndex('FK_customer_discount_issuance_details_c_d_i');
            $table->dropIndex('FK_customer_discount_issuance_details_parties');
            $table->dropIndex('FK_customer_discount_issuance_details_items');
        });

        Schema::dropIfExists('customer_discount_issuance_details');
    }
}
