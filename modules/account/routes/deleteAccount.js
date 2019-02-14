/**
 * Delete a specific account
 * 1.  What do we do to the users?
 * 2.  What do we do to the contests?  and their funds?
 * 3.  What do we do with the games?
 * 4. Soft delete?  For now yes.
 */
const { ObjectId } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { accountId } = req.params;
  const { db } = res.context.config;

  try {
    // Check if the accountId is valid
    if (!ObjectId.isValid(accountId)) return response.error('AccountId not valid.', 400);

    // Check if the account is present.
    const account = await db.collection(collection.ACCOUNT_COLL_NAME).updateOne(
      { _id: ObjectID(accountId) },
      { $set: { status: 'deleted' } },
    );

    if (account.matchedCount) return response.success({});
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
    description: 'Delete a specific account in the system.',
    summary: 'Delete account',
    params: {
      contestId: { type: 'string', description: 'Unique account id' }
    },
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
