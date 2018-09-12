// Check if the user is valid
// Create a JWT
// Encrypt the JWT body
// Add the JWT to cache (session store)


/**
 * Logout the user out.
 * Remove the JWT from session store
 */
const Joi = require('joi');
const { response, auth } = require('../../../utils');

const handler = async (req, res) => {
  const { cache, db } = res.context.config;
  const { email, password } = req.params;

  const user = await db.collection('users').findOne({ email });

  if (!user || !auth.isValid(password, user.password)) return response.error('Invalid login', 401);

  const token = getToken(user);
  cache.setex(token, token);
  return res.send(token)
};

module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/',
  handler,
  schema: {

  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db,
    cache: fastify.redis
  }
});