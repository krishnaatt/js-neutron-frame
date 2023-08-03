import fs from 'fs';
import csvParser from 'csv-parser';
import XLSX from 'xlsx';
import { DataFrame } from '../dataFrame';
export function createDataFrame(data, columns) {
    return new DataFrame(data, columns);
}
export async function readCSV(filePath) {
    const data = [];
    let columns = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('headers', (headers) => {
            columns = headers;
        })
            .on('data', (row) => {
            const parsedRow = {};
            for (const key of columns) {
                const value = row[key];
                if (!isNaN(Number(value))) {
                    parsedRow[key] = Number(value);
                }
                else {
                    parsedRow[key] = value;
                }
            }
            data.push(parsedRow);
        })
            .on('end', () => {
            const df = createDataFrame(data, columns);
            resolve(df);
        })
            .on('error', (err) => {
            reject(err);
        });
    });
}
// Method to read data from an XLSX file and create a DataFrame
export async function readXLSX(filePath) {
    return new Promise((resolve, reject) => {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            const columns = Object.keys(sheetData[0]);
            const df = new DataFrame(sheetData, columns);
            resolve(df);
        }
        catch (err) {
            reject(err);
        }
    });
}
