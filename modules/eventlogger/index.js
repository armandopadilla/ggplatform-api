/**
 * Grab the event and store it.
 */
const { db:collection } = require('../../../config');

const validProperties = ['eventType', 'accountId', 'dateTime', 'description'];

const logEvent = async (payload, fastify) => {
  const { db } = fastify.mongo.db;

  // Validate the payload
  Object.keys(payload).forEach((key) => {
    if (!validProperties.indexOf(key)) return false;
  });

  const insert = await db.collection(collection.EVENTLOGGER__NAME).insertOne(payload);
  return payload;
};

module.exports = logEvent;