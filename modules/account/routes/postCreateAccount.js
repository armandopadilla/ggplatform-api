/**
 * Create a new accout
 *
 */
const Joi = require('joi');
const { response, auth } = require('../../../utils');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const {
    firstName,
    username,
    email,
    password,
    dob,
    acceptTerms
  } = req.body;

  const hashPass = auth.getHash(password);
  const insertObj = {
    firstName,
    username,
    email,
    password: hashPass,
    dob,
    acceptTerms,
    status: 'active'  // Can be active | inactive (soft delete)
  } ;

  try {
    const data = await db.collection('accounts').insertOne(insertObj);

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
      firstName: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().email(),
      password: Joi.string().required(),
      dob: Joi.string().required(),
      acceptTerms: Joi.string().required()
    }
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db // This seems off.
  }
});