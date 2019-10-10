const express = require('express');

const router = express.Router();
router.use('/zip', require('./candlestickchart'));

module.exports = router;
