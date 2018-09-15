/**
 * Fetch a list of contests
 *
 * Has basic info on the contest and participant count.
 */
const { response } = require('../../../utils');
const { db:collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;

  try {
    const contests = await db.collection(collection.CONTEST_NAME)
      .find({});

    return response.success(contests || []);
  } catch(error) {
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