const formidable = require('formidable');

const formDataParser = (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file){
        file.path = process.env.ROOTDIR + '/data/raw_data.csv';
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
        next()
    });
};

module.exports = formDataParser;
