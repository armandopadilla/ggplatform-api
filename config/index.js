const env = process.env.NODE_ENV || 'dev';

let config;
if (env === 'test') {
  config = require('./test');
} else {
  config = require('./default');
}

module.exports = config;
