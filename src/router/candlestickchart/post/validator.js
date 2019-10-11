const commonErrors = require('common-errors');
const config = require('config');
const Joi = require('joi');
const errors = require('../../../core/errors');

/**
 * Class Validator
 */
class Validator {
    /**
     * Function to validate the input request
     * @param {Object} params - Request body
     * @throws {Error} -  Throws error if validation fails
     * @returns {Undefined} - Undefined
     */
    static validate(params) {
        const supportedFPatternTypes = config.get('patternTypes');

        const fontFileValidator = Joi.object().keys({
            name: Joi.string().required(),
            size: Joi.number().min(1).required(),
        }).unknown(true).required();

        const schema = Joi.object().keys({
            patternType: Joi.string().valid(...supportedFPatternTypes).required(),
            csvfile: fontFileValidator,
        });

        let {
            error,
        } = Joi.validate(params, schema);
        if (error != null) {
            throw new commonErrors.Error(errors.ERR_INVALID_ARGS, error);
        }
    }
}

module.exports = Validator;