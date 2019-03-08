/**
 * DO NOT USE DO NOT USE - gtgsidebet functionality ONLY
 * Join a specific contest - Not required for team vs team.
 *
 * FE sends BE contest to join and account that wants to join
 * System checks if the game has a default contest.
 * If so then
 *  System checks if the user has enough funds
 *  If enough funds then withdraw and enter the user into contest
 *  If NOT enough funds return a not-enough-funds error. FE can then take the user to another screen
 */
const ObjectId = require('mongodb').ObjectId;
const { response, game:gameUtils, contest:contestUtils } = require('../../../utils');
const { db: collection } = require('../../../config');
const withdraw = require('../../wallet/events/withdraw');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const {
    userId,
    contestId,
  } = req.body;
  const { gameId } = req.params;

  // Check if the gameId is valid.
  if (!ObjectId.isValid(gameId)) return response.error('Invalid game Id', 400);

  // Check if the userId is valid
  if (!ObjectId.isValid(userId)) return response.error('Invalid user Id', 400);

  try {
    // Check if the user can join the game
    gameUtils.canJoinGame(userId, gameId, db);

    // Check if the user can join the contest
    contestUtils.canJoinContest(contestId, userId, db);

    // If ready to enter into contest...
    // Add the user to the contest
    const data = await db.collection(collection.CONTEST_COLL_NAME).updateOne(
      { _id: ObjectId(contestId) },
      { $addToSet: { participants: userId.toString() } },
    );

    // Widthdraw funds from the wallet.
    if (data.matchedCount) {
      await withdraw(userId, contest.entryFee, db);

      // Update the pot
      const newPot = contest.pot + contest.entryFee;
      await db.collection(collection.CONTEST_COLL_NAME).updateOne({
        _id: ObjectId(contestId)
      }, { $set: { pot: newPot } });

      return response.success({});
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
    tags: ['Game'],
    description: 'Join a specific game',
    summary: 'Join game',
    body: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Unique user id.' }
      },
      required: ['userId']
    },
    params: {
      contestId: { type: 'string', description: 'Unique game id to join.' },
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
