// Save the user to the local db
// Fetch the user by id
// Check the data is correct
// Check the payload is correct

const should = require('should');
const fastify = require('../../server');
const { db: collection } = require('../../config');


describe ('Get Account', () => {

  before( () => {
    fastify.inject({}, (err, response) => {
      console.log("mongo", fastify.mongo);
      const db = fastify.mongo.db;
      const accountObj = {
        firstName: 'TEST_FIRST_NAME',
        username: 'TEST_USERNAME',
        email: 'TEST@test.com',
        password: 'TEST_PASSWORD',
        dob: '10/03/1981',
        acceptTerms: 'yes'
      };

      // Create account
      const account =  db.collection(collection.ACCOUNT_NAME).insertOne(accountObj);
    });
  })

  after(() => {
    //db.collection(collection.ACCOUNT_NAME).remove({ username: 'TEST_USERNAME'});
    fastify.close()
  });

  it('return account info', () => {
    fastify.inject({
      method: 'GET',
      url: '/account/123'
    }, (err, response) => {
      //console.log(fastify.mongo);
      //console.log(err);
      //console.log(response);
    })
  });
});