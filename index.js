const config = require('config');
const app = require('./src/app/app.js').createApp();

process.env.ROOTDIR = __dirname;

app.listen(config.get('env.port'));