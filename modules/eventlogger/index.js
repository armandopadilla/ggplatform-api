/**
 * Grab the event and store it.
 */
const { db: collection } = require('../../config');

const validProperties = ['eventType', 'userId', 'accountId', 'dateTime', 'description'];

const logEvent = async (payload, fastify) => {
  const { db } = fastify.mongo.db;

  // Validate the payload
  Object.keys(payload).forEach((key) => {
    if (!validProperties.indexOf(key)) return false;
  });

  await db.collection(collection.EVENTLOGGER_COLL_NAME).insertOne(payload);
  return payload;
};

module.exports = logEvent;
