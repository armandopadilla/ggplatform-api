/**
 * Create a new accout
 *
 */
const { response, auth } = require('../../../utils');
const { db: collection } = require('../../../config');
const createWallet = require('../../wallet/events/create');
const { sendWelcomeEmail } = require('../../../helpers/email');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const {
    firstName,
    username,
    email,
    password,
    dob,
    acceptedTerms,
  } = req.body;

  const hashPass = auth.getHash(password);
  const accountObj = {
    firstName,
    username,
    email,
    password: hashPass,
    dob,
    acceptedTerms,
    status: 'active', // Can be active | inactive (soft delete)
    isAdmin: false,
    createdDate: new Date(),
    updateDate: new Date(),
  };

  try {
    // Create account
    const account = await db.collection(collection.ACCOUNT_NAME).insertOne(accountObj);

    // Create wallet - Could be a async call
    const wallet = await createWallet(accountObj._id, db);

    // Send out welcome email - Could be async call
    await sendWelcomeEmail(account);

    // Compose the response
    const data = {
      account: accountObj,
      wallet,
    };

    console.log(data);
    if (data) return response.success(data);
    return response.error();
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
    description: 'Create new account.',
    summary: 'Create account',
    body: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        dob: { type: 'string', format: 'date' },
        acceptedTerms: { type: 'string' },
      },
      required: ['firstName', 'username', 'email', 'password', 'dob', 'acceptedTerms'],
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
