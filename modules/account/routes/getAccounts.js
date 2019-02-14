/**
 * Get accounts in the system.
 *
 * @todo - pagination tooling
 */
const { ObjectID } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;

  try {
    const accounts = await db.collection(collection.ACCOUNT_COLL_NAME).find({}).toArray();
    const accountTotals = accounts.length;

    return response.success(accounts || [], accountTotals);
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
    description: 'Get a list of accounts in the system',
    summary: 'Get accounts',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object'
          }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db, // This seems off.
  },
});
