/**
 * Fetch a specific contest
 *
 * Has basic info on the contest and participant count.
 * @todo  do we need a list of users in the contest?  I would think not?
 */
const { ObjectID } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection, errors } = require('../../../config');

const handler = async (req, res) => {
  const { contestId } = req.params;
  const { db } = res.context.config;

  try {
    const contest = await db.collection(collection.CONTEST_NAME)
      .findOne(
        { _id: ObjectID(contestId) },
      );

    if (contest) return response.success(contest);
    return response.error(errors.CONTEST_NOT_FOUND, 404);
  } catch (error) {
    return response.error(error);
  }
};

module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/:contestId',
  handler,
  schema: {
    tags: ['Contest'],
    description: 'Fetch a contest in the system',
    summary: 'Fetch a contest',
    params: {
      contestId: { type: 'string', description: 'Unique contest Id' }
    },
    required: ['contestId'],
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              title: { type: 'string', description: 'Contest title displayed to user.' },
              startDateTime: { type: 'string', format: 'date-time', description: 'Start date time of contest.' },
              endDateTime: { type: 'string', format: 'date-time', description: 'End date time of contest' },
              pot: { type: 'number', description: 'total amount in pot' },
              streamURL: { type: 'string', description: 'Streaming service URL. Used to stream video.' },
              status: { type: 'string', description: 'Contest status' },
            }
          }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db,
  },
});
