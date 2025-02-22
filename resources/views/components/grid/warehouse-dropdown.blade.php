<div {{ $attributes->merge(['class' => 'col-4']) }}>
    <div class="row mt-0">
        <div class="col">
            <x-label for="{{ $elementId ?? 'gridItemWarehouseDropdown' }}">{{ $label ?? 'Warehouse' }} <sub
                    class="asterisk"><i class="fa fa-asterisk"></i></sub></x-label>
        </div>
    </div>
    <select class="form-control select2" id="{{ $elementId ?? 'gridItemWarehouseDropdown' }}" data-width="100%">
    </select>
</div>
