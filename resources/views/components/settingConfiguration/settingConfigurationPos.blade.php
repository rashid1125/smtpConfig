<div class="row">
    <div class="col-md-2">
        <label>POS Cash Account</label>
        <select class="form-control save-elem select2" name="pca">
            <option value="" selected="" disabled="">Choose ...</option>
            <?php foreach ($party as $partys) : ?>
            <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?>
            </option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="col-md-2">
        <label>POS Bill Posting Method</label>
        <select class="form-control save-elem select2" name="pos_posting_method">
            <option value="1">Classic</option>
            <option value="2">Modern</option>
        </select>
    </div>
    <div class="col-md-2">
        <label>POS Invoice Type</label>
        <select class="form-control save-elem select2" name="pos_invoice_print_type">
            <option value="1">Single Row Invoice</option>
            <option value="2">Multiple Row Invoice
            </option>
        </select>
    </div>
    <div class="col-md-2">
        <label>POS Warehouse</label>
        <select class="form-control save-elem select2" name="">
            <option value="" selected="" disabled="">Choose ...</option>
            <?php foreach ($departments as $department) : ?>
            <option value="<?php echo $department['did']; ?>">
                <?php echo $department['name']; ?>
            </option>
            <?php endforeach; ?>
        </select>
    </div>
</div>
