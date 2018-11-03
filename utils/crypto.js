const crypto = require('crypto');

const encrypt = (data, password) => {
  try {
    var cipher = crypto.createCipher('aes-256-cbc', password);
    return Buffer.concat([cipher.update(new Buffer(JSON.stringify(data), "base64")), cipher.final()]);
  } catch (exception) {
    throw new Error(exception.message);
  }
};

const decrypt = (data, password) => {
  try {
    var decipher = crypto.createDecipher("aes-256-cbc", password);
    var decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString();
  } catch (exception) {
    throw new Error(exception.message);
  }
}

module.exports = {
  encrypt,
  decrypt,
};