const { ObjectId } = require('mongodb');
const { db: collection } = require('../../../config');

/**
 * Withdraw funds from a wallet. This is also part of other transactions.
 * Will not open to public
 *
 * This must happen immediately.
 *
 * @todo place this behind a queue. Last thing we need is someone hitting this thing
 * and trying to submit 100000 withdraw transactions at a time.
 * @param accountId
 * @param amount
 * @param fastify
 */
const withdraw = async (accountId, amount, db) => {
  if (!accountId) throw new Error('accountId can not be empty');
  if (!amount) throw new Error('amount must be a value greater than 0.00');

  const wallet = await db.collection(collection.WALLET_NAME).findOne({
    ownerId: ObjectId(accountId),
  });

  if (!wallet) throw new Error('This account has no wallet');

  // Check if the wallet has enough to withdraw
  if (wallet.balance < amount) throw new Error('Not enough funds.');

  // Withdraw!
  const newBalance = parseFloat(wallet.balance - amount);
  const updatedWallet = await db.collection(collection.WALLET_NAME).updateOne(
    { _id: ObjectId(wallet._id) },
    { $set: { balance: newBalance } },
  );

  if (updatedWallet.matchedCount) return wallet;
  throw new Error('Could not update wallet');
};

module.exports = withdraw;
