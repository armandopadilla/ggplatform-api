/**
 * Join a specific contest
 *
 * @todo - is the user making the request the owner?
 *
 * FE sends BE contest to join and account that wants to join
 * System checks the entry fee.
 * System checks if the user has enough funds
 * If enough funds then withdraw and enter the user into contest
 * If NOT enough funds return a not-enough-funds error. FE can then take the user to another screen
 */
const ObjectId = require('mongodb').ObjectId;
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');
const withdraw = require('../../wallet/events/withdraw');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { userId } = req.body;
  const { contestId } = req.params;

  // Check if the contestId is valid.
  if (!ObjectId.isValid(contestId)) return response.error('Invalid Contest Id', 400);

  // Check if the userId is valid
  if (!ObjectId.isValid(userId)) return response.error('Invalid User Id', 400);

  try {
    // Check if the user can join the contest
    const wallet = await db.collection(collection.WALLET_NAME).findOne({ ownerId: ObjectId(userId) });
    const contest = await db.collection(collection.CONTEST_NAME).findOne({ _id: ObjectId(contestId) });

    // Check if the wallet exists
    if (!wallet) return response.error('Wallet not found', 404);

    // Check if the contest exists
    if (!contest) return response.error('Contest not found', 404);

    // Check if the user is already a participant. If already a participant error out.
    if (contest.participants.indexOf(userId) > -1) return response.error('User already a participant', 400);

    // If ready to enter into contest...
    if (wallet.balance >= contest.entryFee) {
      const data = await db.collection(collection.CONTEST_NAME).updateOne(
        { _id: ObjectId(contestId) },
        { $addToSet: { participants: userId.toString() } },
      );

      if (data.matchedCount) {
        await withdraw(userId, contest.entryFee, db);

        // Update the pot
        const newPot = contest.pot + contest.entryFee;
        await db.collection(collection.CONTEST_NAME).updateOne({
          _id: ObjectId(contestId)
        }, { $set: { pot: newPot } })

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
      },
      required: ['userId']
    },
    params: {
      contestId: { type: 'string', description: 'Unique contest id to join.' },
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object'
          }
        }
      },
      400: {
        description: 'Bad Request',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      },
      404: {
        description: 'Not Found',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      },
      500: {
        description: 'Internal Server Error',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db,
  },
});
