const swaggerJSDoc = require('swagger-jsdoc');
const config = require('config');

/** Load the swagger configuration
 * @returns {Function} Function which loads swagger configuration is returned
 */
function load() {
    const options = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: config.get('app.name'),
                description: config.get('app.description'),
                version: 'v1',
            },
            servers: [
                {
                    url: `{scheme}://${config.get('swagger.serverURL')}${config.get('api.BASE_URI')}`,
                    variables: {
                        scheme: {
                            description: 'The Data Set API is accessible via https and http',
                            enum: config.get('swagger.schemes'),
                            default: config.get('swagger.defaultScheme'),
                        },
                    },
                },
            ],

            securityDefinitions: {
                Bearer: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                },
            },
            security: [
                {
                    Bearer: [],
                },
            ],
        },
        apis: ['./src/router/**/*.yaml',
        ], // Path to the API docs
    };

    const swaggerSpec = swaggerJSDoc(options);
    return swaggerSpec;
}

module.exports = {
    load,
};
