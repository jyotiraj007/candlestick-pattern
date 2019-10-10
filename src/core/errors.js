module.exports = {
    ERR_INVALID_ARGS: 'ERR_INVALID_ARGS',
    ERR_ARCHIVER: 'ERR_ARCHIVER',
    ERR_WEBFONT_CONVERSION: 'ERR_WEBFONT_CONVERSION',
    ERR_UNPROCESSABLE_FONT: 'ERR_UNPROCESSABLE_FONT',
    ERR_FAILED_TO_CREATE_CSS_RULE: 'ERR_FAILED_TO_CREATE_CSS_RULE',
    ERR_DOWNLOAD_FILE: 'ERR_DOWNLOAD_FILE',
    ERR_CONVERT_FONT: 'ERR_CONVERT_FONT',
    ERR_TEMPLATE: 'ERR_TEMPLATE',
    ERR_USER_TEMPLATE: 'ERR_USER_TEMPLATE',
    addInnerError: (error, innerError) => {
        const xError = {
            error,
            innerError,
        };
        return xError;
    },
};
