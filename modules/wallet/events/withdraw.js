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
 *
 * @param userId
 * @param amount
 * @param fastify
 */
const withdraw = async (userId, amount, db) => {
  if (!userId) throw new Error('userId can not be empty');
  if (!amount) throw new Error('amount must be a value greater than 0.00');

  try {
    const wallet = await db.collection(collection.WALLET_COLL_NAME).findOne({
      ownerId: ObjectId(userId),
    });

    if (!wallet) throw new Error('This user has no wallet');

    // Check if the wallet has enough to withdraw
    if (wallet.balance < parseFloat(amount)) throw Error('Not enough funds.');

    // Withdraw!
    const newBalance = parseFloat(wallet.balance - amount);
    const updatedWallet = await db.collection(collection.WALLET_COLL_NAME).updateOne(
      { _id: ObjectId(wallet._id) },
      { $set: { balance: newBalance } },
    );

    if (updatedWallet.matchedCount) return wallet;
    throw new Error('Could not update wallet. Unknown error.');
  }
  catch (error) {
    throw Error(error);
  }
};

module.exports = withdraw;
