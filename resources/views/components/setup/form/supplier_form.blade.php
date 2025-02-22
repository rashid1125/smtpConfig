<input type="hidden" id="supplierHiddenId">
<div class="row">
    <div class="col">
        <x-card.card class="shadow-lg h-100">
            <x-card.card-body>
                <x-row>
                    <x-col class="col-sm-6">
                        <div class="row">
                            <label for="supplierName" class="col-sm-4 col-form-label text-md-end">{{ __('Name') }}
                            </label>
                            <div class="col-sm-8">
                                <x-input type="text" id="supplierName" data-toggle="tooltip" data-title="Supplier Name"
                                    placeholder="Supplier Name" />
                            </div>
                        </div>
                    </x-col>
                    <x-col class="col-sm-6">
                        <div class="row">
                            <label for="nativeSupplierName"
                                class="col-sm-4 col-form-label text-md-end">{{ __('Native Name') }}
                            </label>
                            <div class="col-sm-8">
                                <x-input type="text" id="nativeSupplierName" data-toggle="tooltip"
                                    data-title="Native Supplier Name" placeholder="Native Supplier Name" />
                            </div>
                        </div>
                    </x-col>
                </x-row>
                <x-row>
                    <x-col class="col-sm-6">
                        <div class="row">
                            <label for="supplierAddress" class="col-sm-4 col-form-label text-md-end">{{ __('Address') }}
                            </label>
                            <div class="col-sm-8">
                                <x-input type="text" id="supplierAddress" data-toggle="tooltip"
                                    data-title="Supplier Address" placeholder="Supplier Address" />
                            </div>
                        </div>
                    </x-col>
                    <x-col class="col-sm-6">
                        <div class="row">
                            <label for="nativeSupplierAddress"
                                class="col-sm-4 col-form-label text-md-end">{{ __('Native Address') }}
                            </label>
                            <div class="col-sm-8">
                                <x-input type="text" id="nativeSupplierAddress" data-toggle="tooltip"
                                    data-title="Native Supplier Address" placeholder="Native Supplier Address" />
                            </div>
                        </div>
                    </x-col>
                </x-row>
                <x-row>
                    <x-col class="col-sm-6">
                        <div class="row">
                            <label for="supplierMobile" class="col-sm-4 col-form-label text-md-end">{{ __('Mobile #') }}
                            </label>
                            <div class="col-sm-8">
                                <x-input type="text" id="supplierMobile" data-toggle="tooltip"
                                    data-title="Supplier Mobile" placeholder="Supplier Mobile" class="is_numeric"/>
                            </div>
                        </div>
                    </x-col>
                    <x-col class="col-sm-6">
                        <div class="row">
                            <label for="supplierPhone" class="col-sm-4 col-form-label text-md-end">{{ __('Phone #') }}
                            </label>
                            <div class="col-sm-8">
                                <x-input type="text" id="supplierPhone" data-toggle="tooltip"
                                    data-title="Supplier Phone" placeholder="Supplier Phone" class="is_numeric"/>
                            </div>
                        </div>
                    </x-col>
                </x-row>
                <x-row>
                    <x-col class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <x-card.card class="collapsed-card">
                            <x-card.card-header data-card-widget="collapse" style="cursor: pointer;">
                                <h3 class="card-title">Other Information</h3>
                                <div class="card-tools">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <button type="button" class="btn btn-tool" data-card-widget="remove">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </x-card.card-header>
                            <x-card.card-body>
                                <div class="row">
                                    <div class="col">
                                        <div class="form-group">
                                            <label>Contact Person</label>
                                            <x-input type="text" placeholder="Contact Person"
                                                id="supplierContactPerson" />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label>NTN</label>
                                            <x-input type="text" placeholder="supplier NTN" id="supplierNTN" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <div class="form-group">
                                            <label>Email</label>
                                            <x-input type="email" placeholder="Supplier E-Mail" id="supplierEmail" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label>CNIC</label>
                                            <x-input type="text" placeholder="Supplier CNIC" id="supplierCNIC" class="is_numeric"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <div class="form-group">
                                            <label>Country</label>
                                            <x-input type="text" placeholder="Supplier Country" id="supplierCountry" />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label>City</label>
                                            <x-input type="text" placeholder="Supplier City" id="supplierCity" />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label>City Area</label>
                                            <x-input type="text" placeholder="Supplier City Area" id="supplierCityArea"  />
                                        </div>
                                    </div>
                                </div>
                            </x-card.card-body>
                        </x-card.card>
                    </x-col>
                </x-row>
                <x-row>
                    <x-col class="col" style="display: none">
                        <div class="row">
                            <label for="supplierMobile" class="col-sm-4 col-form-label text-md-end">{{ __('Level 3') }}
                            </label>
                            <div class="col-sm-8">
                                <select class="form-control select2" id="supplierLevel3">
                                    <option value="" disabled="" selected="">
                                        Choose Account Type</option>
                                    @foreach ($level3 as $l3)
                                        <option value="{{ $l3->l3 }}" data-level2="{{ $l3->level2_name }}"
                                            data-level1="{{ $l3->level1_name }}">
                                            <?php echo $l3->level3_name; ?>
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </x-col>
                    <x-col class="col-8">
                        <div class="row">
                            <h1 class="col-sm-2 col-form-label font-weight-bold">{{ __('Acc Type') }}</h1>
                            <div class="col-sm-10">
                                <div>
                                    <code> Level 3 .</code><span id='accountTypeLevel3'><u>Required, set
                                            them by going to setting configuration
                                            Voucher</u></span>
                                    <code> Level 2 .</code><span id='accountTypeLevel2'></span>
                                    <code> Level 1.</code><span id='accountTypeLevel1'></span>
                                </div>
                            </div>
                        </div>
                    </x-col>
                </x-row>
            </x-card.card-body>
            <x-card.card-footer>
                <button type="button" class="btn btn-outline-warning focus:border-2" id="supplierResetButton"><i
                        class="fas fa-sync-alt"></i>
                    Reset F5</button>
                <button type="button" class="btn btn-outline-success focus:border-2" id="supplierSaveButton"><i
                        class="fa fa-save"></i> Save
                    F10</button>
            </x-card.card-footer>
        </x-card.card>
    </div>
</div>
