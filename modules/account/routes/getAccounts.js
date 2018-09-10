const { response } = require('../../../utils');

const handler = async (req, res) => {
  const { db } = res.context.config;
  try {
    const accounts = await db.collection('accounts').find({}).toArray();

    return response.success(accounts || []);
  } catch(error) {
    console.log(error);
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/list',
  handler,
  config: {
    db: fastify.mongo.db // This seems off.
  }
});