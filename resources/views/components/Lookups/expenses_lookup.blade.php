<script>
    var dataCallFromAddNewItem = @json($dataCallFromAddNewItem);
</script>

<div class="row">
    <div class="col-lg-12">
        <x-table.table-component id="ExpenseViewList" class="table table-bordered text-md">
            <x-table.table-head>
                <x-table.table-row>
                    <x-table.table-header-cell>Sr#</x-table.table-header-cell>
                    <x-table.table-header-cell>Name</x-table.table-header-cell>
                    <x-table.table-header-cell>Level 3</x-table.table-header-cell>
                    <x-table.table-header-cell-right>Action</x-table.table-header-cell-right>
                </x-table.table-row>
            </x-table.table-head>
            <tbody id="expensesTabletBody">

            </tbody>
        </x-table.table-component>
    </div>
</div>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        let searchItemListViewTable = undefined;
        const getExpensesListViewRecord = () => {
            if (typeof searchItemListViewTable !== 'undefined') {
                searchItemListViewTable.destroy();
                $('#expensesTabletBody').empty();
            }
            searchItemListViewTable = $("#ExpenseViewList").DataTable({
                processing: true,
                serverSide: true,
                ajax: {
                    url: base_url + '/account/expenses/getExpensesListViewRecord',
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
                    $(row).addClass('group odd:bg-white even:bg-slate-50 py-1 px-1');
                    $('td', row).addClass('py-1 px-1 text-md align-middle text-middle');
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
                        data: "parties_name",
                        name: 'parties.name',
                        className: "parties_name",
                    },
                    {
                        data: "level3_name",
                        name: 'level3.name',
                        className: "level3_name",
                    },
                    {
                        data: null,
                        className: "select text-right",
                        searchable: false,
                        orderable: false,
                        render: function(data, type, row) {
                            return `<button type="button" class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-expenses ${dataCallFromAddNewItem}" data-pid="${data.pid}"> <i class='fa fa-edit'></i> </button>`;
                        }
                    }
                ]
            });
        }
        getExpensesListViewRecord();
    });
</script>