var bcrypt = require('bcrypt');

const getHash = (text) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(text, salt);
};

const isValid = (text, hash) => bcrypt.compareSync(text, hash);

module.exports = {
  getHash,
  isValid,
}