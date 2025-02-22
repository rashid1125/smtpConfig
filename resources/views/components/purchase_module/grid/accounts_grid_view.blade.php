<div class="card border-2 rounded">
    <div class="card-header bg-slate-100" data-card-widget="collapse" style="cursor: pointer;">
        <h1 class="text-sm text-md text-uppercase font-weight-bold card-title">
            Account Information</h1>
        <div class="card-tools">
            <button type="button" class="btn btn-tool" data-card-widget="collapse">
                <i class="fas fa-minus"></i>
            </button>
        </div>
    </div>
    <div class="card-body">
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <label for="gridAccountNameDropdown">Account <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                <select class="form-control select2" id="gridAccountNameDropdown" data-width="100%">
                    <option value="" selected disabled>Choose Account</option>

                </select>
            </div>
            <div class="col-md-2">
                <label for="gridAccountRemarks">Remarks </label>
                <input type="text" class="form-input-class" id="gridAccountRemarks">
            </div>
            @if ($etype == 'opening_balances')
            <div class="col-md-2" style="display: none;">
                <label for="gridAccountInvoiceNo">Invoice #</label>
                <input type="text" class="form-input-class" id="gridAccountInvoiceNo">
            </div>
            @else
            <div class="col-md-2">
                <label for="gridAccountInvoiceNo">Invoice #</label>
                <input type="text" class="form-input-class" id="gridAccountInvoiceNo">
            </div>
            @endif
            @if($etype == 'journals' || $etype == 'opening_balances' || $etype == 'cash_books')
            <div class="col-md-1">
                <label for="gridAccountDebit">Debit <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                <input type="text" class="form-input-class is_numeric" id="gridAccountDebit">
            </div>
            <div class="col-md-1">
                <label for="gridAccountCredit">Credit <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                <input type="text" class="form-input-class is_numeric" id="gridAccountCredit">
            </div>
            @else
            <div class="col-md-2">
                <label for="gridAccountAmount">Amount <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                <input type="text" class="form-input-class is_numeric" id="gridAccountAmount">
            </div>
            @endif
            <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1">
                <div class="form-group">
                    <label for="btnAdd" class="col-sm-12 control-label">&nbsp;&nbsp;&nbsp;</label>
                    <div class="col-sm-12">
                        <button type="button" id="btnAdd" class="btn btn-outline-primary focus:border-2" data-toggle="tooltip" data-title="Click for add new row"><i class="fa fa-arrow-down fa-1x"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>



<div class="row mt-2">
    <div class="col">
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-responsive text-md" id="purchase_table">
                        <thead class="cf tbl_thead py-2 px-2">
                            <tr class="py-2 px-2 text-md">
                                <th class="py-2 px-2 text-md align-middle text-left">Sr#</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Account Name</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Remarks</th>
                                @if ($etype == 'opening_balances')
                                <th class="py-2 px-2 text-md align-middle text-right" style="display: none;">Inv #</th>
                                @elseif ($etype == 'cash_books')
                                <th class="py-2 px-2 text-md align-middle text-left">Paid From</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Inv #</th>
                                @else
                                <th class="py-2 px-2 text-md align-middle text-right">Inv #</th>
                                @endif
                                @if($etype == 'journals' || $etype == 'opening_balances'|| $etype == 'cash_books')
                                <th class="py-2 px-2 text-md align-middle text-right">Debit</th>
                                <th class="py-2 px-2 text-md align-middle text-right">Credit</th>
                                @else
                                <th class="py-2 px-2 text-md align-middle text-right">Amount</th>
                                @endif
                                <th class="py-2 px-2 text-md align-middle text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody class="table-body">
                        </tbody>
                        <tfoot class="table-footer">
                            <tr class="py-2 px-2 text-md">
                                @if ($etype == 'opening_balances')
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right" colspan="3">Totals</td>
                                @elseif ($etype == 'cash_books')
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right" colspan="5">Totals</td>
                                @else
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right" colspan="4">Totals</td>
                                @endif
                                @if($etype == 'journals' || $etype == 'opening_balances' || $etype == 'cash_books')
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridAccountTotalDebit"></td>
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridAccountTotalCredit"></td>
                                @else
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridAccountTotalAmount"></td>
                                @endif
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

    </div>
</div>
