<div class="card h-100">
    <div class="card-body">
        <div class="row">
            <x-discount-input />
            <x-expense-input />
            @if ($isTax)
                <x-tax-input />
            @endif
            <x-net-amount-input />
        </div>
    </div> <!-- end of row -->
</div>
