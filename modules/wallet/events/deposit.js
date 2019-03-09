const { ObjectID } = require('mongodb');
const { db: collection } = require('../../../config');
const { sendDepositReceiptEmail } = require('../../../helpers/email');
const { bankDeposit } = require('../service');

/**
 * Deposit funds into a wallet. Will not be open to public.
 *
 * @param userId
 * @param amount
 * @param db
 * @returns {Promise.<*>}
 */
const deposit = async (userId, amount, db) => {
  if (!userId) throw new Error('userId can not be empty');
  if (!amount) throw new Error('amount must be a value greater than 0.00');

  try {
    const wallet = await db.collection(collection.WALLET_COLL_NAME).findOne({
      ownerId: ObjectID(userId)
    });

    // Deposit Funds
    // 1. Into bank account
    await bankDeposit(userBankAccountId, amount);

    // 2. Into our system
    const newBalance = parseFloat(wallet.balance + amount);
    const updatedWallet = await db.collection(collection.WALLET_COLL_NAME).updateOne(
      { ownerId: ObjectID(userId) },
      { $set: { balance: newBalance } },
    );

    if (updatedWallet.matchedCount) {
      // Send out a receipt
      const userInfo = await db.collection(collection.USER_COLL_NAME).findOne({
        _id: ObjectId(userId),
      });

      await sendDepositReceiptEmail(userInfo.email, amount);
      return (updatedWallet.matchedCount);
    }
  }
  catch (error) {
    throw Error(error);
  }
};

module.exports = deposit;