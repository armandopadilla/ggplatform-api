/**
 * Check if:
 * 1. The user is already a participant in a contest.
 * 2. The user has a wallet with enough funds to enter the contest.
 *
 */
const canJoinContest = async (contestId, userId, db) => {
  // Check if the contest exists
  const contest = await db.collection(collection.CONTEST_COLL_NAME).findOne({
    _id: ObjectId(contestId)
  });

  if (!contest) throw new Error('Contest not found');

  // Check if the user has already entered into the contest.
  if (contest.participants.indexOf(userId) > -1) throw new Error('User already a participant in the contest');

  // Check if the wallet exists for the user
  const wallet = await db.collection(collection.WALLET_COLL_NAME).findOne({ ownerId: ObjectId(userId) });
  if (!wallet) throw new Error('Wallet not found');

  // Check if the user has enough funds
  if (wallet.balance < contest.entryFee) throw new Error('Not enough funds');


  return true;
};

module.exports = {
  canJoinContest
};