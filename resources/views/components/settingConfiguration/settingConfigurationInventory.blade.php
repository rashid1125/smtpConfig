<div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="card collapsed-card">
            <div class="card-header" data-card-widget="collapse" style="cursor: pointer;">
                <h1 class="text-sm text-md text-uppercase font-weight-bold card-title">Inventory Setting</h1>
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
                        <label>Ingredient Categories</label>
                        <select class="form-control save-elem select2 this-optional" name="ingredient_categories"
                            multiple="true" data-placeholder="Choose Ingredient Categories">
                            @foreach($categories as $category)
                                <option value="<?php echo $category['id']; ?>"><?php echo $category['name']; ?></option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label>Raw Material Categories</label>
                        <select class="form-control save-elem select2 this-optional" name="raw_material_categories"
                            multiple="true" data-placeholder="Choose Ingredient Categories">
                            @foreach($categories as $category)
                                <option value="<?php echo $category['id']; ?>"><?php echo $category['name']; ?></option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label> Finish Item Categories</label>
                        <select class="form-control save-elem select2 this-optional" name="finish_item_categories"
                            multiple="true" data-placeholder="Choose Ingredient Categories">
                            @foreach($categories as $category)
                                <option value="<?php echo $category['id']; ?>"><?php echo $category['name']; ?></option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-lg-2">
                        <label> Defult Costing Method</label>
                        <select class="form-control save-elem select2" name="costing_method"
                            data-placeholder="Choose Costing Method">
                            <option value="" selected="" disabled="">
                                Costing Method ...</option>
                            <option value="lastpurchase">Last Purchase</option>
                            <option value="avg">Weighted Average</option>
                            <option value="perpetual_average">Perpetual Average (On
                                Available Stock)</option>
                            <option value="us">User Specific</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
