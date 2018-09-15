/**
 * Get a specific account
 *
 * @todo Can users fetch the profiles of other users?
 */
const Joi = require('joi');
const ObjectId = require('mongodb').ObjectID;
const { response } = require('../../../utils');
const { db:collection, errors } = require('../../../config');

const handler = async (req, res) => {
  const { accountId } = req.params;
  const { db } = res.context.config;

  try {
    const account = await db.collection(collection.ACCOUNT_NAME)
      .findOne({ _id: ObjectId(accountId) });

    if (account) return response.success(account);
    return response.error(errors.ACCOUNT_NOT_FOUND, 404);
  } catch(error) {
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