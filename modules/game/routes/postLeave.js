/**
 * Leave a specific game
 *
 * @todo can the user do this?  Or should they contact support? I think they should unless the game already started.
 *
 * On update
 *  send out email
 *  update the pot
 *  log this event for auditing.
 */
const ObjectId = require('mongodb').ObjectId;
const { response, auth } = require('../../../utils');
const { db: collection } = require('../../../config');
const { sendLeaveGameEmail } = require('../../../helpers/email');
const { wallet } = require('../../../utils');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { userId } = req.body;
  const { gameId } = req.params;
  const { appId } = req.query;

  if (!ObjectId.isValid(gameId)) return response.error('Invalid game Id', 400);

  // Check if the userId is valid
  if (!ObjectId.isValid(userId)) return response.error('Invalid User Id', 400);

  try {
    await auth.isValidApp(appId, db);

    const user = await db.collection(collection.ACCOUNT_COLL_NAME).findOne({
      _id: ObjectId(userId)
    });

    // User preset?
    if (!user) return response.error('Account not found', 404);

    // Contest present?
    if (!contest) return response.error('Game not found', 404);

    const data = await db.collection(collection.GAME_COLL_NAME).updateOne(
      { _id: ObjectId(gameId) },
      { $pull: { participants: userId } },
    );

    // Send out email - here
    await sendLeaveGameEmail(user.email);

    // Audit entry, here or in individual items.

    if (data.matchedCount) return response.success({});
    return response.error('Could not remove user from contest', 400);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/:gameId/leave',
  handler,
  schema: {
    tags: ['Game'],
    description: 'Leave a specific game.',
    summary: 'Leave game',
    body: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Unique user id.' }
      },
      required: ['userId']
    },
    params: {
      contestId: { type: 'string', description: 'Unique game id.'}
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
