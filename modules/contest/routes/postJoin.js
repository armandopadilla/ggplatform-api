/**
 * Join a specific contest
 *
 */
const Joi = require('joi');
const ObjectID = require('mongodb').ObjectId;
const { response } = require('../../../utils');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { userId } = req.body;
  const { contestId } = req.params;

  //@todo Does the user pay here?
  //@todo Do we deduct from the wallet?
  //@todo DO something here im sure.

  try {
    const data = await db.collection('contests').updateOne(
      { _id: ObjectID(contestId) },
      { $addToSet: { participants: userId }}
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
  url: '/:contestId/join',
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