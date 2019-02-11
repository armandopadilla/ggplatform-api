/**
 * Get a specific account
 *
 * @todo Can users fetch the profiles of other users? I would say yes, to see their wins, loss, and jackpots won.
 */
const ObjectId = require('mongodb').ObjectID;
const { response } = require('../../../utils');
const { db: collection, errors } = require('../../../config');

const handler = async (req, res) => {
  const { userId } = req.params;
  const { db } = res.context.config;

  if (!ObjectId.isValid(userId)) return response.error('Invalid User Id', 400);

  try {
    const user = await db.collection(collection.USER_COLL_NAME)
      .findOne({ _id: ObjectId(userId) });

    if (user) return response.success(user);
    return response.error(errors.USER_NOT_FOUND, 404);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/:userId',
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
    db: fastify.mongo.db, // This seems off.
  },
});
