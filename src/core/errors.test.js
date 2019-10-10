const errors = require('./errors');

describe('Errors test suite', () => {
    test('test addInnerError', () => {
        const testError = { err: 'Err', };
        const testInnerError = { err: 'InnerErr', };
        const resError = errors.addInnerError(testError, testInnerError);
        expect(resError.innerError).toStrictEqual(testInnerError);
        expect(resError.error).toStrictEqual(testError);
    });
});
