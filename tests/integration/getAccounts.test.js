const should = require('should');
const supertest = require('supertest');
const fastify = require('../../server');
const { db: collection } = require('../../config');

xdescribe ('Get Accounts', () => {

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
    await db.collection(collection.ACCOUNT_NAME).deleteMany({});
  });

  it('should return accounts in correct response payload', async () => {
    const response = await supertest(fastify.server)
      .get('/account/list')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    // Check structure.
    response.body.should.have.property('data').which.is.an.Array();
    response.body.should.have.property('_meta');

    // Check data properties
    const data = response.body.data;

    // Check the size
    data.should.have.size(12);

    // Check the first index has correct structure and data.
    data[0].should.have.property('username', accountObj.username+'_0');
    data[0].should.have.property('firstName', accountObj.firstName+'_0');
    data[0].should.have.property('email', accountObj.email);
    data[0].should.have.property('dob', accountObj.dob);
    data[0].should.have.property('acceptTerms', accountObj.acceptTerms);
    data[0].should.have.property('_id');

    // Check _meta property (used in pagination)
    const meta = response.body._meta;
    meta.should.have.property('total', 12);
  });

  it('should return an empty array, no users', async () => {
    await db.collection(collection.ACCOUNT_NAME).deleteMany({});

    const response = await supertest(fastify.server)
      .get('/account/list')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    // Check data properties
    const data = response.body.data;

    // Check the size
    data.should.have.size(0);

    // Check _meta property (used in pagination)
    const meta = response.body._meta;
    meta.should.have.property('total', 0);
  })

});