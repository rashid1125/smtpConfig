import AlertComponent from "../../../../js/components/AlertComponent.js";
import { makeAjaxRequest } from "../../../../js/components/MakeAjaxRequest.js";
import { ifNull } from "../commonFunctions/CommonFunction.js";

class ExcelToJSON {
    constructor() {

        $('#txtItemTbodyExcelImport').empty();
        $('caption').empty();
        this.parseExcel = function (file) {
            const reader = new FileReader();
            reader.onload = function (e) {

                const data = e.target.result;
                const workbook = XLSX.read(data, {
                    type: 'binary'
                });

                workbook.SheetNames.forEach(function (sheetName) {

                    const xlRowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        raw: true,
                        defval: null
                    });

                    const productList = JSON.parse(JSON.stringify(xlRowObject));
                    const rows = $('#tableImport tbody');
                    for (i = 0; i < productList.length; i++) {
                        const columns = Object.values(productList[i]);
                        rows.append(`
                            <tr>
                                <td>${i + 1}</td>
                                <td class="text-left staffType">${ifNull(columns[0])}</td>
                                <td class="text-left staffAgreement">${ifNull(columns[1])}</td>
                                <td class="text-left staffDepartment">${ifNull(columns[2])}</td>
                                <td class="text-left staffDesignation">${ifNull(columns[3])}</td>
                                <td class="text-left staffName">${ifNull(columns[4])}</td>
                                <td class="text-left fatherName">${ifNull(columns[5])}</td>
                                <td class="text-left staffCnic">${ifNull(columns[6])}</td>
                                <td class="text-left staffShift">${ifNull(columns[7])}</td>
                                <td class="text-left staffMachineId">${ifNull(columns[8])}</td>
                                <td class="text-left staffGender">${ifNull(columns[9])}</td>
                                <td class="text-left staffDob">${ifNull(columns[10])}</td>
                                <td class="text-left staffDoj">${ifNull(columns[11])}</td>
                                <td class="text-left staffAddress">${ifNull(columns[12])}</td>
                                <td class="text-right staffBasicPay">${ifNull(columns[13])}</td>
                                <td class="text-right staffConveyance">${ifNull(columns[14])}</td>
                                <td class="text-right staffHouseRent">${ifNull(columns[15])}</td>
                                <td class="text-right staffEntertainment">${ifNull(columns[16])}</td>
                                <td class="text-right staffMedical">${ifNull(columns[17])}</td>
                                <td class="text-right staffOther">${ifNull(columns[18])}</td>
                                <td class="text-right staffEOBI">${ifNull(columns[19])}</td>
                                <td class="text-right staffSocialSecurity">${ifNull(columns[20])}</td>
                                <td class="text-right staffInsurance">${ifNull(columns[21])}</td>
                                <td class="text-right staffNetPay">${ifNull(columns[22])}</td>
                                <td class='text-right'><a href="#" class="btn btn-primary btnRowRemove"><i class="fa fa-trash"></i></a></td>
                            </tr>
                        `);
                    }
                });
            };

            reader.onerror = function (ex) {
                console.log(ex);
            };

            reader.readAsBinaryString(file);
        };
        general.disableSave();
    }
}

// Usage
async function sendData() {
    const fileInput = document.getElementById('input-excel');
    const formData = new FormData(document.getElementById('uploadForm'));
    if (!fileInput.files[0]) {
        return AlertComponent.getAlertMessage({ title: 'Error!', message: 'Please choose File before submit', type: 'danger' });
    }
    formData.append('upload_xls', fileInput.files[0]);
    try {
        const response = await makeAjaxRequest('POST', 'staffImportData', formData, 'json', { 'Content-Type': 'multipart/form-data', processData: false, contentType: false });
        if (response.status == false) {
            AlertComponent.getAlertMessage({ title: 'Error!', message: response.message, type: 'danger' });
        } else {
            AlertComponent.getAlertMessage({ title: 'Successfully!', message: response.message, type: 'success' });
        }
    } catch (error) {
        console.error(error.message);
    }
}

const handleFileSelect = (evt) => {
    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
    validateDuplicateStaffName();
};

/**
 * Checks for duplicate item names in the table and highlights them.
 * @returns {boolean} True if duplicates are found, false otherwise.
 */
const validateDuplicateStaffName = () => {
    const rows = $('#tableImport tbody tr');
    const seenValues = new Map();
    let hasDuplicates = false;

    rows.each(function () {
        const currentRow = $(this);
        const currentValue = currentRow.find("td.staffName").text().trim();

        if (seenValues.has(currentValue)) {
            currentRow.addClass('duplicate');
            seenValues.get(currentValue).addClass('duplicate');
            hasDuplicates = true;
        } else {
            seenValues.set(currentValue, currentRow);
        }
    });

    if (hasDuplicates) {
        AlertComponent.getAlertMessage({ title: 'Error!', message: 'Duplicate staff names found in the table.', type: 'danger' });
        return;
    }

    return hasDuplicates;
};



document.getElementById('input-excel').addEventListener('change', handleFileSelect, false);
document.getElementById('submitButton').addEventListener('click', sendData);
