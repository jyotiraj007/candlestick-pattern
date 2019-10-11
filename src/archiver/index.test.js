const mockZip = require('./../../__mocks__/zip');

// zip mock
jest.mock('./zip', () => mockZip);
const Archiver = require('.');

describe('archiver test suits', () => {
    let archiverInstance;
    describe('consructor test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            archiverInstance = new Archiver(Archiver.types.zip);
        });

        test('constructor should throw error for unsupported Archiver type', () => {
            try {
                archiverInstance = new Archiver('zip2');
            } catch (error) {
                expect(error.inner_error.message).toBe('Unsupported archiver type');
                expect(error.message).toBe('ERR_INVALID_ARGS');
            }
        });
        test('constructor should resolve archiver module based on Archiver.types passed in the constructor', () => {
            archiverInstance = new Archiver(Archiver.types.zip);
            expect(archiverInstance._archiverModule).toStrictEqual(mockZip());
        });
        test('Resolved archiver module should be called only once', () => {
            expect(mockZip).toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver module should be called with proper arguments', () => {
            expect(mockZip).toHaveBeenCalledWith(Archiver);
        });
    });
    describe('pipe test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            archiverInstance = new Archiver(Archiver.types.zip);
            archiverInstance.pipe('writablestream');
        });
        test('Resolved archiver should call pipe function only once', () => {
            expect(archiverInstance._archiverModule.pipe)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call pipe function with valid arguments', () => {
            expect(archiverInstance._archiverModule.pipe)
                .toHaveBeenCalledWith('writablestream');
        });
    });
    describe('append test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            archiverInstance = new Archiver(Archiver.types.zip);
            archiverInstance.append('readablestream', '/dest');
        });
        test('Resolved archiver should call append function only once', () => {
            expect(archiverInstance._archiverModule.append)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call append function with valid arguments', () => {
            expect(archiverInstance._archiverModule.append)
                .toHaveBeenCalledWith('readablestream', '/dest');
        });
    });
    describe('finalize test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            archiverInstance = new Archiver(Archiver.types.zip);
            archiverInstance.finalize();
        });
        test('Resolved archiver should call finalize function only once', () => {
            expect(archiverInstance._archiverModule.finalize)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call finalize functions', () => {
            expect(archiverInstance._archiverModule.finalize)
                .toHaveBeenCalledWith();
        });
    });
    describe('abort test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            archiverInstance = new Archiver(Archiver.types.zip);
            archiverInstance.abort();
        });
        test('Resolved archiver should call abort function only once', () => {
            expect(archiverInstance._archiverModule.abort)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call abort function', () => {
            expect(archiverInstance._archiverModule.abort)
                .toHaveBeenCalledWith();
        });
    });
    describe('on test suits', () => {
        const mockListener = jest.fn();
        beforeEach(() => {
            jest.clearAllMocks();
            archiverInstance = new Archiver(Archiver.types.zip);
            archiverInstance.on('error', mockListener);
        });
        test('Resolved archiver should call on function only once', () => {
            expect(archiverInstance._archiverModule.on)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call on function with valid arguments', () => {
            expect(archiverInstance._archiverModule.on)
                .toHaveBeenCalledWith('error', mockListener);
        });
    });
    describe('removeListener test suits', () => {
        const mockListener = jest.fn();
        beforeEach(() => {
            jest.clearAllMocks();
            archiverInstance = new Archiver(Archiver.types.zip);
            archiverInstance.removeListener('error', mockListener);
        });
        test('Resolved archiver should call removeListener function only once', () => {
            expect(archiverInstance._archiverModule.removeListener)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call removeListener function with valid arguments', () => {
            expect(archiverInstance._archiverModule.removeListener)
                .toHaveBeenCalledWith('error', mockListener);
        });
    });

    describe('file function test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            archiverInstance = new Archiver(Archiver.types.zip);
            archiverInstance.file('filePath', '/dest');
        });
        test('Resolved archiver should call file function', () => {
            expect(archiverInstance._archiverModule.file)
                .toHaveBeenCalledTimes(1);
        });

        test('Resolved archiver should call file function with valid arguments', () => {
            expect(archiverInstance._archiverModule.file)
                .toHaveBeenCalledWith('filePath', '/dest');
        });
    });

    describe('size function test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            archiverInstance = new Archiver(Archiver.types.zip);
            archiverInstance.size();
        });
        test('Resolved archiver should call size function', () => {
            expect(archiverInstance._archiverModule.size)
                .toHaveBeenCalledTimes(1);
        });

        test('Resolved archiver should call size function with no arguments', () => {
            expect(archiverInstance._archiverModule.size)
                .toHaveBeenCalledWith();
        });
    });
});
