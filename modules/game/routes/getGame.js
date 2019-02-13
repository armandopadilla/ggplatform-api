/**
 * Fetch a specific game
 *
 * Has basic info on the game and participant count.
 * @todo  do we need a list of users in the game?  I would think not?
 * @todo do we need a list of contests?  - Hook
 */
const { ObjectId } = require('mongodb').ObjectID;
const { response } = require('../../../utils');
const { db: collection, errors } = require('../../../config');

const handler = async (req, res) => {
  const { gameId } = req.params;
  const { db } = res.context.config;

  if (!ObjectId.isValid(gameId)) return response.error('Invalid Game Id', 400);

  try {
    const game = await db.collection(collection.GAME_COLL_NAME)
      .findOne(
        { _id: ObjectId(gameId) },
      );

    if (!game) return response.error(errors.GAME_NOT_FOUND, 404);

    // Grab the bets
    // @todo - link up with bets.
    game.contests = [];
    return response.success(game);
  } catch (error) {
    return response.error(error);
  }
};

module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/:gameId',
  handler,
  schema: {
    tags: ['Game'],
    description: 'Fetch a game in the system',
    summary: 'Fetch a game',
    params: {
      contestId: { type: 'string', description: 'Unique game Id' }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              title: { type: 'string', description: 'Game title displayed to user.' },
              startDateTime: { type: 'string', format: 'date-time', description: 'Start date time of game.' },
              endDateTime: { type: 'string', format: 'date-time', description: 'End date time of game' },
              pot: { type: 'number', description: 'total amount in pot' },
              streamURL: { type: 'string', description: 'Streaming service URL. Used to stream video.' },
              status: { type: 'string', description: 'Game status' },
              entryFee: { type: 'number', description: 'Cost to enter the game' }
            }
          }
        }
      },
      400: {
        description: 'Invalid Game Id',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      },
      404: {
        description: 'Game not found',
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
