const getContest = require('./getContest');
const getContests = require('./getContests');
const postCreateContest = require('./postCreateContest');
const patchUpdateContest = require('./patchUpdateContest');
const deleteRemoveContest = require('./deleteRemoveContest');
const postJoin = require('./postJoin');
const postLeave = require('./postLeave');

module.exports = (fastify, opt, next) => {
  getContest(fastify);
  getContests(fastify);
  postCreateContest(fastify);
  patchUpdateContest(fastify);
  deleteRemoveContest(fastify);
  postJoin(fastify);
  postLeave(fastify);
  next();
}