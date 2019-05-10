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
  const { userId } = req.params;
  const { db } = res.context.config;
  const { appId } = req.query;

  try {
    await auth.isValidApp(appId, db);

    const data = await db.collection(collection.USER_COLL_NAME)
      .updateOne(
        { id: ObjectID(userId) },
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
  url: '/:userId',
  handler,
  schema: {
    tags: ['User'],
    description: 'Delete a specific user from system. (Soft)',
    summary: 'Delete user',
    params: {
      accountId: { type: 'string', description: 'Unique user Id.'}
    },
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
