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

fastify.register(require('fastify-swagger'), {
  routePrefix: '/documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'gglol API',
      description: 'gglol API collection',
      version: '0.1.0'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Account', description: 'Account related end-points' },
      { name: 'Auth', description: 'Authentication related end-points' },
      { name: 'Wallet', description: 'Wallet related end-points' },
      { name: 'Bet', description: 'Bet/Betting related end-points' },
      { name: 'Contest', description: 'Contests related end-points' },
    ],
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header'
      }
    }
  }
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

