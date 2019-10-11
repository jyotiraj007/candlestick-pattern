const http = require('http');
const fileSystem = require('fs');
const path = require('path');

const sendRawFile = (req, res, next) => {
    try {
        const filePath = path.join(process.env.ROOTDIR, 'data/raw_data.csv');
        const stat = fileSystem.statSync(filePath);
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Length': stat.size
        });

        const readStream = fileSystem.createReadStream(filePath);
        // We replaced all the event handlers with a simple call to readStream.pipe()
        readStream.pipe(res);
        // res.sendFile(filePath)
    } catch (error) {
        next(new Error('can not render file'))
    }
}

const sendCuratedFile = (req, res, next) => {
    try {
        const filePath = path.join(process.env.ROOTDIR, 'data/curated_data.csv');
        const stat = fileSystem.statSync(filePath);
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Length': stat.size
        });

        const readStream = fileSystem.createReadStream(filePath);
        // We replaced all the event handlers with a simple call to readStream.pipe()
        readStream.pipe(res);
    } catch (error) {
        next(new Error('can not render file'))
    }
}
module.exports = {
    getRawCSV: sendRawFile,
    getCuratedCSV: sendCuratedFile
};