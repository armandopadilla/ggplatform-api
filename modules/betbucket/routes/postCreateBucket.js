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
  const { contestId } = req.params;
  const { db } = res.context.config;
  const {
    title,
    description,
    minEntryFee
  } = req.body;

  // Check if the contestId is valid
  if (!ObjectId.isValid(contestId)) return response.error('Invalid Contest Id.', 400);

  // Check the contest exists
  try {
    const _id = ObjectId(contestId);
    const contest = await db.collection(collection.CONTEST_NAME).findOne({ _id });

    if (!contest) return response.error('No Contest Found.', 404);

    // @todo Check if the user can do take this action.
    // @todo you know this is not going to fly.  People need a unique Id as a form of
    // receipt AND for auditing we need a trail of who is coming in and out. UPDATE!

    const betBucketObj = {
      title,
      description,
      minEntryFee,
      participants: [],
      createdDateTime: new Date(),
      updatedDateTime: new Date()
    };

    // Add an element to the contest.betbuckets array.
    const data = await db.collection(collection.CONTEST_NAME).updateOne(
      { _id },
      { $addToSet: { betBuckets: betBucketObj } }
    );

    if (data.matchedCount) return response.success(betBucketObj);
    return response.error('Could not add betbucket.', 400);
  } catch (e) {
    console.log(e);
    return response.error(e);
  }
};

module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/',
  handler,
  schema: {
    tags: ['Bet'],
    description: 'Create a new "bet bucket" within an existing contest',
    summary: 'Create a "bet bucket"',
    params: {
      contestId: {
        type: "string",
        description: "Unique contest Id."
      }
    },
    body: {
      type: "object",
      properties: {
        title: { type: "string", description: "Bet Bucket title.  What is shown to the user." },
        description: { type: "string", description: "Short description of the bet bucket.  Shown to the user." },
        minEntryFee: { type: "number", description: "Minimum entry fee.", min: 1 }
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
