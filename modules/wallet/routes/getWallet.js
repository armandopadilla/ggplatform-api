/**
 * Fetch a specific wallet.
 *
 * @param accountId
 * @param fastify
 */
const Joi = require('joi');
const { db:collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { walletId } = req.params;

  const wallet = await db.collection(collection.WALLET_NAME).findOne({
    _id: ObjectID(walletId)
  });

  if (wallet) return wallet;
  return {}
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/:walletId',
  handler,
  schema: {
    params: {
      walletId: Joi.string().required()
    }
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db
  }
});