<script>
    var dataCallFromAddNewItem = @json($dataCallFromAddNewItem);
</script>
@if ((int) $setting_configure[0]['is_permission_has_item_inventory'] === 1)
    <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="card shadow-lg">
                <div class="card-header">
                    <label class="radio-inline" for="Text-Inventory-Non-Inventory-All">
                        <input type="radio" name="get-Text-Inventory-Non-Inventory" id="Text-Inventory-Non-Inventory-All"
                            value="" checked>&nbsp;
                        All
                    </label>
                    <label class="radio-inline" for="Text-Inventory-Non-Inventory-Inventory">
                        &nbsp;&nbsp; <input type="radio" name="get-Text-Inventory-Non-Inventory"
                            id="Text-Inventory-Non-Inventory-Inventory" value="0">&nbsp;
                        Inventory
                    </label>
                    <label class="radio-inline" for="Text-Inventory-Non-Inventory-Service">
                        &nbsp;&nbsp; <input type="radio" name="get-Text-Inventory-Non-Inventory"
                            id="Text-Inventory-Non-Inventory-Service" value="1">&nbsp;
                        Service
                    </label>
                    <div class="card-tools">
                        <button type="button" class="btn btn-tool" id="addItemSyncAlt">
                            <i class="fas fa-sync-alt"></i>
                        </button>
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
                        <div class="col">
                            <div class="card">
                                <div class="card-body">
                                    <table class="table table-bordered" id="text-item-table">
                                        <thead class="text-sm text-md">
                                            <tr class="py-2 px-2 text-md">
                                                <th class="py-2 px-2 text-md align-middle text-left">Sr#</th>
                                                <th class="py-2 px-2 text-md align-middle text-left">Item Type</th>
                                                <th class="py-2 px-2 text-md align-middle text-left">Category</th>
                                                <th class="py-2 px-2 text-md align-middle text-left">Sub Category
                                                </th>
                                                <th class="py-2 px-2 text-md align-middle text-left">Brand</th>
                                                <th class="py-2 px-2 text-md align-middle text-left">Description
                                                </th>
                                                <th class="py-2 px-2 text-md align-middle text-left">Purchase Rate
                                                </th>
                                                <th class="py-2 px-2 text-md align-middle text-left">Retail Rate</th>
                                                <th class="py-2 px-2 text-md align-middle text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="text-item-table-tbody" class="text-sm text-md">

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endif
