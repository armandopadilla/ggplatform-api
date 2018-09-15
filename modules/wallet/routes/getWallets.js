/**
 * Fetch specific wallets.
 *
 * @param accountId
 * @param fastify
 */
const { db:collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;

  const wallets = await db.collection(collection.WALLET_NAME).find().toArray();
  return wallets || [];
};

module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/list',
  handler,
  config: {
    db: fastify.mongo.db
  }
});