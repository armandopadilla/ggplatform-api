/**
 * Create a new contest - admin only
 * status = pending | in_progress | distributing_pot | paused | completed
 *
 */
const Joi = require('joi');
const { response } = require('../../../utils');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const {
    title,
    startDateTime,
    endDateTime,
    pot,
    streamURL,
    status,
  } = req.body;

  const insertObj = {
    title,
    startDateTime,
    endDateTime,
    pot,
    streamURL,
    status,
    participants: [], //Initially empty
    entryFee: 0 // Replace with some default
  };

  try {
    const data = await db.collection('contests').insertOne(insertObj);

    if (data.insertedCount) return response.success(insertObj);
    return response.error();
  } catch(error) {
    console.log(error);
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/',
  handler,
  schema: {
    body: {
      title: Joi.string().required(),
      startDateTime: Joi.string().required(),
      endDateTime: Joi.string().required(),
      pot: Joi.number(),
      streamURL: Joi.string().required(),
      status: Joi.string().required()
    }
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db // This seems off.
  }
});