<div class="row">
    <div class="col-md-12">
        <div class="form-group">
            <label>Last Stock Locations</label>
            <table class="table table-responsive" id="otherStockInformationTable">
                <thead class="text-sm text-md">
                    <tr class="py-2 px-2 text-sm text-md">
                        <th class="py-2 px-2 text-sm text-md text-left">Location</th>
                        @if ($purchaseModuleSettings->stockKeepingMethod->id == 1)
                            <th class="py-2 px-2 text-sm text-md text-right">Qty</th>
                        @elseif ($purchaseModuleSettings->stockKeepingMethod->id == 2)
                            <th class="py-2 px-2 text-sm text-md text-right">Weight</th>
                        @else
                            <th class="py-2 px-2 text-sm text-md text-right">Qty</th>
                            <th class="py-2 px-2 text-sm text-md text-right">Weight</th>
                        @endif
                    </tr>
                </thead>
                <tbody class="text-sm text-md" id="otherStockInformationTbody">

                </tbody>
            </table>
        </div>
    </div>
</div>

<script type="text/JavaScript">
    const otherStockInformationStockKeepingMethodId = {!! json_encode($purchaseModuleSettings->stockKeepingMethod->id) !!};

    var getLastStockLocations = function (vrnoa, vrdate, item_id, stdid) {
        $("#otherStockInformationTbody").remove();
        $.ajax({
            url: `${base_url}/stock/getLastStockLocation`,
            type: 'GET',
            data: { 'vrnoa': vrnoa, 'vrdate': vrdate, 'item_id': item_id, 'stdid': stdid },
            dataType: 'JSON',
            success: function (response) {
                if (response.status === false && response.error !== "") {
                    _getAlertMessage('Error!', response.message, 'danger');
                } else if (response.status === false && response.message !== "") {
                    _getAlertMessage('Warning!', response.message, 'warning');
                } else {
                    $.each(response.data, function (index, elem) {
                        appendToTableLastStockLocations(elem);
                    });
                }
            }, 
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    };

    var appendToTableLastStockLocations = function (stockData) {
        var td = '';
        if (parseNumber(otherStockInformationStockKeepingMethodId) == 1) {
            td = `<td class='text-right text-md qty numeric'>${stockData.qty}</td>`;
        }

        if (parseNumber(otherStockInformationStockKeepingMethodId) == 2) {
            td = `<td class='text-right text-md qty numeric'>${stockData.weight}</td>`;
        }

        if (parseNumber(otherStockInformationStockKeepingMethodId) == 3) {
            td = `
                <td class='text-right text-md qty numeric'>${stockData.qty}</td>
                <td class='text-right text-md qty numeric'>${stockData.weight}</td>
            `;
        }
        
        var row = `<tr>
            <td class='text-left text-md location numeric'>${stockData.location}</td>
            ${td}
        </tr>`;
        $(row).appendTo('#laststockLocation_table');
    };
</script>

