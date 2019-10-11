const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const config = require('config');
const cors = require('cors');
const commonErrors = require('common-errors');
const swaggerUi = require('swagger-ui-express');
const HttpStatus = require('http-status-codes');
const router = require('./../router');
const swagger = require('./../swagger');

const {responseHandler, } = require('./../middlewares');

const createApp = () => {
    const expressApp = express();
    const baseUri = config.get('api.BASE_URI');
    expressApp.use(bodyParser.json({ limit: '50mb', }));
    expressApp.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
    }));
    expressApp.use(compression());

    expressApp.use(baseUri, router);
    //  Mount routes
    expressApp.use(`${baseUri}ping`, (req, res) => res.sendStatus(HttpStatus.OK));

    // exposing swagger json
    expressApp.use(`${baseUri}swagger.json`, cors(), (req, res) => {
        res.send(swagger.load());
    });

    // Initialize swagger documentaion
    if (config.get('enableSwagger')) {
        expressApp.use(`${baseUri}docs`, swaggerUi.serve, swaggerUi.setup(swagger.load()));
    }
    // Add error handler and OkHandler middleware
    // after all other routes have been added
    expressApp.use(responseHandler.OkHandler);
    expressApp.use(responseHandler.ErrorHandler);
    expressApp.use(commonErrors.middleware.errorHandler);
    return expressApp;
};
module.exports = { createApp, };
