<script>
    var dataCallFromAddColor = @json($dataCallFromAddColor);
</script>

<div class="row">
    <div class="col-lg-12">
        <div class="table block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
            style="width: 100%;">

            <table class="w-full table table-striped table-hover" id="text-color-table">
                <thead class="text-2xl">
                    <tr class="py-2 px-2 text-md">
                        <th class="py-2 px-2 text-md align-middle text-left">Sr#</th>
                        <th class="py-2 px-2 text-md align-middle text-left">Name</th>
                        <th class="py-2 px-2 text-md align-middle text-left">Color</th>
                        <th class="py-2 px-2 text-md align-middle text-right"></th>
                    </tr> 
                </thead>
                <tbody id="text-color-table-tbody">

                </tbody>
            </table>
        </div>
    </div>
</div>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        let searchItemListViewTable = undefined;
        const getColorListViewRecord = () => {
            if (typeof searchItemListViewTable !== 'undefined') {
                searchItemListViewTable.destroy();
                $('#text-color-table tbody').empty();
            }
            searchItemListViewTable = $("#text-color-table").DataTable({
                processing: true,
                serverSide: true,
                ajax: {
                    url: base_url + '/color/getColorListViewRecord',
                    data: function(data) {
                        data.params = {
                            sac: "",
        
                        };
                    }
                },
                autoWidth: false,
                buttons: true,
                searching: true,
                createdRow: function(row, data, dataIndex) {
                    $(row).addClass('group item-row-td odd:bg-white even:bg-slate-200');
                    $('td', row).addClass('py-2 px-2 text-md align-middle');
                },
                columns: [{
                        data: null,
                        className: "searil number",
                        searchable: false,
                        orderable: false,
                        render: function(data, type, row, meta) {
                            return meta.row + 1;
                        }
                    },
                    {
                        data: "color_name",
                        name: 'color_codes.name',
                        className: "color_name",
                    },
                    {
                        data: "color_color",
                        name: 'color_codes.color',
                        className: "color_color",
                    },
                    {
                        data: null,
                        className: "select text-right",
                        searchable: false,
                        orderable: false,
                        render: function(data, type, row) {
                            return `<button type="button" class="btn btn-primary mr-2 mb-2 flex-1 btn-edit-color ${dataCallFromAddColor}  w-16" data-id="${data.id}"> <i class='fa fa-edit'></i> </button>`;
                        }
                    }
                ]
            });
        }

        getColorListViewRecord();
    });
</script>