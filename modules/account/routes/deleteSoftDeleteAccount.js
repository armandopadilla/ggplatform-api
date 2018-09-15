/**
 * Delete a specific account
 *
 * @todo - can only be called by an admin
 * @todo - validation for status
 * @todo - logging to make sure we have an audit trail
 * @todo - What happens to the wallet and its funds?
 */

const Joi = require('joi');
const { ObjectID } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { accountId } = req.params;
  const { db } = res.context.config;
  const {
    status,
  } = req.body;

  try {
    const data = await db.collection(collection.ACCOUNT_NAME)
      .updateOne(
        { id: ObjectID(accountId) },
        { $set: { status } },
      );

    if (data.matchedCount) return response.success({});
    return response.error();
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'PATCH',
  url: '/:accountId',
  handler,
  schema: {
    params: {
      accountId: Joi.string().required(),
    },
    body: {
      status: Joi.string().required(),
    },
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db // This seems off.
  },
});
