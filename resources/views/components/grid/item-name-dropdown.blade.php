<div {{ $attributes->merge(['class' => 'col-4']) }}>
  <div class="row mt-0">
    <div class="col-md-9">
      <x-label for="gridItemNameDropdown">Item <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></x-label>
    </div>
    <div class="col-md-3">
      <x-button.button class="text-primary getItemLookUpRecord float-right mb-2 mr-2 flex-1" buttonIcone="true" iconeClass="{{ __('fa fa-search fa-1x') }}" title="Search Item's! (F2)"></x-button>
    </div>
  </div>
  <select class="form-control select2" id="gridItemNameDropdown" data-width="100%">
  </select>
  <input type="hidden" id="txtRequisitionNumber">
  <input type="hidden" id="stockKeepingMethodId">
  <input type="hidden" id="calculationOn">
  <input type="hidden" id="rateTypeIsMultiplier">
</div>
