/**
 * Create a new game
 * status = pending | in_progress | distributing_pot | paused | completed
 *
 * @todo - Auth
 */
const { response, auth } = require('../../../utils');
const { db: collection } = require('../../../config');
const withdraw = require('../../wallet/events/withdraw');

const handler = async (req, res) => {
  const { db, cache } = res.context.config;

  const { id: userId } = await auth.getSessionInfo(req, cache);
  if (!userId) return response.error('Unauthorized request', 401);

  const {
    title,
    startDateTime, // @todo - is this needed at this time if users will schedule this.
    endDateTime,
    pot, // @todo should the user creating this game set the pot already? No but we should keep track of the pot in general.
    streamURL,
    status,
    entryFee,
  } = req.body;


  const insertObj = {
    title,
    startDateTime,
    endDateTime: endDateTime || '',
    pot: pot || 0.00,
    streamURL: streamURL || '',
    status: status || 'pending',
    participants: [], // Initially empty. Who is actually in the game.  NOT who has placed a wager on a contest.
    entryFee,
    contests: [], // Holds ids of all the contests this game contains.
    createdBy: userId,
  };

  try {
    await withdraw(userId, entryFee, db);

    // If no errors from the withdraw
    insertObj.pot = entryFee;
    const data = await db.collection(collection.GAME_COLL_NAME).insertOne(insertObj);

    if (data.insertedCount) return response.success(insertObj);

    return response.error('Could not create game.  Unknown error', 400);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/',
  handler,
  schema: {
    tags: ['Game'],
    description: 'Create new game',
    summary: 'Create game',
    body: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Game title displayed to user.' },
        startDateTime: { type: 'string', format: 'date-time', description: 'Start date time of game.' },
        endDateTime: { type: 'string', format: 'date-time', description: 'End date time of game' },
        pot: { type: 'number', description: 'total amount in pot' },
        streamURL: { type: 'string', description: 'Streaming service URL. Used to stream video.' },
        status: { type: 'string', description: 'Game status', enum: ['active', 'pending', 'in_progress', 'distributing_pot', 'paused', 'completed' ] },
        entryFee: { type: 'number', description: 'Cost to enter the game' }
      },
      required: ['title', 'startDateTime', 'entryFee'],
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
    cache: fastify.redis
  },
});
