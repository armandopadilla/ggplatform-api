/**
 * Fetch a list of games
 *
 * Has basic info on the games and participant count.
 * @todo - filtering and sorting.
 * @todo - Pagination.
 */
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;

  try {
    const games = await db.collection(collection.GAME_COLL_NAME)
      .find({}).toArray();

    console.log(games);
    const total = games.length;

    return response.success(games || [], total);
  } catch (error) {
    return response.error(error);
  }
};

module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/list',
  handler,
  schema: {
    tags: ['Game'],
    description: 'Fetch a list of all games in the system',
    summary: 'Fetch games',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: {type: 'string'},
                title: {type: 'string', description: 'Game title displayed to user.'},
                startDateTime: {type: 'string', format: 'date-time', description: 'Start date time of game.'},
                endDateTime: {type: 'string', format: 'date-time', description: 'End date time of game'},
                pot: {type: 'number', description: 'total amount in pot'},
                streamURL: {type: 'string', description: 'Streaming service URL. Used to stream video.'},
                status: {type: 'string', description: 'Game status'},
                entryFee: { type: 'number' },
                participants: { type: "array", items: { type: "string" } },
                name: { type: 'string' },
                matchType: { type: 'string' },
                maxParticipants: { type: 'number' }
              }
            }
          },
          _meta: {
            type: 'object',
            properties: {
              total: { type: 'number', description: 'Total number of records.' }
            }
          }
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
