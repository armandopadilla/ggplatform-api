/**
 * Get a list of accounts
 *
 */
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;
  try {
    const accounts = await db.collection(collection.ACCOUNT_NAME)
      .find({})
      .toArray();

    return response.success(accounts || []);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/list',
  handler,
  schema: {
    tags: ['Account'],
    description: 'Fetch a list of accounts in the system.',
    summary: 'Fetch list of accounts',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'array',
            items: [ { type: 'object' } ]
          }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db, // This seems off.
  },
});
