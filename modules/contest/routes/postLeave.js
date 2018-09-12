/**
 * Leave a specific contest
 *
 */
const Joi = require('joi');
const ObjectID = require('mongodb').ObjectId;
const { response } = require('../../../utils');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { userId } = req.body;
  const { contestId } = req.params;

  //@todo Full refund?
  //@todo Email to confirm...as a receipt of sorts?
  //@todo update the pot

  try {
    const data = await db.collection('contests').updateOne(
      { _id: ObjectID(userId) },
      { $pull: { participants: userId }}
    );

    if (data.matchedCount) return response.success(insertObj);
    return response.error();
  } catch(error) {
    console.log(error);
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/:contestId',
  handler,
  schema: {
    body: {
      userId: Joi.string().required()
    }
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db
  }
});