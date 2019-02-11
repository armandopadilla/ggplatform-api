/**
 * Get a list of users
 *
 */
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;

  try {
    const users = await db.collection(collection.USER_COLL_NAME)
      .find({})
      .toArray();

    const total = users.length;

    return response.success(users || [], total);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/list',
  handler,
  schema: {
    tags: ['User'],
    description: 'Fetch a list of users in the system.',
    summary: 'Fetch list of accounts',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          'data': {
            type: "array",
            items: {
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
    db: fastify.mongo.db, // This seems off.
  },
});
