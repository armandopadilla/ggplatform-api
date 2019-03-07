/**
 * Log In
 *
 * @todo encrypt the body
 * @todo - Write up - Session store in cache because, at worst they user will have to log back in.
 * @todo - Monitoring
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { response, auth } = require('../../../utils');
const { db: collection } = require('../../../config');

const getNewTokenInfo = async (user, password) => {
  const data = {
    email: user.email,
    id: user._id,
    username: user.username,
  };

  console.log(data);

  const microtime = new Date().getTime().toString();
  const salt = crypto.createHash('md5').update(microtime).digest('hex');
  const token = jwt.sign(data, salt);
  const signature = token.split('.')[2];

  return {
    token,
    salt,
    signature,
  };
};

const handler = async (req, res) => {
  const { cache, db } = res.context.config;
  const { email, password } = req.body;

  const user = await db.collection(collection.USER_COLL_NAME).findOne({ email });

  if (!user || !auth.isValid(password, user.password)) return response.error('Invalid login', 401);

  const tokenInfo = await getNewTokenInfo(user, password);

  // Save in session store (cache)
  await cache.set(tokenInfo.token, JSON.stringify(tokenInfo));

  return response.success({
    token: tokenInfo.token,
  });
};

module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/login',
  handler,
  schema: {
    tags: ['Auth'],
    description: 'Log the user in and receive a JWT.',
    summary: 'Log in',
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', description: 'Email of account to login with' },
        password: { type: 'string', description: 'Password of account to login with.'},
      }
    },
    required: ['email', 'password'],
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
              "token": { type: 'string' }
            }
          }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db,
    cache: fastify.redis,
  },
});
