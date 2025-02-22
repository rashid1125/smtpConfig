<div class="row">
    <div class="col">
        <div class="card shadow-lg">
            <div class="card-header">
                <h2 class="card-title font-weight-bold">{{ __('Import Excel / xlsx') }}</h2>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-tool" data-card-widget="remove">
                        <i class="fas fa-times"></i>
                    </button>
                    <button type="button" class="btn btn-tool">
                        <a href="item/exportxls" class="btn btn-primary"><i class="fa fa-file-export"></i></a>
                    </button>
                </div>
            </div>
            <div class="card-body">
                @if (session('status'))
                    <div class="alert alert-success" role="alert">
                        {{ session('status') }}
                    </div>
                @endif
                <div class="row">
                    <div class="col-md-6">
                        <form method="POST" action="" enctype="multipart/form-data" id="uploadForm">
                            @csrf
                            <div class="row">
                                <div class="col-md-4">
                                    <label for="input-excel"
                                        class="text cursor-pointer bg-blue-500 !text-white px-6 py-3 ">
                                        Choose File </label>
                                    <input type="file" class="hidden" name="upload_xls" id="input-excel"
                                        onchange="readURL(this); ">
                                </div>
                                <div class="col-md-4">
                                    <label for="submitButton"
                                        class="text cursor-pointer bg-green-500 !text-white px-6 py-3 ">
                                        {{ __('Submit File') }}</label>
                                    <button type="button" class="hidden" id="submitButton"></button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="table-responsive">
                            <table class="table table-bordered" id="tableImport">
                                <thead class="text-sm text-md">
                                    <tr class="py-2 px-2 text-md">
                                        <th class="py-2 px-2 text-md align-middle text-left">Sr#</th>
                                        <th class="py-2 px-2 text-md align-middle text-left">Category</th>
                                        <th class="py-2 px-2 text-md align-middle text-left">Sub Category</th>
                                        <th class="py-2 px-2 text-md align-middle text-left">Bar Code</th>
                                        <th class="py-2 px-2 text-md align-middle text-left">Name</th>
                                        <th class="py-2 px-2 text-md align-middle text-left">Native Name</th>
                                        <th class="py-2 px-2 text-md align-middle text-left">Item Type?</th>
                                        <th class="py-2 px-2 text-md align-middle text-left">Warehouse</th>
                                        <th class="py-2 px-2 text-md align-middle text-left">Stock Keeping</th>
                                        <th class="py-2 px-2 text-md align-middle text-left">Calcualtion Type</th>
                                        <th class="py-2 px-2 text-md align-middle text-right">Purchase Price</th>
                                        <th class="py-2 px-2 text-md align-middle text-right">Retail Price</th>
                                        <th class="py-2 px-2 text-md align-middle text-right">Whole Sale Price</th>
                                        <th class="py-2 px-2 text-md align-middle text-right">Tax Ratio</th>
                                        <th class="py-2 px-2 text-md align-middle text-right">Available Qty</th>
                                        <th class="py-2 px-2 text-md align-middle text-right">Cost</th>
                                        <th class="py-2 px-2 text-md align-middle text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody id="txtItemTbodyExcelImport">
                                    <tr>
                                        <td class="py-2 px-2 text-md align-middle text-left">1</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Category</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Sub Category</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Bar Code</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Name</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Native Name</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Inventory</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Warehouse</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Qty Only</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Qty</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Purchase Price</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Retail Price</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Whole Sale Price</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Tax Ratio</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Available Qty</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Cost</td>
                                        <td class="py-2 px-2 text-md align-middle text-right"><a href=''
                                                class='btn btn-primary btnRowRemove'><i class="fa fa-trash"></i></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="py-2 px-2 text-md align-middle text-left">2</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Category</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Sub Category</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Bar Code</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Name</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Native Name</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Inventory</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Warehouse</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Weight Only</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Weight</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Purchase Price</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Retail Price</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Whole Sale Price</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Tax Ratio</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Available Qty</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Cost</td>
                                        <td class="py-2 px-2 text-md align-middle text-right"><a href=''
                                                class='btn btn-primary btnRowRemove'><i class="fa fa-trash"></i></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="py-2 px-2 text-md align-middle text-left">3</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Category</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Sub Category</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Bar Code</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Name</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Native Name</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Inventory</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Warehouse</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Qty and Weight</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Per Mund</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Purchase Price</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Retail Price</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Whole Sale Price</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Tax Ratio</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Available Qty</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Cost</td>
                                        <td class="py-2 px-2 text-md align-middle text-right"><a href=''
                                                class='btn btn-primary btnRowRemove'><i class='fa fa-trash'></i></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="py-2 px-2 text-md align-middle text-left">4</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Category</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Sub Category</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Bar Code</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Name</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Native Name</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Service</td>
                                        <td class="py-2 px-2 text-md align-middle text-left">Warehouse</td>
                                        <td class="py-2 px-2 text-md align-middle text-left"></td>
                                        <td class="py-2 px-2 text-md align-middle text-left"></td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Purchase Price</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Retail Price</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Whole Sale Price</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Tax Ratio</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Available Qty</td>
                                        <td class="py-2 px-2 text-md align-middle text-right">Cost</td>
                                        <td class="py-2 px-2 text-md align-middle text-right"><a href=''
                                                class='btn btn-primary btnRowRemove'><i class="fa fa-trash"></i></a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</div>
<script>
    async function postData(formData) {
        try {
            const response = await fetch('item/importxls', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Failed to post data: ${error.message}`);
        }
    }
    // Usage
    async function sendData() {
        const fileInput = document.getElementById('input-excel');
        const formData = new FormData(document.getElementById('uploadForm'));
        if (!fileInput.files[0]) {
            return _getAlertMessage('Error!', "Please choose File before submit", 'danger');
        }
        formData.append('upload_xls', fileInput.files[0]);

        try {
            const response = await postData(formData);
            if (response.status == false && response.message !== "" && response.error !== "") {
                _getAlertMessage('Error!', response.message, 'danger');
            } else if (response.status == false && response.message !== "") {
                _getAlertMessage('Information!', response.message, 'info');
            } else {
                _getAlertMessage('Successfully!', response.message, 'success');
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    document.getElementById('submitButton').addEventListener('click', sendData);

    const handleFileSelect = (evt) => {
        var files = evt.target.files; // FileList object
        var xl2json = new ExcelToJSON();
        xl2json.parseExcel(files[0]);
    };

    const highlightDuplicates = (flg = false) => {
        $('#tableImport tbody tr').each(function(index1) {
            var row = $(this);
            var flag = false;
            var row_val1 = row.find("td").eq(4).text();
            $('#tableImport tbody tr').each(function(index2) {
                var compare_row = $(this);
                var compare_row_val1 = compare_row.find("td").eq(4).text();
                if (index1 != index2 && row_val1 == compare_row_val1) {
                    flag = true;
                }
            });

            if (flag == true) {
                row.removeClass('duplicate');
                row.addClass('duplicate');
                flg = true;
            }
            flag = false;
        });
        if ($('tr.duplicate').length > 0) {
            $.notify({
                message: 'Duplicates Item Name Found'
            }, {
                type: 'danger'
            });
        }
        return flg;
    };

    /**
     * @description
     * Excel To HTML Table convert the excel file into an HTML table and append rows in table import.
     */
    class ExcelToJSON {
        constructor() {

            $('#txtItemTbodyExcelImport').empty(); // remove table imort tbody on every excel file import
            $('caption').empty(); // remove table imort tbody caption like export to xlsx on every excel file import
            this.parseExcel = function(file) {
                const reader = new FileReader();
                reader.onload = function(e) {

                    const data = e.target.result;
                    const workbook = XLSX.read(data, {
                        type: 'binary'
                    });

                    workbook.SheetNames.forEach(function(sheetName) {

                        const XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                            raw: true,
                            defval: null
                        });

                        const productList = JSON.parse(JSON.stringify(XL_row_object));
                        var rows = $('#tableImport tbody');
                        for (i = 0; i < productList.length; i++) {
                            const columns = Object.values(productList[i]);
                            rows.append(`
                                        <tr>
                                            <td>${i + 1}</td>
                                            <td class='text-left category_name'>${ifnull(columns[0], 'None')}</td>
                                            <td class='text-left subcategory_name'>${ifnull(columns[1], 'None')}</td>
                                            <td class='text-left barcode'>${ifnull(columns[2], '')}</td>
                                            <td class='text-left item_name'>${ifnull(columns[3], '')}</td>
                                            <td class='text-left item_uname'>${ifnull(columns[4], '')}</td>
                                            <td class='text-left item_type'>${ifnull(columns[5], '')}</td>
                                            <td class='text-left warehouse'>${ifnull(columns[6], '')}</td>
                                            <td class='text-left stockKeeping'>${ifnull(columns[7], '')}</td>
                                            <td class='text-left calcualtionType'>${ifnull(columns[8], '')}</td>
                                            <td class='text-right purchase_rate'>${ifnull(columns[9], '')}</td>
                                            <td class='text-right sale_rate'>${ifnull(columns[10], '')}</td>
                                            <td class='text-right whole_sale_rate'>${ifnull(columns[11], '')}</td>
                                            <td class='text-right vat_ratio'>${ifnull(columns[12], '')}</td>
                                            <td class='text-right available_qty'>${ifnull(columns[13], '')}</td>
                                            <td class='text-right cost'>${ifnull(columns[14], '')}</td>
                                            <td class='text-right'><a href="#" class="btn btn-primary btnRowRemove"><i class="fa fa-trash"></i></a></td>
                                        </tr>
                                    `);
                        }
                    });
                    highlightDuplicates
                        (); // highlight duplicates table rows if are duplicated from the sheet by adding class duplicated for red rows.
                };

                reader.onerror = function(ex) {
                    console.log(ex);
                };

                reader.readAsBinaryString(file);
            };
            general.disableSave(); // disable top header button on import excel file
        }
    }

    document.getElementById('input-excel').addEventListener('change', handleFileSelect, false);
</script>
