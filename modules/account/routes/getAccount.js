/**
 * Get a specific account
 *
 */
const Joi = require('joi');
const ObjectId = require('mongodb').ObjectID;
const { response } = require('../../../utils');

const handler = async (req, res) => {
  const { accountId } = req.params;
  const { db } = res.context.config;

  try {
    const account = await db.collection('accounts').findOne({ _id: ObjectId(accountId) });

    if (account) return response.success(account);
    return response.error('Account not found', 404);
  } catch(error) {
    console.log(error);
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/:accountId',
  handler,
  schema: {
    params: {
      accountId: Joi.string().required()
    }
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db // This seems off.
  }
});