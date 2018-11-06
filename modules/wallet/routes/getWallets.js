/**
 * Fetch specific wallets.
 *
 * @param accountId
 * @param fastify
 */
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;

  const wallets = await db.collection(collection.WALLET_NAME).find().toArray();
  return wallets || [];
};

module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/list',
  handler,
  schema: {
    tags: ['Wallet'],
    description: 'Fetch all wallets in system.',
    summary: 'Fetch list of wallets',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'array',
            items: [{
              type: 'object',
              properties: {
                ownerId: {type: 'string', description: 'Unique owner id.'},
                balance: {type: 'number', description: 'Current ballance in this wallet.'},
                currency: {type: 'string', description: 'Currency type.'},
                createdDate: {type: 'string', format: 'date-time', description: 'Date Time of wallet creation.'},
                updateDate: {type: 'string', format: 'date-time', description: 'Date Time of wallet last update.'}
              }
            }]
          }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db,
  },
});
