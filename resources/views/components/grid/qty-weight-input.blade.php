{{-- Assuming you pass $stockKeepingMethodId variable to this component --}}
@if ($stockKeepingMethodId == 1)
    <div class="col-md-1">
        <x-label for="gridItemQty">Qty <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></x-label>
        <x-input type="text" class="form-input-class is_numeric" id="gridItemQty" placeholder="Qty" title="Qty" />
    </div>
@elseif ($stockKeepingMethodId == 2)
    <div class="col-md-1">
        <x-label for="gridItemWeight">Weight <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></x-label>
        <x-input type="text" class="form-input-class is_numeric" id="gridItemWeight" placeholder="Weight" title="Weight" />
    </div>
@else
    <div class="col-md-1">
        <x-label for="gridItemQty">Qty <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></x-label>
        <x-input type="text" class="form-input-class is_numeric" id="gridItemQty" placeholder="Qty" title="Qty"/>
    </div>
    <div class="col-md-1">
        <x-label for="gridItemWeight">Weight <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></x-label>
        <x-input type="text" class="form-input-class is_numeric" id="gridItemWeight" placeholder="Weight" title="Weight"/>
    </div>
@endif
