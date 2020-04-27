import process from 'process';
const csv = require('csv-parser');
const stripBom = require('strip-bom-stream');
const fs = require('fs');

export const readCsv = (filepath) => {
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
export const basePath = () => process.cwd();

export const getFileNames = (path) => {
    return new Promise((resolve, reject) => fs.readdir(`${basePath()}/${path}`,
        (error, dir) => {
            if (error) {
                reject(error);
            }
            resolve(dir)
        })

    )
};