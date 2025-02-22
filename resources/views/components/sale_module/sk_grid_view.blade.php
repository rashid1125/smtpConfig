{{-- Start of the component --}}

@props(['props'])

@php
    $moduleSettings = $props['moduleSettings'] ?? null;
    $companies = $props['companies'] ?? null;
    $isDepartment = $props['isDepartment'] ?? true;
    $isUnitRate = $props['isUnitRate'] ?? true;
    $isSale = $props['isSale'] ?? false;
    $isGatePassView = $props['isGatePassView'] ?? false;
    $isPriceList = $props['isPriceList'] ?? false;
    $colSpan = $isDepartment ? 4 : 3;
    $colSpan = $isPriceList ? 4 : 3;
    $discountColumnClass = getValidRoleGroupUserPermissions('reports', 'show_discount_sale_order') ? '' : 'd-none';
@endphp
<script>
    const moduleSettings = {!! json_encode($moduleSettings) !!};
</script>
{{-- Blade logic here --}}
@php
    $hideElements = '';
    if (isset($isGatePassView) && $isGatePassView) {
        $hideElements = 'd-none';
        $colSpan = 4;
    }
    $conditions = [isset($postingOutwardGatePassMethod) ? $postingOutwardGatePassMethod : null];

    $flag = false;
    foreach ($conditions as $condition) {
        if ($condition) {
            $flag = true;
            break;
        }
    }
@endphp


{{-- Continue with your component --}}

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
                <x-grid.item-name-dropdown class="col-md-2"/>

                @if (isset($isSale) && $isSale)
                    <x-grid.color-code-dropdown/>
                @endif

                @if (isset($isGatePassView) && $isGatePassView)
                    <x-grid.warehouse-dropdown/>
                @endif

                <x-grid.qty-weight-input :stockKeepingMethodId="$moduleSettings->stockKeepingMethod->id"/>

                <x-grid.rate-input class="{{ $hideElements }}"/>

                @if (isset($isSale) && $isSale)
                    <x-grid.rate-type-dropdown class="{{ $hideElements }}" :moduleSettings="$moduleSettings" :isSale="$isSale"/>
                @else
                    <x-grid.rate-type-dropdown class="{{ $hideElements }}" :moduleSettings="$moduleSettings"/>
                @endif
            </div>
            <x-row>
                <x-grid.gross-amount class="{{ $hideElements }}"/>
                <x-grid.discount-percentage class="{{ $hideElements }} {{$discountColumnClass}}"/>
                <x-grid.discount-per-unit class="{{ $hideElements }} {{$discountColumnClass}}"/>
                @if ($isUnitRate)
                    <x-grid.unit-rate class="{{ $hideElements }}"/>
                @endif

                <x-grid.amount-excl-tax class="{{ $hideElements }}"/>
                <x-grid.tax-components class="{{ $hideElements }}" :companies="$companies"/>
            </x-row>
            <x-row>
                <x-col class="col-md-10">
                    <div class="form-group">
                        <label for="txtGridRemarks">Particulars</label>
                        <textarea type="text" class="form-input-class no-resize custom-textarea" id="txtGridRemarks" tabindex="-1"></textarea>
                    </div>
                </x-col>
                <x-col class="col-md-2">
                    <label for="btnAdd" class="col-sm-12 control-label">&nbsp;&nbsp;&nbsp;</label>
                    <div class="form-group">
                        <button type="button" id="btnAdd" class="btn btn-outline-primary focus:border-2"
                                data-toggle="tooltip" data-title="Click for add new row"><i
                                    class="fa fa-arrow-down fa-1x"></i></button>
                    </div>
                </x-col>
            </x-row>
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
                                @if ($isPriceList)
                                    <x-table.table-header-cell>Price List</x-table.table-header-cell>
                                @endif
                                <x-table.table-header-cell>Color</x-table.table-header-cell>
                                @if ($isDepartment)
                                    <x-table.table-header-cell>Warehouse</x-table.table-header-cell>
                                @endif
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
                                @if (getValidRoleGroupUserPermissions('reports', 'show_discount_sale_order'))
                                    <x-table.table-header-cell-right
                                            class="{{ $hideElements }}">Disc%
                                    </x-table.table-header-cell-right>
                                    <x-table.table-header-cell-right
                                            class="{{ $hideElements }}">Disc/Unit
                                    </x-table.table-header-cell-right>
                                @endif
                                @if ($isUnitRate)
                                    <x-table.table-header-cell-right class="{{ $hideElements }}">Unit
                                        Rate
                                    </x-table.table-header-cell-right>
                                @endif
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
                                <x-table.table-data-cell :colspan="$colSpan">Totals</x-table.table-data-cell>
                                @if ($moduleSettings->stockKeepingMethod->id == 1)
                                    <x-table.table-data-cell-right
                                            class="gridItemTotalQty"></x-table.table-data-cell-right>
                                @elseif ($moduleSettings->stockKeepingMethod->id == 2)
                                    <x-table.table-data-cell-right
                                            class="gridItemTotalWeight"></x-table.table-data-cell-right>
                                @else
                                    <x-table.table-data-cell-right
                                            class="gridItemTotalQty"></x-table.table-data-cell-right>
                                    <x-table.table-data-cell-right
                                            class="gridItemTotalWeight"></x-table.table-data-cell-right>
                                @endif
                                <x-table.table-data-cell-right
                                        class="gridItemTotalRate {{ $hideElements }}"></x-table.table-data-cell-right>
                                @if ($moduleSettings->grid_rate_type)
                                    <x-table.table-data-cell-right
                                            class="gridItemTotalRateType {{ $hideElements }}"></x-table.table-data-cell-right>
                                    <x-table.table-data-cell-right
                                            class="gridItemTotalRatePerKG {{ $hideElements }}"></x-table.table-data-cell-right>
                                @endif
                                <x-table.table-data-cell-right
                                        class="gridItemTotalGrossAmount {{ $hideElements }}"></x-table.table-data-cell-right>
                                <x-table.table-data-cell-right
                                        class="gridItemTotalDiscountPercentage {{ $hideElements }} {{$discountColumnClass}}"></x-table.table-data-cell-right>
                                <x-table.table-data-cell-right
                                        class="gridItemTotalDiscountPerUnit {{ $hideElements }} {{$discountColumnClass}}"></x-table.table-data-cell-right>
                                {{-- <x-table.table-data-cell-right
                                    class="gridItemTotalUnitRate {{ $hideElements }}"></x-table.table-data-cell-right> --}}
                                <x-table.table-data-cell-right
                                        class="gridItemTotalAmountExclTax {{ $hideElements }}"></x-table.table-data-cell-right>
                                @if ($companies->tax)
                                    <x-table.table-data-cell-right
                                            class="gridItemTotalTaxPercentage {{ $hideElements }}"></x-table.table-data-cell-right>
                                    <x-table.table-data-cell-right
                                            class="gridItemTotalTaxAmount {{ $hideElements }}"></x-table.table-data-cell-right>
                                @endif
                                <x-table.table-data-cell-right
                                        class="gridItemTotalAmountInclTax {{ $hideElements }}"></x-table.table-data-cell-right>
                                @if (!$flag)
                                    <x-table.table-data-cell-right
                                            class="gridItemTotal"></x-table.table-data-cell-right>
                                @endif
                            </x-table.table-row>
                        </x-table.table-footer>
                    </x-table.table-component>
                </div>
            </div>
        </div>

    </div>
</div>
