const should = require('should');
const supertest = require('supertest');
const fastify = require('../../../server');
const { db: collection } = require('../../../config/index');

describe ('Update Contest', () => {

  let db;
  let contestId;
  let contestObj = {
    title: 'CONTEST',
    startDateTime: new Date(),
    endDateTime: new Date(),
    pot: 0,
    streamURL: 'https://www.twitch.tv/riotgames',
    status: 'active',
    entryFee: 35
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

  it('should successfully update a contest and return correct payload.', async () => {
    const newObj = Object.assign({}, contestObj);
    newObj.title = 'CONTEST_2';
    newObj.streamURL = 'http://www.armando.ws';
    newObj.status = 'pending';

    const response = await supertest(fastify.server)
      .patch(`/contest/${contestId}`)
      .send(newObj)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.only.property('data');
    const data = response.body.data;

    data.should.have.property('title', newObj.title);
    data.should.have.property('startDateTime');
    data.should.have.property('endDateTime');
    data.should.have.property('streamURL', newObj.streamURL);
    data.should.have.property('status', newObj.status);
  });

  it ('should fail when required parameters are not present.', async () => {
    // Missing title
    let obj = Object.assign({}, contestObj);
    delete obj.title;

    let response = await supertest(fastify.server).patch(`/contest/${contestId}`).send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'title\'');

    // Missing startDateTime
    obj = Object.assign({}, contestObj);
    delete obj.startDateTime;

    response = await supertest(fastify.server).patch(`/contest/${contestId}`).send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'startDateTime\'');

    // Missing endDateTime
    obj = Object.assign({}, contestObj);
    delete obj.endDateTime;

    response = await supertest(fastify.server).patch(`/contest/${contestId}`).send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'endDateTime\'');

    // Missing streamURL
    obj = Object.assign({}, contestObj);
    delete obj.streamURL;

    response = await supertest(fastify.server).patch(`/contest/${contestId}`).send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'streamURL\'');
  });

  it('should fail do to invalid id', async () => {
    const response = await supertest(fastify.server)
      .patch('/contest/123')
      .expect(400)
      .send(contestObj)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.property('statusCode', 400);
    response.body.should.have.property('error', 'Bad Request');
    response.body.should.have.property('message', 'Invalid Contest Id');
  });

  it('should return 404, no contest found.', async () => {
    const response = await supertest(fastify.server)
      .patch('/contest/53fbf4615c3b9f41c381b6a3')
      .send(contestObj)
      .expect(404)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.property('statusCode', 404);
    response.body.should.have.property('error', 'Not Found');
    response.body.should.have.property('message', 'Could not update contest. Contest not found.');
  });

});