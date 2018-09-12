const getContest = require('./getContest');
const getContests = require('./getContests');
const postCreateContest = require('./postCreateContest');
const patchUpdateContest = require('./patchUpdateContest');
const deleteRemoveContest = require('./deleteRemoveContest');
const postJoin = require('./postJoin');
const postLeave = require('./postLeave');

module.exports = (fastify, opt, next) => {

  // GET - /contest/:contestId
  getContest(fastify);

  // GET - /contest/list
  getContests(fastify);

  // POST - /contest
  postCreateContest(fastify);

  // PATCH - /contest/:contestId
  patchUpdateContest(fastify);

  // DELETE - /contest/:contestId
  deleteRemoveContest(fastify);

  // POST - /contest/:contestId/join
  postJoin(fastify);

  // POST - /contest/:contestId/leave
  postLeave(fastify);

  next();
};