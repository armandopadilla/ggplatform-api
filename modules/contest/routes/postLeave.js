/**
 * Leave a specific contest
 *
 * @todo can the user do this?  Or should they contact support? Yes they should do this.
 *
 * On update
 *  send out email
 *  update the pot
 *  log this event for auditing.
 */
const ObjectId = require('mongodb').ObjectId;
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');
const { sendLeaveContestEmail } = require('../../../helpers/email');
const deposit = require('../../wallet/events/deposit');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { userId } = req.body;
  const { contestId } = req.params;

  if (!ObjectId.isValid(contestId)) return response.error('Invalid contest Id', 400);

  // Check if the userId is valid
  if (!ObjectId.isValid(userId)) return response.error('Invalid user Id', 400);

  try {
    const user = await db.collection(collection.ACCOUNT_COLL_NAME).findOne({
      _id: ObjectId(userId)
    });

    const wallet = await db.collection(collection.WALLET_COLL_NAME).findOne({
      ownerId: ObjectId(userId)
    });

    const contest = await db.collection(collection.CONTEST_COLL_NAME).findOne({
      _id: ObjectId(contestId)
    });

    // User preset?
    if (!user) return response.error('Account not found', 404);

    // Wallet present?
    if (!wallet) return response.error('Wallet not found', 404);

    // Contest present?
    if (!contest) return response.error('Contest not found', 404);

    const data = await db.collection(collection.CONTEST_COLL_NAME).updateOne(
      { _id: ObjectId(contestId) },
      { $pull: { participants: userId } },
    );

    // Send out email
    await sendLeaveContestEmail(user.email);

    // Deduct the pot for the contest
    const newPot = (contest.pot - contest.entryFee);
    await await db.collection(collection.CONTEST_COLL_NAME).updateOne(
      { _id: ObjectId(contestId) },
      { $set: { pot: newPot } }
    );

    // Credit the users wallet
    await deposit(userId, contest.entryFee, db);

    // Audit entry, here or in individual items.

    if (data.matchedCount) return response.success({});
    return response.error('Could not remove user from contest', 400);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/:contestId/leave',
  handler,
  schema: {
    tags: ['Contest'],
    description: 'Leave a specific contest. Will refund user and deduct from pot.',
    summary: 'Leave contest',
    body: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Unique user id.' }
      },
      required: ['userId']
    },
    params: {
      contestId: { type: 'string', description: 'Unique contest id.'}
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
