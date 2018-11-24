const should = require('should');
const supertest = require('supertest');
const fastify = require('../../../server');
const { db: collection } = require('../../../config/index');

describe ('Get Bet Buckets', () => {

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

  let betBuckets = [];
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

    for(let i=0; i<2; i++){
      const newBucket = Object.assign({}, betBucketObj);
      newBucket.title = betBucketObj.title+'_'+i;
      newBucket.contestId = contestId;
      const bucket = await db.collection(collection.BETBUCKET_NAME).insertOne(newBucket);
    }
  });

  after(async () => {
    await db.collection(collection.CONTEST_NAME).deleteMany({});
    await db.collection(collection.BETBUCKET_NAME).deleteMany({});
  });

  it('should return bet buckets in correct response payload', async () => {
    const response = await supertest(fastify.server)
      .get(`/contest/${contestId}/betbucket/list`)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    // Check structure.
    response.body.should.have.property('data').which.is.an.Array();
    response.body.should.have.property('_meta');

    // Check data properties
    const data = response.body.data;

    // Check the size
    data.should.have.size(2);

    // Check the first index has correct structure and data.
    data[0].should.have.property('title', betBucketObj.title+'_0');
    data[0].should.have.property('description', betBucketObj.description);
    data[0].should.have.property('minEntryFee', betBucketObj.minEntryFee);
    data[0].should.have.property('status', betBucketObj.status);
    data[0].should.have.property('_id');
    data[0].should.have.property('createdDateTime');
    data[0].should.have.property('updatedDateTime');
    data[0].should.have.property('participants');


    // Check _meta property (used in pagination)
    const meta = response.body._meta;
    meta.should.have.property('total', 2);
  });

  it('should return an empty array, no contests', async () => {
    await db.collection(collection.BETBUCKET_NAME).deleteMany({});

    const response = await supertest(fastify.server)
      .get(`/contest/${contestId}/betbucket/list`)
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