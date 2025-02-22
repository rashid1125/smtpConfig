<div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="card collapsed-card">
            <div class="card-header" data-card-widget="collapse" style="cursor: pointer;">
                <h1 class="text-md text-uppercase font-weight-bold card-title text-sm">Accounts Settings</h1>
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
                        <label>Cash Account</label>
                        <select class="form-control save-elem select2" name="cash" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Credit Card Accounts</label>
                        <select class="form-control save-elem select2" multiple="true" name="cca" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Cash Flow Accounts</label>
                        <select class="form-control save-elem select2" multiple="true" name="cashflow" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Round Off Accounts</label>
                        <select class="form-control save-elem select2" name="roundoffaccount" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>General Sales Tax</label>
                        <select class="form-control save-elem select2" name="tax" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Cheque In Hand Account</label>
                        <select class="form-control save-elem select2" name="cheque_in_hand_account" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-2">
                        <label>Income Tax Account</label>
                        <select class="form-control save-elem select2" name="incometaxaccount" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Opening Stock Account</label>
                        <select class="form-control save-elem select2" name="openingstock" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Opening Balance Account</label>
                        <select class="form-control save-elem select2" name="op_balance" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Income Account</label>
                        <select class="form-control save-elem select2" name="sale" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Inventory Account</label>
                        <select class="form-control save-elem select2" name="purchase" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Cost Account</label>
                        <select class="form-control save-elem select2" name="cost_account" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div class="row">

                    <div class="col-lg-2">
                        <label>Item Discount</label>
                        <select class="form-control save-elem select2" name="itemdiscount" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Flat Discount</label>
                        <select class="form-control save-elem select2" name="discount" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Expenses</label>
                        <select class="form-control save-elem select2" name="expenses" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Freight Inward Account</label>
                        <select class="form-control save-elem select2" name="freight_inward" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Freight Outward Account</label>
                        <select class="form-control save-elem select2" name="freight" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Gain Loss </label>
                        <select class="form-control save-elem validate select2" name="gainlossaccount" data-account="account">
                            <option value="" selected="" disabled="">
                                Choose ...
                            </option>
                            <?php foreach ($parties as $partys) : ?>
                            <option value="<?php echo $partys['pid']; ?>">
                                    <?php echo $partys['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <x-row>
                    <x-col class="col-md-2">
                        <div class="form-group">
                            <x-label>Commission</x-label>
                            <select class="form-control save-elem validate select2" name="commission_account" data-width="100%" data-account="account">
                                <option value="" selected="" disabled="">Choose ...</option>
                                @foreach ($parties as $item)
                                    <option value="{{ $item['pid'] }}">{{ $item['name'] }}</option>
                                @endforeach
                            </select>
                        </div>
                    </x-col>
                    <x-col class="col-md-2">
                        <div class="form-group">
                            <x-label>Exchange Gain Loss Account</x-label>
                            <select class="form-control save-elem validate select2" name="exchange_gain_loss" data-width="100%" data-account="account">
                                <option value="" selected="" disabled="">Choose ...</option>
                                @foreach ($parties as $item)
                                    <option value="{{ $item['pid'] }}">{{ $item['name'] }}</option>
                                @endforeach
                            </select>
                        </div>
                    </x-col>
                    <x-col class="col-md-2">
                        <div class="form-group">
                            <x-label>Further Tax Account</x-label>
                            <select class="form-control save-elem validate select2" name="further_tax_account" data-width="100%" data-account="account">
                                <option value="" selected="" disabled="">Choose ...</option>
                                @foreach ($parties as $item)
                                    <option value="{{ $item['pid'] }}">{{ $item['name'] }}</option>
                                @endforeach
                            </select>
                        </div>
                    </x-col>
                </x-row>
            </div>
        </div>
    </div>
</div>
