<div class="row">
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
    <div class="card collapsed-card">
      <div class="card-header" data-card-widget="collapse" style="cursor: pointer;">
        <h1 class="text-md text-uppercase font-weight-bold card-title text-sm">HR Account</h1>
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
            <label>Salary Account</label>
            <select class="form-control save-elem select2" name="salary" data-account="account">
              <option value="" selected="" disabled="">
                Choose ...</option>
              <?php foreach ($party as $partys) : ?>
              <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-lg-2">
            <label>Salary Payable Account</label>
            <select class="form-control save-elem select2" name="salarypayable" data-account="account">
              <option value="" selected="" disabled="">
                Choose ...</option>
              <?php foreach ($party as $partys) : ?>
              <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-lg-2">
            <label>Wages Account</label>
            <select class="form-control save-elem select2" name="wages" data-account="account">
              <option value="" selected="" disabled="">
                Choose ...</option>
              <?php foreach ($party as $partys) : ?>
              <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-lg-2">
            <label>Wages Payable Account</label>
            <select class="form-control save-elem select2" name="wagespayable" data-account="account">
              <option value="" selected="" disabled="">
                Choose ...</option>
              <?php foreach ($party as $partys) : ?>
              <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-lg-2">
            <label>Penalty Account</label>
            <select class="form-control save-elem select2" name="penalty" data-account="account">
              <option value="" selected="" disabled="">
                Choose ...</option>
              <?php foreach ($party as $partys) : ?>
              <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-lg-2">
            <label>Incentive Account</label>
            <select class="form-control save-elem select2" name="incentive" data-account="account">
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

        <div class="row">
          <div class="col-lg-2">
            <label>EOBI Payable Account</label>
            <select class="form-control save-elem select2" name="eobi" data-account="account">
              <option value="" selected="" disabled="">
                Choose ...</option>
              <?php foreach ($party as $partys) : ?>
              <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-lg-2">
            <label>Insurance Payable Account</label>
            <select class="form-control save-elem select2" name="insurance" data-account="account">
              <option value="" selected="" disabled="">
                Choose ...</option>
              <?php foreach ($party as $partys) : ?>
              <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-lg-2">
            <label>Social Security Account</label>
            <select class="form-control save-elem select2" name="ssecurity" data-account="account">
              <option value="" selected="" disabled="">
                Choose ...</option>
              <?php foreach ($party as $partys) : ?>
              <option value="<?php echo $partys['pid']; ?>">
                <?php echo $partys['name']; ?>
              </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-lg-2">
            <label>HR Cash Account</label>
            <select class="form-control save-elem select2" name="cashaccounts" data-account="account">
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
      </div>
    </div>
  </div>
</div>
