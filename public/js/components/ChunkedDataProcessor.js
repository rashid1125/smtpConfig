export class ChunkedDataProcessor {
    constructor(options) {
        this.options = Object.assign({
            appendDataFlag: false,
            chunkSize: 500,
            tableId: 'purchase_table',
            generateRowHtml: (elem, index) => `<tr><td>${elem.detail_remarks}</td></tr>`,
        }, options);
    }

    ifNull(value, defaultValue) {
        return (value === null || value === undefined) ? defaultValue : value;
    }

    processChunk(chunk, startIndex) {
        const { generateRowHtml, tableId } = this.options;
        let htmlString = '';
        chunk.forEach((elem, index) => {
            elem.detail_remarks = this.ifNull(elem.detail_remarks, "");
            elem.department_details = elem.department_detail; // Assuming department_detail is defined elsewhere
            htmlString += generateRowHtml(elem, index + startIndex);
        });
        $(`#${tableId}`).append(htmlString); // Append the entire chunk HTML in one operation
        // Update serial numbers less frequently or after all chunks are processed to improve performance
    }

    async populateData(data) {
        const { chunkSize } = this.options;
        let promises = [];

        for (let i = 0; i < data.length; i += chunkSize) {
            let promise = new Promise((resolve) => {
                setTimeout(((startIndex) => {
                    const chunk = data.slice(startIndex, startIndex + chunkSize);
                    this.processChunk(chunk, startIndex);
                    resolve(); // Resolve the promise after the chunk is processed
                }).bind(this, i), 0);
            });
            promises.push(promise);
        }
        // Return a promise that resolves when all chunk processing promises have resolved
        await Promise.all(promises);
        this.options.appendDataFlag = true; // Optional: set a flag or perform other actions
    }

    updateSerialNumbers() {
        $(`#${this.options.tableId} tbody tr`).each((index, tr) => {
            $(tr).find('td').first().text(index + 1);
        });
    }
}
