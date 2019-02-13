/**
 * Update a specific contest
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
  const { gameId, contestId } = req.params;
  const { db } = res.context.config;

  // Check if the gameId is valid
  if (!ObjectId.isValid(gameId)) return response.error('Invalid game id.', 400);
  if (!ObjectId.isValid(contestId)) return response.error('Invalid contest id.', 400);

  // Check the game and contest exists
  try {
    const game = await db.collection(collection.GAME_COLL_NAME).findOne({
      _id: ObjectId(gameId)
    });
    if (!game) return response.error('No game found.', 404);

    const contest = await db.collection(collection.CONTEST_COLL_NAME).findOne(
      { _id: ObjectId(contestId) }
    );
    if (!contest) return response.error('No contest found.', 404);

    const updateObj = getUpdateObj(req.body);

    const updateData = await db.collection(collection.CONTEST_COLL_NAME).updateOne(
      { _id: ObjectId(contestId) },
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
  url: '/:contestId',
  handler,
  schema: {
    tags: ['Contest'],
    description: 'Update a contest within an existing game',
    summary: 'Update a contest',
    params: {
      gameId: {
        type: "string",
        description: "Unique game Id."
      },
      contestId: {
        type: "string",
        description: "Unique contest Id."
      }
    },
    body: {
      type: "object",
      properties: {
        title: { type: "string", description: "Contest title.  What is shown to the user." },
        description: { type: "string", description: "Short description of the contest.  Shown to the user." },
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
