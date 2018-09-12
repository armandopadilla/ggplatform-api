const getAccount = require('./routes/getAccount');
const getAccounts = require('./routes/getAccounts');
const postCreateAccount = require('./routes/postCreateAccount');
const patchUpdateAccount = require('./routes/patchUpdateAccount');

module.exports = (fastify, options, next) => {
  // GET /account/:accountId
  getAccount(fastify);

  // GET  /account/list
  getAccounts(fastify);

  // POST /account
  postCreateAccount(fastify);

  // PATCH /account
  patchUpdateAccount(fastify);

  next();
};