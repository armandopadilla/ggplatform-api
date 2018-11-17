/**
 * Update a contest - admin only
 * @todo - can the pot be modified here?  I think if the admin wants to add to the pot we should create a
 * user that adds to it via the regular flow. For now removing the update of the pot.
 * @todo - auth
 * @todo - also missing are the participants and manging those.
 * @todo - also missing are the different bets and managing those. Should it be done here?
 */
const { ObjectID } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { contestId } = req.params;
  const { db } = res.context.config;
  const {
    title,
    startDateTime,
    endDateTime,
    streamURL,
    status,
  } = req.body;

  const updateObj = {
    title,
    startDateTime,
    endDateTime,
    streamURL,
    status,
  };

  if (!ObjectID.isValid(contestId)) return response.error('Invalid Contest Id', 400);

  try {
    const data = await db.collection(collection.CONTEST_NAME).updateOne(
      { _id: ObjectID(contestId) },
      { $set: updateObj },
    );

    if (data.matchedCount) return response.success(updateObj);

    return response.error('Could not update contest. Contest not found.', 404);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'PATCH',
  url: '/:contestId',
  handler,
  schema: {
    tags: ['Contest'],
    description: 'Update specific contest',
    summary: 'Update contest',
    body: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Contest title displayed to user.' },
        startDateTime: { type: 'string', format: 'date-time', description: 'Start date time of contest.' },
        endDateTime: { type: 'string', format: 'date-time', description: 'End date time of contest' },
        streamURL: { type: 'string', description: 'Streaming service URL. Used to stream video.', format: 'url' },
        status: { type: 'string', description: 'Contest status', enum: ['active', 'pending', 'in_progress', 'distributing_pot', 'paused', 'completed' ] },
      },
      required: ['title', 'startDateTime', 'endDateTime', 'streamURL'],
    },
    params: {
      contestId: { type: 'string', description: 'Unique contest id.' },
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Contest title displayed to user.' },
              startDateTime: { type: 'string', format: 'date-time', description: 'Start date time of contest.' },
              endDateTime: { type: 'string', format: 'date-time', description: 'End date time of contest' },
              streamURL: { type: 'string', description: 'Streaming service URL. Used to stream video.' },
              status: { type: 'string', description: 'Contest status', enum: ['active', 'pending', 'in_progress', 'distributing_pot', 'paused', 'completed' ] },
            }
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
    db: fastify.mongo.db, // This seems off.
  },
});
