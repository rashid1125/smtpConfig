<div class="row">
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
    <div class="card collapsed-card">
      <div class="card-header" data-card-widget="collapse" style="cursor: pointer;">
        <h1 class="text-md text-uppercase font-weight-bold card-title text-sm">Accounts Levels</h1>
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
            <label>Purchase Accounts</label>
            <select class="form-control save-elem select2" multiple="true" name="purchaseaccount" data-level3="level3">
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
            <label>Sale Accounts</label>
            <select class="form-control save-elem select2" multiple="true" name="saleaccount" data-level3="level3">
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
            <label>Receivable Levels</label>
            <select class="form-control save-elem select2" multiple="true" name="reclevel" data-level3="level3">
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
            <label>Payable Levels</label>
            <select class="form-control save-elem select2" multiple="true" name="paylevel" data-level3="level3">
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
            <label>Expenses Levels</label>
            <select class="form-control save-elem select2" multiple="true" name="expenselevel" data-level3="level3">
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
            <label>Other Income</label>
            <select class="form-control save-elem select2" multiple="true" name="otherincomes" data-level3="level3">
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
        <div class="row">

          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <label>Transporter Account Levels</label>
            <select class="form-control save-elem select2" multiple="true" name="transporter_level" data-level3="level3">
              <?php foreach ($l3s as $l3) : ?>
              <option value="<?php echo $l3['l3']; ?>">
                <?php echo $l3['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <label>FOH levels</label>
            <select class="form-control save-elem select2" multiple="true" name="foh_level3" data-level3="level3">
              <?php foreach ($l3s as $l3) : ?>
              <option value="<?php echo $l3['l3']; ?>">
                <?php echo $l3['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <label>Inventory Levels</label>
            <select class="form-control save-elem select2" multiple="true" name="inventory_levels" data-placeholder="Choose Inventory" data-level3="level3">
              <?php foreach ($l3s as $l3) : ?>
              <option value="<?php echo $l3['l3']; ?>">
                <?php echo $l3['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <label>Cost Levels</label>
            <select class="form-control save-elem select2" multiple="true" name="cost_levels" data-placeholder="Choose Cost" data-level3="level3">
              <?php foreach ($l3s as $l3) : ?>
              <option value="<?php echo $l3['l3']; ?>">
                <?php echo $l3['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <label>Income Levels</label>
            <select class="form-control save-elem select2" multiple="true" name="income_levels" data-placeholder="Choose Income" data-level3="level3">
              <?php foreach ($l3s as $l3) : ?>
              <option value="<?php echo $l3['l3']; ?>">
                <?php echo $l3['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <label> Cash Account Levels</label>
            <select class="form-control save-elem select2" multiple="true" name="cash_account_level" data-placeholder="Choose  Cash Account Levels" data-level3="level3">
              <?php foreach ($l3s as $l3) : ?>
              <option value="<?php echo $l3['l3']; ?>">
                <?php echo $l3['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <label> Bank Account Levels</label>
            <select class="form-control save-elem select2" multiple="true" name="bank_account_level" data-placeholder="Choose Bank Account Levels" data-level3="level3">
              <?php foreach ($l3s as $l3) : ?>
              <option value="<?php echo $l3['l3']; ?>">
                <?php echo $l3['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <label> Sale Officer Level</label>
            <select class="form-control save-elem select2" multiple="true" name="sale_officer_account_level" data-placeholder="Choose Sale Officer Level" data-level3="level3">
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
