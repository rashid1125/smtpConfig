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
            <div class="col-md-2">
                <label for="gridAccountChequeListNumberInput">Cheque List #</label>
                <input type="text" class="form-input-class disabled cursor-not-allowed" id="gridAccountChequeListNumberInput" disabled>
            </div>
            @if ($etype == 'bank_receives')
            <div class="col-md-2">
                <div class="form-group">
                    <div class="row mt-0">
                        <div class="col-md-6">
                            <label class="float-left" for="gridAccountPartydropdown">Account <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                        </div>
                        <div class="col-md-6">
                            <button type="button" id="getChequeInHandLookUp" class="text-primary float-right getChequeInHandLookUp mr-2 mb-2 flex-1" data-toggle="tooltip" title="Search Pending Cheque In Hand!" tabindex="-1"><i class="fa fa-search fa-1x"></i></button>
                        </div>
                    </div>
                    <select class="form-control select2" id="gridAccountPartydropdown" data-width="100%">

                    </select>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <div class="row mt-0">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <label class="float-left" for="gridBankAccountDropdown">Bank Account <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                        </div>
                    </div>
                    <select class="form-control select2" id="gridBankAccountDropdown" data-width="100%">

                    </select>
                </div>
            </div>
            @endif
            <div class="col-md-2">
                <label for="gridAccountParticularInput">Particular</label>
                <input type="text" class="form-input-class" id="gridAccountParticularInput">
            </div>
            <div class="col-md-3">
                <label for="gridAccountBankNameInput">Bank Name <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                <input type="text" id="gridAccountBankNameInput" class="form-input-class" data-toggle="tooltip" title="Bank Name" list="gridAccountBankNameList" />
                <datalist id="gridAccountBankNameList">
                    <?php foreach ($cheque_bank_names as $value) : ?>
                        <option value="<?= $value ?>"><?= $value; ?></option>
                    <?php endforeach; ?>
                </datalist>
            </div>
            @if ($etype == 'cheque_receives')
            <div class="col-md-2">
                <label for="gridAccountInvoiceNoInput">Invoice #</label>
                <input type="text" class="form-input-class" id="gridAccountInvoiceNoInput">
            </div>
            <div class="col-md-2">
                <label for="gridAccountChequeDateInput">Cheque Date <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                <input type="text" id="gridAccountChequeDateInput" class="form-input-class ts_datepicker" data-toggle="tooltip" data-title="Voucher Date" placeholder="Voucher Date" readonly />
            </div>
            @endif
        </div>
        <div class="row mt-2 ">
            @if ($etype == 'bank_receives')
            <div class="col-md-2">
                <label for="gridAccountChequeDateInput">Cheque Date </label>
                <input type="text" id="gridAccountChequeDateInput" class="form-input-class ts_datepicker" data-toggle="tooltip" data-title="Voucher Date" placeholder="Voucher Date" readonly />
            </div>
            @endif
            <div class="col-md-2">
                <label for="gridAccountChequeNumberInput">Cheque # <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                <input type="text" class="form-input-class" id="gridAccountChequeNumberInput">
            </div>
            <div class="col-md-2">
                <label for="gridAccountAmountInput">Amount<sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                <input type="text" class="form-input-class is_numeric" id="gridAccountAmountInput">
            </div>
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

@if ($etype == 'cheque_receives')
<div class="row mt-2">
    <div class="col">
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-responsive text-md" id="purchase_table">
                        <thead class="cf tbl_thead py-2 px-2">
                            <tr class="py-2 px-2 text-md">
                                <th class="py-2 px-2 text-md align-middle text-left">Sr#</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Cheque List #</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Particular</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Bank Name</th>
                                <th class="py-2 px-2 text-md align-middle text-right">Inv #</th>
                                <th class="py-2 px-2 text-md align-middle text-right">Cheque Date</th>
                                <th class="py-2 px-2 text-md align-middle text-right">Cheque #</th>
                                <th class="py-2 px-2 text-md align-middle text-right">Amount</th>
                                <th class="py-2 px-2 text-md align-middle text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody class="table-body">
                        </tbody>
                        <tfoot class="table-footer">
                            <tr class="py-2 px-2 text-md">
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right" colspan="7">Totals</td>
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridAccountTotalAmount"></td>
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

    </div>
</div>
@endif

@if ($etype == 'bank_receives')
<div class="row mt-2">
    <div class="col">
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-responsive text-md" id="purchase_table">
                        <thead class="cf tbl_thead py-2 px-2">
                            <tr class="py-2 px-2 text-md">
                                <th class="py-2 px-2 text-md align-middle text-left">Sr#</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Cheque List #</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Account Name</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Bank Account</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Particular</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Bank Name</th>
                                <th class="py-2 px-2 text-md align-middle text-right">Cheque Date</th>
                                <th class="py-2 px-2 text-md align-middle text-right">Cheque #</th>
                                <th class="py-2 px-2 text-md align-middle text-right">Amount</th>
                                <th class="py-2 px-2 text-md align-middle text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody class="table-body">
                        </tbody>
                        <tfoot class="table-footer">
                            <tr class="py-2 px-2 text-md">
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right" colspan="8">Totals</td>
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridAccountTotalAmount"></td>
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

    </div>
</div>
@endif