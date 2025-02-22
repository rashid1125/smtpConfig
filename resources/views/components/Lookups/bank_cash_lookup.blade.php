<script>
    var dataCallFromAddNewItem = @json($dataCallFromAddNewItem);
</script>

<div class="row">
    <div class="col-lg-12">
        <x-table.table-component id="BankViewList" class="table table-bordered text-md">
            <x-table.table-head>
                <x-table.table-row>
                    <x-table.table-header-cell>Sr#</x-table.table-header-cell>
                    <x-table.table-header-cell>Bank Name</x-table.table-header-cell>
                    <x-table.table-header-cell>Mobile</x-table.table-header-cell>
                    <x-table.table-header-cell>Branch Address</x-table.table-header-cell>
                    <x-table.table-header-cell>Level 3</x-table.table-header-cell>
                    <x-table.table-header-cell-right>Action</x-table.table-header-cell-right>
                </x-table.table-row>
            </x-table.table-head>
            <tbody id="bankTabletBody">

            </tbody>
        </x-table.table-component>
    </div>
</div>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        let searchItemListViewTable = undefined;
        const getbankListViewRecord = () => {
            if (typeof searchItemListViewTable !== 'undefined') {
                searchItemListViewTable.destroy();
                $('#bankTabletBody').empty();
            }
            searchItemListViewTable = $("#BankViewList").DataTable({
                processing: true,
                serverSide: true,
                ajax: {
                    url: base_url + '/account/bank/getbankListViewRecord',
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
                        data: "name",
                        name: 'parties.name',
                        className: "parties_name",
                    },
                    {
                        data: "mobile",
                        name: 'parties.mobile',
                        className: "parties_mobile",
                        render: function(data, type, row, meta) {
                            return data ? data : '-';
                        }
                    },
                    {
                        data: "address",
                        name: 'parties.address',
                        className: "parties_address",
                        render: function(data, type, row, meta) {
                            return data ? data : '-';
                        }
                    },
                    {
                        data: "level3_name",
                        name: 'lastLevel.name',
                        className: "level3_name",
                    },
                    {
                        data: null,
                        className: "select text-right",
                        searchable: false,
                        orderable: false,
                        render: function(data, type, row) {
                            return `<button type="button" class="btn btn-sm btn-outline-primary group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white align-right mr-1 mb-1 flex-1 btn-edit-bank ${dataCallFromAddNewItem}" data-pid="${data.pid}"> <i class='fa fa-edit'></i> </button>`;
                        }
                    }
                ]
            });
        }

        getbankListViewRecord();
    });
</script>
