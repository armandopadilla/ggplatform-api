/**
 * Delete a specific account
 *
 */

// @todo - can only be called by an admin
// @todo - validation for status
// @todo - logging to make sure we have an audit trail

const Joi = require('joi');
const ObjectID = require('mongodb').ObjectID;
const { response } = require('../../../utils');

const handler = async (req, res) => {
  const { accountId } = req.params;
  const { db } = res.context.config;
  const {
    status
  } = req.body;

  //@todo Password we'll treat differently
  const updateObj = {
    status
  } ;

  try {
    const data = await db.collection('accounts').updateOne(
      { id: ObjectID(accountId) },
      {$set: updateObj}
    );

    if (data.matchedCount) return response.success({});
    return response.error();
  } catch(error) {
    console.log(error);
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'PATCH',
  url: '/:accountId',
  handler,
  schema: {
    params: {
      accountId: Joi.string().required()
    },
    body: {
      firstName: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().email(),
      dob: Joi.string().required()
    }
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db // This seems off.
  }
});