/**
 * Create a new user
 *
 * Checks:
 * Check if username is already present
 * Check if email is already present
 * Check if the dob is below a threshold
 * Check if the user has accepted the terms - if not, dont save.
 *
 * Steps
 * 1. Validates
 * 2. Creates user in db
 * 3. Wallet to be created.
 * 4. Email sent.
 */
const { response, auth } = require('../../../utils');
const { db: collection } = require('../../../config');
const createWallet = require('../../wallet/events/create');
const { sendWelcomeEmail } = require('../../../helpers/email');
const {
  hasEmailOrPhone,
  isValidAge
} = require('../../../helpers/createAccount');
const { errors } = require('../../../config');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const {
    firstName,
    username,
    email,
    phone,
    password,
    dob,
    acceptedTerms,
  } = req.body;

  const hashPass = auth.getHash(password);
  const userObj = {
    firstName,
    username,
    email,
    phone,
    password: hashPass,
    dob,
    acceptedTerms,
    status: 'active', // Can be active | inactive (soft delete)
    isAdmin: false,
    createdDate: new Date(),
    updateDate: new Date(),
  };

  // Check if the user accepted the terms
  if (acceptedTerms !== 'yes') return response.error(errors.USER_TERMS_NO_ACCPTED, 400);

  // Check email or phone is set
  if (!hasEmailOrPhone(email, phone)) return response.error(errors.USER_EMAIL_OR_PHONE_NOT_PROVIDED, 400);

  // Check if the user is the correct age.
  if (!isValidAge(dob)) return response.error(errors.USER_USER_TOO_YOUNG, 400);

  try {

    // Check the username is not already taken - I might want to make this a new route
    // so the app can do a quick ajax call to check and not have to submit everything.
    // Same with email.
    const usernameExists = await db.collection(collection.USER_COLL_NAME).findOne({ username });
    if (usernameExists) return response.error(errors.USER_USERNAME_EXISTS, 400);

    // Check the email is not already taken
    const emailExists = await db.collection(collection.USER_COLL_NAME).findOne({ email });
    if (emailExists) return response.error(errors.USER_EMAIL_EXISTS, 400);

    // Create user
    const user = await db.collection(collection.USER_COLL_NAME).insertOne(userObj);

    // Create wallet - Could be a async call
    const wallet = await createWallet(userObj._id, db);

    // Send out welcome email - Could be async call
    await sendWelcomeEmail(email);

    // Compose the response
    const data = {
      user: userObj,
      wallet,
    };

    if (data) return response.success(data);
    return response.error('Could not create new user. Unknown error.');
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/',
  handler,
  schema: {
    tags: ['User'],
    description: 'Create new user.',
    summary: 'Create user',
    body: {
      type: 'object',
      properties: {
        firstName: { type: 'string', description: 'First name of user' },
        username: { type: 'string', description: 'User\'s username' },
        phone: { type: 'string', description: 'XXX-XXX-XXXX eg 323-555-7056' },
        email: { type: 'string', format: 'email', description: 'User\s email address' },
        password: { type: 'string', description: 'Password for user', minLength: 5, maxLength: 20 },
        dob: { type: 'string', format: 'date-time', description: '10/03/1981' },
        acceptedTerms: { type: 'string', description: 'Indicates if user has accepted the TOS', enum: ['yes', 'no'] },
      },
      required: ['firstName', 'username', 'password', 'dob', 'acceptedTerms']
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  firstName: { type: 'string' },
                  username: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  dob: { type: 'string', format: 'date' },
                  acceptedTerms: { type: 'string' },
                  createdDate: { type: 'string', format: 'date-time' },
                  updateDate: { type: 'string', format: 'date-time' }
                }
              },
              wallet: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  ownerId: { type: 'string' },
                  balance: { type: 'number' },
                  currency: { type: 'string' },
                  createdDate: { type: 'string', format: 'date-time' },
                  updateDate: { type: 'string', format: 'date-time' }
                }
              }
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
