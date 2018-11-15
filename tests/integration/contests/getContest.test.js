const should = require('should');
const supertest = require('supertest');
const fastify = require('../../../server');
const { db: collection } = require('../../../config/index');

describe ('Get Contests', () => {

  let db;
  let contestObj = {
    title: 'CONTEST',
    startDateTime: new Date(),
    endDateTime: new Date(),
    pot: 0,
    streamURL: 'https://www.twitch.tv/riotgames',
    status: 'active'
  };

  before( async () => {
    await fastify.ready();

    db = fastify.mongo.db;

    for(let i=0; i<12; i++){
      const newContest = Object.assign({}, contestObj);
      newContest.title = newContest.title+'_'+i;
      await db.collection(collection.CONTEST_NAME).insertOne(newContest);
    }
  });

  after(async () => {
    await db.collection(collection.CONTEST_NAME).deleteMany({});
  });

  it('should return contests in correct response payload', async () => {
    const response = await supertest(fastify.server)
      .get('/contest/list')
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
      .get('/contest/list')
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