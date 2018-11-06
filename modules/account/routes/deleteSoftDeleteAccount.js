/**
 * Delete a specific account
 *
 * @todo - can only be called by an admin
 * @todo - logging to make sure we have an audit trail
 * @todo - What happens to the wallet and its funds?
 */

const { ObjectID } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { accountId } = req.params;
  const { db } = res.context.config;

  try {
    const data = await db.collection(collection.ACCOUNT_NAME)
      .updateOne(
        { id: ObjectID(accountId) },
        { $set: { status: 'deleted' } },
      );

    if (data.matchedCount) return response.success({});
    return response.error();
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'DELETE',
  url: '/:accountId',
  handler,
  schema: {
    tags: ['Account'],
    description: 'Delete a specific account from system. (Soft)',
    summary: 'Delete account',
    params: {
      accountId: { type: 'string', description: 'Unique account Id.'}
    },
    require: ['accountId', 'status'],
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": { type: 'object' }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db, // This seems off.
  },
});
