/**
 * Update a specific account
 *
 */
const { ObjectID } = require('mongodb');
const { response } = require('../../../utils');
const { db: collection } = require('../../../config');
const { errors } = require('../../../config');
const {
  isEmailTaken,
  isUsernameTaken
} = require('../../../helpers/createAccount');

const handler = async (req, res) => {
  const { accountId } = req.params;
  const { db } = res.context.config;
  const {
    firstName,
    username,
    email
  } = req.body;

  const updateObj = {
    firstName,
    username,
    email
  };

  try {
    const accountsCollection = db.collection(collection.ACCOUNT_NAME);
    const currentUserData = await accountsCollection.findOne({ _id: ObjectID(accountId) });

    // Check if the user exists.
    if (!currentUserData) return response.error(errors.ACCOUNT_NOT_FOUND, 404);

    // Check if the email is taken
    if (currentUserData.email != email) {
      if (await isEmailTaken(email, accountsCollection)) return response.error(errors.ACCOUNT_EMAIL_EXISTS, 400);
    }

    // Check if the username is already taken.
    if (currentUserData.username != username) {
      if (await isUsernameTaken(username, accountsCollection)) return response.error(errors.ACCOUNT_USERNAME_EXISTS, 400);
    }

    const data = await accountsCollection
      .updateOne(
        { _id: ObjectID(accountId) },
        { $set: updateObj },
      );

    updateObj._id = accountId;

    if (data.matchedCount) return response.success(updateObj);
    return response.error('Could not update account.  Unknown error.');
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
      accountId: { type: 'string', description: 'Unique account Id.' }
    },
    body: {
      type: 'object',
      properties: {
        firstName: { type: 'string', description: 'New first name for account.' },
        username: { type: 'string', description: 'New username for account.' },
        email: { type: 'string', description: 'New email for account.', format: 'email' }
      },
    },
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
              "email": { type: 'string', format: 'email' }
            }
          }
        }
      },
      400: {
        description: 'Invalid Request',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      },
      404: {
        description: 'Account not found',
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
