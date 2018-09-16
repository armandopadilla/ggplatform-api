const { ObjectID } = require('mongodb');
const { db: collection } = require('../../../config');

/**
 * Deposit funds into a wallet. Will not open to public.
 *
 * @param accountId
 * @param amount
 * @param fastify
 * @returns {Promise.<*>}
 */
const deposit = async (accountId, amount, fastify) => {
  const { db } = fastify.mongo.db;
  if (!accountId) throw new Error('accountId can not be empty');
  if (!amount) throw new Error('amount must be a value greater than 0.00');

  const wallet = await db.collection(collection.WALLET_NAME).findOne({
    ownerId: ObjectID(accountId)
  });

  const newBalance = parseFloat(wallet.balance + amount);
  const updatedWallet = await db.collection(collection.WALLET_NAME).update(
    { ownerId: ObjectID(accountId) },
    { $set: { balance: newBalance } },
  );

  return (updatedWallet.matchedCount);
};

module.exports = deposit;