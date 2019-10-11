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
    constructor(params) {
        super();
        this._resStream = params.stream;
        this._patternType = params.patternType
        this.pattern = {
            'hammer': this._get_hammer_pattern
        }
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

    /**
     * Reads raw csv data received from request object
     *
     * @memberof Processor
     * @returns {Promise} Returns a promise which resolves the array of json objects.
     *                    Each object represent a row in csv file
     *
     */
    async _readRawCSV() {
        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(path.join(
                    process.env.ROOTDIR, 'data/raw_data.csv'
                ))
                .pipe(csv())
                .on('data', (data) => {
                    results.push(data)
                })
                .on('end', () => {
                    resolve(results)
                })
                .on('error', (error) => {
                    reject(error)
                });
        })
    }

    /**
     * Writes curated csv data to root/data folder with name curated_data.csv
     * @param {Array} params.curatedArrayData Array of json objects.
     *                                        Each object represent a row in csv file
     * @memberof Processor
     * @returns {null} null
     *
     */
    async _writeCuratedDataInCSV(curatedArrayData) {
        const curated_data_path = path.join(
            process.env.ROOTDIR, 'data/curated_data.csv'
        )
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
        await csvWriter.writeRecords(curatedArrayData) // returns a promise
    }

    /**
     * Filters out the hammer pattern data from raw cvs data
     * @param {Array} rawDataArray Array of json objects created from raw csv file received from request.
     *                             Each object represent a row in csv file
     * @memberof Processor
     * @returns {Array} Array of json objects. 
     *                  Each object represent hammer pattern of csv data
     *
     */
    async _get_hammer_pattern(rawDataArray) {
        const curatedDataArray = await rawDataArray.filter((item) => {
            const hammer_height_threshhold = config.hammer_height_threshhold;
            const body_upper_bound_threshhold = config.body_upper_bound_threshhold;
            const body_lower_bound_threshhold = config.body_lower_bound_threshhold;
            const high_low_diff = Math.abs(item.high - item.low);
            const body_th_upper_bound = body_upper_bound_threshhold * high_low_diff;
            const body_th_lower_bound = body_lower_bound_threshhold * high_low_diff;
            const open_close_diff = Math.abs(item.open - item.close);
            return (high_low_diff >= hammer_height_threshhold &&
                ((item.high == item.open) || (item.high == item.close)) &&
                ((open_close_diff <= body_th_upper_bound) && (open_close_diff > body_th_lower_bound)))
        });

        return curatedDataArray
    }

    /**
     * Curates or filters the hammer pattern data from raw csv data 
     *
     * @memberof Processor
     * @returns {null} null
     *
     */
    async _curate() {
        const results = await this._readRawCSV();
        const pattern_data = await this.pattern[this._patternType](results)
        await this._writeCuratedDataInCSV(pattern_data);
    }

    /**
     * Generates and streams candlestck kit zip
     *
     * @event data when some data is available to be read in the given stream
     * @type {null}
     *
     * @event finalize when all data has been written on the given stream
     * @type {String}
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

            await this._curate();

            this._archive();

            this._archiverInstance.pipe(this._resStream);

            this.emit('data');


            this._archiverInstance.on(Archiver.events.finalized, () => {
                const analyticsData = {
                    message: "Successfully streamed",
                    curated_data_path: path.join(process.env.ROOTDIR, 'data/curated_data.csv'),
                    curated_chart_html_path: path.join(process.env.ROOTDIR, 'data/curated_chart.html'),
                    raw_data_path: path.join(process.env.ROOTDIR, 'data/raw_data.csv'),
                    raw_chart_html_path: path.join(process.env.ROOTDIR, 'data/raw_chart.html'),

                }
                this.emit('finalize', analyticsData);
            });

            this._archiverInstance.finalize();
        } catch (error) {
            // Will be undefined if Archiver instantiation throws error
            if (this._archiverInstance) {
                this._archiverInstance.abort();
            }
            // error event being listened in candlestickchart/post
            this.emit('error', error);
        }
    }
}

module.exports = Processor;