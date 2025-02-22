@if ($companies->tax)
    <div {{ $attributes->merge(['class' => 'col-md-1']) }}>
        <x-label for="gridItemTaxPercentage">Tax%</x-label>
        <x-input type="text" class="form-input-class is_numeric" id="gridItemTaxPercentage" />
    </div>
    <div {{ $attributes->merge(['class' => 'col-md-2']) }}>
        <x-label for="gridItemTaxAmount">Tax Amount</x-label>
        <x-input type="text" class="form-input-class is_numeric" id="gridItemTaxAmount" />
    </div>
    <div {{ $attributes->merge(['class' => 'col-md-2']) }}>
        <x-label for="gridItemAmountInclTax">Amount Incl Tax <sub class="asterisk"><i
                    class="fa fa-asterisk"></i></sub></x-label>
        <x-input type="text" class="form-input-class is_numeric readonly" id="gridItemAmountInclTax" readonly />
    </div>
@else
    <div {{ $attributes->merge(['class' => 'col-md-2']) }}>
        <x-label for="gridItemAmountInclTax">Net Amount <sub class="asterisk"><i
                    class="fa fa-asterisk"></i></sub></x-label>
        <x-input type="text" class="form-input-class is_numeric readonly" id="gridItemAmountInclTax" readonly />
    </div>
@endif
