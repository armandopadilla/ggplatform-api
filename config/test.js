const config = require('./default');

config.db.connInfo = {
  forceClose: true,
  url: 'mongodb://localhost:27017/gglol',
  useNewUrlParser: true,
};

config.server.logger = false;

module.exports = config;