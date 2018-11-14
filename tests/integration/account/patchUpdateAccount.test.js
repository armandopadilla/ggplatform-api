const should = require('should');
const supertest = require('supertest');
const fastify = require('../../../server');
const { db: collection } = require('../../../config/index');

describe ('Update Account', () => {

  let db;
  let accountId;
  const accountObj = {
    firstName: 'TEST_FIRST_NAME',
    username: 'TEST_USERNAME',
    email: 'mandopadilla81@gmail.com',
    password: 'TEST_PASSWORD',
    dob: '1981-03-10',
    acceptedTerms: 'yes',
    phone: '323-123-3456',
  };

  const accountObj2 = {
    firstName: 'TEST_FIRST_NAME_2',
    username: 'TEST_USERNAME_2',
    email: 'test@gmail.com',
    password: 'TEST_PASSWORD',
    dob: '1981-03-10',
    acceptedTerms: 'yes',
    phone: '323-123-3456',
  };

  before( async () => {
    await fastify.ready();
    db = fastify.mongo.db;

    const account =  await db.collection(collection.ACCOUNT_NAME).insertOne(accountObj);
    accountId = account.ops[0]._id;

    await db.collection(collection.ACCOUNT_NAME).insertOne(accountObj2);
  });

  after(async () => {
    await db.collection(collection.ACCOUNT_NAME).deleteMany({});
  });

  it ('should fail because username is taken', async () => {
    const obj = Object.assign({}, accountObj);
    obj.username = accountObj2.username;

    const response = await supertest(fastify.server)
      .patch(`/account/${accountId}`)
      .send(obj)
      .expect(400);
    response.body.message.should.equal('Username already in use.');
  });

  it ('should fail because email is taken', async () => {
    const obj = Object.assign({}, accountObj);
    obj.email = accountObj2.email;

    const response = await supertest(fastify.server)
      .patch(`/account/${accountId}`)
      .send(obj)
      .expect(400);
    response.body.message.should.equal('Email already in use.');
  });

  it ('should fail account not found', async () => {
    const obj = Object.assign({}, accountObj);
    obj.email = accountObj2.email;

    const response = await supertest(fastify.server)
      .patch('/account/5bec458d3c6e771ca9a5a6e5')
      .send(obj)
      .expect(404);
    response.body.message.should.equal('Account not found');
  });

  it('should successfully update an account', async () => {
    let obj = Object.assign({}, accountObj);
    obj = {
      firstName: 'New',
      username: 'newusername',
      email: 'new@test.com'
    };

    const response = await supertest(fastify.server)
      .patch(`/account/${accountId}`)
      .send(obj)
      .expect(200);

    response.body.should.have.only.property('data');

    const data = response.body.data;

    data.should.have.only.properties([
      '_id',
      'firstName',
      'username',
      'email'
    ]);

    data.should.have.property('firstName', obj.firstName);
    data.should.have.property('username', obj.username);
    data.should.have.property('email', obj.email);
  });
});