/**
 * Update a game
 * @todo - can the pot be modified here?  I think if the admin wants to add to the pot we should create a
 * user that adds to it via the regular flow. For now removing the update of the pot.
 * @todo - auth
 * @todo - also missing are the participants and manging those.
 * @todo - also missing are the different contests and managing those. Should it be done here? No. It should be in a wager service.
 */
const { ObjectID } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { gameId } = req.params;
  const { db } = res.context.config;
  const {
    title,
    startDateTime,
    endDateTime,
    streamURL,
    status,
  } = req.body;

  const updateObj = {
    title,
    startDateTime,
    endDateTime,
    streamURL,
    status
  };

  if (!ObjectID.isValid(gameId)) return response.error('Invalid game Id', 400);

  try {
    const data = await db.collection(collection.GAME_COLL_NAME).updateOne(
      { _id: ObjectID(gameId) },
      { $set: updateObj },
    );

    if (data.matchedCount) return response.success(updateObj);

    return response.error('Could not update game. Contest not found.', 404);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'PATCH',
  url: '/:gameId',
  handler,
  schema: {
    tags: ['Game'],
    description: 'Update specific game',
    summary: 'Update game',
    body: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Game title displayed to user.' },
        startDateTime: { type: 'string', format: 'date-time', description: 'Start date time of game.' },
        endDateTime: { type: 'string', format: 'date-time', description: 'End date time of game' },
        streamURL: { type: 'string', description: 'Streaming service URL. Used to stream video.', format: 'url' },
        status: { type: 'string', description: 'Game status', enum: ['active', 'pending', 'in_progress', 'distributing_pot', 'paused', 'completed' ] },
        entryFee: { type: 'number', description: 'Cost to enter the game' }
      },
      required: ['title', 'startDateTime', 'endDateTime', 'streamURL', 'entryFee']
    },
    params: {
      contestId: { type: 'string', description: 'Unique game id.' },
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Game title displayed to user.' },
              startDateTime: { type: 'string', format: 'date-time', description: 'Start date time of game.' },
              endDateTime: { type: 'string', format: 'date-time', description: 'End date time of game' },
              streamURL: { type: 'string', description: 'Streaming service URL. Used to stream video.' },
              status: { type: 'string', description: 'Game status', enum: ['active', 'pending', 'in_progress', 'distributing_pot', 'paused', 'completed' ] },
              entryFee: { type: 'number', description: 'Cost to enter the game' }
            }
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
    db: fastify.mongo.db, // This seems off.
  },
});
