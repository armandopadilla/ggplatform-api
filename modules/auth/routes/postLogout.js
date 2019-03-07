/**
 * Logout the user out.
 * Remove the JWT from session store
 */
const { response } = require('../../../utils');

const handler = async (req, res) => {
  const { cache } = res.context.config;
  const { authorization } = req.headers;

  // Fetch the value from the header
  if (authorization == undefined) return response.error('Unathorized request.', 401);

  const token = authorization.replace('Bearer', '').trim();
  if (!token) return res.send({});

  cache.del(token);
  return res.send({});
};

module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/logout',
  handler,
  schema:{
    tags: ['Auth'],
    description: 'Log out. Removes the JWT from system',
    summary: 'Log out',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object'
          }
        }
      },
      401: {
        description: 'Unauthorized Access',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      },
    }
  },
  config: {
    cache: fastify.redis,
  },
});