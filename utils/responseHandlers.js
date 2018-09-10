const Boom = require('boom');

const error = (error, statusCode) => {
  //Log things here.
  console.log(error);

  if (statusCode === 404) return Boom.notFound(error);
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
