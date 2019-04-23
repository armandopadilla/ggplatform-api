/**
 * TEMP TEMP TEMP TEMP TEMP
 *
 * @todo Can users fetch the profiles of other users? I would say yes, to see their wins, loss, and jackpots won.
 */
const ObjectId = require('mongodb').ObjectID;
const { response, auth } = require('../../../utils');
const { db: collection, errors } = require('../../../config');
const { getUserStats } = require('../../../utils/stats');

const handler = async (req, res) => {
  const { db, cache } = res.context.config;

  const { id: userId} = await auth.getSessionInfo(req, cache);
  if (!userId) return response.error('Unathorized request', 401);

  // Check the userId is valid and present
  if (!ObjectId.isValid(userId)) return response.error('Invalid User Id', 400);

  try {
    const user = await db.collection(collection.USER_COLL_NAME)
      .findOne({ _id: ObjectId(userId) });

    // Get the user games.
    const userGames = await db.collection(collection.GAME_COLL_NAME).find({
      participants: { $all: [userId] }
    }).toArray();

    user.games = userGames;

    // Get the stats
    user.stats = await getUserStats(userId, db);

    console.log(user);
    if (user) return response.success(user);
    return response.error(errors.USER_NOT_FOUND, 404);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/profile',
  handler,
  schema: {
    tags: ['User'],
    description: 'Fetch information for specific User.',
    summary: 'Fetch specific user info',
    params: {
      accountId: { type: 'string', description: 'Unique user Id.' }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
              "_id": { type: 'string' },
              //"firstName": { type: 'string' },
              "username": { type: 'string' },
              "email": { type: 'string', format: 'email' },
              //"dob": { type: 'string', format: 'date' },
              //"acceptTerms": { type: 'string' },
              //"status": { type: 'string', enum: ['yes', 'no'] },
              //"isAdmin": { type: 'string', enum: ['yes', 'no'] },
              //"createdDate": { type: 'string', format: 'date-time' },
              //"updateDate": { type: 'string', format: 'date-time' }
              "games": {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    title: { type: "string" },
                    name: { type: "string" },
                    matchType: { type: "string" }
                  }
                }
              },
              stats: {
                type: 'object',
                properties: {
                  winPercent: { type: 'number' },
                  totalGamesWon: { type: 'number' },
                  totalGamesPlayed: { type: 'number' }
                }
              }
            }
          }
        }
      },
      400: {
        description: 'Invalid User Id',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      },
      404: {
        description: 'User not found',
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
