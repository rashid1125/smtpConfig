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
            <div class="col-md-3">
                <label for="gridAccountParticularInput">Particulars <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                <input type="text" class="form-input-class" id="gridAccountParticularInput">
            </div>
            <div class="col-md-2">
                <label for="gridAccountInvoiceNoInput">Invoice #</label>
                <input type="text" class="form-input-class" id="gridAccountInvoiceNoInput">
            </div>
            <div class="col-md-2">
                <label for="gridAccountAmountInput">Amount <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
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



<div class="row mt-2">
    <div class="col">
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-responsive text-md" id="purchase_table">
                        <thead class="cf tbl_thead py-2 px-2">
                            <tr class="py-2 px-2 text-md">
                                <th class="py-2 px-2 text-md align-middle text-left">Sr#</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Particular</th>
                                <th class="py-2 px-2 text-md align-middle text-left">Inv #</th>
                                <th class="py-2 px-2 text-md align-middle text-right">Amount</th>
                                <th class="py-2 px-2 text-md align-middle text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody class="table-body">
                        </tbody>
                        <tfoot class="table-footer">
                            <tr class="py-2 px-2 text-md">
                                <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right" colspan="3">Totals</td>
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