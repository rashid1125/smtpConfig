{{-- resources/views/components/grid/discount-percentage.blade.php --}}
<div {{ $attributes->merge(['class' => 'col-md-1']) }}>
  <x-label for="gridItemDiscountPerUnit">Disc/Unit</x-label>
  <x-input type="text" class="form-input-class is_numeric" id="gridItemDiscountPerUnit" />
</div>