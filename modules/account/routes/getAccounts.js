// Mongo connection stuff here
const { response } = require('../../../utils');
const MongoClient = require('mongodb').MongoClient;
const dbName = 'phoenix';

//connection ulr
const url = 'mongodb://localhost:27017';

const handler = async (req, res) => {
  try {
    const dbConn = await MongoClient.connect(url);
    const db = dbConn.db(dbName);
    const accounts = await db.collection('accounts').find({}).toArray();

    return response.success(accounts || []);
  } catch(error) {
    console.log(error);
    return response.error(error);
  }
};


module.exports = fastify => fastify.route({
  method: 'GET',
  url: '/list',
  handler
});