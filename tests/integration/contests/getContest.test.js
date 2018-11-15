const should = require('should');
const supertest = require('supertest');
const fastify = require('../../../server');
const { db: collection } = require('../../../config/index');

describe ('Get Contest', () => {

  let db;
  let contestId;
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
    const contest =  await db.collection(collection.CONTEST_NAME).insertOne(contestObj);
    contestId = contest.ops[0]._id;
  });

  after(async () => {
    await db.collection(collection.CONTEST_NAME).deleteMany({ });
  });

  it('should return contest info with correct response payload', async () => {
    const response = await supertest(fastify.server)
      .get(`/contest/${contestId}`)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.only.property('data');
    response.body.data.should.have.property('title', contestObj.title);
    response.body.data.should.have.property('startDateTime');
    response.body.data.should.have.property('endDateTime');
    response.body.data.should.have.property('pot', contestObj.pot);
    response.body.data.should.have.property('streamURL', contestObj.streamURL);
    response.body.data.should.have.property('status', contestObj.status);
    response.body.data.should.have.property('_id');
  });

  it('should fail do to invalid id', async () => {
    const response = await supertest(fastify.server)
      .get(`/contest/123`)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.property('statusCode', 400);
    response.body.should.have.property('error', 'Bad Request');
    response.body.should.have.property('message', 'Invalid Contest Id');
  });

  it('should return 404, no contest found.', async () => {
    const response = await supertest(fastify.server)
      .get('/contest/53fbf4615c3b9f41c381b6a3')
      .expect(404)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.property('statusCode', 404);
    response.body.should.have.property('error', 'Not Found');
    response.body.should.have.property('message', 'Contest not found');
  });

});