import { ifNull } from "../commonFunctions/CommonFunction.js";
import { highlightDuplicates } from "./import_staff.js";

/**
 * @description
 * Excel To HTML Table convert the excel file into an HTML table and append rows in table import.
 */
export class ExcelToJSON {
    constructor() {

        $('#txtItemTbodyExcelImport').empty(); // remove table imort tbody on every excel file import
        $('caption').empty(); // remove table imort tbody caption like export to xlsx on every excel file import
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
                    var rows = $('#tableImport tbody');
                    for (i = 0; i < productList.length; i++) {
                        const columns = Object.values(productList[i]);
                        rows.append(`
                            <tr>
                                <td>${i + 1}</td>
                                <td class="text-left staffType">${ifNull(columns[0])}</td>
                                <td class="text-left agreement">${ifNull(columns[1])}</td>
                                <td class="text-left department">${ifNull(columns[2])}</td>
                                <td class="text-left designation">${ifNull(columns[3])}</td>
                                <td class="text-left name">${ifNull(columns[4])}</td>
                                <td class="text-left fatherName">${ifNull(columns[5])}</td>
                                <td class="text-left cnic">${ifNull(columns[6])}</td>
                                <td class="text-left shift">${ifNull(columns[7])}</td>
                                <td class="text-left machineId">${ifNull(columns[8])}</td>
                                <td class="text-left gender">${ifNull(columns[9])}</td>
                                <td class="text-left dob">${ifNull(columns[10])}</td>
                                <td class="text-left doj">${ifNull(columns[11])}</td>
                                <td class="text-left address">${ifNull(columns[12])}</td>
                                <td class="text-right basicPay">${ifNull(columns[13])}</td>
                                <td class="text-right conveyance">${ifNull(columns[14])}</td>
                                <td class="text-right houseRent">${ifNull(columns[15])}</td>
                                <td class="text-right entertainment">${ifNull(columns[16])}</td>
                                <td class="text-right medical">${ifNull(columns[17])}</td>
                                <td class="text-right other">${ifNull(columns[18])}</td>
                                <td class="text-right EOBI">${ifNull(columns[19])}</td>
                                <td class="text-right socialSecurity">${ifNull(columns[20])}</td>
                                <td class="text-right insurance">${ifNull(columns[21])}</td>
                                <td class="text-right netPay">${ifNull(columns[22])}</td>
                                <td class='text-right'><a href="#" class="btn btn-primary btnRowRemove"><i class="fa fa-trash"></i></a></td>
                            </tr>
                        `);
                    }
                });
                highlightDuplicates(); // highlight duplicates table rows if are duplicated from the sheet by adding class duplicated for red rows.
            };

            reader.onerror = function (ex) {
                console.log(ex);
            };

            reader.readAsBinaryString(file);
        };
        general.disableSave(); // disable top header button on import excel file
    }
}
