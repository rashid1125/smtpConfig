<div {{ $attributes->merge(['class' => 'col-md-2']) }}>
    <div class="row mt-0">
        <div class="col-md-9">
            <x-label for="gridItemSubCategoryDropdown">Sub Category <sub class="asterisk"><i
                        class="fa fa-asterisk"></i></sub></x-label>
        </div>
    </div>
    <select class="form-control select2" id="gridItemSubCategoryDropdown" data-width="100%">
    </select>
</div>
