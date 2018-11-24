/**
 * Fetch a specific contest
 *
 * Has basic info on the contest and participant count.
 * @todo  do we need a list of users in the contest?  I would think not?
 */
const { ObjectId } = require('mongodb').ObjectID;
const { response } = require('../../../utils');
const { db: collection, errors } = require('../../../config');

const handler = async (req, res) => {
  const { contestId } = req.params;
  const { db } = res.context.config;

  if (!ObjectId.isValid(contestId)) return response.error('Invalid Contest Id', 400);

  try {
    const contest = await db.collection(collection.CONTEST_NAME)
      .findOne(
        { _id: ObjectId(contestId) },
      );

    if (!contest) return response.error(errors.CONTEST_NOT_FOUND, 404);

    // Grab the bets
    // @todo - link up with bets.
    contest.bets = [];
    return response.success(contest);
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
              entryFee: { type: 'number', description: 'Cost to enter the contest' },
              betBuckets: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: "string", description: "Bet Bucket title.  What is shown to the user." },
                    description: { type: "string", description: "Short description of the bet bucket.  Shown to the user." },
                    minEntryFee: { type: "number", description: "Minimum entry fee.", min: 1 },
                    status: { type: 'string' }
                  }
                },
                description: 'All possible bets a user can make for this contest.'
              },

            }
          }
        }
      },
      400: {
        description: 'Invalid Contest Id',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      },
      404: {
        description: 'Contest not found',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      },
      500: {
        description: 'Internal Server Error',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db,
  },
});
