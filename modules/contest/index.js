const getContest = require('./routes/getContest');
const getContests = require('./routes/getContests');
const postCreateContest = require('./routes/postCreateContest');
const patchUpdateContest = require('./routes/patchUpdateContest');
const deleteRemoveContest = require('./routes/deleteRemoveContest');
const postJoin = require('./routes/postJoin');
const postLeave = require('./routes/postLeave');

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