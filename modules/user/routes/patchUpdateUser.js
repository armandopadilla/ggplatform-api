/**
 * Update a specific user
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
  const { userId } = req.params;
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
    const usersCollection = db.collection(collection.USER_COLL_NAME);
    const currentUserData = await usersCollection.findOne({ _id: ObjectID(userId) });

    // Check if the user exists.
    if (!currentUserData) return response.error(errors.USER_NOT_FOUND, 404);

    // Check if the email is taken
    if (currentUserData.email != email) {
      if (await isEmailTaken(email, usersCollection)) return response.error(errors.USER_EMAIL_EXISTS, 400);
    }

    // Check if the username is already taken.
    if (currentUserData.username != username) {
      if (await isUsernameTaken(username, usersCollection)) return response.error(errors.USER_USERNAME_EXISTS, 400);
    }

    const data = await usersCollection
      .updateOne(
        { _id: ObjectID(userId) },
        { $set: updateObj },
      );

    updateObj._id = accountId;

    if (data.matchedCount) return response.success(updateObj);
    return response.error('Could not update user.  Unknown error.'); // Will this ever really happen??
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'PATCH',
  url: '/:userId',
  handler,
  schema: {
    tags: ['User'],
    description: 'Update a specific user.',
    summary: 'Update user',
    params: {
      accountId: { type: 'string', description: 'Unique user Id.' }
    },
    body: {
      type: 'object',
      properties: {
        firstName: { type: 'string', description: 'New first name for user.' },
        username: { type: 'string', description: 'New username for user.' },
        email: { type: 'string', description: 'New email for user.', format: 'email' }
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
        description: 'User not found',
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
