const should = require('should');
const supertest = require('supertest');
const fastify = require('../../../server');
const { db: collection } = require('../../../config/index');

describe ('Create Contest', () => {

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
  });

  after(async () => {
    await db.collection(collection.CONTEST_NAME).deleteMany({ });
  });

  it('should successfully create contest and return correct payload.', async () => {
    const response = await supertest(fastify.server)
      .post('/contest')
      .send(contestObj)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    response.body.should.have.only.property('data');
    const data = response.body.data;

    data.should.have.property('title', contestObj.title);
    data.should.have.property('startDateTime');
    data.should.have.property('endDateTime');
    data.should.have.property('pot', contestObj.pot);
    data.should.have.property('streamURL', contestObj.streamURL);
    data.should.have.property('status', contestObj.status);
    data.should.have.property('entryFee', contestObj.entryFee);
    data.should.have.property('_id');
  });

  it ('should fail when required parameters are not present.', async () => {
    // Missing title
    let obj = Object.assign({}, contestObj);
    delete obj.title;

    let response = await supertest(fastify.server).post('/contest').send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'title\'');

    // Missing startDateTime
    obj = Object.assign({}, contestObj);
    delete obj.startDateTime;

    response = await supertest(fastify.server).post('/contest').send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'startDateTime\'');

    // Missing endDateTime
    obj = Object.assign({}, contestObj);
    delete obj.endDateTime;

    response = await supertest(fastify.server).post('/contest').send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'endDateTime\'');

    // Missing streamURL
    obj = Object.assign({}, contestObj);
    delete obj.streamURL;

    response = await supertest(fastify.server).post('/contest').send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'streamURL\'');

    // Missing entryFee
    obj = Object.assign({}, contestObj);
    delete obj.entryFee;

    response = await supertest(fastify.server).post('/contest').send(obj).expect(400);
    response.body.message.should.equal('body should have required property \'entryFee\'');
  });

});