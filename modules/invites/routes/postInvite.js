const ObjectId = require('mongodb').ObjectId;
const { response, auth } = require('../../../utils');
const withdraw = require('../../wallet/events/withdraw');
const { sendInviteText } = require('../../../helpers/text');
const { sendInviteEmail } = require('../../../helpers/email');

const handler = async (req, res) => {
  const { db, cache } = res.context.config;
  const {
    invite1,
    invite2 = '',
    invite3 = '',
  } = req.body;

  const { appId } = req.query;

  const { id: userId} = await auth.getSessionInfo(req, cache);
  if (!userId) return response.error('Unathorized request', 401);

  // Check the userId is valid and present
  if (!ObjectId.isValid(userId)) return response.error('Invalid User Id', 400);

  try {
    await auth.isValidApp(appId, db);

    // Foreach of the entries check what it is.
    const invites = [invite1, invite2, invite3];

    // @todo we should save these just in case we want to contact them later.
    invites.forEach((invite) => {
      if (invite) {
        if(invite.indexOf('@') > -1) {
          console.log("email");
          sendInviteEmail(invite);
        } else {
          console.log("text");
          sendInviteText(invite);
        }
      }
    });

    return response.success({});

  } catch (error) {
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'POST',
  url: '/',
  handler,
  schema: {
    tags: ['Invite'],
    description: 'Send invites to join the site.',
    summary: 'Send invites to friends to join site.',
    body: {
      type: 'object',
      properties: {
        invite1: { type: 'string', description: 'Mobile Phone or Email' },
        invite2: { type: 'string', description: 'Mobile Phone or Email' },
        invite3: { type: 'string', description: 'Mobile Phone or Email' }
      },
      required: ['invite1']
    },
    querystring: {
      appId: { type: 'string' }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          "data": {
            type: 'object'
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
    db: fastify.mongo.db,
    cache: fastify.redis,
  },
});
