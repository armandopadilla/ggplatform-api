/**
 * Fetch all games the user has participated in.  Actually played NOT placed
 * bets in.
 *
 */
const ObjectId = require('mongodb').ObjectId;
const { response, auth } = require('../../../utils');
const { db: collection } = require('../../../config');


const handler = async (req, res) => {
  const { db, cache } = res.context.config;

  // Will actually get this from JWT
  const { id: userId } = await auth.getSessionInfo(req, cache);

  if (!userId) return response.error('Unathorized request', 401);

  // Check the userId is valid and present
  if (!ObjectId.isValid(userId)) return response.error('Invalid User Id', 400);

  try {
    const user = await db.collection(collection.USER_COLL_NAME).findOne({
      _id: ObjectId(userId)
    });

    if(!user) return response.error('Account not found.', 404);

    // Wondering if this is better than updating a "games" list held onto
    // the account object.
    const games = await db.collection(collection.GAME_COLL_NAME)
      .find({
        participants: userId
      }).toArray();

    const total = games.length;

    return response.success(games || [], total);
  } catch (error) {
    return response.error(error);
  }
};

module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/my-games',
  handler,
  schema: {
    tags: ['Game'],
    description: 'Fetch all the games a specific user participants in.',
    summary: 'Fetch user games',
    querystring: {
      userId: { type: "string", description: "Unique account Id." }
    },
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
                entryFee: { type: 'number', description: 'Cost to enter the game' }
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
    cache: fastify.redis,
  },
});
