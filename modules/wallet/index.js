const getWallets = require('./routes/getWallets');
const getWallet = require('./routes/getWallet');
const getMyWallet = require('./routes/getMyWallet');

module.exports = (fastify, opts, next) => {

  // GET - /wallet/list
  getWallets(fastify);

  // GET - /wallet/:walletId
  getWallet(fastify);

  // GET - /wallet/my-wallet
  getMyWallet(fastify);

  next();
};


/*
Each user will have a wallet
A user can deposit funds into the wallet
A user can witdraw funds from the wallet
A user can not widthdraw more than they curently have
A user, for now must all use $(USD)
 */
