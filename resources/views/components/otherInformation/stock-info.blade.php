<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label>Stock Information</label>
            <table class="table table-responsive" id="stockInformationTable">
                <thead>
                    <tr>
                        @isset($isSale)
                            <th class="text-left">Color Code</th>
                        @endisset
                        @if ($moduleSetting->stockKeepingMethod->id == 1)
                            <th class="text-right">Qty</th>
                        @elseif ($moduleSetting->stockKeepingMethod->id == 2)
                            <th class="text-right">Weight</th>
                        @else
                            <th class="text-right">Qty</th>
                            <th class="text-right">Weight</th>
                        @endif
                    </tr>
                </thead>
                <tbody id="stockInformationTbody">

                </tbody>
            </table>
        </div>
    </div>
</div>
