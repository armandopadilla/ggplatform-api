/**
 * Create a new account
 *
 * Checks:
 * Check if username is already present
 * Check if email is already present
 * Check if the dob is below a threshold
 * Check if the user has accepted the terms - if not, dont save.
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
  const accountObj = {
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
  if (acceptedTerms !== 'yes') return response.error(errors.ACCOUNT_TERMS_NO_ACCPTED, 400);

  // Check email or phone is set
  if (!hasEmailOrPhone(email, phone)) return response.error(errors.ACCOUNT_EMAIL_OR_PHONE_NOT_PROVIDED, 400);

  // Check if the user is the correct age.
  if (!isValidAge(dob)) return response.error(errors.ACCOUNT_USER_TOO_YOUNG, 400);

  try {

    // Check the username is not already taken - I might want to make this a new route
    // so the app can do a quick ajax call to check and not have to submit everything.
    // Same with email.
    const usernameExists = await db.collection(collection.ACCOUNT_NAME).findOne({ username });
    if (usernameExists) return response.error(errors.ACCOUNT_USERNAME_EXISTS, 400);

    // Check the email is not already taken
    const emailExists = await db.collection(collection.ACCOUNT_NAME).findOne({ email });
    if (emailExists) return response.error(errors.ACCOUNT_EMAIL_EXISTS, 400);

    // Create account
    const account = await db.collection(collection.ACCOUNT_NAME).insertOne(accountObj);

    // Create wallet - Could be a async call
    const wallet = await createWallet(accountObj._id, db);

    // Send out welcome email - Could be async call
    await sendWelcomeEmail(email);

    // Compose the response
    const data = {
      account: accountObj,
      wallet,
    };

    if (data) return response.success(data);
    return response.error();
  } catch (error) {
    console.log(error);
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/',
  handler,
  schema: {
    tags: ['Account'],
    description: 'Create new account.',
    summary: 'Create account',
    body: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        username: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        dob: { type: 'string', format: 'date' },
        acceptedTerms: { type: 'string' },
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
              "account": {
                type: 'object',
                properties: {
                  "_id": { type: 'string' },
                  "firstName": { type: 'string' },
                  "username": { type: 'string' },
                  "email": { type: 'string', format: 'email' },
                  "dob": { type: 'string', format: 'date' },
                  "acceptedTerms": { type: 'string' },
                  "createdDate": { type: 'string', format: 'date-time' },
                  "updateDate": { type: 'string', format: 'date-time' }
                }
              },
              "wallet": {
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
      }
    }
  },
  config: {
    db: fastify.mongo.db, // This seems off.
  },
});
