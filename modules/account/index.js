const getAccount = require('./routes/getAccount');
const getAccounts = require('./routes/getAccounts');
const postCreateAccount = require('./routes/postCreateAccount');

module.exports = (fastify, options, next) => {
  getAccount(fastify);
  getAccounts(fastify);
  postCreateAccount(fastify);
  next();
};