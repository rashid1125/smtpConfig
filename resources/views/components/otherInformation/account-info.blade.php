<div class="row">
  <div class="col-md-12">
    <div class="">
      <h1 class="form-label">Account Detail </h1>
      <div id="party_p"></div>
      @if (isset($isCashAccount) && $isCashAccount)
        <h1 class="form-label"><b>Cash A/C</b></h1>
        <div id="cash_balance"></div>
      @endif
      @isset($cashBook)
        <h1 class="form-label d-none"><b>Debit A/C</b></h1>
        <div id="party_p1"></div>
        <h1 class="form-label d-none"><b>Credit A/C</b></h1>
        <div id="party_p2"></div>
      @endisset
    </div>
  </div>
</div>
