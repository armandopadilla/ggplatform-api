/**
 * Fetch a list of contests
 *
 * Has basic info on the contest and participant count.
 */
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;

  try {
    const contests = await db.collection(collection.CONTEST_NAME)
      .find({}).toArray();

    return response.success(contests || []);
  } catch (error) {
    return response.error(error);
  }
};

module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/list',
  handler,
  schema: {
    tags: ['Contest'],
    description: 'Fetch a list of all contests in the system',
    summary: 'Fetch contests',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'array',
            items: [{
              type: 'object',
              properties: {
                _id: {type: 'string'},
                title: {type: 'string', description: 'Contest title displayed to user.'},
                startDateTime: {type: 'string', format: 'date-time', description: 'Start date time of contest.'},
                endDateTime: {type: 'string', format: 'date-time', description: 'End date time of contest'},
                pot: {type: 'number', description: 'total amount in pot'},
                streamURL: {type: 'string', description: 'Streaming service URL. Used to stream video.'},
                status: {type: 'string', description: 'Contest status'},
              }
            }]
          }
        }
        }
      }
  },
  config: {
    db: fastify.mongo.db,
  },
});
