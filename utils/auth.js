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
  if (authorization == undefined) return Promise.resolve({});

  const tokenRaw = authorization.replace('Bearer', '').trim();
  const tokenData = await cache.getAsync(tokenRaw);

  if (!tokenData) return {};

  const { salt, token } = JSON.parse(tokenData);

  try {
    const decoded = await jwt.verify(token, salt);
    return decoded;
  } catch(e){
    console.log(e);
    return {}
  }


};

module.exports = {
  getHash,
  isValid,
  getSalt,
  getSessionInfo,
};
