@php
    use App\Models\DateCloseOption;
    $datecloseOptions = DateCloseOption::all();
@endphp
<div class="row">
    <div class="col-lg-12">
        <div class="card shadow-lg h-100">
            <div class="card-body">
                <div class="row">
                    <div class="col-lg-9">
                        <div class="row">
                            <div class="col-md-3">
                                <input type="hidden" class="form-control save-elem" name="id">
                                <label>Financial Period</label>
                                <select class="form-input-class save-elem select2" name="fn_id"
                                    id="financialPeriodDropdown" data-placeholder="Choose Financial Period">
                                    @foreach ($financialYears as $financialYear)
                                        <option value="{{ $financialYear['fn_id'] }}">
                                            {{ $financialYear['fname'] }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>Print Prompt</label>
                                <select class="form-input-class save-elem select2" name="pp"
                                    data-placeholder="Choose Print Prompt" id="printPromptDropdown">
                                    <option value="1">Prompt For Print</option>
                                    <option value="2">Do Not Prompt For Print</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>Print Size</label>
                                <select class="form-input-class save-elem select2" name="ps"
                                    data-placeholder="Choose Print Size" id="printSizeDropdown">
                                    <option value="1">A4 With Header</option>
                                    <option value="2">A4 without Header</option>
                                    <option value="3">B5 With Header</option>
                                    <option value="4">B5 Without Header</option>
                                    <option value="5">Thermal With Header</option>
                                    <option value="6">Thermal Without Header
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>Print Open</label>
                                <select class="form-input-class save-elem select2" name="print_setting"
                                    data-placeholder="Choose Print Open" id="printOpenDropdown">
                                    <option value="0">Open In New Tab</option>
                                    <option value="1">Open In Modal</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <label>Qty Rounding</label>
                                <select class="form-input-class save-elem select2" name="qty_rounding"
                                    data-placeholder="Choose Qty Decimal" id="qtyRoundingDropdown">
                                    <option value="0">None Decimal</option>
                                    <option value="1">One Decimal</option>
                                    <option value="2">Two Decimal</option>
                                    <option value="3">Three Decimal</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>Weight Rounding</label>
                                <select class="form-input-class save-elem  select2" name="weight_rounding"
                                    data-placeholder="Choose Weight Rounding" id="weightRoundingDropdown">
                                    <option value="0">None Decimal</option>
                                    <option value="1">One Decimal</option>
                                    <option value="2">Two Decimal</option>
                                    <option value="3">Three Decimal</option>
                                    <option value="4">Four Decimal</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>Rate Rounding</label>
                                <select class="form-input-class save-elem select2" name="rate_rounding"
                                    data-placeholder="Choose Rate Rounding" id="rateRoundingDropDown">
                                    <option value="0">None Decimal</option>
                                    <option value="1">One Decimal</option>
                                    <option value="2">Two Decimal</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>Amount Rounding</label>
                                <select class="form-input-class save-elem select2" name="setting_decimal"
                                    data-placeholder="Choose Amount Rounding" id="amountRoundingDropDown">
                                    <option value="0">None Decimal</option>
                                    <option value="1">One Decimal</option>
                                    <option value="2">Two Decimal</option>
                                    <option value="3">Three Decimal</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <label>Definition Behavior</label>
                                <select class="form-input-class save-elem select2" name="defination_behaviour"
                                    id="definitionBehaviorDropDown">
                                    <option value="" selected="" disabled="">
                                        Choose Definition Behavior</option>
                                    <option value="1">View All</option>
                                    <option value="2">Data Entry State</option>
                                </select>
                            </div>
                            <div class="col-md-3 <?= $checkHide ?>">
                                <label>Default Print Language</label>
                                <select class="form-input-class save-elem select2" name="default_print_language"
                                    id="default_print_language">
                                    <option value="" selected="" disabled="">
                                        Choose Default Print Language</option>
                                    @if (isset($languages))
                                        @foreach ($languages as $key => $language)
                                            <option value="<?= $language->languageid ?>">
                                                <?= $language->name ?></option>
                                        @endforeach
                                    @endif
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label for="date_format_view">Default Date Format</label>
                                <select class="form-input-class save-elem input-sm select2" name="date_format_view"
                                    id="date_format_view">
                                    <option value="" selected="" disabled="">
                                        Choose Default Date Format</option>
                                    <option value="yyyy-mm-dd" data-backend="Y-m-d">
                                        YYYY-MM-DD</option>
                                    <option value="yyyy/mm/dd" data-backend="Y/m/d">
                                        YYYY/MM/DD</option>
                                    <option value="dd-mm-yyyy" data-backend="d-m-Y">
                                        DD-MM-YYYY</option>
                                    <option value="dd/mm/yyyy" data-backend="d/m/Y">
                                        DD/MM/YYYY</option>
                                    <option value="mm-dd-yyyy" data-backend="m-d-Y">
                                        MM-DD-YYYY</option>
                                    <option value="mm/dd/yyyy" data-backend="m/d/Y">
                                        MM/DD/YYYY</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label for="default_barcode">Default Barcode</label>
                                <select class="form-input-class save-elem input-sm select2" name="default_barcode"
                                    id="default_barcode">
                                    <option value="" selected="" disabled="">
                                        Choose Default Barcode</option>
                                    <option value="38x28_mm">38 x 28 MM</option>
                                    <option value="38x28_mm1up">38 X 28 MM Singel
                                    </option>
                                    <option value="58x40_mm">58 x 40 MM</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <label>Date Close Setting</label>
                                <select class="form-input-class save-elem  select2" name="date_close_option_id"
                                    id="dateCloseDropDown">
                                    @foreach ($datecloseOptions as $datecloseOption)
                                        <option value="<?= $datecloseOption->id ?>">
                                            <?= $datecloseOption->dispaly_name ?></option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>Logout Time</label>
                                <select class="form-input-class save-elem select2" name="logout_time"
                                    id="logoutTimeDropDown">
                                    <option value="" selected="" disabled="">
                                        Choose Logout Time</option>
                                    <option value="10">10 Minutes</option>
                                    <option value="20">20 Minutes</option>
                                    <option value="30">30 Minutes</option>
                                    <option value="0">Unlimited</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label>Allowed Password Attempts</label>
                                <input type="text" class="form-input-class save-elem" name="failedattempts"
                                    id="failedattempts">
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="lg:w-1/1 bg-gray-100 p-4 border border-gray-300 shadow-md">
                            <div class="flex flex-col items-center">
                                <div class="text-center">
                                    <p class="font-bold mb-2 mt-0">Choose Header Image</p>
                                    <img src="<?php echo asset('assets/img/blank.jpg'); ?>" alt="Item Image" class="block mx-auto"
                                        id="itemImageDisplay">
                                </div>
                                <div class="w-full mt-4">
                                    <input type="file" id="itemImage" class="form-input mt-1 block w-full">
                                </div>
                                <div class="mt-2 w-full text-right">
                                    <button id="removeImg"
                                        class="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded">
                                        <i class="fas fa-trash-alt"></i> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> <!-- end of panel-body -->
        </div> <!-- end of panel -->
    </div> <!-- end of col -->
</div> <!-- end of row -->
