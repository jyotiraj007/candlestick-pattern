const commonErrors = require('common-errors');
const errors = require('../core/errors');
const ZipArchiver = require('./zip');

/**
 * Archiver
 *
 * @class Archiver
 */
class Archiver {
    /**
     * Creates an instance of Archiver.
     * @param {Archiver.types} type - One of the values of Archiver.types.
     * @see Archiver.types
     * @throws {Error} - Throws error if Archiver type is not supported.
     * @memberof Archiver
     */
    constructor(type) {
        const archiverModules = {
            [Archiver.types.zip]: ZipArchiver,
        };
        if (!archiverModules[type]) {
            throw new commonErrors.Error(errors.ERR_INVALID_ARGS,
                new Error('Unsupported archiver type'));
        }
        this._archiverModule = new archiverModules[type](Archiver);
    }

    /**
     * Supported types
     *
     * @returns {Object} - supported types
     */
    static get types() {
        return {
            zip: 0,
        };
    }

    /**
     * Supported types
     *
     * @event error - when any error occurs
     * @type {CommonErrors.Error}
     *
     * @event finalize - when all data has been written on the given stream
     * @type {null}
     *
     * @event appended - when data is appended on the given stream
     * @type {null}
     *
     * @returns {Object} - supported types
     */
    static get events() {
        return {
            error: 'error',
            finalized: 'finalized',
            appended: 'appended',
        };
    }

    /**
    * Fetch size of archiver output
    *
    * @returns {Number} size of archiver output
    * @memberof Archiver
    */
    size() {
        return this._archiverModule.size();
    }

    /**
     * Pipe data to writable stream
     *
     * @param {Stream.Writable} stream - writableStream where
     *                                   archiver will write the data
     *
     * @returns {undefined}
     */
    pipe(stream) {
        this._archiverModule.pipe(stream);
    }

    /**
     * Append data to archiver
     *
     * @param {Stream.Readable} stream - readable stream
     * @param {String} dest - path where file would be streamed
     *
     * @returns {undefined} - Undefined
     */
    append(stream, dest) {
        this._archiverModule.append(stream, dest);
    }

    /**
     * Append file to archiver
     *
     * @param {String} filePath path of file to be appended
     * @param {String} dest path where file would be streamed
     * @memberof Archiver
     * @returns {undefined} - Undefined
     */
    file(filePath, dest) {
        this._archiverModule.file(filePath, dest);
    }

    /**
     * Close archiver stream
     *
     * @returns {undefined}
     */
    finalize() {
        this._archiverModule.finalize();
    }

    /**
     * Listens for error event in archiver
     *
     * @param {String} event - One of the events of Archiver.events
     *                         to be listened
     * @see Archiver.events
     * @param {Function} callback - callback to be called on the event
     * @memberof Archiver
     * @returns {Undefined} - undefined
     */
    on(event, callback) {
        this._archiverModule.on(event, callback);
    }

    /**
    * Removes the listener for an event
    *
    * @param {String} event - One of the events of Archiver.events
    *                         from which listener has to be removed
    * @see Archiver.events
    * @param {Function} listener - event handler
    * @memberof Archiver
    * @returns {Undefined} - undefined
    */
    removeListener(event, listener) {
        this._archiverModule.removeListener(event, listener);
    }

    /**
     * Abort archiver stream
     *
     * @returns {undefined}
     */
    abort() {
        this._archiverModule.abort();
    }
}

module.exports = Archiver;
