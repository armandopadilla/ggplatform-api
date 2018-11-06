/**
 * Update a specific account
 *
 */
const { ObjectID } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');

const handler = async (req, res) => {
  const { accountId } = req.params;
  const { db } = res.context.config;
  const {
    firstName,
    username,
    email,
    dob,
  } = req.body;

  const updateObj = {
    firstName,
    username,
    email,
    dob,
  };

  try {
    const data = await db.collection(collection.ACCOUNT_NAME)
      .updateOne(
        { id: ObjectID(accountId) },
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
  url: '/:accountId',
  handler,
  schema: {
    tags: ['Account'],
    description: 'Update a specific account.',
    summary: 'Update account',
    params: {
      accountId: { type: 'string', description: 'Unique account Id.' },
    },
    body: {
      type: 'object',
      properties: {
        firstName: { type: 'string', description: 'New first name for account.' },
        username: { type: 'string', description: 'New username for account.' },
        email: { type: 'string', description: 'New email for account.', format: 'email' },
        dob: { type: 'string', description: 'New date of birth for account.', format: 'date' },
      },
    },
    required: ['accountId'],
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
              "_id": { type: 'string' },
              "firstName": { type: 'string' },
              "username": { type: 'string' },
              "email": { type: 'string', format: 'email' },
              "dob": { type: 'string', format: 'date' },
              "acceptTerms": { type: 'string' },
              "status": { type: 'string', enum: ['yes', 'no'] },
              "isAdmin": { type: 'string', enum: ['yes', 'no'] },
              "createdDate": { type: 'string', format: 'date-time' },
              "updateDate": { type: 'string', format: 'date-time' }
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
