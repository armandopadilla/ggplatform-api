const Boom = require('boom');

const error = (errorMessage, statusCode) => {
  // Log things here.
  // @todo fastify.log.error(errorMessage);

  if (statusCode === 404) return Boom.notFound(errorMessage);
  if (statusCode === 401) return Boom.unauthorized(errorMessage);
  if (statusCode === 400) return Boom.badRequest(errorMessage);
  return Boom.badImplementation(errorMessage);
};

const success = (data) => ({ data, });

module.exports = {
  error,
  success,
};
