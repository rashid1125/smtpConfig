<div class="row">
    @if ($getVoucherPostingFlag)
        <div class="col-md-2">
            <label>Sale Posting </label>
            <select class="form-control save-elem select2" name="sale_posting">
                <option value="1" data-etype="sale">Direct Sale</option>
                <option value="2" data-etype="outward">Outward Then Sale</option>
            </select>
        </div>
    @endif
    <div class="col-md-2">
        <label>Inventory Control</label>
        <select class="form-control save-elem select2" name="ic">
            <option value="1">Restrict On Zero Stock</option>
            <option value="2">Do Not Restrict On Zero Stock </option>
        </select>
    </div>
    <div class="col-md-2">
        <label>Sale Inventory Categories </label>
        <select class="form-control save-elem select2 this-optional" name="sale_inventory_categories" multiple
            id="txtsale_inventory_categories" data-placeholder="Choose Inventory Categories" data-allow-clear="true">
            @foreach($categories as $category)
                <option value="<?php echo $category['id']; ?>"><?php echo $category['name']; ?></option>
            @endforeach
        </select>
    </div>
    <div class="col-md-2">
        <label>Show Tare</label>
        <select class="form-control save-elem select2" name="is_tare">
            <option value="" selected="" disabled="">
                Choose ...</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
        </select>
    </div>
    <div class="col-md-2">
        <label>Previous Balance Sale</label>
        <select class="form-control save-elem select2" name="previous_balacnce_sale">
            <option value="" selected="" disabled="">
                Choose ...</option>
            <option value="1">Yes</option>
            <option value="2">No</option>
        </select>
    </div>
    <div class="col-md-2">
        <label>Default Warehouse</label>
        <select class="form-control save-elem select2 this-optional" name="sale_default_warehouse">
            <option value="" selected="">Choose
                Warehouse...
            </option>
            <?php foreach ($departments as $department) : ?>
            <option value="<?php echo $department['did']; ?>">
                <?php echo $department['name']; ?>
            </option>
            <?php endforeach; ?>
        </select>
    </div>
</div>

<div class="row mt-3">
    <div class="col-md-2">
        <label>Default Cash Sale A/C</label>
        <select class="form-control save-elem select2 this-optional" name="default_cash_sale_account_id">
            <option value="" selected="">Default Cash Sale A/C...</option>
            <?php foreach ($party as $partys) : ?>
            <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?>
            </option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="col-md-2">
        <label>Default Walk In Customer A/C</label>
        <select class="form-control save-elem select2 this-optional" name="sale_default_walk_in_customer">
            <option value="" selected="">Choose Walk
                In
                Customer A/C...</option>
            <?php foreach ($party as $partys) : ?>
            <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?>
            </option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="col-md-4">
        <div class="form-group">
            <label for="my-textarea">Digital Signatures</label>
            <textarea id="my-textarea" class="form-input-class save-elem this-optional" name="digital_signatures" rows="2"
                placeholder="Type Digital Signatures"></textarea>
        </div>
    </div>
</div>
