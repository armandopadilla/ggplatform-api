/**
 * Fetch all contests for a specific user.
 *
 */
const ObjectId = require('mongodb').ObjectId;
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;

  // Will actually get this from JWT
  const { userId } = req.query;

  // Check the userId is valid and present
  if (!ObjectId.isValid(userId)) return response.error('Invalid User Id', 400);

  try {
    const user = await db.collection(collection.ACCOUNT_NAME).findOne({
      _id: ObjectId(userId)
    });

    if(!user) return response.error('Account not found.', 400);

    // Wondering if this is better than updating a "contests" list held onto
    // the account object.
    const contests = await db.collection(collection.CONTEST_NAME)
      .find({
        participants: userId
      }).toArray();

    const total = contests.length;

    return response.success(contests || [], total);
  } catch (error) {
    return response.error(error);
  }
};

module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/my-contests',
  handler,
  schema: {
    tags: ['Contest'],
    description: 'Fetch all the contests a specific user is in.',
    summary: 'Fetch user contests',
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
                title: {type: 'string', description: 'Contest title displayed to user.'},
                startDateTime: {type: 'string', format: 'date-time', description: 'Start date time of contest.'},
                endDateTime: {type: 'string', format: 'date-time', description: 'End date time of contest'},
                pot: {type: 'number', description: 'total amount in pot'},
                streamURL: {type: 'string', description: 'Streaming service URL. Used to stream video.'},
                status: {type: 'string', description: 'Contest status'},
                entryFee: { type: 'number', description: 'Cost to enter the contest' }
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
