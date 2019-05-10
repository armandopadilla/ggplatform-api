/**
 * Fetch a specific wallet.
 *
 * @param accountId
 * @param fastify
 */
const ObjectID = require('mongodb').ObjectId;
const { db: collection } = require('../../../config');
const { auth, response } = require('../../../utils');

const handler = async (req, res) => {
  const { db, cache } = res.context.config;
  const { appId } = req.query;

  const { id: userId} = await auth.getSessionInfo(req, cache);
  if (!userId) return response.error('Unathorized request', 401);

  // Check the userId is valid and present
  if (!ObjectID.isValid(userId)) return response.error('Invalid User Id', 400);

  try {
    await auth.isValidApp(appId, db);

    const wallet = await db.collection(collection.WALLET_COLL_NAME).findOne({
      ownerId: ObjectID(userId),
    });

    let transactions = [];
    if (wallet) {
      transactions = await db.collection(collection.WALLET_TRXS_COLL_NAME)
        .find({
          walletId: ObjectID(wallet._id)
        }).toArray();
    }

    const info = {
      wallet,
      transactions,
    };

    if (wallet) return response.success(info);
    return response.success();
  } catch (e) {
    return response.error(e);
  }

};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/my-wallet',
  handler,
  schema: {
    tags: ['Wallet'],
    description: 'Fetch the logged in users wallet.',
    summary: 'Fetch user wallet',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
              wallet: {
                type: 'object',
                properties: {
                  ownerId: { type: 'string', description: 'Unique owner id.' },
                  balance: { type: 'number', description: 'Current balance in this wallet.' },
                  currency: { type: 'string', description: 'Currency type.' },
                  createdDate: { type: 'string', format: 'date-time', description: 'Date Time of wallet creation.' },
                  updateDate: { type: 'string', format: 'date-time', description: 'Date Time of wallet last update.' }
                }
              },
              transactions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    description: { type: 'string' },
                    type: { type: 'string' },
                    amount: { type: 'number' },
                    createdDate: { type: 'string' }
                  }
                }
              }
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
