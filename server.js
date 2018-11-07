const fastify = require('fastify')({ logger: true });
const { db } = require('./config');

// Register plugins
fastify.register(require('fastify-cors'), { origin: true });
fastify.register(require('fastify-boom'));
fastify.register(require('fastify-mongodb'), {
  forceClose: true,
  url: db.CONNECTION_STRING,
  useNewUrlParser: true,
});


//fastify.register(require('fastify-redis'), {
//  host: '127.0.0.1',
//});

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


if (require.main === module) {
  start();
} else {

  exports.handler = (event, context, callback) => {

    context.callbackWaitsForEmptyEventLoop = false;

    //construct the query string...blah
    let query = '';
    const queryString = event.queryStringParameters;
    if (queryString) {
      Object.keys(queryString).forEach((key) => {
        query += key+'='+queryString[key]+'&';
      });
      query = '?'+query;
    }

    // map lambda event
    const options = {
      method: event.httpMethod,
      url: event.path,
      payload: event.body,
      headers: event.headers,
      validate: false
    };

    fastify.inject(options, function(err, res) {
      console.log("res", res);
      const response = {
        statusCode: res.statusCode,
        body: res.payload,
        headers: res.headers
      };

      callback(null, response);
    });

  };
}


module.exports = fastify;
