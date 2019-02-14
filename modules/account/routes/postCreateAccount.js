/**
 * Create a new account
 * 1. Send out a welcome email
 * 2. Add the account to the system.
 */
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const {
    name,
    contactEmail,
    streetAddress,
    city,
    state,
    country,
    postalCode
  } = req.body;

  const insertObj = {
    name,
    contactEmail,
    streetAddress,
    city,
    state,
    country,
    postalCode
  };

  try {
    const data = await db.collection(collection.GAME_COLL_NAME).insertOne(insertObj);

    if (data.insertedCount) return response.success(insertObj);

    // When is this triggered???
    return response.error('Could not create game.  Unknown error', 400);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/',
  handler,
  schema: {
    tags: ['Account'],
    description: 'Create new account',
    summary: 'Create account',
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name on account, company name.' },
        contactEmail: { type: 'string', format: 'email', description: 'Contact email for account.' },
        streetAddress: { type: 'string', description: 'Street address' },
        city: { type: 'string', description: 'City' },
        state: { type: 'string', description: 'State/Province' },
        country: { type: 'string', description: 'Country' },
        postalCode: { type: 'number', description: 'Postal code' }
      },
      required: ['name', 'contactEmail', 'streetAddress', 'city', 'state', 'country', 'postalCode'],
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
              name: { type: 'string', description: 'Name on account, company name.' },
              contactEmail: { type: 'string', format: 'email', description: 'Contact email for account.' },
              streetAddress: { type: 'string', description: 'Street address' },
              city: { type: 'string', description: 'City' },
              state: { type: 'string', description: 'State/Province' },
              country: { type: 'string', description: 'Country' },
              postalCode: { type: 'number', description: 'Postal code' },
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
