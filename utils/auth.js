const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getSalt = () => bcrypt.genSaltSync(10);

const getHash = (text, salt) => {
  const lclSalt = (!salt) ? bcrypt.genSaltSync(10) : salt;
  return bcrypt.hashSync(text, lclSalt);
};

const isValid = (text, hash) => {
  if (!text || !hash) return false;
  return bcrypt.compareSync(text, hash);
};

const getSessionInfo = async (req, cache) => {
  const { authorization } = req.headers;

  // Fetch the value from the header
  if (authorization == undefined) return {};

  const token = authorization.replace('Bearer', '').trim();
  const tokenInfo = await cache.get(token);

  if (!tokenInfo) return {};

  const { salt } = JSON.parse(tokenInfo);
  const decoded = jwt.verify(token, salt);
  return decoded;
};

module.exports = {
  getHash,
  isValid,
  getSalt,
  getSessionInfo,
};
