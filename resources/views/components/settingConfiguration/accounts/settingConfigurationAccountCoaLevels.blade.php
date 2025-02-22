<div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="card collapsed-card">
            <div class="card-header" data-card-widget="collapse" style="cursor: pointer;">
                <h1 class="text-sm text-md text-uppercase font-weight-bold card-title">COA Levels</h1>
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
                        <label>Customer Level 3</label>
                        <select class="form-control save-elem select2" name="customerlevel3" data-level3="level3">
                            <option value="" selected="" disabled="">
                                Choose ...</option>
                            <?php foreach ($l3s as $l3) : ?>
                            <option value="<?php echo $l3['l3']; ?>">
                                <?php echo $l3['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Supplier Level 3</label>
                        <select class="form-control save-elem select2" name="supplierslevel3" data-level3="level3">
                            <option value="" selected="" disabled="">
                                Choose ...</option>
                            <?php foreach ($l3s as $l3) : ?>
                            <option value="<?php echo $l3['l3']; ?>">
                                <?php echo $l3['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Bank Level 3</label>
                        <select class="form-control save-elem select2" name="bankslevel3" data-level3="level3">
                            <option value="" selected="" disabled="">
                                Choose ...</option>
                            <?php foreach ($l3s as $l3) : ?>
                            <option value="<?php echo $l3['l3']; ?>">
                                <?php echo $l3['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Income Level 3</label>
                        <select class="form-control save-elem select2" name="incomelevel3" data-level3="level3">
                            <option value="" selected="" disabled="">
                                Choose ...</option>
                            <?php foreach ($l3s as $l3) : ?>
                            <option value="<?php echo $l3['l3']; ?>">
                                <?php echo $l3['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Expense Level 3</label>
                        <select class="form-control save-elem select2" name="expenseslevel3" data-level3="level3">
                            <option value="" selected="" disabled="">
                                Choose ...</option>
                            <?php foreach ($l3s as $l3) : ?>
                            <option value="<?php echo $l3['l3']; ?>">
                                <?php echo $l3['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>General Level 3</label>
                        <select class="form-control save-elem select2" name="generalaccountslevel3" data-level3="level3">
                            <option value="" selected="" disabled="">
                                Choose ...</option>
                            <?php foreach ($l3s as $l3) : ?>
                            <option value="<?php echo $l3['l3']; ?>">
                                <?php echo $l3['name']; ?>
                            </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
