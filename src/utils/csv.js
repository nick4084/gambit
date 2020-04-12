const csv = require('csv-parser');
const stripBom = require('strip-bom-stream');
const fs = require('fs');

export const readCsv = (filepath)  => {
    //first row is header
    let csvList = [];
    return new Promise(resolve => {
        fs.createReadStream(filepath)
        .pipe(stripBom())
        .pipe(csv())
        .on('data', (row) => {
            csvList.push(row)
        })
        .on('end', () => {
            resolve(csvList);
        });
    });

}