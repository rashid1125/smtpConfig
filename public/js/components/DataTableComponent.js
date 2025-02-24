"use strict";
class DataTableComponent {
  constructor (props = {}) {
    this.dataTable = undefined;
    this.props = props;
  }
  init(selector, columns, additionalOptions = {}) {
    if (this.dataTable) {
      this.dataTable.destroy();
      $(`${selector}Tbody`).empty();
    }

    this.dataTable = $(selector).DataTable({
      processing: true,
      serverSide: true,
      ajax: {
        url: `${this.props.requestedUrl}`,
        type: 'GET',
        data: this.props.sendingData,
        dataSrc: function (json) {
          return json.data;
        }
      },
      autoWidth: false,
      buttons: true,
      searching: true,
      columns: columns,
      ...additionalOptions,
      createdRow: function (row, data, dataIndex) {
        $(row).addClass('group hover:bg-orange-500 hover:text-white odd:bg-white even:bg-slate-50');
        $('td', row).addClass('py-1 px-1 text-md align-middle');
      }
    });

    this.dataTable.on('draw', function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
    if (this.props.modalToShow) {
      $(this.props.modalToShow).modal('show');
    }
  }
}

export default DataTableComponent;
