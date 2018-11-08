const should = require('should');
const supertest = require('supertest');
const fastify = require('../../server');
const { db: collection } = require('../../config');

describe ('Create Account', () => {

  let db;
  let accountId;
  let accountObj = {
    firstName: 'TEST_FIRST_NAME',
    username: 'TEST_USERNAME',
    email: 'TEST@test.com',
    password: 'TEST_PASSWORD',
    dob: '1981-03-10',
    acceptedTerms: 'yes'
  };

  before( async () => {
    await fastify.ready();
    db = fastify.mongo.db;
  });

  after(async () => {
    await db.collection(collection.ACCOUNT_NAME).deleteMany({});
  });

  it ('should test that all required parameters are passed in', async () => {
    // Missing firstName
    let obj = Object.assign({}, accountObj);
    delete obj.firstName;

    let response = await supertest(fastify.server).post('/account').send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'firstName\'');

    // Missing username
    obj = Object.assign({}, accountObj);
    delete obj.username;

    response = await supertest(fastify.server).post('/account').send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'username\'');

    // Missing email
    obj = Object.assign({}, accountObj);
    delete obj.email;

    response = await supertest(fastify.server).post('/account').send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'email\'');

    // Missing password
    obj = Object.assign({}, accountObj);
    delete obj.password;

    response = await supertest(fastify.server).post('/account').send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'password\'');

    // Missing dob
    obj = Object.assign({}, accountObj);
    delete obj.dob;

    response = await supertest(fastify.server).post('/account').send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'dob\'');

    // Missing acceptedTerms
    obj = Object.assign({}, accountObj);
    delete obj.acceptedTerms;

    response = await supertest(fastify.server).post('/account').send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'acceptedTerms\'');
  });

  it('should successfully save an account', async () => {

    // Create the account
    // Check the account exists.
    // Check the wallet is also present.

    const response = await supertest(fastify.server)
      .post('/account')
      .send(accountObj)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.only.property('data');

    const data = response.body.data;
    data.should.have.only.properties(['account', 'wallet']);

    const account = data.account;
    account.should.have.only.properties([
      '_id',
      'firstName',
      'username',
      'email',
      'dob',
      'createdDate',
      'updateDate',
      'acceptedTerms'
    ]);
    account.should.have.property('firstName', accountObj.firstName);
    account.should.have.property('username', accountObj.username);
    account.should.have.property('email', accountObj.email);
    account.should.have.property('dob', accountObj.dob);
    account.should.have.property('acceptedTerms', accountObj.acceptedTerms);

    const wallet = data.wallet;

  });

});