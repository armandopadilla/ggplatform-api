/**
 * Grab the event and store it.
 */
const validProperties = ['eventType', 'accountId', 'dateTime', 'description'];
const logEvent = async (payload, fastify) => {
  const { db } = fastify.mongo.db;

  // Validate the payload
  Object.keys(payload).forEach((key) => {
    if (!validProperties.indexOf(key)) return false;
  });

  const insert = await db.collection('event_logs').insertOne(payload);
  return payload;
};

module.exports = logEvent;