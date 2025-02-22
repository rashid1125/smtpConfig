@php

    $hideElements = '';
    if (isset($isGatePassView) && $isGatePassView) {
        $hideElements = 'd-none';
    }
    $conditions = [
        isset($postingInwardGatePassMethod) ? $postingInwardGatePassMethod : null,
        isset($postingInspectionsMethod) ? $postingInspectionsMethod : null,
        // Add more conditions as needed
    ];

    // Determine if any of the conditions are true
    $flag = false;
    foreach ($conditions as $condition) {
        if ($condition) {
            $flag = true;
            break;
        }
    }
@endphp
<script>
    const moduleSettings = {!! json_encode($moduleSettings) !!};
</script>
@if (!$flag)
    <div class="card border-2 rounded">
        <div class="card-header bg-slate-100" data-card-widget="collapse" style="cursor: pointer;">
            <h1 class="text-sm text-md text-uppercase font-weight-bold card-title">
                Item Information</h1>
            <div class="card-tools">
                <button type="button" class="btn btn-tool" data-card-widget="collapse">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="row">
                <x-grid.item-code-dropdown/>
                <x-grid.item-name-dropdown/>
                @if (isset($isGatePassView) && $isGatePassView)
                    <x-grid.warehouse-dropdown/>
                @endif
                <x-grid.qty-weight-input :stockKeepingMethodId="$moduleSettings->stockKeepingMethod->id"/>
                <x-grid.rate-input class="{{ $hideElements }}"/>
                <x-grid.rate-type-dropdown class="{{ $hideElements }}" :moduleSettings="$moduleSettings"/>
            </div>
            <div class="row mt-1">
                <x-grid.gross-amount class="{{ $hideElements }}"/>
                <x-grid.discount-percentage class="{{ $hideElements }}"/>
                <x-grid.discount-per-unit class="{{ $hideElements }}"/>
                <x-grid.unit-rate class="{{ $hideElements }}"/>
                <x-grid.amount-excl-tax class="{{ $hideElements }}"/>
                <x-grid.tax-components class="{{ $hideElements }}" :companies="$companies"/>
            </div>
            <div class="row mt-1">
                <div class="col-xs-12 col-sm-11 col-md-11 col-lg-11">
                    <label for="txtGridRemarks">Particulars</label>
                    <textarea type="text" class="form-input-class no-resize custom-textarea" id="txtGridRemarks" tabindex="-1"></textarea>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1">
                    <div class="form-group mt-2">
                        <label for="btnAdd" class="col-sm-12 control-label">&nbsp;&nbsp;&nbsp;</label>
                        <div class="col-sm-12">
                            <button type="button" id="btnAdd" class="btn btn-outline-primary focus:border-2"
                                    data-toggle="tooltip" data-title="Click for add new row"><i
                                        class="fa fa-arrow-down fa-1x"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endif



<div class="row mt-2">
    <div class="col">
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <x-table.table-component id="purchase_table" class="table table-responsive text-md">
                        <x-table.table-head>
                            <x-table.table-row>
                                <x-table.table-header-cell>Sr#</x-table.table-header-cell>
                                <x-table.table-header-cell>Item Detail</x-table.table-header-cell>
                                <x-table.table-header-cell>Warehouse</x-table.table-header-cell>
                                @if ($moduleSettings->stockKeepingMethod->id == 1)
                                    <x-table.table-header-cell-right>Qty</x-table.table-header-cell-right>
                                @elseif ($moduleSettings->stockKeepingMethod->id == 2)
                                    <x-table.table-header-cell-right>Weight</x-table.table-header-cell-right>
                                @else
                                    <x-table.table-header-cell-right>Qty</x-table.table-header-cell-right>
                                    <x-table.table-header-cell-right>Weight</x-table.table-header-cell-right>
                                @endif
                                <x-table.table-header-cell-right
                                        class="{{ $hideElements }}">Rate
                                </x-table.table-header-cell-right>

                                @if ($moduleSettings->grid_rate_type)
                                    <x-table.table-header-cell class="{{ $hideElements }}">Rate
                                        Type
                                    </x-table.table-header-cell>
                                    <x-table.table-header-cell-right class="{{ $hideElements }}">Rate /
                                        KG
                                    </x-table.table-header-cell-right>
                                @endif
                                <x-table.table-header-cell-right class="{{ $hideElements }}">Gross
                                    Amount
                                </x-table.table-header-cell-right>
                                <x-table.table-header-cell-right
                                        class="{{ $hideElements }}">Disc%
                                </x-table.table-header-cell-right>
                                <x-table.table-header-cell-right
                                        class="{{ $hideElements }}">Disc/Unit
                                </x-table.table-header-cell-right>
                                <x-table.table-header-cell-right class="{{ $hideElements }}">Unit
                                    Rate
                                </x-table.table-header-cell-right>
                                <x-table.table-header-cell-right class="{{ $hideElements }}">Amount Excl
                                    Tax
                                </x-table.table-header-cell-right>
                                @if ($companies->tax)
                                    <x-table.table-header-cell-right class="{{ $hideElements }}">Tax
                                        %
                                    </x-table.table-header-cell-right>
                                    <x-table.table-header-cell-right class="{{ $hideElements }}">Tax
                                        Amount
                                    </x-table.table-header-cell-right>
                                    <x-table.table-header-cell-right class="{{ $hideElements }}">Amount Incl
                                        Tax
                                    </x-table.table-header-cell-right>
                                @else
                                    <x-table.table-header-cell-right class="{{ $hideElements }}">Net
                                        Amount
                                    </x-table.table-header-cell-right>
                                @endif
                                @if (!$flag)
                                    <x-table.table-header-cell-right>Action</x-table.table-header-cell-right>
                                @endif
                            </x-table.table-row>
                        </x-table.table-head>
                        <tbody class="table-body">

                        </tbody>
                        <x-table.table-footer
                                class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right">
                            <x-table.table-row>
                                <x-table.table-data-cell colspan="3">Totals</x-table.table-data-cell>
                                @if ($moduleSettings->stockKeepingMethod->id == 1)
                                    <x-table.table-data-cell class="gridItemTotalQty"></x-table.table-data-cell>
                                @elseif ($moduleSettings->stockKeepingMethod->id == 2)
                                    <x-table.table-data-cell class="gridItemTotalWeight"></x-table.table-data-cell>
                                @else
                                    <x-table.table-data-cell class="gridItemTotalQty"></x-table.table-data-cell>
                                    <x-table.table-data-cell class="gridItemTotalWeight"></x-table.table-data-cell>
                                @endif
                                <x-table.table-data-cell
                                        class="gridItemTotalRate {{ $hideElements }}"></x-table.table-data-cell>
                                @if ($moduleSettings->grid_rate_type)
                                    <x-table.table-data-cell
                                            class="gridItemTotalRateType {{ $hideElements }}"></x-table.table-data-cell>
                                    <x-table.table-data-cell
                                            class="gridItemTotalRatePerKG {{ $hideElements }}"></x-table.table-data-cell>
                                @endif
                                <x-table.table-data-cell
                                        class="gridItemTotalGrossAmount {{ $hideElements }}"></x-table.table-data-cell>
                                <x-table.table-data-cell
                                        class="gridItemTotalDiscountPercentage {{ $hideElements }}"></x-table.table-data-cell>
                                <x-table.table-data-cell
                                        class="gridItemTotalDiscountPerUnit {{ $hideElements }}"></x-table.table-data-cell>
                                <x-table.table-data-cell
                                        class="gridItemTotalUnitRate {{ $hideElements }}"></x-table.table-data-cell>
                                <x-table.table-data-cell
                                        class="gridItemTotalAmountExclTax {{ $hideElements }}"></x-table.table-data-cell>
                                @if ($companies->tax)
                                    <x-table.table-data-cell
                                            class="gridItemTotalTaxPercentage {{ $hideElements }}"></x-table.table-data-cell>
                                    <x-table.table-data-cell
                                            class="gridItemTotalTaxAmount {{ $hideElements }}"></x-table.table-data-cell>
                                @endif
                                <x-table.table-data-cell
                                        class="gridItemTotalAmountInclTax {{ $hideElements }}"></x-table.table-data-cell>
                                @if (!$flag)
                                    <x-table.table-data-cell class="gridItemTotal"></x-table.table-data-cell>
                                @endif
                            </x-table.table-row>
                        </x-table.table-footer>
                    </x-table.table-component>
                </div>
            </div>
        </div>

    </div>
</div>
