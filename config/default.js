const defer = require('config/defer').deferConfig;
const p = require('./../package.json');

module.exports = {
    app: {
        name: p.name,
        description: p.description,
    },
    api: {
        ROOT_URI: '/candlestick',
        BASE_URI: defer(cfg => `${cfg.api.ROOT_URI}/`),
    },
    env: {
        mode: process.env.NODE_ENV,
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
    },
    logger: {
        bunyan: {
            name: p.name,
            type: 'rotating-file',
            level: 'error',
            path: `${(process.env.LOG_DIR) ? process.env.LOG_DIR : '.'}/logs.log`, // log to a file
            period: '1d', // daily rotation
            count: 3,
        },
    },
    enableSwagger: true,
    swagger: {
        serverURL: defer(cfg => `${cfg.env.host}:${cfg.env.port}`),
        schemes: ['https', 'http',
        ],
        defaultScheme: 'http',
    },
}