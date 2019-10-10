const archiver = require('archiver');


/**
 * ZipArchiver
 */
class ZipArchiver {
    /**
     *Creates an instance of ZipArchiver.
     * @param {Archiver} context - Archiver instance
     * @memberof ZipArchiver
     */
    constructor(context) {
        this._zipArchiver = archiver('zip', {
            zlib: {
                level: 9,
            }, // doing 9 sets the best compression level
        });
        this._archiverContext = context;
    }

    /**
     * _innerEvents
     */
    get _innerEvents() {
        return {
            [this._archiverContext.events.finalized]: 'finish',
            [this._archiverContext.events.appended]: 'entry',
            [this._archiverContext.events.error]: 'error',
        };
    }

    /**
     * Fetch size of zip
     *
     * @memberof ZipArchiver
     *
     * @returns {Number} Size of the zip
     */
    size() {
        return this._zipArchiver.pointer();
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
        this._zipArchiver.pipe(stream);
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
        this._zipArchiver.append(stream, {
            name: dest,
        });
    }

    /**
     * Append file to archiver
     *
     * @param {String} filePath - path of file to be appended
     * @param {*} dest path where file be saved
     * @memberof ZipArchiver
     *
     * @returns {undefined} - Undefined
     */
    file(filePath, dest) {
        this._zipArchiver.file(filePath, {
            name: dest,
        });
    }

    /**
     * Close archiver stream
     *
     * @param {Object} archive - archiver object
     *
     * @returns {undefined}
     */
    finalize() {
        this._zipArchiver.finalize();
    }

    /**
     * Listens for error event in archiver
     *
     * @param {String} event - One of the events of _innerEvents
     *                         to be listened
     * @see _innerEvents
     * @param {Function} callback - callback to be called on the event
     * @memberof ZipArchiver
     * @returns {Undefined} - undefined
     */
    on(event, callback) {
        this._zipArchiver.on(this._innerEvents[event], callback);
    }

    /**
     * Removes the listener for an event
     *
     * @param {String} event - One of the events of _innerEvents
     *                         from which listener has to be removed
     * @see _innerEvents
     * @param {Function} listener - event handler
     * @memberof ZipArchiver
     * @returns {Undefined} - undefined
     */
    removeListener(event, listener) {
        this._zipArchiver.removeListener(this._innerEvents[event], listener);
    }


    /**
     * Abort archiver stream
     *
     * @returns {undefined}
     */
    abort() {
        this._zipArchiver.abort();
    }
}

module.exports = ZipArchiver;
