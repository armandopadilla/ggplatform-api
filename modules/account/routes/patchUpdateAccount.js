// Mongo connection stuff here
const Joi = require('joi');
const { response } = require('../../../utils');
const MongoClient = require('mongodb').MongoClient;
const dbName = 'phoenix';

//connection ulr
const url = 'mongodb://localhost:27017';

const handler = async (req, res) => {
  const { accountId } = req.params;
  const {
    firstName,
    username,
    email,
    dob
  } = req.body;

  //@todo Password we'll treat differently
  const updateObj = {
    firstName,
    username,
    email,
    dob
  } ;

  try {
    const dbConn = await MongoClient.connect(url);
    const db = dbConn.db(dbName);
    const data = await db.collection('accounts').updateOne(
      { id: accountId },
      {$set: updateObj}
    );

    if (data.matchedCount) return response.success(updateObj);
    return response.error();
  } catch(error) {
    console.log(error);
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'PATCH',
  url: '/:accountId',
  handler,
  schema: {
    params: {
      accountId: Joi.string().required()
    },
    body: {
      firstName: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().email(),
      dob: Joi.string().required()
    }
  },
  schemaCompiler: schema => data => Joi.validate(data, schema)
});