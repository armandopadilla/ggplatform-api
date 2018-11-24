const should = require('should');
const supertest = require('supertest');
const fastify = require('../../../server');
const { db: collection } = require('../../../config/index');

describe ('Create Bet Bucket', () => {

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
    betBuckets: []
  };
  let betBucketObj = {
    title: 'TEST BUCKET TITLE',
    description: 'TEST BUCKET DESC',
    minEntryFee: 5
  };

  before( async () => {
    await fastify.ready();
    db = fastify.mongo.db;

    const contest =  await db.collection(collection.CONTEST_NAME).insertOne(contestObj);
    contestId = contest.ops[0]._id;
  });

  after(async () => {
    await db.collection(collection.CONTEST_NAME).deleteMany({ });
  });

  it ('should fail when required parameters are not present.', async () => {
    // Missing title
    let obj = Object.assign({}, betBucketObj);
    delete obj.title;

    let response = await supertest(fastify.server)
      .post(`/contest/${contestId}/betbucket`)
      .send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'title\'');

    // Missing description
    obj = Object.assign({}, betBucketObj);
    delete obj.description;

    response = await supertest(fastify.server)
      .post(`/contest/${contestId}/betbucket`)
      .send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'description\'');

    // Missing minEntryFee
    obj = Object.assign({}, betBucketObj);
    delete obj.minEntryFee;

    response = await supertest(fastify.server)
      .post(`/contest/${contestId}/betbucket`)
      .send(obj)
      .expect(400);
    response.body.message.should.equal('body should have required property \'minEntryFee\'');
  });

  it ('should fail, invalid contest id', async () => {
    let response = await supertest(fastify.server)
      .post('/contest/123/betbucket')
      .send(betBucketObj).expect(400);
    response.body.message.should.equal('Invalid Contest Id.');
  });

  it ('should fail, contest not found.', async () => {
    let response = await supertest(fastify.server)
      .post('/contest/53fbf4615c3b9f41c381b6a3/betbucket')
      .send(betBucketObj).expect(404);
    response.body.message.should.equal('No Contest Found.');
  });

  it('should successfully add 2 bet buckets into a contest.', async () => {
    let response = await supertest(fastify.server)
      .post(`/contest/${contestId}/betbucket`)
      .send(betBucketObj)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.only.property('data');
    response.body.data.should.be.an.Object();

    // Check of the contest not has the property on the response.
    response = await supertest(fastify.server)
      .get(`/contest/${contestId}`)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.only.property('data');
    const data = response.body.data;
    data.should.have.property('betBuckets');
    data.betBuckets.should.have.size(1);

    const bucket = data.betBuckets[0];
    bucket.should.have.property('title', betBucketObj.title);
    bucket.should.have.property('description', betBucketObj.description);
    bucket.should.have.property('minEntryFee', betBucketObj.minEntryFee);
  });

});