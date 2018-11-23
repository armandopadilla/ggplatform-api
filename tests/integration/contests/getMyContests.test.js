const should = require('should');
const supertest = require('supertest');
const fastify = require('../../../server');
const { db: collection } = require('../../../config/index');

describe ('Get My Contests', () => {

  let db;
  let contestObj = {
    title: 'CONTEST',
    startDateTime: new Date(),
    endDateTime: new Date(),
    pot: 0,
    streamURL: 'https://www.twitch.tv/riotgames',
    status: 'active',
    entryFee: 35,
    participants: []
  };

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

    // Add account
    const account =  await db.collection(collection.ACCOUNT_NAME).insertOne(accountObj);
    accountId = account.ops[0]._id;

    for(let i=0; i<12; i++){
      const newContest = Object.assign({}, contestObj);
      newContest.title = newContest.title+'_'+i;
      newContest.participants.push(accountId.toString());
      await db.collection(collection.CONTEST_NAME).insertOne(newContest);
    }
  });

  after(async () => {
    await db.collection(collection.CONTEST_NAME).deleteMany({});
    await db.collection(collection.ACCOUNT_NAME).deleteMany({});
  });

  it('should fail do to, invalid account id', async () => {
    const response = await supertest(fastify.server)
      .get('/contest/my-contests?userId=123123')
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.property('statusCode', 400);
    response.body.should.have.property('error', 'Bad Request');
    response.body.should.have.property('message', 'Invalid User Id');
  });

  it('should fail do to account not found.', async () => {
    const response = await supertest(fastify.server)
      .get(`/contest/my-contests?userId=53fbf4615c3b9f41c381b6a3`)
      .expect(404)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.property('statusCode', 404);
    response.body.should.have.property('error', 'Not Found');
    response.body.should.have.property('message', 'Account not found.');
  });

  it('should return contests in correct response payload', async () => {
    const response = await supertest(fastify.server)
      .get(`/contest/my-contests?userId=${accountId}`)
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
    data[0].should.have.property('title', contestObj.title+'_0');
    data[0].should.have.property('streamURL', contestObj.streamURL);
    data[0].should.have.property('status', contestObj.status);
    data[0].should.have.property('_id');
    data[0].should.have.property('startDateTime');
    data[0].should.have.property('endDateTime');
    data[0].should.have.property('pot');


    // Check _meta property (used in pagination)
    const meta = response.body._meta;
    meta.should.have.property('total', 12);
  });

  it('should return an empty array, no contests', async () => {
    await db.collection(collection.CONTEST_NAME).deleteMany({});

    const response = await supertest(fastify.server)
      .get(`/contest/my-contests?userId=${accountId}`)
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