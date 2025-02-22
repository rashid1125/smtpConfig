{{-- resources/views/components/modal/dynamic-modal-by-other-information.blade.php --}}
@props([
    'title',
    'showOtherInformation' => 0,
    'showAccountInformation' => 0,
    'showItemInformation' => 0,
    'showStockInformation' => 0,
    'purchaseModuleSettings',
    'moduleSetting',
    'isSale' => false,
    'cashBook' => false,
    'isCashAccount' => true,
    // staff Information
    'staffInformation' => false,
])

<aside class="control-sidebar">
  <div class="card h-100 shadow-lg">
    <div class="card-header">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <h1 class="text-md text-uppercase justfify-content-center mt-2 text-lg text-sm">Other information</h1>
        </div>
      </div>
    </div>
    <div class="card-body">
      {{-- check  for staff information --}}
      @if ($staffInformation)
        <div class="row">
          <div class="col-md-12">
            <h1>Staff information</h1>
            <div id="otherStaffInformation">

            </div>
          </div>
        </div>
      @endif
      {{-- check for other information --}}
      @if ($showOtherInformation == 1)
        @if ($showAccountInformation == 1)
          <x-otherInformation.account-info :isCashAccount="$isCashAccount" :cashBook="$cashBook" />
        @endif
        @if ($showItemInformation == 1)
          <div class="row">
            <div class="col-md-12">
              <h1>Item information</h1>
              <div id="otherItemInformation">

              </div>
            </div>
          </div>
        @endif
        @if ($showStockInformation == 1)
          <x-otherInformation.stock-info :moduleSetting="$moduleSetting" :isSale="$isSale" />
        @endif
      @endif
    </div>
  </div>
</aside>
