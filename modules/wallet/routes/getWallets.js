/**
 * Fetch specific wallets.
 *
 * @param accountId
 * @param fastify
 */
const handler = async (req, res) => {
  const { db } = res.context.config;

  const wallets = await db.collection('wallets').find().toArray();
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