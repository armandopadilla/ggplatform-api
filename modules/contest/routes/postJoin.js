/**
 * Join a specific contest
 *
 * FE sends BE contest to join and account that wants to join
 * System checks the entry fee.
 * System checks if the user has enough funds
 * If enough funds then withdraw and enter the user into contest
 * If NOT enough funds return a not-enough-funds error. FE can then take the user to another screen
 */
const ObjectID = require('mongodb').ObjectId;
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');
const withdraw = require('../../wallet/events/withdraw');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { userId } = req.body;
  const { contestId } = req.params;

  try {
    // Check if the user can join the contest
    const wallet = await db.collection(collection.WALLET_NAME).findOne({ ownerId: userId });
    const contest = await db.collection(collection.ACCOUNT_NAME).findOne({ _id: contestId });

    // If yes, withdraw and join
    if (wallet.balance >= contest.entryFee) {
      const data = await db.collection(collection.CONTEST_NAME).updateOne(
        { _id: ObjectID(contestId) },
        { $addToSet: { participants: userId } },
      );

      if (data.matchedCount) {
        await withdraw(userId, contest.entryFee, db);
        return response.success({});
      }
    } else {
      return response.error('Not enough funds', 400);
    }
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/:contestId/join',
  handler,
  schema: {
    tags: ['Contest'],
    description: 'Join a specific contest',
    summary: 'Join contest',
    body: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Unique user id.' }
      }
    },
    params: {
      contestId: { type: 'string', description: 'Unique contest id to join.' }
    },
    required: ['contestId', 'userId'],
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object'
          }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db,
  },
});
