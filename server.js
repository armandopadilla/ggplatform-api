const config = require('./config');
const fastify = require('fastify')(config.server);
const db = config.db;

const cors = require('cors')
fastify.use(cors());

// Register plugins
/*fastify.register(require('fastify-cors'), {
  origin: 'http://localhost:8080' ,
  methods: 'OPTIONS,GET,HEAD,PUT,PATCH,POST,DELETE',
});*/
fastify.register(require('fastify-boom'));
fastify.register(require('fastify-mongodb'), config.db.connInfo);

const bluebird = require('bluebird');
const redis = require('redis').createClient({ host: 'localhost', port: 6379 })

bluebird.promisifyAll(redis);

fastify.register(require('fastify-redis'), {
  client: redis,
});

fastify.register(require('fastify-swagger'), {
  routePrefix: '/documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'ggmetacom API',
      description: 'ggmetacom API collection',
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
      { name: 'Contest', description: 'Bet/Betting related end-points' },
      { name: 'Game', description: 'Game related end-points' },
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
fastify.register(require('./modules/user'), { prefix: '/v1/user' });
fastify.register(require('./modules/game'), { prefix: '/v1/game' });
fastify.register(require('./modules/auth'), { prefix: '/v1/auth' });
//fastify.register(require('./modules/wallet'), { prefix: '/wallet' });
//fastify.register(require('./modules/contest'), { prefix: '/contest/:contestId/betbucket' });

const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().post}`);
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();