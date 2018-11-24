/**
 * Create a new contest - admin only
 * status = pending | in_progress | distributing_pot | paused | completed
 *
 * @todo - Auth
 */
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const {
    title,
    startDateTime,
    endDateTime,
    pot,
    streamURL,
    status,
    entryFee
  } = req.body;

  const insertObj = {
    title,
    startDateTime,
    endDateTime,
    pot,
    streamURL,
    status,
    participants: [], // Initially empty
    entryFee
  };

  try {
    const data = await db.collection(collection.CONTEST_NAME).insertOne(insertObj);

    if (data.insertedCount) return response.success(insertObj);

    // When is this triggered???
    return response.error('Could not create contest.  Unknown error', 400);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/',
  handler,
  schema: {
    tags: ['Contest'],
    description: 'Create new contest',
    summary: 'Create contest',
    body: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Contest title displayed to user.' },
        startDateTime: { type: 'string', format: 'date-time', description: 'Start date time of contest.' },
        endDateTime: { type: 'string', format: 'date-time', description: 'End date time of contest' },
        pot: { type: 'number', description: 'total amount in pot' },
        streamURL: { type: 'string', description: 'Streaming service URL. Used to stream video.' },
        status: { type: 'string', description: 'Contest status', enum: ['active', 'pending', 'in_progress', 'distributing_pot', 'paused', 'completed' ] },
        entryFee: { type: 'number', description: 'Cost to enter the contest' }
      },
      required: ['title', 'startDateTime', 'endDateTime', 'streamURL', 'status', 'entryFee'],
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              title: { type: 'string', description: 'Contest title displayed to user.' },
              startDateTime: { type: 'string', format: 'date-time', description: 'Start date time of contest.' },
              endDateTime: { type: 'string', format: 'date-time', description: 'End date time of contest' },
              pot: { type: 'number', description: 'total amount in pot' },
              streamURL: { type: 'string', description: 'Streaming service URL. Used to stream video.' },
              status: { type: 'string', description: 'Contest status', enum: ['active', 'pending', 'in_progress', 'distributing_pot', 'paused', 'completed' ] },
              entryFee: { type: 'number', description: 'Cost to enter the contest' }
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
