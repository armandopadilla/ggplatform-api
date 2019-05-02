/**
 * Withdraw Funds.
 *
 */
const ObjectId = require('mongodb').ObjectId;
const { response, auth } = require('../../../utils');
const { db: collection } = require('../../../config');
const withdraw = require('../events/withdraw');

const handler = async (req, res) => {
  const { db, cache } = res.context.config;
  const { amount } = req.body;

  const { id: userId} = await auth.getSessionInfo(req, cache);
  if (!userId) return response.error('Unathorized request', 401);

  // Check the userId is valid and present
  if (!ObjectId.isValid(userId)) return response.error('Invalid User Id', 400);

  try {
    await withdraw(userId, amount, db);
    return response.success();
  } catch (error) {
    return response.error(error);
  }
};

module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/withdraw',
  handler,
  schema: {
    tags: ['Wallet'],
    description: 'Withdraw funds from a user wallet',
    summary: 'Withdraw funds',
    body: {
      amount: { type: 'number' }
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
                entryFee: { type: 'number' },
                participants: { type: "array", items: { type: "string" } },
                name: { type: 'string' },
                matchType: { type: 'string' },
                maxParticipants: { type: 'number' }
              }
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
