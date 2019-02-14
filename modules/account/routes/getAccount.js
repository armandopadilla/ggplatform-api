/**
 * Get a specific account in the system.
 *
 * @todo - return games
 * @todo - return user accounts
 * @todo - return earnings.
 */
const { ObjectId } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { accountId } = req.params;

  if (!ObjectId.isValid(accountId)) return response.error('Invalid account Id', 400);

  try {
    const account = await db.collection(collection.ACCOUNT_COLL_NAME).findOne({
      _id: ObjectId(gameId)
    });

    return response.success(account);
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
    description: 'Get a account in system.',
    summary: 'Get an account',
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
