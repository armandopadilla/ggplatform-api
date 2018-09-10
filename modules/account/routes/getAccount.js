// Mongo connection stuff here
const Joi = require('joi');
const { response } = require('../../../utils');
const MongoClient = require('mongodb').MongoClient;
const dbName = 'phoenix';

//connection ulr
const url = 'mongodb://localhost:27017';

const handler = async (req, res) => {
  const { accountId } = req.params;

  try {
    const dbConn = await MongoClient.connect(url);
    const db = dbConn.db(dbName);
    const account = await db.collection('accounts').findOne({ id: accountId });

    if (account) return response.success(account);
    return response.error('Account not found', 404);
  } catch(error) {
    console.log(error);
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/:accountId',
  handler,
  schema: {
    params: {
      accountId: Joi.number()
    }
  },
  schemaCompiler: schema => data => Joi.validate(data, schema)
});