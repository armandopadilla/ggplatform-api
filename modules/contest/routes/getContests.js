/**
 * Fetch a list of contests
 *
 */
const { response } = require('../../../utils');

const handler = async (req, res) => {
  const { db } = res.context.config;

  try {
    const contests = await db.collection('contests').find({});

    return response.success(contests || []);
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
    db: fastify.mongo.db
  }
});