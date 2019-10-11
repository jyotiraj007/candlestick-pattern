const bunyan = require('bunyan');
const config = require('config');

let logger = null;
/**
     * Get a logger with specified name
     * @param {any} name - name
     * @returns {undefined} - undefined
     */
const getChildLogger = (name) => {
    if (logger === null) {
        logger = bunyan.createLogger({
            name: config.get('logger.bunyan.name'),
            serializers: {
                req: bunyan.stdSerializers.req,
                err: bunyan.stdSerializers.err,
            },
            streams: [{
                type: config.get('logger.bunyan.type'),
                path: config.get('logger.bunyan.path'),
                period: config.get('logger.bunyan.period'),
                count: config.get('logger.bunyan.count'),
            },
            ],
        });
    }
    return logger.child({
        context: name,
    });
};

module.exports = {
    getChildLogger,
};
