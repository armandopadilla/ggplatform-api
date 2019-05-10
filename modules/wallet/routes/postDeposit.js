/**
 * Deposit Funds.
 *
 */
const ObjectId = require('mongodb').ObjectId;
const { response, auth } = require('../../../utils');
const { db: collection } = require('../../../config');
const deposit = require('../events/deposit');

const handler = async (req, res) => {
  const { db, cache } = res.context.config;
  const { amount } = req.body;
  const { appId } = req.query;

  const { id: userId} = await auth.getSessionInfo(req, cache);
  if (!userId) return response.error('Unathorized request', 401);

  // Check the userId is valid and present
  if (!ObjectId.isValid(userId)) return response.error('Invalid User Id', 400);

  try {
    await auth.isValidApp(appId, db);

    await deposit(userId, amount, db);
    return response.success();
  } catch (error) {
    return response.error(error);
  }
};

module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/deposit',
  handler,
  schema: {
    tags: ['Wallet'],
    description: 'Deposit funds for a user wallet',
    summary: 'Deposit funds',
    body: {
      amount: { type: 'number' },
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {}
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
