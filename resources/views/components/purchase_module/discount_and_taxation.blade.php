<div class="card h-100">
    <div class="card-body">
        <div class="row">
            @include('components.voucher_discount')
            @include('components.voucher_expense')
            @if ($purchaseModuleSettings->further_tax)
                @include('components.purchase_module.voucher_tax')
            @endif
            @include('components.purchase_module.voucher_net_amount')
        </div>
    </div> <!-- end of row -->
</div>
