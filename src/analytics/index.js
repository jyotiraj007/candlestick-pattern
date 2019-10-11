const logger = require('../logger').getChildLogger(__filename);

/**
 * To Log analytics as info using the existing logger
 * i.e. Info and errors will go in same log file
 *
 * To log anything, simply call Analytics.log with
 * request object and the json object with key:value pairs
 *
 * Note: This class only logs the info to the logger and does not
 * guarantee that will ship to Kibana via Telegraf. If you have added
 * a new field, please make sure to update telegraf.conf
 */
class Analytics {
    /**
     * Logs json to logger
     * @param {Object} req Request object
     * @param {Object} json JSON object to be logged
     * @returns {undefined} undefined
     */
    static logInfo(req, json) {
        const logObject = {};
        Object.keys(json).forEach((key) => {
            logObject[key] = ((typeof json[key]) === 'object')
                ? JSON.stringify(json[key]) : json[key];
        });

        logger.info(logObject);
    }

    /**
     * Logs error to logger
     * @param {Object} req Request object
     * @param {Object} err Error Object
     * @returns {undefined} undefined
     */
    static logError(req, err) {
        if (!err || !err.error) {
            return;
        }
        const { error, innerError, } = err;
        const logObject = {};
        if (innerError) {
            logObject.innerError = JSON.stringify(innerError,
                Object.getOwnPropertyNames(innerError));
        }
        logObject.errorMessage = (typeof error.message) !== 'string'
            ? JSON.stringify(error.message) : error.message;
        logObject.errorName = error.name;
        logObject.errorStack = error.stack;
        Object.keys(req.body).forEach((key) => {
            logObject[key] = (typeof req.body[key]) !== 'string'
                ? JSON.stringify(req.body[key]) : req.body[key];
        });
        Object.keys(req.query).forEach((key) => {
            logObject[key] = (typeof req.query[key]) !== 'string'
                ? JSON.stringify(req.query[key]) : req.query[key];
        });
        logger.error(logObject);
    }
}

module.exports = Analytics;
