const getUser = require('./routes/getUser');
const getUsers = require('./routes/getUsers');
const postCreateUser = require('./routes/postCreateUser');
const patchUpdateUser = require('./routes/patchUpdateUser');
const deleteUser = require('./routes/deleteSoftDeleteUser');

module.exports = (fastify, options, next) => {

  // GET /user/:userId
  getUser(fastify);

  // GET  /user/list
  getUsers(fastify);

  // POST /user
  postCreateUser(fastify);

  // PATCH /user
  patchUpdateUser(fastify);

  // PATCH - /user
  deleteUser(fastify);

  next();
};