const ObjectId = require('mongodb').ObjectId;
const should = require('should');
const supertest = require('supertest');
const fastify = require('../../../server');
const { db: collection } = require('../../../config/index');

describe ('Leave Contest', () => {

  let db;
  let contestId;
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
  let accountId ;
  let accountObj = {
    firstName: 'TEST_FIRST_NAME',
    username: 'TEST_USERNAME',
    email: 'mandopadilla81@gmail.com',
    password: 'TEST_PASSWORD',
    dob: '1981-03-10',
    acceptedTerms: 'yes',
    phone: '323-123-3456',
  };

  let walletId;
  let walletObj = {
    ownerId: null,
    balance: 100.00,
    currency: 'USD',
    createdDate: new Date(),
    updateDate: new Date(),
  }

  beforeEach( async () => {
    await fastify.ready();
    db = fastify.mongo.db;

    const account = await db.collection(collection.ACCOUNT_NAME).insertOne(accountObj);
    accountId = account.ops[0]._id;

    const contest = await db.collection(collection.CONTEST_NAME).insertOne(contestObj);
    contestId = contest.ops[0]._id;

    walletObj.ownerId = accountId;
    const wallet = await db.collection(collection.WALLET_NAME).insertOne(walletObj);
    walletId = wallet.ops[0]._id;

  });

  afterEach(async () => {
    await db.collection(collection.CONTEST_NAME).deleteMany({});
    await db.collection(collection.ACCOUNT_NAME).deleteMany({});
    await db.collection(collection.WALLET_NAME).deleteMany({});
  });

  it ('should fail required parameters not present.', async () => {
    const response = await supertest(fastify.server)
      .post(`/contest/${contestId}/leave`)
      .send({})
      .expect(400);

    response.body.message.should.equal('body should have required property \'userId\'');
  });


  it ('should fail, Invalid Contest Id.', async () => {
    const response = await supertest(fastify.server)
      .post('/contest/12313/leave')
      .send({
        userId: '123123123'
      })
      .expect(400);

    response.body.message.should.equal('Invalid Contest Id');
  });

  it ('should fail, Invalid User Id.', async () => {
    const response = await supertest(fastify.server)
      .post(`/contest/${contestId}/leave`)
      .send({
        userId: '123123'
      })
      .expect(400);

    response.body.message.should.equal('Invalid User Id');
  });

  it ('should fail, contest is not found.', async () => {
    const response = await supertest(fastify.server)
      .post(`/contest/5bf1d4c5f5149a1fb4f8a3ff/leave`)
      .send({
        userId: accountId
      })
      .expect(404);

    response.body.message.should.equal('Contest not found');
  });

  it ('should fail, contest is not found.', async () => {
    const response = await supertest(fastify.server)
      .post(`/contest/${contestId}/leave`)
      .send({
        userId: '5bf1d4c5f5149a1fb4f8a3ff'
      })
      .expect(404);

    response.body.message.should.equal('Account not found');
  });


  it ('should pass, successfully credit the wallet and deduct from pot.', async () => {
    // Join the Contest
    let response = await supertest(fastify.server)
      .post(`/contest/${contestId}/join`)
      .send({
        userId: accountId
      })
      .expect(200);

    // Check the Pot, wallet
    let wallet = await db.collection(collection.WALLET_NAME).findOne({
      ownerId: ObjectId(accountId)
    });

    let contest = await db.collection(collection.CONTEST_NAME).findOne({
      _id: ObjectId(contestId)
    });

    wallet.balance.should.be.equal(walletObj.balance - contestObj.entryFee);
    contest.pot.should.be.equal(contestObj.entryFee);

    response = await supertest(fastify.server)
      .post(`/contest/${contestId}/leave`)
      .send({
        userId: accountId
      })
      .expect(200);

    // Check if the wallet and pots were updated
    // Check the Pot, wallet
    wallet = await db.collection(collection.WALLET_NAME).findOne({
      ownerId: ObjectId(accountId)
    });

    contest = await db.collection(collection.CONTEST_NAME).findOne({
      _id: ObjectId(contestId)
    });

    wallet.balance.should.be.equal(walletObj.balance);
    contest.pot.should.be.equal(0);
  });
});