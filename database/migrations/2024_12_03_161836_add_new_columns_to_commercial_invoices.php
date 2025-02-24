<?php

use App\Models\ExportModules\CommercialInvoice;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNewColumnsToCommercialInvoices extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('commercial_invoices', function (Blueprint $table) {
            $table->string(CommercialInvoice::INVOICE_NUMBER)->nullable()->after('customer_mobile')->comment('Invoice Number');
            $table->string(CommercialInvoice::CONTAINER_NUMBER)->nullable()->after('invoice_number')->comment('Container Number');
            $table->string(CommercialInvoice::PAYMENT_TERMS)->nullable()->after('container_number')->comment('Payment Terms');
            $table->string(CommercialInvoice::DELIVERY_TERMS)->nullable()->after('payment_terms')->comment('Delivery Terms');
            $table->decimal(CommercialInvoice::FREIGHT_AMOUNT_FCY, 20, 3)->nullable()->comment('Freight Amount FCY')->after('freight_amount');
            $table->decimal(CommercialInvoice::FREIGHT_AMOUNT_LCY, 20, 3)->nullable()->comment('Freight Amount LCY')->after(CommercialInvoice::FREIGHT_AMOUNT_FCY);
            $table->decimal(CommercialInvoice::DISCOUNT_FCY, 20, 3)->nullable()->comment('Discount FCY')->after(CommercialInvoice::FREIGHT_AMOUNT_LCY);
            $table->decimal(CommercialInvoice::DISCOUNT_AMOUNT_FCY, 20, 3)->nullable()->comment('Discount Amount FCY')->after(CommercialInvoice::DISCOUNT_FCY);
            $table->decimal(CommercialInvoice::EXPENSE_FCY, 20, 3)->nullable()->comment('Expense FCY')->after(CommercialInvoice::DISCOUNT_AMOUNT_FCY);
            $table->decimal(CommercialInvoice::EXPENSE_AMOUNT_FCY, 20, 3)->nullable()->comment('Expense Amount FCY')->after(CommercialInvoice::EXPENSE_FCY);
            $table->decimal(CommercialInvoice::DISCOUNT_LCY, 20, 3)->nullable()->comment('Discount LCY')->after(CommercialInvoice::EXPENSE_AMOUNT_FCY);
            $table->decimal(CommercialInvoice::DISCOUNT_AMOUNT_LCY, 20, 3)->nullable()->comment('Discount Amount LCY')->after(CommercialInvoice::DISCOUNT_LCY);
            $table->decimal(CommercialInvoice::EXPENSE_LCY, 20, 3)->nullable()->comment('Expense LCY')->after(CommercialInvoice::DISCOUNT_AMOUNT_LCY);
            $table->decimal(CommercialInvoice::EXPENSE_AMOUNT_LCY, 20, 3)->nullable()->comment('Expense Amount LCY')->after(CommercialInvoice::EXPENSE_LCY);
            $table->decimal(CommercialInvoice::NET_AMOUNT_FCY, 20, 3)->nullable()->comment('Net Amount FCY')->after(CommercialInvoice::EXPENSE_AMOUNT_LCY);
            $table->decimal(CommercialInvoice::NET_AMOUNT_LCY, 20, 3)->nullable()->comment('Net Amount LCY')->after(CommercialInvoice::NET_AMOUNT_FCY);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('commercial_invoices', function (Blueprint $table) {
            $table->dropColumn(
                [
                    CommercialInvoice::INVOICE_NUMBER,
                    CommercialInvoice::CONTAINER_NUMBER,
                    CommercialInvoice::PAYMENT_TERMS,
                    CommercialInvoice::DELIVERY_TERMS,
                    CommercialInvoice::FREIGHT_AMOUNT_FCY,
                    CommercialInvoice::FREIGHT_AMOUNT_LCY,
                    CommercialInvoice::DISCOUNT_FCY,
                    CommercialInvoice::DISCOUNT_AMOUNT_FCY,
                    CommercialInvoice::EXPENSE_FCY,
                    CommercialInvoice::EXPENSE_AMOUNT_FCY,
                    CommercialInvoice::DISCOUNT_LCY,
                    CommercialInvoice::DISCOUNT_AMOUNT_LCY,
                    CommercialInvoice::EXPENSE_LCY,
                    CommercialInvoice::EXPENSE_AMOUNT_LCY,
                    CommercialInvoice::NET_AMOUNT_FCY,
                    CommercialInvoice::NET_AMOUNT_LCY,
                ]
            );
        });
    }
}
