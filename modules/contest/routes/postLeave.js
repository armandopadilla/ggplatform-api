/**
 * Leave a specific contest
 *
 */
const ObjectID = require('mongodb').ObjectId;
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { userId } = req.body;
  const { contestId } = req.params;

  // @todo Full refund?
  // @todo Email to confirm...as a receipt of sorts?
  // @todo update the pot

  try {
    const data = await db.collection(collection.CONTEST_NAME).updateOne(
      { _id: ObjectID(contestId) },
      { $pull: { participants: userId } },
    );

    if (data.matchedCount) return response.success({});
    return response.error();
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/:contestId/leave',
  handler,
  schema: {
    tags: ['Contest'],
    description: 'Leave a specific contest.',
    summary: 'Leave contest',
    body: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Unique user id.' }
      }
    },
    params: {
      contestId: { type: 'string', description: 'Unique contest id.'}
    },
    required: ['contestId', 'userId'],
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object'
          }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db,
  },
});
