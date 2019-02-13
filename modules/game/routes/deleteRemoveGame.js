/**
 * Delete a specific game
 * 0. This should really be a soft delete.  We need to make sure we keep a solid audit of thigns.
 * 1. user can not delete a game once its started or finished.
 * 2. User can not delete a game with participants.
 * 3. User can not delete a game with contests.
 *
 * Questions.
 * 1. What happens to the pot? Full refunds?
 * 2. Can we reschedule?
 * 3. Do we send out any notification to the participants?
 * 4. Should there be a reason why this was canceled?  For auditing.
 */
const { ObjectID } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { gameId } = req.params;
  const { db } = res.context.config;

  try {
    // @todo - check criteria for deletion.  See above.

    const data = await db.collection(collection.GAME_COLL_NAME).updateOne(
      { _id: ObjectID(gameId) },
      { $set: { status: 'canceled' } },
    );

    if (data.matchedCount) return response.success({});
    return response.error();
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'DELETE',
  url: '/:gameId',
  handler,
  schema: {
    tags: ['Game'],
    description: 'Delete a specific game from the system.',
    summary: 'Delete game',
    params: {
      contestId: { type: 'string', description: 'Unique game id' }
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
      }
    }
  },
  config: {
    db: fastify.mongo.db, // This seems off.
  },
});
