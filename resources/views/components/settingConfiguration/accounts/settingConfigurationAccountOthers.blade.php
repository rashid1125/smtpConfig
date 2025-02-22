<div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="card collapsed-card">
            <div class="card-header" data-card-widget="collapse" style="cursor: pointer;">
                <h1 class="text-sm text-md text-uppercase font-weight-bold card-title">Others</h1>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-tool" data-card-widget="remove">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-lg-2">
                        <label>Ledger Posting</label>
                        <select class="form-control save-elem select2" name="lp">
                            <option value="" selected="" disabled="">
                                Choose ...</option>
                            <option value="1">With Each Record</option>
                            <option value="2">With Invoice Amount</option>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Credit Limit Alert</label>
                        <select class="form-control save-elem select2" name="cla">
                            <option value="" selected="" disabled="">
                                Choose ...</option>
                            <option value="1">Intimate</option>
                            <option value="2">No</option>
                            <option value="3">Restrict</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label>GST Ratio</label>
                        @if (session('tax'))
                            <x-input type="text" class="num save-elem" name="taxrate" />
                        @else
                            <x-input type="text" class="num readonly" value="0" disabled />
                        @endif
                    </div>
                    <div class="col-lg-2">
                        <label>Further Tax %</label>
                        <x-input type="text" class="num save-elem" name="ftax" />
                    </div>


                </div>
            </div>
        </div>
    </div>
</div>
