const HttpStatusCode = require('http-status-codes');
const commonErrors = require('common-errors');
const Processor = require('./../../../processor');
const errors = require('../../../core/errors');
const Analytics = require('../../../analytics');
const Validator = require('./validator');

/**
 * Class CandleStickPostAPI
 */
class CandleStickPostAPI {
    /**
     * Customize error
     * @param {Error} error - Any error
     * @returns {Object} errorObject - Contains error and inner error
     * @property {Error} errorObject.error - Custom error
     * @property {Error} errorObject.inner_error - Actual error with stack trace
     */
    static getCustomError(error) {
        const errorMap = {
            [errors.ERR_INVALID_ARGS]: () => (
                new commonErrors.ValidationError({
                    description: 'Invalid input param(s)',
                    details: {
                        message: error.inner_error.message,
                    },
                })),
            default: () => (new commonErrors.HttpStatusError(
                HttpStatusCode.INTERNAL_SERVER_ERROR, {
                    errorMessage: error.message.errorMessage,
                    details: {
                        sourceType: error.message.sourceType,
                        value: error.message.value,
                    },
                }
            )),
        };
        if (errorMap[error.message]) {
            return errors.addInnerError(errorMap[error.message](), error);
        }
        return errors.addInnerError(errorMap.default(), error);
    }

    /**
     * Sends analytics
     *
     * @param {Request} req - Request
     * @param {Object} analyticsData - json object that contains analytics data
     * @returns {unidentified} - Unidentified
     */
    static sendAnalytics(req, analyticsData) {
        Analytics.logInfo(req, analyticsData);
    }

    /**
     * Post API to generate candlestickchart kit
     * It listens to pipe, finalize and error events of archiver
     *
     * @param {Object} req - Request Object
     * @param {Object} res - Response Object
     * @param {Function} next - Next pointer
     *
     * @listens data
     * @listens finalize
     * @listens error
     *
     * @returns {unidentified} Unindentified
     */
    static async createCandleStickKit(req, res, next) {
        try {
            // Validating the request body
            Validator.validate({
                patternType: req.body.patternType,
                csvfile: req.body.candlestickCSV,
            });

            // Creating Processor and listening to its events
            const params = {};
            params.stream = res;
            params.patternType = req.body.patternType;
            const processor = new Processor(params);
            processor.on('data', () => {
                // Setting response for zip streaming
                res.setHeader('Content-Type', 'application/zip');
                res.attachment("CandleStick.zip");
            });
            processor.on('finalize', (message) => {
                CandleStickPostAPI.sendAnalytics(req, message);
            });
            processor.on('error', (error) => {
                if (!res.headersSent) {
                    next(CandleStickPostAPI.getCustomError(error));
                } else {
                    Analytics.logError(
                        req, CandleStickPostAPI.getCustomError(error)
                    );
                }
            });

            // Calling Processor generate function
            await processor.generate();
        } catch (error) {
            next(CandleStickPostAPI.getCustomError(error));
        }
    }
}

module.exports = {
    postCandleStickRawCSV: CandleStickPostAPI.createCandleStickKit,
};