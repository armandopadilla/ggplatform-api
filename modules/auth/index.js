const deleteLogout = require('./routes/deleteLogout');

module.exports = (fastify, opts, next) => {
  deleteLogout(fastify);
  next();
}