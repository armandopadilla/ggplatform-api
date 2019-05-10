/**
 * Fetch a specific wallet.
 *
 * @param accountId
 * @param fastify
 */
const ObjectID = require('mongodb').ObjectId;
const { db: collection } = require('../../../config');
const { response } = require('../../../utils');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { walletId } = req.params;
  const { appId } = req.query;

  try {
    await auth.isValidApp(appId, db);

    const wallet = await db.collection(collection.WALLET_COLL_NAME)
      .findOne({ _id: ObjectID(walletId) });

    if (wallet) return wallet;
    return response.success();
  } catch (e) {
    response.error(e);
  }
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/:walletId',
  handler,
  schema: {
    tags: ['Wallet'],
    description: 'Fetch specific wallet from system.',
    summary: 'Fetch specific wallet',
    params: {
      walletId: { type: 'string', description: 'Unique Id of wallet to fetch.' }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
              ownerId: { type: 'string', description: 'Unique owner id.' },
              balance: { type: 'number', description: 'Current balance in this wallet.' },
              currency: { type: 'string', description: 'Currency type.' },
              createdDate: { type: 'string', format: 'date-time', description: 'Date Time of wallet creation.' },
              updateDate: { type: 'string', format: 'date-time', description: 'Date Time of wallet last update.' }
            }
          }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db,
  },
});
