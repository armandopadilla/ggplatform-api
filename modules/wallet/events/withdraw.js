const { ObjectId } = require('mongodb');
const { db: collection } = require('../../../config');
const { sendWidthdrawReceiptEmail } = require('../../../helpers/email');
const { bankWithdraw } = require('../service');

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
    // 1. From bank
    const userBankAccountId = 123;
    await bankWithdraw(userBankAccountId, amount);

    // 2. Our system
    const newBalance = parseFloat(wallet.balance - amount);
    const updatedWallet = await db.collection(collection.WALLET_COLL_NAME).updateOne(
      { _id: ObjectId(wallet._id) },
      { $set: { balance: newBalance } },
    );

    // Send out receipt
    if (updatedWallet.matchedCount) {
      // Add the trx to the system
      await db.collection(collection.WALLET_TRXS_COLL_NAME).insertOne({
        type: 'Withdraw',
        description: 'User Init Withdraw',
        amount: amount,
        walletId: ObjectId(wallet._id),
        initByUserId: ObjectId(userId),
        status: 'pending',
        createdDate: new Date()
      });

      // Send out a receipt
      const userInfo = await db.collection(collection.USER_COLL_NAME).findOne({
        _id: ObjectId(userId),
      });

      await sendWidthdrawReceiptEmail(userInfo.email, amount);
      return wallet;
    }
    throw new Error('Could not update wallet. Unknown error.');
  }
  catch (error) {
    throw Error(error);
  }
};

module.exports = withdraw;
