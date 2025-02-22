<div class="row">
    <div class="col-md-2">
        <label>Show Warehouse</label>
        <select class="form-control save-elem select2" name="bulksupply_warehouse_display">
            <option value="" selected="" disabled="">Choose ...</option>
            <option value="1" data-etype="bulksupply_voucher">Yes</option>
            <option value="0" data-etype="bulk_no">No</option>
        </select>
    </div>
    <div class="col-md-2">
        <label>Default Warehouse</label>
        <select class="form-control save-elem select2" name="bulksupply_warehouse_id">
            <option value="" selected="" disabled="">Choose ...</option>
            <?php foreach ($departments as $department) : ?>
            <option value="<?php echo $department['did']; ?>"><?php echo $department['name']; ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="col-md-2">
        <label>Income Posting</label>
        <select class="form-control save-elem select2" name="bulksupply_income_posting">
            <option value="" selected="" disabled="">
                Choose ...</option>
            <option value="1">Post Direct Income
            </option>
            <option value="0">Post Inventory & Income
            </option>
        </select>
    </div>
    <div class="col-md-2">
        <label>Show Voucher Type</label>
        <select class="form-control save-elem select2" name="bulksupply_show_voucher_type">
            <option value="" selected="" disabled="">
                Choose ...</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
        </select>
    </div>
    <div class="col-md-2">
        <label>Show Voucher Type In Expense</label>
        <select class="form-control save-elem select2" name="bulksupply_show_voucher_type_expense">
            <option value="" selected="" disabled="">
                Choose ...</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
        </select>
    </div>
    <div class="col-md-2">
        <label>Parchi Fees</label>
        <select class="form-control save-elem select2" name="bulksupply_parchi_fees_account">
            <option value="" selected="" disabled="">
                Choose ...</option>
            <?php foreach ($party as $partys) : ?>
            <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?>
            </option>
            <?php endforeach; ?>
        </select>
    </div>
</div>
