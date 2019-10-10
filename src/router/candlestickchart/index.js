const router = require('express').Router();
const candlestickPostApis = require('./post');
const {
    getRawCSV,
    getCuratedCSV
} = require('./get');

const {
    formDataParser,
} = require('./../../middlewares');

router.post('/', formDataParser, candlestickPostApis.postCandleStickRawCSV);
router.get('/rawcsv/', getRawCSV);
router.get('/curatedcsv/', getCuratedCSV);


module.exports = router;