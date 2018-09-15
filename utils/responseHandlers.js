const Boom = require('boom');

const error = (error, statusCode) => {
  //Log things here.
  fastify.log.error(error);

  if (statusCode === 404) return Boom.notFound(error);
  if (statusCode === 401) return Boom.unauthorized(error);
  if (statusCode === 400) return Boom.badRequest(error);
  return Boom.badImplementation(error);
};

const success = (data) => {
  return {
    data
  }
};

module.exports = {
  error,
  success
};
