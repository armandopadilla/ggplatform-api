const { ObjectID } = require('mongodb');
const { db: collection } = require('../../../config');

/**
 * Create a wallet.  For now this happens as part of another transactions
 * Will not open this up for an API call
 *
 * @param accountId
 */
const create = async (accountId, db) => {
  if (!accountId) throw new Error('accountId can not be empty');

  const walletInfo = {
    ownerId: ObjectID(accountId),
    balance: 0.00,
    currency: 'USD',
    createdDate: new Date(),
    updateDate: new Date(),
  };

  try {
    await db.collection(collection.WALLET_NAME).insertOne(walletInfo);
    return walletInfo;
  } catch (error) {
    throw Error(error);
  }

};

module.exports = create;
