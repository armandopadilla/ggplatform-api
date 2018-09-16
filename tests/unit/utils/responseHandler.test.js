const should = require('should');
const { response } = require('../../../utils');

describe('responseHandler Test Suite', () => {

  it ('should proper JSON format with no data', () => {
    const res = response.success({});
    res.should.be.deepEqual({ data: {} });
  });

  it ('should proper JSON format with data', () => {
    const userObj = {
      user: {
        id: 1
      }
    };

    const res = response.success(userObj);
    res.should.be.deepEqual({ data: userObj });
  });

  it ('should return a 404 and a custom message', () => {
    const res = response.error('Not Found Test', 404);
    const { output } = res;
    output.payload.should.deepEqual({ statusCode: 404, error: 'Not Found', message: 'Not Found Test' });
  });

  it ('should return a 401 and a custom message', () => {
    const res = response.error('Invalid User', 401);
    const { output } = res;
    output.payload.should.deepEqual({ statusCode: 401, error: 'Unauthorized', message: 'Invalid User' });
  });

  it ('should return a 400 and a custom message', () => {
    const res = response.error('Missing value 123', 400);
    const { output } = res;
    output.payload.should.deepEqual({ statusCode: 400, error: 'Bad Request', message: 'Missing value 123' });
  });

  it ('should return a 500 and internal error for a general error', () => {
    const res = response.error('Something bad happened');
    const { output } = res;
    output.payload.should.deepEqual({ statusCode: 500, error: 'Internal Server Error', message: 'An internal server error occurred' });
  });

});