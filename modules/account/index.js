/**
 * Account management
 */
const getAccounts = require('./routes/getAccounts');
const getAccount = require('./routes/getAccount');
const postCreateAccount = require('./routes/postCreateAccount');

module.exports = (fastify, opt, next) => {

  // GET - /account/list
  getAccounts(fastify);

  // GET - /account/:accountId
  getAccount(fastify);

  // POST - /account
  postCreateAccount(fastify);

  // PUT - /account/:accountId
  updteAccount(fastify);

  // DELETE - /account/:accountId
  deleteAccount(fastify);

  next();
};