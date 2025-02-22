{{-- rate-input.blade.php --}}
<div {{ $attributes->merge(['class' => 'col-md-1']) }}>
    <x-label for="gridItemRate">Rate <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></x-label>
    <x-input type="text" class="form-input-class rate-dec is_numeric" id="gridItemRate" />
</div>
