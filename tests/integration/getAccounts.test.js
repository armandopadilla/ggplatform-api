const should = require('should');
const supertest = require('supertest');
const fastify = require('../../server');
const { db: collection } = require('../../config');

describe ('Get Accounts', () => {

  let db;
  let accountId;
  let accountObj = {
      firstName: 'TEST_FIRST_NAME',
      username: 'TEST_USERNAME',
      email: 'TEST@test.com',
      password: 'TEST_PASSWORD',
      dob: '10/03/1981',
      acceptTerms: 'yes'
  };

  before( async () => {
    await fastify.ready();

    db = fastify.mongo.db;

    for(let i=0; i<12; i++){
      const newAccount = Object.assign({}, accountObj);
      newAccount.firstName = newAccount.firstName+'_'+i;
      newAccount.username = newAccount.username+'_'+i;
      const account =  await db.collection(collection.ACCOUNT_NAME).insertOne(newAccount);
    }
  });

  after(async () => {
    //await db.collection(collection.ACCOUNT_NAME).deleteOne({ email: accountObj.email });
  });

  it('should return accounts in correct response payload', async () => {
    const response = await supertest(fastify.server)
      .get('/account/list')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    console.log(response);
  });

});