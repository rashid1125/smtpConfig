<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStockTransferDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock_transfer_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('stock_transfer_id')->nullable();
            $table->unsignedBigInteger('item_id')->nullable();
            $table->unsignedBigInteger('stock_keeping_method_id')->nullable();
            $table->unsignedBigInteger('color_code_id')->nullable();
            $table->unsignedBigInteger('warehouse_id')->nullable();
            $table->unsignedBigInteger('to_warehouse_id')->nullable();
            $table->decimal('qty', 18, 3)->nullable();
            $table->decimal('weight', 18, 3)->nullable();
            $table->string('detail_remarks', 255)->nullable();

            // Foreign keys and indices
            $table->foreign('stock_transfer_id', 'FK_stock_transfer_details_stock_transfers')
                ->references('id')->on('stock_transfers')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('item_id', 'FK_stock_transfer_details_items')
                ->references('item_id')->on('items')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('stock_keeping_method_id', 'FK_stock_transfer_details_stock_keeping_methods')
                ->references('id')->on('stock_keeping_methods')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('color_code_id', 'FK_stock_transfer_details_color_codes')
                ->references('id')->on('color_codes')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('warehouse_id', 'FK_stock_transfer_details_departments')
                ->references('did')->on('departments')
                ->onUpdate('restrict')->onDelete('restrict');
            $table->foreign('to_warehouse_id', 'FK_stock_transfer_details_departments_2')
                ->references('did')->on('departments')
                ->onUpdate('restrict')->onDelete('restrict');
            // $table->index(['stock_transfer_id', 'item_id', 'stock_keeping_method_id', 'color_code_id', 'warehouse_id', 'to_warehouse_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stock_transfer_details');
    }
}
