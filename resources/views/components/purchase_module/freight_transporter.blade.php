<div class="card">
    <div class="card-body">
        <div class="row">
            <div class="col col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div class="form-group">
                    <x-label for="biltyNumber">Bilty#</x-label>
                    <x-input type="text" id="biltyNumber" data-title="Bilty Number" placeholder="Bilty Number"/>
                </div>
            </div>
            <div class="col col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div class="form-group">
                    <x-label for="biltyDate">Bilty Date</x-label>
                    <x-input type="text" id="biltyDate" class="ts_datepicker" data-title="Bilty Date" readonly/>
                </div>
            </div>
            <div class="col col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <div class="form-group">
                    <x-label for="transporterDropdown">Transporter</x-label>
                    <select class="form-control select2" id="transporterDropdown" data-width="100%">
                    </select>
                </div>
            </div>
            <div class="col col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div class="form-group">
                    <x-label for="freightAmount">Freight</x-label>
                    <x-input type="number" id="freightAmount" class="is_numeric" data-title="Freight Amount"/>
                </div>
            </div>
            <div class="col col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <div class="form-group">
                    <x-label for="freightTypeDropdown">Freight Type</x-label>
                    <livewire:freight-type-dropdown :options="$optionFreight ?? '0,1,2'" :selected="$selectedFreight ?? 0" :isSale="$isSale ?? false" :isSaleReturn="$isSaleReturn ?? false"/>
                </div>
            </div>
        </div>
    </div>
</div>
