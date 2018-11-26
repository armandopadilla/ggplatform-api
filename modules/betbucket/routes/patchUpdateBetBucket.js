/**
 * Update a specific bucket
 */

const ObjectId = require('mongodb').ObjectId;
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

/**
 * Build an object based off the params that were actually sent.
 *
 * @param req
 * @returns {{}}
 */
const getUpdateObj = (params) => {
  const obj = {};
  Object.keys(params).forEach((key) => {
    obj[key] = params[key]
  });

  obj.updatedDateTime = new Date();
  return obj;
};

const handler = async (req, res) => {
  const { contestId, betBucketId } = req.params;
  const { db } = res.context.config;

  // Check if the contestId is valid
  if (!ObjectId.isValid(contestId)) return response.error('Invalid Contest Id.', 400);
  if (!ObjectId.isValid(betBucketId)) return response.error('Invalid Bet Bucket Id.', 400);

  // Check the contest and bet bucket exists
  try {
    const contest = await db.collection(collection.CONTEST_NAME).findOne({
      _id: ObjectId(contestId)
    });
    if (!contest) return response.error('No Contest Found.', 404);

    const betBucket = await db.collection(collection.BETBUCKET_NAME).findOne(
      { _id: ObjectId(betBucketId) }
    );
    if (!betBucket) return response.error('No bet bucket found.', 404);

    const updateObj = getUpdateObj(req.body);
    console.log(updateObj);

    const updateData = await db.collection(collection.BETBUCKET_NAME).updateOne(
      { _id: ObjectId(betBucketId) },
      { $set: updateObj }
    );

    if (updateData.matchedCount) return response.success(updateData);
    return response.error('Could not update betbucket.', 400);
  } catch (e) {
    return response.error(e);
  }
};

module.exports = fastify => fastify.route({
  method: 'PATCH',
  url: '/:betBucketId',
  handler,
  schema: {
    tags: ['Bet'],
    description: 'Update a "bet bucket" within an existing contest',
    summary: 'Update a "bet bucket"',
    params: {
      contestId: {
        type: "string",
        description: "Unique contest Id."
      },
      betBucketId: {
        type: "string",
        description: "Unique bet bucket Id."
      }
    },
    body: {
      type: "object",
      properties: {
        title: { type: "string", description: "Bet Bucket title.  What is shown to the user." },
        description: { type: "string", description: "Short description of the bet bucket.  Shown to the user." },
        minEntryFee: { type: "number", description: "Minimum entry fee.", min: 1 },
        status: { type: 'string', enum: ['open', 'closed', 'paused', 'distributing', 'finished'] }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object'
          }
        }
      },
      400: {
        description: 'Bad Request',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      },
      404: {
        description: 'Not Found',
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
