/**
 * Get a list of contests in a game
 *
 */
const ObjectId = require('mongodb').ObjectId;
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { gameId } = req.params;

  // Check if the gameId is valid
  if (!ObjectId.isValid(gameId)) return response.error('Invalid game Id.', 400);

  try {
    const game = await db.collection(collection.GAME_COLL_NAME).findOne({ _id: ObjectId(gameId) });

    if (!game) return response.error('No game found.', 404);

    const contests = await db.collection(collection.CONTEST_COLL_NAME)
      .find({ gameId: ObjectId(gameId) })
      .toArray();

    const total = contests.length || 0;

    return response.success(contests || [], total);
  } catch (error) {
    console.log(error);
    return response.error(error);
  }
};

module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/list',
  handler,
  schema: {
    tags: ['Contest'],
    description: 'Fetch a list of all contests in a specific game',
    summary: 'Fetch contests in game',
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
                title: { type: "string", description: "Contest title.  What is shown to the user." },
                description: { type: "string", description: "Short description of the contest.  Shown to the user." },
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
