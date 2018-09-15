/**
 * Logout the user out.
 * Remove the JWT from session store
 */

const handler = (req, res) => {
  const { cache } = res.context.config;
  const { authorization } = req.headers;

  // Fetch the value from the header
  const token = authorization.replace('Bearer', '').trim();
  if (!token) return res.send({});

  cache.del(token);
  return res.send({});
};

module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/logout',
  handler,
  config: {
    cache: fastify.redis,
  },
});
