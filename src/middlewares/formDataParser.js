const formidable = require('formidable');

const formDataParser = (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.on('fileBegin', function (name, file){
        file.path = process.env.ROOTDIR + '/data/raw_data.csv';
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        req.body = Object.assign({}, fields);
        req.body = Object.assign(req.body, files);
        next();
    });
};

module.exports = formDataParser;
