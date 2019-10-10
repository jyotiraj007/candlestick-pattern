const EventEmitter = require('events');
const commonErrors = require('common-errors');
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const config = require('config');
const errors = require('../core/errors');
const Archiver = require('../archiver');

/**
 * Class Processor
 *
 * @fires data
 * @fires finalize
 * @fires error
 */
class Processor extends EventEmitter {
    /**
     * Creates an instance of Processor
     * @param {Stream.Writable} params.stream writable stream for
     *                                        zip content to be written
     *
     */
    constructor(resStream) {
        super();
        this._resStream = resStream;
    }

    /**
     * Create archiver instance
     * and set this._archiverInstance
     *
     * @memberof Processor
     * @returns {null} null
     *
     */
    _createArchiver() {
        this._archiverInstance = new Archiver(Archiver.types.zip);
    }

    /**
     * Archives the data in archiver
     *
     *  @memberof Processor
     * @returns {null} null
     *
     */
    _archive() {
        this._archiverInstance.file(
            path.join(
                process.env.ROOTDIR, 'data/raw_data.csv'
            ),
            path.join('candlestick', 'raw_chart/raw_data.csv')
        );
        this._archiverInstance.file(
            path.join(
                process.env.ROOTDIR, 'data/raw_chart.html'
            ),
            path.join('candlestick', 'raw_chart/raw_chart.html')
        );
        this._archiverInstance.file(
            path.join(
                process.env.ROOTDIR, 'data/curated_data.csv'
            ),
            path.join('candlestick', 'curated_chart/curated_data.csv')
        );
        this._archiverInstance.file(
            path.join(
                process.env.ROOTDIR, 'data/curated_chart.html'
            ),
            path.join('candlestick', 'curated_chart/curated_chart.html')
        );
    }

    _csv_row(Fone, Ftwo, Fthree) {
        this.FieldOne = Fone;
        this.FieldTwo = Ftwo;
        this.FieldThree = Fthree;
        this.FieldFour = Ffour;
    };

    _curate() {
        var results = [];
        const curated_data_path = path.join(
            process.env.ROOTDIR, 'data/curated_data.csv'
        )
        fs.createReadStream(path.join(
                process.env.ROOTDIR, 'data/raw_data.csv'
            ))
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                console.log(results);
                // [
                //   { NAME: 'Daffy Duck', AGE: '24' },
                //   { NAME: 'Bugs Bunny', AGE: '22' }
                // ]
                const csvWriter = createCsvWriter({
                    path: curated_data_path,
                    header: [{
                            id: 'Date',
                            title: 'DATE'
                        },
                        {
                            id: 'open',
                            title: 'OPEN'
                        },
                        {
                            id: 'high',
                            title: 'HIGH'
                        },
                        {
                            id: 'low',
                            title: 'LOW'
                        },
                        {
                            id: 'close',
                            title: 'CLOSE'
                        },
                        {
                            id: 'adj_close',
                            title: 'ADJ_CLOSE'
                        },
                        {
                            id: 'volume',
                            title: 'VOLUME'
                        }
                    ]
                });
                csvWriter.writeRecords(results) // returns a promise
                    .then(() => {
                        console.log('...Done');
                    })
                    .catch(()=>{
                        throw new Error('Error in writing to csv file')
                    });
            });

    }

    /**
     * Generates and streams web font kit zip
     *
     * @event data when some data is available to be read in the given stream
     * @type {null}
     *
     * @event finalize when all data has been written on the given stream
     * @type {WFKit}
     *
     * @event error when any error occurs
     * @type {CommonErrors.Error}
     * @returns {null} null
     */
    async generate() {
        try {

            // create archive instance
            this._createArchiver();
            this._archiverInstance.on(Archiver.events.error, (error) => {
                throw new commonErrors.Error(errors.ERR_ARCHIVER, error);
            });

            this._curate();

            this._archive();

            this._archiverInstance.pipe(this._resStream);

            this.emit('data');


            this._archiverInstance.on(Archiver.events.finalized, () => {
                // this._createWfKitObject();
                this.emit('finalize', this._wfkit);
            });

            this._archiverInstance.finalize();
        } catch (error) {
            // Will be undefined if Archiver instantiation throws error
            if (this._archiverInstance) {
                this._archiverInstance.abort();
            }
            // error event being listened in webfontkit/post
            this.emit('error', error);
        }
    }
}

module.exports = Processor;