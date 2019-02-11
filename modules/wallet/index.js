const getWallets = require('./routes/getWallets');
const getWallet = require('./routes/getWallet');

module.exports = (fastify, opts, next) => {

  // GET - /wallet/list
  getWallets(fastify);

  // GET - /wallet/:walletId
  getWallet(fastify);

  next();
};


/*
Each user will have a wallet
A user can deposit funds into the wallet
A user can witdraw funds from the wallet
A user can not widthdraw more than they curently have
A user, for now must all use $(USD)
 */
