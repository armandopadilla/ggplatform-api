const getWallets = require('./routes/getWallets');
const getWallet = require('./routes/getWallet');
const getMyWallet = require('./routes/getMyWallet');
const postWithdraw = require('./routes/postWithdraw');
const postDeposit = require('./routes/postDeposit');
const getMyEarnings = require('./routes/getMyEarnings');

module.exports = (fastify, opts, next) => {

  // GET - /wallet/list
  getWallets(fastify);

  // GET - /wallet/:walletId
  getWallet(fastify);

  // GET - /wallet/my-wallet
  getMyWallet(fastify);


  // POST - /wallet/withdraw
  postWithdraw(fastify);

  // POST - /wallet/deposit
  postDeposit(fastify);

  // GET - /wallet/my-earnings
  getMyEarnings(fastify);

  next();
};


/*
Each user will have a wallet
A user can deposit funds into the wallet
A user can witdraw funds from the wallet
A user can not widthdraw more than they curently have
A user, for now must all use $(USD)
 */
