const HttpStatus = require('http-status-codes');
const ApiResponse = require('../core/apiResponse');
const Analytics = require('../analytics');


module.exports = {
    /**
    * Error handling middleware
    * @param {any} err - Error that should be sent in response
    * @param {any} req - request
    * @param {any} res - request
    * @param {any} next - Next handler to be called
    * @returns {undefined}
    */
    ErrorHandler(err, req, res, next) {
        if (!err || !err.error) {
            return;
        }
        Analytics.logError(req, err);
        next(err.error);
    },
    OkHandler(req, res) {
        const { apiResponse, } = res.locals;
        if (apiResponse instanceof ApiResponse) {
            return res.status(apiResponse.statusCode)
                .json(apiResponse.data);
        }
        return res.status(HttpStatus.NOT_FOUND).json(apiResponse);
    },
};
