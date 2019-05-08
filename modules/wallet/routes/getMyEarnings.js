/**
 * Fetch a user's earnings.
 *
 * @param accountId
 * @param fastify
 */
const ObjectID = require('mongodb').ObjectId;
const { db: collection } = require('../../../config');
const { auth, response } = require('../../../utils');

const handler = async (req, res) => {
  const { db, cache } = res.context.config;

  const { id: userId} = await auth.getSessionInfo(req, cache);
  if (!userId) return response.error('Unathorized request', 401);

  // Check the userId is valid and present
  if (!ObjectID.isValid(userId)) return response.error('Invalid User Id', 400);

  const wallet = await db.collection(collection.WALLET_COLL_NAME).findOne({
    ownerId: ObjectID(userId),
  });

  let myEarnings = 0.00;
  if (wallet) {
    const earnings = await db.collection(collection.WALLET_TRXS_COLL_NAME)
      .aggregate([
        {
          $match: {
            walletId: ObjectID(wallet._id),
            description: "MATCH WIN"
          }
        },
        {
          $group: { _id: "walletId", sum: { $sum: "$amount" } }
        }]
      ).toArray();

    if (earnings.length) {
      myEarnings = earnings[0].sum.toFixed(2);
    }
  }

  const info = {
    myEarnings
  };

  if (wallet) return response.success(info);
  return {};
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/my-earnings',
  handler,
  schema: {
    tags: ['Wallet'],
    description: 'Fetch the logged in users earnings.',
    summary: 'Fetch user earnings',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
              myEarnings: { type: 'number' }
            }
          }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db,
    cache: fastify.redis,
  },
});
