/**
 * Get a list of accounts
 *
 */
const { response } = require('../../../utils');
const { db:collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;
  try {
    const accounts = await db.collection(db.ACCOUNT_NAME)
      .find({})
      .toArray();

    return response.success(accounts || []);
  } catch(error) {
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