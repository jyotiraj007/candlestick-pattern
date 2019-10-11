module.exports = {
    ERR_INVALID_ARGS: 'ERR_INVALID_ARGS',
    ERR_ARCHIVER: 'ERR_ARCHIVER',
    ERR_UNPROCESSABLE_FONT: 'ERR_UNPROCESSABLE_FONT',
    addInnerError: (error, innerError) => {
        const xError = {
            error,
            innerError,
        };
        return xError;
    },
};
