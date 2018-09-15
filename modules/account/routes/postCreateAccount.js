/**
 * Create a new accout
 *
 */
const Joi = require('joi');
const { response, auth } = require('../../../utils');
const { db: collection } = require('../../../config');
const createWallet = require('../../wallet/events/create');
const { sendWelcomeEmail } = require('../../../helpers/email');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const {
    firstName,
    username,
    email,
    password,
    dob,
    acceptTerms,
  } = req.body;

  const hashPass = auth.getHash(password);
  const accountObj = {
    firstName,
    username,
    email,
    password: hashPass,
    dob,
    acceptTerms,
    status: 'active', // Can be active | inactive (soft delete)
    isAdmin: false,
    createdDate: new Date(),
    updateDate: new Date(),
  };

  try {
    // Create account
    const account = await db.collection(collection.ACCOUNT_NAME).insertOne(accountObj);

    // Create wallet - Could be a async call
    const wallet = await createWallet(accountObj.id, db);

    // Send out welcome email - Could be async call
    await sendWelcomeEmail(account);

    // Compose the response
    const data = {
      account,
      wallet,
    };

    if (data.insertedCount) return response.success(data);
    return response.error();
  } catch (error) {
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
      acceptTerms: Joi.string().required(),
    },
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db, // This seems off.
  },
});
