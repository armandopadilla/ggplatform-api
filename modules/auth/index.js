const postLogout = require('./routes/postLogout');
const postLogin = require('./routes/postLogin');

module.exports = (fastify, opts, next) => {
  postLogout(fastify);
  postLogin(fastify);
  next();
};