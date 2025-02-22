@if ($moduleSettings->grid_rate_type)
    @if (isset($isSale) && $isSale)
        <div {{ $attributes->merge(['class' => 'col-md-2']) }}>
            <x-label for="gridItemRateTypeDropdown">Rate Type</x-label>
            <select class="form-control select2" id="gridItemRateTypeDropdown" data-width="100%">
                {{-- Add options here --}}
            </select>
            <input type='hidden' id="rateTypeDivisionFactor">
        </div>
    @else
        <div {{ $attributes->merge(['class' => 'col-md-2']) }}>
            <x-label for="gridItemRateTypeDropdown">Rate Type</x-label>
            <select class="form-control select2" id="gridItemRateTypeDropdown" data-width="100%">
                {{-- Add options here --}}
            </select>
            <input type='hidden' id="rateTypeDivisionFactor">
        </div>
    @endif
    <div {{ $attributes->merge(['class' => 'col-md-1']) }}>
        <x-label for="gridItemRatePerKG">Rate / KG</x-label>
        <x-input type="text" class="is_numeric" id="gridItemRatePerKG" />
    </div>
@endif
