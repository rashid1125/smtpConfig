 <script>
    var dataCallFromAddNewItem = @json($dataCallFromAddNewItem);
</script>

<div class="row">
    <div class="col-lg-12">
        <div class="table block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
            style="width: 100%;">
            <table class="w-full table table-striped table-hover" id="text-level2-table">
                <thead class="text-2xl">
                    <tr class="py-2 px-2 text-md">
                        <th class="py-2 px-2 text-md align-middle text-left">Sr#</th>
                        <th class="py-2 px-2 text-md align-middle text-left">Level 2</th>
                        <th class="py-2 px-2 text-md align-middle text-left">Level 1</th>
                        <th class="py-2 px-2 text-md align-middle text-right"></th>
                    </tr>
                </thead>
                <tbody id="text-level2-table-tbody">

                </tbody>
            </table>
        </div>
    </div>
</div>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        let searchItemListViewTable = undefined;
        const getlevel2ListViewRecord = () => {
            if (typeof searchItemListViewTable !== 'undefined') {
                searchItemListViewTable.destroy();
                $('#text-level2-table tbody').empty();
            }
            searchItemListViewTable = $("#text-level2-table").DataTable({
                processing: true,
                serverSide: true,
                ajax: {
                    url: base_url + '/accountlevel/getlevel2ListViewRecord',
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
                        data: "level2_name",
                        name: 'level2.name',
                        className: "level2_name",
                    },
                    {
                        data: "level1_name",
                        name: 'level1.name',
                        className: "text-left level1_name",
                    },
                    {
                        data: null,
                        className: "select text-right",
                        searchable: false,
                        orderable: false,
                        render: function(data, type, row) {
                            return `<button type="button" class="btn btn-primary mr-2 mb-2 flex-1 btn-edit-level2 ${dataCallFromAddNewItem}  w-16" data-l2="${data.l2}"> <i class='fa fa-edit'></i> </button>`;
                        }
                    }
                ]
            });
        };

        getlevel2ListViewRecord();
    });
</script>
