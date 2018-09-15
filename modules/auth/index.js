/**
 * Authentication
 *
 */
const postLogout = require('./routes/postLogout');
const postLogin = require('./routes/postLogin');

module.exports = (fastify, opts, next) => {
  // POST /auth/logout
  postLogout(fastify);

  // POST /auth/login
  postLogin(fastify);

  next();
};