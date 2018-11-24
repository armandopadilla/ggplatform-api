/**
 * Get a list of bucket into a contest
 *
 */
const ObjectId = require('mongodb').ObjectId;
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { contestId } = req.params;

  try {
    const betBuckets = await db.collection(collection.BETBUCKET_NAME)
      .find({ contestId: ObjectId(contestId) })
      .toArray();

    const total = betBuckets.length || 0;

    return response.success(betBuckets || [], total);
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
    description: 'Fetch a list of all but buckets in a specific contest',
    summary: 'Fetch bet buckets in contest',
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: {type: 'string'},
                title: { type: "string", description: "Bet Bucket title.  What is shown to the user." },
                description: { type: "string", description: "Short description of the bet bucket.  Shown to the user." },
                minEntryFee: { type: "number", description: "Minimum entry fee.", min: 1 },
                participants: { type: 'array', items: { type: 'number' } },
                status: { type: 'string', enum: ['open', 'closed', 'paused', 'distributing', 'finished'] },
                createdDateTime: {type: 'string', format: 'date-time', description: 'Created date time'},
                updatedDateTime: {type: 'string', format: 'date-time', description: 'Updated date time'}
              }
            }
          },
          _meta: {
            type: 'object',
            properties: {
              total: { type: 'number', description: 'Total number of records.' }
            }
          }
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
