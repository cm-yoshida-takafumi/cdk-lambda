import fs = require('fs')
import archiver = require('archiver')


export function createLayer() {
    const file_name = './temp/test.zip'
    const output = fs.createWriteStream(file_name);
    const archive = archiver('zip', {});

    archive.pipe(output);
    archive.directory('node_modules/uuid/', 'nodejs/node_modules/uuid');
    archive.finalize()
}