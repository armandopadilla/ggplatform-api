/**
 * Update a contest - admin only
 *
 */
const Joi = require('joi');
const ObjectID = require('mongodb').ObjectId;
const { response } = require('../../../utils');
const { db:collection } = require('../../../config');

const handler = async (req, res) => {
  const { contestId } = req.params;
  const { db } = res.context.config;
  const {
    title,
    startDateTime,
    endDateTime,
    pot,
    streamURL,
    status
  } = req.body;

  const updateObj = {
    title,
    startDateTime,
    endDateTime,
    pot,
    streamURL,
    status
  };

  try {
    const data = await db.collection(collection.CONTEST_NAME).updateOne(
      { id: ObjectID(contestId) },
      { $set: updateObj }
    );

    if (data.matchedCount) return response.success(insertObj);
    return response.error();
  } catch(error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'PATCH',
  url: '/:contestId',
  handler,
  schema: {
    body: {
      title: Joi.string().required(),
      startDateTime: Joi.string().required(),
      endDateTime: Joi.string().required(),
      pot: Joi.number(),
      streamURL: Joi.string().required()
    }
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db // This seems off.
  }
});