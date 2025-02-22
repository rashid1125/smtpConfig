<x-row>
  <x-col class="col-md-3">
    <div class="form-group">
      <label for="fromDate">From
        Date</label>
      <x-input type="text" id="fromDate" title="From Date" class="ts_datepicker" />
    </div>
  </x-col>
  <x-col class="col-md-3">
    <label for="toDate">To Date</label>
    <x-input type="text" id="toDate" title="To Date" class="ts_datepicker" />
  </x-col>
  <x-col class="col-md-6">
    <div class="float-right">
      <label for="saleInvoiceFilter">&nbsp;</label>
      <div class="form-group">
        <button type="button" name="saleInvoiceFilter" id="saleInvoiceFilter" class="btn btn-outline-success text-right"><i class="fa fa-search"></i>
          {{ __('Search') }}</button>
      </div>
    </div>
  </x-col>
</x-row>
<x-row class="mt-0">
  <x-col>
    <x-inputs.inputRadioButtonFilter />
  </x-col>
</x-row>
<x-row>
  <x-col class="col-md-12">
    <div class="table-responsive table-responsive-md">
      <x-table.table-component id="{{ $tableId ?? 'saleInvoiceDataTable' }}" class="table-bordered text-md table">
        <x-table.table-head>
          <x-table.table-row>
            <x-table.table-header-cell>Sr#</x-table.table-header-cell>
            <x-table.table-header-cell>Vr
              #</x-table.table-header-cell>
            <x-table.table-header-cell>Date</x-table.table-header-cell>
            <x-table.table-header-cell>Customer</x-table.table-header-cell>
            @isset($isOPG)
              <x-table.table-header-cell> {{ $returnInward ?? false ? 'Return Inward #' : 'OGP #' }}</x-table.table-header-cell>
              <x-table.table-header-cell>{{ $returnInward ?? false ? 'Return Inward Date' : 'OGP Date' }}</x-table.table-header-cell>
            @endisset
            @unless (isset($isOPG))
              <x-table.table-header-cell-right>Discount
                %</x-table.table-header-cell-right>
              <x-table.table-header-cell-right>Expense
                %</x-table.table-header-cell-right>
              <x-table.table-header-cell-right>Further
                Tax
                %</x-table.table-header-cell-right>
            @endunless

            <x-table.table-header-cell-right>Net Amount</x-table.table-header-cell-right>
            <x-table.table-header-cell-right>Action</x-table.table-header-cell-right>
          </x-table.table-row>
        </x-table.table-head>
        <tbody id="saleInvoiceDataTableTbody">

        </tbody>
      </x-table.table-component>
    </div>
  </x-col>
</x-row>
