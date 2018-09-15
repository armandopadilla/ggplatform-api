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


/**
 1. Create account
  User Signs up
  System creates an account for the user
  System create a wallet for the user.

  User must pay initial $20 for wallet
  System goes through first deposit
  System sends a welcome email.
*/
