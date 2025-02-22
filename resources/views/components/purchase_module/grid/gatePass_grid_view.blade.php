  <div class="card border-2 rounded">
      <div class="card-header bg-slate-100" data-card-widget="collapse" style="cursor: pointer;">
          <h1 class="text-sm text-md text-uppercase font-weight-bold card-title">
              Item Information</h1>
          <div class="card-tools">
              <button type="button" class="btn btn-tool" data-card-widget="collapse">
                  <i class="fas fa-minus"></i>
              </button>
          </div>
      </div>
      <div class="card-body">
          <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                  <div class="row mt-0">
                      <div class="col">
                          <label for="gridItemShortCodeDropdown">Item Code <sub class="asterisk"><i
                                      class="fa fa-asterisk"></i></sub></label>
                      </div>
                      <div class="col">
                          <button type="button" class="text-primary float-right mr-2 mb-2 flex-1 getItemLookUpRecord"
                              data-toggle="tooltip" title="Search Item's! (F1)" tabindex="-1"><i
                                  class="fa fa-search fa-1x"></i></button>
                      </div>
                  </div>
                  <select class="form-control select2" id="gridItemShortCodeDropdown" data-width="100%">
                      <option value="" selected disabled>Choose Short Code</option>

                  </select>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                  <div class="row mt-0">
                      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <label for="gridItemNameDropdown">Item <sub class="asterisk"><i
                                      class="fa fa-asterisk"></i></sub></label>
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <button type="button" class="text-primary float-right mr-2 mb-2 flex-1 getItemLookUpRecord"
                              data-toggle="tooltip" title="Search Item's! (F1)" tabindex="-1"><i
                                  class="fa fa-search fa-1x"></i></button>
                      </div>
                  </div>
                  <select class="form-control select2" id="gridItemNameDropdown" data-width="100%">
                      <option value="" selected disabled>Choose Item</option>

                  </select>
                  <input type='hidden' id="txtRequisitionNumber">
                  <input type='hidden' id="stockKeepingMethodId">
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                <div class="row mt-0">
                    <div class="col">
                        <label for="gridItemWarehouseDropdown">Warehouse  <sub class="asterisk"><i
                                    class="fa fa-asterisk"></i></sub></label>
                    </div>
                    <div class="col">
                        <button type="button" class="text-primary float-right mr-2 mb-2 flex-1 getItemWarehouseLookUpRecord"
                            data-toggle="tooltip" title="Search Item's! (F1)" tabindex="-1"><i
                                class="fa fa-search fa-1x"></i></button>
                    </div>
                </div>
                <select class="form-control select2" id="gridItemWarehouseDropdown" data-width="100%">

                </select>
            </div>
              @if ($purchaseModuleSettings->stockKeepingMethod->id == 1)
                  <div class="col-md-1">
                      <label for="gridItemQty">Qty <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                      <input type="text" class="form-input-class is_numeric" id="gridItemQty">
                  </div>
              @elseif ($purchaseModuleSettings->stockKeepingMethod->id == 2)
                  <div class="col-md-1">
                      <label for="gridItemWeight">Weight <sub class="asterisk"><i
                                  class="fa fa-asterisk"></i></sub></label>
                      <input type="text" class="form-input-class is_numeric" id="gridItemWeight">
                  </div>
              @else
                  <div class="col-md-1">
                      <label for="gridItemQty">Qty <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                      <input type="text" class="form-input-class is_numeric" id="gridItemQty">
                  </div>
                  <div class="col-md-1">
                      <label for="gridItemWeight">Weight <sub class="asterisk"><i
                                  class="fa fa-asterisk"></i></sub></label>
                      <input type="text" class="form-input-class is_numeric" id="gridItemWeight">
                  </div>
              @endif
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1">
                <div class="form-group">
                    <label for="btnAdd" class="col-sm-12 control-label">&nbsp;&nbsp;&nbsp;</label>
                    <div class="col-sm-12">
                        <button type="button" id="btnAdd" class="btn btn-outline-primary focus:border-2"
                            data-toggle="tooltip" data-title="Click for add new row"><i
                                class="fa fa-arrow-down fa-1x"></i></button>
                    </div>
                </div>
            </div>
              <div class="col-md-1 d-none">
                  <label for="gridItemRate">Rate <sub class="asterisk"><i class="fa fa-asterisk"></i></sub></label>
                  <input type="text" class="form-input-class rate-dec is_numeric" id="gridItemRate">
              </div>
              @if ($purchaseModuleSettings->grid_rate_type)
                  <div class="col-md-2 d-none">
                      <label for="gridItemRateTypeDropdown"> Rate Type</label>
                      <select class="form-control select2" id="gridItemRateTypeDropdown" data-width="100%">
                          <option value="" selected disabled>Choose Rate Type</option>
                          @foreach ($rateTypes as $rateType)
                              <option value="{{ $rateType->id }}" data-division_factor="{{ $rateType->division_by }}">
                                  {{ $rateType->name }}</option>
                          @endforeach
                      </select>
                      <input type='hidden' id="rateTypeDivisionFactor">
                  </div>
                  <div class="col-md-1 d-none">
                      <label for="gridItemRatePerKG">Rate / KG</label>
                      <input type="text" class="form-input-class is_numeric" id="gridItemRatePerKG">
                  </div>
              @endif
          </div>
          <div class="row mt-1 d-none">
              <div class="col-md-2">
                  <label for="gridItemGAmount">Gross Amount <sub class="asterisk"><i
                              class="fa fa-asterisk"></i></sub></label>
                  <input type="text" class="form-input-class is_numeric readonly" id="gridItemGAmount"
                      readonly="true">
              </div>
              <div class="col-md-1">
                  <label for="gridItemDiscountPercentage">Disc%</label>
                  <input type="text" class="form-input-class is_numeric" id="gridItemDiscountPercentage">
              </div>
              <div class="col-md-1">
                  <label for="gridItemDiscountPerUnit">Disc/Unit</label>
                  <input type="text" class="form-input-class is_numeric" id="gridItemDiscountPerUnit">
              </div>
              <div class="col-md-1">
                  <label for="gridItemRatePerUnit">Unit Rate</label>
                  <input type="text" class="form-input-class is_numeric readonly" id="gridItemRatePerUnit"
                      readonly="true">
              </div>
              <div class="col-md-2">
                  <label for="gridItemAmountExclTax">Amount Excl Tax <sub class="asterisk"><i
                              class="fa fa-asterisk"></i></sub></label>
                  <input type="text" class="form-input-class is_numeric readonly" id="gridItemAmountExclTax"
                      readonly="true">
              </div>
              @if ($companies->tax)
                  <div class="col-lg-1">
                      <label for="gridItemTaxPercentage">Tax%</label>
                      <input type="text" class="form-input-class is_numeric" id="gridItemTaxPercentage">
                  </div>
                  <div class="col-lg-2">
                      <label for="gridItemTaxAmount">Tax Amount</label>
                      <input type="text" class="form-input-class is_numeric" id="gridItemTaxAmount">
                  </div>
                  <div class="col-lg-2">
                      <label for="gridItemAmountInclTax">Amount Incl Tax <sub class="asterisk"><i
                                  class="fa fa-asterisk"></i></sub></label>
                      <input type="text" class="form-input-class is_numeric readonly" id="gridItemAmountInclTax"
                          readonly="true">
                  </div>
              @else
                  <div class="col-lg-2">
                      <label for="gridItemAmountInclTax">Net Amount <sub class="asterisk"><i
                                  class="fa fa-asterisk"></i></sub></label>
                      <input type="text" class="form-input-class is_numeric readonly" id="gridItemAmountInclTax"
                          readonly="true">
                  </div>
              @endif
          </div>
          <div class="row mt-1 d-none">
              <div class="col-xs-12 col-sm-11 col-md-11 col-lg-11">
                  <label for="gridRemarks">Particulars</label>
                  <textarea type="text" class="form-input-class no-resize custom-textarea" id="txtGridRemarks" tabindex="-1"></textarea>
              </div>
              
          </div>
      </div>
  </div>



  <div class="row mt-2">
      <div class="col">
          <div class="card">
              <div class="card-body">
                  <div class="table-responsive">
                      <table class="table table-responsive text-md" id="purchase_table">
                          <thead class="cf tbl_thead py-2 px-2">
                              <tr class="py-2 px-2 text-md">
                                  <th class="py-2 px-2 text-md align-middle text-left">Sr#</th>
                                  <th class="py-2 px-2 text-md align-middle text-left">Item Detail</th>
                                  <th class="py-2 px-2 text-md align-middle text-left">Warehouse</th>
                                  @if ($purchaseModuleSettings->stockKeepingMethod->id == 1)
                                      <th class="py-2 px-2 text-md align-middle text-right">Qty</th>
                                  @elseif ($purchaseModuleSettings->stockKeepingMethod->id == 2)
                                      <th class="py-2 px-2 text-md align-middle text-right">Weight</th>
                                  @else
                                      <th class="py-2 px-2 text-md align-middle text-right">Qty</th>
                                      <th class="py-2 px-2 text-md align-middle text-right">Weight</th>
                                  @endif
                                  <th class="py-2 px-2 text-md align-middle text-right d-none">Rate</th>
                                  @if ($purchaseModuleSettings->grid_rate_type)
                                      <th class="py-2 px-2 text-md align-middle text-right d-none">Rate Type</th>
                                      <th class="py-2 px-2 text-md align-middle text-right d-none">Rate / KG</th>
                                  @endif
                                  <th class="py-2 px-2 text-md align-middle text-right d-none">Gross Amount</th>
                                  <th class="py-2 px-2 text-md align-middle text-right d-none">Disc%</th>
                                  <th class="py-2 px-2 text-md align-middle text-right d-none">Disc/Unit</th>
                                  <th class="py-2 px-2 text-md align-middle text-right d-none">Unit Rate</th>
                                  <th class="py-2 px-2 text-md align-middle text-right d-none">Amount Excl Tax</th>
                                  @if ($companies->tax)
                                      <th class="py-2 px-2 text-md align-middle text-right d-none">Tax%</th>
                                      <th class="py-2 px-2 text-md align-middle text-right d-none">Tax Amount</th>
                                      <th class="py-2 px-2 text-md align-middle text-right d-none">Amount Incl Tax</th>
                                  @else
                                      <th class="py-2 px-2 text-md align-middle text-right d-none">Net Amount</th>
                                  @endif
                                  <th class="py-2 px-2 text-md align-middle text-right">Action</th>
                              </tr>
                          </thead>
                          <tbody class="table-body">
                          </tbody>
                          <tfoot class="table-footer">
                              <tr class="py-2 px-2 text-md">
                                  <td class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right"
                                      colspan="3">Totals</td>

                                  @if ($purchaseModuleSettings->stockKeepingMethod->id == 1)
                                      <td
                                          class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalQty">
                                      </td>
                                  @elseif ($purchaseModuleSettings->stockKeepingMethod->id == 2)
                                      <td
                                          class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalWeight">
                                      </td>
                                  @else
                                      <td
                                          class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalQty">
                                      </td>
                                      <td
                                          class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalWeight">
                                      </td>
                                  @endif

                                  <td
                                      class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalRate d-none">
                                  </td>

                                  @if ($purchaseModuleSettings->grid_rate_type)
                                      <td
                                          class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalRateType d-none">
                                      </td>
                                      <td
                                          class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalRatePerKG d-none">
                                      </td>
                                  @endif

                                  <td
                                      class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalGrossAmount d-none">
                                  </td>
                                  <td
                                      class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalDiscountPercentage d-none">
                                  </td>
                                  <td
                                      class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalDiscountPerUnit d-none">
                                  </td>
                                  <td
                                      class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalUnitRate d-none">
                                  </td>
                                  <td
                                      class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalAmountExclTax d-none">
                                  </td>

                                  @if ($companies->tax)
                                      <td
                                          class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalTaxPercentage d-none">
                                      </td>
                                      <td
                                          class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalTaxAmount d-none">
                                      </td>
                                  @endif
                                  <td
                                      class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotalAmountInclTax d-none">
                                  </td>
                                  <td
                                      class="py-2 px-2 text-md align-middle text-orange-600 font-weight-bold text-right gridItemTotal">
                                  </td>
                              </tr>
                          </tfoot>
                      </table>
                  </div>
              </div>
          </div>

      </div>
  </div>
