const fastify = require('fastify')({ logger: true });

// Register plugins
fastify.register(require('fastify-boom'));
fastify.register(require('fastify-mongodb'), {
  forceClose: true,
  url: 'mongodb://localhost:27017/phoenix',
  useNewUrlParser: true,
});

fastify.register(require('fastify-redis'), {
  host: '127.0.0.1',
});


// Register all endpoints
fastify.register(require('./modules/account'), { prefix: '/account' });
fastify.register(require('./modules/contest'), { prefix: '/contest' });
fastify.register(require('./modules/auth'), { prefix: '/auth' });
fastify.register(require('./modules/wallet'), { prefix: '/wallet' });

const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().post}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
