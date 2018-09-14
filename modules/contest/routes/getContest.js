/**
 * Fetch a specific contest
 *
 */
const Joi = require('joi');
const ObjectId = require('mongodb').ObjectID;
const { response } = require('../../../utils');

const handler = async () => {
  const { contestId } = req.params;
  const { db } = res.context.config;

  try {
    const contest = await db.collection('contests').findOne({ _id: ObjectId(contestId) });
    // Fetch the participants
    // Fetch other stuff here

    if (contest) return response.success(contest);
    return response.error('Contest not found', 404);
  } catch(error) {
    console.log(error);
    return response.error(error);
  }
};

module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/:contestId',
  handler,
  schema: {
    params: {
      contestId: Joi.string().required()
    }
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db
  }
});