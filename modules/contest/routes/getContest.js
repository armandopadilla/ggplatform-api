/**
 * Fetch a specific contest
 *
 */
const Joi = require('joi');
const ObjectId = require('mongodb').ObjectID;
const { response } = require('../../../utils');
const { db:collection, errors } = require('../../../config');

const handler = async (req, res) => {
  const { contestId } = req.params;
  const { db } = res.context.config;

  try {
    const contest = await db.collection(collection.CONTEST_NAME)
      .findOne(
        { _id: ObjectId(contestId) }
      );

    if (contest) return response.success(contest);
    return response.error(errors.CONTEST_NOT_FOUND, 404);
  } catch(error) {
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