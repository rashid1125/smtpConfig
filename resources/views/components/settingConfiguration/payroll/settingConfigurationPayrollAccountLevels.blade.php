<div class="row">
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
    <div class="card collapsed-card">
      <div class="card-header" data-card-widget="collapse" style="cursor: pointer;">
        <h1 class="text-md text-uppercase font-weight-bold card-title text-sm">Account Levels</h1>
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
          <div class="col-md-2">
            <label>Salary Levels</label>
            <select class="form-control save-elem select2" name="salary_Levels" data-level3="level3" data-placeholder="Choose Salary Levels" data-allow-clear="true" multiple>
              @foreach ($l3s as $level3)
                <option value="{{ $level3['l3'] }}">{{ $level3['name'] }}</option>
              @endforeach
            </select>
          </div>
          {{-- Salary Payable Levels --}}
          <div class="col-md-2">
            <label>Salary Payable Levels</label>
            <select class="form-control save-elem select2" name="salary_payable_levels" data-level3="level3" data-placeholder="Choose Salary Payable Levels" data-allow-clear="true" multiple>
              @foreach ($l3s as $level3)
                <option value="{{ $level3['l3'] }}">{{ $level3['name'] }}</option>
              @endforeach
            </select>
          </div>
          {{-- Wages Levels --}}
          <div class="col-md-2">
            <label>Wages Levels</label>
            <select class="form-control save-elem select2" name="wages_levels" data-level3="level3" data-placeholder="Choose Wages Levels" data-allow-clear="true" multiple>
              @foreach ($l3s as $level3)
                <option value="{{ $level3['l3'] }}">{{ $level3['name'] }}</option>
              @endforeach
            </select>
          </div>
          {{-- Wages payable Levels --}}
          <div class="col-md-2">
            <label>Wages Payable Levels</label>
            <select class="form-control save-elem select2" name="wages_payable_levels" data-level3="level3" data-placeholder="Choose Wages Payable Levels" data-allow-clear="true" multiple>
              @foreach ($l3s as $level3)
                <option value="{{ $level3['l3'] }}">{{ $level3['name'] }}</option>
              @endforeach
            </select>
          </div>
          {{-- Penalty Levels --}}
          <div class="col-md-2">
            <label>Penalty Levels</label>
            <select class="form-control save-elem select2" name="penalty_levels" data-level3="level3" data-placeholder="Choose Penalty Levels" data-allow-clear="true" multiple>
              @foreach ($l3s as $level3)
                <option value="{{ $level3['l3'] }}">{{ $level3['name'] }}</option>
              @endforeach
            </select>
          </div>
          {{-- Incentive Levels --}}
          <div class="col-md-2">
            <label>Incentive Levels</label>
            <select class="form-control save-elem select2" name="incentive_levels" data-level3="level3" data-placeholder="Choose Incentive Levels" data-allow-clear="true" multiple>
              @foreach ($l3s as $level3)
                <option value="{{ $level3['l3'] }}">{{ $level3['name'] }}</option>
              @endforeach
            </select>
          </div>
        </div>
        <div class="row mt-2">
          {{-- EOBI Levels --}}
          <div class="col-md-2">
            <label>EOBI Levels</label>
            <select class="form-control save-elem select2" name="eobi_levels" data-level3="level3" data-placeholder="Choose EOBI Levels" data-allow-clear="true" multiple>
              @foreach ($l3s as $level3)
                <option value="{{ $level3['l3'] }}">{{ $level3['name'] }}</option>
              @endforeach
            </select>
          </div>
          {{-- Insurance Levels --}}
          <div class="col-md-2">
            <label>Insurance Levels</label>
            <select class="form-control save-elem select2" name="insurance_levels" data-level3="level3" data-placeholder="Choose Insurance Levels" data-allow-clear="true" multiple>
              @foreach ($l3s as $level3)
                <option value="{{ $level3['l3'] }}">{{ $level3['name'] }}</option>
              @endforeach
            </select>
          </div>
          {{-- Social Security Levels --}}
          <div class="col-md-2">
            <label>Social Security Levels</label>
            <select class="form-control save-elem select2" name="social_security_levels" data-level3="level3" data-placeholder="Choose Social Security Levels" data-allow-clear="true" multiple>
              @foreach ($l3s as $level3)
                <option value="{{ $level3['l3'] }}">{{ $level3['name'] }}</option>
              @endforeach
            </select>
          </div>
          {{-- Employee COA Level --}}
          <div class="col-lg-2">
            <label>Employee COA Level</label>
            <select class="form-control save-elem select2" name="stafflevel3" data-level3="level3">
              <option value="" selected="" disabled="">Choose ...</option>
              @foreach ($l3s as $level3)
                <option value="{{ $level3['l3'] }}">{{ $level3['name'] }}</option>
              @endforeach
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
