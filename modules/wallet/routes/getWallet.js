/**
 * Fetch a specific wallet.
 *
 * @param accountId
 * @param fastify
 */
const getWallet = async (req, res) => {
  const { db } = res.context.config;

  const wallet = await db.collection('wallets').findOne({
    _id: ObjectID(walletId)
  });

  if (wallet) return wallet;
  return {}
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/:walletId',
  handler,
  config: {
    db: fastify.mongo.db
  }
});