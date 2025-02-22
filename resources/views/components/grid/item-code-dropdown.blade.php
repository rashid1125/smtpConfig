<div class="col-md-2">
    <div class="row mt-0">
        <div class="col-md-9">
            <x-label for="gridItemShortCodeDropdown">Item Code <sub class="asterisk"><i
                        class="fa fa-asterisk"></i></sub></x-label>
        </div>
        <div class="col-md-3">
            <x-button.button class="text-primary float-right mr-2 mb-2 flex-1 getItemLookUpRecord" 
            buttonIcone="true" iconeClass="{{ __('fa fa-search fa-1x') }}" title="Search Item's! (F2)"></x-button>
        </div>
    </div>
    <select class="form-control select2" id="gridItemShortCodeDropdown" data-width="100%">

    </select>
</div>
