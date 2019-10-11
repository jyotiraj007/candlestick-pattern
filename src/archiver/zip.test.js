const mockArchiver = require('archiver');
const Archiver = require('.');

const ZipArchiver = require('./zip');

describe('ZipArchiver test suit', () => {
    let zipArchiverInstance;
    const testEvents = {
        events: Archiver.events,

    };
    describe('consructor test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            zipArchiverInstance = new ZipArchiver(testEvents);
        });
        test('Constructor should call archiver npm module with valid arguments', () => {
            expect(mockArchiver).toHaveBeenCalledWith('zip', {
                zlib: {
                    level: 9,
                },
            });
        });
        test('Constructor should call archiver npm module only once', () => {
            expect(mockArchiver).toHaveBeenCalledTimes(1);
        });
    });

    describe('pipe test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            zipArchiverInstance = new ZipArchiver(testEvents);
            zipArchiverInstance.pipe('writablestream');
        });
        test('Resolved archiver should call pipe function only once', () => {
            expect(zipArchiverInstance._zipArchiver.pipe)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call pipe function with valid arguments', () => {
            expect(zipArchiverInstance._zipArchiver.pipe)
                .toHaveBeenCalledWith('writablestream');
        });
    });
    describe('append test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            zipArchiverInstance = new ZipArchiver(testEvents);
            zipArchiverInstance.append('readablestream', '/dest');
        });
        test('Resolved archiver should call append function only once', () => {
            expect(zipArchiverInstance._zipArchiver.append)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call append function with valid arguments', () => {
            expect(zipArchiverInstance._zipArchiver.append)
                .toHaveBeenCalledWith('readablestream', {
                    name: '/dest',
                });
        });
    });
    describe('finalize test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            zipArchiverInstance = new ZipArchiver(testEvents);
            zipArchiverInstance.finalize();
        });
        test('Resolved archiver should call finalize function only once', () => {
            expect(zipArchiverInstance._zipArchiver.finalize)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call finalize function', () => {
            expect(zipArchiverInstance._zipArchiver.finalize)
                .toHaveBeenCalledWith();
        });
    });
    describe('abort test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            zipArchiverInstance = new ZipArchiver(testEvents);
            zipArchiverInstance.abort();
        });
        test('Resolved archiver should call abort function only once', () => {
            expect(zipArchiverInstance._zipArchiver.abort)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call abort function', () => {
            expect(zipArchiverInstance._zipArchiver.abort)
                .toHaveBeenCalledWith();
        });
    });
    describe('on test suits', () => {
        const mockListener = jest.fn();
        beforeEach(() => {
            jest.clearAllMocks();
            zipArchiverInstance = new ZipArchiver(testEvents);
            zipArchiverInstance.on('error', mockListener);
        });
        test('Resolved archiver should call on function of zipArchiver only once', () => {
            expect(zipArchiverInstance._zipArchiver.on)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call on function of zipArchiver with valid arguments', () => {
            expect(zipArchiverInstance._zipArchiver.on)
                .toHaveBeenCalledWith('error', mockListener);
        });
    });
    describe('file test suits', () => {
        const mockListener = jest.fn();
        beforeEach(() => {
            jest.clearAllMocks();
            zipArchiverInstance = new ZipArchiver(testEvents);
            zipArchiverInstance.removeListener('error', mockListener);
        });
        test('Resolved archiver should call removeListener function only once', () => {
            expect(zipArchiverInstance._zipArchiver.removeListener)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call removeListener function with valid arguments', () => {
            expect(zipArchiverInstance._zipArchiver.removeListener)
                .toHaveBeenCalledWith('error', mockListener);
        });
    });

    describe('file test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            zipArchiverInstance = new ZipArchiver(testEvents);
            zipArchiverInstance.file('filePath', '/dest');
        });
        test('Resolved archiver should call removeListener function only once', () => {
            expect(zipArchiverInstance._zipArchiver.file)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call file function with valid arguments', () => {
            expect(zipArchiverInstance._zipArchiver.file)
                .toHaveBeenCalledWith('filePath', { name: '/dest', });
        });
    });

    describe('size test suits', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            zipArchiverInstance = new ZipArchiver(testEvents);
            zipArchiverInstance.size();
        });
        test('Resolved archiver should call size function only once', () => {
            expect(zipArchiverInstance._zipArchiver.pointer)
                .toHaveBeenCalledTimes(1);
        });
        test('Resolved archiver should call size function with no arguments', () => {
            expect(zipArchiverInstance._zipArchiver.pointer)
                .toHaveBeenCalledWith();
        });
    });
});
