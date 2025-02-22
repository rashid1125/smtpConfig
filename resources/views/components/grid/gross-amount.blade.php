{{-- resources/views/components/grid/gross-amount.blade.php --}}
<div {{ $attributes->merge(['class' => 'col-md-2']) }}>
  <x-label for="gridItemGAmount">Gross Amount <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></x-label>
  <x-input type="text" class="form-input-class is_numeric readonly" id="gridItemGAmount" readonly />
</div>