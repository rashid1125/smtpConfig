<div class="row">
    @if ($getVoucherPostingFlag)
        <div class="col-md-3">
            <label>Purchase Posting </label>
            <select
                class="form-control save-elem select2"
                name="purchase_posting">
                <option value=""
                    selected="" disabled="">
                    Choose ...</option>
                <option value="1"
                    data-etype="purchases"> Direct
                    Purchase</option>
                <option value="2"
                    data-etype="inward_gate_passes">
                    Inward
                    Then
                    Purchase</option>
                <option value="3"
                    data-etype="inspections">
                    Inspection
                    Then Purchase</option>
            </select>
        </div>
    @endif
    <div class="col-md-3">
        <label>Purchase Inventory Categories
        </label>
        <select
            class="form-control save-elem select2 this-optional"
            name="purchase_inventory_categories"
            multiple="true"
            data-placeholder="Choose Categories"
            id="txtpurchase_inventory_categories">
            @foreach($categories as $category)
                <option value="<?php echo $category['id']; ?>"><?php echo $category['name']; ?></option>
            @endforeach
        </select>
    </div>
    <div class="col-md-3">
        <label>Purchase Default Location </label>
        <select
            class="form-control save-elem select2 this-optional"
            name="purchase_default_location">
            <option value="" selected="">
                Choose ...
            </option>
            <?php foreach ($departments as $department) : ?>
            <option value="<?php echo $department['did']; ?>">
                <?php echo $department['name']; ?>
            </option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="col-md-3">
        <label>Previous Balance Purchase</label>
        <select
            class="form-control save-elem select2"
            name="previous_balacnce_purchase">
            <option value="" selected=""
                disabled="">
                Choose ...</option>
            <option value="1">Yes</option>
            <option value="2">No</option>
        </select>
    </div>
</div>
