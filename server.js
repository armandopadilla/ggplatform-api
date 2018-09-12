const fastify = require('fastify')();

// Register plugins
fastify.register(require('fastify-boom'));
fastify.register(require('fastify-mongodb'), {
  forceClose: true,
  url: 'mongodb://localhost:27017/phoenix'
});

// Register all endpoints
fastify.register(require('./modules/account'), { prefix: '/account' });
fastify.register(require('./modules/contest'), { prefix: '/contest' });

const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().post}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}


start();