/**
 * Add a contest to a game.
 *
 * What is a contest?  Each game can have many contests which a user can place wagers on.
 *  Who will get first blood
 *  Who will get a penta kill
 *  Who ...
 * Those are contests since a user can place X into it.
 *
 * Status = pending | in progress | completed | awarded
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
  const { gameId } = req.params;
  const { db } = res.context.config;
  const {
    title,
    description,
    minEntryFee,
    status,
    pot,
  } = req.body;

  // Check if the gameId is valid
  if (!ObjectId.isValid(gameId)) return response.error('Invalid game id.', 400);

  // Check the contest exists
  try {
    const _id = ObjectId(gameId);
    const game = await db.collection(collection.GAME_COLL_NAME).findOne({ _id });

    if (!game) return response.error('No game found.', 404);

    // @todo Check if the user can do take this action.

    const contestObj = {
      title,
      description,
      minEntryFee,
      gameId,
      status: status || 'pending',
      participants: [],
      createdDateTime: new Date(),
      updatedDateTime: new Date(),
      pot: pot || 0,
    };

    const contest = await db.collection(collection.CONTEST_COLL_NAME).insertOne(contestObj);
    if (contest) return response.success(contest);
    return response.error('Could not add contest.', 400);
  } catch (e) {
    return response.error(e);
  }
};

module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/',
  handler,
  schema: {
    tags: ['Contest'],
    description: 'Create a new contest within an existing game',
    summary: 'Create a contest',
    params: {
      gameId: {
        type: "string",
        description: "Unique game Id."
      }
    },
    body: {
      type: "object",
      properties: {
        title: { type: "string", description: "Contest title.  What is shown to the user." },
        description: { type: "string", description: "Short description of the contest.  Shown to the user." },
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
