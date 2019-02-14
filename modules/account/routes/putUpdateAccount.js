/**
 * Update an account
 */
const { ObjectID } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { gameId } = req.params;
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

  const updateObj = {
    name,
    contactEmail,
    streetAddress,
    city,
    state,
    country,
    postalCode
  };

  if (!ObjectID.isValid(accountId)) return response.error('Invalid account Id', 400);

  try {
    const data = await db.collection(collection.ACCOUNT_COLL_NAME).updateOne(
      { _id: ObjectID(accountId) },
      { $set: updateObj },
    );

    if (data.matchedCount) return response.success(updateObj);

    return response.error('Could not update account. Account not found.', 404);
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'PATCH',
  url: '/:accountId',
  handler,
  schema: {
    tags: ['Account'],
    description: 'Update specific account',
    summary: 'Update acount',
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
    params: {
      contestId: { type: 'string', description: 'Unique game id.' },
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
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
