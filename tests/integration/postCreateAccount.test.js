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
    email: 'mandopadilla81@gmail.com',
    password: 'TEST_PASSWORD',
    dob: '1981-03-10',
    acceptedTerms: 'yes',
    phone: '323-123-3456',
  };

  before( async () => {
    await fastify.ready();
    db = fastify.mongo.db;
  });

  afterEach(async () => {
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

    // Missing email or phone
    obj = Object.assign({}, accountObj);
    delete obj.email;
    delete obj.phone;

    response = await supertest(fastify.server).post('/account').send(obj).expect(400);
    response.body.message.should.equal('email or phone required.');

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

    // Terms not accepted
    obj = Object.assign({}, accountObj);
    obj.acceptedTerms = 'no';

    response = await supertest(fastify.server).post('/account').send(obj).expect(400);
    response.body.message.should.equal('Terms have not be accepted.');

    // User too young
    obj = Object.assign({}, accountObj);
    obj.dob = '2012-10-03';

    response = await supertest(fastify.server).post('/account').send(obj).expect(400);
    response.body.message.should.equal('User is too young.');
  });

  it('should successfully save an account', async () => {
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
    wallet.should.have.only.properties(['ownerId', 'balance', 'currency', 'createdDate', 'updateDate', '_id']);
    wallet.should.have.property('balance', 0);
    wallet.should.have.property('currency', 'USD');
  });

  it ('should fail, username already in use', async () => {
    let response = await supertest(fastify.server)
      .post('/account')
      .send(accountObj)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    const newUser = Object.assign({}, accountObj);
    response = await supertest(fastify.server)
      .post('/account')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8');
    response.body.message.should.equal('Username already in use.');
  });

  it ('should fail, email already in use.', async () => {
    let response = await supertest(fastify.server)
      .post('/account')
      .send(accountObj)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    const newUser = Object.assign({}, accountObj);
    newUser.username = 'newuser123';
    response = await supertest(fastify.server)
      .post('/account')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8');
    response.body.message.should.equal('Email already in use.');
  });
});