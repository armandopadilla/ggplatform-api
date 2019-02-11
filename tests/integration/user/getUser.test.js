const should = require('should');
const supertest = require('supertest');
const fastify = require('../../../server');
const { db: collection } = require('../../../config/index');

describe ('Get Account', () => {

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
    const account =  await db.collection(collection.ACCOUNT_NAME).insertOne(accountObj);
    accountId = account.ops[0]._id;
  });

  after(async () => {
    await db.collection(collection.ACCOUNT_NAME).deleteOne({ username: 'TEST_USERNAME' });
  });

  it('should return account info with correct response payload', async () => {
    const response = await supertest(fastify.server)
      .get(`/account/${accountId}`)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.only.property('data');
    response.body.data.should.have.property('username', accountObj.username);
    response.body.data.should.have.property('firstName', accountObj.firstName);
    response.body.data.should.have.property('email', accountObj.email);
    response.body.data.should.have.property('dob', accountObj.dob);
    response.body.data.should.have.property('acceptTerms', accountObj.acceptTerms);
    response.body.data.should.have.property('_id');
  });

  it('should fail do to invalid id', async () => {
    const response = await supertest(fastify.server)
      .get(`/account/123`)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.property('statusCode', 400);
    response.body.should.have.property('error', 'Bad Request');
    response.body.should.have.property('message', 'Invalid Id');
  });

  it('should return 404, no account found.', async () => {
    const response = await supertest(fastify.server)
      .get('/account/53fbf4615c3b9f41c381b6a3')
      .expect(404)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.property('statusCode', 404);
    response.body.should.have.property('error', 'Not Found');
    response.body.should.have.property('message', 'Account not found');
  });

});