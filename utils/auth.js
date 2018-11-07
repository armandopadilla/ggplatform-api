const bcrypt = require('bcryptjs');

const getSalt = () => bcrypt.genSaltSync(10);

const getHash = (text, salt) => {
  const lclSalt = (!salt) ? bcrypt.genSaltSync(10) : salt;
  return bcrypt.hashSync(text, lclSalt);
};

const isValid = (text, hash) => {
  if (!text || !hash) return false;
  return bcrypt.compareSync(text, hash);
};

module.exports = {
  getHash,
  isValid,
  getSalt,
};
