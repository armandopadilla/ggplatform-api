const postInvite = require('./routes/postInvite');

module.exports = (fastify, options, next) => {

  // POST /invite
  postInvite(fastify);

  next();

};