/**
 * Account management
 */
const getAccounts = require('./routes/getAccounts');
const getAccount = require('./routes/getAccount');
const postCreateAccount = require('./routes/postCreateAccount');
const updateAccount = require('./routes/putUpdateAccount');
const deleteAccount = require('./routes/deleteAccount');
const postCreateApp = require('./routes/postCreateApp');

module.exports = (fastify, opt, next) => {

  // GET - /account/list
  getAccounts(fastify);

  // GET - /account/:accountId
  getAccount(fastify);

  // POST - /account
  postCreateAccount(fastify);

  // PUT - /account/:accountId
  updateAccount(fastify);

  // DELETE - /account/:accountId
  deleteAccount(fastify);

  // POST - /account/:accountId/app
  postCreateApp(fastify);

  next();
};