/**
 * Log In
 *
 * @todo encrypt the body
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Joi = require('joi');
const { response, auth } = require('../../../utils');
const { db:collection } = require('../../../config');

const getTokenInfo = async (user) => {
  const data = {
    email: user.email,
    id: user.id,
    firstname: user.firstname,
    username: user.username
  };

  const microtime = new Date().getTime().toString();
  const salt = crypto.createHash('md5').update(microtime).digest('hex');
  const token = jwt.sign(data, salt);
  const signature = token.split('.')[2];

  return {
    token,
    salt,
    signature
  }
};

const handler = async (req, res) => {
  const { cache, db } = res.context.config;
  const { email, password } = req.body;

  const user = await db.collection(collection.ACCOUNT_NAME).findOne({ email });

  if (!user || !auth.isValid(password, user.password)) return response.error('Invalid login', 401);

  const tokenInfo = await getTokenInfo(user);

  // Save in session store
  cache.setex(tokenInfo.token, JSON.stringify(tokenInfo));

  return res.send({
    token: tokenInfo.token
  })
};

module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/login',
  handler,
  schema: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  schemaCompiler: schema => data => Joi.validate(data, schema),
  config: {
    db: fastify.mongo.db,
    cache: fastify.redis
  }
});