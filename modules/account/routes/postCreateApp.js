/**
 * Create a new app for an account
 */
const uuidV4 = require('uuid/v4');
const ObjectId = require('mongodb').ObjectID;
const { response } = require('../../../utils/index');
const { db: collection } = require('../../../config/index');

const handler = async (req, res) => {
  const { db } = res.context.config;
  const { name } = req.body;
  const { accountId } = req.params;

  console.log("accountId", accountId);

  const insertObj = {
    name,
    createdDate: new Date(),
    updatedDate: new Date()
  };

  // Save the new account
  try {
    // Generate a new APP_ID
    const uuid = uuidV4();
    insertObj.appId = uuid;

    const data = await db.collection(collection.ACCOUNT_COLL_NAME)
      .updateOne({
        _id: ObjectId(accountId)
      }, {
        $push: { applications: insertObj }
      });
    return response.success();
  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/:accountId/app',
  handler,
  schema: {
    tags: ['Account Application'],
    description: 'Create new app',
    summary: 'Create app for account',
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name on account, company name.' },
      },
      required: ['name'],
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object',
            properties: {}
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
