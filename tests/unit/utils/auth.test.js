const should = require('should');
const { auth } = require('../../../utils');
const bcrypt = require('bcrypt');

describe ('Utils Auth Test Suite', () => {
  describe ('auth tests', () => {

    it ('should return a random string', () => {
      auth.getSalt().should.not.be.empty();
    });

    it ('should return a encrypted string using no salt', () => {
      const hash = auth.getHash('test');
      hash.should.not.be.empty();
      hash.should.not.be.equal('test');
    });

    it ('should return a encrypted string using a salt', () => {
      const string = 'test';
      const salt = bcrypt.genSaltSync(10);
      const localHash = bcrypt.hashSync(string, salt);
      const hash = auth.getHash(string, salt);

      hash.should.not.be.empty();
      hash.should.not.be.equal(string);
      hash.should.equal(localHash);
    });

    it ('should return false, text and stored hash not equal', () => {
      const hash = auth.getHash('test');
      const isValid = auth.isValid('test1', hash);
      isValid.should.be.equal(false);
    });

    it ('should return true, text and stored hash equal', () => {
      const hash = auth.getHash('test');
      const isValid = auth.isValid('test', hash);
      isValid.should.be.equal(true);
    });

    it ('should return false, empty string to compare', () => {
      const hash = auth.getHash('test');
      const isValid = auth.isValid('', hash);
      isValid.should.be.equal(false);
    })

  });
});
