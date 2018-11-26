const should = require('should');
const supertest = require('supertest');
const fastify = require('../../../server');
const { db: collection } = require('../../../config/index');

describe ('Update Bet Buckets', () => {

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
  };

  let betBucketId;
  let betBucketObj = {
    title: 'TEST BUCKET TITLE',
    description: 'TEST BUCKET DESC',
    minEntryFee: 5,
    participants: [],
    status: 'open',
    createdDateTime: new Date(),
    updatedDateTime: new Date()
  };

  before( async () => {
    await fastify.ready();

    db = fastify.mongo.db;

    const contest = await db.collection(collection.CONTEST_NAME).insertOne(contestObj);
    contestId = contest.ops[0]._id;

    betBucketObj.contestId = contestId;
    const bucket = await db.collection(collection.BETBUCKET_NAME).insertOne(betBucketObj);
    betBucketId = bucket.ops[0]._id;
    console.log(betBucketId);
  });

  after(async () => {
    await db.collection(collection.CONTEST_NAME).deleteMany({});
    await db.collection(collection.BETBUCKET_NAME).deleteMany({});
  });

  it ('should fail, invalid contest id', async () => {
    let response = await supertest(fastify.server)
      .patch('/contest/123/betbucket/123')
      .send(betBucketObj)
      .expect(400);
    response.body.message.should.equal('Invalid Contest Id.');
  });

  it ('should fail, invalid bet bucket id', async () => {
    let response = await supertest(fastify.server)
      .patch(`/contest/${contestId}/betbucket/123`)
      .send(betBucketObj).expect(400);
    response.body.message.should.equal('Invalid Bet Bucket Id.');
  });

  it ('should fail, contest not found.', async () => {
    let response = await supertest(fastify.server)
      .patch('/contest/53fbf4615c3b9f41c381b6a3/betbucket/53fbf4615c3b9f41c381b6a3')
      .send(betBucketObj).expect(404);
    response.body.message.should.equal('No Contest Found.');
  });

  it ('should fail, bet bucket not found.', async () => {
    let response = await supertest(fastify.server)
      .patch(`/contest/${contestId}/betbucket/53fbf4615c3b9f41c381b6a3`)
      .send(betBucketObj).expect(404);
    response.body.message.should.equal('No bet bucket found.');
  });

  it('should successfully update a bet bucket.', async () => {
    const updatedBucketData = Object.assign({}, betBucketObj);
    updatedBucketData.title = 'Updated Title';
    updatedBucketData.description = 'Updated Description';
    updatedBucketData.minEntryFee = 100;
    delete updatedBucketData._id;


    const response = await supertest(fastify.server)
      .patch(`/contest/${contestId}/betbucket/${betBucketId}`)
      .send(updatedBucketData)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    // Check structure.
    response.body.should.have.property('data').which.is.an.Object();

    // Check data properties
    const data = response.body.data;

    const updateData = await db.collection(collection.BETBUCKET_NAME).findOne({
      _id: betBucketId
    });

    updateData.should.have.property('title', updatedBucketData.title);
    updateData.should.have.property('description', updatedBucketData.description);
    updateData.should.have.property('minEntryFee', updatedBucketData.minEntryFee);
  });
});