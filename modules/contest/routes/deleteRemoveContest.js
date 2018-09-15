/**
 * Delete a specific contests - amdin only
 * 0. This should really be a soft delete.  We need to make sure we keep a solid audit of thigns.
 * 1. What happens to the pot? Full refunds?
 * 2. Can we reschedule?
 * 3. Do we send out any notification to the participants?
 * 4. Should there be a reason why this was canceled?  For auditing.
 */
const Joi = require('joi');
const { ObjectID } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { contestId } = req.params;
  const { db } = res.context.config;

  try {
    const data = await db.collection(collection.CONTEST_NAME).updateOne(
      { _id: ObjectID(contestId) },
      { $set: { status: 'canceled' } },
    );

    if (data.matchedCount) return response.success({});
    return response.error();
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'DELETE',
  url: '/:contestId',
  handler,
  schema: {
    params: {
      contestId: Joi.string().required(),
    },
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db, // This seems off.
  },
});
