/**
 * Add a bucket into a contest
 *
 * What is a bet bucket?  Well...each contests can have many side bets.
 * Who will get first blood
 * Who will get a penta kill
 * Who ...
 * Those are bet buckets since a user can place X into it.
 *
 * @todo Security - Only admin can do this.
 *
 * @param req
 * @param res
 */

const ObjectId = require('mongodb').ObjectId;
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { contestId, betBucketId } = req.params;
  const { db } = res.context.config;
  const {
    title,
    description,
    minEntryFee,
    status,
  } = req.body;

  // Check if the contestId is valid
  if (!ObjectId.isValid(contestId)) return response.error('Invalid Contest Id.', 400);

  // Check the contest and bet bucket exists
  try {
    const contest = await db.collection(collection.CONTEST_NAME).findOne({
      _id: ObjectId(contestId)
    });
    if (!contest) return response.error('No Contest Found.', 404);


    const betBucket = await db.collection(collection.BETBUCKET_NAME).findOne(
      { _id: ObjectId(betBucketId) }
    );
    if (!bucket) return response.error('Bet Bucket not found', 404);

    const updateObj = {
      title,
      description,
      minEntryFee,
      status,
      participants: [],
      updatedDateTime: new Date()
    };

    const betBucket = await db.collection(collection.BETBUCKET_NAME).updateOne(
      { _id: ObjectId(betBucketId) },
      { $set: updateObj }
    );

    if (data.matchedCount) return response.success(update);
    return response.error('Could not add betbucket.', 400);
  } catch (e) {
    console.log(e);
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
      },
      required: ['title', 'description', 'minEntryFee']
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
