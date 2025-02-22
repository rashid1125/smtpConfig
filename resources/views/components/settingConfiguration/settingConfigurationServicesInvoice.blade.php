<div class="row">
    <div class="col-md-2">
        <label>Service Account </label>
        <select class="form-control save-elem select2" name="service_account" data-account="account">
            <option value="" selected="" disabled="">
                Choose ...</option>
            <?php foreach ($party as $partys) : ?>
            <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="col-md-2">
        <label>Services Levels </label>
        <select class="form-control save-elem select2" multiple="true" name="services_levels"
            data-placeholder="Choose Services Levels" data-level3="level3">
            <?php foreach ($l3s as $l3) : ?>
            <option value="<?php echo $l3['l3']; ?>">
                <?php echo $l3['name']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="col-md-2">
        <label>Service Type</label>
        <select class="form-control save-elem select2" name="service_type">
            <option value="" selected="" disabled>Choose Service Type </option>
            <option value="1">Self Services</option>
            <option value="2">Middle Man Services</option>
        </select>
    </div>
    <div class="col-md-2">
        <label>Tax % Services</label>
        <x-input type="text" class="num save-elem" name="vat_services" />
    </div>
    <div class="col-md-2">
        <label>Qty & Rate</label>
        <select class="form-control save-elem select2" name="service_qty_rate">
            <option value="" selected="" disabled>Choose Qty & Rate </option>
            <option value="1">Qty</option>
            <option value="2">Qty & rate</option>
            <option value="3">Hide Both</option>
        </select>
    </div>
</div>
