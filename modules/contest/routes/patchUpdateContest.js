/**
 * Update a contest - admin only
 *
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
    pot,
    streamURL,
    status,
  } = req.body;

  const updateObj = {
    title,
    startDateTime,
    endDateTime,
    pot,
    streamURL,
    status,
  };

  try {
    const data = await db.collection(collection.CONTEST_NAME).updateOne(
      { id: ObjectID(contestId) },
      { $set: updateObj },
    );

    if (data.matchedCount) return response.success(updateObj);
    return response.error();
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
        pot: { type: 'number', description: 'total amount in pot' },
        streamURL: { type: 'string', description: 'Streaming service URL. Used to stream video.', format: 'url' },
        status: { type: 'string', description: 'Contest status' },
      }
    },
    params: {
      contestId: { type: 'string', description: 'Unique contest id.' }
    },
    required: ['title', 'startDatetime', 'endDateTime', 'streamURL'],
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
              status: { type: 'string', description: 'Contest status' },
            }
          }
        }
      }
    }
  },
  config: {
    db: fastify.mongo.db, // This seems off.
  },
});
