<div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="card {{ $card_open ?? 'collapsed-card' }} shadow">
            <div class="card-header bg-slate-50" data-card-widget="collapse" style="cursor: pointer;">
                <h3 class="card-title">{{ $card_title ?? 'Other Information' }}</h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                @if(isset($commercialInvoice) && $commercialInvoice)
                    <x-row>
                        <x-col class="col-md-3">
                            <div class="form-group">
                                <x-label for="otherInfoInvoiceNumber">Invoice #</x-label>
                                <x-input type="text" id="otherInfoInvoiceNumber" data-title="Invoice #" placeholder="Invoice #"/>
                            </div>
                        </x-col>
                        <x-col class="col-md-3">
                            <div class="form-group">
                                <x-label for="otherInfoContainerNo">Container #</x-label>
                                <x-input type="text" id="otherInfoContainerNo" data-title="Container #" placeholder="Container #"/>
                            </div>
                        </x-col>
                        <x-col class="col-md-3">
                            <div class="form-group">
                                <x-label for="otherInfoPaymentTerm">Payment Term</x-label>
                                <x-input type="text" id="otherInfoPaymentTerm" data-title="Payment Term" placeholder="Payment Term"/>
                            </div>
                        </x-col>
                        <x-col class="col-md-3">
                            <div class="form-group">
                                <x-label for="otherInfoDeliveryTerm">Delivery Term</x-label>
                                <x-input type="text" id="otherInfoDeliveryTerm" data-title="Delivery Term" placeholder="Delivery Term"/>
                            </div>
                        </x-col>
                    </x-row>
                @endif
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="customerName">Customer</label>
                            <input type="text" id="customerName" class="form-input-class" data-toggle="tooltip" data-title="Customer">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="customerMobile">Mobile</label>
                            <input type="text" id="customerMobile" class="form-input-class" data-toggle="tooltip" data-title="Customer Mobile">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="receivers_list">Prepared By</label>
                            <input type="text" id="receivers_list" class="form-input-class" data-toggle="tooltip" data-title="Prepared">
                        </div>
                    </div>
                </div>
                <x-row>
                    @isset($isGatePassView)
                        <x-col class="col-md-2">
                            <div class="form-group">
                                <x-label for="vehicleNumber">Vehicle #</x-label>
                                <x-input type="text" id="vehicleNumber" data-title="Vehicle Number"/>
                            </div>
                        </x-col>
                        <x-col class="col-md-2">
                            <div class="form-group">
                                <x-label for="driverName">Driver Name</x-label>
                                <x-input type="text" id="driverName" data-title="Driver Name"/>
                            </div>
                        </x-col>
                    @endisset
                    <x-col class="col-md-8">
                        <div class="form-group">
                            <x-label for="voucherRemarks">Remarks</x-label>
                            <x-input type="text" id="voucherRemarks" data-title="Remarks"/>
                        </div>
                    </x-col>
                </x-row>
            </div>
        </div>
    </div>
</div>
