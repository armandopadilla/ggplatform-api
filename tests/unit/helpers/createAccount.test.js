const should = require('should');
const {
  hasEmailOrPhone,
  isValidAge
} = require('../../../helpers/createAccount');
const bcrypt = require('bcryptjs');

describe ('CreateAccount Helpers Suite', () => {
  describe ('hasEmailOrPhone', () => {

    it ('should pass with email present', () => {
      hasEmailOrPhone('email@email.com').should.be.true();
    });

    it ('should pass with phone present', () => {
      hasEmailOrPhone(null, '323-388-7056').should.be.true();
    });

    it ('should fail. Email or password not set.', () => {
      hasEmailOrPhone().should.be.false();
    });
  });


  describe ('isValidAge', () => {
    it ('should pass valid age', () => {
      isValidAge('1981/10/03').should.be.true();
    });

    it ('should pass, user is 18', () => {
      isValidAge('2000/10/03').should.be.true();
    });

    it ('should not pass, user too young', () => {
      isValidAge('2012/10/03').should.be.false();
    });
  });
});
