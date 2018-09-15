/**
 * Update a specific account
 *
 */
const Joi = require('joi');
const { ObjectID } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { accountId } = req.params;
  const { db } = res.context.config;
  const {
    firstName,
    username,
    email,
    dob,
  } = req.body;

  const updateObj = {
    firstName,
    username,
    email,
    dob,
  };

  try {
    const data = await db.collection(collection.ACCOUNT_NAME)
      .updateOne(
        { id: ObjectID(accountId) },
        { $set: updateObj },
      );

    if (data.matchedCount) return response.success(updateObj);
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
      firstName: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().email(),
      dob: Joi.string().required(),
    },
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db, // This seems off.
  },
});
