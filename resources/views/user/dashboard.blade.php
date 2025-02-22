<div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div class="mt-3 w-full">
            <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                    <div class="info-box shadow-lg">
                        <span class="info-box-icon bg-info elevation-1"><i class="fas fa-coins"></i></span>
                        <div class="info-box-content">
                            <span class="info-box-text text-md font-weight-bold text-sm">Purchase</span>
                            <span class="info-box-number" id="hsd-commission">{{ $totalPurchase ?? 0 }} </span>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                    <div class="info-box shadow-lg">
                        <span class="info-box-icon bg-danger elevation-1"><i class="fas fa-coins"></i></span>
                        <div class="info-box-content">
                            <span class="info-box-text text-md font-weight-bold text-sm">Purchase Return</span>
                            <span class="info-box-number" id="super-commission">{{$totalPurchaseReturn ?? 0}} </span>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                    <div class="info-box shadow-lg">
                        <span class="info-box-icon bg-success elevation-1"><i class="fas fa-coins"></i></span>
                        <div class="info-box-content">
                            <span class="info-box-text text-md font-weight-bold text-sm">Sale</span>
                            <span class="info-box-number" id="hobc-commission">{{ $totalSale ?? 0 }} </span>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                    <div class="info-box shadow-lg">
                        <span class="info-box-icon bg-gradient-fuchsia elevation-1"><i class="fas fa-coins"></i></span>
                        <div class="info-box-content">
                            <span class="info-box-text text-md font-weight-bold text-sm">Sale Return</span>
                            <span class="info-box-number" id="altronx-commission">{{ $totalSaleReturn ?? 0 }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>