const ObjectID = require('mongodb').ObjectID;

/**
 * Create a wallet.  For now this happens as part of another transactions
 * Will not open this up for an API call
 *
 * @param accountId
 */
const create = async (accountId, fastify) => {
  const { db } = fastify.mongo.db;
  if (!accountId) throw new Error('accountId can not be empty');

  const walletInfo = {
    ownerId: ObjectID(accountId),
    balance: 0.00,
    currency: 'USD',
    createdDate: new Date(),
    updateDate: new Date()
  };

  try {
    const contest = await db.collection('wallets').insetOne(walletInfo);
    return walletInfo;
  } catch(error) {
    throw Error(error);
  }

};

module.exports = create;