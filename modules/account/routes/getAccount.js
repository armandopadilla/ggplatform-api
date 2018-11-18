/**
 * Get a specific account
 *
 * @todo Can users fetch the profiles of other users?
 */
const ObjectId = require('mongodb').ObjectID;
const { response } = require('../../../utils');
const { db: collection, errors } = require('../../../config');

const handler = async (req, res) => {
  const { accountId } = req.params;
  const { db } = res.context.config;

  if (!ObjectId.isValid(accountId)) return response.error('Invalid Id', 400);

  try {
    const account = await db.collection(collection.ACCOUNT_NAME)
      .findOne({ _id: ObjectId(accountId) });

    if (account) return response.success(account);
    return response.error(errors.ACCOUNT_NOT_FOUND, 404);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/:accountId',
  handler,
  schema: {
    tags: ['Account'],
    description: 'Fetch information for specific Account.',
    summary: 'Fetch specific account info',
    params: {
      accountId: { type: 'string', description: 'Unique account Id.' }
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
              "firstName": { type: 'string' },
              "username": { type: 'string' },
              "email": { type: 'string', format: 'email' },
              "dob": { type: 'string', format: 'date' },
              "acceptTerms": { type: 'string' },
              "status": { type: 'string', enum: ['yes', 'no'] },
              "isAdmin": { type: 'string', enum: ['yes', 'no'] },
              "createdDate": { type: 'string', format: 'date-time' },
              "updateDate": { type: 'string', format: 'date-time' }
            }
          }
        }
      },
      400: {
        description: 'Invalid Account Id',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      },
      404: {
        description: 'Account not found',
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
