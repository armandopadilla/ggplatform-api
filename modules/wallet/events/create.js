const { ObjectID } = require('mongodb');
const { db: collection } = require('../../../config');

/**
 * Create a wallet.  For now this happens as part of another transactions
 * Will not open this up for an API call
 *
 * @param userId
 */
const create = async (userId, db) => {
  if (!userId) throw new Error('accountId can not be empty');

  const walletInfo = {
    ownerId: ObjectID(userId),
    balance: 0.00,
    currency: 'USD',
    createdDate: new Date(),
    updateDate: new Date(),
  };

  try {
    await db.collection(collection.WALLET_COLL_NAME).insertOne(walletInfo);

    // Create the bank account for this user.
    const bankInfo = await bankCreateAccount(userId);

    // Update our system.

    return walletInfo;
  } catch (error) {
    throw Error(error);
  }

};

module.exports = create;
