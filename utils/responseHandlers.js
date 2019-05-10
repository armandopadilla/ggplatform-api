const Boom = require('boom');

const error = (errorMessage, statusCode) => {
  // Log things here.
  // @todo fastify.log.error(errorMessage);

  if (statusCode === 404) return Boom.notFound(errorMessage);
  if (statusCode === 401) return Boom.unauthorized(errorMessage);
  if (
    statusCode === 400 ||
    errorMessage.toString().indexOf('Not enough funds') > -1 ||
    errorMessage.toString().indexOf('User already a participant') > -1 ||
    errorMessage.toString().indexOf('amount must') > -1
  ) return Boom.badRequest(errorMessage);
  if (errorMessage.toString().indexOf('Invalid APP') > -1) {
    return Boom.badRequest(errorMessage);
  }

  return Boom.badImplementation(errorMessage);
};

const success = (data, total) => {
  const response = { data };

  if (total > -1) response._meta = { total };

  return response;
};

module.exports = {
  error,
  success,
};
